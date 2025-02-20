
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import GradientBoostingRegressor
import joblib
import os

class YieldPredictor:
    def __init__(self, model_path, dataset_path):
        """
        Initialize the YieldPredictor with trained model and preprocessors
        """
        self.model = joblib.load(model_path)
        self.scaler = joblib.load(f"{model_path}_scaler")
        self.label_encoders = {}
        
        # Load label encoders for each categorical column
        df = pd.read_csv(dataset_path)
        for column in df.select_dtypes(include=['object']).columns:
            encoder_path = f'label_encoder_{column}.joblib'
            if os.path.exists(encoder_path):
                self.label_encoders[column] = joblib.load(encoder_path)
    
    def predict(self, data):
        """
        Make yield prediction based on input data
        """
        try:
            # Transform categorical variables
            input_data = data.copy()
            for column, le in self.label_encoders.items():
                if column in input_data:
                    input_data[column] = le.transform([input_data[column]])[0]
            
            # Convert to array and reshape
            input_array = np.array(list(input_data.values())).reshape(1, -1)
            
            # Scale the features
            scaled_input = self.scaler.transform(input_array)
            
            # Make prediction
            prediction = self.model.predict(scaled_input)
            
            return float(prediction[0])
        except Exception as e:
            print(f"Prediction error: {str(e)}")
            raise
