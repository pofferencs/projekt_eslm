import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EventSchema from "../common/schemas/EventSchema";
import { Link } from "react-router-dom";

function Main() {
  const [events, setEvents] = useState([]);

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

        // Időrend szerint rendezés (kezdés dátuma alapján)
        withStatus.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

        // Szűrés preferencia szerint
        const started = withStatus.filter((e) => e.status === "started").slice(0, 3);
        const notStarted = withStatus.filter((e) => e.status === "not_started").slice(0, 3);
        const ended = withStatus.filter((e) => e.status === "ended").slice(0, 3);

        if (started.length > 0) {
          setEvents(started);
        } else if (notStarted.length > 0) {
          setEvents(notStarted);
        } else {
          setEvents(ended);
        }
      })
      .catch((err) => toast.error("Hiba történt az események betöltésekor"));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <h2 className="mt-10 text-center text-4xl font-bold bg-gradient-to-tr from-indigo-500 to-amber-500 inline-block text-transparent bg-clip-text">
        Események
      </h2>
      <div className="mx-auto mt-2 h-1 w-[60%] bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full" />


      <div className="mt-5 text-center text-md text-gray-500">
        {events.length > 0 && events[0].status === "started"
          ? "Aktív események"
          : events.length > 0 && events[0].status === "not_started"
            ? "Hamarosan kezdődő események"
            : "Lezárt események"}

        <div className="flex justify-center mt-8">
          <Link
            to="/event-search"
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-500 transition duration-200"
          >
            Más események…
          </Link>
        </div>
      </div>

      <div
        className={`grid ${events.length === 1 ? 'lg:grid-cols-1' : 'lg:grid-cols-2'} md:grid-cols-2 sm:grid-cols-1 justify-items-center gap-5 mb-10 mt-10`}
      >
        {events.length > 0 ? (
          events.map((event) => (
            <EventSchema key={event.id} event={event} />
          ))
        ) : (
          <p>{events.message}</p>
        )}
      </div>

    </div>
  );
}

export default Main;
