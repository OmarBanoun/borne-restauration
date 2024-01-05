// OrderSummary.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import "./OrderSummary.css";

const OrderSummary = ({ orderItems, onContinueOrder, onFinalizeOrder, onRemoveItem, onEditItem  }) => {
    const total = orderItems.reduce((acc, item) => {
        const extraCost = item.option === 'menu' ? 2 : 0; // Supposons que "En Menu" coûte 2€ de plus
        return acc + item.prix + extraCost;
    }, 0);
    return (
        <div>
            <div className='text-end'>
            <div className='ml-auto'>
            <button onClick={onContinueOrder} type="button" class="btn btn-warning btn-lg btn-block col-6 col-lg-3 my-auto mt-4">
                    <Link to="" className='text-white td-none'>Continuer ma commande <i class="fa-solid fa-pay"></i></Link>
                </button>
            </div>
            </div>
            <div className='text-center'>
            <h3>Récapitulatif de votre commande :</h3>
            <div className="d-flex flex-wrap justify-content-center align-items-center">
                {orderItems.map((item, index) => (
                    <div key={index} className="col-md-4 mb-3">
                        <div className="card mt-4 mx-auto">
                            <div className="card-body">
                                <h5 className="card-title">{item.nom}</h5>
                                <p className="card-text">Option choisie : {item.option === 'seul' ? 'Seul' : 'En Menu'}</p>
                                {item.drink && <p className="card-text">Boisson : {item.drink}</p>}
                                {item.garnitures && item.garnitures.length > 0 && (
                                    <p className="card-text">
                                        Garnitures : {item.garnitures.map(garniture => garniture.nom).join(', ')}
                                    </p>
                                )}
                                {item.sauces && item.sauces.length > 0 && (
                                    <p className="card-text">
                                        Sauces : {item.sauces.map(sauce => sauce.nom).join(', ')}
                                    </p>
                                )}
                                <p className="card-text">Prix : {item.prix + (item.option === 'menu' ? 2 : 0)}€</p>
                                <button onClick={() => onEditItem(index)} className="btn btn-primary">Modifier</button>
                                <button onClick={() => onRemoveItem(index)} className="btn btn-danger ml">Supprimer</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <h4 className='my-4'><strong>Total : {total}€</strong></h4>
            <div>
                <br></br>
                <button onClick={onFinalizeOrder} type="button" className="btn btn-warning btn-lg btn-block col-6 col-lg-6 my-auto finish_button">
                    <Link to="" className='text-white td-none'>Finaliser ma commande <i class="fa-solid fa-pay"></i></Link>
                </button>
            </div>
            {/* Vous pouvez ajouter plus de détails ici si nécessaire */}
            {/* <p>Total : {selectedItem.prix + (selectedOption === 'menu' ? 2 : 0)}€</p> */}
            </div>
        </div>
    );
};

export default OrderSummary;
