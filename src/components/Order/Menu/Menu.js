import React, { useState, useEffect } from 'react';
import './Menu.css';
import { useNavigate } from 'react-router-dom';
import { calculateTotal } from '../../utils';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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
import SelectPain from './SelectPain/SelectPain';
import imgSandwich from "../../../assets/sandwich.jpg";
import imgTacos from "../../../assets/taco.png";
import imgBurger from "../../../assets/burger.jpg";
import imgDessert from "../../../assets/dessert.png";
import imgCrepe from "../../../assets/crepe_NUTELLA BANANE.png";
import imgPanini from '../../../assets/panini.jpg';
import imgPaniniArticle from '../../../assets/panini_article.png';
import imgPoulet from "../../../assets/poulet_roti.jpg";
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
import imgCrepe1 from "../../../assets/crepe_NUTELLA BANANE.png";
import imgCrepe2 from "../../../assets/CREPE_MIEL AMANDE.png";
import imgCrepe3 from "../../../assets/CREPE_SUCRE.png";
import imgCrepe4 from "../../../assets/CREPE_NUTELLA.png";
import imgCrepe5 from "../../../assets/CREPE_CONFITURE.png";
import imgSP from "../../../assets/SP.png";
import imgAE from "../../../assets/a-emporter.png";
import imgDemiPoulet from "../../../assets/demi-poulet.png";
import imgPouletEntier from "../../../assets/poulet-entier.png";
import imgTortilla from "../../../assets/pain_tortilla.jpeg";
import imgPain from "../../../assets/pain_tradi.png";
import imgBuns from "../../../assets/buns.png";

const categories = [
    { id: 1, nom: 'Sandwich', imageUrl: imgKebab },
    { id: 2, nom: 'Burgers', imageUrl: classicBurger },
    { id: 3, nom: 'Tacos', imageUrl: imgTacos },
    { id: 4, nom: 'Panini', imageUrl: imgPanini },
    { id: 5, nom: 'Dessert', imageUrl: imgTiramisuChoco },
    { id: 6, nom: 'Poulet', imageUrl: imgPoulet },
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
    ],
    'Panini': [
        { id: 1, nom: 'Panini saumon', imageUrl: imgPaniniArticle, prix: 5.50, categorie: 'Panini' },
        { id: 2, nom: 'Panini jambon de dinde', imageUrl: imgPaniniArticle, prix: 5.50, categorie: 'Panini' },
        { id: 3, nom: 'Panini fromage', imageUrl: imgPaniniArticle, prix: 5.50, categorie: 'Panini' },
        { id: 4, nom: 'Panini poulet', imageUrl: imgPaniniArticle, prix: 5.50, categorie: 'Panini' },
        { id: 5, nom: 'Panini nutella', imageUrl: imgPaniniArticle, prix: 5.50, categorie: 'Panini' },
    ],
    'Poulet': [
        { id: 1, nom: 'Demi Poulet', imageUrl: imgDemiPoulet, prix: 4.50, categorie: 'Poulet' },
        { id: 2, nom: 'Poulet Entier', imageUrl: imgPouletEntier, prix: 8.50, categorie: 'Poulet' }
    ]
};
const desserts = [
    { id: 1, nom: 'Gateau Oriental', imageUrl: imgGateauOriental, prix: 1.50, categorie: 'Dessert' },
    { id: 2, nom: 'Salade de fruit', imageUrl: imgSaladeFruit, prix: 3.50, categorie: 'Dessert' },
    { id: 3, nom: 'Tiramisu Chocolat', imageUrl: imgTiramisuChoco, prix: 3, categorie: 'Dessert' },
    { id: 4, nom: 'Tiramisu Caramel', imageUrl: imgTiramisuCara, prix: 3, categorie: 'Dessert' },
    { id: 5, nom: 'Tarte au Daim', imageUrl: imgTarteDaim, prix: 3.50, categorie: 'Dessert' },
    { id: 6, nom: 'Crepe Confiture', imageUrl: imgCrepe5, prix: 3.50, categorie: 'Dessert' },
    { id: 7, nom: 'Crepe Nutella Banane', imageUrl: imgCrepe1, prix: 4.50, categorie: 'Dessert' },
    { id: 8, nom: 'Crepe Sucre', imageUrl: imgCrepe3, prix: 3.50, categorie: 'Dessert' },
    { id: 9, nom: 'Crepe Nutella', imageUrl: imgCrepe4, prix: 3.50, categorie: 'Dessert' },
    { id: 10, nom: 'Crepe Miel Amende', imageUrl: imgCrepe2, prix: 3.50, categorie: 'Dessert' },
];
const pains = [
    { id:1, nom: 'Tortilla', imageUrl: imgTortilla},
    { id:2, nom: 'Traditionnel', imageUrl: imgPain},
    { id:3, nom: 'Buns', imageUrl: imgBuns},
]
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

