import { Router } from 'express';
import { getStatistiques, getGarages, validerGarage, suspendreGarage, getUsers } from '../controllers/admin.controller';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('ADMIN'));

router.get('/statistiques', getStatistiques);
router.get('/garages', getGarages);
router.put('/garages/:garageId/valider', validerGarage);
router.put('/garages/:garageId/suspendre', suspendreGarage);
router.get('/utilisateurs', getUsers);

export default router;
