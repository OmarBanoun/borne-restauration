import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('https://maro.alwaysdata.net');
// const socket = io('http://localhost:3001');

function RealTimeOrdering() {
    const [orders, setOrders] = useState([]);
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
            <ul>
            {orders.map((order) => (
                <li key={order._id} className="card my-2">
                    <div className="card-body">
                        <h5 className="card-title">{order.nom}</h5>
                        <p className="card-text">{order.categorie.nom}</p>
                        {/* afficher le nom du pain si il y en a un */}
                        {order.pain && (
                            <div>
                            <h6>Pain:</h6>
                            <ul>
                                <p className="card-text">{order.pain}</p>
                            </ul>
                            </div>
                        )}
                        {/* Affichage des garnitures */}
                        {order.garnitures && order.garnitures.length > 0 && (
                            <div>
                                <h6>Garnitures:</h6>
                                <ul>
                                    {order.garnitures.map((garniture, index) => (
                                        <li className='list-style-none' key={index}>{garniture.nom}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {order.sauces && order.sauces.length > 0 && (
                            <div>
                                <h6>Sauces:</h6>
                                <ul>
                                    {order.sauces.map((sauce, index) => (
                                        <li key={index}>{sauce.nom}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    </div>
    );
}

export default RealTimeOrdering;
