// SelectDrink.jsx
import React from 'react';
import './SelectDrink.css';


// const SelectDrink = ({ drinks, onSelectDrink }) => {
//     console.log("Rendering SelectDrink");
//     return (
//         <div className='container text-center'>
//             <h3 className='mb-4'>Choisissez votre boisson :</h3>
//             <div className="row">
//                 {drinks.map((drink, index) => (
//                     <div key={index} className="col-md-4" onClick={() => onSelectDrink(drink)}>
//                         <div className="drink">
//                             <img src={drink.imageUrl} alt={drink.nom} className="drink-image img-fluid" />
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };


// export default SelectDrink;

const SelectDrink = ({ drinks, onSelectDrink }) => {
    // Confirmer que SelectDrink est rendu
    console.log("Rendering SelectDrink");

    return (
        <div className='container text-center'>
            <h3 className='mb-4'>Choisissez votre boisson :</h3>
            <div className="row">
                {drinks.map((drink, index) => (
                    <div key={index} className="col-md-4" onClick={() => {
                        // Confirmer qu'une boisson est sélectionnée
                        console.log("Boisson sélectionnée :", drink.nom);
                        onSelectDrink(drink);
                    }}>
                        <div className="drink">
                            <img src={drink.imageUrl} alt={drink.nom} className="drink-image img-fluid" />
                            <p className='text-center'>{drink.nom}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default SelectDrink;

