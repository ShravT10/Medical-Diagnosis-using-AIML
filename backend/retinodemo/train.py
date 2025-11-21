import numpy as np
import keras
from keras.models import Sequential
from keras.layers import Dense, GlobalAveragePooling2D
from keras.applications import MobileNetV2 
from keras.applications.mobilenet_v2 import preprocess_input 

import medmnist
from medmnist import INFO

data_flag = 'pneumoniamnist' 
info = INFO[data_flag]

num_classes = 2 

target_size = (96, 96) 
epochs = 15 
batch_size = 32

print(f"--- Starting Training on {data_flag} ({num_classes} classes) ---")

DataClass = getattr(medmnist, info['python_class'])
train_dataset = DataClass(split='train', download=True)
test_dataset = DataClass(split='test', download=True)

X_train = train_dataset.imgs
y_train = train_dataset.labels
X_test = test_dataset.imgs
y_test = test_dataset.labels

X_train_tensor = keras.ops.cast(X_train, dtype='float32')
X_test_tensor = keras.ops.cast(X_test, dtype='float32')

if len(X_train_tensor.shape) == 3:
    X_train_tensor = keras.ops.expand_dims(X_train_tensor, axis=-1)
    X_test_tensor = keras.ops.expand_dims(X_test_tensor, axis=-1)

X_train_single_channel = X_train_tensor[..., :1]
X_test_single_channel = X_test_tensor[..., :1]

X_train_resized = keras.ops.image.resize(X_train_single_channel, target_size)
X_test_resized = keras.ops.image.resize(X_test_single_channel, target_size)

# print(f"DEBUG: Shape AFTER RESIZE: {X_train_resized.shape}") 

X_train_resized = keras.ops.image.resize(X_train_single_channel, target_size)
X_test_resized = keras.ops.image.resize(X_test_single_channel, target_size)

X_train_3channel = keras.ops.concatenate([X_train_resized, X_train_resized, X_train_resized], axis=-1)
X_test_3channel = keras.ops.concatenate([X_test_resized, X_test_resized, X_test_resized], axis=-1)

X_train_processed = preprocess_input(X_train_3channel)
X_test_processed = preprocess_input(X_test_3channel)

y_train_cat = keras.utils.to_categorical(y_train, num_classes=num_classes)
y_test_cat = keras.utils.to_categorical(y_test, num_classes=num_classes)

print(f"Train samples: {len(X_train_processed)}, Test samples: {len(X_test_processed)}")
print(f"Input Shape: {X_train_processed.shape[1:]}")

base_model = MobileNetV2(
    input_shape=target_size + (3,),
    include_top=False,  
    weights='imagenet' 
)
base_model.trainable = False 

model = Sequential([
    base_model,
    GlobalAveragePooling2D(), 
    Dense(num_classes, activation='softmax')    
])

model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.001),
    loss='categorical_crossentropy', 
    metrics=['accuracy']
)

print("\n--- Model Training ---")

history = model.fit(
    X_train_processed, y_train_cat,
    epochs=epochs,
    validation_split=0.1, 
    batch_size=batch_size
)


print("\n--- ACC ---")
loss, accuracy = model.evaluate(X_test_processed, y_test_cat, verbose=1)
print(f"\nAccuracy {data_flag}: {accuracy*100:.2f}%")

model_filename = 'mobilenetv2_pneumonia_predictor.keras'
model.save(model_filename)
print(f"\nHEHE")