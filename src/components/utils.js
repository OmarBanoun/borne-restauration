// utils.js
export const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.prix + (item.option === 'menu' ? 2 : 0), 0);
};
