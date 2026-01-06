const Commande = require("../Models/commande");
const jwt = require('jsonwebtoken');

exports.addOrder = async (req, res, next) => {
  const data = req.body;

  // Vérification des produits
  if (!data.produits || !Array.isArray(data.produits) || data.produits.length === 0) {
    return res.status(400).json({ message: "Aucun produit fourni pour la commande" });
  }

  // Vérification utilisateur
  if (!data.user || !Array.isArray(data.user) || data.user.length === 0) {
    return res.status(400).json({ message: "Informations utilisateur manquantes" });
  }

  const u = data.user[0];
  if (!u.UserId || !u.Email || !u.Full_Name || !u.Phone_Number || !u.Adress) {
    return res.status(400).json({ message: "Données utilisateur incomplètes" });
  }

  // Vérification mode de livraison
  if (!data.modeLivraison || !["magasin", "domicile"].includes(data.modeLivraison)) {
    return res.status(400).json({ message: "Mode de livraison invalide" });
  }

  if (data.modeLivraison === "magasin" && !data.nomMagasin) {
    return res.status(400).json({ message: "Nom du magasin requis pour retrait en magasin" });
  }

  if (data.modeLivraison === "domicile") {
    const adr = data.adresseLivraison;
    if (!adr || !adr.adresse || !adr.ville || !adr.codePostale || !adr.telephone || !adr.email) {
      return res.status(400).json({ message: "Adresse de livraison incomplète" });
    }
  }

  // Vérification du paiement
  if (!data.payment || !["carte", "espece"].includes(data.payment.type)) {
    return res.status(400).json({ message: "Type de paiement invalide ou manquant" });
  }

  // Création de la commande
  const newOrder = new Commande({
    user: data.user,
    produits: data.produits,
    modeLivraison: data.modeLivraison,
    nomMagasin: data.modeLivraison === "magasin" ? data.nomMagasin : undefined,
    adresseLivraison: data.modeLivraison === "domicile" ? data.adresseLivraison : undefined,
    payment: { type: data.payment.type },
    DateCreation: new Date()
  });

  try {
    await newOrder.save();
    res.status(201).json({
      message: "Commande enregistrée avec succès",
      order: newOrder,
    });
  } catch (error) {
    console.error("Erreur lors de la création de la commande :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};



exports.getOrderWithDetails = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Commande.find({ "user.UserId": userId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "Aucune commande trouvée" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Erreur :", error);
    res.status(500).json({
      message: "Erreur lors de la récupération de la commande",
      error: error.message || error,
    });
  }
};


exports.getAllOrder = async (req, res) => {
  try {
    const commandes = await Commande.find();
    res.status(200).json(commandes);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération des commandes",
      error: err.message
    });
  }
};

exports.supprimerCommande = async (req, res) => {
  const { userId } = req.params;
  try {
    const deletedCommande = await Commande.findByIdAndDelete(userId);
    if (!deletedCommande) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }
    res.json({ message: "Commande supprimée avec succès", commande: deletedCommande });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.updateOrderStatusById = async (req, res) => {
  const { id } = req.params;
  const { etatCommande } = req.body;

  // Vérifie que le statut est valide
  const validStatuses = ["en_attente", "Accepté", "Refusé"];
  if (!validStatuses.includes(etatCommande)) {
    return res.status(400).json({ message: "Statut invalide" });
  }

  try {
    const updatedCommande = await Commande.findByIdAndUpdate(
      id,
      { etatCommande: etatCommande },
      { new: true } // retourne la commande mise à jour
    );

    if (!updatedCommande) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    res.status(200).json({
      message: "Statut de la commande mis à jour avec succès",
      order: updatedCommande
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

