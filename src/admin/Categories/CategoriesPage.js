import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Paper, Typography, Box, Button, Dialog } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const handleCreateButtonClick = () => {
        navigate('/admin/create-category'); // Mettez à jour le chemin selon votre configuration de route
    };

    useEffect(() => {
        axios.get('https://maro.alwaysdata.net/api/categories')
            .then(response => {
                setCategories(response.data); // Assurez-vous que cela correspond à la structure de votre réponse
            })
            .catch(error => console.log(error));
    }, []);

    return (
        <Paper style={{ margin: 20, padding: 20 }}>
            <Typography variant="h5" style={{ marginBottom: 20 }}>Liste des Catégories</Typography>
            <Button variant="contained" color="primary" onClick={handleCreateButtonClick}>
                Créer une catégorie
            </Button>
            <List>
                {categories.map((category, index) => (
                    <ListItem key={index} alignItems="flex-start">
                        {category.imageUrl && (
                        <Box
                            component="img"
                            sx={{
                                height: 60,
                                width: 60,
                                marginRight: 2,
                            }}
                            src={`https://maro.alwaysdata.net/${category.imageUrl}`}
                            alt={category.nom}
                            style={{ width: 100 }}
                        />
                        )}
                        <ListItemText primary={category.nom} />
                        <Button variant="contained" color="error" style={{ marginRight: 10 }} onClick={() => {
                            // ajouter une alerte
                            if (window.confirm('Voulez-vous supprimer cette catégorie ?')) {
                                axios.delete(`https://maro.alwaysdata.net/api/categories/${category._id}`)
                                .then(response => {
                                    console.log('Catégorie supprimée', response.data);
                                    window.location.reload(); // Rechargez la page seulement après la suppression
                                })
                                .catch(error => {
                                    console.error('Erreur lors de la suppression', error);
                                    // Gérez l'erreur éventuellement ici, par exemple en informant l'utilisateur
                                });
                            }
                        }}>Supprimer</Button>
                        {/* bouton pour modification */}
                        <Button variant="contained" color="primary" onClick={() => navigate(`/admin/edit-category/${category._id}`)}>
                            Modifier
                        </Button>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default CategoriesPage;
