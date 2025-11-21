from predict import predict_pneumonia

DUMMY_PATH = "pnemo.jpeg"
    
predicted_disease, confidence = predict_pneumonia(DUMMY_PATH)

print(predicted_disease)
print(confidence)