const express = require('express') //express 모듈 가져옴
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.use(bodyParser.urlencoded({extended:true}));
//application/x-www-form-urlencoded 가져옴

app.use(bodyParser.json());
//application/json 가져옴
app.use(cookieParser());


app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요! 반가워요!')
})

app.get('/api/hello', (req, res) => {
  res.send('Hello World!')
})

app.post('api/users/register', (req, res) => { //라우트에 엔드 포인트는 register. 
    //콜백펑션을 request, response
    //회원가입할 때 필요한 정보들을 client에서 가져오면 그것들을 DB에 넣어준다

    const user = new User(req.body)  //bodyParser을 이용해 req.body로 받아올 수 있는 것. 
    user.save((err, userInfo) => {
        if(err) return res.json({success:false, err}) //에러나면 success:false랑 에러메시지 
        return res.status(200).json({ //status 200은 성공한 것
            success:true
        })
    })
})

app.post('api/users/login', (req, res) => {
  //1. 데이터베이스에서 요청한 email 찾기:
  User.findOne({email:req.body.email}, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess:false, 
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    
    //2. 데이터베이스에서 요청한 email이 있다면 비밀번호가 같은지 확인:
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({loginSuccess: false, message:"비밀번호가 틀렸습니다."})
      
      //3. 비밀번호까지 같다면 token을 생성
      user.generateToken((err,user) => {
        if(err) return res.status(400).send(err); //status 400은 에러
        //토큰을 저장한다. 어디에? 쿠키, 로컬 스토리지... 근데 여기선 쿠키로 함
        //쿠키쓰려면 쿠키파서 깔아야함.
          res.cookie("x_auth", user.token) //쿠키에 유저 토큰이 x_auth라는 이름으로(아무이름이나 해도 상관x) 들어감
            .status(200) //성공
            .json({loginSuccess: true, userId:user._id})
      })
    } )
  })
})

app.get('api/users/auth', auth, (req, res) => {
  //미들웨어 auth는 auth.js의 let auth에서 가져옴.
  //여기까지 미들웨어를 통과해왔다는 얘기는 Authentication이 true라는 말.
  res.status(200).json({
    //유저 정보 전달
    _id:req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    //role이 0 : 일반유저. role이 0이 아님: 관리자
    //이건 무조건은 아님. 설정하기 나름.
    isAuth:true,
    email:req.user.email,
    name:req.user.name,
    lastname:req.user.lastname,
    role:req.user.role,
    image:req.user.image,    
  })
})

app.get('api/users/logout', auth, (req,res) => {
  //로그아웃하려는 거면 로그인돼있는 상태인 거니까 auth 미들웨어 넣어줌
  User.findOneAndUpdate({_id:req.user._id}, 
    {token:""}
    , (err, user) => {
      if(err) return res.json({success: false, err});
      return res.status(200).send({
        success:true
      })
    })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})