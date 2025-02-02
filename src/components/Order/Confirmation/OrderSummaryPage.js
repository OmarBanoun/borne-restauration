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
    // const navigate = useNavigate();
    const location = useLocation();
    const navigate = useNavigate();
    const { total, orderItems, orderType, orderNumber } = location.state || {};
    const [clientSecret, setClientSecret] = useState(null);
    const [showStripeForm, setShowStripeForm] = useState(false);
    const [ShowComptoirPayment, setShowComptoirPayment] = useState(false);
    const [paymentOption, setPaymentOption] = useState('');

    const stripePromise = loadStripe('pk_test_51Mbm5lB8C8ofx6bDkKoz0v3ywChiFZ0dQcCeugOjSpiKqLjE3cjcQWudzXvWER6omH7yDDhoReNTC8jvmZhdMM9S00CyxoCFLd');

    // const handleBorneClick = () => {
    //     setShowStripeForm(true);
    // };
    const handleBorneClick = async () => {
        // Ici, obtenez le clientSecret depuis votre backend avant d'afficher le formulaire
        try {
            const montantEnCentimes = Math.round(parseFloat(total.replace(',', '.')) * 100);
            const response = await axios.post('https://maro.alwaysdata.net/api/paiement', {montant: montantEnCentimes, orderItems: orderItems, orderNumber: orderNumber});
            const data = response.data;
            setClientSecret(data.clientSecret); // Stockez le clientSecret obtenu
            setShowStripeForm(true); // Affichez le formulaire seulement après avoir obtenu le clientSecret
        } catch (error) {
            console.error("Erreur lors de la récupération du clientSecret:", error);
        }
    };

    const handlePaymentOption = async () => {
        try {
            const orderDetails = {
                items: orderItems.map(item => ({
                    ...item,
                    garnitures: item.garnitures ? item.garnitures.map(garniture => garniture.nom) : [],
                    sauces: item.sauces ? item.sauces.map(sauce => sauce.nom) : [],
                    supplements: item.supplements ? item.supplements.map(supplement => supplement.nom) : [],
                })),
                orderNumber,
                total: parseFloat(total.replace(',', '.')), // Convertir en nombre si nécessaire
                orderType, // ou toute autre information nécessaire
                status: "en attente", // Marquer la commande comme en attente
                paymentMethod: "à définir", // Indiquer que le paiement se fera au comptoir
            };
    
            const response = await axios.post("https://maro.alwaysdata.net/api/orders", orderDetails);
            if (response.status === 201) {
                console.log("Commande créée avec succès:", response.data);
                setShowComptoirPayment(true); // Afficher l'UI pour le paiement au comptoir
            }
        } catch (error) {
            console.error("Erreur lors de la création de la commande:", error);
        }
    };
    

    // const handlePaymentOption = () => {
    //     // Traiter le choix de paiement ici (option: 'comptoir' ou 'borne')
    //     // console.log("Option de paiement choisie :", option);
    //     // setPaymentOption(option);
    //     // Rediriger vers la page appropriée ou afficher un message de confirmation
    //     // navigate('/confirmation');
    //     setShowComptoirPayment(true);
    // };
    useEffect(() => {
        // Ajouter la classe quand le composant est monté
        document.getElementById('root').classList.add('max-height');
    
        // Retirer la classe quand le composant est démonté
        return () => {
            document.getElementById('root').classList.remove('max-height');
        };
    }, []);
    useEffect(() => {
        if (ShowComptoirPayment) {
            const timer = setTimeout(() => {
                navigate('/'); // Redirection vers la page d'accueil
            }, 5000); // Redirection après 5 secondes

            return () => clearTimeout(timer); // Nettoyer le timer si le composant est démonté avant la redirection
        }
    }, [ShowComptoirPayment, navigate]);
    return (
        <div className="order-summary-page">
            {!showStripeForm && !ShowComptoirPayment && (
            <div className='order-summary-page-container'>
                {/* <p>Type de commande: {orderType === 'sur_place' ? 'Sur Place' : 'À Emporter'}</p> */}
                {/* Afficher les détails des éléments de commande ici */}
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
