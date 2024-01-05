import React from 'react';
import './CategoriesItem.css';
// Assurez-vous que le chemin d'accès est correct

const CategoryItem = ({ category, onSelect }) => {
    return (
        <div className="categoryItem" onClick={() => onSelect(category)}>
            <img src={category.imageUrl} alt={category.nom} className="categoryImage img-fluid" />
            <h3 className="categoryName">{category.nom}</h3>
        </div>
    );
};

export default CategoryItem;
