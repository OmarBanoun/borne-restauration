import React from 'react';
import SeulIcon from '@mui/icons-material/LunchDining';
import MenuIcon from '@mui/icons-material/Fastfood';
import './MenuItem.css';

const ItemOptions = ({ item, onOptionSelect }) => {
    const handleOptionClick = (option) => {
        onOptionSelect(item, option);
    };

    return (
        <div className='text-center centrage'>
            <h3>{item.nom}</h3>
            <h4>Comment souhaitez-vous votre {item.nom} ?</h4>
            <button 
                className='btn btn-option btn-lg text-white optionButton' 
                onClick={() => handleOptionClick('seul')}
            >
                <SeulIcon fontSize='large'/><br/>
                Seul <br/> {item.prix.toFixed(2).replace(".", ",")}€
            </button>
            <button 
                className='btn btn-option btn-lg text-white optionButton' 
                onClick={() => handleOptionClick('menu')}
            >
                <MenuIcon fontSize='large' /><br/>
                En Menu (+2€)
            </button>
        </div>
    );
};

export default ItemOptions;