import React from "react";
const SelectViande = ({ viandes, onSelectViande, selectedViandes, onNextClick, maxViandes }) => {
    return (
        <div className='container text-center'>
            <h3 className='mb-4'>Choisissez vos viandes :</h3>
            {/* Afficher le compteur de viandes sélectionnées */}
            <h6 className="mb-5">Nombre de viandes : <strong className="orange">{selectedViandes.length}/{maxViandes}</strong></h6>
            <div className='row'>
                {viandes.map((viande) => {
                    const isSelected = selectedViandes.includes(viande);
                    const selectionClass = isSelected ? 'selected-class' : ''; // Classe pour le style de sélection
                    return (
                        <div key={viande.id} className={`col-md-4 mb-4 ${selectionClass}`} onClick={() => onSelectViande(viande)}>
                            <div>
                                <img src={viande.imageUrl} alt={viande.nom} className="viande-image img-fluid" />
                                <p className='text-center'>{viande.nom}</p>
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
export default SelectViande;
