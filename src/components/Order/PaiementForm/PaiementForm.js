import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import '../PaiementForm/PaiementForm.css';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
// import imgLogo from '../../../assets/kebab-logo.png';

const PaiementForm = ({total, orderItems, orderType, orderNumber}) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [isPaying, setIsPaying] = useState(false);

    // const printTicket = (orderItems, total, orderType) => {
    //     let ticketContent = `<div style="display:flex;justify-content:center;"><img src='${imgLogo}' style="width:45%;"><img/></div>`;
    //     ticketContent += '<div><p style="text-align:center;margin-bottom:45px;">Restaurant Kebab de la Gare<br>6 rue Turgot - 78500 Sartrouville<br>01.39.40.41.42 - www.kebabdelagare.fr</p></div>';
    //     ticketContent += `<hr>`;
    //     ticketContent += '<h3>Votre Commande</h3>';
    //     orderItems.forEach(item => {
    //         const prixFinal = item.prix + (item.option === 'menu' ? 2 : 0);
    //         const optionText = item.option === 'menu' ? '(en menu)' : '(Seul)';
    //         ticketContent += `<p>${item.nom} ${optionText} - ${prixFinal}€</p>`;
    //         if (item.garnitures && item.garnitures.length > 0) {
    //             const garnitureNames = item.garnitures.map(g => g.nom).join(', ');
    //             ticketContent += `<p>Garnitures: ${garnitureNames}</p>`;
    //         }
    //         if (item.sauces && item.sauces.length > 0) {
    //             const sauceNames = item.sauces.map(s => s.nom).join(', ');
    //             ticketContent += `<p>Sauces: ${sauceNames}</p>`;
    //         }
    //         if (item.drink) {
    //             ticketContent += `<p>Boisson: ${item.drink}</p>`;
    //             }
    //             ticketContent += '<p">----------------------------</p>';
    //     });
    //     ticketContent += `<p style="margin-top:40px;">Type de commande : ${orderType === 'sur_place' ? 'Sur Place' : 'À Emporter'}</p>`;
    //     ticketContent += `<strong>TOTAL: ${total}€</strong>`;
    //     ticketContent += `<hr>`;
    //     ticketContent += `<p style="margin-top:100px;">*************************************</p>`;
    //     ticketContent += `<h4>Merci de votre visite ! À bientôt =)</h4>`;
    //     ticketContent += `<p>*************************************</p>`;
    //     const printWindow = window.open('', '_blank');
    //     printWindow.document.write(`<html><head><title>Impression du Ticket</title></head><body style="width:320px;text-align:left">${ticketContent}</body></html>`);
    //     printWindow.document.close();
    //     printWindow.print();
    //   };
    // const handleSubmit = () => {
    //     printTicket(orderItems, total, orderType);
    // }
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }
        setIsPaying(true); 

        const cardElement = elements.getElement(CardElement);
        try {
            const montant = parseFloat(total.replace(',', '.')) * 100;
            const { clientSecret } = await createPaymentIntent(montant, orderItems);

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
                const totalNumerique = parseFloat(total.replace(',', '.'));
                // Assurez-vous que orderNumber est un nombre
                const orderNumberNumerique = parseInt(orderNumber, 10);
                await sendOrderToBackend(orderItems, totalNumerique, "Carte", orderNumberNumerique);
                // Envoyer les détails de la commande au backend
                await sendPrintDataToBackend(orderItems, total, orderType);
                // printTicket(orderItems, total, orderType);
                navigate("/");
                // Traitez ici le succès du paiement (ex: redirection, affichage d'un message, etc.)
            }
        } catch (error) {
            console.error('Erreur lors de la création du PaymentIntent:', error);
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
    

    const sendPrintDataToBackend = async (orderItems, total, orderType) => {
        try {
            await axios.post("https://maro.alwaysdata.net/api/print", {
                items: orderItems,
                total: total,
                orderType: orderType,
            });
            
            console.log('Commande envoyée au backend');
        } catch (error) {
            console.error('Erreur lors de l’envoi de la commande:', error);
        }
    };

    const createPaymentIntent = async (montant, orderItems) => {
        try {
            const response = await axios.post("https://maro.alwaysdata.net/api/paiement", { montant, orderItems, orderNumber });
            // const response = await axios.post("http://localhost:3001/api/paiement", { montant, orderItems });
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
        {/* boutton submit */}:
        {/* <button type="submit" className="btn btn-warning btn-lg btn-block col-6 col-lg-3 my-auto" onClick={handleSubmit}>Payer</button> */}
        </>
    );
};

export default PaiementForm;