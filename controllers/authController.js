const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ========================================
// REGISTER
// ========================================

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password
    } = req.body;

    const existingUser = await User.findOne({
      email
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// ========================================
// LOGIN
// ========================================

exports.login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    const user = await User.findOne({
      email
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// ========================================
// GET PROFILE
// ========================================

exports.getProfile = async (req, res) => {
  try {

    const user = await User.findById(
      req.user.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      user
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// ========================================
// UPDATE PROFILE
// ========================================

exports.updateProfile = async (req, res) => {
  try {

    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Name is required"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: name.trim()
      },
      {
        new: true
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "Profile updated successfully",
      user
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// ========================================
// CHANGE PASSWORD
// ========================================

exports.changePassword = async (req, res) => {
  try {

    const {
      currentPassword,
      newPassword
    } = req.body;


    // Check input

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required"
      });
    }


    // Get current user

    const user = await User.findById(
      req.user.id
    );


    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }


    // Check current password

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );


    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect"
      });
    }


    // Validate new password

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters"
      });
    }


    // Hash new password

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );


    // Save new password

    user.password = hashedPassword;

    await user.save();


    res.json({
      message: "Password changed successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};