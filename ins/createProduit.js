require("dotenv").config();
const mongoose = require("mongoose");

const Product = require("../src/model/Product");
const ProductDetail = require("../src/model/ProductDetail");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté"))
  .catch(err => {
    console.error("Erreur connexion MongoDB :", err);
    process.exit(1);
  });

// Tous les produits
const productsData = [
  {
    "idtemp": 1,
    "name": "MacBook Pro M3 Ultra",
    "category": "Électronique",
    "price": 2999000,
    "originalPrice": 3499000,
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600",
    "rating": 5,
    "reviews": 128
  },
  {
    "idtemp": 2,
    "name": "Sneakers Air Max Premium",
    "category": "Mode",
    "price": 189000,
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600",
    "rating": 4,
    "reviews": 89
  },
  {
    "idtemp": 3,
    "name": "Canapé Design Scandinave",
    "category": "Maison",
    "price": 899000,
    "image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600",
    "rating": 5,
    "reviews": 42
  },
  {
    "idtemp": 4,
    "name": "Montre Connectée Elite",
    "category": "Électronique",
    "price": 459000,
    "originalPrice": 599000,
    "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600",
    "rating": 4,
    "reviews": 215
  },
  {
    "idtemp": 5,
    "name": "Casque Audio Studio Pro",
    "category": "Électronique",
    "price": 349000,
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
    "rating": 5,
    "reviews": 312
  },
  {
    "idtemp": 6,
    "name": "Sac à Main Cuir Milano",
    "category": "Mode",
    "price": 275000,
    "originalPrice": 350000,
    "image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600",
    "rating": 4,
    "reviews": 67
  },
  {
    "idtemp": 7,
    "name": "Lampe Design Articulée",
    "category": "Maison",
    "price": 145000,
    "image": "https://www.lheritierdutemps.com/71253/lampe-de-table-articulee-jona-noir-woody-luminaire-design-en-acier-.jpg",
    "rating": 3,
    "reviews": 29
  },
  {
    "idtemp": 8,
    "name": "Ballon de Football Pro",
    "category": "Sport",
    "price": 55000,
    "image": "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?auto=format&fit=crop&q=80&w=600",
    "rating": 4,
    "reviews": 156
  },
  {
    "idtemp": 9,
    "name": "Sérum Visage Premium",
    "category": "Beauté",
    "price": 89000,
    "originalPrice": 120000,
    "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600",
    "rating": 5,
    "reviews": 203
  },
  {
    "idtemp": 10,
    "name": "Clavier Mécanique RGB",
    "category": "Électronique",
    "price": 199000,
    "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600",
    "rating": 4,
    "reviews": 178
  },
  {
    "idtemp": 11,
    "name": "Tapis de Yoga Premium",
    "category": "Sport",
    "price": 65000,
    "image": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=600",
    "rating": 4,
    "reviews": 94
  },
  {
    "idtemp": 12,
    "name": "Parfum Élégance Noire",
    "category": "Beauté",
    "price": 135000,
    "image": "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600",
    "rating": 5,
    "reviews": 187
  }
];

// Détails liés
const productsDetailsData = [
  {
    "productId": 1,
    "description": "Le nouveau MacBook Pro M3 Ultra repousse les limites de la performance...",
    "stock": 15,
    "images": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?auto=format&fit=crop&q=80&w=1200"
    ],
    "variants": [
      { "type": "Taille", "options": ["14\"", "16\""] },
      { "type": "Stockage", "options": ["512 Go", "1 To", "2 To"] },
      { "type": "RAM", "options": ["16 Go", "32 Go", "64 Go"] }
    ],
    "specifications": [
      { "key": "Puce", "value": "Apple M3 Ultra" },
      { "key": "GPU", "value": "40 coeurs" },
      { "key": "Autonomie", "value": "Jusqu'à 22 heures" }
    ],
    "detailedReviews": [
      { "userName": "Marc L.", "rating": 5, "comment": "Une bête de course ! L'écran est magnifique...", "createdAt": "2024-02-10" },
      { "userName": "Sophie D.", "rating": 4, "comment": "Très satisfait, même si le prix reste élevé...", "createdAt": "2024-02-05" }
    ]
  },
  {
    "productId": 2,
    "description": "Les Sneakers Air Max Premium allient confort légendaire et style urbain moderne...",
    "stock": 42,
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1200"
    ],
    "variants": [
      { "type": "Pointure", "options": ["40","41","42","43","44"] },
      { "type": "Couleur", "options": ["Rouge/Noir","Blanc/Bleu","Gris"] }
    ],
    "specifications": [
      { "key": "Matériau", "value": "Cuir synthétique et Mesh" },
      { "key": "Semelle", "value": "Caoutchouc avec bulle d'air" },
      { "key": "Style", "value": "Sportswear" }
    ],
    "detailedReviews": [
      { "userName": "Jean P.", "rating": 5, "comment": "Confort absolu.", "createdAt": "2024-01-20" }
    ]
  },
  {
    "productId": 3,
    "description": "Ce canapé au design scandinave épuré apportera une touche d'élégance et de chaleur...",
    "stock": 8,
    "images": [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1550226129-3990610ac14d?auto=format&fit=crop&q=80&w=1200"
    ],
    "variants": [
      { "type": "Couleur", "options": ["Gris Anthracite","Bleu Nordique","Beige"] },
      { "type": "Taille", "options": ["3 places","4 places"] }
    ],
    "specifications": [
      { "key": "Dimensions", "value": "220 x 95 x 85 cm" },
      { "key": "Revêtement", "value": "Tissu déperlant" },
      { "key": "Pieds", "value": "Chêne massif" }
    ],
    "detailedReviews": [
      { "userName": "Alice M.", "rating": 5, "comment": "Superbe canapé ! La couleur est exactement comme sur les photos...", "createdAt": "2024-02-01" }
    ]
  }
];

const init = async () => {
  try {
    await Product.deleteMany({});
    await ProductDetail.deleteMany({});

    const productMap = {};
    // Créer les produits
    for (const p of productsData) {
      const product = await Product.create(p);
      productMap[p.idtemp] = product;
      console.log("Produit créé :", p.name);
    }

    // Créer les détails et lier au produit via _id
    for (const d of productsDetailsData) {
      const product = productMap[d.productId];
      if (!product) continue;
      await ProductDetail.create({ ...d, product: product._id });
      console.log("Détail créé pour :", product.name);
    }

    console.log("Initialisation terminée ✅");
    process.exit(0);

  } catch (err) {
    console.error("Erreur :", err.message);
    process.exit(1);
  }
};

init();