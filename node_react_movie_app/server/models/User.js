const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10 //salt가 몇글자인지 나타냄
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String, 
        maxlength: 50        
    },
    email: {
        type: String,
        trim: true, //빈칸 없애주는 역할
        unique: 1
    },
    password: {
        type: String,
        minlength:5
    },
    lastname: {
        type: String,
        maxlength:50
    },
    role: {
        type: Number,
        default:0
    },
    image: String,
    token: {
        type:String
    },
    tokenExp: {
        type:Number
    }    
})

userSchema.pre('save', function(next) {//mongoose에서 가져온 메소드. user정보를 저장하기 전에 function 내용을 한다
    var user = this;
    
    //비밀번호를 암호화시킬 것
    if(user.isModified('password')){ //userSchema가 save될때마다 실행되는 게 아니라 password가 변경될 때 실행
        bcrypt.genSalt(saltRounds, function(err, salt){
            //bcrypt에서 salt를 만듦(genSalt). 에러나면 err, 성공하면 salt 실행
            if(err) return next(err) //에러나면 다음 err (index.js에서 register route에서 if(err) 부분) 실행
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password=hash //성공하면 user의 password를 hash(암호화)된 패스워드로 바꿈.
                next()
            })
        })
    } else { //다른 거 바꿀 땐 그냥 next 해줘야 빠져나올 수 있음
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cd) {
    //plainPassword (1234567)와 db에 있는 암호화된 비밀번호가 같은지 체크. 
    //복호화 불가능해서 plain을 암호화한 후 암호화 결과가 같은지 비교함
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err),  //cb는 콜백
        cb(null, isMatch) //암호화 결과 같으면 에러는 없고 isMatch(비밀번호는 같다) 리턴
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;

    //jsonwebtoken을 이용해 token 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    // user._id와 'secretToken' 합쳐 token 생성
    //'secretToken' 넣으면 user._id 나옴
    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;
    //user._id + '' = token
    //token을 decode한다
    jwt.verify(token, 'secretToken', function (err, decoded) {
        //유저아이디를 이용해 유저를 찾은 다음
        //클라이언트에서 가져온 토큰과 db에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id":decoded, "token":token}, function(err, user) {
            //findOne은 몽고db에 이미 있는 메소드임
            if(err) return cb(err);
            cb(null, user)
        })
    })    
}



const User = mongoose.model('User', userSchema)  //모델로 스키마 감싸줌

module.exports={User} // 다른 파일에서도 쓸 수 있도록 export 해줌