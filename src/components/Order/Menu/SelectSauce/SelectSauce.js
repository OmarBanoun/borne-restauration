import React from "react";
const SelectSauce = ({ sauces, onSelectSauce, selectedSauces, onNextClick }) => {
    const canProceed = selectedSauces.length > 0;
    return (
        <div className='container text-center'>
            <h2 className='mb-4'>Choisissez vos sauces (2 max) : </h2>
            <div className='row'>
            {sauces.map((sauce) => {
                const isSelected = selectedSauces.includes(sauce);
                const selectionClass = isSelected ? 'selected-class' : ''; // Ajoutez une classe pour le style de sélection
                return (
                    <div key={sauce.id} className={`col-md-4 mb-4 my-auto ${selectionClass}`} onClick={() => onSelectSauce(sauce)}>
                        <div className="">
                            <img src={`http://localhost:3001/${sauce.imageUrl }`} alt={sauce.nom} className="sauce-image img-fluid w-50" />
                            <p className='text-center name-item'>{sauce.nom}</p>
                            {/* {isSelected && <span className="selection-indicator orange">✔</span>} */}
                        </div>
                    </div>
                );
            })}
            </div>
            <div className='mt-5'>
                <button className='btn btn-warning py-3 btn-lg col-4 text-white mb-3' onClick={onNextClick} disabled={!canProceed}>Suivant</button>
            </div>
        </div>
    );
};
export default SelectSauce;



