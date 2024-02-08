// supplement page
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Paper, Typography, List, ListItem, ListItemText, Button, Box } from '@mui/material';
import axios from 'axios';

const SupplementsPage = () => {
    const [supplements, setSupplements] = useState([]);
    const navigate = useNavigate();
    const handleCreateButtonClick = () => {
        navigate('/admin/create-supplement'); // Mettez à jour le chemin selon votre configuration de route
    };

    useEffect(() => {
        axios.get('https://maro.alwaysdata.net/api/supplements')
            .then((response) => {
                console.log("Response received");
                setSupplements(response.data);
            })
            .catch((error) => {
                console.log(`Error: ${error}`);
            });
    }, []);

    return (
        <Paper style={{ margin: 20, padding: 20 }}>
            <Typography variant="h5" style={{ marginBottom: 20 }}>Liste des Suppléments</Typography>
            <Button variant="contained" color="primary" onClick={handleCreateButtonClick}>
                Créer un supplément
            </Button>
            <List>
                {supplements.map((supplement, index) => (
                    <ListItem key={index} alignItems="flex-start">
                        {supplement.imageUrl && (
                        <Box
                            component="img"
                            sx={{
                                height: 60,
                                width: 60,
                                marginRight: 2,
                            }}
                            src={`https://maro.alwaysdata.net/${supplement.imageUrl}`}
                            alt={supplement.nom}
                            style={{ width: 100 }}
                        />
                        )}
                        <ListItemText primary={supplement.nom} />
                        {/* afficher le prix */}
                        <ListItemText primary={`Prix : + ${supplement.prix} €`} />
                        <Button variant="contained" color="error" style={{ marginRight: 10 }} onClick={() => {
                            // ajouter une alerte
                            if (window.confirm('Voulez-vous supprimer ce supplément ?')) {
                                axios.delete(`https://maro.alwaysdata.net/api/supplements/${supplement._id}`)
                                .then(response => {
                                    console.log('Supplément supprimée', response.data);
                                    window.location.reload(); // Rechargez la page seulement après la suppression
                                })
                                .catch(error => {
                                    console.error('Erreur lors de la suppression', error);
                                    // Gérez l'erreur éventuellement ici, par exemple en informant l'utilisateur
                                });
                            }
                        }}>Supprimer</Button>
                        {/* bouton pour modification */}
                        <Button variant="contained" color="primary" onClick={() => navigate(`/admin/edit-supplement/${supplement._id}`)}>
                            Modifier
                        </Button>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}

export default SupplementsPage;