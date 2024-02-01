// Page pour afficher le logo
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Typography, Button, List, ListItem, ListItemText, Box } from '@mui/material';
import { Settings } from '@mui/icons-material';

const CustomPage = () => {
const [settings, setSettings] = useState([]);
const [themePrimaryColor, setThemePrimaryColor] = useState('#ffb700');
const [themeSecondaryColor, setThemeSecondaryColor] = useState('#151313');
const [image, setImage] = useState(null);
const [tempImageUrl, setTempImageUrl] = useState(null);
const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setImage(file);
        setTempImageUrl(URL.createObjectURL(file)); // Créer une URL temporaire pour le fichier sélectionné
    }
};
useEffect(() => {
    axios.get('https://maro.alwaysdata.net/api/settings')
        .then(response => {
            console.log('response.data:', response.data);
            setSettings(response.data);
            setTempImageUrl(`https://maro.alwaysdata.net/${response.data[0].logo}`);
            setThemePrimaryColor(response.data[0].themePrimaryColor);
            setThemeSecondaryColor(response.data[0].themeSecondaryColor);
        })
        .catch(error => console.log(error));
}, []);

const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('logo', image); // Ajoute le logo
    // Ajoute également les couleurs primaires et secondaires au formData
    formData.append('themePrimaryColor', themePrimaryColor);
    formData.append('themeSecondaryColor', themeSecondaryColor);

    try {
        await axios.put('https://maro.alwaysdata.net/api/settings', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Logo et couleurs mis à jour avec succès');
        window.location.reload(); // Ou une meilleure façon de rafraîchir les données affichées
    } catch (error) {
        console.error("Erreur lors de la mise à jour du logo et des couleurs", error);
    }
};

const handlePrimaryColorChange = (event) => {
    setThemePrimaryColor(event.target.value);
  };
  
  const handleSecondaryColorChange = (event) => {
    setThemeSecondaryColor(event.target.value);
  };

//   const saveColorChanges = () => {
//     axios.put('https://maro.alwaysdata.net/api/settings', {
//       themePrimaryColor,
//       themeSecondaryColor
//     })
//     .then(response => {
//       console.log("Configuration des couleurs mise à jour avec succès");
//     })
//     .catch(error => {
//       console.error("Erreur lors de la mise à jour des couleurs", error);
//     });
//   };


useEffect(() => {
    return () => {
        if (tempImageUrl) {
            URL.revokeObjectURL(tempImageUrl); // Libérer l'URL de blob
        }
    };
}, [tempImageUrl]);

return (
    <Paper style={{ margin: 20, padding: 20 }}>
        <Typography variant="h4" style={{ marginBottom: 20, textAlign: 'center' }}>
            Personnalisation
        </Typography>
        <List>
            <Typography variant="h5" style={{ padding: 20, marginLeft: 20 }}>Logo</Typography>
            {
            settings && settings.length > 0 ? (
                settings.map((setting, index) => (
                <ListItem key={index} alignItems="center">
                    {tempImageUrl || setting.logo ? (
                    <Box
                        component="img"
                        sx={{ height: 60, width: 60, marginRight: 2 }}
                        src={tempImageUrl ? tempImageUrl : setting.logo ? `https://maro.alwaysdata.net/${setting.logo}` : ""}
                        alt="Logo"
                        style={{ width: 100 }}
                    />
                    ) : (
                    <Typography variant="body1">Ajouter une image</Typography>
                    )}
                    <input type="file" onChange={(e) => handleFileChange(e, index)} />
                </ListItem>
                ))
            ) : (
                // Cas où settings est vide ou non défini
                <ListItem alignItems="flex-start">
                    <Typography variant="body1">Ajouter une image : </Typography>
                    <input type="file" onChange={handleFileChange} />
                </ListItem>
            )}
            <hr />
            <ListItem >
                <Typography variant="h6" style={{ padding: 20 }}>Couleur principale</Typography>
                <input type="color" value={themePrimaryColor} onChange={handlePrimaryColorChange} />
            </ListItem>
            <hr />
            <ListItem >
                <Typography variant="h6" style={{ padding: 20 }}>Couleur secondaire</Typography>
                <input type="color" value={themeSecondaryColor} onChange={handleSecondaryColorChange} />
            </ListItem>
            <hr />
            <Button variant="contained" style={{ marginTop: 20 }} color="primary" onClick={handleSubmit}>
                Sauvegarder
            </Button>
        </List>
    </Paper>
);

}

export default CustomPage;