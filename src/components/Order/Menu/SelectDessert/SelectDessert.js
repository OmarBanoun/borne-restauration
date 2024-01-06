import React from "react";

const SelectDessert = ({ desserts, onSelectDessert, selectedDesserts, onNextClick }) => {
    const canProceed = selectedDesserts.length > 0;
    return (
        <div className='container text-center'>
            <h3 className='mb-4'>Choisissez vos desserts :</h3>
            <div className='row'>
                {desserts.map((dessert) => {
                    const isSelected = selectedDesserts.includes(dessert);
                    const selectionClass = isSelected ? 'selected-class' : ''; // Classe pour le style de sélection
                    return (
                        <div key={dessert.id} className={`col-md-4 mb-4 ${selectionClass}`} onClick={() => {
                            console.log("Tentative de sélection de dessert avec :", dessert); // Ajout du log ici
                            onSelectDessert(dessert);
                        }}>
                            <div>
                                <img src={dessert.imageUrl} alt={dessert.nom} className="dessert-image img-fluid" />
                                <p className='text-center name-item'>{dessert.nom}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className='mt-5'>
                <button className='btn btn-warning btn-lg col-4 text-white' onClick={onNextClick} disabled={!canProceed}>Suivant</button>
            </div>
        </div>
    );
};
export default SelectDessert;
