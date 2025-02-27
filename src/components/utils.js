export const calculateItemPrice = (item) => {
    let itemTotal = Number(item.prixDeBase || item.prix || 0); // Utilise le prix de base
    console.log("Prix de base:", itemTotal);

    if (item.type === 'menu') {
        itemTotal += 2;
        console.log("Ajout de 2€ pour le type menu");
    }

    if (item.options) {
        Object.entries(item.options).forEach(([category, options]) => {
            // Vérifier si options est un tableau non vide
            if (Array.isArray(options) && options.length > 0) {
                console.log(`Calcul pour la catégorie ${category}:`, options);
                options.forEach(option => {
                    if (option.prixSupplémentaire) {
                        itemTotal += Number(option.prixSupplémentaire);
                        console.log(`Ajout supplément ${option.nom}: +${option.prixSupplémentaire}€`);
                    }
                });
            }
        });
    }
    console.log("Prix final calculé:", itemTotal);
    return itemTotal;
};


export const calculateTotal = (items) => {
    if (!items || !Array.isArray(items)) {
        return "0,00";
    }

    // Calculer le total de tous les éléments en utilisant calculateItemPrice
    const total = items.reduce((sum, item) => sum + calculateItemPrice(item), 0);

    return total.toFixed(2).replace('.', ',');
};