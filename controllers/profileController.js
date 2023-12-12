const UserProfile = require('../models/userProfile');

async function getUserProfile(req, res) {
    try {

        const userProfile = await UserProfile.findOne({ userId: req.user._id });

        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        return res.status(200).json({ userProfile });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function addTreatment(req, res) {
    const { medicineName, medicineAmount, duration, frequency } = req.body;

    try {

        const userProfile = await UserProfile.findOne({ userId: req.user._id });

        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        userProfile.treatments.push({
            medicineName,
            medicineAmount,
            duration,
            frequency,
        });

        await userProfile.save();

        return res.status(201).json({ message: 'Treatment added successfully', userProfile });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function updateTreatment(req, res) {
    const { treatmentId } = req.params;
    const { medicineName, medicineAmount, duration, frequency } = req.body;

    try {
        const userProfile = await UserProfile.findOne({ userId: req.user._id });

        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        const treatment = userProfile.treatments.id(treatmentId);
        if (!treatment) {
            return res.status(404).json({ message: 'Treatment not found' });
        }

        treatment.medicineName = medicineName;
        treatment.medicineAmount = medicineAmount;
        treatment.duration = duration;
        treatment.frequency = frequency;

        await userProfile.save();

        return res.status(200).json({ message: 'Treatment updated successfully', userProfile });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function deleteTreatment(req, res) {
    const { treatmentId } = req.params;

    try {
        const userProfile = await UserProfile.findOne({ userId: req.user._id });

        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }


        userProfile.treatments.id(treatmentId).remove();

        await userProfile.save();

        return res.status(200).json({ message: 'Treatment deleted successfully', userProfile });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { getUserProfile, addTreatment, updateTreatment, deleteTreatment };