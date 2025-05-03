import { useLocation, useNavigate, useParams } from "react-router-dom"
import Logo from "../../assets/logo.png";
import { useContext, useEffect, useState } from "react";
import OrganizerContext from "../../context/OrganizerContext";
import { toast } from "react-toastify";


function OrganizerEmailVerify() {

    const {isAuthenticated} = useContext(OrganizerContext);
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    
    const [isLoading, setIsLoading] = useState(true);
    const [tokenVerified, setTokenVerified] = useState(false);
    const [tokenMessage, setTokenMessage] = useState("");


    useEffect(()=>{

        if(isAuthenticated){
            navigate('/');
        }

        

        if(!token == ""){

            fetch(`${import.meta.env.VITE_BASE_URL}/organizer/email-verify`,{
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    token: token
                }),
            }).then((res) => res.json())
                  .then((token) => {
                    if(token.verified==true) {
                        setTokenVerified(true);
                        setIsLoading(false);
                        setTokenMessage(token.message);
                    }else if(token.verified==false){
                        setTokenMessage(token.message)
                        setTokenVerified(false);
                        setIsLoading(false);
                    }
                  })
                  .catch((err) => alert(err));
          };
          setIsLoading(false);

          
        
    },[]);



  return (
    <>
    {
        (isLoading == true) ? (
            <p></p>
    
        ):(
            
            <section className="bg-zinc-900 min-h-screen flex flex-col items-center px-6 py-10">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img className="mx-auto h-20 w-auto" src={Logo} alt="Logo" />
                      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-indigo-700">
                        Fiók megerősítés
                      </h2>
                    </div>

                    <p className="mt-5">{tokenMessage}</p>
            </section>
        )
    }
    </>   
  )
}

export default OrganizerEmailVerify