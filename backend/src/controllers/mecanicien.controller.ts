import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth';

export const getDemandesAssignees = async (req: AuthRequest, res: Response) => {
  try {
    const demandes = await prisma.demandeReparation.findMany({
      where: { mecanicienId: req.user!.id },
      include: { vehicule: true, client: { select: { nom: true, prenom: true } } },
    });
    res.json(demandes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération des demandes' });
  }
};

export const etablirDevis = async (req: AuthRequest, res: Response) => {
  try {
    const { demandeId, montantTotal, detailPieces } = req.body;
    const devis = await prisma.devis.create({
      data: { demandeId, montantTotal, detailPieces },
    });
    await prisma.demandeReparation.update({
      where: { id: demandeId },
      data: { statut: 'DEVIS_ENVOYE' },
    });
    res.status(201).json(devis);
  } catch (error) {
    res.status(500).json({ message: 'Erreur création du devis' });
  }
};

export const updateStatutDemande = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;
    const demande = await prisma.demandeReparation.update({
      where: { id: parseInt(id) },
      data: { statut },
    });
    res.json(demande);
  } catch (error) {
    res.status(500).json({ message: 'Erreur mise à jour statut' });
  }
};

export const soumettreRapport = async (req: AuthRequest, res: Response) => {
  try {
    const { demandeId, contenu } = req.body;
    const rapport = await prisma.rapport.create({
      data: { demandeId, contenu },
    });
    await prisma.demandeReparation.update({
      where: { id: demandeId },
      data: { statut: 'TERMINEE' },
    });
    res.status(201).json(rapport);
  } catch (error) {
    res.status(500).json({ message: 'Erreur création du rapport' });
  }
};

export const getMonProfil = async (req: AuthRequest, res: Response) => {
  try {
    const mecanicien = await prisma.utilisateur.findUnique({
      where: { id: req.user!.id },
      select: { id: true, nom: true, prenom: true, email: true, estDisponible: true }
    });
    res.json(mecanicien);
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération du profil' });
  }
};

export const toggleDisponibilite = async (req: AuthRequest, res: Response) => {
  try {
    const { estDisponible } = req.body;
    const mecanicien = await prisma.utilisateur.update({
      where: { id: req.user!.id },
      data: { estDisponible },
      select: { id: true, estDisponible: true }
    });
    res.json({ message: 'Disponibilité mise à jour', mecanicien });
  } catch (error) {
    res.status(500).json({ message: 'Erreur mise à jour disponibilité' });
  }
};
