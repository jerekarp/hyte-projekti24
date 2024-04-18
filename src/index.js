// Main JS file
import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import itemRouter from './routes/item-router.mjs';
import userRouter from './routes/user-router.mjs';
import entryRouter from './routes/entry-router.mjs';
import cors from 'cors';
import logger from './middlewares/logger.mjs';
import authRouter from './routes/auth-router.mjs';
import kubiosRouter from './routes/kubios-router.mjs';
import {errorHandler, notFoundHandler} from './middlewares/error-handler.mjs';
const hostname = '127.0.0.1';
const port = 3000;
const app = express();

// middleware, joka lisää CORS-otsakkeen jokaiseen lähtevään vastaukseen.
// Eli kerrotaan selaimelle, että tämä palvelin sallii AJAX-pyynnöt
// myös muista kuin samasta alkuperästä (url-osoitteesta, palvelimelta) ladatuilta sivuilta.
app.use(cors());

// logger middleware
app.use(logger);

// middleware, joka parsii pyynnössä olevan JSON-datan ja lisää sen request-objektiin (req.body)
app.use(express.json());

// Staattinen sivusto palvelimen juureen (public-kansion sisältö näkyy osoitteessa http://127.0.0.1:3000/sivu.html)
// Voit sijoittaa esim. valmiin client-sovelluksen tähän kansioon
app.use(express.static('public'));

// Staattinen sivusto voidaan tarjoilla myös "ali-url-osoitteessa": http://127.0.0.1:3000/sivusto
// Tarjoiltava kansio määritellään relatiivisella polulla (tässä käytössä sama kansio kuin yllä).
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/docs', express.static(path.join(__dirname, '../docs')));
/// test
// Test RESOURCE /items endpoints (just mock data for testing, not connected to any database)
app.use('/items', itemRouter);

// bind base url (/api/entries resource) for all entry routes to entryRouter
app.use('/api/entries', entryRouter);


// Users resource (/api/users)
app.use('/api/users', userRouter);

// User authentication
app.use('/api/auth', authRouter);

// Kubios API resource (/api/kubios)
app.use('/api/kubios', kubiosRouter);

// Default 404 not found
app.use(notFoundHandler);
// Error handler for sending response all error cases
app.use(errorHandler);

// Start the server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
