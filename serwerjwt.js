const express = require('express');
const bcrypt = require('bcrypt');
const monogęś = require('mongoose');
const jwt = require('jsonwebtoken')
const { restart } = require('nodemon');
const res = require('express/lib/response');

const klucz = "przykladowyklucz";
const swiezyklucz = "przykladowyswiezyklucz";

//////////// DATABASE ///////////////////////////////

monogęś.connect("mongodb://127.0.0.1/users", {useNewUrlParser: true});
const baza = monogęś.connection;
baza.once('open', () => console.log('🦆👍'));
baza.on('error', (error) => console.log(error));

const userSchema = new monogęś.Schema({
    username: {
        type: String,
        required: true },

    password: {
        type: String,
        required: true },

    email: {
        type: String,
        required: false }
});
const tokenSchema = new monogęś.Schema({
    username: {
        type: String, 
        required: true
    },

    token:{
        type: String,
        required: true 
    }
});

const User = monogęś.model('users', userSchema);
const UserToken = monogęś.model('tokens', tokenSchema);


//////////// APP SVR ////////////////////////////////

const app = express();
app.use(express.json());
app.listen(2137);


//////////// ROUTES ////////////////////////////////

app.get('/users', async (req, res) => {
    const users = await User.find();
    try {
        res.json(users);
    }
    catch (err) {
        res.status(501).json({message: err.message});
    }
});

app.get('/user', auth, async (req, res) => {

    res.json(await User.findOne({username: req.user.username}));
});


app.post('/users', async (req, res) => {
    try {
        let nej = await User.countDocuments({username: req.body.username});

        if( nej == 0 )
        {
            let passwd = await bcrypt.hash(req.body.password, 10); 
            let nUser = new User ({username: req.body.username, 
                                  password: passwd,
                                  email: req.body.email });
            await nUser.save();
            res.status(201).json(nUser);
        }
        else{
            res.status(403).json({message: "nazwa użytkownika jest juz wykorzystana🐷"})
        }
        //users.push( {username: req.body.username, password: passwd} );
        //res.status(200).send();
    }
    catch {
        res.sendStatus(500);
    }
});
    
app.post('/login', async (req, res) => {
    try {
        const usr = await User.findOne({ username: req.body.username });
        if(usr == null)
            return res.sendStatus(400);
        
        if(await bcrypt.compare(req.body.password, usr.password))
        {
            const atoken = aToken(usr);
            const rtoken = jwt.sign({username: usr.username}, swiezyklucz);

            let usertoken = new UserToken({username: usr.username, token: rtoken});
            usertoken.save();

            return res.status(200).json({token: atoken, refresh: rtoken});
        }
        else
            return res.status(300).send("Złe hasło mordo");
    }
    catch (err) {
        console.log(err);
    }
});

app.post('/token', async (req, res) => {
    const rtoken = req.body.token;
    if(rtoken == null ) return res.status(403).send();

    if( (await UserToken.findOne({username: req.body.username,
                                token: rtoken})) == null) 
        return res.status(403).send();

    jwt.verify(rtoken, swiezyklucz, (err, user) => {
        if(err) return res.status(403).message(err);

        const atoken = aToken({username: req.body.username});
        res.status(200).json({token: atoken});
    });
});

app.delete('/logout', async (req, res) =>{
    try
    {
        await UserToken.deleteMany({username: req.body.username});
        return res.status(204).send();
    }
    catch(err)
    {
        console.log(err);
    }
    
})

//////////// FUNCTIONS ////////////////////////////////

function auth(req, res, next) 
{
    const token = req.headers['authorization'];
    if(token == null ) return res.status(401).send();

    jwt.verify(token, klucz, (err, user) => {
        if(err) return res.status(403).send();
        req.user = user;
        next();
    } )
}

function aToken(user)
{
    return jwt.sign({username: user.username}, klucz, {expiresIn: '25s'});
}
