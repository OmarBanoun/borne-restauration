import React from "react";

const SelectDessert = ({ desserts, onSelectDessert, selectedDesserts, onNextClick }) => {
    const canProceed = selectedDesserts.length > 0;
    return (
        <div className='container text-center'>
            <h2 className='text-center mt-5'>Selectionnez vos desserts</h2>
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
                                <img src={`https://maro.alwaysdata.net/${dessert.imageUrl}`} alt={dessert.nom} className="dessert-image img-fluid" />
                                <p className='text-center name-item'>{dessert.nom}</p>
                                <p className="itemPrice orange">{dessert.prix.toFixed(2).replace('.', ',')}€</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className='mt-5'>
                <button className='btn btn-back btn-lg col-4 text-white py-3' onClick={onNextClick} disabled={!canProceed}>Suivant</button>
                {!canProceed && <p>Veuillez sélectionner au moins un dessert.</p>}
            </div>
        </div>
    );
};
export default SelectDessert;
