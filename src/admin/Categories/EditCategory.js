// edit category page
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Button, TextField, Paper, Box } from '@mui/material';

const EditCategory = () => {
  const [category, setCategory] = useState({ nom: '', imageUrl: '' });
  const [image, setImage] = useState(null); // Pour gérer la nouvelle image
  const [tempImageUrl, setTempImageUrl] = useState(null);
  const { id } = useParams();
  const Navigate = useNavigate();

  useEffect(() => {
    console.log('id:', id);
    axios.get(`https://maro.alwaysdata.net/api/categories/${id}`)
      .then(response => {
        console.log('response.data:', response.data);
        setCategory(response.data); // Ajustez selon la structure de votre réponse
        setTempImageUrl(`https://maro.alwaysdata.net/${response.data.imageUrl}`);
      })
      .catch(error => console.log(error));
  }, [id]);
  console.log('Current article state:', category);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setTempImageUrl(URL.createObjectURL(file)); // Créer une URL temporaire pour le fichier sélectionné
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nom', category.nom);
    if (image) {
      formData.append('image', image);
    }
  
    // Pour le débogage, affichez le contenu de FormData
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
  
    // Envoyez formData à votre API pour mettre à jour l'article
    try {
      const response = await axios.put(`https://maro.alwaysdata.net/api/categories/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Réponse de mise à jour:', response.data);
      Navigate('/admin/categories');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      // Gérer ici l'erreur de mise à jour
    }
  };

  useEffect(() => {
    return () => {
      if (tempImageUrl) {
        URL.revokeObjectURL(tempImageUrl); // Libérer l'URL de blob
      }
    };
  }, [tempImageUrl]);
  

  return (
    <div>
    <Paper style={{ padding: 20 }}>
      <Button variant="contained" color="primary" onClick={() => window.history.back()}>Retour</Button>
      <Typography variant="h6" textAlign={'center'}>Modification de la categorie</Typography>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={3} className="col-6" marginLeft={'auto'} marginRight={'auto'}>
        <TextField
          label="Nom"
          fullWidth
          value={category.nom}
          onChange={(e) => setCategory({ ...category, nom: e.target.value })}
        />
        {category.imageUrl && <img width={200} src={tempImageUrl} alt={category.nom} />}
        <input
            type="file"
            onChange={handleFileChange}
        />
        <Button type="submit" variant="contained" color="primary">Enregistrer</Button>
        </Box>
      </form>
    </Paper>
    </div>
  );
};

export default EditCategory;
