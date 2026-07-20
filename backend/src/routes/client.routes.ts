import { Router } from 'express';
import { addVehicule, getVehicules, createDemande, getDemandes, validerDevis, payerFacture, laisserAvis } from '../controllers/client.controller';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('CLIENT'));

router.post('/vehicules', addVehicule);
router.get('/vehicules', getVehicules);

router.post('/demandes', createDemande);
router.get('/demandes', getDemandes);
router.put('/devis/:devisId/valider', validerDevis);
router.post('/demandes/:demandeId/payer', payerFacture);
router.post('/avis', laisserAvis);

export default router;
