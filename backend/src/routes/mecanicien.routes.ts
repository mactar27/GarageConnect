import { Router } from 'express';
import { getDemandesAssignees, etablirDevis, updateStatutDemande, soumettreRapport } from '../controllers/mecanicien.controller';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('MECANICIEN'));

router.get('/demandes', getDemandesAssignees);
router.put('/demandes/:id/statut', updateStatutDemande);
router.post('/devis', etablirDevis);
router.post('/rapports', soumettreRapport);

export default router;
