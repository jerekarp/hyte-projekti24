import express from 'express';
import {chatgptMiddleware} from '../middlewares/chatgpt.mjs'; // Tarkista tiedostopolku
import {authenticateToken} from '../middlewares/authentication.mjs';


const router = express.Router();

router.post('/zenbot', authenticateToken, chatgptMiddleware);

export default router;