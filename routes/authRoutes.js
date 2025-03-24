import express from 'express';
import { register, login,getUsers,getUserById } from '../controllers/authController.js';
const router = express.Router();
router.post('/register', register);
router.get('/:id', getUserById);
router.get('/', getUsers);


router.post('/login', login);
export default router;