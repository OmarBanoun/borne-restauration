import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Paper,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';

const EditStep = () => {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]); 
  const [maxOptions, setMaxOptions] = useState("");
  const [description, setDescription] = useState("");
  const [stepType, setStepType] = useState("FREE");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categorie, setCategorie] = useState("");
  const [nom, setNom] = useState("");
  const [options, setOptions] = useState([]);
  const [stepData, setStepData] = useState(null);
  const [tempImageUrls, setTempImageUrls] = useState({}); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, stepRes] = await Promise.all([
          axios.get("https://maro.alwaysdata.net/api/categories"),
          axios.get(`https://maro.alwaysdata.net/api/steps/${id}`)
        ]);

        if (!stepRes.data || !categoriesRes.data) {
          throw new Error('Données manquantes dans la réponse');
        }

        const step = stepRes.data;
        console.log('Données brutes de l\'étape:', stepRes.data);
        console.log('Type de maxOptions:', typeof step.maxOptions);
        console.log('Valeur de maxOptions:', step.maxOptions);

        setNom(step.nom || '');
        setDescription(step.description || '');
        setCategories(categoriesRes.data);
        setStepType(step.stepType || 'FREE');
        const categoriesIds = step.categories.map(cat => typeof cat === 'object' ? cat._id : cat);
        setSelectedCategories(categoriesIds);
        if (step.maxOptions && step.maxOptions > 0) {
          setMaxOptions(step.maxOptions.toString());
          console.log('maxOptions défini à:', step.maxOptions);
      } else {
          setMaxOptions('');
          console.log('maxOptions défini à vide car illimité ou non défini');
      }

        // Formatage des options avec vérification du peuplement
        const formattedOptions = step.options.map(opt => {
          console.log('Option brute reçue:', opt);
          
          if (!opt || typeof opt === 'string') {
              console.warn('Option invalide:', opt);
              return { nom: '', imageUrl: '', prixSupplémentaire: 0 };
          }
      
          // Construction de l'URL de la même manière que dans EditArticle
          const imageUrl = opt.imageUrl 
              ? `https://maro.alwaysdata.net/${opt.imageUrl}`  // Même format que EditArticle
              : '';
      
          console.log('URL image construite:', imageUrl);
          
          return {
              _id: opt._id,
              nom: opt.nom,
              imageUrl: imageUrl,
              prixSupplémentaire: opt.prixSupplémentaire || 0
          };
      });

        console.log('Options formatées finales:', formattedOptions);
        setOptions(formattedOptions);

        // Initialisation des URLs temporaires
        const initialTempUrls = {};
        formattedOptions.forEach((opt, index) => {
          if (opt.imageUrl) {
            initialTempUrls[index] = opt.imageUrl;
          }
        });
        setTempImageUrls(initialTempUrls);

      } catch (error) {
        console.error('Erreur fetchData:', error);
        setError(error.message || 'Erreur de chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
}, [id]);

  console.log('Current state:', { loading, error, options, categories, nom });


  const handleOptionChange = (index, field, value) => {
    const updatedOptions = options.map((option, i) => {
      if (i === index) {
        return {
          ...option,
          [field]: value
        };
      }
      return option;
    });
    setOptions(updatedOptions);
  };

  const handleImageChange = (index, file) => {
    if (!file) return;
  
    const newUrl = URL.createObjectURL(file);
    setTempImageUrls(prev => ({ ...prev, [index]: newUrl }));
  
    const updatedOptions = options.map((option, i) => {
      if (i === index) {
        return {
          ...option,
          imageFile: file,
          imageUrl: newUrl
        };
      }
      return option;
    });
    setOptions(updatedOptions);
  };

  const addOptionField = () => {
    setOptions([
      ...options, 
      { 
        _id: null,          // null pour les nouvelles options
        nom: "",            // nom vide par défaut
        imageUrl: "",       // pas d'image par défaut
        imageFile: null,    // pas de fichier par défaut
        prixSupplémentaire: 0, // prix supplémentaire par défaut
        isNew: true        // marqueur pour identifier les nouvelles options
      }
    ]);
  };

  const removeOptionField = async (index) => {
    try {
        const optionToRemove = options[index];
        
        if (optionToRemove._id) {
            // Mise à jour de l'étape avec la liste d'options mise à jour
            await axios.patch(`https://maro.alwaysdata.net/api/steps/${id}/remove-option`, {
                optionId: optionToRemove._id
            });
            console.log('Option supprimée de l\'étape:', optionToRemove._id);
        }

        // Mise à jour de l'état local
        setOptions(options.filter((_, i) => i !== index));
        
        // Nettoyage de l'URL temporaire
        if (tempImageUrls[index]) {
            const newTempUrls = { ...tempImageUrls };
            delete newTempUrls[index];
            setTempImageUrls(newTempUrls);
        }
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'option:', error);
        setError('Erreur lors de la suppression de l\'option');
    }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("nom", nom);
  formData.append("description", description);
  formData.append("categories", JSON.stringify(selectedCategories));
  formData.append("stepType", stepType);
  const maxOptionsValue = maxOptions === '' ? -1 : parseInt(maxOptions, 10);
  console.log('maxOptions avant envoi:', maxOptionsValue);
  formData.append("maxOptions", maxOptionsValue);

  // Convertir les options en format JSON avant l'envoi
  const existingOptions = [];
  const newOptions = [];

  options.forEach((option, index) => {
    if (option._id) {
      existingOptions.push({
        _id: option._id,
        nom: option.nom,
        prixSupplémentaire: option.prixSupplémentaire,
        hasNewImage: !!option.imageFile
      });
      if (option.imageFile) {
        formData.append('images', option.imageFile);
      }
    } else {
      newOptions.push({
        nom: option.nom,
        prixSupplémentaire: option.prixSupplémentaire,
        hasImage: !!option.imageFile
      });
      if (option.imageFile) {
        formData.append('images', option.imageFile);
      }
    }
  });

  // Ajouter les options sous forme de chaînes JSON
  formData.append('existingOptions', JSON.stringify(existingOptions));
  formData.append('newOptions', JSON.stringify(newOptions));

  try {
    const response = await axios.put(
      `https://maro.alwaysdata.net/api/steps/${id}`, 
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log('Données envoyées:', {
      existingOptions,
      newOptions,
      images: formData.getAll('images')
    });
    console.log('Réponse du serveur:', response.data);
    window.history.back();
  } catch (error) {
    console.error('Erreur lors de l\'envoi:', error);
    setError('Erreur lors de la mise à jour de l\'étape');
  }
};

    // Nettoyage des URLs temporaires
    useEffect(() => {
        return () => {
            Object.values(tempImageUrls).forEach(URL.revokeObjectURL);
        };
    }, [tempImageUrls]);


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
<Paper style={{ margin: 20, padding: 20 }}>
  <Button 
    variant="contained" 
    color="primary" 
    style={{ marginBottom: 20 }} 
    onClick={() => window.history.back()}
  >
    Retour
  </Button>
  
  <Typography variant="h5" gutterBottom>Modifier l'Étape</Typography>

  {error && <Alert severity="error" style={{ marginBottom: 20 }}>{error}</Alert>}

  <form onSubmit={handleSubmit}>
    <FormControl fullWidth style={{ marginBottom: 20 }}>
      <InputLabel>Catégorie</InputLabel>
      <Select
        multiple
        value={selectedCategories || []}
        onChange={(e) => setSelectedCategories(e.target.value)}
        required
      >
        {categories.map((category) => (
          <MenuItem key={category._id} value={category._id}>
            {category.nom}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <TextField
      fullWidth
      label="Nom de l'étape"
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

    <FormControl fullWidth style={{ marginBottom: 20 }}>
      <InputLabel>Type d'étape</InputLabel>
      <Select
        value={stepType}
        onChange={(e) => setStepType(e.target.value)}
        required
      >
        <MenuItem value="FREE">Gratuit</MenuItem>
        <MenuItem value="PAID">Payant</MenuItem>
        <MenuItem value="MIXED">Mixte</MenuItem>
      </Select>
    </FormControl>

    <TextField
      type="number"
      fullWidth
      label="Nombre maximum d'options sélectionnables (laisser vide pour illimité)"
      value={maxOptions}
      onChange={(e) => setMaxOptions(e.target.value)}
      InputProps={{
        inputProps: { min: 1 }
      }}
      style={{ marginBottom: 20 }}
      helperText="Exemple: 2 pour limiter à 2 sauces maximum"
    />

    <Typography variant="h6" gutterBottom>Options</Typography>

    {options.map((option, index) => (
      <Box 
        key={index} 
        border={1} 
        borderColor="grey.300" 
        borderRadius={2} 
        p={2} 
        mb={2}
      >
        <TextField
          fullWidth
          label={`Nom de l'option ${index + 1}`}
          value={option?.nom || ''}
          onChange={(e) => handleOptionChange(index, 'nom', e.target.value)}
          required
          style={{ marginBottom: 10 }}
        />

        {stepType === 'PAID' && (
          <TextField
            type="number"
            fullWidth
            label="Prix Supplémentaire"
            value={option.prixSupplémentaire}
            onChange={(e) => handleOptionChange(index, 'prixSupplémentaire', e.target.value)}
            style={{ marginBottom: 10 }}
          />
        )}

        <div key={index}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(index, e.target.files[0])}
          />
          {(tempImageUrls[index] || option.imageUrl) && (
            <img
              src={tempImageUrls[index] || option.imageUrl}
              alt={`Prévisualisation ${option.nom}`}
              style={{
                maxWidth: 100,
                display: 'block',
                margin: '10px 0',
                borderRadius: 4
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                console.error("Erreur image:", tempImageUrls[index] || option.imageUrl);
              }}
            />
          )}
        </div>

        <Button 
          variant="outlined" 
          color="error" 
          onClick={() => removeOptionField(index)}
          disabled={options.length === 1}
        >
          Supprimer
        </Button>
      </Box>
    ))}

    <Box mt={2} display="flex" gap={2}>
      <Button
        variant="contained"
        color="secondary"
        onClick={addOptionField}
      >
        Ajouter une option
      </Button>
      
      <Button
        type="submit"
        variant="contained"
        color="primary"
      >
        Enregistrer les modifications
      </Button>
    </Box>
  </form>
</Paper>
  );
};

export default EditStep;