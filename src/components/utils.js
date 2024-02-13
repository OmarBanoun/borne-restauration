// utils.js
export const calculateTotal = (items) => {
    let total = items.reduce((total, item) => {
        // Calcul de base pour l'item et l'option menu
        let itemTotal = item.prix + (item.option === 'menu' ? 2 : 0);

        // Ajout du prix des suppléments, si disponibles
        if (item.supplements && item.supplements.length > 0) {
            const supplementsTotal = item.supplements.reduce((supplementsTotal, supplement) => supplementsTotal + supplement.prix, 0);
            itemTotal += supplementsTotal;
        }

        return total + itemTotal;
    }, 0);

    return total.toFixed(2).replace('.', ',');
};


