import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import orderType from '../Menu/Menu';

const socket = io('https://maro.alwaysdata.net');
// const socket = io('http://localhost:3001');

function RealTimeOrdering() {
    const [orders, setOrders] = useState([]);
    const orderType = localStorage.getItem('orderType');
    // const orderNumber = localStorage.getItem('orderNumber');
    useEffect(() => {
        // Écoute pour les nouvelles commandes confirmées
        socket.on('order-confirmed', (newOrder) => {
            console.log('Nouvelle commande confirmée:', newOrder);
            // Vérifie si newOrder est un tableau de tableaux et l'aplatit si nécessaire
            // const flattenedOrders = newOrder.flat();
            // setOrders(prevOrders => [...prevOrders, ...flattenedOrders]);
            setOrders(prevOrders => [...prevOrders, newOrder]);
        });
    
        return () => {
            socket.off('order-confirmed');
        };
    }, [socket]);
    console.log(orders);

    return (
        <div className='container'>
            <h2 className='my-5'>Commandes Confirmées</h2>
            <ul className='d-flex flex-wrap'> {/* Ajout de flex-wrap pour une meilleure mise en page si nécessaire */}
            {orders.map((order, index) => (
                <li key={index} className="card my-2">
                    <div className="card-body">
                        <h4 className='card-title'>N°{order.orderNumber}</h4>
                        {order.orderItems.map((item, itemIndex) => ( // Itérer sur chaque article dans orderItems
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
                </li>
            ))}
        </ul>
    </div>
    );    
}

export default RealTimeOrdering;
