
import modeleTache from '../models/modeleTache.js';
import modeleSousTache from '../models/modeleSousTache.js';
import journaliserErreur from "../config/gestionErreurs.js"
import modeleUtilisateur from '../models/modeleUtilisateur.js';
const creerSousTache = async (req, res) => {
    const tacheId = req.params.tacheId;
    const { titre } = req.body;
   const utilisateur = req.headers.authorization;
        const utilisateura = utilisateur.slice(8);
       const utilisateurid= await modeleUtilisateur.obtenirUtilisateurParCleApi(utilisateur.slice(8));
    modeleTache.obtenirTacheParIdEtUtilisateurId(tacheId, utilisateurid)
        .then(tache=> {
            if (!tache) {
                console.log(tache)
                return res.status(404).json({ message: 'Tâche parente non trouvée ou non autorisée' });
            }
            return modeleSousTache.creerSousTache(tacheId, titre)
                .then(function(nouvelleSousTache) {
                    res.status(201).json({ message: 'Sous-tâche créée avec succès', id: nouvelleSousTache.id });
                });
        })
        .catch(err=> {
            journaliserErreur(err.message);
            res.status(500).json({ message: 'Erreur lors de la création de la sous-tâche' });
        });
}

const mettreAJourSousTache = async (req, res) => {
    const tacheId = req.params.tacheId;
    const sousTacheId = req.params.sousTacheId;
    const { titre } = req.body;
       const utilisateur = req.headers.authorization;
        const utilisateura = utilisateur.slice(8);
       const utilisateurid= await modeleUtilisateur.obtenirUtilisateurParCleApi(utilisateur.slice(8));
    Promise.all([
        modeleTache.obtenirTacheParIdEtUtilisateurId(tacheId, utilisateurid),
        modeleSousTache.obtenirSousTacheParIdEtTacheId(sousTacheId, tacheId)
    ])
        .then(([tache, sousTache]) => {
            if (!tache || !sousTache) {
                return res.status(404).json({ message: 'Tâche parente ou sous-tâche non trouvée ou non autorisée' });
            }
            return modeleSousTache.mettreAJourSousTache(sousTacheId, tacheId, titre)
                .then(resultat => {
                    if (resultat.affectedRows === 0) {
                        return res.status(404).json({ message: 'Sous-tâche non trouvée ou non autorisée' });
                    }
                    res.status(200).json({ message: 'Sous-tâche mise à jour avec succès' });
                });
        })
        .catch(err => {
            journaliserErreur(err.message);
            res.status(500).json({ message: 'Erreur lors de la mise à jour de la sous-tâche' });
        });
}

const mettreAJourStatutSousTache = async (req, res) =>  {
    const tacheId = req.params.tacheId;
    const sousTacheId = req.params.sousTacheId;
    const { complete } = req.body;
    const utilisateur = req.headers.authorization;
        const utilisateura = utilisateur.slice(8);
       const utilisateurid= await modeleUtilisateur.obtenirUtilisateurParCleApi(utilisateur.slice(8));
    Promise.all([
        modeleTache.obtenirTacheParIdEtUtilisateurId(tacheId, utilisateurid),
        modeleSousTache.obtenirSousTacheParIdEtTacheId(sousTacheId, tacheId)
    ])
        .then(([tache, sousTache]) => {
            if (!tache || !sousTache) {
                return res.status(404).json({ message: 'Tâche parente ou sous-tâche non trouvée ou non autorisée' });
            }
            return modeleSousTache.mettreAJourStatutSousTache(sousTacheId, tacheId, complete)
                .then(function(resultat) {
                    if (resultat.affectedRows === 0) {
                        return res.status(404).json({ message: 'Sous-tâche non trouvée ou non autorisée' });
                    }
                    res.status(200).json({ message: 'Statut de la sous-tâche mis à jour avec succès' });
                });
        })
        .catch(err =>{
            journaliserErreur(err.message);
            res.status(500).json({ message: 'Erreur lors de la mise à jour du statut de la sous-tâche' });
        });
}

const supprimerSousTache = async (req, res) => {
    const tacheId = req.params.tacheId;
    const sousTacheId = req.params.sousTacheId;
    const utilisateur = req.headers.authorization;
        const utilisateura = utilisateur.slice(8);
       const utilisateurid= await modeleUtilisateur.obtenirUtilisateurParCleApi(utilisateur.slice(8));
    Promise.all([
        modeleTache.obtenirTacheParIdEtUtilisateurId(tacheId, utilisateurid),
        modeleSousTache.obtenirSousTacheParIdEtTacheId(sousTacheId, tacheId)
    ])
        .then(([tache, sousTache]) =>{
            if (!tache || !sousTache) {
                return res.status(404).json({ message: 'Tâche parente ou sous-tâche non trouvée ou non autorisée' });
            }
            return modeleSousTache.supprimerSousTache(sousTacheId, tacheId)
                .then(function(resultat) {
                    if (resultat.affectedRows === 0) {
                        return res.status(404).json({ message: 'Sous-tâche non trouvée ou non autorisée' });
                    }
                    res.status(200).json({ message: 'Sous-tâche supprimée avec succès' });
                });
        })
        .catch(err => {
            journaliserErreur(err.message);
            res.status(500).json({ message: 'Erreur lors de la suppression de la sous-tâche' });
        });
}

export default {
    creerSousTache,
    mettreAJourSousTache,
    mettreAJourStatutSousTache,
    supprimerSousTache
};