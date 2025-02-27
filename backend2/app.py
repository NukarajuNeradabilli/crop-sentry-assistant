from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import pandas as pd
from tensorflow.keras.preprocessing import image
import os

# Initialize Flask app
app = Flask(__name__)

# Load trained model
MODEL_PATH = "mobilenet_model1.h5"
model = tf.keras.models.load_model(MODEL_PATH)

# Define pest labels
class_labels = ['erythroneura apicalis', 'mole cricket', 'longlegged spider mite', 'yellow rice borer', 'sweet potato weevil', 'aleurocanthus spiniferus', 'brown plant hopper', 'panonchus citri mcgregor', 'viteus vitifoliae', 'grain spreader thrips', 'phyllocoptes oleiverus ashmead', 'grub', 'rice gall midge', 'flax budworm', 'lycorma delicatula', 'potosiabre vitarsis', 'pseudococcus comstocki kuwana', 'bird cherry-oataphid', 'polyphagotars onemus latus', 'xylotrechus', 'ampelophaga', 'gall fly', 'field cricket', 'cicadella viridis', 'whitefly', 'aphis citricola vander goot', 'spilosoma obliqua', 'sternochetus frigidus', 'green bug', 'white backed plant hopper', 'sugarcane top borer', 'dacus dorsalis(hendel)', 'brevipoalpus lewisi mcgregor', 'alfalfa weevil', 'locust', 'icerya purchasi maskell', 'rice leaf roller', 'rice leafhopper', 'coconut hispine beetle', 'mites', 'rice stemfly', 'jute stem weevil', 'miridae', 'cassava mealybug', 'large cutworm', 'chlumetia transversa', 'pieris canidia', 'black cutworm', 'flea beetle', 'cerodonta denticornis', 'cutworm', 'deporaus marginatus pascoe', 'red pumpkin beetle', 'sericaorient alismots chulsky', 'cabbage army worm', 'thrips', 'colomerus vitis', 'jute hairy caterpillar', 'termite', 'lawana imitata melichar', 'aphids', 'fall armyworm', 'yellow mite', 'limacodidae', 'pod borer', 'ceroplastes rubens', 'alfalfa seed chalcid', 'apolygus lucorum', 'wheat phloeothrips', 'fruit piercing moth', 'jute red mite', 'indigo caterpillar', 'phyllocnistis citrella stainton', 'corn borer', 'stem borer', 'legume blister beetle', 'odontothrips loti', 'prodenia litura', 'bettle', 'beet army worm', 'yellow cutworm', 'rice water weevil', 'bollworm', 'chrysomphalus aonidum', 'jute stem girdler', 'rice shell pest', 'peach borer', 'army worm', 'leaf beetle', 'blister beetle', 'white margined moth', 'therioaphis maculata buckton', 'flea beetle', 'unaspis yanonensis', 'grasshopper', 'cicadellidae', 'jute aphid', 'dasineura sp', 'small brown plant hopper', 'jute hairy', 'tetradacus c bactrocera minax', 'salurnis marginella guerr', 'rice leaf caterpillar', 'wheat blossom midge', 'parlatoria zizyphus lucus', 'alfalfa plant bug', 'scirtothrips dorsalis hood', 'parathrene regalis', 'nipaecoccus vastalor', 'jute stick insect', 'red spider', 'adristyrannus', 'black hairy', 'lytta polita', 'oides decempunctata', 'wheat sawfly', 'trialeurodes vaporariorum', 'sawfly', 'penthaleus major', 'paddy stem maggot', 'locustoidea', 'tarnished plant bug', 'mealybug', 'toxoptera aurantii', 'jute semilooper', 'mango flat beak leafhopper', 'meadow moth', 'english grain aphid', 'papilio xuthus', 'wire worm', 'bactrocera tsuneonis', 'asiatic rice borer', 'toxoptera citricidus']

# Load pesticide recommendation data
CSV_PATH = "Pesticides_lowercase.csv"
pesticide_df = pd.read_csv(CSV_PATH)
pest_to_pesticide = dict(zip(pesticide_df["Pest Name"], pesticide_df["Most Commonly Used Pesticides"]))

# Function to preprocess image
def preprocess_image(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

# Function to predict pest and recommend pesticide
def predict_pest_and_pesticide(img_path):
    img_array = preprocess_image(img_path)
    pest_pred = model.predict(img_array)
    predicted_pest_index = np.argmax(pest_pred)
    predicted_pest = class_labels[predicted_pest_index] if predicted_pest_index < len(class_labels) else "Unknown Pest"
    recommended_pesticide = pest_to_pesticide.get(predicted_pest, "No recommendation available")
    return predicted_pest, recommended_pesticide

# API endpoint for pest detection
@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    
    filepath = "temp_image.jpg"
    file.save(filepath)
    
    pest, pesticide = predict_pest_and_pesticide(filepath)
    os.remove(filepath)
    
    return jsonify({
        "Identified Pest": pest,
        "Recommended Pesticide": pesticide
    })

# Run the Flask server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
