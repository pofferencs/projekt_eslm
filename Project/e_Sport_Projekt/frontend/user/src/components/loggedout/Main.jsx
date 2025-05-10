import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EventSchema from "../common/schemas/EventSchema";
import { Link } from "react-router-dom";
import Hirschmann from "../../assets/sponsores/hirschmann.jpg";
import Linamar from "../../assets/sponsores/linamar.png";
import Makroker from "../../assets/sponsores/makroker.png";
import Stones from "../../assets/sponsores/stones.jpg";
import TopLaptop from "../../assets/sponsores/topLaptop.png";
import CarloQuality from '../../assets/sponsores/carloQuality.png'
import ReactTwitchEmbedVideo from "react-twitch-embed-video"

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
        Twitch csatornáink
      </h2>
      <div className="mx-auto mt-2 h-1 w-[60%] bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full" />

      <div className="w-full max-w-[800px] aspect-video mx-auto pt-5">
        <ReactTwitchEmbedVideo
          allowfullscreen={false}
          channel="trefortesport"
          chat="undefined"
          layout="video"
          onPlay={() => { }}
          onReady={() => { }}
          theme="dark"
          width="100%"      // ezek nem kötelezőek, lehet el is hagyhatók
          height="100%"
        />
      </div>



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

      <h2 className="mt-10 mb-5 p-2 underline text-center text-4xl font-bold bg-gradient-to-br from-indigo-500 to-amber-500 inline-block text-transparent bg-clip-text">
        Támogatóink
      </h2>
      <div className="mx-auto mt-2 h-1 w-[100%] bg-gradient-to-r to-indigo-500 from-amber-500 rounded-full" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-1 bg-white  place-items-center">
        <img src={CarloQuality} alt="Cario Quality" className="h-25 object-contain" />
        <img src={Hirschmann} alt="Hirschmann" className="h-27 object-contain" />
        <img src={Linamar} alt="Linamar" className="h-30 object-contain" />
        <img src={Makroker} alt="Makroker" className="h-15 mb-5 object-contain" />
        <img src={Stones} alt="Stones" className="h-24 mb-5 object-contain" />
        <img src={TopLaptop} alt="Top Laptop" className="h-10 object-contain" />
      </div>
      <div className="mx-auto h-1 mb-10 w-[100%] bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full" />


    </div>
  );
}

export default Main;
