const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const protect = async (req, res, next) =>{

    let token;

        //Token a loginból/regisztrációból
    //console.log(req.cookies.token);


    //req.headers.authorization && req.headers.authorization.startsWith('Bearer') ||
    if( req.cookies.token){

        try {
            if(req.cookies.token){
                token = req.cookies.token;
            }
            // else{
            //     token.req.headers.authorization.split(' ')[1];
            // }


            const unameFromtoken = jwt.verify(token, process.env.JWT_SECRET);
                
                //az "unameFromtoken" tartalmazza a bejelentkezett felhasználónak az ID-ját, amit alul felhasználunk arra, hogy az authentikáció végbemenjen
            //console.log(unameFromtoken);

            req.user = await prisma.users.findFirst({
                where:{
                    id: unameFromtoken.id
                }
            });
            next();
            
        } catch (error) {
            return res.status(401).json({message:error.message});
        }


    }
    if(!token){

            //Böngészős tesztelés:
                //Vedd ki a kommenteket az alul lévő süti hozzáadásról, majd:
                    //ThunderClient-ben loginolj be egy felhasználóval (usr_name és paswrd kell), a tokent másold a vágólapra, majd
                        //     a) nyiss egy böngészőt, írd be a '.../auth' végpontot a keresőbe, majd a tárolóban illeszd be a 'token' nevű sütibe a tokent, refresh-elj, és megkapod a felhasználó adatait JSON formátumban, ami kell majd frontendhez
                        //vagy b) a tokent illeszd be a 'token' értékeként (a macskakörmök közé), és refreshelj kétszer

        // res.cookie('token', "", {
        //     secure: true,
        //     httpOnly: true,
        //     sameSite: 'none',
        //     maxAge: 360000});

        return res.status(401).json({message: "Be kell jelentkezni!"});đ
    }



}


module.exports = {protect};