const suggestion = [
    { id: 1, nom: 'Burger Classique', imageUrl: classicBurger, prix: 8 },
    { id: 2, nom: 'Cheese Burger', imageUrl: cheeseBurger, prix: 9 },
    { id: 3, nom: 'Chicken Burger', imageUrl: chickenBurger, prix: 9 },
    { id: 4, nom: 'Gateau Oriental', imageUrl: imgGateauOriental, prix: 1.50 },
    { id: 5, nom: 'Salade de fruit', imageUrl: imgSaladeFruit, prix: 3.50 },
    { id: 6, nom: 'Tiramisu Chocolat', imageUrl: imgTiramisuChoco, prix: 3 },
    { id: 7, nom: 'Tiramisu Caramel', imageUrl: imgTiramisuCara, prix: 3 },
    { id: 8, nom: 'Tarte au Daim', imageUrl: imgTarteDaim, prix: 3.50 },
];


const Menu = () => {
    const [selectedCategory, setSelectedCategory] = useState('Sandwich');
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [selectedDrink, setSelectedDrink] = useState(null);
    const [selectedPain, setSelectedPain] = useState(null);
    const [currentStep, setCurrentStep] = useState('choixCategorie');
    const [selectedGarnitures, setSelectedGarnitures] = useState([]);
    const [selectedSauces, setSelectedSauces] = useState([]);
    const [selectedViandes, setSelectedViandes] = useState([]);
    const [maxViandes, setMaxViandes] = useState(0);
    const [selectedDesserts, setSelectedDesserts] = useState([]);
    const [orderType, setOrderType] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Simulez la sélection de la catégorie 'Sandwich' au chargement de l'application
        const sandwichCategory = categories.find(c => c.nom === 'Sandwich');
        if (sandwichCategory) {
            handleCategorySelect(sandwichCategory);
        }
    }, []);

    const handleCategorySelect = (category) => {
        if (selectedItem && selectedOption !== 'seul') {
            Swal.fire({
                title: 'Voulez-vous annuler cette commande en cours ?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Oui',
                cancelButtonText: 'Non'
            }).then((result) => {
                if (result.isConfirmed) {
                    setSelectedCategory(category.nom);
                    setCurrentStep('choixArticle');
                    setSelectedItem(null);
                    setSelectedOption(null); // Réinitialiser l'option sélectionnée
                    setSelectedDrink(null); // Réinitialiser la boisson sélectionnée
                    setSelectedPain(null); // Réinitialiser le pain sélectionné
                    setSelectedGarnitures([]); // Réinitialiser les garnitures sélectionnées
                    setSelectedSauces([]); // Réinitialiser les sauces sélectionnées
                    setSelectedViandes([]); // Réinitialiser les viandes sélectionnées
                    setSelectedDesserts([]);
                }
            });
        } else if(category.nom === "Dessert"){
            setSelectedCategory(category.nom);
            setCurrentStep('choixDessert');
        } else {
            setSelectedCategory(category.nom);
            setCurrentStep('choixArticle');
        }
    };
    const handleItemClick = (item) => {
        console.log("Article sélectionné :", item.nom, "Catégorie :", item.categorie);
        setSelectedItem(item);
        setSelectedOption(null);
        if (item.categorie === ('Dessert')) {
            console.log("Passage à l'étape resumeCommande pour les desserts");
            const updatedItem = { ...item, quantity: 1 }; // Ajouter une quantité pour les desserts
            const newOrderItems = [...orderItems, updatedItem];
            setOrderItems(newOrderItems); // Mettre à jour l'état orderItems
            console.log("Dessert ajouté aux commandes :", updatedItem);
            console.log("Commandes après ajout de dessert :", newOrderItems);
            setCurrentStep('resumeCommande');
        } else if (item.categorie === 'Tacos') {
            setCurrentStep('choixViande');
            const nombreViandes = parseInt(item.nom.match(/\d/)[0], 10);
            setMaxViandes(nombreViandes);
        } else if (item.categorie === 'Panini') {
            setCurrentStep('choixOption');
        } else if (item.categorie === 'Poulet') {
            setCurrentStep('choixOption');
        } else if (item.categorie === 'Sandwich'){
            setCurrentStep('choixPain');
        }else {
            setCurrentStep('choixGarniture');
        }
    };
    const handleOptionSelect = (item, option) => {
        setSelectedItem({ ...item, option, garnitures: selectedGarnitures, sauces: selectedSauces });
        setSelectedOption(option);
    
        if (option === 'menu') {
            setCurrentStep('choixBoisson');
        } else {
            setOrderItems([...orderItems, { ...item, option, garnitures: selectedGarnitures, sauces: selectedSauces}]);
            setCurrentStep('resumeCommande');
        }
    };
    // handleSelectPain
    const handleSelectPain = (pain) => {
        setSelectedPain(pain);
        setSelectedItem({ ...selectedItem, pain: pain.nom });
        setCurrentStep('choixGarniture');
        console.log("Pain sélectionné :", pain);
    }
    const handleSelectDrink = (drink) => {
        // Ajouter l'article avec la boisson sélectionnée à orderItems
        const updatedItem = { ...selectedItem, drink: drink.nom };
        setOrderItems([...orderItems, updatedItem]);
    
        // Réinitialisation pour le prochain article
        setSelectedItem(null);
        setSelectedOption(null);
        setSelectedDrink(null);
        setSelectedGarnitures(null);
        setCurrentStep('resumeCommande');
        handleShowModal();
    };
    
    const handleSelectGarniture = (garniture) => {
        if (selectedGarnitures.includes(garniture)) {
            setSelectedGarnitures(selectedGarnitures.filter(g => g.id !== garniture.id));
        } else {
            setSelectedGarnitures([...selectedGarnitures, garniture]);
        }
        console.log("Garnitures sélectionnées:", selectedGarnitures);
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
        } 
        else {
            setSelectedDesserts([...selectedDesserts, dessert]);
        }
    };
    const handleNextClick = () => {
        if (currentStep === 'choixPain') {
            setCurrentStep('choixGarniture');
        } else if (currentStep === 'choixGarniture') {
            setCurrentStep('choixSauce');
        } else if (currentStep === 'choixSauce') {
            setCurrentStep('choixOption');
        } else if (currentStep === 'choixViande') {
            setCurrentStep('choixSauce');
        } else if (currentStep === 'choixOption') {
            const updatedItem = { ...selectedItem, pains: selectedPain, garnitures: selectedGarnitures, sauces: selectedSauces, viandes: selectedViandes, option: selectedOption };
            setOrderItems([...orderItems, updatedItem]);
            setCurrentStep('resumeCommande');
    
            // Réinitialisation pour le prochain article
            setSelectedItem(null);
            setSelectedPain(null);
            setSelectedGarnitures([]);
            setSelectedSauces([]);
            setSelectedViandes([]);
            setSelectedOption(null);
        } else if (currentStep === 'choixDessert') {
            // Ajoutez les desserts sélectionnés à orderItems ici
            const updatedOrderItems = [...orderItems, ...selectedDesserts.map(d => ({ ...d, quantity: 1 }))];
            setOrderItems(updatedOrderItems);
        
            // Réinitialiser les desserts sélectionnés et passer à l'étape suivante
            setSelectedDesserts([]);
            setCurrentStep('resumeCommande');
        }
    };

    useEffect(() => {
        console.log("Choix pain a changé :", selectedPain);
    }, [selectedPain]);

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

    useEffect(() => {
        if (currentStep === 'resumeCommande') {
            const sandwichCategory = categories.find(c => c.nom === 'Sandwich');
            if (sandwichCategory) {
                setSelectedCategory('Sandwich');
                setCurrentStep('choixCategorie');
                handleCategorySelect(sandwichCategory); // Déclenchez la logique de sélection de catégorie
                // reinitialiser
                setSelectedItem(null);
                setSelectedOption(null);
                setSelectedPain(null);
                setSelectedSauces([]);
                setSelectedGarnitures([]);
                setSelectedViandes([]);
                setSelectedDesserts([]);
            }
        }
    }, [currentStep]);

    const handleBackClick = () => {
        // console.log("Click sur Retour depuis l'étape :", currentStep);
        console.log("CurrentStep avant switch :", currentStep);
        switch (currentStep) {
            case 'choixArticle':
                console.log("Test case");
                // Retourner au choix de catégorie
                setCurrentStep('choixCategorie');
                setSelectedCategory(null);
                break;

            case 'choixPain':
                // Retourner au choix d'article
                setCurrentStep('choixArticle');
                setSelectedItem(null);
                setSelectedPain(null); // Réinitialiser les pain sélectionnées
                break;
    
            case 'choixGarniture':
                //si la catégorie choisie est burger le retourne au choix des burgers sinon si la catégorie c'est sandwich je reviens au choix du pain
                if (selectedCategory === 'Burgers') {
                    setCurrentStep('choixArticle');
                    setSelectedItem(null);
                    setSelectedGarnitures([]); // Réinitialiser les garnitures sélectionnées
                } else {
                    setCurrentStep('choixPain');
                    // setSelectedItem(null);
                    setSelectedGarnitures([]); // Réinitialiser les garnitures sélectionnées
                }
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
                    setCurrentStep('choixSauce');
                } else if (selectedItem.categorie === 'Sandwich' || selectedItem.categorie === 'Burgers') {
                    setCurrentStep('choixGarniture');
                } else {
                    setCurrentStep('choixArticle');
                    setSelectedItem(null);
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
        setSelectedCategory('Sandwich');
        setSelectedItem(null);
        setSelectedOption(null);
        setSelectedPain(null);
        setSelectedDrink(null);
        setSelectedGarnitures([]);// Et les garnitures sélectionnées si nécessaire
        setSelectedSauces([]); 
        setSelectedViandes([]);
        setSelectedDesserts([]); 
        setCurrentStep('choixCategorie');  // Retourner au choix de catégorie
    };


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
// const calculateTotal = (items) => {
//     return items.reduce((total, item) => total + item.prix + (item.option === 'menu' ? 2 : 0), 0);
// };
const total = calculateTotal(orderItems);

const handleOrderTypeSelect = (type) => {
    setOrderType(type);
    console.log("Order Type après sélection:", type);
};

const [showModal, setShowModal] = useState(false);
const handleShowModal = () => setShowModal(true);
const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItems([]);
};

