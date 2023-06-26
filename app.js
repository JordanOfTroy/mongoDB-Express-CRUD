const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 8080;
const db = mongoose.connection;
const {Schema} = mongoose

//Schema example https://mongoosejs.com/docs/guide.html
const userSchema = new Schema({
    name: String,
    role: String,
    age: {type: Number, min: 18, max: 70},
    createdDate: {type: Date, default: Date.now}
})

const user = mongoose.model('user', userSchema)
//NOTE: Mongoose will pluralize collection name (e.g. users)
//Const collectionName = 'user';
//const user = mongoose.model('userCollection', userSchema, collectionName);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost/myFirstMDB', {useNewUrlParser: true}); // "myFirstMDB" is the db name
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
   console.log('db connected');
});


app.post('/newUser', async (req, res) => {
    console.log(`POST /newUser: ${JSON.stringify(req.body)}`);
    const newUser = new user();
    newUser.name = req.body.name;
    newUser.role = req.body.role;
    newUser.age = req.body.age
    try {
        let aUser = await newUser.save();
        console.log(`new user save: ${aUser}`);
        res.send(`done ${aUser}`);
    } catch (err) {
        console.error(err);
        res.send(`error: ${err}`);
    }
 });


app.listen(port, (err) => {
   if (err) console.log(err);
   console.log(`App Server listen on port: ${port}`);
});

// test this with`curl --data "name=Peter&role=Student&age=30" http://localhost:8080/newUser`

