import React from 'react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Importez useHistory si vous utilisez React Router
import imgBornePay from '../../../assets/paiement.png';
import imgComptoir from '../../../assets/mode-de-paiement.png';
import "../Confirmation/Confirmation.css";
import PaiementForm from '../PaiementForm/PaiementForm';

const OrderSummaryPage = ({ orderType }) => {
    // const navigate = useNavigate();
    const location = useLocation();
    const { total, orderItems } = location.state || {};
    const [showStripeForm, setShowStripeForm] = useState(false);
    const [paymentOption, setPaymentOption] = useState('');

    const handleBorneClick = () => {
        setShowStripeForm(true);
    };

    const handlePaymentOption = (option) => {
        // Traiter le choix de paiement ici (option: 'comptoir' ou 'borne')
        console.log("Option de paiement choisie :", option);
        setPaymentOption(option);
        // Rediriger vers la page appropriée ou afficher un message de confirmation
        // navigate('/confirmation');
    };
    return (
        <div className="order-summary-page">
            {!showStripeForm && (
            <div className='order-summary-page-container'>
                {/* <p>Type de commande: {orderType === 'sur_place' ? 'Sur Place' : 'À Emporter'}</p> */}
                {/* Afficher les détails des éléments de commande ici */}
                {/* ... */}
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
            <h2 className='text-center title-pay'>Paiement (Test)</h2>
            <PaiementForm total={total} orderItems={orderItems}/>
            </div>
            )}
        </div>
    );
};

export default OrderSummaryPage;
