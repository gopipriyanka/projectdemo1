const express = require('express');
const Organization = require('../models/organizationModel'); // Assuming you have an Organization model
 
const router = express.Router();
 
// Create a new organization
router.post('/organizations', async (req, res) => {
    console.log('Received request body:', req.body);
   
    const { organizationName, organizationDetails, contactNo, organizationEmail, paymentMethod } = req.body;
 
    const organization = new Organization({
        organizationName,
        organizationDetails,
        contactNo,
        organizationEmail,
        paymentMethod
    });
 
    try {
        const savedOrganization = await organization.save();
        res.status(201).json(savedOrganization);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
 
// Retrieve all organizations
router.get('/organizations', async (req, res) => {
    try {
        const organizations = await Organization.find(); // Fetch all organizations from the database
        res.status(200).json(organizations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
 
module.exports = router;