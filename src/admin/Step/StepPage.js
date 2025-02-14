import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	Button,
	List,
	ListItem,
	ListItemText,
	Paper,
	Typography,
} from "@mui/material";

// Ajouter ce composant avant StepPage
const SortableItem = ({ step, onDelete, onEdit, categories }) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: step._id });

        const getCategoryNames = (categoryIds) => {
            if (!Array.isArray(categoryIds)) return "Catégorie inconnue";
    
            return categoryIds
                .map((catId) => {
                    const category = categories.find((cat) => 
                        cat._id === (typeof catId === 'object' ? catId._id : catId)
                    );
                    return category ? category.nom : null;
                })
                .filter(Boolean)
                .join(", ");
        };

	const style = {
		transform: transform
			? `translate3d(${transform.x}px, ${transform.y}px, 0)`
			: undefined,
		transition,
		marginBottom: "8px",
		border: "1px solid #e0e0e0",
		borderRadius: "4px",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
	};

	return (
		<ListItem ref={setNodeRef} {...attributes} {...listeners} style={style}>
			<ListItemText
				primary={step.nom}
				secondary={
					<>
						{step.description}
						<br />
						<Typography component="span" variant="body2" color="textSecondary">
							Catégories: {getCategoryNames(step.categories)}
						</Typography>
					</>
				}
			/>
			<div>
				<Button
					variant="contained"
					color="error"
					style={{ marginRight: 10 }}
					onClick={() => onDelete(step._id)}
				>
					Supprimer
				</Button>
				<Button
					variant="contained"
					color="primary"
					onClick={() => onEdit(step._id)}
				>
					Modifier
				</Button>
			</div>
		</ListItem>
	);
};

const StepPage = () => {
	const [steps, setSteps] = useState([]);
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("all");
	const navigate = useNavigate();

	// Fonction de suppression
	const handleDelete = (stepId) => {
		if (window.confirm("Voulez-vous supprimer cette étape ?")) {
			axios
				.delete(`https://maro.alwaysdata.net/api/steps/${stepId}`)
				.then((response) => {
					setSteps((prev) => prev.filter((step) => step._id !== stepId));
				})
				.catch((error) =>
					console.error("Erreur lors de la suppression", error)
				);
		}
	};

	useEffect(() => {
		// Chargement des étapes
		axios
			.get("https://maro.alwaysdata.net/api/steps")
			.then((response) => {
				// Trier les étapes par leur ordre
				const sortedSteps = response.data.sort((a, b) => a.order - b.order);
				setSteps(sortedSteps);
			})
			.catch((error) => console.log(error));

		// Chargement des catégories
		axios
			.get("https://maro.alwaysdata.net/api/categories")
			.then((response) => setCategories(response.data))
			.catch((error) => console.log(error));
	}, []);

	// Filtrage des étapes
	const filteredSteps =
		selectedCategory === "all"
			? steps
			: steps.filter((step) =>
					step.categories.some(
						(cat) =>
							// Conversion en string pour la comparaison
							(typeof cat === "object" ? cat._id : cat) === selectedCategory
					)
			);

			const sensors = useSensors(
				useSensor(PointerSensor, {
					// Ajouter des options de configuration pour améliorer la détection
					activationConstraint: {
						distance: 5, // Distance minimale avant activation du drag
					},
				}),
				useSensor(KeyboardSensor, {
					coordinateGetter: sortableKeyboardCoordinates,
				})
			);

	// Ajouter la fonction handleDragEnd
	const handleDragEnd = async (event) => {
		const { active, over } = event;
		console.log("DragEnd event:", event);
        console.log("Active:", active);
        console.log("Over:", over);
		if (!active || !over) {
			console.log("Drag and drop incomplet:", { active, over });
			return;
		}

		if (active.id !== over.id) {
			// Créer le nouvel ordre
			const oldIndex = steps.findIndex((item) => item._id === active.id);
			const newIndex = steps.findIndex((item) => item._id === over.id);
			if (oldIndex === -1 || newIndex === -1) {
				console.log("Index invalides:", { oldIndex, newIndex });
				return;
			}
			const newOrder = arrayMove(steps, oldIndex, newIndex);

			// Mettre à jour l'état local immédiatement
			setSteps(newOrder);

			// Préparer les données pour le backend
			const orderData = newOrder.map((step, index) => ({
				id: step._id,
				order: index,
			}));

			try {
				// Envoyer la mise à jour au backend
				await axios.patch("https://maro.alwaysdata.net/api/steps/reorder", {
					order: orderData,
				});
				alert("Nouvel ordre sauvegardé !");
				console.log("Ordre mis à jour avec succès");
			} catch (error) {
				console.error("Erreur lors de la mise à jour de l'ordre:", error);
				// Optionnel : revenir à l'ordre précédent en cas d'erreur
				setSteps(steps);
			}
		}
	};

	return (
		<Paper style={{ margin: 20, padding: 20 }}>
			<Typography variant="h5" style={{ marginBottom: 20 }}>
				Liste des Étapes
			</Typography>
			{/* Boutons de filtrage */}
			<div
				style={{
					display: "flex",
					gap: "10px",
					flexWrap: "wrap",
					marginBottom: "20px",
				}}
			>
				<Button
					variant={selectedCategory === "all" ? "contained" : "outlined"}
					onClick={() => setSelectedCategory("all")}
				>
					Toutes
				</Button>
				{categories.map((category) => (
					<Button
						key={category._id}
						variant={
							selectedCategory === category._id ? "contained" : "outlined"
						}
						onClick={() => setSelectedCategory(category._id)}
					>
						{category.nom}
					</Button>
				))}
			</div>
			<Button
				variant="contained"
				color="primary"
				onClick={() => navigate("/admin/create-step")}
			>
				Créer une étape
			</Button>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={filteredSteps.map((step) => step._id)}
					strategy={verticalListSortingStrategy}
				>
					<List style={{ width: "100%" }}>
						{filteredSteps.map((step) => (
							<SortableItem
								key={step._id}
								step={step}
								onDelete={handleDelete}
								onEdit={(id) => {
									console.log("Navigation vers:", `/admin/edit-step/${id}`);
									navigate(`/admin/edit-step/${id}`);
								}}
								categories={categories}
							/>
						))}
					</List>
				</SortableContext>
			</DndContext>
		</Paper>
	);
};

export default StepPage;
