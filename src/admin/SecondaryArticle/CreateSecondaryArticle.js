import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';

const CreateSecondaryArticle = () => {
    const [image, setImage] = useState(null);
    const { type } = useParams();
    const [articleData, setArticleData] = useState({
        nom: '',
        imageUrl: '',
        type
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setArticleData({ ...articleData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('nom', articleData.nom);
        if (image) {
            formData.append('imageUrl', image); // Assurez-vous que 'image' est le fichier image et non un chemin d'accès
        }
        try {
            const response = await axios.post(`http://localhost:3001/api/secondary-articles/${type}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Article secondaire créé avec succès', response.data);
            navigate('/admin/' + type);
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'article secondaire", error);
        }
    };
    

    return (
        <Paper style={{ padding: 20 }}>
            <Button variant="contained" color="primary" onClick={() => window.history.back()}>Retour</Button>
            <h3 style={{ marginTop: 20 }} className='text-center'>Créer un Article Secondaire de type {type}</h3>
            <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={3} className="col-6" marginLeft={'auto'} marginRight={'auto'}>
                <TextField
                    label="Nom de l'article"
                    name="nom"
                    value={articleData.nom}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                />
                <Button type="submit" variant="contained" color="primary">
                    Créer
                </Button>
            </Box>
            </form>
        </Paper>
    );
};

export default CreateSecondaryArticle;
