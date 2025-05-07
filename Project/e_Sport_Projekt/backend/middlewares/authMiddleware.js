const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const protectUser = async (req, res, next) =>{

    let tokenU;

        //Token a loginból/regisztrációból
    //console.log(req.cookies.tokenU);
    // console.log(req.cookies)

    //req.headers.authorization && req.headers.authorization.startsWith('Bearer') ||
    if( req.cookies.tokenU){
        

        try {
            if(req.cookies.tokenU){
                tokenU = req.cookies.tokenU;
            }
            // else{
            //     token.req.headers.authorization.split(' ')[1];
            // }


            const unameFromtoken = jwt.verify(tokenU, process.env.JWT_SECRET);
                
                //az "unameFromtoken" tartalmazza a bejelentkezett felhasználónak az ID-ját, amit alul felhasználunk arra, hogy az authentikáció végbemenjen
            //console.log(unameFromtoken);

            req.user = await prisma.users.findFirst({
                where:{
                    id: unameFromtoken.id
                }, select:{
                    id: true,
                    inviteable: true,
                    full_name: true,
                    usr_name: true,
                    date_of_birth: true,
                    school: true,
                    clss: true,
                    status: true,
                    email_address: true,
                    phone_num: true,
                    om_identifier: true,
                    discord_name: true,
                    usna_mod_num_remain: true,
                    usna_last_mod_date: true,
                    email_last_mod_date: true
                }
            });
            next();
            
        } catch (error) {
            res.clearCookie('tokenU');
            return res.status(401).json({message:error.message});
        }


    }
    if(!tokenU){

        return res.status(401).json({message: "Be kell jelentkezni!"});
    }
}

const protectOgr = async (req, res, next) =>{

    let tokenO;

        //Token a loginból/regisztrációból
    //console.log(req.cookies.token);


    //req.headers.authorization && req.headers.authorization.startsWith('Bearer') ||
    if( req.cookies.tokenO){

        try {
            if(req.cookies.tokenO){
                tokenO = req.cookies.tokenO;
            }
            // else{
            //     token.req.headers.authorization.split(' ')[1];
            // }


            const unameFromtoken = jwt.verify(tokenO, process.env.JWT_SECRET);
                
                //az "unameFromtoken" tartalmazza a bejelentkezett felhasználónak az ID-ját, amit alul felhasználunk arra, hogy az authentikáció végbemenjen
            //console.log(unameFromtoken);

            req.organizer = await prisma.organizers.findFirst({
                where:{
                    id: unameFromtoken.id
                }, select:{
                    id: true,
                    full_name: true,
                    usr_name: true,
                    date_of_birth: true,
                    school: true,
                    status: true,
                    email_address: true,
                    phone_num: true,
                    om_identifier: true,
                    usna_mod_num_remain: true,
                    usna_last_mod_date: true,
                    email_last_mod_date: true

                }
            });
            next();
            
        } catch (error) {
            return res.status(401).json({message:error.message});
        }


    }
    if(!tokenO){

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

        return res.status(401).json({message: "Be kell jelentkezni!"});
    }
}


module.exports = {protectUser, protectOgr};