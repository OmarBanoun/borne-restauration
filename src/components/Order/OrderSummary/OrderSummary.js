// OrderSummary.jsx
import React from 'react';
// import { Link } from 'react-router-dom';
import "./OrderSummary.css";

const OrderSummary = ({ orderItems, onEditItem, onRemoveItem, onFinalizeOrder }) => {
    console.log("Order Items dans OrderSummary:", orderItems);

    return (
        <div className='summary-section mb-0'>
            <div className='order-product d-flex flex-row col-8'>
                {orderItems.map((item, index) => (
                    <div key={index} className="mb-4">
                        <div className="card mt-4">
                        <div className='d-flex justify-content-end'>
                            <button onClick={() => onRemoveItem(index)} className="d-flex btn text-danger"><strong>❌</strong></button>
                        </div>
                        
                            <img src={item.imageUrl} alt={item.nom} className="card-img-top img-fluid" />
                            <div className="card-body">
                                <h5 className="card-title">{item.nom}</h5>
                                {item.categorie !== 'Dessert' && (
                                    <p className="card-text">Option : {item.option === 'seul' ? 'Seul' : 'En Menu'}</p>
                                )}
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
                                {item.pain && <p className="card-text">Pain : {item.pain}</p>}
                                <p className="card-text">Prix : {item.prix + (item.option === 'menu' ? 2 : 0)}€</p>
                                {/* <button onClick={() => onEditItem(index)} className="btn btn-primary">Modifier</button>
                                <button onClick={() => onRemoveItem(index)} className="btn btn-danger ml">Supprimer</button> */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className='order-price my-auto text-center col-4'>
                <div className='border-button'>
                <button onClick={onFinalizeOrder} type="button" className="btn btn-warning btn-lg btn-block my-auto finish_button">
                    <div className='text-white td-none px-3'>Finaliser ma commande</div>
                </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
