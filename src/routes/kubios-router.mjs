import express from 'express';
import {authenticateToken} from '../middlewares/authentication.mjs';
import {getUserData, getUserInfo, getFilteredData} from '../controllers/kubios-controller.mjs';

const kubiosRouter = express.Router();

kubiosRouter
  .get('/user-data', authenticateToken, getUserData)
  .get('/user-info', authenticateToken, getUserInfo)
  .get('/filtered-data', authenticateToken, getFilteredData);

export default kubiosRouter;
