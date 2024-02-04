// Page pour afficher le logo
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Typography, Button, List, ListItem, ListItemText, Box, TextField } from '@mui/material';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { Settings } from '@mui/icons-material';

const CustomPage = () => {
const [settings, setSettings] = useState([]);
const [companyName, setCompanyName] = useState('');
const [themePrimaryColor, setThemePrimaryColor] = useState('#ffb700');
const [themeSecondaryColor, setThemeSecondaryColor] = useState('#151313');
const [image, setImage] = useState(null);
const [homeImg, setHomeImg] = useState(null);
const [tempImageUrl, setTempImageUrl] = useState(null);
const [tempHomeImgUrl, setTempHomeImgUrl] = useState(null);
const handleFileChange = (e, type) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (type === 'logo') {
            setImage(file); // Met à jour l'état de l'image du logo
            setTempImageUrl(URL.createObjectURL(file)); // Prévisualisation du logo
        } else if (type === 'homeImg') {
            setHomeImg(file); // Met à jour l'état de l'image de homeImg
            setTempHomeImgUrl(URL.createObjectURL(file)); // Prévisualisation de homeImg
        }
    }
};


useEffect(() => {
    axios.get('https://maro.alwaysdata.net/api/settings')
        .then(response => {
            console.log('response.data:', response.data);
            const imgData = response.data.length > 0 ? response.data[0] : {};
            setTempImageUrl(imgData.logo ? `https://maro.alwaysdata.net/${imgData.logo}` : null);
            setTempHomeImgUrl(imgData.homeImg ? `https://maro.alwaysdata.net/${imgData.homeImg}` : null);
            setThemePrimaryColor(response.data[0].themePrimaryColor);
            setThemeSecondaryColor(response.data[0].themeSecondaryColor);
            setCompanyName(response.data[0].companyName);
        })
        .catch(error => console.log(error));
}, []);

const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('logo', image); // Ajoute le logo
    formData.append('homeImg', homeImg);
    // if (homeImg) formData.append('homeImg', homeImg);
    // Ajoute également les couleurs primaires et secondaires au formData
    formData.append('themePrimaryColor', themePrimaryColor);
    formData.append('themeSecondaryColor', themeSecondaryColor);
    formData.append('companyName', companyName);

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

  const handleCompanyNameChange = (event) => {
    setCompanyName(event.target.value);
  }

  const saveColorChanges = () => {
    axios.put('https://maro.alwaysdata.net/api/settings', {
      themePrimaryColor,
      themeSecondaryColor
    })
    .then(response => {
      console.log("Configuration des couleurs mise à jour avec succès");
    })
    .catch(error => {
      console.error("Erreur lors de la mise à jour des couleurs", error);
    });
  };


useEffect(() => {
    return () => {
        if (tempImageUrl) {
            URL.revokeObjectURL(tempImageUrl); // Libérer l'URL de blob
        }
        else if (tempHomeImgUrl) {
            URL.revokeObjectURL(tempHomeImgUrl);
        }
    };
}, [tempImageUrl, tempHomeImgUrl]);
return (
    <Paper style={{ margin: 20, padding: 20 }}>
        <Typography variant="h4" style={{ marginBottom: 20, textAlign: 'center' }}>
            Personnalisation
        </Typography>
        <List>
        <Typography variant="h5" style={{ padding: 20, marginLeft: 20 }}>Logo</Typography>
                <ListItem alignItems="center">
                    {tempImageUrl ? (
                        <Box
                            component="img"
                            sx={{ height: 60, width: 60, marginRight: 2 }}
                            src={tempImageUrl}
                            alt="Logo"
                            style={{ width: 100 }}
                        />
                    ) : (
                        <Typography variant="body1">Ajouter une image</Typography>
                    )}
                    <input type="file" onChange={(e) => handleFileChange(e, 'logo')} />
                </ListItem>
                
                <hr />

                <Typography variant="h5" style={{ padding: 20, marginLeft: 20 }}>Image d'accueil</Typography>
                <ListItem alignItems="center">
                    {tempHomeImgUrl ? (
                        <Box
                            component="img"
                            sx={{ height: 60, width: 60, marginRight: 2 }}
                            src={tempHomeImgUrl}
                            alt="image d'accueil"
                            style={{ width: 100 }}
                        />
                    ) : (
                        <Typography variant="body1"><div>Ajouter une image :</div></Typography>
                    )}
                    <input type="file" onChange={(e) => handleFileChange(e, 'homeImg')} />
                </ListItem>
            <hr />
            <Typography variant="h5" style={{ padding: 20, marginLeft: 20 }} secondary="exemple: Bienvenue chez WaveConnect">Message d'accueil</Typography>
            <TextareaAutosize aria-label="minimum height" minRows={3} placeholder="exemple : Bienvenue chez WaveConnect" value={companyName} onChange={handleCompanyNameChange} style={{ marginLeft: 35, width: 300 }} />
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