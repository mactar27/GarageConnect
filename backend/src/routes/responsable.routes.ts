import { Router } from 'express';
import { getMonGarage, creerGarage, ajouterMecanicien, getDemandesGarage, assignerMecanicien } from '../controllers/responsable.controller';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('RESPONSABLE_GARAGE'));

router.get('/mon-garage', getMonGarage);
router.post('/mon-garage', creerGarage);
router.post('/mecaniciens', ajouterMecanicien);
router.get('/demandes', getDemandesGarage);
router.put('/demandes/:demandeId/assigner', assignerMecanicien);

export default router;
