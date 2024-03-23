import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import orderType from '../Menu/Menu';

const socket = io('https://maro.alwaysdata.net');

function RealTimeOrdering() {
    const [orders, setOrders] = useState([]);
    const [readyOrders, setReadyOrders] = useState([]); 
    const orderType = localStorage.getItem('orderType');
    // const orderNumber = localStorage.getItem('orderNumber');
    useEffect(() => {
        // Écoute pour les nouvelles commandes confirmées
        socket.on('order-confirmed', (newOrder) => {
            console.log('Nouvelle commande confirmée:', newOrder);
            // Vérifie si newOrder est un tableau de tableaux et l'aplatit si nécessaire
            // const flattenedOrders = newOrder.flat();
            // setOrders(prevOrders => [...prevOrders, ...flattenedOrders]);
            // setOrders(prevOrders => [...prevOrders, newOrder]);
            const orderArray = Array.isArray(newOrder) ? newOrder : [newOrder];
            setOrders(prevOrders => [...prevOrders, ...orderArray]);
        });
    
        return () => {
            socket.off('order-confirmed');
        };
    }, [socket]);
    console.log(orders);

    const handleReadyClick = (orderIndex) => {
        const newReadyOrder = orders[orderIndex]; // Sélectionner la commande à déplacer
        setReadyOrders([...readyOrders, newReadyOrder]); // Ajouter la commande à la liste des commandes prêtes
        setOrders(orders.filter((_, index) => index !== orderIndex)); // Retirer la commande de la liste des commandes confirmées
    };
    const handleServedClick = (index) => {
        const newReadyOrders = readyOrders.filter((_, i) => i !== index);
        setReadyOrders(newReadyOrders);
    };

    return (
        <div>
            <div className='row'>
            <div className='col-6'>
            <h2 className='my-5 text-center'>Commandes Confirmées <i class="fa-regular fa-hourglass-half pt-1 primary-color" style={{ marginLeft: '15px' }}></i></h2>
            <ul className='d-flex flex-wrap' style={{ borderRight: '3px solid var(--primary-color)', minHeight: '500px' }}> {/* Ajout de flex-wrap pour une meilleure mise en page si nécessaire */}
            {orders.map((order, index) => (
                <li key={index} className="card my-2">
                    <div className="card-body">
                        <h4 className='card-title'>N°{order.orderNumber}</h4>
                        {order.orderItems && order.orderItems.map((item, itemIndex) => ( // Itérer sur chaque article dans orderItems
                            <div key={itemIndex}> {/* Utilisez un identifiant unique pour la clé si disponible */}
                                <h5 className="card-title">{item.nom}</h5>
                                <p className="card-text">{item.option}</p>
                                {item.pain && (
                                    <div className='mb-3'>
                                        <h6>Pain:</h6>
                                        <p className="card-text">{item.pain}</p>
                                    </div>
                                )}
                                {item.garnitures && item.garnitures.length > 0 && (
                                    <div className='mb-3'>
                                        <h6>Garnitures:</h6>
                                        {item.garnitures.map((garniture, garnitureIndex) => (
                                            <div className='list-style-none' key={garnitureIndex}>{garniture.nom}</div>
                                        ))}
                                    </div>
                                )}
                                {item.sauces && item.sauces.length > 0 && (
                                    <div className='mb-3'>
                                        <h6>Sauces:</h6>
                                        {item.sauces.map((sauce, sauceIndex) => (
                                            <div key={sauceIndex}>{sauce.nom}</div>
                                        ))}
                                    </div>
                                )}
                                {item.drink && (
                                    <div className='mb-3'>
                                        <h6>Boisson:</h6>
                                        <p className="card-text">{item.drink}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                        <hr />
                        <p className="card-text">{orderType === 'a_emporter' ? 'À emporter' : 'Sur Place'}</p>
                    </div>
                    {/* bouton avec une icone de check mui */}
                    <button className="btn btn-success d-flex justify-content-evenly align-items-center col-8 mx-auto mb-2" onClick={() => handleReadyClick(index)}>Prêt <i className="fas fa-check text-white pt-1"></i></button>
                </li>
            ))}
        </ul>
        </div>
        
        <div className='col-6'>
        <h2 className='my-5 text-center'>Commandes Prêtes <i className="fas fa-square-check text-success pt-1" style={{ marginLeft: '15px' }}></i></h2>
        <ul className='d-flex flex-wrap'>
        {readyOrders.map((order, index) => (
            <li key={index} className="card my-2">
                {/* Affichez les détails de la commande prête ici */}
                <div className="card-body">
                    <h4 className='card-title'>N°{order.orderNumber}</h4>
                    {order.orderItems.map((item, itemIndex) => (
                        <div key={itemIndex}>
                            <h5 className="card-title">{item.nom}</h5>
                            <p className="card-text">{item.option}</p>
                            <button className="btn btn-success d-flex justify-content-evenly align-items-center col-8 mx-auto mb-2" onClick={() => handleServedClick(index)} >Servi <i className="fas fa-check text-white pt-1"></i></button>
                        </div>
                    ))}
                </div>
            </li>
        ))}
    </ul>
    </div>
        </div>
    </div>
    );    
}

export default RealTimeOrdering;
