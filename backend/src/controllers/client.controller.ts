import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth';

// --- Vehicules ---
export const addVehicule = async (req: AuthRequest, res: Response) => {
  try {
    const { immatriculation, marque, modele, annee } = req.body;
    const clientId = req.user!.id;
    const vehicule = await prisma.vehicule.create({
      data: { immatriculation, marque, modele, annee, clientId },
    });
    res.status(201).json(vehicule);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout du véhicule' });
  }
};

export const getVehicules = async (req: AuthRequest, res: Response) => {
  try {
    const vehicules = await prisma.vehicule.findMany({ where: { clientId: req.user!.id } });
    res.json(vehicules);
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération des véhicules' });
  }
};

// --- Demandes de Réparation ---
export const createDemande = async (req: AuthRequest, res: Response) => {
  try {
    const { vehiculeId, descriptionProbleme, garageId } = req.body;
    const demande = await prisma.demandeReparation.create({
      data: {
        descriptionProbleme,
        vehiculeId,
        garageId,
        clientId: req.user!.id,
      },
    });
    res.status(201).json(demande);
  } catch (error) {
    res.status(500).json({ message: 'Erreur création de la demande' });
  }
};

export const getDemandes = async (req: AuthRequest, res: Response) => {
  try {
    const demandes = await prisma.demandeReparation.findMany({
      where: { clientId: req.user!.id },
      include: { vehicule: true, devis: true, facture: true, garage: true },
    });
    res.json(demandes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération des demandes' });
  }
};

export const validerDevis = async (req: AuthRequest, res: Response) => {
  try {
    const { devisId } = req.params;
    const devis = await prisma.devis.update({
      where: { id: parseInt(devisId) },
      data: { estValide: true },
    });
    await prisma.demandeReparation.update({
      where: { id: devis.demandeId },
      data: { statut: 'DEVIS_VALIDE' },
    });
    res.json({ message: 'Devis validé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur validation devis' });
  }
};

export const payerFacture = async (req: AuthRequest, res: Response) => {
  try {
    const { demandeId } = req.params;
    
    // Simuler le paiement
    const facture = await prisma.facture.create({
      data: {
        demandeId: parseInt(demandeId),
        montant: req.body.montant || 0, // Devrait venir du devis dans un cas réel
        methodePaiement: 'CARTE_BANCAIRE'
      }
    });

    await prisma.demandeReparation.update({
      where: { id: parseInt(demandeId) },
      data: { statut: 'PAYEE' },
    });

    res.json({ message: 'Paiement effectué avec succès', facture });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du paiement' });
  }
};

export const laisserAvis = async (req: AuthRequest, res: Response) => {
  try {
    const { mecanicienId, note, commentaire } = req.body;
    const clientId = req.user!.id;

    const avis = await prisma.avis.create({
      data: { note, commentaire, clientId, mecanicienId },
    });

    // Mettre à jour les points de réputation du mécanicien (ex: 1 étoile = 1 point)
    await prisma.utilisateur.update({
      where: { id: mecanicienId },
      data: { pointsReputation: { increment: note } }
    });

    res.status(201).json({ message: 'Avis enregistré', avis });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'avis' });
  }
};
