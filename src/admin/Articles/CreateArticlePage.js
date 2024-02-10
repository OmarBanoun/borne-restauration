import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Paper, Typography, Box, Select, MenuItem, FormControl, InputLabel, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreateCategory = () => {
    const [image, setImage] = useState(null);
    // const [prix, setPrix] = useState(0);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [articleData, setArticleData] = useState({ nom: '', prix: '', imageUrl: '' });
    const Navigate = useNavigate();

    useEffect(() => {
        axios.get('https://maro.alwaysdata.net/api/categories')
            .then(response => {
                // Utilisez directement response.data ici
                if (response.data && Array.isArray(response.data)) {
                    setCategories(response.data);
                } else {
                    // Gérer le cas où la structure de réponse n'est pas celle attendue
                    console.error('Expected an array, got:', response.data);
                }
            })
            .catch(error => console.error('Error fetching categories:', error));
    }, []);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleInputChange = (event) => {
        setArticleData({ ...articleData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('nom', articleData.nom);
        if (image) {
            formData.append('imageUrl', image);
        }
        formData.append('prix', articleData.prix);
        formData.append('categorie', selectedCategory);
    
        try {
            await axios.post('https://maro.alwaysdata.net/api/articles', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Navigate('/admin/articles');
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'article", error);
        }
    };

    return (
        <Paper style={{ padding: 20 }}>
            <Button variant="contained" color="primary" onClick={() => window.history.back()}>Retour</Button>
            <Typography variant="h6" className='text-center mb-4'>Créer un nouvel article</Typography>
            <form onSubmit={handleSubmit}>
                <Box display="flex" flexDirection="column" gap={3} className="col-6" marginLeft={'auto'} marginRight={'auto'}>
                    <TextField
                    label="Nom de l'article"
                    name="nom"
                    value={articleData.nom}
                    onChange={handleInputChange}
                />
                    <input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                <TextField
                    label="Prix"
                    name="prix"
                    InputProps={{
                        endAdornment: <InputAdornment position="end">€</InputAdornment>,
                    }}
                    value={articleData.prix}
                    onChange={handleInputChange}
                />
                <FormControl fullWidth>
                    <InputLabel>Catégorie</InputLabel>
                    <Select
                        value={selectedCategory}
                        label="Catégorie"
                        onChange={handleCategoryChange}
                    >
                    {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                    {category.nom}
                    </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                    <Button type="submit" variant="contained" color="primary">Créer</Button>
                </Box>
            </form>
        </Paper>
    );
};

export default CreateCategory;