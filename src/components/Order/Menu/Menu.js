import React, { useState, useEffect } from 'react';
import './Menu.css';
import Swal from 'sweetalert2';
import CategoryItem from '../Categories/CategoriesItem';
import MenuItem from './MenuItem/MenuItem';
import ItemOptions from './MenuItem/itemOptions';
import OrderSummary from '../OrderSummary/OrderSummary';
import SelectDrink from './SelectDrink/SelectDrink';
import SelectGarniture from './SelectGarniture/SelectGarniture';
import SelectViande from './SelectViande/SelectViande';
import SelectDessert from './SelectDessert/SelectDessert';
import SelectSauce from './SelectSauce/SelectSauce';
import imgSandwich from "../../../assets/sandwich.jpg";
import imgTacos from "../../../assets/tacos.png";
import imgBurger from "../../../assets/burger.jpg";
import imgDessert from "../../../assets/dessert.png";
import imgCrepe from "../../../assets/crepe.jpg";
import imgPoulet from "../../../assets/poulet.jpg";
import imgxPoulet from "../../../assets/poulet.png";
import imgxCordon from "../../../assets/cordon.png";
import imgTenders from "../../../assets/tenders.png";
import imgViandHachee from "../../../assets/viande-hachee.png";
import imgMerguez from "../../../assets/merguez.png";
import imgNuggets from "../../../assets/nuggets.png";
import classicBurger from "../../../assets/classic_burger.jpg";
import cheeseBurger from "../../../assets/cheeseburger.jpg";
import chickenBurger from "../../../assets/chickenburger.jpg";
import imgKebab from "../../../assets/kebab.png";
import imgCordonBleu from "../../../assets/cordon_bleu.png";
import imgChickenCurry from "../../../assets/chicken_curry.png";
import imgFanta from "../../../assets/fanta.png";
import imgCoca from "../../../assets/coca.png";
import imgIceTea from "../../../assets/icetea.jpg";
import imgTomate from "../../../assets/tomates.webp";
import imgSalade from "../../../assets/salade.png";
import imgOignon from "../../../assets/oignons.webp";
import imgAlg from "../../../assets/algerienne.jpg";
import imgBiggy from "../../../assets/biggy.jpg";
import imgSamourai from "../../../assets/samourai.jpg";
import imgKetchup from "../../../assets/ketchup.jpg";
import imgMayo from "../../../assets/mayo.jpg";
import imgHarissa from "../../../assets/harissa.jpg";
import imgMoutarde from "../../../assets/moutarde.jpg";
import imgAucun from "../../../assets/aucun.png";
import imgGateauOriental from "../../../assets/GATEAU_ORIENTAL.png";
import imgSaladeFruit from "../../../assets/SALADE DE FRUIT .png";
import imgTiramisuChoco from "../../../assets/TIRAMISU CHOCOLAT.png";
import imgTiramisuCara from "../../../assets/TIRAMISU CARAMEL.png";
import imgTarteDaim from "../../../assets/TARTE AU DAIM.png";

