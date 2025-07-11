
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");   
//const { Profiler } = require("react");

//Generate JWT Token
const generateToken =(userId) =>{
    return jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:"7d" });

};

//@desc Register a new User

//@route POST /api/users

//@access Public


const registerUser = async(req,res) =>{
    try{
        const {name,email,password,profileImageUrl,adminInviteToken} = req.body;

        //Cheak if user already exists
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message:"User already exists"});
        }
        //Determine user role:Admin if correct token is provided,otherwiseMember
        let role = "member";
        if(adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN){
            role = "admin";
        }
        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        //Create new user
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            profileImageUrl,
            role,
        });

        //Return user data with JWT
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            profileImageUrl:user.profileImageUrl,
            role:user.role,
            token:generateToken(user._id),
        });

    }catch(error){
        res.status(500).json({message:"Server Error",error:error.message});
    }
};

//desc Login user
//@route POST/api/auth/login
//access Public


const loginUser = async(req,res) =>{
        try{
            const {email,password} = req.body;
            const user = await User.findOne({email});
            if(!user){
                return res.status(401).json({message:"Invalid credentials"});
            }

            //compare password
            const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch){
                return res.status(401).json({message:"Invalid email or password"});
            }
            //Return user data with JWT
            res.json({
                _id:user._id,
                name:user.name,
                email:user.email,
                profileImageUrl:user.profileImageUrl,
                role:user.role,
                token:generateToken(user._id),
            });
            

        }catch(error){
        res.status(500).json({message:"Server Error",error:error.message});
    }
};

//@desc Get User Profile
//@route GET/api/auth/profile
//access Private {Reqires JWT}

const getUserProfile = async(req,res) =>{
        try{}catch(error){
        res.status(500).json({message:"Server Error",error:error.message});
    }
};

//@desc Update User Profile
//@route PUT/api/auth/profile
//access Private {Reqires JWT}

const updateUserProfile = async(req,res) =>{
        try{}catch(error){
        res.status(500).json({message:"Server Error",error:error.message});
    }
};

module.exports = {registerUser,loginUser,getUserProfile,updateUserProfile};
