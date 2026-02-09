import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";

export const signUp = async (req, res) => {
  try {
    const { name, mobile, email, password, role } = await req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User Already Exists" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be atleast 6 characters" });
    }
    if (mobile.length < 10) {
      return res
        .status(400)
        .json({ message: "Mobile no must be atleast 10 digits" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      name,
      email,
      mobile,
      role,
      password: hashedPassword,
    });
    const token = await genToken(user._id);
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json(`sign up error ${error}`);
  }
};
export const signIn = async (req, res) => {
  try {
    const { email, password } = await req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password " });
    }

    const token = await genToken(user._id);
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(`sign In error ${error}`);
  }
};

export const signOut = async (req, res) =>{
  try{
    res.clearCookie("token")
    return res.status(200).json({message:"log out successfully"})
  } catch (error){
    return res.status(500).json(`sign out error ${error}`)
  }
}

