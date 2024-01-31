import React, { useState } from 'react';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, CssBaseline, Button, Collapse } from '@mui/material';
// import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/MenuBook';
import ArticleIcon from '@mui/icons-material/LunchDining';
import BrushIcon from '@mui/icons-material/Brush';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useAuth } from './AuthContext';
import CategoriesPage from './Categories/CategoriesPage';
import ArticlesPage from './Articles/ArticlesPage';
import SecondaryArticlesPage from './SecondaryArticle/SecondaryArticlePage';
import CustomPage from './Custom/CustomPage';

const drawerWidth = 240;

const AdminDashboard = () => {
    const location = useLocation();
    const getTitle = () => {
        switch (location.pathname) {
            case '/admin/categories':
                return 'Gestion des Catégories';
            case '/admin/articles':
                return 'Gestion des Articles';
            case '/admin/viandes':
                return 'Gestion des viandes';
            case '/admin/sauces':
                return 'Gestion des sauces';
            case '/admin/boissons':
                return 'Gestion des boissons';
            case '/admin/pains':
                return 'Gestion des pains';
            case '/admin/garnitures':
                return 'Gestion des garnitures';
            default:
                return 'Dashboard d\'Administration';
        }
    };
    const { logout } = useAuth();

    const handleLogout = () => {
    logout(); // Cela va effacer l'utilisateur de l'état et du localStorage
    // Redirigez l'utilisateur vers la page de connexion ou la page d'accueil
    window.location.href = '/login';
    };

    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <>
        <CssBaseline />
        <AppBar position="fixed">
            <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" noWrap style={{ marginLeft: drawerWidth }}>
                {getTitle()}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
                Deconnexion
            </Button>
            </Toolbar>
        </AppBar>
        <Drawer variant="permanent" style={{ width: drawerWidth }}>
            <Toolbar />
            <List>
            {/* Liste des liens ici */}
            <ListItemButton component={Link} to="/admin/categories">
                <ListItemIcon><CategoryIcon /></ListItemIcon>
                <ListItemText primary="Catégories" />
            </ListItemButton>
            <ListItemButton component={Link} to="/admin/articles">
                <ListItemIcon><ArticleIcon /></ListItemIcon>
                <ListItemText primary="Articles" />
            </ListItemButton>
            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                    <ArticleIcon />
                </ListItemIcon>
                <ListItemText primary="Articles Secondaires" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }} component={Link} to="/admin/viandes">
                        <ListItemText primary="Viandes" />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 4 }} component={Link} to="/admin/sauces">
                        <ListItemText primary="Sauces" />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 4 }} component={Link} to="/admin/pains">
                        <ListItemText primary="Pains" />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 4 }} component={Link} to="/admin/garnitures">
                        <ListItemText primary="Garnitures" />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 4 }} component={Link} to="/admin/boissons">
                        <ListItemText primary="Boissons" />
                    </ListItemButton>
                    {/* Ajoutez d'autres options ici si nécessaire */}
                </List>
            </Collapse>
            <hr />
            <ListItemButton component={Link} to="/admin/custom">
                <ListItemIcon>
                    <BrushIcon />
                </ListItemIcon>
                <ListItemText primary="Personnalisation" />
            </ListItemButton>
            </List>
        </Drawer>
        <main style={{ marginLeft: drawerWidth, padding: 3 }}>
            <Toolbar />
            <Routes>
            <Route index element={<CategoriesPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="articles" element={<ArticlesPage />} />
            <Route path='viandes' element={<SecondaryArticlesPage type="viandes" />} />
            <Route path='sauces' element={<SecondaryArticlesPage type="sauces" />} />
            <Route path='boissons' element={<SecondaryArticlesPage type="boissons" />} />
            <Route path='pains' element={<SecondaryArticlesPage type="pains" />} />
            <Route path='garnitures' element={<SecondaryArticlesPage type="garnitures" />} />
            <Route path='custom' element={<CustomPage />} />
            {/* Autres routes ici */}
            </Routes>
        </main>
        </>
    );
};

export default AdminDashboard;