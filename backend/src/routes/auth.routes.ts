import { Router } from 'express';
import { register, login, loginGoogleDemo, uploadAvatarController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { uploadAvatar } from '../middleware/upload';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google/demo', loginGoogleDemo);
router.post('/avatar', authenticate, uploadAvatar.single('avatar'), uploadAvatarController);

import prisma from '../prisma';

router.get('/me', authenticate, async (req: any, res) => {
  try {
    const user = await prisma.utilisateur.findUnique({
      where: { id: req.user.id }
    });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    const { motDePasse: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
