import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import imgBornePay from '../../../assets/paiement.png';
import imgComptoir from '../../../assets/mode-de-paiement.png';
import "../Confirmation/Confirmation.css";
import PaiementForm from '../PaiementForm/PaiementForm';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import VueComptoir from '../../../VueComptoir/VueComptoir';
import Receipt from '../../../assets/receipt.png'

const OrderSummaryPage = () => {
    // const navigate = useNavigate();
    const location = useLocation();
    const navigate = useNavigate();
    const { total, orderItems, orderType, orderNumber } = location.state || {};
    const [showStripeForm, setShowStripeForm] = useState(false);
    const [ShowComptoirPayment, setShowComptoirPayment] = useState(false);
    const [paymentOption, setPaymentOption] = useState('');

    const handleBorneClick = () => {
        setShowStripeForm(true);
    };

    const handlePaymentOption = async () => {
        try {
            // Supposons que vous avez une fonction pour construire le corps de la requête
            const orderDetails = {
                items: orderItems, // Assurez-vous que cela correspond à la structure attendue par votre backend
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
            <PaiementForm total={total} orderItems={orderItems} orderType={orderType} orderNumber={orderNumber}/>
            </div>
            )}
            {ShowComptoirPayment && (
            <div>
            <button className='btn btn-lg btn-warning m-5 col-2 text-white d-flex justify-content-evenly align-items-center' onClick={() => setShowComptoirPayment(false)}><KeyboardBackspaceIcon/><div>Retour</div></button>
            <div className='text-center'>
            <h1 className='title-pay mb-5'>Commande N°{orderNumber}</h1>
            <h2 className='mb-4'>Rendez-vous au comptoir pour régler et valider votre commande.</h2>
            <h3 className='mb-5'>Total à payer: <b className='primary-color'>{total}€</b></h3>
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
