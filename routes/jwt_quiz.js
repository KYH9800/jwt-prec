const { response } = require('express');
const express = require('express');
const router = express.Router();
// jsonwebtoken
const jwt = require('jsonwebtoken');
// SECRET_KEY
const SECRET_KEY = 'sksgur3217';

router.post('/set-key', (req, res, next) => {
  try {
    const { key } = req.body;
    console.log('key: ', key);
    const token = jwt.sign({ key }, SECRET_KEY);
    res.cookie('token', token);
    console.log('set-token: ', token);

    return res.status(200).end();
  } catch (error) {
    console.error(error);
  }
});

router.get('/get-key', (req, res) => {
  try {
    const { token } = req.cookies;
    console.log('get-token: ', token);
    const key = jwt.decode(token);
    console.log('key: ', key);

    return res.status(200).json({
      msg: key,
    });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
