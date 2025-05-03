import { useEffect, useState } from "react";

function TournamentSchema({ tournament }) {
  const [tournamentPicPath, setTournamentPicPath] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);
  const [activeCountdownField, setActiveCountdownField] = useState(null);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();

      const getTimeLeft = (target) => {
        const diff = target - now;
        return {
          days: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
          hours: Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
          minutes: Math.max(0, Math.floor((diff / (1000 * 60)) % 60)),
          seconds: Math.max(0, Math.floor((diff / 1000) % 60)),
        };
      };

      const applyStart = new Date(tournament.apn_start).getTime();
      const applyEnd = new Date(tournament.apn_end).getTime();
      const start = new Date(tournament.start_date).getTime();
      const end = new Date(tournament.end_date).getTime();

      if (now >= applyStart && now < applyEnd) {
        setTimeLeft(getTimeLeft(applyEnd));
        setActiveCountdownField("apn_end");
      } else if (now >= applyEnd && now < start) {
        setTimeLeft(getTimeLeft(start));
        setActiveCountdownField("start_date");
      } else if (now >= start && now < end) {
        setTimeLeft(getTimeLeft(end));
        setActiveCountdownField("end_date");
      } else {
        setTimeLeft(null);
        setActiveCountdownField(null);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [tournament]);

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_BASE_URL}/list/tournamentpic/${tournament.id}`
    )
      .then((res) => res.json())
      .then((pic) => setTournamentPicPath(pic))
      .catch(() => setTournamentPicPath("/default_tournament_image.png"));
  }, [tournament?.id]);

  const renderRow = (label, field) => {
    const date = tournament[field];
    const showCountdown = activeCountdownField === field;

    return (
      <div className="flex justify-evenly items-center">
        <p className="drop-shadow-lg text-stone-300 font-extrabold">{label}</p>
        {showCountdown && timeLeft ? (
          <CountdownDisplay time={timeLeft} />
        ) : (
          <p className="text-stone-200 italic">{formatDate(date)}</p>
        )}
      </div>
    );
  };

  return (
    <div className="card bg-neutral drop-shadow-lg text-blue-200 w-96 bg-gradient-to-br inline-block from-indigo-950 to-slate-500">
      <div className="card-body items-left text-left">
        {/* Név + kép */}
        <div className="flex justify-between">
          <h2 className="card-title drop-shadow-lg">{tournament.name}</h2>
          <img
            className="w-10 h-10 rounded-full drop-shadow-lg object-cover"
            src={
              import.meta.env.VITE_BASE_URL +
              import.meta.env.VITE_BASE_PIC +
              tournamentPicPath
            }
            alt="Tournament"
          />
        </div>

        {/* VONAL 1 - Név után */}
        <hr className="my-2 border-white" />

        {/* Jelentkezés kezdete / vége */}
        {renderRow("Jelentkezés kezdete:", "apn_start")}
        {renderRow("Jelentkezés vége:", "apn_end")}

        {/* VONAL 2 - Jelentkezések után */}
        <hr className="my-2 border-white" />

        {/* Kezdés / vége */}
        {renderRow("Kezdés:", "start_date")}
        {renderRow("Vége:", "end_date")}

        {/* VONAL 3 - Időpontok után */}
        <hr className="my-2 border-white" />

        {/* Helyszín */}
        <div className="flex justify-evenly">
          <p className="drop-shadow-lg text-stone-300 font-extrabold flex-none">
            Hely:
          </p>
          <p className="drop-shadow-lg ml-10">{tournament.place}</p>
        </div>

        {/* Leírás */}
        <div className="flex justify-evenly">
          <p className="drop-shadow-lg text-stone-300 font-extrabold flex-none">
            Leírás:
          </p>
          <p className="drop-shadow-lg ml-7">{tournament.details}</p>
        </div>
      </div>
    </div>
  );
}

function CountdownDisplay({ time }) {
  return (
    <div className="grid grid-flow-col gap-1 text-center auto-cols-max">
      {["days", "hours", "minutes", "seconds"].map((unit) => (
        <div
          key={unit}
          className="flex flex-col p-2 bg-blue-300 text-indigo-950 rounded-box"
        >
          <span className="countdown font-mono text-2xl">{time[unit]}</span>
          {unit === "days"
            ? "nap"
            : unit === "hours"
            ? "óra"
            : unit === "minutes"
            ? "perc"
            : "mp"}
        </div>
      ))}
    </div>
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Érvénytelen dátum";
  return new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default TournamentSchema;
