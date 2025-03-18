import { useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const { authStatus } = useContext(UserContext);

  const kuldes = (formData, method) => {
    fetch(`${import.meta.env.VITE_BASE_URL}/user/register`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((token) => {
        if (!token.message) {
          sessionStorage.setItem("tokenU", token);
          authStatus();
          toast.success("Sikeres regisztráció!");
          navigate("/");
        } else {
          toast.error(token.message);
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
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-80 w-auto mt-10" src={Logo} />
          <h2 className="mt-10 text-center text-4xl font-bold tracking-tight text-indigo-600 mb-10">
            Regisztráció
          </h2>
        </div>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Regisztráció
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={onSubmit}
              action="#"
              method="POST"
            >
              <div>
                <label
                  htmlFor="email_address"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email cím
                </label>
                <input
                  onChange={writeData}
                  value={formData.email_address}
                  type="email"
                  name="email_address"
                  id="email_address"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="johndoe@taszi.hu"
                  required=""
                />
              </div>
              <div>
                <label
                  htmlFor="paswrd"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Jelszó
                </label>
                <input
                  onChange={writeData}
                  value={formData.paswrd}
                  type="password"
                  name="paswrd"
                  id="paswrd"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                />
              </div>
              <div>
                <label
                  htmlFor="usr_name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Felhasználónév
                </label>
                <input
                  onChange={writeData}
                  value={formData.usr_name}
                  type="username"
                  name="usr_name"
                  id="usr_name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                />
              </div>
              <div>
                <label
                  htmlFor="full_name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Teljes név
                </label>
                <input
                  onChange={writeData}
                  value={formData.full_name}
                  type="text"
                  name="full_name"
                  id="full_name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                />
              </div>

              <div>
                <label
                  htmlFor="date_of_birth"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Születési dátum
                </label>
                <div className="relative max-w-sm">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
                  <input
                    onChange={writeData}
                    value={formData.date_of_birth}
                    id="date_of_birth"
                    datepicker={true.toString()}
                    datepicker-autohide={true.toString()}
                    type="date"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="példa - 2003.07.30"
                  />
                </div>

                <div>
                  <label
                    htmlFor="school"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Iskola
                  </label>
                  <input
                    onChange={writeData}
                    value={formData.school}
                    type="text"
                    name="school"
                    id="school"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                  />
                </div>

                <div>
                  <label
                    htmlFor="clss"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Osztály
                  </label>
                  <input
                    onChange={writeData}
                    value={formData.clss}
                    type="text"
                    name="clss"
                    id="clss"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                    placeholder="10/D"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone_num"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Telefonszám
                  </label>
                  <input
                    onChange={writeData}
                    value={formData.phone_num}
                    type="text"
                    name="phone_num"
                    id="phone_num"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                    placeholder="+36701234567"
                  />
                </div>

                <div>
                  <label
                    htmlFor="om_identifier"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Om azonosító
                  </label>
                  <input
                    onChange={writeData}
                    value={formData.om_identifier}
                    type="text"
                    name="om_identifier"
                    id="om_identifier"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                    placeholder="72312345678"
                  />
                </div>

                <div>
                  <label
                    htmlFor="discord_name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Discord név
                  </label>
                  <input
                    onChange={writeData}
                    value={formData.discord_name}
                    type="text"
                    name="discord_name"
                    id="discord_name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                    placeholder="johndoe#1234"
                  />
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      aria-describedby="terms"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    />
                  </div>
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="terms"
                    className="font-light text-gray-500 dark:text-gray-300"
                  >
                    Elfogadom a{" "}
                    <a
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                      href="#"
                    >
                      Felhasználási feltételeket és Szabályzatot
                    </a>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Regisztrálok
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Van már fiókod?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Bejelentkezés
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
