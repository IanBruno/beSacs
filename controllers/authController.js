import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '1d',
    })
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const register = async (req, res, next) => {
    try {
        const {username, email, password } = req.body;

        //Check if user exists
        const userExists = await User.findOne({ $or: [{email}]});
        
        if(userExists) {
            return res.status(400).json({
                success: false,
                error: 
                    userExists.email === email 
                        ? 'Email already registered'
                        : 'Username already taken',
                statusCode: 400,
            })
        }

        const user = await User.create({
            username,
            email,
            password,
        });

        //Generate token
        const token = generateToken(user._id);
        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    createdAt: user.createdAt,
                },
            token,
            },
            message: "User registered successfully",
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public

export const login = async (req, res, next) => {
    try {
         const { email, password } = req.body;

         //Validate input
         if (!email || !password){
            return res.status(400).json({
                success:false,
                error: 'Por favor introduce correo y contraseña',
                statusCode: 400,
            });
        }

        // Check for user (include password for comparision)
        const user = await User.findOne({ email }).select('+password');

        if (!user){
            return res.status(400).json({
                success:false,
                error: 'Invalid credentials',
                statusCode: 401,
            });
        }
        console.log('Pass: ', password);
        console.log('USER: ', user);

        // Check password
        const isMatch = await user.matchPassword(password);

        console.log('isMatch: ', isMatch);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Contraseña inválida',
                statusCode: 401,
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            token,
            message: 'Login Succesful',
        });
    } catch (error) {
        next(error);
    }
};