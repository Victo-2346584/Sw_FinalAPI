import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import routesAuthentification from './src/routes/routesAuthentification.js';
import routesTache from './src/routes/routesTache.js';
import routesSousTache from './src/routes/routesSousTache.js';
import gestionErreurs from './src/config/gestionErreurs.js';
import cors from "cors";
import fs from 'fs';
const swaggerDocument = JSON.parse(fs.readFileSync('./src/config/documentation.json', 'utf8'));
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Demo API"
};
const app = express();
app.use(cors());
const port = process.env.PORT || 3000;
app.use(express.json());

app.use(morgan('combined', {
    stream: {
        write: (message) => {
            gestionErreurs(message.trim());
        }
    }
}));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

app.use('/auth', routesAuthentification);

app.use('/tasks', routesTache);

app.use('/subtasks/:tacheId', routesSousTache);

app.use(( req, res, next) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

app.use((err, res) => {
    console.error(err); 
    gestionErreurs(err.message);
    res.status(500).json({ message: 'Erreur interne du serveur' });
});

app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});
