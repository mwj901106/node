//引入express
const express = require('express')
//创建app对象
const app = express();
//禁止服务器返回X-powered-by
app.disable('x-powered-by')
app.use(express.static(__dirname+'/public'))
const userModel = require('./model/usersModel')
const db = require('./db/db')
app.use(express.urlencoded({extend:true}))
db(()=>{
    app.get('./login',(req,res)=>{
        res.sendFile(__dirname+'/public/login.html')
    })
    app.get('./register',(req,res)=>{
        res.sendFile(__dirname+'./public/register.html')
    })
    app.post('./register',(req,res)=>{
        const {email,nick_name,password,re_password} = req.body
        
        const emailReg = /^[a-zA-Z0-9_]{4,20}@[a-zA-Z0-9]{2,10}\.com$/
        const nickNameReg = /[\u4e00-\u9fa5]/gm
        const passwordReg = /^[a-zA-Z0-9_@#.+&]{6,20}$/
        
        if(!emailReg.test(email)){
            res.send('邮箱格式不合法,用户名必须4-20位,诸巨明必须2-10位')
        }else if(!nickNameReg.test(nick_name)){
            res.send('昵称格式不合法,必须为中文')
        }else if (!passwordReg.test(password)){
            res.send('密码格式不合法,必须为6-20位')
        } else {
            userModel.findOne({email},function (err,data) {
                if (data){
                    console.log(`邮箱为${email}的用户注册失败,因为邮箱重复`)
                    res.send('该邮箱已被注册,请更换邮箱')
                } else {
                    userModel.create({email,nick_name,password,re_password},function (err) {
                        if(!err){
                            console.log(`邮箱为${email}的用户注册成功`)
                            res.send('注册成功')
                        }else {
                            console.log(err)
                            res.send('您当前的网络状态不稳定,请稍后再试')
                        }
                    })
                }
            })
        }
    })
})

app.post('/login',(req,res)=> {
    //1.获取输入
    const {email, password} = req.body
    //2.准备正则
    const emailReg = /^[a-zA-Z0-9_]{4,20}@[a-zA-Z0-9]{2,10}\.com$/
    const passwordReg = /^[a-zA-Z0-9_@#.+&]{6,20}$/
    if (!emailReg.test(email)) {
        res.send('邮箱格式不合法，用户名必须4-20位，主机名必须2-10位')
    } else if (!passwordReg.test(password)) {
        res.send('密码格式不合法，必须6-20')
    } else {
        //3.去数据库中查找：
        usersModel.findOne({email, password}, (err, data) => {
            if (err) {
                //引入报警模块，当达到敏感阈值，触发报警。
                console.log(err)
                res.send('网络不稳定，稍后重试')
                return
            }
            if (data) {
                res.redirect('https://wwww.baidu.com')
                return
            }
            res.send('用户名或密码输入错误！')
        })
    }


    app.listen(3000, (err) => {
        if (!err) console.log('服务器启动成功')
        else console.log(err)
    })
},(err)=>{
    console.log('数据库连接失败',err)
})
