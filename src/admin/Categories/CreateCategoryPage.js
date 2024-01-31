import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreateCategory = () => {
    const [nom, setNom] = useState('');
    const [image, setImage] = useState(null);
    const Navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nom', nom);
        if (image) {
            formData.append('imageUrl', image);
        }

        try {
            // Remplacez 'URL_API' par l'URL de votre API
            await axios.post('https://maro.alwaysdata.net/api/categories', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Gestion de la réussite
        } catch (error) {
            console.error("Erreur lors de l'ajout de la catégorie", error);
            // Gestion de l'erreur
        }
        Navigate('/admin/categories');
    };

    return (
        <Paper style={{ padding: 20 }}>
            <Button variant="contained" color="primary" onClick={() => window.history.back()}>Retour</Button>
            <Typography variant="h6" className='text-center mb-4'>Créer une nouvelle catégorie</Typography>
            <form onSubmit={handleSubmit}>
                <Box display="flex" flexDirection="column" gap={3} className="col-6" marginLeft={'auto'} marginRight={'auto'}>
                    <TextField
                        label="Nom"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        required
                    />
                    <input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                    <Button type="submit">Créer</Button>
                </Box>
            </form>
        </Paper>
    );
};

export default CreateCategory;