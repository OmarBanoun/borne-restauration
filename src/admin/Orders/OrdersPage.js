import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import fr from 'date-fns/locale/fr';

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('Tous');
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("https://maro.alwaysdata.net/api/orders");
                setOrders(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des commandes:", error);
            }
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        let filtered = orders;
    
        if (selectedDate) {
            const startOfDay = new Date(selectedDate).setHours(0, 0, 0, 0);
            const endOfDay = new Date(selectedDate).setHours(23, 59, 59, 999);
            filtered = filtered.filter(order => {
                const orderDate = new Date(order.date).getTime();
                return orderDate >= startOfDay && orderDate <= endOfDay;
            });
        }
    
        if (paymentMethod !== 'Tous') {
            filtered = filtered.filter(order => order.paymentMethod === paymentMethod);
        }
    
        setFilteredOrders(filtered);
    }, [selectedDate, orders, paymentMethod]);
    
    const totalDesCommandes = filteredOrders.reduce((acc, order) => acc + order.total, 0);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
            <div>
                <DatePicker
                    className='my-4'
                    label="Sélectionnez une date"
                    value={selectedDate}
                    onChange={(newValue) => {
                        setSelectedDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
                <TextField
                    select
                    label="Méthode de paiement"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    helperText="Filtrer par méthode de paiement"
                    variant="outlined"
                    className='my-4'
                >
                    <MenuItem value="Tous">Tous</MenuItem>
                    <MenuItem value="Carte">Carte</MenuItem>
                    <MenuItem value="Espèce">Espèce</MenuItem>
                </TextField>
                {/* Votre tableau MUI ici, en utilisant filteredOrders pour le rendu */}
                <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Numéro de Commande</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="right">Statut</TableCell>
                        <TableCell align="right">Méthode de Paiement</TableCell>
                        {/* Ajoutez d'autres en-têtes de colonne si nécessaire */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredOrders.map((order) => (
                        <TableRow
                            key={order._id} // Utilisez un identifiant unique si disponible
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {order.orderNumber}
                            </TableCell>
                            <TableCell align="right">{order.total.toFixed(2).replace('.', ',')}€</TableCell>
                            <TableCell align="right">{order.status}</TableCell>
                            <TableCell align="right">{order.paymentMethod}</TableCell>
                            {/* Ajoutez d'autres cellules pour chaque colonne si nécessaire */}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <h3 className='my-4'>Total : {totalDesCommandes.toFixed(2).replace('.', ',')} €</h3>
            </div>
        </LocalizationProvider>
    );
};

export default OrdersList;
