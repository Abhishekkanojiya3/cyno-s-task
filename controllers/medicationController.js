const Medication = require('../models/medication');

async function getAllMedications(req, res) {
    try {
        const medications = await Medication.find();
        return res.status(200).json({ medications });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getRunningMedications(req, res) {
    try {
        const runningMedications = await Medication.find({ endDate: { $gt: new Date() } });
        return res.status(200).json({ runningMedications });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function addMedication(req, res) {
    const { medicineName, medicineAmount, duration, frequency } = req.body;

    try {
        const newMedication = new Medication({
            medicineName,
            medicineAmount,
            startDate: new Date(),
            endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
            frequency,
        });

        await newMedication.save();

        return res.status(201).json({ message: 'Medication added successfully', newMedication });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function stopMedication(req, res) {
    const { medicationId } = req.params;

    try {
        const medication = await Medication.findByIdAndUpdate(
            medicationId, { endDate: new Date() }, { new: true }
        );

        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }

        return res.status(200).json({ message: 'Medication stopped successfully', stoppedMedication: medication });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { getAllMedications, getRunningMedications, addMedication, stopMedication };