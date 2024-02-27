// SelectGarniture.js
import React from 'react';
import "./SelectGarniture.css";

const SelectGarniture = ({ garnitures, onSelectGarniture, selectedGarnitures, onNextClick }) => {
    return (
        <div className='container text-center'>
            <h2 className='mb-4'>Choisissez vos condiments :</h2>
            <div className='row'>
            {garnitures.map((garniture) => {
                const isSelected = selectedGarnitures.includes(garniture);
                const selectionClass = isSelected ? 'selected-class' : ''; // Ajoutez une classe pour le style de sélection
                return (
                    <div key={garniture.id} className={`col-4 ${selectionClass}`} onClick={() => onSelectGarniture(garniture)}>
                        <div>
                            <img src={`https://maro.alwaysdata.net/${garniture.imageUrl }`} alt={garniture.nom} className=" garniture-image img-fluid" />
                            <h3 className='text-center itemName'>{garniture.nom}</h3>
                            {/* {isSelected && <span className="selection-indicator orange">✔</span>} */}
                        </div>
                    </div>
                );
            })}
            </div>
            <div className='mt-5'>
                <button className='btn btn-warning btn-lg col-4 text-white' onClick={onNextClick}>Suivant</button>
            </div>
        </div>
    );
};


export default SelectGarniture;
