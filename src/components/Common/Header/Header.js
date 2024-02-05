import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Header.css';

const Header = () => {
    const [settings, setSettings] = useState([]);

    useEffect(() => {
        axios.get('https://maro.alwaysdata.net/api/settings')
        .then(response => {
            if (Array.isArray(response.data)) {
            setSettings(response.data);
            } else {
            // Gérer le cas où la réponse n'est pas un tableau comme attendu
            console.error('La réponse de l\'API n\'est pas un tableau');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des paramètres:', error);
            // Gérer l'erreur de manière appropriée ici
        });
    }, []);

    return (
        <header className="text-center header-bg h-border">
        {settings.map((setting) => (
            <img key={setting.id} src={`https://maro.alwaysdata.net/${setting.logo}`} alt="logo" className="img-logo" />
        ))}
        </header>
    );
};

export default Header;