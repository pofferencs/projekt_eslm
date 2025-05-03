import { useEffect, useState } from "react";

function TournamentSchema({ tournament, limit }) {
  const [tournamentPicPath, setTournamentPicPath] = useState("");
  const [countdownField, setCountdownField] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const targets = [
        { field: "apn_start", time: new Date(tournament.apn_start).getTime() },
        { field: "apn_end", time: new Date(tournament.apn_end).getTime() },
        { field: "start_date", time: new Date(tournament.start_date).getTime() },
        { field: "end_date", time: new Date(tournament.end_date).getTime() },
      ];

      let nextTarget = null;
      for (let target of targets) {
        if (now < target.time) {
          nextTarget = target;
          break;
        }
      }

      if (nextTarget) {
        setCountdownField(nextTarget.field);
        const diff = nextTarget.time - now;
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setCountdownField(null);
        setTimeLeft(null);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [tournament]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/list/tournamentpic/${tournament.id}`)
      .then((res) => res.json())
      .then((pic) => setTournamentPicPath(pic))
      .catch(() => setTournamentPicPath("/default_tournament_image.png"));
  }, [tournament.id]);

  const getDateColor = (field) => {
    const now = new Date().getTime();
    const start = new Date(tournament.apn_start).getTime();
    const end = new Date(tournament.apn_end).getTime();

    if (field === "apn_start") {
      if (now < start) return "text-yellow-400"; // még nem kezdődött el
      return "text-green-400"; // már elindult
    }

    const date = new Date(tournament[field]).getTime();
    if (date < now) return "text-red-400";
    if (date > now) return "text-green-400";
    return "text-white";
  };

  const renderRow = (label, field) => {
    const date = tournament[field];
    const showCountdown = countdownField === field;
    const colorClass = getDateColor(field);

    return (
      <div className="flex justify-evenly items-center">
        <p className="drop-shadow-lg text-stone-300 font-extrabold">{label}</p>
        {showCountdown && timeLeft ? (
          <CountdownDisplay time={timeLeft} />
        ) : (
          <p className={`italic ${colorClass}`}>{formatDate(date)}</p>
        )}
      </div>
    );
  };

  return (
    <div className="card bg-neutral drop-shadow-lg text-blue-200 w-96 bg-gradient-to-br inline-block from-indigo-950 to-slate-500">
      <div className="card-body items-left text-left">
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

        <div className="border-t border-white my-2" />

        {renderRow("Jelentkezés kezdete:", "apn_start")}
        {renderRow("Jelentkezés vége:", "apn_end")}

        <div className="border-t border-white my-2" />

        {renderRow("Verseny kezdete:", "start_date")}
        {renderRow("Verseny vége:", "end_date")}

        <div className="border-t border-white my-2" />

        <div className="flex justify-evenly">
          <p className="drop-shadow-lg text-stone-300 font-extrabold flex-none">Játékmód:</p>
          <p className="drop-shadow-lg ml-7">{tournament.game_mode}</p>
        </div>

        <div className="flex justify-evenly">
          <p className="drop-shadow-lg text-stone-300 font-extrabold flex-none">
            Max. jelentkezők:
          </p>
          <p className="drop-shadow-lg ml-7">{tournament.max_participant}</p>
        </div>

        <div className="flex justify-evenly">
          <p className="drop-shadow-lg text-stone-300 font-extrabold flex-none">
            Jelentkezők:
          </p>
          <p className="drop-shadow-lg ml-7">{tournament.num_participant}</p>
        </div>

        <div className="flex justify-evenly">
          <p className="drop-shadow-lg text-stone-300 font-extrabold flex-none">Leírás:</p>
          <p className="drop-shadow-lg ml-7">{tournament.details}</p>
        </div>
      </div>
    </div>
  );
}

function CountdownDisplay({ time }) {
  return (
    <div className="grid grid-flow-col gap-1 text-center auto-cols-max">
      {"days|hours|minutes|seconds".split("|").map((unit) => (
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
