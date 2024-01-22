// utils.js
export const calculateTotal = (items) => {
    let total = items.reduce((total, item) => total + item.prix + (item.option === 'menu' ? 2 : 0), 0);
    return total.toFixed(2).replace('.', ',');
};


