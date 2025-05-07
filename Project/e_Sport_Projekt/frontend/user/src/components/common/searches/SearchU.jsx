import { useContext, useState } from "react";
import { toast } from "react-toastify";
import UserSchema from "../schemas/UserSchema";
import UserContext from "../../../context/UserContext";

function SearchU() {
  const [searchInput, setSearchInput] = useState("");
  const [result, setResult] = useState([]);
  const [classNumber, setClassNumber] = useState("all");
  const [classLetter, setClassLetter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [inviteFilter, setInviteFilter] = useState("all");
  const { isAuthenticated } = useContext(UserContext);

  const writeData = (e) => setSearchInput(e.target.value);

  const isUserInviteable = (user) => {
    return (
      user.status !== "inactive" &&
      user.status !== "banned" &&
      user.inviteable === true
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (searchInput.trim() === "") {
      setResult([]);
      return;
    }

    let query = `${import.meta.env.VITE_BASE_URL}/list/unamesearch/${searchInput}`;
    const params = new URLSearchParams();

    // Osztály szűrés: ha csak a szám vagy csak a betű van megadva, akkor is működjön a keresés
    if (classNumber !== "all" || classLetter !== "all") {
      if (classNumber !== "all") {
        params.append("classNum", classNumber);
      }
      if (classLetter !== "all") {
        params.append("classLetter", classLetter);
      }
    }

    if (statusFilter !== "all") {
      params.append("status", statusFilter);
    }

    if (inviteFilter === "1" || inviteFilter === "0") {
      params.append("inviteable", inviteFilter);
    }

    if ([...params].length > 0) {
      query += `?${params.toString()}`;
    }

    fetch(query, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          //console.log("hiba")
        }
        return res.json();
      })
      .then((data) => {
        
        if(data.message){
          setResult([]);
        }else{
          // Kliensoldali szűrés meghívhatóság alapján
        const filteredData =
        inviteFilter === "all"
          ? data
          : data.filter((user) =>
              inviteFilter === "1"
                ? isUserInviteable(user)
                : !isUserInviteable(user)
            );

      setResult(filteredData);
          
        }
      })
      .catch((err) =>
        toast.error("Hiba történt a keresés során,\nvagy nincs ilyen találat")
      );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <h2 className="mt-10 text-center text-4xl font-bold tracking-tight text-indigo-600">
        Játékos kereső
      </h2>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-4">
              <label htmlFor="username" className="block text-sm font-medium text-indigo-600">
                Felhasználónév
              </label>
              <input
                type="text"
                id="username"
                value={searchInput}
                onChange={writeData}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>

            <div className="col-span-2 flex items-end">
              <button
                type="submit"
                className="w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Keresés
              </button>
            </div>

            <div className="col-span-2">
              <label htmlFor="classNumber" className="block text-sm font-medium text-indigo-600">
                Osztály (szám)
              </label>
              <select
                id="classNumber"
                value={classNumber}
                onChange={(e) => setClassNumber(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              >
                <option value="all">Összes</option>
                {[...Array(15)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label htmlFor="classLetter" className="block text-sm font-medium text-indigo-600">
                Osztály (betű)
              </label>
              <select
                id="classLetter"
                value={classLetter}
                onChange={(e) => setClassLetter(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              >
                <option value="all">Összes</option>
                {["A", "B", "C", "D", "E", "F", "G", "H"].map((letter) => (
                  <option key={letter} value={letter}>{letter}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label htmlFor="statusFilter" className="block text-sm font-medium text-indigo-600">
                Státusz
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              >
                <option value="all">Összes</option>
                <option value="active">Aktív</option>
                <option value="inactive">Inaktív</option>
                <option value="banned">Tiltott</option>
              </select>
            </div>

            <div className="col-span-6">
              <span className="block text-sm font-medium text-indigo-600 mb-1">Meghívhatóság</span>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="inviteable"
                    value="all"
                    checked={inviteFilter === "all"}
                    onChange={(e) => setInviteFilter(e.target.value)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Összes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="inviteable"
                    value="1"
                    checked={inviteFilter === "1"}
                    onChange={(e) => setInviteFilter(e.target.value)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Meghívható</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="inviteable"
                    value="0"
                    checked={inviteFilter === "0"}
                    onChange={(e) => setInviteFilter(e.target.value)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Nem meghívható</span>
                </label>
              </div>
            </div>

            <div className="col-span-6">
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setClassNumber("all");
                  setClassLetter("all");
                  setStatusFilter("all");
                  setInviteFilter("all");
                  setResult([]);
                }}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Szűrők alaphelyzetbe
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 justify-items-center gap-5 mb-10 mt-20">
        {result.length > 0 ? (
          result.map((user) => <UserSchema key={user.id} user={user} />)
        ) : (
          <p className="text-center text-gray-600">Nincs találat</p>
        )}
      </div>
    </div>
  );
}

export default SearchU;
