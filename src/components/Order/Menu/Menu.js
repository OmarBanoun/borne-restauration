import React, { useState, useEffect } from 'react';
import './Menu.css';
import axios from 'axios';
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
import SelectSupplements from './SelectSupplements/SelectSupplements';
import imgSP from "../../../assets/SP.png";
import imgAE from "../../../assets/a-emporter.png";
import RealTimeOrdering from '../RealTimeOrdering/RealTimeOrdering';
import { useInactivityAlert } from '../../Common/InactivityAlert';

const Menu = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Sandwich');
    const [articles, setArticles] = useState([]);
    const [desserts, setDesserts] = useState([]);
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
    const [selectedSupplements, setSelectedSupplements] = useState([]);
    const [orderType, setOrderType] = useState(null);
    const navigate = useNavigate();
    const [SecondaryArticles, setSecondaryArticles] = useState([]);
    const [drinks, setDrinks] = useState([]);
    const [garnitures, setGarnitures] = useState([]);
    const [sauces, setSauces] = useState([]);
    const [viandes, setViandes] = useState([]);
    const [pains, setPains] = useState([]);
    const [supplements, setSupplements] = useState([]);

    useInactivityAlert();

    useEffect(() => {
        // Chargement des catégories depuis l'API
        axios.get('https://maro.alwaysdata.net/api/categories')
            .then(response => {
                setCategories(response.data); // Mettez à jour les catégories avec les données de l'API
                // Sélectionner une catégorie par défaut si nécessaire
                const sandwichCategory = response.data.find(c => c.nom === 'Sandwich');
                if (sandwichCategory) {
                    handleCategorySelect(sandwichCategory);
                }
            })
            .catch(error => console.error('Erreur lors de la récupération des catégories', error));
    }, []);

    useEffect(() => {
        axios.get('https://maro.alwaysdata.net/api/articles')
            .then(response => {
                // Ici, vous pouvez traiter les données reçues, par exemple, en les stockant dans un état
                setArticles(response.data);
                // Filtrer pour obtenir uniquement les articles de la catégorie "Dessert"
                const filteredDesserts = response.data.filter(article => article.categorie.nom === 'Dessert');
                setDesserts(filteredDesserts);
            })
            .catch(error => console.error('Erreur lors de la récupération des articles', error));
    }, []);

    useEffect(() => {
        axios.get('https://maro.alwaysdata.net/api/secondary-articles/boissons')
            .then(response => {
                setDrinks(response.data);
            })
            .catch(error => console.log(error));
        
        axios.get('https://maro.alwaysdata.net/api/secondary-articles/garnitures')
            .then(response => {
                setGarnitures(response.data);
            })
            .catch(error => console.log(error));

        axios.get('https://maro.alwaysdata.net/api/secondary-articles/sauces')
            .then(response => {
                setSauces(response.data);
            })
            .catch(error => console.log(error));

        axios.get('https://maro.alwaysdata.net/api/secondary-articles/viandes')
            .then(response => {
                setViandes(response.data);
            })
            .catch(error => console.log(error));

        axios.get('https://maro.alwaysdata.net/api/secondary-articles/pains')
            .then(response => {
                setPains(response.data);
            })
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        axios.get('https://maro.alwaysdata.net/api/supplements')
            .then(response => {
                setSupplements(response.data);
            })
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        // Ajouter la classe quand le composant est monté
        document.getElementById('root').classList.add('max-height');
    
        // Retirer la classe quand le composant est démonté
        return () => {
            document.getElementById('root').classList.remove('max-height');
        };
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
                    setSelectedDesserts([]); // Réinitialiser les desserts sélectionnés
                    setSelectedSupplements([]); // Réinitialiser les supplements sélectionnés
                }
            });
        } else if (category.nom === "Dessert"){
            setSelectedCategory(category.nom);
            setSelectedDesserts([]);
            setCurrentStep('choixDessert');
        } else {
            setSelectedCategory(category.nom);
            setCurrentStep('choixArticle');
        }
        // si un item de categorie 'Dessert' est selectionné le reinitialiser
    };
    const handleItemClick = (item) => {
        console.log("Article sélectionné :", item.nom, "Catégorie :", item.categorie.nom);
        setSelectedItem(item);
        setSelectedOption(null);
        if (item.categorie.nom === ('Dessert')) {
            console.log("Passage à l'étape resumeCommande pour les desserts");
            const updatedItem = { ...item, quantity: 1 }; // Ajouter une quantité pour les desserts
            const newOrderItems = [...orderItems, updatedItem];
            setOrderItems(newOrderItems); // Mettre à jour l'état orderItems
            console.log("Dessert ajouté aux commandes :", updatedItem);
            console.log("Commandes après ajout de dessert :", newOrderItems);
            setCurrentStep('resumeCommande');
        } else if (item.categorie.nom === 'Tacos') {
            setCurrentStep('choixViande');
            const nombreViandes = parseInt(item.nom.match(/\d/)[0], 10);
            setMaxViandes(nombreViandes);
        } else if (item.categorie.nom === 'Panini') {
            setCurrentStep('choixOption');
        } else if (item.categorie.nom === 'Poulet') {
            setCurrentStep('choixOption');
        } else if (item.categorie.nom === 'Sandwich'){
            setCurrentStep('choixPain');
        }else {
            setCurrentStep('choixGarniture');
        }
    };
    const filteredArticles = articles.filter(item => item.categorie.nom === selectedCategory);
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
        setSelectedItem({ ...selectedItem, pain: pain.nom, painImg: pain.imageUrl });
        setCurrentStep('choixGarniture');
        console.log("Pain sélectionné :", pain);
    }
    const handleSelectDrink = (drink) => {
        // Ajouter l'article avec la boisson sélectionnée à orderItems
        const updatedItem = { ...selectedItem, drink: drink.nom, drinkImg: drink.imageUrl};
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
            setSelectedGarnitures(selectedGarnitures.filter(g => g !== garniture));
        } else {
            setSelectedGarnitures([...selectedGarnitures, garniture]);
        }
        console.log("Garnitures sélectionnées:", selectedGarnitures);
    };
    
    

    const handleSelectSauce = (sauce) => {
        const isSelected = selectedSauces.includes(sauce);
    
        if (isSelected) {
            // Si la sauce est déjà sélectionnée, la retirer de la sélection
            setSelectedSauces(selectedSauces.filter(s => s !== sauce));
        } else if (selectedSauces.length < 2) {
            // Ajouter la sauce à la sélection seulement si moins de 2 sont déjà sélectionnées
            setSelectedSauces([...selectedSauces, sauce]);
        }
    };

    const handleSelectViande = (viande) => {
        const isSelected = selectedViandes.includes(viande);
    
        if (isSelected) {
            // Si la viande est déjà sélectionnée, la retirer de la sélection
            setSelectedViandes(selectedViandes.filter(v => v !== viande));
        } else if (selectedViandes.length < maxViandes) {
            // Ajouter la viande à la sélection seulement si le maximum n'est pas déjà atteint
            setSelectedViandes([...selectedViandes, viande]);
        } else {
            // Optionnel: afficher un message d'erreur ou un feedback pour indiquer que la limite a été atteinte
            console.log(`Vous ne pouvez pas sélectionner plus de ${maxViandes} viande(s).`);
        }
    };

    const handleSelectSupplement = (supplement) => {
        // Vérifier si le supplément est déjà sélectionné
        if (selectedSupplements.find(s => s.id === supplement.id)) {
            // Supprimer le supplément de la sélection
            setSelectedSupplements(selectedSupplements.filter(s => s.id !== supplement.id));
        } else {
            // Ajouter le supplément à la sélection
            setSelectedSupplements([...selectedSupplements, supplement]);
        }
        console.log("Supplements sélectionnés:", selectedSupplements);
    };
    
    const onSelectDessert = (dessert) => {
        if (selectedDesserts.includes(dessert)) {
            setSelectedDesserts(selectedDesserts.filter(d => d !== dessert));
        } else {
            setSelectedDesserts([...selectedDesserts, dessert]);
        }
    };

    
    const handleNextClick = () => {
        if (currentStep === 'choixPain') {
            setCurrentStep('choixGarniture');
        } else if (currentStep === 'choixGarniture') {
            setCurrentStep('choixSauce');
        } else if (currentStep === 'choixSauce') {
            setCurrentStep('choixSupplement');
        } else if (currentStep === 'choixSupplement') {
            // Mise à jour de l'article sélectionné avec les suppléments avant de passer à l'étape suivante
            const updatedItem = { ...selectedItem, supplements: selectedSupplements };
            setSelectedItem(updatedItem); // Mise à jour globale de selectedItem
            setCurrentStep('choixOption');
        } else if (currentStep === 'choixViande') {
            setCurrentStep('choixSauce');
        } else if (currentStep === 'choixOption') {
            // Vérifiez si l'article est déjà dans orderItems pour éviter les doublons
            const itemExists = orderItems.some(item => item.id === selectedItem.id);
            if (!itemExists) {
                // Ajoutez seulement si l'article n'existe pas déjà
                setOrderItems([...orderItems, selectedItem]);
            }
            setCurrentStep('resumeCommande');
    
            // Réinitialisation pour le prochain article
            resetSelections(); // Utilisez une fonction pour réinitialiser toutes les sélections
        } else if (currentStep === 'choixArticle' && selectedDesserts.length > 0) {
            // Ajoutez les desserts sélectionnés à orderItems ici
            const updatedOrderItems = [...orderItems, ...selectedDesserts.map(d => ({ ...d, quantity: 1 }))];
            setOrderItems(updatedOrderItems);
    
            // Réinitialiser les desserts sélectionnés et passer à l'étape suivante
            setSelectedDesserts([]);
            setCurrentStep('resumeCommande');
        }
    };
    
    // Fonction pour réinitialiser toutes les sélections
    const resetSelections = () => {
        setSelectedItem(null);
        setSelectedPain(null);
        setSelectedGarnitures([]);
        setSelectedSauces([]);
        setSelectedViandes([]);
        setSelectedOption(null);
        setSelectedSupplements([]); // N'oubliez pas de réinitialiser les suppléments sélectionnés
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
        console.log("Supplements sélectionnés après mise à jour:", selectedSupplements);
    }, [selectedSupplements]);
    

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
                setSelectedDrink(null);
                setSelectedSupplements([]);
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
                setCurrentStep(selectedItem.categorie.nom === 'Tacos' ? 'choixViande' : 'choixGarniture');
                setSelectedSauces([]); // Réinitialiser les sauces sélectionnées
                break;

            case 'choixSupplement':
                setCurrentStep('choixSauce');
                setSelectedSupplements([]);
                break;

            case 'choixViande':
                if (selectedItem && selectedItem.categorie.nom === 'Tacos') {
                    setCurrentStep('choixArticle'); // Revenir à la sélection des tacos
                    setSelectedItem(null); // Optionnel: Réinitialiser l'article sélectionné si nécessaire
                }
                break;
                // setCurrentStep('choixArticle');
                // setSelectedViandes([]); // Réinitialiser les viandes sélectionnées
                // break;

            case 'choixDessert':
                setCurrentStep('resumeCommande');
                setSelectedCategory(null);
                setSelectedDesserts([]);
                break;
                
            case 'choixOption':
                // Décider si l'utilisateur doit revenir aux sauces, viandes ou garnitures
                if (selectedItem.categorie.nom === 'Tacos') {
                    setCurrentStep('choixSauce');
                } else if (selectedItem.categorie.nom === 'Sandwich' || selectedItem.categorie.nom === 'Burgers') {
                    setCurrentStep('choixSauce');
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
    // const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
    const handleSaveChanges = (updatedDetail) => {
        const updatedOrderItems = orderItems.map((item, index) => {
            if (index === updatedDetail.index) {
                return { ...item, ...updatedDetail };
            }
            return item;
        });
    
        setOrderItems(updatedOrderItems);
        // Alerte swal pour confirmer les modifications
        Swal.fire({
            title: "Modification enregistrée !",
            text: "",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
        });
    };

const handleRemoveItem = (index) => {
    // Afficher une alerte de confirmation avant de supprimer l'article
    Swal.fire({
        title: 'Êtes-vous sûr?',
        text: "Vous ne pourrez pas revenir en arrière!",
        icon: 'warning',
        showCancelButton: true,
        // confirmButtonColor: '--primary-color',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, supprimez-le!',
        cancelButtonText: 'Annuler'
    }).then((result) => {
        if (result.isConfirmed) {
            // Si l'utilisateur confirme, supprimez l'article
            const updatedOrderItems = orderItems.filter((_, i) => i !== index);
            setOrderItems(updatedOrderItems);
            Swal.fire({
                title: "Supprimé!",
                text: "",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
            });
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
const handleShowModal = () => {
    setShowModal(true);
};
const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItems([]);
};

const handleToggleItem = (item) => {
    const isSelected = selectedItems.some(selectedItem => selectedItem._id === item._id);

    if (isSelected) {
        // Si l'article est déjà sélectionné, le retirer de la liste
        setSelectedItems(selectedItems.filter(selectedItem => selectedItem._id !== item._id));
    } else {
        // Sinon, l'ajouter à la liste
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
                <div key={category._id} className={selectedCategory === category.nom ? "selected-class" : ""}>
                    <CategoryItem category={category} onSelect={handleCategorySelect} />
                </div>
            ))}
            </div>
    </div>
    
    <div className='order-process'>
        {/* Choix des articles */}
        {selectedCategory && selectedCategory !== 'Desserts' && !selectedItem && currentStep === 'choixArticle' && (
        <div className='container'>
            <h2 className='text-center mt-5'>Selectionnez votre {selectedCategory}</h2>
            <div className='row mt-3'>
            {filteredArticles.map(item => (
                <div className='col-md-4 text-center' key={item.id}>
                    <MenuItem item={item} onSelect={handleItemClick} />
                </div>
            ))}
            </div>
        </div>
    )}
    {selectedCategory && selectedCategory === 'Desserts' && !selectedItem && currentStep === 'choixArticle' && (
        <div className='container mb-5'>
        <SelectDessert 
            desserts={filteredArticles} 
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
    {selectedItem && (selectedItem.categorie.nom === 'Sandwich') && currentStep === 'choixPain' && (
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
        <div className='container'>
            <button className='btn btn-warning mb-3 text-white' onClick={handleBackClick}><i className="fa-solid fa-arrow-left"></i> Retour</button>
            <SelectDrink drinks={drinks} onSelectDrink={handleSelectDrink} />
        </div>
    )}
    {/* Choix des suppléments si la catégorie est sandwich ou burger */}
    {selectedItem && currentStep === 'choixSupplement' && (
        <div className='container'>
            <button className='btn btn-warning mb-3 text-white' onClick={handleBackClick}><i className="fa-solid fa-arrow-left"></i> Retour</button>
            <SelectSupplements supplements={supplements} onSelectSupplement={handleSelectSupplement} selectedSupplements={selectedSupplements} onNextClick={handleNextClick} />
        </div>
    )}
<Modal show={showModal} onHide={handleCloseModal} dialogClassName="modal-50w" centered>
    <Modal.Header closeButton>
        <Modal.Title className='d-flex justify-content-center'>Accompagner votre menu</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Row>
            {articles
              .filter(article => article.isSuggestion) // Filtrer les articles avec isSuggestion à true
              .map((article, index) => (
                <Col key={article._id} xs={12} md={3} className="mb-3">
                    <div className={`text-center ${selectedItems.find(selectedItem => selectedItem._id === article._id) ? "selected-class" : ""}`} 
                        onClick={() => handleToggleItem(article)}>
                            <img src={`https://maro.alwaysdata.net/${article.imageUrl}`} alt={article.nom} style={{ width: '100%', height: 'auto', cursor: 'pointer' }} />
                            <p>{article.nom} - {article.prix.toFixed(2).replace('.', ',')}€</p>
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
            className='btn-warning text-white'
            variant="text-white"
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
                    <h2 className='my-4 price itemPrice'>{total}€</h2>
                </div>
            </div>
        </div>
        {(orderItems.length > 0) && (
            <OrderSummary 
                orderItems={orderItems}
                onContinueOrder={handleContinueOrder} 
                onFinalizeOrder={handleFinalizeOrder} 
                onEditItem={handleSaveChanges}
                onRemoveItem={handleRemoveItem}
                pains={pains}
                garnitures={garnitures}
                sauces={sauces}
                supplements={supplements}
                drinks={drinks}
            />
        )}
    </div>
    </div>
)}
</div>
    );
};

export default Menu;