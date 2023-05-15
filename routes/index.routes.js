const express = require('express');
const router = express.Router();

const User = require('../models/User.model');

/* GET home page */
router.get('/', (req, res, next) => {
  const currentUser = req.session.currentUser;
  res.render('index', { currentUser });
});

module.exports = router;
