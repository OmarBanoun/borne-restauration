import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { List, ListItem, MenuItem, Box, ListItemText, Select, TableBody, TableCell, TableHead, TableRow, Paper, AppBar, Toolbar, Typography, Button, Switch } from '@mui/material'

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const navigate = useNavigate()

  const handleCreateButtonClick = () => {
    navigate('/admin/create-article') // Mettez à jour le chemin selon votre configuration de route
  }

  useEffect(() => {
    axios.get('https://maro.alwaysdata.net/api/articles')
      .then(response => {
        const articleCategories = response.data.map(article => article.categorie)
        const uniqueCategories = [...new Set(articleCategories.map(cat => cat ? cat.nom : '').filter(catNom => catNom !== ''))]
        setCategories(uniqueCategories)
        setArticles(response.data)
      })
      .catch(error => console.log(error))
  }, [])

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value)
  }

  const handleSuggestionChange = (articleId, isChecked) => {
    axios.put(`https://maro.alwaysdata.net/api/articles/${articleId}`, { isSuggestion: isChecked })
      .then(response => {
        // Mise à jour de l'état local
        setArticles(articles.map(article => {
          if (article._id === articleId) {
            return { ...article, isSuggestion: isChecked };
          }
          return article;
        }));
      })
      .catch(error => {
        // Affichage d'une erreur ou d'un message
        console.error("Erreur lors de la mise à jour de l'article", error);
      });
  };

  return (
    <Paper style={{ margin: 20, padding: 20 }}>
      <Typography variant="h5" style={{ marginBottom: 20 }}>Liste des Articles</Typography>
      <Button variant="contained" color="primary" onClick={handleCreateButtonClick}>
        Créer un article
      </Button>
      <Select
        value={selectedCategory}
        onChange={handleCategoryChange}
        style={{ marginTop: 20, width: 200, marginLeft: 30 ,height: 40 }}
        displayEmpty
        renderValue={selected => {
          if (selected === "") {
            return "Toutes les catégories";
          }
          return selected;
        }}
      >
        {/* <MenuItem value="">Toutes les catégories</MenuItem> */}
        <MenuItem value="">Toutes les catégories</MenuItem>
        {categories.map((category, index) => (
          <MenuItem key={index} value={category}>{category}</MenuItem>
        ))}
      </Select>
      <List>
        {articles
          .filter(article => selectedCategory === "" || (article.categorie && article.categorie.nom === selectedCategory))
          .map((article, index) => (
            <ListItem key={index} alignItems="center">
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
              <ListItemText className='col-3' primary={`Prix : ${article.prix} €`} />
              <ListItemText className='col-3' primary={`Categorie : ${article.categorie ? article.categorie.nom : 'Catégorie non spécifiée'}`} />
              Suggestion:
              <Switch
                checked={article.isSuggestion}
                onChange={(e) => handleSuggestionChange(article._id, e.target.checked)}
              />
              {/* bouton pour supression */}
              <Button variant="contained" color="error" style={{ marginRight: 10 }} onClick={() => {
                if(window.confirm('Voulez-vous supprimer cet article ?')){
                  axios.delete(`https://maro.alwaysdata.net/api/articles/${article._id}`).then(() => {
                    window.location.reload();
                  })
                }
              }}>Supprimer</Button>
              {/* bouton pour modification */}
              <Button variant="contained" color="primary" onClick={() => navigate(`/admin/edit-article/${article._id}`)}>
                Modifier
              </Button>
            </ListItem>
          ))}
      </List>
    </Paper>
  )
}

export default ArticlesPage