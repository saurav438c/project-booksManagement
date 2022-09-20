const express = require('express');
const route = require('./route/routes.js');
const { default: mongoose } = require('mongoose');
const app = express();
app.use(express.json());

mongoose.connect("mongodb+srv://sonupk:1HivF6DXHWanVcYu@cluster0.vtjazgb.mongodb.net/group20Database", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


app.use('/', route)


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
