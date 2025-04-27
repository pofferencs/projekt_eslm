import { useState, useContext, useEffect } from "react";
import UserContext from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const { authStatus, login, isAuthenticated, pageRefresh } = useContext(UserContext);
  //const token = sessionStorage.getItem("tokenU");

    useEffect(() => {
      if (isAuthenticated) {
        navigate("/");
      }
    });

  const kuldes = (formData, method) => {
    fetch(`${import.meta.env.VITE_BASE_URL}/user/register`, {
      method: method,
      headers: { "Content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((token) => {
        if (!token.message) {
          
          toast.error(token.message)
        }else{
          navigate("/login");
          //sessionStorage.setItem("tokenU", token);
          toast.success("Sikeres regisztráció!");
          
        }
      })
      .catch((err) => alert(err));
      
      
  };

  const onSubmit = (e) => {
    e.preventDefault();
    kuldes(formData, "POST");
  };

  let formObj = {
    full_name: "", //megvan
    usr_name: "", //megvan
    paswrd: "", //megvan
    date_of_birth: "", //megvan
    school: "", //megvan
    clss: "", //megvan
    email_address: "", //megvan
    phone_num: "", // megvan
    om_identifier: "", //megvan
    discord_name: "", //megvan
  };

  const [formData, setFormData] = useState(formObj);

  const writeData = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <section className="bg-gray-900 min-h-screen flex flex-col justify-center items-center px-6 py-8">
      <div className="sm:w-full sm:max-w-md text-center">
        <img className="mx-auto h-20 w-auto" src={Logo} alt="Logo" />
        <h2 className="mt-6 text-3xl font-bold text-indigo-700">
          Regisztráció
        </h2>
      </div>
      <div className="w-full rounded-lg shadow-lg md:mt-6 sm:max-w-2xl xl:p-0 bg-gray-800 dark:border-gray-700">
        <div className="p-8 md:p-10">
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            onSubmit={onSubmit}
          >
            {[
              ["email_address", "Email cím", "email", "johndoe@taszi.hu"],
              ["paswrd", "Jelszó", "password", "••••••••"],
              ["usr_name", "Felhasználónév", "text", "johndoe"],
              ["full_name", "Teljes név", "text", "John Doe"],
              ["date_of_birth", "Születési dátum", "date", ""],
              ["school", "Iskola", "text", "Iskolád neve"],
              ["clss", "Osztály", "text", "10/D"],
              ["phone_num", "Telefonszám", "text", "+36701234567"],
              ["om_identifier", "OM azonosító", "text", "72312345678"],
              ["discord_name", "Discord név", "text", "johndoe1234"],
            ].map(([id, label, type, placeholder]) => (
              <div key={id}>
                <label
                  htmlFor={id}
                  className="block text-sm font-medium text-white"
                >
                  {label}
                </label>
                <input
                  id={id}
                  type={type}
                  value={formData[id]}
                  onChange={writeData}
                  placeholder={placeholder}
                  className="mt-1 block w-full p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm"
                  required
                />
              </div>
            ))}
            <div className="md:col-span-2 flex items-start">
              <input
                id="terms"
                type="checkbox"
                className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-indigo-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-600"
                required
              />
              <label
                htmlFor="terms"
                className="ml-2 text-sm text-gray-300"
              >
                Elfogadom a
                <a
                  href="#"
                  className="text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  {" "}
                  Felhasználási feltételeket
                </a>
              </label>
            </div>
            <button
              type="submit"
              className="md:col-span-2 w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-400 font-medium rounded-lg text-sm px-5 py-2.5 shadow-md"
            >
              Regisztrálok
            </button>
            <p className="md:col-span-2 text-sm text-gray-400 text-center">
              Van már fiókod?{" "}
              <Link to="/login" className="text-indigo-600 hover:underline">
                Bejelentkezés
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Register;