const categories = [
    { id: 1, nom: 'Sandwich', imageUrl: imgSandwich },
    { id: 2, nom: 'Burgers', imageUrl: imgBurger },
    { id: 3, nom: 'Tacos', imageUrl: imgTacos },
    { id: 4, nom: 'Dessert', imageUrl: imgDessert },
    { id: 5, nom: 'Crêpes sucrées', imageUrl: imgCrepe },
    { id: 6, nom: 'Poulet Roti', imageUrl: imgPoulet },
];
const articles = {
    'Burgers': [
        { id: 1, nom: 'Burger Classique', imageUrl: classicBurger, prix: 8, categorie: 'Burgers' },
        { id: 2, nom: 'Cheese Burger', imageUrl: cheeseBurger, prix: 9, categorie: 'Burgers' },
        { id: 3, nom: 'Chicken Burger', imageUrl: chickenBurger, prix: 9, categorie: 'Burgers' },
    ],
    'Sandwich': [
        { id: 1, nom: 'Kebab', imageUrl: imgKebab, prix: 8, categorie: 'Sandwich' },
        { id: 2, nom: 'Chicken Curry', imageUrl: imgChickenCurry, prix: 9, categorie: 'Sandwich' },
        { id: 3, nom: 'Cordon Bleu', imageUrl: imgCordonBleu, prix: 9, categorie: 'Sandwich' },
    ],
    'Tacos': [
        { id: 1, nom: 'Tacos 1 viande', imageUrl: imgTacos, prix: 9.50, categorie: 'Tacos' },
        { id: 2, nom: 'Tacos 2 viandes', imageUrl: imgTacos, prix: 10.50, categorie: 'Tacos' },
        { id: 3, nom: 'Tacos 3 viandes', imageUrl: imgTacos, prix: 11.50, categorie: 'Tacos' },
    ]
};
const desserts = [
    { id: 1, nom: 'Gateau Oriental', imageUrl: imgGateauOriental, prix: 1.50, categorie: 'Dessert' },
    { id: 2, nom: 'Salade de fruit', imageUrl: imgSaladeFruit, prix: 3.50, categorie: 'Dessert' },
    { id: 3, nom: 'Tiramisu Chocolat', imageUrl: imgTiramisuChoco, prix: 3, categorie: 'Dessert' },
    { id: 4, nom: 'Tiramisu Caramel', imageUrl: imgTiramisuCara, prix: 3, categorie: 'Dessert' },
    { id: 5, nom: 'Tarte au Daim', imageUrl: imgTarteDaim, prix: 3.50, categorie: 'Dessert' },
];
const drinks = [
    { id: 1, nom: 'Coca-Cola', imageUrl: imgCoca },
    { id: 2, nom: 'Fanta', imageUrl: imgFanta },
    { id: 3, nom: 'Ice Tea', imageUrl: imgIceTea },
];

const garnitures = [
    { id: 1, nom: 'Salade', imageUrl: imgSalade },
    { id: 2, nom: 'Tomate', imageUrl: imgTomate },
    { id: 3, nom: 'Oignon', imageUrl: imgOignon },
];

const sauces = [
    { id: 1, nom: 'Algerienne', imageUrl: imgAlg },
    { id: 2, nom: 'Biggy', imageUrl: imgBiggy },
    { id: 3, nom: 'Samourai', imageUrl: imgSamourai },
    { id: 4, nom: 'Ketchup', imageUrl: imgKetchup },
    { id: 5, nom: 'Mayo', imageUrl: imgMayo },
    { id: 6, nom: 'Harissa', imageUrl: imgHarissa },
    { id: 7, nom: 'Moutarde', imageUrl: imgMoutarde },
    { id: 8, nom: "Sans sauce", imageUrl: imgAucun }
];

const viandes = [
    { id: 1, nom: 'Poulet', imageUrl: imgxPoulet},
    { id: 2, nom: 'Viande hachée',  imageUrl: imgViandHachee},
    { id: 3, nom: 'Tenders', imageUrl: imgTenders},
    { id: 4, nom: 'Merguez', imageUrl: imgMerguez},
    { id: 5, nom: 'Cordon bleu', imageUrl: imgxCordon},
    { id: 6, nom: 'Nuggets', imageUrl: imgNuggets}
];


