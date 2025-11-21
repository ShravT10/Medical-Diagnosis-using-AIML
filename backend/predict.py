import numpy as np
import keras
from keras.models import load_model
from keras.applications.mobilenet_v2 import preprocess_input 

# --- Configuration ---
MODEL_PATH = 'mobilenetv2_pneumonia_predictor.keras'
TARGET_SIZE = (96, 96) 
CLASS_NAMES = ['Normal', 'Pneumonia'] # Based on PneumoniaMNIST labels

def preprocess_new_image(image_path):
    """
    Loads, resizes, and prepares a single uploaded image for the MobileNetV2 model.
    """
    print(f"Loading image from: {image_path}")
    
    try:
        # 1. Load the image (Keras/TensorFlow utility)
        img = keras.utils.load_img(image_path, color_mode='grayscale') 
        img_array = keras.utils.img_to_array(img)
    except FileNotFoundError:
        print(f"Error: Image file not found at {image_path}")
        return None
        
    # Convert to Keras Tensor object
    img_tensor = keras.ops.cast(img_array, dtype='float32')
    
    # 2. Resizing (from original size to 96x96x1)
    # The image is 3D (H, W, 1). We need to resize the H and W dimensions.
    img_resized = keras.ops.image.resize(img_tensor, TARGET_SIZE)
    
    # 3. 1-to-3 Channel Conversion (96x96x1 -> 96x96x3)
    # This step is CRUCIAL and must match the training script.
    img_3channel = keras.ops.concatenate([img_resized, img_resized, img_resized], axis=-1)
    
    # 4. Add Batch Dimension (96x96x3 -> 1, 96, 96, 3)
    # Models always expect an array of images, even if it's just one.
    img_batch = keras.ops.expand_dims(img_3channel, axis=0) 
    
    # 5. MobileNetV2 Normalization
    img_processed = preprocess_input(img_batch)
    
    return img_processed

def predict_pneumonia(image_path):
    """
    Loads the model and predicts the disease class for a new image.
    """
    # Load the trained model
    model = load_model(MODEL_PATH)
    
    # Preprocess the patient image
    processed_image = preprocess_new_image(image_path)
    if processed_image is None:
        return "Prediction Failed (Image Error)", 0.0

    # Make the prediction
    predictions = model.predict(processed_image)
    
    # Get the predicted class index and confidence
    predicted_index = np.argmax(predictions, axis=1)[0]
    confidence = predictions[0][predicted_index] * 100
    predicted_class = CLASS_NAMES[predicted_index]
    
    return predicted_class, confidence

# --- Example Usage (Replace with path to your patient's uploaded X-ray image) ---
# NOTE: Use an actual image file path here (e.g., 'patient_xray.jpg')
# try:
    # Use a dummy path for demonstration
    # You will need to provide a valid path to a JPEG or PNG image
    # DUMMY_PATH = "lungs.jpeg"
    
    # predicted_disease, confidence = predict_pneumonia(DUMMY_PATH)
    
    # print("\n--- PREDICTION RESULT ---")
    # print(f"Predicted Diagnosis: **{predicted_disease}**")
    # print(f"Confidence: **{confidence:.2f}%**")
    # print("-------------------------\n")

# except Exception as e:
    # print(f"\nAn error occurred during prediction: {e}")