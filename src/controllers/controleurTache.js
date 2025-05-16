import modeleTache from '../models/modeleTache.js';
import modeleSousTache from '../models/modeleSousTache.js';
import journaliserErreur from '../config/gestionErreurs.js';
import modeleUtilisateur from '../models/modeleUtilisateur.js';
const obtenirToutesLesTaches = async(req, res) => {
    const complete = req.query.complete;
    const utilisateur = req.headers.authorization;

    const utilisateurid= await modeleUtilisateur.obtenirUtilisateurParCleApi(utilisateur.slice(8))
    modeleTache.obtenirToutesLesTachesParUtilisateurId(utilisateurid, complete)
        .then((taches) =>{
            
            res.status(200).json(taches);
        })
        .catch((err) =>{
            console.log(err.message);
            journaliserErreur(err.message);
            res.status(500).json({ message: 'Erreur lors de la récupération des tâches' });
        });
}

const obtenirDetailsTache = async (req, res) =>{
    const tacheId = req.params.id;
    const utilisateur = req.headers.authorization;

    const utilisateurid= await modeleUtilisateur.obtenirUtilisateurParCleApi(utilisateur.slice(8))
    modeleTache.obtenirTacheParIdEtUtilisateurId(tacheId, utilisateurid)
        .then(tache=> {
            if (!tache) {
                return res.status(404).json({ message: 'Tâche non trouvée' });
            }
            return modeleSousTache.obtenirToutesLesSousTachesParTacheId(tacheId)
                .then((sousTaches) =>{
                    res.status(200).json({ ...tache, sous_taches: sousTaches });
                });
        })
        .catch(err => {
            journaliserErreur(err.message);
            res.status(500).json({ message: 'Erreur lors de la récupération des détails de la tâche' });
        });
}

const creerTache = async (req, res) =>{
    const { titre, description, date_debut, date_echeance } = req.body;
    modeleTache.creerTache(req.utilisateur.id, titre, description, date_debut, date_echeance)
        .then(function(nouvelleTache) {
            res.status(201).json({ message: 'Tâche créée avec succès', id: nouvelleTache.id });
        })
        .catch(function(err) {
            journaliserErreur(err.message);
            res.status(500).json({ message: 'Erreur lors de la création de la tâche' });
        });
}

const mettreAJourTache = async (req, res) => {
    const tacheId = req.params.id;
    const { titre, description, date_debut, date_echeance } = req.body;
    modeleTache.mettreAJourTache(tacheId, req.utilisateur.id, titre, description, date_debut, date_echeance)
        .then((resultat) => {
            if (resultat.affectedRows === 0) {
                return res.status(404).json({ message: 'Tâche non trouvée ou non autorisée' });
            }
            res.status(200).json({ message: 'Tâche mise à jour avec succès' });
        })
        .catch((err)=>{
            journaliserErreur(err.message);
            res.status(500).json({ message: 'Erreur lors de la mise à jour de la tâche' });
        });
}

const mettreAJourStatutTache = async (req, res) =>{
    const tacheId = req.params.id;
    const { complete } = req.body;
    modeleTache.mettreAJourStatutTache(tacheId, req.utilisateur.id, complete)
        .then(resultat=> {
            if (resultat.affectedRows === 0) {
                return res.status(404).json({ message: 'Tâche non trouvée ou non autorisée' });
            }
            res.status(200).json({ message: 'Statut de la tâche mis à jour avec succès' });
        })
        .catch(function(err) {
            journaliserErreur(err.message);
            res.status(500).json({ message: 'Erreur lors de la mise à jour du statut de la tâche' });
        });
}
const supprimerTache = async (req, res) =>{
    const tacheId = req.params.id;
    modeleTache.supprimerTache(tacheId, req.utilisateur.id)
        .then((resultat) =>{
            if (resultat.affectedRows === 0) {
                return res.status(404).json({ message: 'Tâche non trouvée ou non autorisée' });
            }
            res.status(200).json({ message: 'Tâche supprimée avec succès' });
        })
        .catch((err) =>{
            journaliserErreur(err.message);
            res.status(500).json({ message: 'Erreur lors de la suppression de la tâche' });
        });
}

export default {
    obtenirToutesLesTaches,
    obtenirDetailsTache,
    creerTache,
    mettreAJourTache,
    mettreAJourStatutTache,
    supprimerTache
};