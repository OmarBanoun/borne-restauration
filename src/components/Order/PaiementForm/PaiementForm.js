import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import '../PaiementForm/PaiementForm.css';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';

const PaiementForm = ({total, orderItems}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [isPaying, setIsPaying] = useState(false);

    const printTicket = (orderItems, total) => {
        let ticketContent = '<h3>Votre Commande</h3>';
      
        orderItems.forEach(item => {
            const prixFinal = item.prix + (item.option === 'menu' ? 2 : 0);
            const optionText = item.option === 'menu' ? '(en menu)' : '(Seul)';
            ticketContent += `<p>${item.nom} ${optionText} - ${prixFinal}€</p>`;
            if (item.garnitures && item.garnitures.length > 0) {
                const garnitureNames = item.garnitures.map(g => g.nom).join(', ');
                ticketContent += `<p>Garnitures: ${garnitureNames}</p>`;
            }
            if (item.sauces && item.sauces.length > 0) {
                const sauceNames = item.sauces.map(s => s.nom).join(', ');
                ticketContent += `<p>Sauces: ${sauceNames}</p>`;
            }
            if (item.drink) {
                ticketContent += `<p>Boisson: ${item.drink}</p>`;
                }
                ticketContent += '<p>----------------------</p>';
        });
      
        ticketContent += `<p>Total: ${total}€</p>`;
      
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`<html><head><title>Impression du Ticket</title></head><body>${ticketContent}</body></html>`);
        printWindow.document.close();
        printWindow.print();
      };
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }
        setIsPaying(true); 

        const cardElement = elements.getElement(CardElement);
        try {
            const montant = total * 100;
            const { clientSecret } = await createPaymentIntent(montant);

            const paymentResult = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (paymentResult.error) {
                console.log('[Erreur de paiement]', paymentResult.error);
                setAlert({ show: true, message: `Erreur de paiement: ${paymentResult.error.message}`, type: 'danger' });
                setIsPaying(false);
            } else {
                console.log('[Paiement réussi]', paymentResult);
                setIsPaying(false);
                setAlert({ show: true, message: 'Paiement réussi', type: 'success' });
                printTicket(orderItems, total);
                // rediriger vers la page d'accueil sans utiliser hisotry
                window.location.href = "/";
                // Traitez ici le succès du paiement (ex: redirection, affichage d'un message, etc.)
            }
        } catch (error) {
            console.error('Erreur lors de la création du PaymentIntent:', error);
            setIsPaying(false);
        }
    };

    const createPaymentIntent = async (montant) => {
        try {
            const response = await axios.post("https://maro.alwaysdata.net/api/paiement", { montant });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création du PaymentIntent:', error);
            throw error;
        }
    };


    return (
        <>
        {alert.show && <Alert className='alert-bp' variant={alert.type}>{alert.message}</Alert>}
        <form id='payment-form' onSubmit={handleSubmit}>
            <CardElement options={{hidePostalCode: true}}/>
            <button type="submit" disabled={!stripe || isPaying}>
            {isPaying ? <Spinner animation="border" variant="warning" /> : 'Payer'}
        </button>
        {isPaying && <div className='text-center'>En cours de traitement, veuillez patienter...</div>}
        </form>
        </>
    );
};

export default PaiementForm;
