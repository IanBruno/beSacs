import express from 'express';
import { body } from 'express-validator';
import {
    login,
    register
} from '../controllers/authController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

//Validation middleware
const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characterest'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({min: 6})
        .withMessage('Password must be at least 6 characters')
];

const loginValidation =[
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Por favor introduce un correo válido'),
    body('password')
        .notEmpty()
        .withMessage('Debes introducir tu password')
]

//Public routes
router.post('/register', registerValidation, register)
router.post('/login', loginValidation, login);

export default router;