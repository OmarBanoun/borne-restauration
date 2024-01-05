import React from "react";
const SelectSauce = ({ sauces, onSelectSauce, selectedSauces, onNextClick }) => {
    return (
        <div className='container text-center'>
            <h3 className='mb-4'>Choisissez vos sauces (2 max) : </h3>
            <div className='row'>
            {sauces.map((sauce) => {
                const isSelected = selectedSauces.includes(sauce);
                const selectionClass = isSelected ? 'selected-class' : ''; // Ajoutez une classe pour le style de sélection
                return (
                    <div key={sauce.id} className={`col-md-4 mb-4 ${selectionClass}`} onClick={() => onSelectSauce(sauce)}>
                        <div>
                            <img src={sauce.imageUrl} alt={sauce.nom} className=" sauce-image img-fluid" />
                            <p className='text-center'>{sauce.nom}</p>
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
export default SelectSauce;



