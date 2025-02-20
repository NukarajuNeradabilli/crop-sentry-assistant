
import os

class Config:
    UPLOAD_FOLDER = 'uploads'
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
    MODEL_PATH = "pest_model.h5"
    CSV_PATH = "Pesticides_lowercase.csv"
    YIELD_MODEL_PATH = "yield_model.joblib"
    YIELD_DATASET_PATH = "Modified_Crop_Yield_Dataset.csv"
    
    # Ensure upload directory exists
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
