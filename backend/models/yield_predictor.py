
import pickle
import joblib
import numpy as np
import os

class YieldPredictor:
    def __init__(self):
        self.model = self._load_model()
        self.scaler = self._load_scaler()
        self.label_encoders = self._load_encoders()

    def _load_model(self):
        try:
            return joblib.load("crop_yield_model.pkl")
        except Exception as e:
            print(f"Error loading model: {str(e)}")
            raise

    def _load_scaler(self):
        try:
            return joblib.load("scaler.pkl")
        except Exception as e:
            print(f"Error loading scaler: {str(e)}")
            raise

    def _load_encoders(self):
        try:
            return joblib.load("label_encoders.pkl")
        except Exception as e:
            print(f"Error loading encoders: {str(e)}")
            raise

    def predict(self, input_data):
        try:
            # Convert categorical inputs using label encoders
            input_values = []
            for feature, value in input_data.items():
                if feature in self.label_encoders:
                    value = self.label_encoders[feature].transform([value])[0]
                input_values.append(value)

            # Convert to numpy array and scale
            input_array = np.array(input_values).reshape(1, -1)
            scaled_input = self.scaler.transform(input_array)

            # Make prediction
            prediction = self.model.predict(scaled_input)
            return float(prediction[0])
        except Exception as e:
            print(f"Prediction error: {str(e)}")
            raise
