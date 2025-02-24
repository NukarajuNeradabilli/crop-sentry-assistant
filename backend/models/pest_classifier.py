
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import pandas as pd

class PestClassifier:
    def __init__(self, model_path):
        # Load model with custom_objects to handle DepthwiseConv2D compatibility
        self.model = tf.keras.models.load_model(
            model_path,
            custom_objects={'DepthwiseConv2D': tf.keras.layers.DepthwiseConv2D}
        )
        
        # Load pesticide recommendations
        self.pesticide_df = pd.read_csv("backend/Pesticides_lowercase.csv")
        self.pest_to_pesticide = dict(zip(
            self.pesticide_df["Pest Name"],
            self.pesticide_df["Most Commonly Used Pesticides"]
        ))
        
        # Class labels remain the same
        self.class_labels = [
            'erythroneura apicalis', 'mole cricket', 'longlegged spider mite', 'yellow rice borer',
            'sweet potato weevil', 'aleurocanthus spiniferus', 'brown plant hopper',
            'panonchus citri mcgregor', 'viteus vitifoliae', 'grain spreader thrips',
            'phyllocoptes oleiverus ashmead', 'grub', 'rice gall midge', 'flax budworm',
            'lycorma delicatula', 'potosiabre vitarsis', 'pseudococcus comstocki kuwana',
            'bird cherry-oataphid', 'polyphagotars onemus latus', 'xylotrechus', 'ampelophaga',
            'gall fly', 'field cricket', 'cicadella viridis', 'whitefly',
            'aphis citricola vander goot', 'spilosoma obliqua', 'sternochetus frigidus',
            'green bug', 'white backed plant hopper', 'sugarcane top borer',
            'dacus dorsalis(hendel)', 'brevipoalpus lewisi mcgregor', 'alfalfa weevil',
            'locust', 'icerya purchasi maskell', 'rice leaf roller', 'rice leafhopper',
            'coconut hispine beetle', 'mites', 'rice stemfly', 'jute stem weevil', 'miridae',
            'cassava mealybug', 'large cutworm', 'chlumetia transversa', 'pieris canidia',
            'black cutworm', 'flea beetle', 'cerodonta denticornis', 'cutworm',
            'deporaus marginatus pascoe', 'red pumpkin beetle', 'sericaorient alismots chulsky',
            'cabbage army worm', 'thrips', 'colomerus vitis', 'jute hairy caterpillar',
            'termite', 'lawana imitata melichar', 'aphids', 'fall armyworm', 'yellow mite',
            'limacodidae', 'pod borer', 'ceroplastes rubens', 'alfalfa seed chalcid',
            'apolygus lucorum', 'wheat phloeothrips', 'fruit piercing moth', 'jute red mite',
            'indigo caterpillar', 'phyllocnistis citrella stainton', 'corn borer',
            'stem borer', 'legume blister beetle', 'odontothrips loti', 'prodenia litura',
            'bettle', 'beet army worm', 'yellow cutworm', 'rice water weevil', 'bollworm',
            'chrysomphalus aonidum', 'jute stem girdler', 'rice shell pest', 'peach borer',
            'army worm', 'leaf beetle', 'blister beetle', 'white margined moth',
            'therioaphis maculata buckton', 'flea beetle', 'unaspis yanonensis',
            'grasshopper', 'cicadellidae', 'jute aphid', 'dasineura sp',
            'small brown plant hopper', 'jute hairy', 'tetradacus c bactrocera minax',
            'salurnis marginella guerr', 'rice leaf caterpillar', 'wheat blossom midge',
            'parlatoria zizyphus lucus', 'alfalfa plant bug', 'scirtothrips dorsalis hood',
            'parathrene regalis', 'nipaecoccus vastalor', 'jute stick insect', 'red spider',
            'adristyrannus', 'black hairy', 'lytta polita', 'oides decempunctata',
            'wheat sawfly', 'trialeurodes vaporariorum', 'sawfly', 'penthaleus major',
            'paddy stem maggot', 'locustoidea', 'tarnished plant bug', 'mealybug',
            'toxoptera aurantii', 'jute semilooper', 'mango flat beak leafhopper',
            'meadow moth', 'english grain aphid', 'papilio xuthus', 'wire worm',
            'bactrocera tsuneonis', 'asiatic rice borer', 'toxoptera citricidus'
        ]

    def preprocess_image(self, img_path):
        img = image.load_img(img_path, target_size=(224, 224))
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        return img_array

    def predict(self, img_path):
        try:
            # Preprocess the image
            img_array = self.preprocess_image(img_path)
            
            # Get pest prediction
            pest_pred = self.model.predict(img_array)
            predicted_pest_index = np.argmax(pest_pred)
            confidence = float(pest_pred[0][predicted_pest_index])
            
            # Get the predicted pest name
            predicted_pest = self.class_labels[predicted_pest_index] if predicted_pest_index < len(self.class_labels) else "Unknown Pest"
            
            return predicted_pest, confidence
            
        except Exception as e:
            print(f"Error during prediction: {str(e)}")
            return "Unknown Pest", 0.0
