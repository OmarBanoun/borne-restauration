import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Paper, Typography, Box, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreateSupplement = () => {
    const [nom, setNom] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const [prix, setPrix] = useState('');
    const Navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nom', nom);
        formData.append('prix', prix);
        if (imageUrl) {
            formData.append('imageUrl', imageUrl);
        }

        try {
            // Remplacez 'URL_API' par l'URL de votre API
            await axios.post('https://maro.alwaysdata.net/api/supplements', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Gestion de la réussite
        } catch (error) {
            console.error("Erreur lors de l'ajout de la catégorie", error);
            // Gestion de l'erreur
        }
        Navigate('/admin/supplements');
    };

    return (
        <Paper style={{ padding: 20 }}>
            <Button variant="contained" color="primary" onClick={() => window.history.back()}>Retour</Button>
            <Typography variant="h6" className='text-center mb-4'>Créer une nouveau supplément</Typography>
            <form onSubmit={handleSubmit}>
                <Box display="flex" flexDirection="column" gap={3} className="col-6" marginLeft={'auto'} marginRight={'auto'}>
                    <TextField
                        label="Nom"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        required
                    />
                    {/* insérer une field de mui avec le sigle "€" */}
                    <TextField
                        label="Prix (en €)"
                        type="number"
                        InputProps={{
                            startAdornment: <InputAdornment position="start">+</InputAdornment>,
                            endAdornment: <InputAdornment position="end">€</InputAdornment>,
                        }}
                        value={prix}
                        onChange={(e) => setPrix(Number(e.target.value))}
                    />
                    <input
                        type="file"
                        onChange={(e) => setImageUrl(e.target.files[0])}
                    />
                    <Button type="submit" variant="contained" color="primary">Créer</Button>
                </Box>
            </form>
        </Paper>
    );
};

export default CreateSupplement;