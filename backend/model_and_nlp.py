import pandas as pd
import numpy as np
import re
from nltk.tokenize import word_tokenize
from nltk import pos_tag
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import SVC
from maps import symptom_mapping

df = pd.read_csv("Testing.csv")
X = df.drop("prognosis", axis=1)
y = df["prognosis"]
symptom_columns = X.columns.tolist()

rf_model = RandomForestClassifier(n_estimators=200, random_state=42, max_depth=10)
nb_model = MultinomialNB(alpha=0.1)
svm_model = SVC(kernel="rbf", probability=True, random_state=42, C=1.0)

rf_model.fit(X, y)
nb_model.fit(X, y)
svm_model.fit(X, y)

ensemble_model = VotingClassifier(
    estimators=[("rf", rf_model), ("nb", nb_model), ("svm", svm_model)],
    voting="soft"
)
ensemble_model.fit(X, y)

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words("english"))

def get_wordnet_pos(tag):
    if tag.startswith("J"):
        return "a"
    elif tag.startswith("V"):
        return "v"
    elif tag.startswith("N"):
        return "n"
    elif tag.startswith("R"):
        return "r"
    else:
        return "n"

def clean_and_lemmatize(text):
    text = re.sub(r"[^a-zA-Z\s]", "", text.lower())
    tokens = word_tokenize(text)
    tagged = pos_tag(tokens)
    
    lemmatized = []
    for word, tag in tagged:
        if word not in stop_words:
            lemma = lemmatizer.lemmatize(word, get_wordnet_pos(tag))
            lemmatized.append(lemma)
    return " ".join(lemmatized)

def text_to_symptom_vector(text_in):
    text_input = re.sub(r'[^a-zA-Z\s]', '', text_in.lower())

    cleaned_text = clean_and_lemmatize(text_input)
    symptom_vector = np.zeros(len(symptom_columns))
    
    for phrase, col in symptom_mapping.items():
        if phrase in cleaned_text and col in symptom_columns:
            idx = symptom_columns.index(col)
            symptom_vector[idx] = 1
        else:
            words = phrase.split()
            if all(w in cleaned_text for w in words) and col in symptom_columns:
                idx = symptom_columns.index(col)
                symptom_vector[idx] = 1
    return symptom_vector.reshape(1, -1)

def predict_disease(symptom_text):
    symptom_vector = text_to_symptom_vector(symptom_text)
    if symptom_vector.sum() == 0:
        return "Unknown — Patient might need real life checkup."

    symptom_df = pd.DataFrame(symptom_vector, columns=symptom_columns)
    
    prediction = ensemble_model.predict(symptom_df)[0]
    return prediction

