import React from 'react';
import './MenuItem.css'; // Assurez-vous que le chemin d'accès est correct

const MenuItem = ({ item, onSelect }) => {
    return (
        <div className="menuItem" onClick={() => onSelect(item)}>
            <img src={`https://maro.alwaysdata.net/${item.imageUrl}`} alt={item.nom} className="categoryImage itemImage select-item img-fluid" />
            <h3 className="itemName">{item.nom}</h3>
            <p className="itemPrice orange">{item.prix.toFixed(2).replace('.', ',')}€</p>
        </div>
    );
};

export default MenuItem;
