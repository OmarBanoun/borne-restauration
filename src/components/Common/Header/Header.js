import React from 'react';
import './Header.css';
import Logo  from "../../../assets/kebab-logo.png";
const Header = () => {
    return (
        <header class="text-center bg-dark h-border">
            <img src={Logo} alt="logo" class="img-logo" />
        </header>
    );
};
Header.propTypes = {};

Header.defaultProps = {};

export default Header;