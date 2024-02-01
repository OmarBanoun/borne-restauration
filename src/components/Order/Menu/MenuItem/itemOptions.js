import React from 'react';
import SeulIcon from '@mui/icons-material/LunchDining';
import MenuIcon from '@mui/icons-material/Fastfood';
import './MenuItem.css';

const ItemOptions = ({ item, onOptionSelect }) => {
    return (
        <div className='text-center centrage'>
            <h3>{item.nom}</h3>
            <h5>Comment souhaitez-vous votre {item.nom}?</h5>
            <button className='btn btn-option btn-lg text-white optionButton' onClick={() => onOptionSelect(item, 'seul')}><SeulIcon fontSize='large'/><br/>Seul</button>
            <button className='btn btn-option btn-lg text-white optionButton' onClick={() => onOptionSelect(item, 'menu')}><MenuIcon fontSize='large' /><br/>En Menu (+2€)</button>
        </div>
    );
};

export default ItemOptions;
