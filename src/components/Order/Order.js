import React, { useState } from 'react';
import Menu from './Menu/Menu';
import MenuItem from './Menu/MenuItem/MenuItem';

const Order = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);

    // Supposons que vous ayez une liste de plats pour chaque catégorie.
    const plats = {
        'Sandwich': [/* ... */],
        'Burgers': [/* ... */],
        'Pizza': [/* ... */],
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const handleAddItem = (item) => {
        setSelectedItems([...selectedItems, item]);
    };

    return (
        <div>
            {!selectedCategory && <Menu onCategorySelect={handleCategorySelect} />}
            {selectedCategory && plats[selectedCategory.nom].map(item => (
                <MenuItem key={item.id} plat={item} onAdd={handleAddItem} />
            ))}
        </div>
    );
};

export default Order;
