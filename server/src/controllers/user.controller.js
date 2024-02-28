import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/ApiError.js';
import { User } from "../models/user.models.js";
import uploadOnCloudinary from '../utils/cloudinary.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import { Place } from "../models/place.models.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        console.log("access Token:",accessToken)
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error in generateAccessAndRefreshToken:", error);
        throw new ApiError(500, `Something went wrong: ${error.message}`);
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, username, email, password } = req.body;
    console.log("username:",username)

    if ([fullname, email, username, password].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existedUser) {
        throw new ApiError(409, "User is already registered");
    }

    const lowerCaseUsername = username ? username.toLowerCase() : undefined;

    const user = await User.create({
        fullname,
        email,
        password,
        username: lowerCaseUsername,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(new ApiResponse(200, createdUser, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if ([username, email, password].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (!user) {
        throw new ApiError(400, 'Invalid credentials');
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(400, 'Invalid credentials');
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    console.log(accessToken)
    const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

    const options = {
        httpOnly: true,
        secure: true,
    };

    // Send the access token in the response along with the user information
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            status: 'success',
            data: {
                user: loggedInUser,
                accessToken: accessToken  // Include the access token here
            },
            message: "User logged in successfully"
        });
});

const logoutUser = asyncHandler(async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } }, { new: true });

        const options = {
            httpOnly: true,
            secure: true,
            // Add more cookie options as needed
        };

        res.clearCookie("accessToken", options);
        res.clearCookie("refreshToken", options);

        res.status(200).json(new ApiResponse(200, {}, "User logged out"));
    } catch (error) {
        console.error("Error logging out:", error);
        throw new ApiError(500, "Error logging out");
    }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user || incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Invalid refresh token");
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: true,
            // Add more cookie options as needed
        };

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access Token refreshed"));
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;

    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const getAllLocationPhotos = asyncHandler(async (req, res) => {
    const places = await Place.find();
    return res.status(200).json(new ApiResponse(200, places, "All location photos fetched successfully"));
});

const getAddedLocations = asyncHandler(async (req, res) => {
    const locations = await Place.find();
    return res.status(200).json(new ApiResponse(200, locations, "All locations fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullname, email } = req.body;

    if (!fullname || !email) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { fullname, email: email } },
        { new: true }
    ).select("-password");

    return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
});

const addLocationForm = asyncHandler(async (req, res) => {
    const { title, address, description, extraInfo, checkIn, checkOut, maxGuests, perks, photos, price } = req.body;

    if ([title, address, description, checkIn, checkOut, maxGuests].some(field => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    if (!photos || photos.length === 0) {
        throw new ApiError(400, "Photos for location missing.");
    }

    const newLocation = await Place.create({
        title,
        address,
        description,
        photos,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        perks,
        price
    });

    return res.status(200).json(new ApiResponse(200, newLocation, "Location created successfully"));
});

const singleLocation = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const singlePlace = await Place.findById(id);
        
        if (!singlePlace) {
            throw new ApiError(404, "Place not found");
        }
        
        return res.status(200).json(new ApiResponse(200, singlePlace, "Place found"));
    } catch (error) {
        console.error('Error in singleLocation controller:', error);
        throw new ApiError(500, "Internal server error");
    }
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    getAllLocationPhotos,
    getAddedLocations,
    updateAccountDetails,
    addLocationForm,
    singleLocation
};
