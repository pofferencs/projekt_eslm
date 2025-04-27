import { useLocation, useNavigate, useParams } from "react-router-dom"
import Logo from "../../assets/logo.png";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";

function UserPassReset() {

    const {isAuthenticated} = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    

    const [tokenEmail, setTokenEmail] = useState("");
    

    useEffect(()=>{

        if(isAuthenticated){
            navigate('/');
        }

        if(!token == ""){
            setTokenEmail(token);
        }
        

        console.log(token)

    });


    const kuldes = (formData, method) => {
        
        console.log(formData)
          
          
      };
    
      const onSubmit = (e) => {
        e.preventDefault();
        kuldes(formData, "POST");
      };
    
      let formObj = {
        email: ""

      };
    
      const [formData, setFormData] = useState(formObj);
    
      const writeData = (e) => {
        const { id, value } = e.target;

        setFormData((prevState)=>({...prevState, email: value}))


      };



  return (

    <section className="bg-gray-900 min-h-screen flex flex-col items-center px-6 py-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-20 w-auto" src={Logo} alt="Logo" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-indigo-700">
            Elfelejtett jelszó
          </h2>
        </div>
        {
            (tokenEmail == "") ? (
                <div className="w-full rounded-lg shadow-lg md:mt-6 sm:max-w-2xl xl:p-0 bg-gray-800 dark:border-gray-700">
        <button className="btn mt-4 ml-4 bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={()=>{navigate('/login')}}>
            <img src="https://www.svgrepo.com/show/500472/back.svg" className="h-5"/>
        </button>
        <div className="p-8 md:p-10">
            <h2 className="text-2xl text-center font-bold">Kérjük, add meg az e-mail címedet!</h2>
            <p className="text-center font-bold">A megerősítő link 15 percig lesz érvényes.</p>

        <div className="mt-1 sm:mx-auto sm:w-full sm:max-w-sm" >
            <form onSubmit={onSubmit}
              className="space-y-6 flex flex-col items-center"
              action="#"
              method="POST">

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <label
                  htmlFor="email"
                  className="block text-sm/7 font-medium text-white"
                >
                    E-mail cím
                </label>

                <div className="mt-2">
                  <input
                    type="text"
                    name="email"
                    id="email"
                    autoComplete="email"
                    required
                    value={
                      formData.email_address
                    }
                    onChange={writeData}
                    className="block w-full h-12 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

                <button
                  type="submit"
                  className="btn w-full rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Küldés
                </button>
                
            </form>
            </div>

        </div>
        </div>
            ) : (
                <p>ha a token jó, és be van írva fent az url-ben, akkor itt megfelelő elemek fognak megjelenni</p>
            )
        }
          

          
        
      </section>
  )
}

export default UserPassReset