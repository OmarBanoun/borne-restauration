import React, { useState, useEffect } from "react";
import {
	Paper,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Button,
	Box,
	CircularProgress,
} from "@mui/material";
import axios from "axios";
import { parse } from "date-fns";

const CreateStepForm = () => {
	const [categories, setCategories] = useState([]);
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [stepType, setStepType] = useState("FREE");
	const [description, setDescription] = useState("");
	const [maxOptions, setMaxOptions] = useState("");
	const [loading, setLoading] = useState(true);
	const [categorie, setCategorie] = useState("");
	const [nom, setNom] = useState("");
	const [options, setOptions] = useState([
		{ nom: "", image: null, prixSupplémentaire: 0 },
	]);

	// Charger les catégories depuis l'API
	useEffect(() => {
		axios
			.get("https://maro.alwaysdata.net/api/categories")
			.then((response) => {
				setCategories(response.data);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Erreur lors du chargement des catégories:", error);
				setLoading(false);
			});
	}, []);

	// Gérer l'ajout d'une nouvelle option
	const addOptionField = () => {
		setOptions([...options, { nom: "", image: null }]);
	};

	// Gérer la suppression d'une option
	const removeOptionField = (index) => {
		setOptions(options.filter((_, i) => i !== index));
	};

	// Gérer les changements dans les champs des options
	const handleOptionChange = (index, field, value) => {
		const updatedOptions = [...options];
		if (field === "prixSupplémentaire") {
			// Convertir en nombre et gérer les valeurs négatives
			value = Math.max(0, parseFloat(value) || 0);
		}
		updatedOptions[index][field] = value;
		setOptions(updatedOptions);
	};

	// Gérer le changement de fichier image
	const handleImageChange = (index, file) => {
		const updatedOptions = [...options];
		updatedOptions[index].image = file;
		setOptions(updatedOptions);
	};

	// Gérer l'envoi du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append("nom", nom);
        formData.append("description", description);
        formData.append("categories", JSON.stringify(selectedCategories));
		formData.append("stepType", stepType);
        const maxOptionsValue = maxOptions === "" ? -1 : parseInt(maxOptions, 10);
        formData.append("maxOptions", maxOptionsValue);
    
        // Correction du formatage des options avec le prix supplémentaire
        const optionsData = options.map(option => ({
            nom: option.nom,
            prixSupplémentaire: parseFloat(option.prixSupplémentaire) || 0,
            // autres champs si nécessaire
        }));
    
        // Debug pour vérifier les données avant envoi
        console.log("Options avant envoi:", optionsData);
        
        formData.append("options", JSON.stringify(optionsData));
    
        // Ajouter les images
        options.forEach((option, index) => {
            if (option.image) {
                formData.append(`images`, option.image);
            }
        });
    
        try {
            const response = await axios.post(
                "https://maro.alwaysdata.net/api/steps",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            console.log("Étape créée avec succès:", response.data);
        } catch (error) {
            console.error(
                "Erreur lors de la création de l'étape:",
                error.response?.data || error.message
            );
        }
        window.location.href = "/admin/step";
    };

	return (
		<Paper style={{ margin: 20, padding: 20 }}>
			<Typography variant="h5" style={{ marginBottom: 20 }}>
				Créer une Étape
			</Typography>
			<form onSubmit={handleSubmit}>
				{/* Sélecteur de catégorie */}
				<FormControl fullWidth style={{ marginBottom: 20 }}>
					<InputLabel>Choisir les catégories</InputLabel>
					<Select
						multiple
						value={selectedCategories}
						onChange={(e) => setSelectedCategories(e.target.value)}
						required
					>
						{loading ? (
							<MenuItem disabled>
								<CircularProgress size={24} />
							</MenuItem>
						) : (
							categories.map((category) => (
								<MenuItem key={category._id} value={category._id}>
									{category.nom}
								</MenuItem>
							))
						)}
					</Select>
				</FormControl>
				<FormControl fullWidth style={{ marginBottom: 20 }}>
                    <InputLabel>Type d'étape</InputLabel>
                    <Select
                        value={stepType}
                        onChange={(e) => setStepType(e.target.value)}
                        required
                    >
                        <MenuItem value="FREE">Étape gratuite</MenuItem>
                        <MenuItem value="PAID">Étape payante</MenuItem>
                        <MenuItem value="MIXED">Étape mixte</MenuItem>
                    </Select>
                    <Typography variant="caption" color="textSecondary">
                        FREE: Aucune option payante | PAID: Toutes les options sont payantes | MIXED: Mélange d'options gratuites et payantes
                    </Typography>
                </FormControl>

				{/* Champ pour le nom de l'étape */}
				<TextField
					fullWidth
					label="Nom de l'Étape"
					value={nom}
					onChange={(e) => setNom(e.target.value)}
					required
					style={{ marginBottom: 20 }}
				/>
				<TextField
					fullWidth
					label="Description de l'étape"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					multiline
					rows={4}
					style={{ marginBottom: 20 }}
				/>
				<TextField
					type="number"
					fullWidth
					label="Nombre maximum d'options sélectionnables (laisser vide pour illimité)"
					value={maxOptions}
					onChange={(e) => {
						console.log("Nouvelle valeur:", e.target.value); // Pour déboguer
						setMaxOptions(e.target.value);
					}}
					InputProps={{
						inputProps: {
							min: 1,
							// Ajouter un pattern pour n'accepter que les nombres
							pattern: "[0-9]*",
						},
					}}
					style={{ marginBottom: 20 }}
					helperText="Exemple: 2 pour limiter à 2 sauces maximum"
				/>

				<Typography variant="h6">Options</Typography>
				{options.map((option, index) => (
					<Box
						key={`option-${index}`}
						display="flex"
						alignItems="center"
						flexDirection="column"
						mb={2}
					>
						<TextField
							fullWidth
							label={`Option ${index + 1}`}
							value={option.nom}
							onChange={(e) => handleOptionChange(index, "nom", e.target.value)}
							required
							style={{ marginBottom: 10 }}
						/>
						{/* Afficher le champ prix supplémentaire uniquement pour les étapes PAID ou MIXED */}
						{(stepType === "PAID" || stepType === "MIXED") && (
							<TextField
								fullWidth
								type="number"
								label="Prix supplémentaire (€)"
								value={option.prixSupplémentaire}
								onChange={(e) =>
									handleOptionChange(index, "prixSupplémentaire", e.target.value)
								}
								InputProps={{
									inputProps: {
										min: 0,
										step: "0.1",
									},
								}}
								style={{ marginBottom: 10 }}
							/>
						)}
						<input
							type="file"
							accept="image/*"
							onChange={(e) => handleImageChange(index, e.target.files[0])}
							style={{ marginBottom: 10 }}
						/>
						<Button
							onClick={() => removeOptionField(index)}
							color="error"
							disabled={options.length === 1}
						>
							Supprimer cette option
						</Button>
					</Box>
				))}

				<Button
					onClick={addOptionField}
					variant="contained"
					color="secondary"
					style={{ marginBottom: 20 }}
				>
					Ajouter une option
				</Button>

				<Button
					type="submit"
					variant="contained"
					color="primary"
					style={{ marginBottom: 20, marginLeft: 10 }}
				>
					Créer l'Étape
				</Button>
			</form>
		</Paper>
	);
};

export default CreateStepForm;
