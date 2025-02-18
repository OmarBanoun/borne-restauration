export const calculateItemPrice = (item) => {
    let itemTotal = Number(item.prix || 0); // Assurez-vous que le prix de base est initialisé
    console.log("Prix de base:", itemTotal);

    if (item.type === 'menu') {
        itemTotal += 2;
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
    const total = items.reduce((sum, item) => sum + item.prix, 0);
    return total.toFixed(2).replace('.', ',');
};