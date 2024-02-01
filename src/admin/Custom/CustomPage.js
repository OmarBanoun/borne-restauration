// Page pour afficher le logo
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Typography, Button, List, ListItem, ListItemText, Box } from '@mui/material';
import { Settings } from '@mui/icons-material';

const CustomPage = () => {
const [settings, setSettings] = useState([]);
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
            setTempImageUrl(`https://maro.alwaysdata.net/${response.data.logo}`);
        })
        .catch(error => console.log(error));
}, []);

const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('logo', image);
    try {
        const response = await axios.put('https://maro.alwaysdata.net/api/settings', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(response => {
            window.location.reload();
        })
        console.log('Logo mis à jour avec succès', response.data);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du logo", error);
    }
}

useEffect(() => {
    return () => {
        if (tempImageUrl) {
            URL.revokeObjectURL(tempImageUrl); // Libérer l'URL de blob
        }
    };
}, [tempImageUrl]);

return (
    <Paper style={{ margin: 20, padding: 20 }}>
        <Typography variant="h5" style={{ marginBottom: 20 }}>
            Personnalisation
        </Typography>
        <List>
            {settings && settings.length > 0 ? (
                settings.map((setting, index) => (
                    <ListItem key={index} alignItems="flex-start">
                        {setting.logo ? (
                            <Box
                                component="img"
                                sx={{ height: 60, width: 60, marginRight: 2 }}
                                src={`https://maro.alwaysdata.net/${setting.logo}`}
                                alt='Logo'
                                style={{ width: 100 }}
                            />
                        ) : (
                            <Typography variant="body1">Ajouter une image</Typography>
                        )}
                        <input type="file" onChange={handleFileChange} />
                    </ListItem>
                ))
            ) : (
                // Cas où settings est vide ou non défini
                <ListItem alignItems="flex-start">
                    <Typography variant="body1">Ajouter une image : </Typography>
                    <input type="file" onChange={handleFileChange} />
                </ListItem>
            )}
            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Sauvegarder
            </Button>
        </List>
    </Paper>
);

}

export default CustomPage;