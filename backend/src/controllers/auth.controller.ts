import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_garageconnect';

export const register = async (req: Request, res: Response) => {
  try {
    console.log('Register request received:', req.body.email);
    const { nom, prenom, email, motDePasse, telephone, role } = req.body;

    console.log('Finding existing user...');
    const existingUser = await prisma.utilisateur.findUnique({ where: { email } });
    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(motDePasse, 10);
    console.log('Password hashed');

    const newUser = await prisma.utilisateur.create({
      data: {
        nom,
        prenom,
        email,
        motDePasse: hashedPassword,
        telephone,
        role: role || 'CLIENT', // Default to CLIENT if not provided
      },
    });

    // Don't send password back
    const { motDePasse: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ message: 'Utilisateur créé avec succès', user: userWithoutPassword });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, motDePasse } = req.body;

    const user = await prisma.utilisateur.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    const { motDePasse: _, ...userWithoutPassword } = user;
    res.json({ message: 'Connexion réussie', token, user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
};

export const loginGoogleDemo = async (req: Request, res: Response) => {
  try {
    const demoEmail = 'demo.google@gmail.com';
    let user = await prisma.utilisateur.findUnique({ where: { email: demoEmail } });

    if (!user) {
      // Create demo user if it doesn't exist
      const hashedPassword = await bcrypt.hash('demopassword', 10);
      user = await prisma.utilisateur.create({
        data: {
          nom: 'Démo',
          prenom: 'Google',
          email: demoEmail,
          motDePasse: hashedPassword,
          telephone: '000000000',
          role: 'CLIENT',
        },
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    const { motDePasse: _, ...userWithoutPassword } = user;
    
    res.json({ message: 'Connexion Google (Démo) réussie', token, user: userWithoutPassword });
  } catch (error) {
    console.error('Google Demo Login error:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion Google' });
  }
};

export const uploadAvatarController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier n\'a été fourni' });
    }

    // Le fichier a été uploadé dans public/avatars par multer
    // On sauvegarde juste le nom du fichier ou le chemin relatif
    const avatarUrl = `/avatars/${req.file.filename}`;

    const updatedUser = await prisma.utilisateur.update({
      where: { id: userId },
      data: { photoProfil: avatarUrl }
    });

    const { motDePasse: _, ...userWithoutPassword } = updatedUser;
    
    res.json({ 
      message: 'Photo de profil mise à jour avec succès', 
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ message: 'Erreur lors du téléversement de la photo de profil' });
  }
};
