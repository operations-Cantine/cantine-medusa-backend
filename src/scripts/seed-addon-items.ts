const addonData = {
  sauces_piments: {
    name: "Sauces & Piments", is_required: true, max_selections: 1,
    items: [
      { name: "Pimentée", description: "Sauce pimentée maison, relevée et parfumée", price: 0 },
      { name: "Prestige Dorée", description: "Sauce dorée signature de La Cantine", price: 0 },
      { name: "Blanche", description: "Sauce blanche crémeuse à base de yaourt et herbes", price: 0 },
      { name: "Chili Velouté", description: "Sauce chili onctueuse, piquante et veloutée", price: 0 },
      { name: "Piment fort", description: "Piment fort nature", price: 0 },
      { name: "Piment Très fort", description: "Piment extra-fort", price: 0 },
      { name: "Rouge", description: "Sauce rouge épicée aux tomates et piments", price: 0 },
      { name: "Pas de Piment", description: "Aucune sauce pimentée", price: 0 },
    ],
  },
  riz: {
    name: "Riz", is_required: false, max_selections: 1,
    items: [
      { name: "Riz blanc parfumé", description: "Riz basmati cuit à la vapeur", price: 0 },
      { name: "Riz Blanc aux Légumes", description: "Riz blanc mélangé à des légumes sautés", price: 0 },
      { name: "Riz aux Épices Jaunes", description: "Riz parfumé au curcuma et épices douces", price: 0 },
    ],
  },
  legumes: {
    name: "Légumes", is_required: false, max_selections: 3,
    items: [
      { name: "Oignons caramélisés", description: "Oignons lentement caramélisés au beurre", price: 0 },
      { name: "Oignons Frais", description: "Rondelles d'oignon cru croquantes", price: 0 },
      { name: "Cornichons", description: "Cornichons croquants au vinaigre", price: 0 },
      { name: "Frites", description: "Frites de pommes de terre dorées et croustillantes", price: 500 },
      { name: "Haricots", description: "Haricots rouges cuits, tendres et savoureux", price: 0 },
      { name: "Légumes rôtis", description: "Mélange de légumes grillés au four", price: 0 },
      { name: "Purée de pommes de terre", description: "Purée onctueuse au beurre", price: 0 },
      { name: "Tomate", description: "Tranches de tomate fraîche", price: 0 },
      { name: "Pas de Légumes", description: "Aucun accompagnement de légumes", price: 0 },
    ],
  },
  fromage: {
    name: "Fromage", is_required: false, max_selections: 1,
    items: [
      { name: "Cheddar", description: "Fromage cheddar fondant", price: 300 },
      { name: "Emmental", description: "Fromage emmental doux", price: 300 },
      { name: "Mélange Crémeux", description: "Mélange de trois fromages fondus", price: 500 },
      { name: "Pas de Fromage", description: "Aucun fromage ajouté", price: 0 },
    ],
  },
  viande: {
    name: "Viande", is_required: false, max_selections: 1,
    items: [
      { name: "Poulet", description: "Morceaux de poulet grillé", price: 500 },
      { name: "Bœuf", description: "Viande de bœuf grillée", price: 500 },
      { name: "Poisson", description: "Filet de poisson frais grillé", price: 500 },
      { name: "Mouton", description: "Viande de mouton grillée", price: 700 },
    ],
  },
  epices: {
    name: "Épices", is_required: false, max_selections: 2,
    items: [
      { name: "Sel", description: "Sel fin de table", price: 0 },
      { name: "Poivre", description: "Poivre noir moulu", price: 0 },
      { name: "Mélange d'épices raffinés", description: "Mélange maison d'épices ouest-africaines", price: 0 },
    ],
  },
  dessert_toppings: {
    name: "Dessert Toppings", is_required: false, max_selections: 2,
    items: [
      { name: "Miel naturel chaud", description: "Miel pur chauffé, sirupeux et parfumé", price: 200 },
      { name: "Chocolat Fondant", description: "Sauce au chocolat noir fondu", price: 300 },
      { name: "Lait aromatisé", description: "Lait frais aromatisé à la vanille", price: 200 },
      { name: "Oreo milk", description: "Lait frappé aux biscuits Oreo émiettés", price: 300 },
    ],
  },
}

console.log("Addon seed data ready:")
let totalItems = 0
for (const [slug, cat] of Object.entries(addonData)) {
  console.log(`  ${cat.name} (${slug}): ${cat.items.length} items, required=${cat.is_required}, max=${cat.max_selections}`)
  totalItems += cat.items.length
}
console.log(`Total: ${Object.keys(addonData).length} categories, ${totalItems} items`)

export { addonData }
