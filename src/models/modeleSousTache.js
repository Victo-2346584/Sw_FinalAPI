import db from '../config/baseDeDonnees.js';

const obtenirToutesLesSousTachesParTacheId = async (tacheId) => {
    return new Promise((resolve, reject) => {
        const requete = 'SELECT * FROM sous_taches WHERE tache_id = $1';
        const params = [tacheId];
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

const obtenirSousTacheParIdEtTacheId = async (id, tacheId) => {
    return new Promise((resolve, reject) => {
        const requete = 'SELECT * FROM sous_taches WHERE id = $1 AND tache_id = $2';
        const params = [id, tacheId];
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

const creerSousTache = async (tacheId, titre) => {
    return new Promise((resolve, reject) => {
        const requete = 'INSERT INTO sous_taches (tache_id, titre, complete) VALUES ($1, $2, FALSE) RETURNING id';
        const params = [tacheId, titre];
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

const mettreAJourSousTache = async (id, tacheId, titre) => {
    return new Promise((resolve, reject) => {
        const requete = 'UPDATE sous_taches SET titre = $1 WHERE id = $2 AND tache_id = $3 RETURNING *';
        const params = [titre, id, tacheId];
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

const mettreAJourStatutSousTache = async (id, tacheId, complete) => {
    return new Promise((resolve, reject) => {
        const requete = 'UPDATE sous_taches SET complete = $1 WHERE id = $2 AND tache_id = $3 RETURNING *';
        const params = [complete, id, tacheId];
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

const supprimerSousTache = async (id, tacheId) => {
    return new Promise((resolve, reject) => {
        const requete = 'DELETE FROM sous_taches WHERE id = $1 AND tache_id = $2 RETURNING *';
        const params = [id, tacheId];
        db.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.error(`Erreur : ${erreur.message}`);
                reject(erreur);
            } else {
                resolve(resultat.rows[0]);
            }
        });
    });
};

export default {
    obtenirToutesLesSousTachesParTacheId,
    obtenirSousTacheParIdEtTacheId,
    creerSousTache,
    mettreAJourSousTache,
    mettreAJourStatutSousTache,
    supprimerSousTache
};
