import React, { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://maro.alwaysdata.net'); // Adaptez l'URL selon votre configuration

function RealTimeOrdering() {
    useEffect(() => {
        socket.on('commande', (commande) => {
            // Mettez à jour votre état ici pour afficher la commande
            console.log(commande);
        });

        return () => socket.off('commande');
    }, []);

    return (
        <div>
            {/* Affichez les commandes en temps réel ici */}
        </div>
    );
}

export default RealTimeOrdering;
