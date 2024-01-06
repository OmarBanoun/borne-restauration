import React from "react";
import "./SelectViande.css";
const SelectViande = ({ viandes, onSelectViande, selectedViandes, onNextClick, maxViandes }) => {
    const canProceed = selectedViandes.length === maxViandes;
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
                                <p className='text-center name-item'>{viande.nom}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className='mt-5'>
                <button className='btn btn-warning btn-lg col-4 text-white' onClick={onNextClick} disabled={!canProceed}>Suivant</button>
                {!canProceed && <p>Veuillez sélectionner exactement {maxViandes} viande(s).</p>}
            </div>
        </div>
    );
};
export default SelectViande;
