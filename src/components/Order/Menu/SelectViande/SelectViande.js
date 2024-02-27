import React from "react";
import "./SelectViande.css";
const SelectViande = ({ viandes, onSelectViande, selectedViandes, onNextClick, maxViandes }) => {
    const canProceed = selectedViandes.length === maxViandes;
    return (
        <div className='container text-center'>
            <h2 className='mb-4'>Choisissez vos viandes :</h2>
            {/* Afficher le compteur de viandes sélectionnées */}
            <h4 className="mb-5">Nombre de viandes : <strong className="orange">{selectedViandes.length}/{maxViandes}</strong></h4>
            <div className='row'>
                {viandes.map((viande) => {
                    const isSelected = selectedViandes.includes(viande);
                    const selectionClass = isSelected ? 'selected-class' : ''; // Classe pour le style de sélection
                    return (
                        <div key={viande.id} className={`col-4 mb-4 ${selectionClass}`} onClick={() => onSelectViande(viande)}>
                            <div>
                                <img src={`https://maro.alwaysdata.net/${viande.imageUrl }`} alt={viande.nom} className="viande-image img-fluid" />
                                <h3 className='text-center itemName'>{viande.nom}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className='mt-5'>
                <button className='btn btn-warning py-3 btn-lg col-4 text-white' onClick={onNextClick} disabled={!canProceed}>Suivant</button>
                {!canProceed && <p>Veuillez sélectionner exactement {maxViandes} viande(s).</p>}
            </div>
        </div>
    );
};
export default SelectViande;
