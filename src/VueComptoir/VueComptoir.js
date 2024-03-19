import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import io from 'socket.io-client';

const VueComptoir = () => {
    const [commandes, setCommandes] = useState([]);

    useEffect(() => {
        const fetchCommandes = async () => {
            const response = await axios.get("https://maro.alwaysdata.net/api/orders?view=vuecomptoir");
            setCommandes(response.data);
        };
    
        fetchCommandes();
    
        const socket = io('http://maro.alwaysdata.net');
    
        socket.on('nouvelle commande', (nouvelleCommande) => {
            setCommandes((commandesActuelles) => [...commandesActuelles, nouvelleCommande]);
        });
    
        // Écouter les mises à jour des commandes
        socket.on('commande mise à jour', (commandeMiseAJour) => {
            setCommandes((commandesActuelles) => commandesActuelles.map(commande => 
                commande._id === commandeMiseAJour._id ? commandeMiseAJour : commande
            ));
        });
    
        return () => {
            socket.off('nouvelle commande');
            socket.off('mise à jour commande'); // Ne pas oublier de se désabonner de l'événement
        };
    }, []);

    const handleUpdatePaymentMethod = async (id, method) => {
        try {
            await axios.patch(`https://maro.alwaysdata.net/api/orders/${id}`, {
                paymentMethod: method,
                status: "Payé" // Optionnellement, mettre à jour le statut si nécessaire
            });
            // Filtrer pour enlever la commande mise à jour de l'affichage
            setCommandes(commandes.filter(commande => commande._id !== id));
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la commande", error);
        }
    };

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Numéro de Commande</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Action</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {commandes.map((commande) => (
                    <TableRow key={commande._id}>
                        <TableCell>{commande.orderNumber}</TableCell>
                        <TableCell>{commande.total.toFixed(2).replace('.', ',')} €</TableCell>
                        <TableCell>
                            <Button onClick={() => handleUpdatePaymentMethod(commande._id, 'Espèce')}>Espèce</Button>
                            <Button onClick={() => handleUpdatePaymentMethod(commande._id, 'Carte')}>Carte</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default VueComptoir;
