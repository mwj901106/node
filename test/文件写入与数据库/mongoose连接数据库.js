
let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/demo',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('open',function (err) {
    if (err){
        console.log("数据库连接失败",err)
    } else {
        console.log('数据库连接成功')
        console.log('操作数据库')
    }
})