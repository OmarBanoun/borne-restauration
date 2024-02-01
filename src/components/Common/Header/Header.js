import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Header.css';

const Header = () => {
    // const [primaryColor, setPrimaryColor] = useState('');
    // const [secondaryColor, setSecondaryColor] = useState('');
    const [settings, setSettings] = useState([]);

    useEffect(() => {
        axios.get('https://maro.alwaysdata.net/api/settings')
        .then(response => {
          // Assurez-vous que la réponse correspond à ce que vous attendez
            // setPrimaryColor(response.data[0].themePrimaryColor);
            // setSecondaryColor(response.data[0].themeSecondaryColor);
            setSettings(response.data);
        })
        .catch(error => console.log(error));
    }, []);
    return (
        <header className="text-center header-bg h-border">
            {settings.map((setting) => (
                <img src={`https://maro.alwaysdata.net/${setting.logo}`} alt="logo" className="img-logo" />
            ))}
            
        </header>
    );
};
export default Header;