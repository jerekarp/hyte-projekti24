import jwt from 'jsonwebtoken';
import 'dotenv/config';
import {customError} from './error-handler.mjs'

const authenticateToken = (req, res, next) => {
  // console.log('authenticateToken', req.headers);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  // console.log('token', token);
  if (!token) {
    return res.sendStatus(401);
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).send({message: 'invalid token'});
  }
};

export {authenticateToken};
