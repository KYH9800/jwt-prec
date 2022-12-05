const express = require('express');
const router = express.Router();
// jsonwebtoken
const jwt = require('jsonwebtoken');

// 데이터를 암호화
const token = jwt.sign(
  { myPayloadData: 1234 }, // jwt를 이용해서 payload를 설정하는 부분
  'mysecretkey', // jwt를 이용해서 암호화를 하기 위한 비밀키
  {
    expiresIn: new Date().getSeconds() + 1,
  }
);
// console.log('token: ', token);

// 복호화: 풀어서 해석
const decodedValue = jwt.decode(token); // jwt의 payload를 확인하기 위해서 사용한다
// console.log('decodedValue: ', decodedValue);

// 복호화가 아닌, 변조되지 않은 데이터인지 검증, 만약 변조된 코드라면 위의 코드에서 에러가 발생
const decodedValueByVerify = jwt.verify(
  token, //
  'mysecretkey'
);
// console.log('decodedValueByVerify: ', decodedValueByVerify);

router.get('/', (req, res) => {
  res.send('jwt-login router');
});

module.exports = router;
