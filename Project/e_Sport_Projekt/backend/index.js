const express=require('express');
const cors=require('cors');
const app=express();
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.use('/data',require('./routes/userRoutes'));

app.listen(8000,()=>{console.log("Fut a szerver")});

app.get('/',(req,res)=>{
    res.send("Esport adatbázisos Backend");
});