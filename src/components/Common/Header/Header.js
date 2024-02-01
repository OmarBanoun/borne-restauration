import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Header.css';

const Header = () => {
    const [settings, setSettings] = useState([]);
    useEffect(() => {
        axios.get('https://maro.alwaysdata.net/api/settings')
            .then(response => {
                setSettings(response.data);
            })
    })
    return (
        <header className="text-center bg-dark h-border">
            {settings.map((setting) => (
                <img src={`https://maro.alwaysdata.net/${setting.logo}`} alt="logo" className="img-logo" />
            ))}
            
        </header>
    );
};
export default Header;