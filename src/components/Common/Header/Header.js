import React from 'react';
import './Header.css';
import Logo  from "../../../assets/kebab-logo.png";
const Header = () => {
    return (
        <header className="text-center bg-dark h-border">
            <img src={Logo} alt="logo" className="img-logo" />
        </header>
    );
};
export default Header;