
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Modal } from '@mui/material';
import io from 'socket.io-client';

const VueComptoir = () => {
    const [commandes, setCommandes] = useState([]);
    const [selectedCommande, setSelectedCommande] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchCommandes = async () => {
            const response = await axios.get("https://maro.alwaysdata.net/api/orders?view=vuecomptoir");
            setCommandes(response.data);
        };
    
        fetchCommandes();
    
        const socket = io('https://maro.alwaysdata.net');
    
        socket.on('nouvelle commande', (nouvelleCommande) => {
            setCommandes((commandesActuelles) => [...commandesActuelles, nouvelleCommande]);
        });
    
        socket.on('mise à jour commande', (commandeMiseAJour) => {
            setCommandes((commandesActuelles) => commandesActuelles.map(commande => 
                commande._id === commandeMiseAJour._id ? commandeMiseAJour : commande
            ));
        });
    
        return () => {
            socket.off('nouvelle commande');
            socket.off('mise à jour commande');
        };
    }, []);

    const handleOpenModal = (commande) => {
        setSelectedCommande(commande);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleUpdatePaymentMethod = async (id, method, orderItems) => {
        try {
            await axios.patch(`https://maro.alwaysdata.net/api/orders/${id}`, {
                paymentMethod: method,
                status: "Payé",
                orderItems: orderItems
            });
            // Filtrer pour enlever la commande mise à jour de l'affichage
            setCommandes(commandes.filter(commande => commande._id !== id));
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la commande", error);
        }
    };

    return (
        <>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Numéro de Commande</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Modifier</TableCell>
                    <TableCell>Action</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {commandes.map((commande) => (
                    <TableRow key={commande._id}>
                        <TableCell>{commande.orderNumber}</TableCell>
                        <TableCell>{commande.total.toFixed(2).replace('.', ',')} €</TableCell>
                        <TableCell> <Button onClick={() => handleOpenModal(commande)}>Modifier</Button></TableCell>
                        <TableCell>
                            <Button onClick={() => handleUpdatePaymentMethod(commande._id, 'Espèce')}>Espèce</Button>
                            <Button onClick={() => handleUpdatePaymentMethod(commande._id, 'Carte')}>Carte</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div style={{ backgroundColor: 'white', padding: '20px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    {selectedCommande && (
                        <>
                            <h2>Commande N°{selectedCommande.orderNumber}</h2>
                            {selectedCommande.items.map((item, index) => (
                                <div key={index}>
                                    <p>Nom: {item.nom}</p>
                                    {item.pain && <p>Pain: {item.pain}</p>}
                                    {item.garnitures && <p>Garnitures: {item.garnitures.join(', ')}</p>}
                                    {item.sauces && <p>Sauces: {item.sauces.join(', ')}</p>}
                                    {item.drink && <p>Boisson: {item.drink}</p>}
                                    {item.supplements && <p>Suppléments: {item.supplements.join(', ')}</p>}
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default VueComptoir;