
import express from 'express';
import controleurSousTache from '../controllers/controleurSousTache.js';
import controleurAuthentification from '../controllers/controleurAuthentification.js';

const router = express.Router({ mergeParams: true });
router.use(controleurAuthentification.authentifierCleApi);
router.post('/', controleurSousTache.creerSousTache);

router.put('/:sousTacheId', controleurSousTache.mettreAJourSousTache);


router.delete('/:sousTacheId', controleurSousTache.supprimerSousTache);

export default router;
