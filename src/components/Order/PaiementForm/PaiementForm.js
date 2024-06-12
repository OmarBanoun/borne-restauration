import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import './PaiementForm.css';
import { useNavigate } from 'react-router-dom';
import { Alert, Spinner } from 'react-bootstrap';

const PaiementForm = ({ total, orderItems, orderType, orderNumber }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [isPaying, setIsPaying] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }
        setIsPaying(true);

        try {
            const paymentResult = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: 'http://localhost:3000',
                },
                redirect: 'if_required',
            });

            if (paymentResult.error) {
                setAlert({ show: true, message: `Erreur de paiement: ${paymentResult.error.message}`, type: 'danger' });
                setIsPaying(false);
            } else if (paymentResult.paymentIntent && paymentResult.paymentIntent.status === 'succeeded') {
                setAlert({ show: true, message: 'Paiement réussi', type: 'success' });
                const totalNumerique = parseFloat(total.replace(',', '.'));
                // Assurez-vous que orderNumber est un nombre
                const orderNumberNumerique = parseInt(orderNumber, 10);
                await sendOrderToBackend(orderItems, totalNumerique, "Carte", orderNumberNumerique);
                console.log("Envoi des données d'impression au backend...");
                await sendPrintDataToBackend(orderItems, total, orderType);
                await confirmPaymentAndEmitEvent(paymentResult.paymentIntent.id, orderItems, orderNumber);
                navigate("/");
            }
        } catch (error) {
            console.error('Erreur lors de la création du PaymentIntent:', error);
            setAlert({ show: true, message: 'Erreur lors du paiement', type: 'danger' });
            setIsPaying(false);
        }
    };

    const sendOrderToBackend = async (orderItems, total, paymentMethod, orderNumber) => {
        try {
            const response = await axios.post("https://maro.alwaysdata.net/api/orders", {
                items: orderItems,
                total,
                orderNumber,
                paymentMethod, // "Carte" pour les paiements à la borne
                status: "Payé"
            });
            if (response.status === 201) {
                console.log("Commande enregistrée avec succès:", response.data);
                // Ici, vous pouvez gérer la réussite de l'enregistrement
            } else {
                console.error("La commande n'a pas été enregistrée:", response.data);
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi de la commande au backend:", error);
        }
    };

    // const sendPrintDataToBackend = async (orderItems, total, orderType) => {
    //     try {
    //         await axios.post("https://maro.alwaysdata.net/api/print", {
    //             items: orderItems,
    //             total: total,
    //             orderType: orderType,
    //         });
            
    //         console.log('Commande envoyée au backend pour impression');
    //     } catch (error) {
    //         console.error('Erreur lors de l’envoi de la commande pour impression:', error);
    //     }
    // };
    // const sendPrintDataToBackend = async (orderItems, total, orderType) => {
    //     try {
    //         const response = await axios.post("https://maro.alwaysdata.net/api/print", {
    //             items: orderItems,
    //             total: total,
    //             orderType: orderType,
    //         });
    
    //         if (response.status === 200) {
    //             console.log('Commande envoyée au backend pour impression');
    //         } else {
    //             console.error('La réponse du backend n\'est pas correcte:', response.data);
    //         }
    //     } catch (error) {
    //         console.error('Erreur lors de l’envoi de la commande pour impression:', error);
    //     }
    // };
    const sendPrintDataToBackend = async (orderItems, total, orderType) => {
        try {
            const response = await axios.post("https://maro.alwaysdata.net/api/print-order", {
                items: orderItems,
                total: total,
                orderType: orderType,
            });
    
            if (response.status === 200) {
                console.log('Commande envoyée au backend pour impression');
            } else {
                console.error('La réponse du backend n\'est pas correcte:', response.data);
            }
        } catch (error) {
            console.error('Erreur lors de l’envoi de la commande pour impression:', error);
        }
    };
    
    

    const confirmPaymentAndEmitEvent = async (paymentIntentId, orderItems, orderNumber) => {
        try {
            const response = await axios.post("https://maro.alwaysdata.net/api/payment-confirmed", {
                paymentIntentId,
                orderItems,
                orderNumber
            });
    
            if (response.status === 200) {
                console.log("Paiement confirmé, websocket émis :", response.data.message);
                // Ici, vous pouvez gérer la suite, comme rediriger l'utilisateur vers une page de succès
            } else {
                console.error("Paiement non confirmé :", response.data.message);
                // Gérez l'échec du paiement ici
            }
        } catch (error) {
            console.error("Erreur lors de la confirmation du paiement :", error.response.data.message);
        }
    };
    

    return (
        <>
        {alert.show && <Alert className='alert-bp' variant={alert.type}>{alert.message}</Alert>}
        <form id='payment-form' onSubmit={handleSubmit}>
            <PaymentElement options={{hidePostalCode: true, layout: 'tabs'}}/>
            <button type="submit" disabled={!stripe || isPaying}>
            {isPaying ? <Spinner animation="border" variant="warning" /> : 'Payer'}
            </button>
            {isPaying && <div className='text-center'>En cours de traitement, veuillez patienter...</div>}
        </form>
        </>
    );
};

export default PaiementForm;
