import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EventSchema from "../schemas/EventSchema";

function SearchE() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [limit, setLimit] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/list/event`)
      .then((res) => res.json())
      .then((data) => {
        const now = new Date().getTime();
        const withStatus = data.map((event) => {
          const start = new Date(event.start_date).getTime();
          const end = new Date(event.end_date).getTime();

          if (now < start) return { ...event, status: "not_started" };
          if (now >= start && now < end) return { ...event, status: "started" };
          return { ...event, status: "ended" };
        });
        setEvents(withStatus);
      })
      .catch(() => toast.error("Hiba történt az események betöltésekor"));
  }, []);

  useEffect(() => {
    let filtered = [...events];

    if (statusFilter !== "all") {
      filtered = filtered.filter((e) => e.status === statusFilter);
    }

    if (searchTerm.trim() !== "") {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter((e) =>
        e.name?.toLowerCase().includes(lower)
      );
    }

    if (limit > 0) {
      setFilteredEvents(filtered.slice(0, limit));
    } else {
      setFilteredEvents(filtered);
    }

  }, [events, statusFilter, limit, searchTerm]);

  return (
    <div className="flex flex-col min-h-screen">
      <h2 className="mt-10 text-center text-4xl font-bold tracking-tight text-indigo-600">
        Esemény szűrő
      </h2>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form>
          <div className="grid grid-cols-6 gap-4">

            <div className="col-start-1 col-end-7">
              <label
                htmlFor="search"
                className="block text-sm/6 font-medium text-indigo-600"
              >
                Keresés név alapján
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pl. II. Trefort E-sport"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>

            <div className="col-start-1 col-end-4">
              <label
                htmlFor="status"
                className="block text-sm/6 font-medium text-indigo-600"
              >
                Státusz
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              >
                <option value="all">Összes</option>
                <option value="started">Aktív</option>
                <option value="not_started">Nem kezdett</option>
                <option value="ended">Lezárt</option>
              </select>
            </div>

            <div className="col-start-4 col-end-7">
              <label
                htmlFor="limit"
                className="block text-sm/6 font-medium text-indigo-600"
              >
                Megjelenítendő darabszám
              </label>
              <select
                id="limit"
                value={limit}
                onChange={(e) => {
                  const value = e.target.value;
                  setLimit(value == 0 ? Infinity : parseInt(value));
                }}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              >
                <option value={0}>Összes</option>
                {[1, 2, 3, 4, 5, 10, 30, 50, 70, 100].map((num) => (
                  <option key={num} value={num}>
                    {num} verseny
                  </option>
                ))}
              </select>
            </div>

            <div className="col-start-1 col-end-7">
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("all");
                  setLimit(3);
                  setSearchTerm("");
                }}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Szűrők alaphelyzetbe
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className={`grid ${filteredEvents.length === 1 ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} md:grid-cols-2 sm:grid-cols-1 justify-items-center gap-5 mb-10 mt-10`}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventSchema key={event.id} event={event} />
          ))
        ) : (
          <p>Nincs találat a megadott szűrőkkel.</p>
        )}
      </div>
    </div>
  );
}

export default SearchE;
