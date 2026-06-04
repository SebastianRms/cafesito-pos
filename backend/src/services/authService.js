import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async ({ name, email, password, role }) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        name,
        email,
        hash_password: hashedPassword,
        role
    });

    return await newUser.save();
};

export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.hash_password);
    if (!isMatch) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    return {
        token,
        user: {
            id: user._id,
            display_name: user.display_name,
            role: user.role
        }
    };
};