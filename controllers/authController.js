const User = require('../models/user');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');


async function signup(req, res) {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists with this email' });
        }

        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });

        const newUser = new User({ email, password, otp });
        await newUser.save();

        const secretKey = process.env.JWT_SECRET || 'yourDefaultSecretKey';
        const token = jwt.sign({ userId: newUser._id, email: newUser.email }, secretKey, { expiresIn: '1h' });


        return res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const secretKey = process.env.JWT_SECRET || 'yourDefaultSecretKey';
        const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: '1h' });

        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


async function generateOTP(req, res) {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found with this email' });
        }

        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });

        user.otp = otp;
        await user.save();


        return res.status(200).json({ message: 'OTP generated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function verifyOTP(req, res) {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found with this email' });
        }

        if (user.otp !== otp) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }

        user.otp = null;
        await user.save();

        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ message: 'OTP verified successfully', token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { signup, login, generateOTP, verifyOTP };