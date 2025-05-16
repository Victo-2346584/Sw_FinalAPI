import express from 'express';
import controleurTache from '../controllers/controleurTache.js';
import controleurAuthentification from '../controllers/controleurAuthentification.js';

const router = express.Router();

router.use(controleurAuthentification.authentifierCleApi);

router.get('/', controleurTache.obtenirToutesLesTaches);


router.get('/:id', controleurTache.obtenirDetailsTache);

router.post('/', controleurTache.creerTache);

router.put('/:id', controleurTache.mettreAJourTache);

router.patch('/:id/status', controleurTache.mettreAJourStatutTache);

router.delete('/:id', controleurTache.supprimerTache);

export default router;