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
            try {
                const response = await axios.get("https://maro.alwaysdata.net/api/orders?view=vuecomptoir");
                console.log("Données initiales:", response.data);
                setCommandes(response.data);
            } catch (error) {
                console.error("Erreur lors du chargement initial:", error);
            }
        };
    
        fetchCommandes();
    
        const socket = io('https://maro.alwaysdata.net');
    
        socket.on('nouvelle commande', async (nouvelleCommande) => {
            console.log("Nouvelle commande reçue via socket:", nouvelleCommande);
            try {
                // Récupérer les étapes
                const stepsResponse = await axios.get('https://maro.alwaysdata.net/api/steps');
                const steps = stepsResponse.data;
    
                // Récupérer les détails de la commande
                const response = await axios.get(`https://maro.alwaysdata.net/api/orders/${nouvelleCommande._id}`);
                const commandeComplete = response.data;
    
                // Formater la commande avec les options
                const commandeWithOptions = {
                    ...commandeComplete,
                    items: commandeComplete.items.map(item => {
                        const itemWithOptions = {
                            ...item,
                            options: {}
                        };
    
                        // Pour chaque étape dans les options
                        Object.entries(item.options || {}).forEach(([stepName, optionIds]) => {
                            const step = steps.find(s => s.nom === stepName);
                            if (step) {
                                itemWithOptions.options[stepName] = step.options.filter(
                                    opt => optionIds.includes(opt._id)
                                );
                            }
                        });
    
                        return itemWithOptions;
                    })
                };

                // Log the formatted order with options
                console.log("Commande formatée avec options:", commandeWithOptions);
    
                // Envoyer la commande via WebSocket
                socket.emit('commande mise à jour', commandeWithOptions);
    
                // Mettre à jour l'état
                setCommandes(prev => {
                    const exists = prev.some(cmd => cmd._id === commandeWithOptions._id);
                    if (!exists) {
                        return [...prev, commandeWithOptions];
                    }
                    return prev;
                });
            } catch (error) {
                console.error("Erreur lors de la récupération des détails de la commande:", error);
            }
        });
    
        return () => {
            socket.disconnect();
        };
    }, []);

    const handleOpenModal = (commande) => {
        console.log("Structure complète de la commande:", commande);
        
        const fetchCommandeDetails = async () => {
            try {
                // Récupérer les étapes et leurs options
                const stepsResponse = await axios.get('https://maro.alwaysdata.net/api/steps');
                const steps = stepsResponse.data;
                
                // Récupérer les détails de la commande
                const response = await axios.get(`https://maro.alwaysdata.net/api/orders/${commande._id}`);
                console.log("Steps récupérées:", steps);
                console.log("Commande brute:", response.data);
                
                // Si la commande n'est pas trouvée, utiliser la commande passée en paramètre
                if (!response.data) {
                    setSelectedCommande(commande);
                    setIsModalOpen(true);
                    return;
                }
                
                // Formater la commande avec les options
                const commandeWithOptions = {
                    ...response.data,
                    items: response.data.items.map(item => {
                        const itemWithOptions = {
                            ...item,
                            options: {}
                        };
                        
                        // Pour chaque étape dans les options
                        if (item.options) {
                            Object.entries(item.options).forEach(([stepName, optionIds]) => {
                                const step = steps.find(s => s.nom === stepName);
                                if (step) {
                                    itemWithOptions.options[stepName] = optionIds.map(id => {
                                        const option = step.options.find(opt => opt._id === id);
                                        return option || { nom: 'Option non trouvée' };
                                    });
                                }
                            });
                        }
                        
                        return itemWithOptions;
                    })
                };
                
                console.log("Commande avec options:", commandeWithOptions);
                setSelectedCommande(commandeWithOptions);
                setIsModalOpen(true);
            } catch (error) {
                console.error("Erreur lors de la récupération des détails:", error);
                // En cas d'erreur, afficher la commande sans les détails supplémentaires
                setSelectedCommande(commande);
                setIsModalOpen(true);
            }
        };
    
        fetchCommandeDetails();
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleUpdatePaymentMethod = async (id, method) => {
        try {
            // Récupérer les détails de la commande
            const response = await axios.get(`https://maro.alwaysdata.net/api/orders/${id}`);
            const commandeComplete = response.data;
    
            // Récupérer les étapes et leurs options
            const stepsResponse = await axios.get('https://maro.alwaysdata.net/api/steps');
            const steps = stepsResponse.data;
    
            // Formater la commande avec les options
            const commandeWithOptions = {
                ...commandeComplete,
                items: commandeComplete.items.map(item => {
                    const itemWithOptions = {
                        ...item,
                        options: {}
                    };
    
                    // Pour chaque étape dans les options
                    Object.entries(item.options || {}).forEach(([stepName, optionIds]) => {
                        const step = steps.find(s => s.nom === stepName);
                        if (step) {
                            itemWithOptions.options[stepName] = step.options.filter(
                                opt => optionIds.includes(opt._id)
                            ).map(opt => ({
                                _id: opt._id,
                                nom: opt.nom,
                                prixSupplémentaire: opt.prixSupplémentaire
                            }));
                        }
                    });
    
                    return itemWithOptions;
                })
            };
    
            // Mettre à jour le mode de paiement et le statut
            await axios.patch(`https://maro.alwaysdata.net/api/orders/${id}`, {
                paymentMethod: method,
                status: "Payé"
            });
    
            // Envoyer la commande mise à jour via WebSocket
            const socket = io('https://maro.alwaysdata.net');
            socket.emit('commande mise à jour', commandeWithOptions);
    
            // Mettre à jour l'état local immédiatement
            setCommandes(prevCommandes => 
                prevCommandes.filter(commande => commande._id !== id)
            );
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
        <Modal open={isModalOpen} onClose={handleCloseModal}>
            <div style={{ backgroundColor: 'white', padding: '20px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', minWidth: '400px' }}>
                {selectedCommande && (
                    <>
                        <h2>Commande N°{selectedCommande.orderNumber}</h2>
                        <div className='mb-3'>
                        {selectedCommande && selectedCommande.items && selectedCommande.items.map((item, itemIndex) => (
                                <div key={itemIndex} className='d-flex flex-column'>
                                    <h5 className="card-title">{item.nom}</h5>
                                    <p className="card-text">{item.type}</p>
                                    {item.options && Object.entries(item.options).map(([stepName, options]) => (
                                        options && options.length > 0 && (
                                            <div key={stepName} className='mb-3'>
                                                <h6>{stepName}:</h6>
                                                <div className='d-flex flex-wrap gap-2'>
                                                    {options.map((option, optionIndex) => (
                                                        <div key={optionIndex} className='list-style-none'>
                                                            {option.nom}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    ))}
                                    <hr />
                                </div>
                            ))}
                            <p><strong>Type de commande :</strong> {selectedCommande.orderType === 'a_emporter' ? 'À emporter' : 'Sur Place'}</p>
                            <p><strong>Total :</strong> {selectedCommande.total.toFixed(2).replace('.', ',')}€</p>
                        </div>
                    </>
                )}
            </div>
        </Modal>
        </>
    );
};

export default VueComptoir;