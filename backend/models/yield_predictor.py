
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
        return pickle.load("crop_yield_model.pkl")

    def _load_scaler(self):
        with open("scaler.pkl", "rb") as scaler_file:
            return pickle.load(scaler_file)

    def _load_encoders(self):
        with open("label_encoders.pkl", "rb") as encoders_file:
            return pickle.load(encoders_file)

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
