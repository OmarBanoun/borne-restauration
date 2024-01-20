import React, { useState } from 'react';
import Menu from './Menu/Menu';
import MenuItem from './Menu/MenuItem/MenuItem';
import articles from './Menu/Menu'; // Importer les données depuis Menu.js

const Order = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const handleAddItem = (item) => {
        setSelectedItems([...selectedItems, item]);
    };

    return (
        <div>
            {!selectedCategory && <Menu onCategorySelect={handleCategorySelect} />}
            {selectedCategory && articles[selectedCategory.nom].map(item => (
                <MenuItem key={item.id} plat={item} onAdd={handleAddItem} />
            ))}
        </div>
    );
};

export default Order;
