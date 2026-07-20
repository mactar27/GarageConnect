import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth';

export const getStatistiques = async (req: AuthRequest, res: Response) => {
  try {
    const totalUtilisateurs = await prisma.utilisateur.count();
    const totalGarages = await prisma.garage.count();
    const totalDemandes = await prisma.demandeReparation.count();
    res.json({ totalUtilisateurs, totalGarages, totalDemandes });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
};

export const getGarages = async (req: AuthRequest, res: Response) => {
  try {
    const garages = await prisma.garage.findMany({
      include: { responsable: { select: { nom: true, prenom: true } } },
    });
    res.json(garages);
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération des garages' });
  }
};

export const validerGarage = async (req: AuthRequest, res: Response) => {
  try {
    const { garageId } = req.params;
    const garage = await prisma.garage.update({
      where: { id: parseInt(garageId) },
      data: { estValide: true },
    });
    res.json({ message: 'Garage validé avec succès', garage });
  } catch (error) {
    res.status(500).json({ message: 'Erreur validation du garage' });
  }
};

export const suspendreGarage = async (req: AuthRequest, res: Response) => {
  try {
    const { garageId } = req.params;
    const garage = await prisma.garage.update({
      where: { id: parseInt(garageId) },
      data: { estValide: false },
    });
    res.json({ message: 'Garage suspendu avec succès', garage });
  } catch (error) {
    res.status(500).json({ message: 'Erreur suspension du garage' });
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.utilisateur.findMany({
      select: { id: true, nom: true, prenom: true, email: true, role: true, createdAt: true },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération des utilisateurs' });
  }
};
