import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import imgBornePay from '../../../assets/paiement.png';
import imgComptoir from '../../../assets/mode-de-paiement.png';
import "../Confirmation/Confirmation.css";
import PaiementForm from '../PaiementForm/PaiementForm';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import VueComptoir from '../../../VueComptoir/VueComptoir';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Receipt from '../../../assets/receipt.png'

const OrderSummaryPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { total, orderItems, orderType, orderNumber } = location.state || {};
    const [clientSecret, setClientSecret] = useState(null);
    const [showStripeForm, setShowStripeForm] = useState(false);
    const [ShowComptoirPayment, setShowComptoirPayment] = useState(false);

    const stripePromise = loadStripe('pk_test_51Mbm5lB8C8ofx6bDkKoz0v3ywChiFZ0dQcCeugOjSpiKqLjE3cjcQWudzXvWER6omH7yDDhoReNTC8jvmZhdMM9S00CyxoCFLd');

    const handleBorneClick = async () => {
        try {
            const montantEnCentimes = Math.round(parseFloat(total.replace(',', '.')) * 100);
            // Initialiser uniquement le paiement Stripe
            const response = await axios.post('https://maro.alwaysdata.net/api/paiement', {
                montant: montantEnCentimes,
                orderItems: orderItems,
                orderNumber: orderNumber
            });
    
            if (response.data.clientSecret) {
                setClientSecret(response.data.clientSecret);
                setShowStripeForm(true);
            }
        } catch (error) {
            console.error("Erreur lors de l'initialisation du paiement:", error);
        }
    };

    const handlePaymentOption = async () => {
        try {
            const orderDetails = {
                items: orderItems.map(item => ({
                    ...item,
                    options: item.options ? Object.entries(item.options).reduce((acc, [key, value]) => {
                        acc[key] = value.map(opt => opt._id);
                        return acc;
                    }, {}) : {}
                })),
                orderNumber,
                total: parseFloat(total.replace(',', '.')),
                orderType,
                status: "en attente",
                paymentMethod: "à définir" // Important : on met "à définir" pour que la commande apparaisse dans VueComptoir
            };
    
            const response = await axios.post("https://maro.alwaysdata.net/api/orders", orderDetails);
            
            if (response.status === 201) {
                console.log("Commande créée avec succès:", response.data);
                setShowComptoirPayment(true);
            }
        } catch (error) {
            console.error("Erreur lors de la création de la commande:", error);
        }
    };

    useEffect(() => {
        document.getElementById('root').classList.add('max-height');
    
        return () => {
            document.getElementById('root').classList.remove('max-height');
        };
    }, []);
    useEffect(() => {
        if (ShowComptoirPayment) {
            const timer = setTimeout(() => {
                navigate('/');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [ShowComptoirPayment, navigate]);
    return (
        <div className="order-summary-page">
            {!showStripeForm && !ShowComptoirPayment && (
            <div className='order-summary-page-container'>
                <h2>Comment souhaitez-vous régler votre commande ?</h2>
                <div className='order-type-selection cards-pay'>
                    <div className='card card-pay' onClick={() => handlePaymentOption('comptoir')}>
                        <img src={imgComptoir} alt='img-comptoir-pay' className='card-img-top img-fluid'/>
                        <h3 className='card-title mt-3'>Au Comptoir</h3>
                    </div>
                    <div className='card card-pay' onClick={() => handleBorneClick()}>
                        <img src={imgBornePay} alt='img-borne-pay' className='card-img-top img-fluid'/>
                        <h3 className='card-title mt-3'>À la Borne</h3>
                    </div>
                </div>
            </div>
            )}
            {showStripeForm && (
            <div>
            <button className='btn btn-lg btn-warning m-5 col-2 text-white d-flex justify-content-evenly align-items-center' onClick={() => setShowStripeForm(false)}><KeyboardBackspaceIcon/><div>Retour</div></button>
            <h1 className='text-center title-pay mb-5'>Commande N°{orderNumber}</h1>
            <h2 className='text-center'>Paiement (Test)</h2>
            <h3 className='text-center'>Total : {total}€</h3>
            <Elements stripe={stripePromise} options={{clientSecret: clientSecret}}>
            <PaiementForm total={total} orderItems={orderItems} orderType={orderType} orderNumber={orderNumber} />
            </Elements>
            </div>
            )}
            {ShowComptoirPayment && (
            <div>
            <button className='btn btn-lg btn-warning m-5 col-2 text-white d-flex justify-content-evenly align-items-center' onClick={() => setShowComptoirPayment(false)}><KeyboardBackspaceIcon/><div>Retour</div></button>
            <div className='text-center'>
            <h1 className='title-pay mb-5'>Commande N°{orderNumber}</h1>
            <h1 className='mb-5'>Total à payer: <b className='primary-color'>{total}€</b></h1>
            <h2 className='mb-4'>Rendez-vous au comptoir pour régler et valider votre commande.</h2>
            <h4 className='mb-4'>Veuillez récuper votre ticket</h4>
            <img src={Receipt} alt='receipt' className='img-fluid my-3'/>
            <h4>Merci pour votre commande !</h4>
            </div>
            </div>
            )}
        </div>
    );
};

export default OrderSummaryPage;
