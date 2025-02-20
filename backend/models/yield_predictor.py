
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import GradientBoostingRegressor
import joblib

class YieldPredictor:
    def __init__(self, model_path, dataset_path):
        self.model = joblib.load(model_path)
        self.scaler = joblib.load(f"{model_path}_scaler")
        self.label_encoders = self._load_label_encoders(dataset_path)
        
    def _load_label_encoders(self, dataset_path):
        df = pd.read_csv(dataset_path)
        label_encoders = {}
        for column in df.select_dtypes(include=['object']).columns:
            le = LabelEncoder()
            le.fit(df[column])
            label_encoders[column] = le
        return label_encoders
    
    def predict(self, data):
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
