const express=require('express');
const cors=require('cors');
const app=express();
require('dotenv').config();
const jwt = require('jsonwebtoken');
const https = require('https');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
    }
));
app.use(cookieParser())
app.use('/assets/pictures', express.static(path.join(__dirname, 'assets/pictures'))); //Ez a sor a statikus fájlok kirendelését segíti elő, hogy simán "localhost" eléréssel el tudjuk érni a fájlokat (lehet ez kép, gif, videó, bármi)
app.use('/list',require('./routes/listsRoutes'));
app.use('/update',require('./routes/updateRoutes'));

app.use('/user', require('./routes/userRoutes'));
app.use('/organizer', require('./routes/organizerRoutes'));

const options = {
    key: fs.readFileSync(path.join(__dirname)+"/config/ssl/cert.key"),
    cert: fs.readFileSync(path.join(__dirname)+"/config/ssl/cert.crt")
}

const server = https.createServer(options,app);

app.use('/insert',require('./routes/insertRoutes'));
app.use('/delete',require('./routes/deleteRoutes'));


server.listen(8000,()=>{console.log(`Fut a szerver\nhttps://localhost:8000/`)});

app.get('/',(req,res)=>{
    res.send("Esport adatbázisos Backend");
});