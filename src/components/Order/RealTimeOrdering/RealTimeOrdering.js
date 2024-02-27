import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import orderType from '../Menu/Menu';

const socket = io('https://maro.alwaysdata.net');
// const socket = io('http://localhost:3001');

function RealTimeOrdering() {
    const [orders, setOrders] = useState([]);
    const orderType = localStorage.getItem('orderType');
    useEffect(() => {
        // Écoute pour les nouvelles commandes confirmées
        socket.on('order-confirmed', (newOrder) => {
            console.log('Nouvelle commande confirmée:', newOrder);
            // Vérifie si newOrder est un tableau de tableaux et l'aplatit si nécessaire
            const flattenedOrders = newOrder.flat();
            setOrders(prevOrders => [...prevOrders, ...flattenedOrders]);
        });
    
        return () => {
            socket.off('order-confirmed');
        };
    }, [socket]);
    console.log(orders);

    return (
        <div className='container'>
            <h2 className='my-5'>Commandes Confirmées</h2>
            <ul className='d-flex'>
            {orders.map((order) => (
                <li key={order._id} className="card my-2">
                    <div className="card-body">
                        <h5 className="card-title">{order.nom}</h5>
                        <p className="card-text">{order.option}</p>
                        {/* afficher le nom du pain si il y en a un */}
                        {order.pain && (
                            <div className='mb-3'> 
                            <h6>Pain:</h6>
                            <p className="card-text">{order.pain}</p>
                            </div>
                        )}
                        {/* Affichage des garnitures */}
                        {order.garnitures && order.garnitures.length > 0 && (
                            <div className='mb-3'>
                                <h6>Garnitures:</h6>
                                    {order.garnitures.map((garniture, index) => (
                                        <div className='list-style-none' key={index}>{garniture.nom}</div>
                                    ))}
                            </div>
                        )}
                        {order.sauces && order.sauces.length > 0 && (
                            <div className='mb-3'>
                                <h6>Sauces:</h6>
                                    {order.sauces.map((sauce, index) => (
                                        <div key={index}>{sauce.nom}</div>
                                    ))}
                            </div>
                        )}
                        {order.drink && (
                            <div className='mb-3'> 
                            <h6>Boisson:</h6>
                            <p className="card-text">{order.drink}</p>
                            </div>
                        )}
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
