import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EventSchema from "./schemas/EventSchema";


function EventList() {
  const [result, setResult] = useState([]);

  useEffect(() => {

    fetch(`${import.meta.env.VITE_BASE_URL}/list/event`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((adat) => setResult(adat))
      .catch((err) => toast.error(err));

    // console.log(result);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <h2 className="mt-10 text-center text-4xl font-bold tracking-tight text-indigo-600">
        Események
      </h2>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">




        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 justify-items-center gap-5 mb-10 mt-20">
          {result.length > 0 ? (
            result.map((event) => (
              <EventSchema key={event.id} event={event} />
            ))
          ) : (
            <p>{result.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventList;
