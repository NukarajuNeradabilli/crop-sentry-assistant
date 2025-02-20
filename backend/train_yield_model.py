
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os

def train_model():
    # Load dataset
    file_path = 'Modified_Crop_Yield_Dataset.csv'
    df = pd.read_csv(file_path)

    # Handling missing values (if any)
    df.dropna(inplace=True)

    # Encode categorical variables
    label_encoders = {}
    for column in df.select_dtypes(include=['object']).columns:
        le = LabelEncoder()
        df[column] = le.fit_transform(df[column])
        label_encoders[column] = le

    # Feature selection (Assuming last column is target)
    X = df.iloc[:, :-1]
    y = df.iloc[:, -1]

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Standardize features
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    # Train Gradient Boosting Regressor
    model = GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate model
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print(f"Model Performance:")
    print(f"Mean Squared Error: {mse:.2f}")
    print(f"R² Score: {r2:.2f}")

    # Save model and preprocessing objects
    joblib.dump(model, 'yield_model.joblib')
    joblib.dump(scaler, 'yield_model.joblib_scaler')
    
    # Save label encoders
    for column, le in label_encoders.items():
        joblib.dump(le, f'label_encoder_{column}.joblib')

    print("\nModel and preprocessing objects saved successfully!")
    return model, scaler, label_encoders

if __name__ == "__main__":
    train_model()
