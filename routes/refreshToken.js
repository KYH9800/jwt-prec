const express = require('express');
const router = express.Router();
// jsonwebtoken
const jwt = require('jsonwebtoken');
// SECRET_KEY
const SECRET_KEY = `sksgur3217`;

let tokenObj = {}; // Refresh Token을 저장할 Object
console.log('tokenObj: ', tokenObj);

// Access Token을 생성
function createAccessToken(id) {
  console.log('id: ', id);
  const accessToken = jwt.sign(
    { id: id }, // JWT DATA
    SECRET_KEY, // 비밀키
    { expiresIn: '10s' } // Access Token이 10초 뒤에 만료되도록 설정합니다.
  );

  return accessToken;
}

// Refresh Token을 생성
function createRefreshToken() {
  const refreshToken = jwt.sign(
    {}, // JWT DATA
    SECRET_KEY,
    { expiresIn: '7d' } // Refresh Token이 7일 뒤에 만료되도록 설정
  );

  return refreshToken;
}

// Refresh Token과 Access Token을 발급하는 API를 만듭니다.
router.get('/set-token/:id', (req, res) => {
  const id = req.params.id;
  const accessToken = createAccessToken(id);
  const refreshToken = createRefreshToken();

  tokenObj[refreshToken] = id; // Refresh Token을 가지고 해당 유저의 정보를 서버에 저장합니다.
  res.cookie('accessToken', accessToken); // Access Token을 Cookie에 전달
  res.cookie('refreshToken', refreshToken); // Refresh Token을 Cookie에 전달

  return res.status(200).send({ msg: 'Token이 정상적으로 발급되었습니다.' });
});

// Access Token을 검증합니다.
function validateAccessToken(accessToken) {
  try {
    jwt.verify(accessToken, SECRET_KEY); // JWT를 검증합니다.
    return true;
  } catch (error) {
    return false;
  }
}

// Refresh Token을 검증합니다.
function validateRefreshToken(refreshToken) {
  try {
    jwt.verify(refreshToken, SECRET_KEY); // JWT를 검증합니다.
    return true;
  } catch (error) {
    return false;
  }
}

// Access Token의 Payload를 가져옵니다.
function getAccessTokenPayload(accessToken) {
  try {
    const payload = jwt.verify(accessToken, SECRET_KEY); // JWT에서 Payload를 가져옵니다.
    return payload;
  } catch (error) {
    return null;
  }
}

// Refresh Token과 Access Token을 검증하는 API를 만들어봅니다.
router.get('/get-token', (req, res) => {
  const accessToken = req.cookies.accessToken;
  console.log('accessToken: ', accessToken);

  const refreshToken = req.cookies.refreshToken;
  console.log('refreshToken: ', refreshToken);

  if (!refreshToken) return res.status(400).json({ message: 'Refresh Token이 존재하지 않습니다.' });
  if (!accessToken) return res.status(400).json({ message: 'Access Token이 존재하지 않습니다.' });

  const isAccessTokenValidate = validateAccessToken(accessToken);
  console.log('isAccessTokenValidate: ', isAccessTokenValidate);

  const isRefreshTokenValidate = validateRefreshToken(refreshToken);
  console.log('isRefreshTokenValidate: ', isRefreshTokenValidate);

  if (!isRefreshTokenValidate) return res.status(419).json({ message: 'Refresh Token이 만료되었습니다.' });

  if (!isAccessTokenValidate) {
    const accessTokenId = tokenObj[refreshToken];
    console.log('accessTokenId: ', accessTokenId);
    if (!accessTokenId) return res.status(419).json({ message: 'Refresh Token의 정보가 서버에 존재하지 않습니다.' });

    const newAccessToken = createAccessToken(accessTokenId);
    console.log('newAccessToken: ', newAccessToken);

    res.cookie('accessToken', newAccessToken);
    return res.json({ message: 'Access Token을 새롭게 발급하였습니다.' });
  }

  const { id } = getAccessTokenPayload(accessToken);
  return res.json({ message: `${id}의 Payload를 가진 Token이 성공적으로 인증되었습니다.` });
});

module.exports = router;

/*
`createAccessToken`는 **Access Token**을 생성하는 함수에요!
jwt 안에는 `set-token` API를 호출할 때 받은 `id` 변수를 삽입하는데요, 해당 사용자의 id가 무엇인지 확인할 때에는 Access Token에 있는 데이터를 바탕으로 인증을 진행합니다!

`createRefreshToken`는 **Refresh Token**을 생성하는 함수에요!
jwt 안에는 아무런 데이터가 존재하지 않는데요, 해당하는 Refresh Token에 대한 정보는 서버에서 `tokenObject`라는 변수안에 할당하게 됩니다. 
만약 서버에서 해당하는 Refresh Token에 대한 정보를 가지고 있지 않으면, Token의 인증은 실패하게 되겠죠?

사용자가 `GET` `/set-token/:id` API를 호출했을때 Access Token과 Refresh Token을 2개 발급하게 되고, Refresh Token을 Key 값으로 입력된 id를 찾을 수 있게 구현하였습니다.

그리고 `accessToken`, `refreshToken`이라는 **Key**로 Cookie를 2개 발급하게 됩니다.
*/
