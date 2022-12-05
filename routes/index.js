const express = require('express');
const router = express.Router();
// router
const jwt_router = require('./jwt');

router.get('/', (req, res) => {
  res.send('hello JWT!!');
});

router.use('/login', jwt_router);

module.exports = router;
