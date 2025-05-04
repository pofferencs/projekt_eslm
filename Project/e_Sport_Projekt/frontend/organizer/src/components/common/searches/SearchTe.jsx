import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import TeamSchema from "../schemas/TeamSchema";

function TeamSearch() {
  const [searchInput, setSearchInput] = useState("");
  const [result, setResult] = useState([]);

  const teamKereso = (input) => {

    let url = `${import.meta.env.VITE_BASE_URL}/list/team`;

    // Ha van kereső input, akkor hozzáadjuk a keresési paramétert
    if (input) {
      url = `${import.meta.env.VITE_BASE_URL}/list/tenamesearch/${input}`
    }

    // Fetch kérés a backend felé
    fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setResult(data); // Eredmények frissítése
      })
      .catch((err) => toast.error("Hiba történt a keresés során.")); // Hiba esetén
  }


  // Keresés és csapatok listázása
  const onSubmit = (e) => {
    e.preventDefault();
    teamKereso(searchInput);
    
  };

  // Keresési input kezelése
  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer />
      <h2 className="mt-10 text-center text-4xl font-bold tracking-tight text-indigo-600">
        Csapat kereső
      </h2>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-6 gap-4">
            <div className="col-start-1 col-end-5">
              <label htmlFor="teamname" className="block text-sm/6 font-medium text-indigo-600">
                Csapatnév
              </label>
              <input
                type="text"
                name="teamname"
                id="teamname"
                autoComplete="off"
                value={searchInput}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>

            <div className="col-start-5 col-end-7 flex items-end">
              <button
                type="submit"
                className="w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Keresés
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Találatok megjelenítése */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 justify-items-center gap-5 mb-10 mt-20">
        {result.length > 0 ? (
          result.map((team) => <TeamSchema key={team.id} team={team} />)
        ) : (
          <p>{result.message}</p>
        )}
      </div>
    </div>
  );
}

export default TeamSearch;
