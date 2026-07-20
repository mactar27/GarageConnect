import { Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth';

export const getMonGarage = async (req: AuthRequest, res: Response) => {
  try {
    const garage = await prisma.garage.findUnique({
      where: { responsableId: req.user!.id },
      include: { mecaniciens: true }
    });
    res.json(garage);
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération du garage' });
  }
};

export const creerGarage = async (req: AuthRequest, res: Response) => {
  try {
    const { nom, adresse, telephone } = req.body;
    const responsableId = req.user!.id;
    
    // Vérifier si le responsable a déjà un garage
    const existing = await prisma.garage.findUnique({ where: { responsableId } });
    if (existing) {
       res.status(400).json({ message: 'Vous avez déjà un garage enregistré' });
       return;
    }

    const garage = await prisma.garage.create({
      data: { nom, adresse, telephone, responsableId },
    });
    res.status(201).json(garage);
  } catch (error) {
    res.status(500).json({ message: 'Erreur création du garage' });
  }
};

export const ajouterMecanicien = async (req: AuthRequest, res: Response) => {
  try {
    const { nom, prenom, email, motDePasse, telephone } = req.body;
    const responsableId = req.user!.id;

    const garage = await prisma.garage.findUnique({ where: { responsableId } });
    if (!garage) {
       res.status(404).json({ message: 'Garage non trouvé' });
       return;
    }

    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    const mecanicien = await prisma.utilisateur.create({
      data: {
        nom, prenom, email, telephone,
        motDePasse: hashedPassword,
        role: 'MECANICIEN',
        garageId: garage.id
      },
    });

    res.status(201).json({ message: 'Mécanicien ajouté', mecanicien: { id: mecanicien.id, nom, prenom } });
  } catch (error) {
    res.status(500).json({ message: 'Erreur ajout mécanicien' });
  }
};

export const getDemandesGarage = async (req: AuthRequest, res: Response) => {
  try {
    const garage = await prisma.garage.findUnique({ where: { responsableId: req.user!.id } });
    if (!garage) return res.status(404).json({ message: 'Garage non trouvé' });

    const demandes = await prisma.demandeReparation.findMany({
      where: { garageId: garage.id },
      include: { vehicule: true, client: { select: { nom: true, prenom: true } }, mecanicien: { select: { id: true, nom: true, prenom: true } } }
    });
    res.json(demandes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération des demandes' });
  }
};

export const assignerMecanicien = async (req: AuthRequest, res: Response) => {
  try {
    const { demandeId } = req.params;
    const { mecanicienId } = req.body;
    
    const demande = await prisma.demandeReparation.update({
      where: { id: parseInt(demandeId as string) },
      data: { mecanicienId, statut: 'ACCEPTEE' }
    });
    res.json(demande);
  } catch (error) {
    res.status(500).json({ message: 'Erreur assignation mécanicien' });
  }
};
