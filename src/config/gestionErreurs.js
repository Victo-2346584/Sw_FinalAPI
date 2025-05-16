import fs from 'fs';
import path from 'path';

const cheminFichierJournalisation = "./erreurs.log";

const journaliserErreur = (message) => {
    const horodatage = new Date().toISOString();
    const entreeJournal = `[${horodatage}] ERREUR: ${message}\n`;
    fs.appendFile(cheminFichierJournalisation, entreeJournal, (err) => {
        if (err) {
            console.error('Erreur lors de l\'écriture dans le fichier de journalisation :', err);
        }
    });
};

export default journaliserErreur;