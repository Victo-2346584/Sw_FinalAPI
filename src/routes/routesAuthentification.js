import express from 'express';
import controleurAuthentification from '../controllers/controleurAuthentification.js';

const router = express.Router();

router.post('/register', controleurAuthentification.enregistrerUtilisateur);

router.post('/login', controleurAuthentification.obtenirCleApi);

export default router;