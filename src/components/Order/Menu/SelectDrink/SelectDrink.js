// SelectDrink.jsx
import React from 'react';
import './SelectDrink.css';

const SelectDrink = ({ drinks, onSelectDrink }) => {
    // Confirmer que SelectDrink est rendu
    console.log("Rendering SelectDrink");

    return (
        <div className='container text-center'>
            <h2 className='mb-4'>Choisissez votre boisson :</h2>
            <div className="row">
                {drinks.map((drink, index) => (
                    <div key={index} className="col-md-4" onClick={() => {
                        // Confirmer qu'une boisson est sélectionnée
                        console.log("Boisson sélectionnée :", drink.nom);
                        onSelectDrink(drink);
                    }}>
                        <div className="drink">
                            <img src={`https://maro.alwaysdata.net/${drink.imageUrl }`} alt={drink.nom} className="drink-image img-fluid" />
                            <p className='text-center'>{drink.nom}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default SelectDrink;

