const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: "Please add all fields" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ error: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10); // 12345
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ error: "User not created" });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ error: "Invalid credential" });
  }
};
const getProfile = (req, res) => {
  res.json(req.user);
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const updateProfile = async (req, res) => {
  // Assuming req.user.id contains the authenticated user's ID
  const userId = req.user.id;
  const { name, email } = req.body;

  try {
    // Find the user by ID and update the name and/or email
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { name, email } },
      { new: true, runValidators: true } // Return the updated user and run schema validators
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the updated user information (excluding sensitive fields like password)
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      // Include any other user fields you want to return
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile" });
  }
};
module.exports = { register, login, getProfile, updateProfile };
