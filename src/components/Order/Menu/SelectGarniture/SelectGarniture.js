// SelectGarniture.js
import React from 'react';
import "./SelectGarniture.css";

const SelectGarniture = ({ garnitures, onSelectGarniture, selectedGarnitures, onNextClick }) => {
    return (
        <div className='container text-center'>
            <h3 className='mb-4'>Choisissez vos garnitures :</h3>
            <div className='row'>
            {garnitures.map((garniture) => {
                const isSelected = selectedGarnitures.includes(garniture);
                const selectionClass = isSelected ? 'selected-class' : ''; // Ajoutez une classe pour le style de sélection
                return (
                    <div key={garniture.id} className={`col-md-4 ${selectionClass}`} onClick={() => onSelectGarniture(garniture)}>
                        <div>
                            <img src={garniture.imageUrl} alt={garniture.nom} className=" garniture-image img-fluid" />
                            <p className='text-center'>{garniture.nom}</p>
                            {/* {isSelected && <span className="selection-indicator orange">✔</span>} */}
                        </div>
                    </div>
                );
            })}
            </div>
            <div className='mt-5'>
                <button className='btn btn-warning btn-lg text-white' onClick={onNextClick}>Suivant</button>
            </div>
        </div>
    );
};


export default SelectGarniture;
