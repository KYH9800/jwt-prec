const express = require('express');
const router = express.Router();
// router
const jwt_router = require('./jwt');
const refreshToken_router = require('./refreshToken');
const jwt_quiz_router = require('./jwt_quiz');

router.get('/', (req, res) => {
  res.send('hello JWT!!');
});

router.use('/login', jwt_router);
router.use('/api', refreshToken_router);
router.use('/api', jwt_quiz_router);

module.exports = router;
