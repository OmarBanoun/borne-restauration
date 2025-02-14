import React, { useState, useEffect } from "react";
import "./Menu.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { calculateTotal } from "../../utils";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Swal from "sweetalert2";
import CategoryItem from "../Categories/CategoriesItem";
import MenuItem from "./MenuItem/MenuItem";
import ItemOptions from "./MenuItem/itemOptions";
import OrderSummary from "../OrderSummary/OrderSummary";
import SelectDrink from "./SelectDrink/SelectDrink";
import SelectGarniture from "./SelectGarniture/SelectGarniture";
import SelectViande from "./SelectViande/SelectViande";
import SelectDessert from "./SelectDessert/SelectDessert";
import SelectSauce from "./SelectSauce/SelectSauce";
import SelectPain from "./SelectPain/SelectPain";
import SelectSupplements from "./SelectSupplements/SelectSupplements";
import imgSP from "../../../assets/SP.png";
import imgAE from "../../../assets/a-emporter.png";
import RealTimeOrdering from "../RealTimeOrdering/RealTimeOrdering";
import { useInactivityAlert } from "../../Common/InactivityAlert";

const Menu = () => {
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("Sandwich");
	const [articles, setArticles] = useState([]);
	const [desserts, setDesserts] = useState([]);
	const [selectedItem, setSelectedItem] = useState(null);
	const [selectedItems, setSelectedItems] = useState([]);
	const [selectedOption, setSelectedOption] = useState(null);
	const [orderItems, setOrderItems] = useState([]);
	const [selectedDrink, setSelectedDrink] = useState(null);
	const [selectedPain, setSelectedPain] = useState(null);
	const [currentStep, setCurrentStep] = useState("choixCategorie");
	const [steps, setSteps] = useState([]);
	const [selectedOptions, setSelectedOptions] = useState({});
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
	const [orderNumber, setOrderNumber] = useState(() => {
		const savedOrderNumber = localStorage.getItem("orderNumber");
		// Assurez-vous de retourner un nombre et non une chaîne de caractères
		return savedOrderNumber ? Number(savedOrderNumber) : 1;
	});

	useInactivityAlert();

	// Dans votre useEffect initial, ajoutez le chargement des étapes
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [categoriesRes, stepsRes] = await Promise.all([
					axios.get("https://maro.alwaysdata.net/api/categories"),
					axios.get("https://maro.alwaysdata.net/api/steps"),
				]);

				setCategories(categoriesRes.data);
				setSteps(stepsRes.data);
			} catch (error) {
				console.error("Erreur lors du chargement des données", error);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		// Chargement des catégories depuis l'API
		axios
			.get("https://maro.alwaysdata.net/api/categories")
			.then((response) => {
				setCategories(response.data); // Mettez à jour les catégories avec les données de l'API
				// Sélectionner une catégorie par défaut si nécessaire
				const sandwichCategory = response.data.find(
					(c) => c.nom === "Sandwich"
				);
				if (sandwichCategory) {
					handleCategorySelect(sandwichCategory);
				}
			})
			.catch((error) =>
				console.error("Erreur lors de la récupération des catégories", error)
			);
	}, []);

	useEffect(() => {
		axios
			.get("https://maro.alwaysdata.net/api/articles")
			.then((response) => {
				// Ici, vous pouvez traiter les données reçues, par exemple, en les stockant dans un état
				setArticles(response.data);
				// Filtrer pour obtenir uniquement les articles de la catégorie "Dessert"
				const filteredDesserts = response.data.filter(
					(article) => article.categorie.nom === "Dessert"
				);
				setDesserts(filteredDesserts);
			})
			.catch((error) =>
				console.error("Erreur lors de la récupération des articles", error)
			);
	}, []);

	useEffect(() => {
		axios
			.get("https://maro.alwaysdata.net/api/secondary-articles/boissons")
			.then((response) => {
				setDrinks(response.data);
			})
			.catch((error) => console.log(error));

		axios
			.get("https://maro.alwaysdata.net/api/secondary-articles/garnitures")
			.then((response) => {
				setGarnitures(response.data);
			})
			.catch((error) => console.log(error));

		axios
			.get("https://maro.alwaysdata.net/api/secondary-articles/sauces")
			.then((response) => {
				setSauces(response.data);
			})
			.catch((error) => console.log(error));

		axios
			.get("https://maro.alwaysdata.net/api/secondary-articles/viandes")
			.then((response) => {
				setViandes(response.data);
			})
			.catch((error) => console.log(error));

		axios
			.get("https://maro.alwaysdata.net/api/secondary-articles/pains")
			.then((response) => {
				setPains(response.data);
			})
			.catch((error) => console.log(error));
	}, []);

	useEffect(() => {
		axios
			.get("https://maro.alwaysdata.net/api/supplements")
			.then((response) => {
				setSupplements(response.data);
			})
			.catch((error) => console.log(error));
	}, []);

	useEffect(() => {
		// Ajouter la classe quand le composant est monté
		document.getElementById("root").classList.add("max-height");

		// Retirer la classe quand le composant est démonté
		return () => {
			document.getElementById("root").classList.remove("max-height");
		};
	}, []);

	const handleCategorySelect = (category) => {
		if (selectedItem && selectedOption !== "seul") {
			Swal.fire({
				title: "Voulez-vous annuler cette commande en cours ?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Oui",
				cancelButtonText: "Non",
			}).then((result) => {
				if (result.isConfirmed) {
					// Réinitialiser tous les états
					resetSelections();
					setSelectedCategory(category.nom);
					setCurrentStep("choixArticle");
				}
			});
		} else if (category.nom === "Dessert") {
			setSelectedCategory(category.nom);
			setSelectedDesserts([]);
			setCurrentStep("choixDessert");
		} else {
			// Vérifier si la catégorie a des étapes associées
			const categorySteps = steps.filter(step => 
				step.categories.some(cat => 
					(typeof cat === 'object' ? cat._id : cat) === category._id
				)
			);
	
			console.log("Étapes trouvées pour la catégorie:", categorySteps);
			
			setSelectedCategory(category.nom);
			setCurrentStep("choixArticle");
		}
	};
	const handleItemClick = (item) => {
		setSelectedItem(item);
		setSelectedOption(null);
	
		if (item.nom.toLowerCase().includes('tacos')) {
			const match = item.nom.match(/(\d+)\s*viande/i);
			if (match) {
				const nbViandes = parseInt(match[1], 10);
				console.log(`Tacos ${nbViandes} viande(s) détecté`);
				const updatedSteps = steps.map(step => {
					if (step.nom.toLowerCase().includes('viande')) {
						return { ...step, maxOptions: nbViandes };
					}
					return step;
				});
				setSteps(updatedSteps);
			}
		}
	
		// Trouver les étapes associées aux catégories de l'item
		const categorySteps = steps.filter(step => 
			step.categories.some(cat => 
				(typeof cat === 'object' ? cat._id : cat) === item.categorie._id
			)
		).filter(step => !step.nom.toLowerCase().includes('boisson')); // Exclure l'étape boisson
	
		console.log("Étapes trouvées pour la catégorie:", categorySteps);
	
		// Si aucune étape OU une seule étape, aller directement à choixOption
		if (categorySteps.length === 0 || categorySteps.length === 1) {
			setCurrentStep("choixOption");
		} else {
			// Sinon commencer par la première étape
			setCurrentStep(categorySteps[0].nom);
		}
	};
	const filteredArticles = articles.filter(
		(item) => item.categorie.nom === selectedCategory
	);
	const handleOptionSelect = (item, option) => {
		// Sauvegarder l'option sélectionnée
		setSelectedOption(option);
	
		if (option === "menu") {
			// Si c'est un menu, chercher l'étape boisson
			const boissonStep = steps.find(step => 
				step.nom.toLowerCase().includes('boisson')
			);
			if (boissonStep) {
				setCurrentStep(boissonStep.nom);
			}
		} else {
			// Si ce n'est pas un menu, finaliser la commande
			const finalItem = {
				...item,
				type: option,
				options: selectedOptions,
				prix: option === "menu" ? item.prix + 2 : item.prix,
			};
			handleAddToCart(finalItem);
		}
	};
	// handleSelectPain
	const handleSelectPain = (pain) => {
		setSelectedPain(pain);
		setSelectedItem({
			...selectedItem,
			pain: pain.nom,
			painImg: pain.imageUrl,
		});
		setCurrentStep("choixGarniture");
		console.log("Pain sélectionné :", pain);
	};
	const handleSelectDrink = (drink) => {
		// Ajouter l'article avec la boisson sélectionnée à orderItems
		const updatedItem = {
			...selectedItem,
			drink: drink.nom,
			drinkImg: drink.imageUrl,
		};
		setOrderItems([...orderItems, updatedItem]);

		// Réinitialisation pour le prochain article
		setSelectedItem(null);
		setSelectedOption(null);
		setSelectedDrink(null);
		setSelectedGarnitures(null);
		setCurrentStep("resumeCommande");
		handleShowModal();
	};

	// const handleSelectGarniture = (garniture) => {
	//     if (selectedGarnitures.includes(garniture)) {
	//         setSelectedGarnitures(selectedGarnitures.filter(g => g !== garniture));
	//     } else {
	//         setSelectedGarnitures([...selectedGarnitures, garniture]);
	//     }
	//     console.log("Garnitures sélectionnées:", selectedGarnitures);
	// };
	const handleSelectGarniture = (garniture) => {
		if (selectedGarnitures.includes(garniture)) {
			setSelectedGarnitures(selectedGarnitures.filter((g) => g !== garniture));
		} else {
			setSelectedGarnitures([...selectedGarnitures, garniture]);
		}
		console.log("Garnitures sélectionnées:", selectedGarnitures);
	};

	const handleSelectSauce = (sauce) => {
		const isSelected = selectedSauces.includes(sauce);

		if (isSelected) {
			// Si la sauce est déjà sélectionnée, la retirer de la sélection
			setSelectedSauces(selectedSauces.filter((s) => s !== sauce));
		} else if (selectedSauces.length < 2) {
			// Ajouter la sauce à la sélection seulement si moins de 2 sont déjà sélectionnées
			setSelectedSauces([...selectedSauces, sauce]);
		}
	};

	const handleSelectViande = (viande) => {
		if (selectedViandes.includes(viande)) {
			setSelectedViandes(selectedViandes.filter(v => v !== viande));
		} else if (selectedViandes.length < maxViandes) {
			setSelectedViandes([...selectedViandes, viande]);
		} else {
			Swal.fire({
				title: "Maximum atteint !",
				text: `Vous ne pouvez sélectionner que ${maxViandes} viande${maxViandes > 1 ? 's' : ''} pour ce tacos`,
				icon: "warning",
				confirmButtonColor: "#3085d6"
			});
		}
	};
	const handleSelectSupplement = (supplement) => {
		setSelectedSupplements((prevState) => {
			const isAlreadySelected = prevState.includes(supplement);
			const newSelection = isAlreadySelected
				? prevState.filter((s) => s !== supplement)
				: [...prevState, supplement];

			console.log("Selected Supplements:", newSelection); // Log here to see selected supplements
			return newSelection;
		});
	};
	const onSelectDessert = (dessert) => {
		if (selectedDesserts.includes(dessert)) {
			setSelectedDesserts(selectedDesserts.filter((d) => d !== dessert));
		} else {
			setSelectedDesserts([...selectedDesserts, dessert]);
		}
	};

	const handleNextClick = () => {
		const categorySteps = steps.filter(step => 
			step.categories.some(cat => 
				(typeof cat === 'object' ? cat._id : cat) === selectedItem.categorie._id
			)
		).filter(step => !step.nom.toLowerCase().includes('boisson')); // Exclure l'étape boisson
	
		const currentStepIndex = categorySteps.findIndex(
			step => step.nom === currentStep
		);
	
		if (currentStepIndex === categorySteps.length - 1) {
			setCurrentStep("choixOption");
		} else {
			setCurrentStep(categorySteps[currentStepIndex + 1].nom);
		}
	};

	// Fonction pour réinitialiser toutes les sélections
	const resetSelections = () => {
		setSelectedItem(null);
		setSelectedOption(null);
		setSelectedPain(null);
		setSelectedGarnitures([]);
		setSelectedSauces([]);
		setSelectedViandes([]);
		setSelectedDesserts([]);
		setSelectedDrink(null);
		setSelectedSupplements([]);
		setSelectedOptions({}); // Réinitialiser les options dynamiques
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
		if (
			!selectedCategory &&
			!selectedItem &&
			currentStep === "choixCategorie"
		) {
			console.log(
				"Toutes les conditions sont remplies pour afficher les catégories."
			);
		}
	}, [selectedCategory, selectedItem, currentStep]);

	useEffect(() => {
		console.log("L'étape actuelle a changé :", currentStep);
		if (currentStep === "resumeCommande") {
			console.log(
				"SelectedCategory devrait être réinitialisé :",
				selectedCategory
			);
		}
	}, [currentStep, selectedCategory]);

	useEffect(() => {
		console.log(
			"Supplements sélectionnés après mise à jour:",
			selectedSupplements
		);
	}, [selectedSupplements]);

	useEffect(() => {
		// Ceci s'exécutera à chaque mise à jour de orderNumber, persistant la nouvelle valeur
		localStorage.setItem("orderNumber", orderNumber.toString());
		console.log("Persisté orderNumber:", orderNumber);
	}, [orderNumber]);

	useEffect(() => {
		if (currentStep === "resumeCommande") {
			const sandwichCategory = categories.find((c) => c.nom === "Sandwich");
			if (sandwichCategory) {
				setSelectedCategory("Sandwich");
				setCurrentStep("choixCategorie");
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
		if (currentStep === "choixOption") {
			const categorySteps = steps.filter(step => 
				step.categories.some(cat => 
					(typeof cat === 'object' ? cat._id : cat) === selectedItem.categorie._id
				)
			);
			setCurrentStep(categorySteps[categorySteps.length - 1].nom);
			return;
		}
		if (!selectedItem) {
			// Si pas d'item sélectionné, retour au choix de catégorie
			setCurrentStep("choixCategorie");
			setSelectedCategory(null);
			return;
		}

		// Récupérer toutes les étapes de la catégorie actuelle
		const categorySteps = steps.filter(step => 
			step.categories.includes(selectedItem.categorie._id)
		);

		// Trouver l'index de l'étape actuelle
		const currentStepIndex = categorySteps.findIndex(
			step => step.nom === currentStep
		);

		if (currentStepIndex <= 0) {
			// Si on est à la première étape, retour au choix d'article
			setCurrentStep("choixArticle");
			setSelectedItem(null);
			// Réinitialiser les sélections de cette étape
			resetSelectionsForStep(currentStep);
		} else {
			// Sinon, aller à l'étape précédente
			setCurrentStep(categorySteps[currentStepIndex - 1].nom);
			// Réinitialiser les sélections de l'étape actuelle
			resetSelectionsForStep(currentStep);
		}
	};

	const resetSelectionsForStep = (stepName) => {
		// Récupérer l'étape depuis la liste des étapes
		const step = steps.find((s) => s.nom === stepName);
		if (!step) return;

		// Réinitialiser en fonction du type d'étape
		switch (step.type) {
			case "single":
				// Pour les étapes à sélection unique
				setSelectedOptions((prev) => ({
					...prev,
					[stepName]: null,
				}));
				break;
			case "multiple":
				// Pour les étapes à sélections multiples
				setSelectedOptions((prev) => ({
					...prev,
					[stepName]: [],
				}));
				break;
			default:
				break;
		}
	};

	const handleOptionSelection = (stepName, option) => {
		const currentStep = steps.find(s => s.nom === stepName);
		
		// Récupérer les sélections actuelles pour cette étape
		const currentSelections = selectedOptions[stepName] || [];
		const isSelected = currentSelections.some(opt => opt._id === option._id);
	
		// Si l'option est déjà sélectionnée, la retirer
		if (isSelected) {
			setSelectedOptions(prev => ({
				...prev,
				[stepName]: currentSelections.filter(opt => opt._id !== option._id)
			}));
			return;
		}
	
		// Pour une nouvelle sélection, vérifier les limites
		if (currentStep.maxOptions && currentStep.maxOptions > 0) {
			if (currentSelections.length >= currentStep.maxOptions) {
				Swal.fire({
					title: 'Maximum atteint !',
					text: `Vous ne pouvez sélectionner que ${currentStep.maxOptions} option(s)`,
					icon: 'warning',
					confirmButtonColor: "#3085d6"
				});
				return;
			}
		}

		if (stepName.toLowerCase().includes('boisson')) {
			setSelectedOptions(prev => ({
				...prev,
				[stepName]: [option]
			}));
	
			// Créer l'item final avec la boisson
			const finalItem = {
				...selectedItem,
				type: "menu",
				options: {
					...selectedOptions,
					[stepName]: [option]
				},
				prix: selectedItem.prix + 2, // Prix menu
			};
			handleAddToCart(finalItem);
			return;
		}
	
		// Gérer la sélection en fonction du type d'étape
		if (currentStep.type === "single") {
			// Sélection unique - remplacer l'option existante
			setSelectedOptions(prev => ({
				...prev,
				[stepName]: [option]
			}));
	
			// Vérifier si c'est la dernière étape normale
			const categorySteps = steps.filter(step => 
				step.categories.some(cat => 
					(typeof cat === 'object' ? cat._id : cat) === selectedItem.categorie._id
				)
			);
			const currentStepIndex = categorySteps.findIndex(step => step.nom === stepName);
			const isLastStep = currentStepIndex === categorySteps.length - 1;
	
			if (isLastStep) {
				setCurrentStep("choixOption"); // Toujours aller à choixOption d'abord
			} else {
				handleNextClick();
			}
		} else {
			// Sélection multiple - ajouter à la liste
			setSelectedOptions(prev => ({
				...prev,
				[stepName]: [...currentSelections, option]
			}));
		}
	};

	const shouldShowNextButton = (step) => {
		const currentSelections = selectedOptions[step.nom];

		if (step.type === "single") {
			return currentSelections !== null;
		} else {
			return currentSelections?.length > 0;
		}
	};

	const handleContinueOrder = () => {
		// Réinitialiser les états pour ramener l'utilisateur à la première page
		setSelectedCategory("Sandwich");
		setSelectedItem(null);
		setSelectedOption(null);
		setSelectedPain(null);
		setSelectedDrink(null);
		setSelectedGarnitures([]); // Et les garnitures sélectionnées si nécessaire
		setSelectedSauces([]);
		setSelectedViandes([]);
		setSelectedDesserts([]);
		setCurrentStep("choixCategorie"); // Retourner au choix de catégorie
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
			title: "Êtes-vous sûr?",
			text: "Vous ne pourrez pas revenir en arrière!",
			icon: "warning",
			showCancelButton: true,
			// confirmButtonColor: '--primary-color',
			cancelButtonColor: "#d33",
			confirmButtonText: "Oui, supprimez-le!",
			cancelButtonText: "Annuler",
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
	const total = calculateTotal(orderItems);
	const handleOrderTypeSelect = (type) => {
		setOrderType(type);
		localStorage.setItem("orderType", type);
		// ajouter le type de commande à orderItems
		// setOrderItems([...orderItems, { type: type }]);
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
		const isSelected = selectedItems.some(
			(selectedItem) => selectedItem._id === item._id
		);

		if (isSelected) {
			// Si l'article est déjà sélectionné, le retirer de la liste
			setSelectedItems(
				selectedItems.filter((selectedItem) => selectedItem._id !== item._id)
			);
		} else {
			// Sinon, l'ajouter à la liste
			setSelectedItems([...selectedItems, item]);
		}
	};
	const handleFinalizeOrder = async () => {
		try {
			const orderNumberResponse = await axios.get(
				"https://maro.alwaysdata.net/api/next-order-number"
			);
			const nextOrderNumber = orderNumberResponse.data.nextOrderNumber;
			console.log("Numéro de commande récupéré:", nextOrderNumber);

			// Ici, vous pouvez passer nextOrderNumber à votre composant enfant ou le stocker dans un état partagé
			// Exemple de mise à jour d'un état (si vous utilisez useState pour stocker le numéro de commande)
			setOrderNumber(nextOrderNumber);

			// Si vous naviguez vers un nouveau composant pour le paiement, vous pouvez passer cet état comme suit :
			// navigate('/chemin-vers-composant-paiement', { state: { orderNumber: nextOrderNumber } });
			navigate("/order-summary", {
				state: {
					orderType,
					orderItems,
					total,
					orderNumber: nextOrderNumber,
				},
			});
		} catch (error) {
			console.error(
				"Erreur lors de la récupération du numéro de commande:",
				error
			);
		}
	};

	const handleAddToCart = (finalItem) => {
		setOrderItems((prev) => [...prev, finalItem]);
		setSelectedItem(null);
		setSelectedOptions({});
		setCurrentStep("choixArticle");
		// Si vous voulez afficher la modal des suggestions
		if (finalItem.type === "menu") {
			setShowModal(true);
		}
	};

	return (
		<div className="menu-container">
			{!orderType && (
				<div className="order-type-selection-container">
					<h2 className="order-type-title text-center">
						Où Souhaitez-vous Déguster Votre Repas ?
					</h2>
					<div className="order-type-selection">
						<div
							className="card"
							onClick={() => handleOrderTypeSelect("sur_place")}
						>
							<img
								src={imgSP}
								alt="img-SP"
								className="card-img-top img-fluid"
							/>
							<h3 className="card-title mt-3">Sur Place</h3>
						</div>
						<div
							className="card"
							onClick={() => handleOrderTypeSelect("a_emporter")}
						>
							<img
								src={imgAE}
								alt="img-AE"
								className="card-img-top img-fluid"
							/>
							<h3 className="card-title mt-3">À Emporter</h3>
						</div>
					</div>
				</div>
			)}
			{orderType && (
				<div>
					<div className="top-section">
						<div className="categories-bar">
							{/* Logique pour afficher les catégories */}
							<div className="container mt-4">
								<h2 className="text-center orange categ-title">Catégories</h2>
								{categories.map((category) => (
									<div
										key={category._id}
										className={
											selectedCategory === category.nom ? "selected-class" : ""
										}
									>
										<CategoryItem
											category={category}
											onSelect={handleCategorySelect}
										/>
									</div>
								))}
							</div>
						</div>

						<div className="order-process">
							{/* Choix des articles */}
							{selectedCategory &&
								selectedCategory !== "Desserts" &&
								!selectedItem &&
								currentStep === "choixArticle" && (
									<div className="container">
										<h2 className="text-center mt-5">
											Selectionnez votre {selectedCategory}
										</h2>
										<div className="row mt-3">
											{filteredArticles.map((item) => (
												<div className="col-4 text-center" key={item.id}>
													<MenuItem item={item} onSelect={handleItemClick} />
												</div>
											))}
										</div>
									</div>
								)}
							{/* Étapes dynamiques */}
							{steps.map(
								(step) =>
									currentStep === step.nom && (
										<div className="container" key={step._id}>
											<button
												className="btn btn-warning mb-3 text-white"
												onClick={handleBackClick}
											>
												<i className="fa-solid fa-arrow-left"></i> Retour
											</button>
											<h2 className="text-center mt-3">{step.description}</h2>
											<div className="row mt-3">
												{step.options.map((option) => (
													<div className="col-4 text-center" key={option._id}>
														<div
															className={`option-card ${
																selectedOptions[step.nom]?.some(
																	(opt) => opt._id === option._id
																)
																	? "selected"
																	: ""
															}`}
															onClick={() =>
																handleOptionSelection(step.nom, option)
															}
														>
															{option.imageUrl && (
																<img
																	src={`https://maro.alwaysdata.net/${option.imageUrl}`}
																	alt={option.nom}
																	className="garniture-image img-fluid"
																/>
															)}
															<h3 className="mt-2">{option.nom}</h3>
														</div>
													</div>
												))}
											</div>
											{shouldShowNextButton(step) && (
												<div className="d-flex justify-content-center">
													<button
														className="btn btn-warning btn-lg col-5 text-white mt-3"
														onClick={handleNextClick}
													>
														Suivant
													</button>
												</div>
											)}
										</div>
									)
							)}
							{currentStep === "choixOption" && (
								<div className="container">
									<button
										className="btn btn-warning mb-3 text-white"
										onClick={handleBackClick}
									>
										<i className="fa-solid fa-arrow-left"></i> Retour
									</button>
									<ItemOptions
										item={selectedItem}
										onOptionSelect={handleOptionSelect}
									/>
								</div>
							)}
							<Modal
								show={showModal}
								onHide={handleCloseModal}
								dialogClassName="modal-50w"
								centered
							>
								<Modal.Header closeButton>
									<Modal.Title className="d-flex justify-content-center">
										Accompagner votre menu
									</Modal.Title>
								</Modal.Header>
								<Modal.Body>
									<Row>
										{articles
											.filter((article) => article.isSuggestion) // Filtrer les articles avec isSuggestion à true
											.map((article, index) => (
												<Col key={article._id} xs={12} md={3} className="mb-3">
													<div
														className={`text-center ${
															selectedItems.find(
																(selectedItem) =>
																	selectedItem._id === article._id
															)
																? "selected-class"
																: ""
														}`}
														onClick={() => handleToggleItem(article)}
													>
														<img
															src={`https://maro.alwaysdata.net/${article.imageUrl}`}
															alt={article.nom}
															style={{
																width: "100%",
																height: "auto",
																cursor: "pointer",
															}}
														/>
														<p>
															{article.nom} -{" "}
															{article.prix.toFixed(2).replace(".", ",")}€
														</p>
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
										className="btn-warning text-white"
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
					<div className="order-summary">
						<div className="d-flex flex-row justify-content-between commande">
							<h4 className="py-3 col-8 mb-0">Prix</h4>
							<div className="col-3 bg-dark">
								<div className="text-white d-flex align-items-center justify-content-around h-100 text-white commande">
									<strong className="Total">Total</strong>
									<h2 className="my-4 price itemPrice">{total}€</h2>
								</div>
							</div>
						</div>
						{orderItems.length > 0 && (
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
								orderType={orderType}
							/>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default Menu;
