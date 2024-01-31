// Edit secondary article page
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Button, TextField, Paper, Box } from '@mui/material';

const EditSecondaryArticle = () => {
    const { type, id } = useParams(); // Assurez-vous d'extraire `type` et `id` correctement
    const [article, setArticle] = useState({ nom: '', imageUrl: '' });
    const [image, setImage] = useState(null);
    const [tempImageUrl, setTempImageUrl] = useState(null);
    const Navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3001/api/secondary-articles/${type}/${id}`)
            .then(response => {
                setArticle(response.data);
                setTempImageUrl(`http://localhost:3001/${response.data.imageUrl}`);
            })
            .catch(error => console.log(error));
    }, [type, id]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setTempImageUrl(URL.createObjectURL(file));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('nom', article.nom);
        if (image) {
            formData.append('imageUrl', image);
        }

        try {
            await axios.put(`http://localhost:3001/api/secondary-articles/${type}/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Navigate('/admin/' + type);
        } catch (error) {
            console.error('Error:', error);
        }
    }

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
          <Typography variant="h6" textAlign={'center'} marginBottom={3}>Modification {type}</Typography>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={3} className="col-6" marginLeft={'auto'} marginRight={'auto'}>
            <TextField
              label="Nom"
              fullWidth
              value={article.nom}
              onChange={(e) => setArticle({ ...article, nom: e.target.value })}
            />
            {article.imageUrl && <img width={200} src={tempImageUrl} alt={article.nom} />}
            <input
                type="file"
                onChange={handleFileChange}
            />
            <Button type="submit" variant="contained" color="primary">Enregistrer</Button>
            </Box>
          </form>
        </Paper>
        </div>
    )
}

export default EditSecondaryArticle