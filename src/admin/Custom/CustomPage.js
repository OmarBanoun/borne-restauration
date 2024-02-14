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
const [homeImgs, setHomeImgs] = useState([{ file: null, url: '' }]);
const [tempImageUrl, setTempImageUrl] = useState(null);
const [tempHomeImgUrls, setTempHomeImgUrls] = useState([]);

const handleFileChange = (e, type, index) => {
    if (e.target.files && e.target.files.length > 0) {
        if (type === 'logo') {
            const file = e.target.files[0];
            if (tempImageUrl) URL.revokeObjectURL(tempImageUrl);
            setImage(file);
            setTempImageUrl(URL.createObjectURL(file));
        } else if (type === 'homeImgs') {
            // Traitement pour l'ajout de nouvelles images ou le remplacement d'une image spécifique
            if (index !== undefined) {
                // Remplacement d'une image spécifique
                const file = e.target.files[0];
                const newUrl = URL.createObjectURL(file);
                setHomeImgs(currentImgs => {
                    const newImgs = [...currentImgs];
                    if (newImgs[index]?.url) URL.revokeObjectURL(newImgs[index].url);
                    newImgs[index] = { file, url: newUrl };
                    return newImgs;
                });
                setTempHomeImgUrls(currentUrls => {
                    const updatedUrls = [...currentUrls];
                    updatedUrls[index] = newUrl;
                    return updatedUrls;
                });
            } else {
                // Ajout de nouvelles images
                const newFiles = Array.from(e.target.files);
                const newImgs = newFiles.map(file => ({ file, url: URL.createObjectURL(file) }));
                setHomeImgs(currentImgs => [...currentImgs, ...newImgs]);
                setTempHomeImgUrls(currentUrls => [...currentUrls, ...newImgs.map(img => img.url)]);
            }
        }
    }
};

useEffect(() => {
    axios.get('https://maro.alwaysdata.net/api/settings')
        .then(response => {
            console.log('response.data:', response.data);
            const imgData = response.data.length > 0 ? response.data[0] : {};
            setTempImageUrl(imgData.logo ? `https://maro.alwaysdata.net/${imgData.logo}` : null);
            if (imgData.homeImgs && Array.isArray(imgData.homeImgs)) {
                const homeImgUrls = imgData.homeImgs.map(img => `https://maro.alwaysdata.net/${img}`);
                setTempHomeImgUrls(homeImgUrls);
            } else {
                setTempHomeImgUrls([]);
            }
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
    homeImgs.forEach(({ file }) => {
        if (file) formData.append('homeImgs', file); // Assurez-vous d'ajouter le fichier et non l'objet
    });
    formData.append('themePrimaryColor', themePrimaryColor);
    formData.append('themeSecondaryColor', themeSecondaryColor);
    formData.append('companyName', companyName);

    try {
        await axios.put('https://maro.alwaysdata.net/api/settings', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Mise à jour réussie');
        // Mettez à jour l'état de votre application pour refléter les changements au lieu de recharger la page
        window.location.reload();
    } catch (error) {
        console.error("Erreur lors de la mise à jour", error);
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

const addNewImage = () => {
    setHomeImgs([...homeImgs, { file: null, url: '' }]);
};


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
        // Libérer l'URL du logo si nécessaire
        if (tempImageUrl) {
            URL.revokeObjectURL(tempImageUrl);
        }
        // Libérer les URLs des images d'accueil
        tempHomeImgUrls.forEach(url => {
            URL.revokeObjectURL(url);
        });
    };
}, [tempImageUrl, tempHomeImgUrls]);

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

                <Typography variant="h5" style={{ padding: 20, marginLeft: 20 }}>Images d'accueil</Typography>
                <ListItem alignItems="flex-start" style={{ flexDirection: 'column', marginLeft: 20 }}>
                    {tempHomeImgUrls.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                            {tempHomeImgUrls.map((url, index) => (
                                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                    <Box 
                                        component="img" 
                                        sx={{ width: 100, height: 60 }} 
                                        src={url} 
                                        alt={`Prévisualisation image d'accueil ${index + 1}`} 
                                    />
                                    {/* Bouton pour remplacer une image spécifique */}
                                    <label htmlFor={`replace-image-${index}`} style={{ cursor: 'pointer', display: 'block', backgroundColor: '#ddd', padding: '2px 5px', textAlign: 'center', width: '100px' }}>
                                        Remplacer
                                    </label>
                                    <input 
                                        id={`replace-image-${index}`}
                                        type="file" 
                                        onChange={(e) => handleFileChange(e, 'homeImgs', index)} 
                                        style={{ display: 'none' }} 
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Section pour ajouter de nouvelles images */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant="h6" style={{ marginBottom: '10px' }}>Ajouter une nouvelle image :</Typography>
                        <input 
                            type="file" 
                            onChange={(e) => handleFileChange(e, 'homeImgs')} 
                            multiple 
                        />
                    </div>
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