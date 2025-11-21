from trainmodel import predict_disease

symptoms = input("Enter your symptomns : ")
possible_disease = predict_disease(symptoms)
print(possible_disease)