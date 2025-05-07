import { useLocation, useNavigate, useParams } from "react-router-dom"
import Logo from "../../assets/logo.png";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";
import { toast } from "react-toastify";

function UserPassReset() {

  const { isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const [isLoading, setIsLoading] = useState(true);
  const [isEmail, setIsEmail] = useState(true);
  const [tokenVerified, setTokenVerified] = useState(false);
  const [tokenMessage, setTokenMessage] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState(0);


  useEffect(() => {

    if (isAuthenticated && !token && !tokenVerified) {
      navigate('/');
    }



    if (!token == "") {

      fetch(`${import.meta.env.VITE_BASE_URL}/user/passemail-verify`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          token: token
        }),
      }).then((res) => res.json())
        .then((token) => {
          // console.log(token.verified)
          if (token.verified == true) {
            setTokenVerified(true);
            setIsEmail(false);
            setEmail(token.data.email);
            setId(token.id);
            setIsLoading(false);
          } else if (token.verified == false) {
            setTokenMessage(token.message)
            setIsEmail(false);
            setTokenVerified(false);
            setIsLoading(false);
          }
        })
        .catch((err) => alert(err));



    };
    setIsLoading(false);

    //console.log({Email_form: isEmail, Pass_form: tokenVerified, tokenMessage: tokenMessage, email: email, isloading: isLoading})

  }, [isAuthenticated]);


  const kuldesEmail = (formData, method) => {

    // console.log(formData)
    fetch(`${import.meta.env.VITE_BASE_URL}/user/password-reset`, {
      method: method,
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(formData),
    }).then((res) => res.json())
      .then((token) => {
        if (!token.ok) {

          toast.success(token.message)
        }
      })
      .catch((err) => alert(err));
  };

  const kuldesPass = (passData, method) => {

    const { pass, passAgain } = passData;

    if (pass == passAgain) {

      fetch(`${import.meta.env.VITE_BASE_URL}/update/user`, {
        method: method,
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          id: id,
          new_paswrd: pass
        }),
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) {

          toast.error(data.message);
        } else {
          navigate('/login');
          toast.success(data.message);
        }



      }).catch((err) => alert(err));

    } else {
      toast.error("A jelszavak nem egyeznek!");
    }




  };

  const onSubmitEmail = (e) => {
    e.preventDefault();
    kuldesEmail(formData, "POST");
  };

  const onSubmitPass = (e) => {
    e.preventDefault();
    kuldesPass(passData, "PATCH");
  };

  let formObj = {
    email: ""

  };

  let passObj = {
    pass: "",
    passAgain: ""

  };

  const [formData, setFormData] = useState(formObj);
  const [passData, setPassData] = useState(passObj);

  const writeDataEmail = (e) => {
    const { id, value } = e.target;

    setFormData((prevState) => ({ ...prevState, email: value }))


  };

  const writeDataPass = (e) => {
    setPassData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))


  };



  return (

    (isLoading == true) ? (
      <p></p>

    ) : (

      <section className="bg-gray-900 min-h-screen flex flex-col items-center px-6 py-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-20 w-auto" src={Logo} alt="Logo" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-indigo-700">
            {(tokenVerified) ? (
              <p>Elfelejtett jelszó</p>
            ) :
              (
                <p>Jelszó módosítás</p>

              )}
          </h2>
        </div>
        {
          (isEmail == true) ? (
            <div className="w-full rounded-lg shadow-lg md:mt-6 sm:max-w-2xl xl:p-0 bg-gray-800 dark:border-gray-700">
              <button className="btn mt-4 ml-4 bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={() => { navigate('/login') }}>
                <img src="https://www.svgrepo.com/show/500472/back.svg" className="h-5" />
              </button>
              <div className="p-8 md:p-10">
                <h2 className="text-2xl text-center font-bold">Kérjük, add meg az e-mail címedet!</h2>
                <p className="text-center font-bold">A megerősítő link 15 percig lesz érvényes. <br />Előfordulhat, hogy a "Spam" mappába kerül az e-mailünk.</p>

                <div className="mt-1 sm:mx-auto sm:w-full sm:max-w-sm" >
                  <form onSubmit={onSubmitEmail}
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
                          onChange={writeDataEmail}
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
            (tokenVerified == false) ? (
              <p className="mt-5">{tokenMessage}</p>
            ) : (


              <div className="w-full rounded-lg shadow-lg md:mt-6 sm:max-w-2xl xl:p-0 bg-gray-800 dark:border-gray-700">
                <div className="p-8 md:p-10">
                  <h2 className="text-2xl text-center font-bold">Kérjük, add meg az új jelszót!</h2>

                  <div className="mt-1 sm:mx-auto sm:w-full sm:max-w-sm" >
                    <form onSubmit={onSubmitPass}
                      className="space-y-6 flex flex-col items-center"
                      action="#"
                      method="POST">

                      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <label
                          htmlFor="email"
                          className="block text-sm/7 font-medium text-white"
                        >
                          Jelszó
                        </label>

                        <div className="mt-2">
                          <input
                            type="text"
                            name="pass"
                            id="pass"
                            autoComplete="pass"
                            required
                            value={
                              passData.pass
                            }
                            onChange={writeDataPass}
                            className="block w-full h-12 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                          />
                        </div>
                      </div>
                      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <label
                          htmlFor="email"
                          className="block text-sm/7 font-medium text-white"
                        >
                          Jelszó ismét
                        </label>

                        <div className="mt-2">
                          <input
                            type="text"
                            name="passAgain"
                            id="passAgain"
                            autoComplete="passAgain"
                            required
                            value={
                              passData.passAgain
                            }
                            onChange={writeDataPass}
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
            )
          )
        }
      </section>
    )
  )
}

export default UserPassReset