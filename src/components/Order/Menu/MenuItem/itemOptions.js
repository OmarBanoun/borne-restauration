import React from 'react';

const ItemOptions = ({ item, onOptionSelect }) => {
    return (
        <div className='text-center centrage'>
            <h3>{item.nom}</h3>
            <h5>Comment souhaitez-vous votre {item.nom}?</h5>
            <button className='btn btn-warning btn-lg text-white optionButton' onClick={() => onOptionSelect(item, 'seul')}>Seul</button>
            <button className='btn btn-warning btn-lg text-white optionButton' onClick={() => onOptionSelect(item, 'menu')}>En Menu (+2€)</button>
        </div>
    );
};

export default ItemOptions;
