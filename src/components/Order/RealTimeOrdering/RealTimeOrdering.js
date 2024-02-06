// import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';

// const socket = io('https://maro.alwaysdata.net');
// // const socket = io('http://localhost:3001');

// function RealTimeOrdering() {
//     const [orders, setOrders] = useState([]);
//     useEffect(() => {
//         // Écoute pour les nouvelles commandes confirmées
//         socket.on('order-confirmed', (newOrder) => {
//             console.log('Nouvelle commande confirmée:', newOrder);
//             setOrders((prevOrders) => [...prevOrders, newOrder]);
//         });

//         return () => {
//             socket.off('order-confirmed');
//         };
//     }, [socket]);
//     console.log(orders);

//     return (
//         <div>
//             <h2>Commandes Confirmées</h2>
//             <ul>
//                 {orders.map((order, index) => (
//                     <li key={index}>
//                         {/* Affiche les détails de la commande */}
//                         Article: {order.nom}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }

// export default RealTimeOrdering;
