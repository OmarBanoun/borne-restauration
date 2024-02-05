import React, { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('https://maro.alwaysdata.net');

function RealTimeOrdering(orderItems) {
    useEffect(() => {
        socket.on('commande', (commande) => {
            // Mettez à jour votre état ici pour afficher la commande
            console.log(commande);
        });

        return () => socket.off('commande');
    }, []);

    return (
        <div>
            <h1>Commande en cours</h1>
            {/* Affichez ici le contenu de la commande en cours */}
            <p>Contenu de la commande en cours</p>
            <p>{orderItems}</p>
        </div>
    );
}

export default RealTimeOrdering;
