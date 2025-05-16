import db from '../config/baseDeDonnees.js';

const obtenirToutesLesTachesParUtilisateurId = async (utilisateurId, complete) => {
    return new Promise((resolve, reject) => {
        let requete;
        const params = [utilisateurId.id];
        if (complete == true) {
            requete = 'SELECT * FROM taches WHERE utilisateur_id = $1';
        } else {
            requete = 'SELECT * FROM taches WHERE utilisateur_id = $1 AND complete = false';
        }
        db.query(requete, params, (erreur, lignes) => {
            if (erreur) {
                console.error(`Erreur : ${erreur.message}`);
                reject(erreur);
            } else {
                resolve(lignes.rows);
            }
        });
    });
};

const obtenirTacheParIdEtUtilisateurId = async (id, utilisateurId) => {
    return new Promise((resolve, reject) => {
        const requete = 'SELECT * FROM taches WHERE id = $1 AND utilisateur_id = $2';
        const params = [id, utilisateurId.id];
        db.query(requete, params, (erreur, lignes) => {
            if (erreur) {
                console.error(`Erreur : ${erreur.message}`);
                reject(erreur);
            } else {
                resolve(lignes.rows[0]);
            }
        });
    });
};

const creerTache = async (utilisateurId, titre, description, dateDebut, dateEcheance) => {
    return new Promise((resolve, reject) => {
        const requete = 'INSERT INTO taches (utilisateur_id, titre, description, date_debut, date_echeance, complete) VALUES ($1, $2, $3, $4, $5, FALSE) RETURNING id';
        const params = [utilisateurId.id, titre, description, dateDebut, dateEcheance];
        db.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.error(`Erreur : ${erreur.message}`);
                reject(erreur);
            } else {
                resolve({ id: resultat.rows[0].id });
            }
        });
    });
};

const mettreAJourTache = async (id, utilisateurId, titre, description, dateDebut, dateEcheance) => {
    return new Promise((resolve, reject) => {
        const requete = 'UPDATE taches SET titre = $1, description = $2, date_debut = $3, date_echeance = $4 WHERE id = $5 AND utilisateur_id = $6 RETURNING *';
        const params = [titre, description, dateDebut, dateEcheance, id, utilisateurId.id];
        db.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.error(`Erreur : ${erreur.message}`);
                reject(erreur);
            } else {
                console.log(resultat);
                resolve(resultat);
            }
        });
    });
};

const mettreAJourStatutTache = async (id, utilisateurId, complete) => {
    return new Promise((resolve, reject) => {
        const requete = 'UPDATE taches SET complete = $1 WHERE id = $2 AND utilisateur_id = $3 RETURNING *';
        const params = [complete, id, utilisateurId.id];
        db.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.error(`Erreur : ${erreur.message}`);
                reject(erreur);
            } else {
                resolve(resultat);
            }
        });
    });
};

const supprimerTache = async (id, utilisateurId) => {
    return new Promise((resolve, reject) => {
        const requete = 'DELETE FROM taches WHERE id = $1 AND utilisateur_id = $2 RETURNING *';
        const params = [id, utilisateurId.id];
        db.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.error(`Erreur : ${erreur.message}`);
                reject(erreur);
            } else {
                console
                resolve(resultat);
            }
        });
    });
};

export default {
    obtenirToutesLesTachesParUtilisateurId,
    obtenirTacheParIdEtUtilisateurId,
    creerTache,
    mettreAJourTache,
    mettreAJourStatutTache,
    supprimerTache
};
