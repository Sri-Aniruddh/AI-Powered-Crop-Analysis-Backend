
const { ApiError } = require("../utils/ApiError.js")
const { ApiResponse } = require("../utils/ApiResponse.js")
const User = require("../models/UserModel.js")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const { asyncHandler } = require("../utils/AsyncHandler.js")

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = jwt.sign(
            {
                _id: user._id,
                email: user.email,
                fullname: user.fullname
            },
            process.env.ACCESS_TOKEN_SECRET || "your-access-token-secret",
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "7d" }
        )
        const refreshToken = jwt.sign(
            { _id: user._id },
            process.env.REFRESH_TOKEN_SECRET || "your-refresh-token-secret",
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "30d" }
        )
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, password } = req.body

    if ([fullname, email, password].some(field => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User already exists")
    }

    const user = await User.create({
        fullname,
        email,
        password,
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user")
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )
})

const loginuser = asyncHandler(async (req, res) => {
    let { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password required");
    }

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "Invalid credentials");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }


    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const option = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    }

    return res.status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(200, {
                user: loggedInUser,
                accessToken,
                refreshToken
            }, "User logged in successfully")
        )
})

const logOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const option = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    }

    return res.status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(new ApiResponse(200, {}, "User logged out successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(401, "Unauthorized")
    }

    return res.status(200).json(
        new ApiResponse(200, user, "Current user fetched successfully")
    )
})

module.exports = { registerUser, loginuser, logOutUser, getCurrentUser, generateAccessAndRefreshTokens }