const Menu = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [selectedDrink, setSelectedDrink] = useState(null);
    const [currentStep, setCurrentStep] = useState('choixCategorie');
    const [selectedGarnitures, setSelectedGarnitures] = useState([]);
    const [selectedSauces, setSelectedSauces] = useState([]);
    const [selectedViandes, setSelectedViandes] = useState([]);
    const [maxViandes, setMaxViandes] = useState(0);
    const [selectedDesserts, setSelectedDesserts] = useState([]);

    const handleCategorySelect = (category) => {
        console.log("Catégorie sélectionnée :", category.nom);
        setSelectedCategory(category.nom);
        if (category.nom === 'Dessert') {
            setCurrentStep('choixDessert');
        } else {
            setCurrentStep('choixArticle');
        }
    };

    const handleItemClick = (item) => {
        console.log("Article sélectionné :", item.nom, "Catégorie :", item.categorie);
        setSelectedItem(item);
        setSelectedOption(null);
        if (item.categorie === 'Dessert') {
            console.log("Passage à l'étape resumeCommande pour les desserts");
            const updatedItem = { ...item, quantity: 1 }; // Ajouter une quantité pour les desserts
            const newOrderItems = [...orderItems, updatedItem];
            setOrderItems(newOrderItems); // Mettre à jour l'état orderItems
            console.log("Dessert ajouté aux commandes :", updatedItem);
            console.log("Commandes après ajout de dessert :", newOrderItems);
            setCurrentStep('resumeCommande');
        } else if (item.categorie === 'Tacos') {
            console.log("Passage à l'étape de choix des viandes pour les tacos");
            setCurrentStep('choixViande');
            // Définir maxViandes en fonction du type de tacos sélectionné
            const nombreViandes = parseInt(item.nom.match(/\d/)[0], 10); // Extrait le nombre de viandes du nom
            setMaxViandes(nombreViandes);
        } else if (item.categorie === 'Sandwich' || item.categorie === 'Burgers') {
            console.log("Passage à l'étape de choix des garnitures");
            setCurrentStep('choixGarniture');
        } else {
            console.log("Passage à l'étape de choix des options");
            setCurrentStep('choixOption');
        }
    };
    const handleOptionSelect = (item, option) => {
        console.log("Option sélectionnée pour l'article:", item.nom, "Option:", option);
        const updatedItem = { ...item, option, garnitures: selectedGarnitures, sauces: selectedSauces, viandes: selectedViandes };
        setOrderItems([...orderItems, updatedItem]);
        setSelectedItem(updatedItem); 
        setSelectedOption(option); 
    
        // Ajuster les étapes en fonction de l'option et de la catégorie
        if (option === 'menu' && item.categorie !== 'Dessert') {
            console.log("Passage à l'étape choixBoisson");
            setCurrentStep('choixBoisson');
        } else {
            console.log("Passage à l'étape resumeCommande");
            setCurrentStep('resumeCommande');
        }
    };
    
    const handleSelectDrink = (drink) => {
        console.log("Boisson choisie dans handleSelectDrink:", drink.nom);
        const updatedItem = { ...selectedItem, drink: drink.nom, option: selectedOption };
        setOrderItems([...orderItems.slice(0, -1), updatedItem]);
        setSelectedDrink(drink); // Enregistrer la boisson choisie
        console.log("Mise à jour des articles de commande avec boisson:", updatedItem);
        setCurrentStep('resumeCommande');
        console.log("Transition vers le résumé de la commande après choix de boisson");
    };
    
    const handleSelectGarniture = (garniture) => {
        // Vérifier si la garniture est déjà sélectionnée
        if (selectedGarnitures.includes(garniture)) {
            // Si oui, la retirer
            setSelectedGarnitures(selectedGarnitures.filter(item => item.id !== garniture.id));
        } else {
            // Sinon, l'ajouter à la sélection
            setSelectedGarnitures([...selectedGarnitures, garniture]);
        }
    };

    const handleSelectSauce = (sauce) => {
        const isSelected = selectedSauces.includes(sauce);
    
        if (isSelected) {
            // Si la sauce est déjà sélectionnée, la retirer de la sélection
            setSelectedSauces(selectedSauces.filter(s => s.id !== sauce.id));
        } else if (selectedSauces.length < 2) {
            // Ajouter la sauce à la sélection seulement si moins de 2 sont déjà sélectionnées
            setSelectedSauces([...selectedSauces, sauce]);
        }
    };

    const handleSelectViande = (viande) => {
        const isSelected = selectedViandes.includes(viande);
    
        if (isSelected) {
            // Si la viande est déjà sélectionnée, la retirer de la sélection
            setSelectedViandes(selectedViandes.filter(v => v.id !== viande.id));
        } else if (selectedViandes.length < maxViandes) {
            // Ajouter la viande à la sélection seulement si le maximum n'est pas déjà atteint
            setSelectedViandes([...selectedViandes, viande]);
        } else {
            // Optionnel: afficher un message d'erreur ou un feedback pour indiquer que la limite a été atteinte
            console.log(`Vous ne pouvez pas sélectionner plus de ${maxViandes} viande(s).`);
        }
    };
    
    const onSelectDessert = (dessert) => {
        if (selectedDesserts.includes(dessert)) {
            setSelectedDesserts(selectedDesserts.filter(d => d.id !== dessert.id));
        } else {
            setSelectedDesserts([...selectedDesserts, dessert]);
        }
    };

    useEffect(() => {
        if (currentStep === 'resumeCommande') {
            setCurrentStep('choixCategorie');
            setSelectedCategory(null);
            setSelectedItem(null);
            setSelectedOption(null);
            setSelectedDrink(null);
            setSelectedGarnitures([]);
            setSelectedSauces([]);
            setSelectedViandes([]);
            setSelectedDesserts([]);
        }
    }, [currentStep]);

    const handleNextClick = () => {
        console.log("Étape actuelle avant Next:", currentStep);
        if (currentStep === 'choixGarniture') {
            setCurrentStep('choixSauce');
        } else if (currentStep === 'choixSauce') {
            setCurrentStep('choixOption');
        } else if (currentStep === 'choixViande'){
            setCurrentStep('choixSauce');
        } else if (currentStep === 'choixDessert' && selectedDesserts.length > 0) {
            console.log("Transition vers le résumé de la commande pour les desserts");
            // Ajouter les desserts sélectionnés à orderItems ici
            const updatedOrderItems = [...orderItems, ...selectedDesserts.map(d => ({ ...d, quantity: 1 }))];
            setOrderItems(updatedOrderItems);  // Mettez à jour l'état orderItems avec les desserts sélectionnés
            console.log("Commandes après ajout de desserts :", updatedOrderItems);
            setCurrentStep('resumeCommande');
            // setSelectedCategory(null);
        }
        console.log("Nouvelle étape après Next:", currentStep);
        console.log("SelectedCategory:", selectedCategory);
        console.log("SelectedItem:", selectedItem);
        console.log("CurrentStep:", currentStep);
    };
    
    useEffect(() => {
        console.log("selectedOption a changé :", selectedOption);
        // On peut effectuer des actions supplémentaires ici en réponse au changement
        // Par exemple, afficher l'étape suivante de l'interface utilisateur
    }, [selectedOption]);
    
    useEffect(() => {
        console.log("orderItems a changé :", orderItems);
    }, [orderItems]);
    

    useEffect(() => {
        console.log("L'étape actuelle a changé :", currentStep);
    }, [currentStep]);
    
    
    useEffect(() => {
        console.log("Desserts sélectionnés ont changé :", selectedDesserts);
    }, [selectedDesserts]);

    useEffect(() => {
        console.log("Boisson sélectionnée a changé :", selectedDrink);
    }, [selectedDrink]);
    
    useEffect(() => {
        console.log("SelectedCategory:", selectedCategory);
        console.log("SelectedItem:", selectedItem);
        console.log("CurrentStep:", currentStep);
        if (!selectedCategory && !selectedItem && currentStep === 'choixCategorie') {
            console.log("Toutes les conditions sont remplies pour afficher les catégories.");
        }
    }, [selectedCategory, selectedItem, currentStep]);

    useEffect(() => {
        console.log("L'étape actuelle a changé :", currentStep);
        if (currentStep === 'resumeCommande') {
            console.log("SelectedCategory devrait être réinitialisé :", selectedCategory);
        }
    }, [currentStep, selectedCategory]);
    

    const handleBackClick = () => {
        console.log("Click sur Retour depuis l'étape :", currentStep);
        switch (currentStep) {
            case 'choixArticle':
                // Retourner au choix de catégorie
                setCurrentStep('choixCategorie');
                setSelectedCategory(null);
                break;
    
            case 'choixGarniture':
                // Retourner au choix d'article
                setCurrentStep('choixArticle');
                setSelectedItem(null);
                setSelectedGarnitures([]); // Réinitialiser les garnitures sélectionnées
                break;
    
            case 'choixSauce':
                // Si l'utilisateur est aux Tacos, revenir à 'choixViande', sinon à 'choixGarniture'
                setCurrentStep(selectedItem.categorie === 'Tacos' ? 'choixViande' : 'choixGarniture');
                setSelectedSauces([]); // Réinitialiser les sauces sélectionnées
                break;
    
            case 'choixViande':
                if (selectedItem && selectedItem.categorie === 'Tacos') {
                    setCurrentStep('choixArticle'); // Revenir à la sélection des tacos
                    setSelectedItem(null); // Optionnel: Réinitialiser l'article sélectionné si nécessaire
                    setSelectedViandes([]); // Réinitialiser les viandes sélectionnées
                }
                break;
                // setCurrentStep('choixArticle');
                // setSelectedViandes([]); // Réinitialiser les viandes sélectionnées
                // break;

            case 'choixDessert':
                setCurrentStep('choixCategorie');
                setSelectedCategory(null);
                setSelectedDesserts([]);
                break;
    
            case 'choixOption':
                // Décider si l'utilisateur doit revenir aux sauces, viandes ou garnitures
                if (selectedItem.categorie === 'Tacos') {
                    setCurrentStep('choixViande');
                } else if (selectedItem.categorie === 'Sandwich' || selectedItem.categorie === 'Burgers') {
                    setCurrentStep('choixGarniture');
                } else {
                    setCurrentStep('choixArticle');
                }
                break;
    
            case 'choixBoisson':
                // Retourner à 'choixOption' pour ajuster l'option 'menu' ou 'seul'
                setCurrentStep('choixOption');
                break;
    
            case 'resumeCommande':
                // Décider où retourner à partir du résumé de la commande
                if (selectedOption === 'menu') {
                    setCurrentStep('choixBoisson');
                } else {
                    setCurrentStep('choixOption');
                }
                break;
    
            default:
                console.log("Pas sûr de la précédente étape");
        }
        console.log("Nouvelle étape après click sur Retour :", currentStep);
    };
    

    const handleContinueOrder = () => {
        // Réinitialiser les états pour ramener l'utilisateur à la première page
        setSelectedCategory(null);
        setSelectedItem(null);
        setSelectedOption(null);
        setSelectedDrink(null);
        setSelectedGarnitures([]);// Et les garnitures sélectionnées si nécessaire
        setSelectedSauces([]); 
        setSelectedViandes([]);
        setSelectedDesserts([]); 
        setCurrentStep('choixCategorie');  // Retourner au choix de catégorie
    };

    // Menu.jsx
