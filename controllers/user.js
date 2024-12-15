import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import User from "../models/User.js";

const SECRET = process.env.JWT_SECRET;
const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const FEURL = process.env.FRONTEND_URL;

/* LOGIN */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Received login request:", email);

    // Ensure you use the correct model name
    const user = await User.findOne({ email });
    console.log("Found user:", user);

    if (!user) {
      console.log("User not found");
      return res
        .status(401)
        .json({ message: "Invalid username/Please sign up" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", passwordMatch);

    if (!passwordMatch) {
      console.log("Incorrect password");
      return res.status(401).json({ message: "Incorrect password" });
    }

    const userToken = {
      name: user.name,
      id: user._id,
    };

    if (!SECRET) {
      console.error("JWT_SECRET not defined in environment variables.");
      return res.status(500).json({ message: "Internal server error" });
    }

    const token = jwt.sign(userToken, SECRET);
    console.log("Generated token:", token);
    console.log("Login successful");
    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Error on sign in, please try again" });
  }
};

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/* REGESTER */
const signup = async (req, res) => {
  console.log("Signup request received:", req.body);
  try {
    const { email, username, password, userType } = req.body; 
    console.log("Received data:", { username, email, password });

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are mandatory" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      username, 
      password: hashedPassword,
      userType,
    });

    console.log("User created:", newUser);

    res.status(201).json({
      message: `Account created successfully for ${newUser.username}`,
    });
  } catch (error) {
    console.error("Error in signup:", error.message);
    return res.status(500).json({
      message: "Error on sign up, please try again",
      error: error.message,
    });
  }
};

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/* UPDATE USER */
const update = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const matcheduser = await user.findOne({ email });
    if (!matcheduser) {
      return res.status(400).json({
        message: "Please enter valid email / Entered email not registered",
      });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are mandatory" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    matcheduser.name = name;
    matcheduser.password = hashedPassword;

    await user.findByIdAndUpdate(matcheduser.id, matcheduser);

    res
      .status(201)
      .json({ message: "Account updated successfully", matcheduser });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ message: "Error on updating, please try again later" });
  }
};

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/* CONFIRMING USER */
const confirmUser = async (req, res) => {
  try {
    const resetToken = req.params.token;

    const matcheduser = await user.findOne({ resetToken });

    if (!matcheduser || matcheduser.resetToken === "") {
      return res
        .status(400)
        .json({ message: "user not found or link expired" });
    }

    matcheduser.verified = true;
    matcheduser.resetToken = "";

    await matcheduser.save();

    res.status(200).json({
      message: `${matcheduser.name}'s account has been verified successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error verifying user" });
  }
};

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/* FORGET PASSWORD */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const matcheduser = await user.findOne({ email });

    if (!matcheduser) {
      return res.status(400).json({
        message: "Please enter valid email / Entered email not registered",
      });
    }

    const randomString =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const link = `${FEURL}/reset/${randomString}`;

    matcheduser.resetToken = randomString;
    await user.findByIdAndUpdate(matcheduser.id, matcheduser);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_ADDRESS,
        pass: EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Alfina" <${EMAIL_ADDRESS}>`,
      to: matcheduser.email,
      subject: "Reset Password",
      text: link,
    });

    res
      .status(201)
      .json({ message: `Mail has been sent to ${matcheduser.email}` });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ message: "Error on updating, please try again later" });
  }
};

/* --------------------------------------------------------------------------------------------------------------------------------------------- */

/* RESET PASSWORD */
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const resetToken = req.params.id;

    const matcheduser = await user.findOne({ resetToken });

    if (!matcheduser || matcheduser.resetToken === "") {
      return res
        .status(400)
        .json({ message: "user not found or reset link expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    matcheduser.password = hashedPassword;
    matcheduser.resetToken = "";

    await user.findByIdAndUpdate(matcheduser.id, matcheduser);

    res.status(201).json({
      message: `${matcheduser.name}'s password has been updated successfully`,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ message: "user not found or reset link expired" });
  }
};

export { login, signup, update, confirmUser, forgotPassword, resetPassword };
