const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product.js');

router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});

        res.status(200).json(products);
    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching products.' });
    }
});
router.post('/', async (req, res) => {
    const newProductData = req.body;

    try {

        const createdProduct = await Product.create(newProductData);

        res.status(201).json(createdProduct);
    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'An error occurred while creating the product.' });
    }
});

module.exports = router;