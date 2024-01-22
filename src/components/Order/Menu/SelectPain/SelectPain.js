// SelectDrink.jsx
import React from 'react';

const SelectPain = ({ pains, onSelectPain }) => {

    return (
        <div className='container text-center'>
            <h3 className='mb-4'>Choisissez votre pain :</h3>
            <div className="row">
                {pains.map((pain, index) => (
                    <div key={index} className="col-md-4" onClick={() => {
                        // Confirmer qu'une boisson est sélectionnée
                        console.log("Pain sélectioné :", pain.nom);
                        onSelectPain(pain);
                    }}>
                        <div className="drink">
                            <img src={pain.imageUrl} alt={pain.nom} className="garniture-image img-fluid" />
                            <p className='text-center name-item'>{pain.nom}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default SelectPain;

