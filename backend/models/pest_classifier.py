
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image

class PestClassifier:
    def __init__(self, model_path):
        self.model = tf.keras.models.load_model(model_path)
        self.class_labels = [
            "adristyrannus", "aleurocanthus spiniferus", "alfalfa plant bug",
            # ... keep existing code (pest labels array)
        ]

    def preprocess_image(self, img_path):
        img = image.load_img(img_path, target_size=(224, 224))
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        return img_array

    def predict(self, img_path):
        img_array = self.preprocess_image(img_path)
        pest_pred = self.model.predict(img_array)
        predicted_pest_index = np.argmax(pest_pred)
        confidence = float(pest_pred[0][predicted_pest_index])
        
        predicted_pest = self.class_labels[predicted_pest_index] if predicted_pest_index < len(self.class_labels) else "Unknown Pest"
        return predicted_pest, confidence