const handleToggleItem = (item) => {
    if (selectedItems.find(selectedItem => selectedItem.id === item.id)) {
        setSelectedItems(selectedItems.filter(selectedItem => selectedItem.id !== item.id));
    } else {
        setSelectedItems([...selectedItems, item]);
    }
};

const handleFinalizeOrder = () => {
    console.log("L'utilisateur souhaite finaliser sa commande");
    // Ici, vous pouvez gérer la logique pour finaliser la commande, comme afficher un écran de paiement
    navigate('/order-summary', { state: { orderType, orderItems, total } });
};

    return (
    <div className='menu-container'>
        {!orderType && (
        <div className='order-type-selection-container'>
            <h2 className="order-type-title text-center">Où Souhaitez-vous Déguster Votre Repas ?</h2>
            <div className='order-type-selection'>
                <div className="card" onClick={() => handleOrderTypeSelect('sur_place')}>
                    <img src={imgSP} alt="img-SP" className="card-img-top img-fluid" />
                    <h3 className='card-title mt-3'>Sur Place</h3>
                </div>
                <div className="card" onClick={() => handleOrderTypeSelect('a_emporter')}>
                    <img src={imgAE} alt="img-AE" className="card-img-top img-fluid" />
                    <h3 className='card-title mt-3'>À Emporter</h3>
                </div>
            </div>
        </div>
        )}
        {orderType && (
        <div>
    <div className='top-section'>
    <div className='categories-bar'>
        {/* Logique pour afficher les catégories */}
            <div className='container mt-4'>
                <h2 className='text-center orange categ-title'>Catégories</h2>
                {categories.map(category => (
                    <div key={category.id} className={selectedCategory === category.nom ? "selected-class" : ""}>
                        <CategoryItem category={category} onSelect={handleCategorySelect} />
                    </div>
                ))}
            </div>
    </div>
    
    <div className='order-process'>
        {/* Choix des articles */}
        {/* <h2 className='text-center mt-2'>Faites votre choix :</h2> */}
        {selectedCategory && !selectedItem && currentStep === 'choixArticle' && (
        <div className='container'>
            <h2 className='text-center mt-5'>Selectionnez votre {selectedCategory}</h2>
            {/* <button className='btn btn-warning mb-3 text-white' onClick={handleBackClick}><i className="fa-solid fa-arrow-left"></i> Retour</button> */}
            <div className='row mt-3'>
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
    {/* Choix du pain */}
    {selectedItem && (selectedItem.categorie === 'Sandwich') && currentStep === 'choixPain' && (
        <div className='container'>
            <button className='btn btn-warning mb-3 text-white' onClick={handleBackClick}><i className="fa-solid fa-arrow-left"></i> Retour</button>
            <SelectPain pains={pains} onSelectPain={handleSelectPain} selectedPain={selectedPain} onNextClick={handleNextClick} />
        </div>
    )}
    {/* Choix des garnitures */}
    {currentStep === 'choixGarniture' && (
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
            <button className='btn btn-warning mb-3 text-white' onClick={handleBackClick}><i className="fa-solid fa-arrow-left"></i> Retour</button>
            <ItemOptions item={selectedItem} onOptionSelect={handleOptionSelect} />
        </div>
    )}
    {/* Choix de la boisson */}
    {selectedItem && selectedOption === 'menu' && !selectedDrink && currentStep === 'choixBoisson' && (
        <SelectDrink drinks={drinks} onSelectDrink={handleSelectDrink} />
    )}
<Modal show={showModal} onHide={handleCloseModal} dialogClassName="modal-50w" centered>
    <Modal.Header closeButton>
        <Modal.Title className='d-flex justify-content-center'>Accompagner votre menu</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Row>
            {suggestion.map((item, index) => (
                <Col key={item.id} xs={12} md={3} className="mb-3">
                <div className={`text-center ${selectedItems.find(selectedItem => selectedItem.id === item.id) ? "selected-class" : ""}`} 
                    onClick={() => handleToggleItem(item)}>
                        <img src={item.imageUrl} alt={item.nom} style={{ width: '100%', height: 'auto', cursor: 'pointer' }} />
                        <p>{item.nom} - {item.prix.toFixed(2).replace('.', ',')}€</p>
                    </div>
                </Col>
            ))}
        </Row>
    </Modal.Body>
    <Modal.Footer>
    <Button variant="danger" onClick={handleCloseModal}>
        Non, merci
    </Button>
    <Button 
        variant="warning text-white" 
        onClick={() => {
            setOrderItems([...orderItems, ...selectedItems]);
            setSelectedItems([]);
            handleCloseModal();
        }}
        disabled={selectedItems.length === 0} // Désactiver si aucun article n'est sélectionné
    >
        Ajouter à la Commande
    </Button>
</Modal.Footer>
</Modal>

    </div>
    </div>
    <div className='order-summary'>
        <div className='d-flex flex-row justify-content-between commande'>
            <h4 className='py-3 col-8 mb-0'>Prix</h4>
            <div className='col-3 bg-dark'>
                <div className='text-white d-flex align-items-center justify-content-around h-100 text-white commande'>
                    <strong className='Total'>Total</strong>
                    <h2 className='my-4 price orange'>{total}€</h2>
                </div>
            </div>
        </div>
        {(orderItems.length > 0) && (
            <OrderSummary 
                orderItems={orderItems}
                onContinueOrder={handleContinueOrder} 
                onFinalizeOrder={handleFinalizeOrder} 
                onRemoveItem={handleRemoveItem}
            />
        )}
    </div>
    </div>
)}
</div>
    );
};

export default Menu;
