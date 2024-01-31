import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Paper, Typography, List, ListItem, ListItemText, Box } from '@mui/material';

const SecondaryArticlesPage = ({ type }) => {
    const [articles, setArticles] = useState([]);

    const handleCreateButtonClick = () => {
        navigate('/admin/create-secondary-article/' + type) // Mettez à jour le chemin selon votre configuration de route
    }

    const navigate = useNavigate();

    useEffect(() => {
        // Remplacez 'URL_API' par l'URL de votre API pour récupérer les articles secondaires
        axios.get(`https://maro.alwaysdata.net/api/secondary-articles/${type}`)
            .then(response => {
                setArticles(response.data);
            })
            .catch(error => console.log(error));
    }, [type]);

    return (
        <Paper style={{ margin: 20, padding: 20 }}>
        <Typography variant="h5" style={{ marginBottom: 20 }}>Liste des {type}</Typography>
        <Button variant="contained" color="primary" onClick={handleCreateButtonClick}>
          Créer un article
        </Button>
        <List>
          {articles.map((article) => (
              <ListItem key={article._id} alignItems="center">
                {article.imageUrl && (
                  <Box
                    component="img"
                    sx={{
                      height: 60,
                      width: 60,
                      marginRight: 2,
                    }}
                    src={`https://maro.alwaysdata.net/${article.imageUrl}`}
                    alt={article.nom}
                    style={{ width: 100 }}
                  />
                )}
                <ListItemText className='col-3' primary={`Nom : ${article.nom}`} />
                {/* bouton pour supression */}
                <Button variant="contained" color="error" style={{ marginRight: 10 }} onClick={() => {
                  if(window.confirm('Voulez-vous supprimer cet article ?')){
                    // Remplacez 'URL_API' par l'URL de votre API pour supprimer l'article
                    axios.delete(`https://maro.alwaysdata.net/api/secondary-articles/${type}/${article._id}`)
                    window.location.reload();
                  }
                }}>Supprimer</Button>
                {/* bouton pour modification */}
                <Button variant="contained" color="primary" onClick={() => navigate(`/admin/edit-secondary-article/${type}/${article._id}`)}>
                  Modifier
                </Button>
              </ListItem>
            ))}
        </List>
      </Paper>

        // <Paper style={{ margin: 20, padding: 20 }}>
        //     <h2>Articles Secondaires: {type}</h2>
        //     <Button variant="contained" color="primary" onClick={handleCreateButtonClick}>
        //         Créer un article
        //     </Button>
        //     <ul>
        //         {articles.map(article => (
        //             <li key={article._id}>
        //                 {article.nom} - {article.type}
        //                 {/* Affichez d'autres détails de l'article ici */}
        //             </li>
        //         ))}
        //     </ul>
        // </Paper>
    );
};

export default SecondaryArticlesPage;
