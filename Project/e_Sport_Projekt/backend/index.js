const express=require('express');
const cors=require('cors');
const app=express();
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.use('/list',require('./routes/listsRoutes'));
app.use('/update',require('./routes/updateRoutes'));
app.use('/insert',require('./routes/insertRoutes'));
app.use('/delete',require('./routes/deleteRoutes'));

app.listen(8000,()=>{console.log("Fut a szerver")});

app.get('/',(req,res)=>{
    res.send("Esport adatbázisos Backend");
});