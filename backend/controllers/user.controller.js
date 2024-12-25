import { User } from './models/user.model.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {

        const { fullName, email, phoneNumber, password, role } = req.body;
        if (!fullName || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "User already exists",
                success: false
            })
        }

        const hashedpassword = await bcrypt.hash(password, 10);

        await User.create({
            fullName,
            email,
            phoneNumber,
            password: hashedpassword,
            role,
        })

        return res.status(201).json({
            message: "Account created successfully",
            success: true
        })


    } catch (error) {

        console.log(error)

    }
}


export const login = async (req, res) => {
    try {

        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }

        const user = await User.findOne(email);
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            })
        };

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false
            })
        };

        if (role != user.role) {
            return res.status(400).json({
                message: "Role doesn't match",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }

        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile

        }

        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        

    } catch (error) {

        console.log(error);

    }
}


export const logout= async(req,res)=>{
    try {

        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"Logged out successfully",
            succes:true
        })
        
    } catch (error) {
        console.log(error)
    }

}