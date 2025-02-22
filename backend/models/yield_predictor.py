
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
            # Get the feature names from the scaler
            feature_names = self.scaler.feature_names_in_
            
            # Initialize array with zeros
            input_values = np.zeros(len(feature_names))
            
            # Fill the array with values in the correct order
            for i, feature in enumerate(feature_names):
                value = input_data.get(feature, 0)
                # Handle categorical variables
                if feature in self.label_encoders:
                    try:
                        value = self.label_encoders[feature].transform([str(value)])[0]
                    except ValueError as e:
                        print(f"Error encoding {feature}: {str(e)}")
                        raise
                else:
                    # Convert numerical values
                    try:
                        value = float(value)
                    except ValueError as e:
                        print(f"Error converting {feature} to float: {str(e)}")
                        raise
                input_values[i] = value

            # Reshape and scale
            input_array = input_values.reshape(1, -1)
            scaled_input = self.scaler.transform(input_array)

            # Make prediction
            prediction = self.model.predict(scaled_input)
            return float(prediction[0])
        except Exception as e:
            print(f"Prediction error: {str(e)}")
            raise
