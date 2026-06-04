import * as authService from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;

    await authService.registerUser({ email, password, name, role });

    return res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    next(error); 
  }
};

export const login = async (req, res, next) => {
  try {
        const { email, password } = req.body;

        const data = await authService.loginUser({ email, password });

        return res.status(200).json(data);

    } catch (error) {
        if (error.message === 'INVALID_CREDENTIALS') {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        
        next(error);
    }
};