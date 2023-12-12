const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
    medicineName: String,
    amount: String,
    duration: String,
    frequency: String,
});

const treatmentSchema = new mongoose.Schema({
    treatmentName: String,
    medications: [medicationSchema],
});

const userProfileSchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    treatments: [treatmentSchema],
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;