import { useState } from "react";
import { toast } from "react-toastify";
import UserSchema from "../schemas/UserSchema";

function SearchU() {
  const [searchInput, setSearchInput] = useState("");
  const [result, setResult] = useState([]);

  const onSubmit = (e) => {
    e.preventDefault();

    fetch(`${import.meta.env.VITE_BASE_URL}/list/unamesearch/${searchInput}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then(console.log(searchInput))
      .then((res) => res.json())
      .then((adat) => setResult(adat))
      .catch((err) => toast.error(err));

    console.log(result);
  };

  const writeData = (e) => {
    setSearchInput(e.target.value);

    console.log("Input mező>>> " + searchInput);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <h2 className="mt-10 text-center text-4xl font-bold tracking-tight text-indigo-600">
        Játékos kereső
      </h2>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={onSubmit}>


          <div className="grid grid-cols-6 gap-4">
            <div className="col-start-1 col-end-4 ...">
              <div className="mt-2">
                <label
                  htmlFor="username"
                  className="block text-sm/6 font-medium text-indigo-600"
                >Felhasználónév
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  autoComplete="username"
                  value={searchInput}
                  onChange={writeData}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div className="col-start-4 col-end-7 ...">
              {/* <div className="mt-2">
                <label className="block text-sm/6 font-medium text-indigo-600">Iskola</label>
                <div className='dropdown dropdown-down'>
                  <div tabIndex={0} role='button' className='rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'>Válassz...</div>
                  <ul tabIndex={0} className='dropdown-content menu bg-slate-500 rounded-box z-1 w-52 p-2 shadow-sm'>

                    <li className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Játékos kereső</li>
                    <li className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Csapat kereső</li>
                    <li className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Meccs kereső</li>
                    <li className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Esemény kereső</li>

                    {

                    }
                  </ul>
                </div>
              </div> */}
            </div>
            <div className="col-span-2 col-end-7 ..."></div>
            <div className="col-start-1 col-end-7 ...">
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Keresés
              </button>
            </div>
          </div>

        </form>
      </div >

      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 justify-items-center gap-5 mb-10 mt-20">
        {result.length > 0 ? (
          result.map((user) => (
            <UserSchema key={user.id} user={user} />
          ))
        ) : (
          <p>{result.message}</p>
        )}
      </div>
    </div >
  );
}

export default SearchU;
