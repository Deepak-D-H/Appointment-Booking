import User from '../models/UserSchema.js';
import Doctor from '../models/DoctorSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '15d' }
  );
};

export const register = async (req, res) => {
  const { name, email, password, gender, role, photo } = req.body;

  try {
    // Validate inputs
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password, and role',
      });
    }

    if (!['patient', 'doctor'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be either patient or doctor',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists in either collection
    const existingPatient = await User.findOne({ email: normalizedEmail });
    const existingDoctor = await Doctor.findOne({ email: normalizedEmail });

    if (existingPatient || existingDoctor) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user;
    if (role === 'patient') {
      user = new User({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        photo: photo || '',
        gender: gender || 'other',
        role: 'patient',
      });
    } else if (role === 'doctor') {
      user = new Doctor({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        photo: photo || '',
        gender: gender || 'other',
        role: 'doctor',
      });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Registration failed, please try again',
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = null;

    const patient = await User.findOne({ email: normalizedEmail });
    const doctor = await Doctor.findOne({ email: normalizedEmail });

    if (patient) {
      user = patient;
    } else if (doctor) {
      user = doctor;
    }

    // Check if user exists
    if (!user) {
      return res.status(404).json({ success: false, message: 'User does not exist with this email' });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user);

    const { password: userPassword, role, appointments, ...rest } = user._doc;

    return res.status(200).json({
      success: true,
      message: 'Successfully logged in',
      token,
      data: { ...rest },
      role,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to login',
    });
  }
};