import { useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import { useNavigate } from "react-router-dom";


function UserLogin() {

  const navigate = useNavigate();
  const { authStatus } = useContext(UserContext);

  const kuldes = (formData, method) => {
    fetch(`${import.meta.env.VITE_BASE_URL}/user/login`, {
      method: method,
      credentials: 'include',
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(token => {
        if (!token.message) {
          sessionStorage.setItem('usertoken', token);
          authStatus();
          alert("Sikeres belépés!");
          navigate('/');
        } else {
          alert(token.message);
        }
      })
      .catch(err => alert(err));
  }

  const onSubmit = (e) => {
    e.preventDefault();
    kuldes(formData, 'POST');
  }

  let formObj = {
    usr_name: "",
    paswrd: ""
  }

  const [formData, setFormData] = useState(formObj);
  const writeData = (e) => {
    setFormData((prevState) => ({ ...prevState, [e.target.id]: e.target.value }));
  }

  return (
    <div>
      {/* //       <!--
//   This example requires updating your template:

//   ```
//   <html className="h-full bg-white">
//   <body className="h-full">
//   ```
// --> */}
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
              <div className="mt-2">
                <input type="email" name="email" id="email" autoComplete="email" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                </div>
              </div>
              <div className="mt-2">
                <input type="password" name="password" id="password" autoComplete="current-password" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
              </div>
            </div>

            <div>
              <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Not a member?
            <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Start a 14 day free trial</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserLogin