import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    const notifications = await prisma.notification.findMany({
      where: { utilisateurId: userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    const notif = await prisma.notification.findUnique({ where: { id: Number(id) } });
    if (!notif || notif.utilisateurId !== userId) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    const updated = await prisma.notification.update({
      where: { id: Number(id) },
      data: { estLue: true }
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    await prisma.notification.updateMany({
      where: { utilisateurId: userId, estLue: false },
      data: { estLue: true }
    });

    res.json({ message: 'Toutes les notifications ont été marquées comme lues' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
