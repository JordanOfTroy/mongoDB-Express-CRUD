const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 8080;
const db = mongoose.connection;
const {Schema} = mongoose
const connectionString = process.env.CONNECTION_STRING || 'mongodb://localhost/myFirstMDB'

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
app.use(express.static('public'))

mongoose.connect(connectionString); // "myFirstMDB" is the db name
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
   console.log(`db connected on: ${connectionString}`);
});

//CREATE
// test this with` curl --data "name=Peter&role=Student&age=30" http://localhost:8080/newUser '
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
        res.send(`Oops! Create Error: ${err}`);
    }
 });

 //READ
 // test this with` curl http://localhost:8080/user/Jordan '
 app.get('/user/:name', async (req, res) => {
    console.log(`GET /user/:name: ${JSON.stringify(req.params)}`);
    let userName = req.params.name;
    try {
        let foundUser = await user.findOne({ name: userName });
        console.log(`found user: ${foundUser}`)
        res.send(`username: ${foundUser.name} - userAge: ${foundUser.age}`)
    } catch (err) {
        console.log(`Oops! Read Error: ${err}`)
        res.send(`error:${err}`)
    }
 });
 

 //UPDATE
 // test using ' curl --data "name=Jordan&role=TA" http://localhost:8080/updateUserRole '
 app.post('/updateUserRole', async (req, res) => {
    console.log(`POST /updateUserRole: ${JSON.stringify(req.body)}`);
    let matchedName = req.body.name;
    let newrole = req.body.role;
    console.log(matchedName);
    try {
        let data = await user.findOneAndUpdate( {name: matchedName}, {role: newrole},
            { new: true }); //return the updated version instead of the pre-updated document
        let returnMsg = 'Not Found\n'
        if(data) {
            console.log(`data -- ${data.role}`)
            returnMsg = `user name : ${matchedName} New role : ${data.role}`;
            console.log(returnMsg);
        }
        res.send(returnMsg);

    } catch (err) {
        if (err) return console.log(`Oops! Update Error: ${err}`);
    }
 });

 //DELETE
 // test using ' curl --data "name=Peter" http://localhost:8080/removeUser '
 // You may need to add a user first.
 app.post('/removeUser', async (req, res) => {
    console.log(`POST /removeUser: ${JSON.stringify(req.body)}`);
    let matchedName = req.body.name;
    try {
        let userToDelete = await user.findOneAndDelete({ name: matchedName })
        let returnMsg = `user name : ${matchedName} has been removed`
        console.log(returnMsg);
        res.send(returnMsg);
    } catch (err) {
        console.log(`Oops! Delete Error: ${err}`)
    }
 });
 


app.listen(port, (err) => {
   if (err) console.log(err);
   console.log(`App Server listen on port: ${port}`);
});


