const mongoose = require("mongoose");
const { Schema } = mongoose;

// Sous-schéma pour livraison à domicile
const adresseLivraisonSchema = new Schema({
  adresse: { type: String, required: true },
  ville: { type: String, required: true },
  codePostale: { type: String, required: true },
  telephone: { type: String, required: true },
  email: { type: String, required: true }
}, { _id: false });

// Sous-schéma de paiement
const paymentSchema = new Schema({
  type: {
    type: String,
    enum: ["carte", "espece"],
    required: true
  },
}, { _id: false });

// Schéma principal de commande
const commandeSchema = new Schema({
  user: [
    {
      UserId: { type: String, required: true },
      Email: { type: String, required: true },
      Full_Name: { type: String, required: true },
      Phone_Number: { type: String, required: true },
      Adress: { type: String, required: true }
    }
  ],
  produits: [
    {
      ProductId: { type: String, required: true },
      Nom: { type: String, required: true },
      description: { type: String, required: true },
      category: { type: String, required: true },
      prix: { type: Number, required: true },
      quantite: { type: Number, required: true, default: 1 },
    },
  ],
  prixTotal: {
    type: Number,
    required: true,
    default: 0,
  },
  modeLivraison: {
    type: String,
    enum: ["magasin", "domicile"],
    required: true
  },
  nomMagasin: {
    type: String,
    required: function () {
      return this.modeLivraison === "magasin";
    }
  },
  adresseLivraison: {
    type: adresseLivraisonSchema,
    required: function () {
      return this.modeLivraison === "domicile";
    }
  },
  payment: {
    type: paymentSchema,
    required: true
  },

  // ✅ Champ ajouté : état de la commande
  etatCommande: {
    type: String,
    enum: ["en_attente", "Accepté", "Refusé"],
    default: "en_attente"
  },

  DateCreation: {
    type: Date,
    default: Date.now,
  },
});

// Hook pour calculer automatiquement le prix total
commandeSchema.pre("save", function (next) {
  this.prixTotal = this.produits.reduce((total, produit) => {
    return total + produit.prix * produit.quantite;
  }, 0);
  next();
});

const Commande = mongoose.model("Commande", commandeSchema);
module.exports = Commande;
