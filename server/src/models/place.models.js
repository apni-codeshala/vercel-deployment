import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    photos: [{
        type: String,
        required: true,
    }],
    description: {
        type: String,
        required: true,
    },
    perks: {
        wifi: { type: Boolean, default: false },
        freeParking: { type: Boolean, default: false },
        metroPosition: { type: Boolean, default: false },
        laundryServices: { type: Boolean, default: false },
        tv: { type: Boolean, default: false },
        pets: { type: Boolean, default: false },
    },
    extraInfo: {
        type: String,
    },
    checkIn: {
        type: Number,
    },
    checkOut: {
        type: Number,
    },
    maxGuests: {
        type: Number,
    },
    price: {
        type: Number,
    }
}, { timestamps: true });

export const Place = mongoose.model('Place', placeSchema);
