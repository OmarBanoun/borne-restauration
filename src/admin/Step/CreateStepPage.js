import React, { useState, useEffect } from "react";
import { 
    Paper, Typography, FormControl, InputLabel, Select, MenuItem, 
    TextField, Button, Box, CircularProgress 
} from "@mui/material";
import axios from "axios";

const CreateStepForm = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [description, setDescription] = useState("");
    const [maxOptions, setMaxOptions] = useState("");
    const [loading, setLoading] = useState(true);
    const [categorie, setCategorie] = useState("");
    const [nom, setNom] = useState("");
    const [options, setOptions] = useState([{ nom: "", image: null }]);

    // Charger les catégories depuis l'API
    useEffect(() => {
        axios.get("https://maro.alwaysdata.net/api/categories")
            .then(response => {
                setCategories(response.data);
                setLoading(false);
            })
            .catch(error => {
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
        formData.append("categories", JSON.stringify(selectedCategories)); // Envoi de l'ID de la catégorie
        const maxOptionsValue = maxOptions === "" ? -1 : parseInt(maxOptions, 10);
        formData.append("maxOptions", maxOptionsValue);
        console.log('maxOptions avant envoi:', maxOptionsValue);
        formData.append("articleId", "ID_DE_LARTICLE_ICI"); // Remplace par la vraie valeur

        // Ajouter les options
        const optionsData = options.map(({ nom, image }) => ({
            nom,
            prixSupplémentaire: 0, // Ajoute un prix par défaut si nécessaire
        }));
        formData.append("options", JSON.stringify(optionsData));

        // Ajouter les fichiers images
        options.forEach(({ image }) => {
            if (image) {
                formData.append("images", image);
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
            console.error("Erreur lors de la création de l'étape:", error.response?.data || error.message);
        }
        //Rediriger l'utilisateur vers la page de liste des étapes
        // Remplacez '/admin/steps' par le chemin de votre choix
        window.location.href = "/admin/step";
    };

    return (
        <Paper style={{ margin: 20, padding: 20 }}>
            <Typography variant="h5" style={{ marginBottom: 20 }}>Créer une Étape</Typography>
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
                        console.log('Nouvelle valeur:', e.target.value); // Pour déboguer
                        setMaxOptions(e.target.value);
                    }}
                    InputProps={{
                        inputProps: { 
                            min: 1,
                            // Ajouter un pattern pour n'accepter que les nombres
                            pattern: '[0-9]*'
                        }
                    }}
                    style={{ marginBottom: 20 }}
                    helperText="Exemple: 2 pour limiter à 2 sauces maximum"
                />

                <Typography variant="h6">Options</Typography>
                {options.map((option, index) => (
                    <Box key={`option-${index}`} display="flex" alignItems="center" flexDirection="column" mb={2}>
                        <TextField
                            fullWidth
                            label={`Option ${index + 1}`}
                            value={option.nom}
                            onChange={(e) => handleOptionChange(index, "nom", e.target.value)}
                            required
                            style={{ marginBottom: 10 }}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(index, e.target.files[0])}
                            style={{ marginBottom: 10 }}
                        />
                        <Button onClick={() => removeOptionField(index)} color="error" disabled={options.length === 1}>
                            Supprimer cette option
                        </Button>
                    </Box>
                ))}

                <Button onClick={addOptionField} variant="contained" color="secondary" style={{ marginBottom: 20 }}>
                    Ajouter une option
                </Button>

                <Button type="submit" variant="contained" color="primary" style={{ marginBottom: 20, marginLeft: 10 }}>
                    Créer l'Étape
                </Button>
            </form>
        </Paper>
    );
};

export default CreateStepForm;
