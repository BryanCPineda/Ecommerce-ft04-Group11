const { Router } = require('express');
const { Product } = require('../db.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


// import all routers;
const productRouter = require('./product.js');
const categoriesRouter = require('./categories.js');

const router = Router();

// load each router on a route
// i.e: router.use('/auth', authRouter);
// router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/categories', categoriesRouter);




module.exports = router;
