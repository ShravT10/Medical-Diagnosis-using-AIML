import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import SVC

df = pd.read_csv('Testing.csv')
X = df.drop('prognosis', axis=1)
y = df['prognosis']
symptom_columns = X.columns.tolist()


rf_model = RandomForestClassifier(n_estimators=200, random_state=42, max_depth=10)
nb_model = MultinomialNB(alpha=0.1)
svm_model = SVC(kernel='rbf', probability=True, random_state=42, C=1.0)

rf_model.fit(X, y)
nb_model.fit(X, y)
svm_model.fit(X, y)
ensemble_model = VotingClassifier(
    estimators=[('rf', rf_model), ('nb', nb_model), ('svm', svm_model)],
    voting='soft'
)
ensemble_model.fit(X, y)

symptom_mapping = {
    'stomach pain': 'stomach_pain',
    'stomach burning': 'acidity',
    'digestive issues': 'indigestion',
    'headache': 'headache',
    'fever': 'high_fever',
    'fatigue': 'fatigue',
    'cough': 'cough',
    'skin rash': 'skin_rash',
    'itching': 'itching',
}

def text_to_symptom_vector(text_input):
    symptom_vector = np.zeros(len(symptom_columns))
    text_lower = text_input.lower()
    for phrase, col in symptom_mapping.items():
        if phrase in text_lower and col in symptom_columns:
            idx = symptom_columns.index(col)
            symptom_vector[idx] = 1
    return symptom_vector.reshape(1, -1)

def predict_disease(symptom_text):
    symptom_vector = text_to_symptom_vector(symptom_text)
    if symptom_vector.sum() == 0:
        return "Unknown Patient may need a Real Life checkup"
    prediction = ensemble_model.predict(symptom_vector)[0]
    return prediction


# symptom_description = "My eyes have turned yellow, I feel nauseous, my stomach hurts, and my skin is becoming darker"
# predicted_disease = predict_disease(symptom_description)
# print("Predicted Disease:", predicted_disease)
