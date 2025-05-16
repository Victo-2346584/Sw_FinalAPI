import db from '../config/baseDeDonnees.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const creerUtilisateur = async (nom, prenom, courriel, motDePasse) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(motDePasse, 10)
            .then(motDePasseHache => {
                const cleApi = crypto.randomBytes(8).toString('hex');
                const requete = 'INSERT INTO utilisateur (nom, prenom, courriel, cle_api, password) VALUES ($1, $2, $3, $4, $5)';
                const params = [nom, prenom, courriel, cleApi, motDePasseHache];
                db.query(requete, params, (erreur, resultat) => {
                    if (erreur) {
                        console.error(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                        reject(erreur);
                    } else {
                        resolve({ id: resultat.rows.insertId, cle_api: cleApi });
                    }
                });
            })
            .catch(erreurHash => {
                console.error("Erreur lors du hachage du mot de passe :", erreurHash);
                reject(erreurHash);
            });
    });
};

const obtenirUtilisateurParCourriel = async (courriel) => {
    return new Promise((resolve, reject) => {
        const requete = 'SELECT * FROM utilisateur WHERE courriel = $1';
        const params = [courriel];
        db.query(requete, params, (erreur, lignes) => {
            if (erreur) {
                console.error(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            } else {
                resolve(lignes.rows[0]);
            }
        });
    });
};

const  obtenirUtilisateurParCleApi = async (cleApi) => {
    return new Promise((resolve, reject) => {
        const requete = 'SELECT id FROM utilisateur WHERE cle_api = $1';
        const params = [cleApi];
        db.query(requete, params, (erreur, lignes) => {
            if (erreur) {
                console.error(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            } else {
                resolve(lignes.rows[0]);
            }
        });
    });
};

const mettreAJourCleApi = async (courriel, nouvelleCleApi) => {
    return new Promise((resolve, reject) => {
        const requete = 'UPDATE utilisateur SET cle_api = $1 WHERE courriel = $2';
        const params = [nouvelleCleApi, courriel];
        db.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                console.error(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            } else {
                resolve(resultat.rows);
            }
        });
    });
};

export default {
    creerUtilisateur,
    obtenirUtilisateurParCourriel,
    obtenirUtilisateurParCleApi,
    mettreAJourCleApi
};