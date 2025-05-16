import modeleUtilisateur from '../models/modeleUtilisateur.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import journaliserErreur from '../config/gestionErreurs.js';

function enregistrerUtilisateur(req, res) {
    const { nom, prenom, courriel, motDePasse } = req.body;
    console.log(req.body);
    modeleUtilisateur.creerUtilisateur(nom, prenom, courriel, motDePasse)
        .then(utilisateur =>{
            res.status(201).json({ message: 'Utilisateur créé avec succès', cle_api: utilisateur.cle_api });
        })
        .catch(err => {
            journaliserErreur(err.message);
            console.log(err)
            res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
        });
}

function obtenirCleApi(req, res) {
    const { courriel, motDePasse, genererNouveau } = req.body;
    modeleUtilisateur.obtenirUtilisateurParCourriel(courriel)
        .then(utilisateur=> {
            if (!utilisateur) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }
            return bcrypt.compare(motDePasse, utilisateur.password)
                .then(correspondance => {
                    if (!correspondance) {
                        return res.status(401).json({ message: 'Mot de passe incorrect' });
                    }
                    if (genererNouveau) {
                        const nouvelleCleApi = crypto.randomBytes(8).toString('hex');
                        return modeleUtilisateur.mettreAJourCleApi(courriel, nouvelleCleApi)
                            .then(function() {
                                return res.status(200).json({ cle_api: nouvelleCleApi });
                            });
                    } else {
                        return res.status(200).json({ cle_api: utilisateur.cle_api });
                    }
                });
        })
        .catch(function(err) {
            journaliserErreur(err.message);
            res.status(500).json({ message: 'Erreur lors de la récupération de la clé API' });
        });
}

function authentifierCleApi(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'En-tête Authorization manquant' });
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'cle_api' || !token) {
        return res.status(401).json({ message: 'Format de l\'en-tête Authorization invalide. Utilisez "cle_api <votre_clé>"' });
    }

    modeleUtilisateur.obtenirUtilisateurParCleApi(token)
        .then( utilisateur=> {
            if (!utilisateur) {
                return res.status(401).json({ message: 'Clé API invalide' });
            }
            req.utilisateur = { id: utilisateur.id };
            next();
        })
        .catch(err=> {
            journaliserErreur(err.message);
            res.status(500).json({ message: 'Erreur lors de la vérification de la clé API' });
        });
}

export  default {
   enregistrerUtilisateur,
    obtenirCleApi,
    authentifierCleApi
};