const express = require('express');
const app = express();
const port = 5000;
// morgan check log
const morgan = require('morgan');
// index.js in router
const indexRouter = require('./routes');
// cookie-parser 미들웨어는 요청에 추가된 쿠키를 req.cookies 객체로 만들어 줍니다
const cookieParser = require('cookie-parser');

app.use(cookieParser()); // cookie-parser
// 클라이언트로 부터 받은 http 요청 메시지 형식에서 body데이터를 해석하기 위함
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(morgan('combined')); // 배포모드
app.use(morgan('dev')); // 개발모드

app.use('/', indexRouter);

app.listen(port, () => {
  console.log(port, 'port start!!');
});