const handleRemoveItem = (index) => {
    // Afficher une alerte de confirmation avant de supprimer l'article
    Swal.fire({
        title: 'Êtes-vous sûr?',
        text: "Vous ne pourrez pas revenir en arrière!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, supprimez-le!',
        cancelButtonText: 'Annuler'
    }).then((result) => {
        if (result.isConfirmed) {
            // Si l'utilisateur confirme, supprimez l'article
            const updatedOrderItems = orderItems.filter((_, i) => i !== index);
            setOrderItems(updatedOrderItems);
            Swal.fire(
                'Supprimé!',
                'Votre article a été supprimé.',
                'success',
            )
        }
    });
};

const handleFinalizeOrder = () => {
    console.log("L'utilisateur souhaite finaliser sa commande");
    // Ici, vous pouvez gérer la logique pour finaliser la commande, comme afficher un écran de paiement
};

    return (
        <div className='mb-5'>
        <h2 className='text-center my-3'>Menu</h2>
        <div className='divider'></div>
        {/* Choix des catégories */}
        <div className='container-custom'>
            <div className='order-process'>
            {!selectedCategory && !selectedItem && currentStep === 'choixCategorie' && (
                <div className='container'>
                    {console.log("Rendu des catégories")}
                    <div className='row'>
                        {categories.map(category => (
                            <div className='col-md-4' key={category.id}>
                                <CategoryItem category={category} onSelect={handleCategorySelect} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
                {/* Choix des articles */}
                {selectedCategory && !selectedItem && currentStep === 'choixArticle' && (
                <div className='container'>
                    <button className='btn btn-warning mb-3 text-white' onClick={handleBackClick}><i className="fa-solid fa-arrow-left"></i> Retour</button>
                    <div className='row'>
                    {articles[selectedCategory].map(item => (
                        <div className='col-md-4 text-center' key={item.id}>
                            <MenuItem item={item} onSelect={handleItemClick} />
                        </div>
                    ))}
                    </div>
                </div>
            )}
            {currentStep === 'choixDessert' && (
                <div className='container mb-5'>
                <button className='btn btn-warning mb-3 text-white' onClick={handleBackClick}><i className="fa-solid fa-arrow-left"></i> Retour</button>
                <SelectDessert 
                    desserts={desserts} 
                    onSelectDessert={onSelectDessert} 
                    selectedDesserts={selectedDesserts} 
                    onNextClick={handleNextClick} 
                />
                </div>
            )}
            {currentStep === 'choixViande' && (
                <div className='container'>
                    <button className='btn btn-warning mb-3 text-white' onClick={handleBackClick}><i className="fa-solid fa-arrow-left"></i> Retour</button>
                    <SelectViande viandes={viandes} onSelectViande={handleSelectViande} selectedViandes={selectedViandes} onNextClick={handleNextClick} maxViandes={maxViandes}  />
                </div>
            )}
            {/* Choix des garnitures */}
            {selectedItem && (selectedItem.categorie === 'Sandwich' || selectedItem.categorie === 'Burgers') && currentStep === 'choixGarniture' && (
                <div className='container'>
                    <button className='btn btn-warning mb-3 text-white' onClick={handleBackClick}><i className="fa-solid fa-arrow-left"></i> Retour</button>
                    <SelectGarniture 
                        garnitures={garnitures} 
                        onSelectGarniture={handleSelectGarniture} 
                        selectedGarnitures={selectedGarnitures}
                        onNextClick={handleNextClick} 
                    />
                </div>
            )}
            {currentStep === 'choixSauce' && (
                <div className='container'>
                    <button className='btn btn-warning mb-3 text-white' onClick={handleBackClick}><i className="fa-solid fa-arrow-left"></i> Retour</button>
                <SelectSauce sauces={sauces} onSelectSauce={handleSelectSauce} selectedSauces={selectedSauces} onNextClick={handleNextClick}  />
                </div>
            )}
            {/* Choix des options */}
            {selectedItem && currentStep === 'choixOption' && (
                <div className='container'>
                    <button className='btn btn-warning mb-3 text-white' onClick={() => setCurrentStep('choixGarniture')}><i className="fa-solid fa-arrow-left"></i> Retour</button>
                    <ItemOptions item={selectedItem} onOptionSelect={handleOptionSelect} />
                </div>
            )}
            {/* Choix de la boisson */}
            {selectedItem && selectedOption === 'menu' && !selectedDrink && currentStep === 'choixBoisson' && (
                <SelectDrink drinks={drinks} onSelectDrink={handleSelectDrink} />
            )}
            </div>
            <div className='order-summary text-center'>
            <h4>Récapitulatif de la commande</h4>
            {(orderItems.length > 0) && (
                <div className='container'>
                    {(selectedOption !== 'menu' || (selectedOption === 'menu' && selectedDrink)) && (
                    <OrderSummary 
                        orderItems={orderItems} 
                        onContinueOrder={handleContinueOrder} 
                        onFinalizeOrder={handleFinalizeOrder} 
                        onRemoveItem={handleRemoveItem}
                    />
                    )}
                </div>
            )}
            </div>
        </div>
    </div>
    );
};

export default Menu;
