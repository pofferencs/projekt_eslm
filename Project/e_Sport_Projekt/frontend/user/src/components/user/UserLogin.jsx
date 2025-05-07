import { useState, useContext, useEffect } from "react";
import UserContext from "../../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { toast } from "react-toastify";

function UserLogin() {
  const navigate = useNavigate();
  const { isAuthenticated, authStatus, login } = useContext(UserContext);
  const [showPass, isShowPass] = useState(false);
  const [type, setType] = useState('password');

  const showHidePass = ()=>{
    isShowPass(prev=> !prev);
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  });

  const onSubmit = (e) => {
    e.preventDefault();
    // console.log({username_kerdojel: formDataUsername.usr_name == "", email_kerdojel: formDataEmail.email_address == ""})

    let userUres = formDataUsername.usr_name == "";
    let emailUres = formDataEmail.email_address == "";

    if(userUres){
      login(formDataEmail, "POST");
      if(isAuthenticated){
        toast.success('Sikeres belépés!');
        
      
      }
    }else if(emailUres){
        login(formDataUsername, "POST");
      if(isAuthenticated){
        toast.success('Sikeres belépés!');
      }
    }
    
  };
  let formObjUsername = {
    usr_name: "",
    paswrd: "",
  };

  let formObjEmail = {
    email_address: "",
    paswrd: "",
  };

  const [formDataEmail, setFormDataEmail] = useState(formObjEmail);
  const [formDataUsername, setFormDataUsername] = useState(formObjUsername);

  const writeData = (e) => {
    const { id, value } = e.target;
    // console.log(formDataEmail);
    // console.log(formDataUsername);
  
    if (id === "email_or_username") {
      if (value.includes("@")) {
        setFormDataEmail((prevState) => ({
          ...prevState,
          email_address: value,
        }));
        setFormDataUsername((prevState) => ({
          ...prevState,
          usr_name: "",
        }));
      } else {
        setFormDataUsername((prevState) => ({
          ...prevState,
          usr_name: value,
        }));
        setFormDataEmail((prevState) => ({
          ...prevState,
          email_address: "",
        }));
      }
    }
  
    if (id === "password") {
      setFormDataEmail((prevState) => ({ ...prevState, paswrd: value }));
      setFormDataUsername((prevState) => ({ ...prevState, paswrd: value }));
    }
  };

  return (
    
      <section className="bg-gray-900 min-h-screen flex flex-col items-center px-6 py-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-20 w-auto" src={Logo} alt="Logo" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-indigo-700">
            Bejelentkezés
          </h2>
        </div>
        <div className="w-full rounded-lg shadow-lg md:mt-6 sm:max-w-2xl p-6 bg-gray-800 dark:border-gray-700">
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form
              onSubmit={onSubmit}
              className="space-y-6"
              action="#"
              method="POST"
            >
              <div>
                <label
                  htmlFor="email_or_username"
                  className="block text-sm/7 font-medium text-white"
                >
                  E-mail cím vagy felhasználónév
                </label>

                <div className="mt-2">
                  <input
                    type="text"
                    name="email_or_username"
                    id="email_or_username"
                    autoComplete="email_or_username"
                    required
                    value={
                      formDataEmail.email_address || formDataUsername.usr_name
                    }
                    onChange={writeData}
                    className="block w-full h-12 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm/6 font-medium text-white"
                  >
                    Jelszó
                  </label>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-amber-600 hover:text-amber-400"
                    >
                      <Link to={'/password-reset'}>
                      Elfelejtett jelszó
                      </Link>
                    </a>
                  </div>
                </div>
                <div className="mt-2 flex flex-row">
                  <input
                    type={type}
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    required
                    value={formDataUsername.paswrd && formDataEmail.paswrd}
                    onChange={writeData}
                    className="block w-full h-12 border rounded-r-none border-r-0 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  {
                    (!showPass) ? (
                      <button className="btn border border-l-0 bg-gray-700 border-gray-600 hover:bg-gray-500 active:bg-gray-400 rounded-l-none" type="button" onClick={()=>{showHidePass(); setType('text')}}><img className="w-5" src="https://www.svgrepo.com/show/522528/eye.svg"/></button>
                    ):
                    (
                      <button className="btn border border-l-0 bg-gray-700 border-gray-600 hover:bg-gray-500 active:bg-gray-400 rounded-l-none" type="button" onClick={()=>{showHidePass(); setType('password')}}><img className="w-5" src="https://www.svgrepo.com/show/522530/eye-off.svg"/></button>
                    )
                  }
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="btn w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Bejelentkezés
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm/6 text-gray-400 font-bold">
              Nincs még fiókod?
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                {" "}
                Regisztráció
              </Link>
            </p>
          </div>
        </div>

      </section>
  );
}

export default UserLogin;
