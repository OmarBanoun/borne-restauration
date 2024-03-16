// SelectDrink.jsx
import React from 'react';

const SelectPain = ({ pains, onSelectPain }) => {

    return (
        <div className='container text-center'>
            <h2 className='mb-4'>Choisissez votre pain :</h2>
            <div className="row">
                {pains.map(pain => (
                    <div key={pain._id} className="col-4" onClick={() => {
                        // Confirmer qu'une boisson est sélectionnée
                        console.log("Pain sélectioné :", pain.nom);
                        onSelectPain(pain);
                    }}>
                        <div className="drink">
                            <img src={`https://maro.alwaysdata.net/${pain.imageUrl}`} alt={pain.nom} className="garniture-image img-fluid select-item" />
                            <h3 className='text-center itemName'>{pain.nom}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default SelectPain;

