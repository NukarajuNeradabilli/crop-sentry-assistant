
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
            model_path = "crop_yield_model.pkl"
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model file not found at {model_path}")
            return joblib.load(model_path)
        except Exception as e:
            print(f"Error loading model: {str(e)}")
            raise

    def _load_scaler(self):
        try:
            scaler_path = "scaler.pkl"
            if not os.path.exists(scaler_path):
                raise FileNotFoundError(f"Scaler file not found at {scaler_path}")
            return joblib.load(scaler_path)
        except Exception as e:
            print(f"Error loading scaler: {str(e)}")
            raise

    def _load_encoders(self):
        try:
            encoders_path = "label_encoders.pkl"
            if not os.path.exists(encoders_path):
                raise FileNotFoundError(f"Label encoders file not found at {encoders_path}")
            return joblib.load(encoders_path)
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
