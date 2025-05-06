import { useContext, useEffect, useState } from "react";
import OrganizerContext from "../../../context/OrganizerContext";
import { useNavigate } from "react-router-dom";


function EventSchema({ event }) {

    function formatDate(date) {
        return new Intl.DateTimeFormat('hu-HU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hourCycle: 'h23'
        }).format(date).replace(/\./g, ".").trim();
    }

    const {isAuthenticated, profile} = useContext(OrganizerContext);
    const navigate = useNavigate();
    const [eventPicPath, setEventPicPath] = useState("");
    const [showFull, setShowFull] = useState(false);

    const [timeLeftToStart, setTimeLeftToStart] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [timeLeftToEnd, setTimeLeftToEnd] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    const [statusCheckResult, setStatusCheckResult] = useState("");

    useEffect(() => {
        if (timeLeftToStart.days == 0 && timeLeftToStart.hours == 0 && timeLeftToStart.minutes == 0 && timeLeftToEnd.days == 0 && timeLeftToEnd.hours == 0 && timeLeftToEnd.minutes == 0) {
            setStatusCheckResult("ended");
        }
        else if (timeLeftToStart.days > 0 || timeLeftToStart.hours > 0 || timeLeftToStart.minutes > 0) {
            setStatusCheckResult("not started yet");
        }
        else {
            setStatusCheckResult("started");
        }
    }, [timeLeftToStart.days, timeLeftToStart.hours, timeLeftToStart.minutes,
    timeLeftToEnd.days, timeLeftToEnd.hours, timeLeftToEnd.minutes])

    const [eventStatus, setEventStatus] = useState({ started: false, ended: false, not_started: false });

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BASE_URL}/list/eventpic/${event.id}`)
            .then(res => res.json())
            .then(kep => setEventPicPath(kep))
            .catch(error => console.log(error));

    }, [event?.id]);

    useEffect(() => {
        if (!event?.start_date || !event?.end_date) return;

        const idoFrissites = () => {
            const now = new Date().getTime();

            const startDateig = new Date(event.start_date).getTime() - now;
            setTimeLeftToStart({
                days: Math.max(0, Math.floor(startDateig / (1000 * 60 * 60 * 24))),
                hours: Math.max(0, Math.floor((startDateig / (1000 * 60 * 60)) % 24)),
                minutes: Math.max(0, Math.floor((startDateig / (1000 * 60) % 60))),
                seconds: Math.max(0, Math.floor((startDateig / 1000) % 60))
            });

            const endDateig = new Date(event.end_date).getTime() - now;
            setTimeLeftToEnd({
                days: Math.max(0, Math.floor(endDateig / (1000 * 60 * 60 * 24))),
                hours: Math.max(0, Math.floor((endDateig / (1000 * 60 * 60)) % 24)),
                minutes: Math.max(0, Math.floor((endDateig / (1000 * 60) % 60))),
                seconds: Math.max(0, Math.floor((endDateig / 1000) % 60))
            });

        }

        const now = new Date().getTime();
        const startTime = new Date(event.start_date).getTime();
        const endTime = new Date(event.end_date).getTime();

        if (now < startTime) {
            setEventStatus({ started: false, ended: false, not_started: true });
        } else if (now >= startTime && now < endTime) {
            setEventStatus({ started: true, ended: false, not_started: false });
        } else {
            setEventStatus({ started: false, ended: true, not_started: false });
        }

        const interval = setInterval(idoFrissites, 1000);

        return () => clearInterval(interval);
    }, [event?.start_date, event?.end_date])

    return (
        <div className="card bg-neutral drop-shadow-lg text-blue-200 w-96 bg-gradient-to-br inline-block from-indigo-950 to-slate-500">
            <div className="card-body items-left text-left">
                <div className="flex justify-between">
                    <h2 className="card-title drop-shadow-lg">{event.name}</h2>
                    <p className={`drop-shadow-lg font-extrabold ml-2 ${statusCheckResult == "ended" ? "text-red-500" : (statusCheckResult == "started" ? "text-green-500" : "text-blue-400")}`}>
                        {
                            (statusCheckResult == "ended")
                            ?
                            ("Véget ért")
                            :
                            (
                                (statusCheckResult == "started")
                                ?
                                ("Elkezdődött")
                                :
                                ("Nem megkezdett")
                            )
                        }
                    </p>
                    <img className="w-10 h-10 rounded-full drop-shadow-lg object-cover" src={import.meta.env.VITE_BASE_URL + `${import.meta.env.VITE_BASE_PIC}${eventPicPath}`} alt="User Profile" />
                </div>


                <div className="flex justify-evenly border-t border-white my-2 pt-2">
                    <p className="drop-shadow-lg text-stone-300 font-extrabold">Kezdés:</p>
                    <div>
                        {
                            (statusCheckResult == "ended" || statusCheckResult == "started")
                                ?
                                (<p className="text-red-500 italic">{formatDate(new Date(event.start_date))}</p>)
                                :
                                (<div className="grid grid-flow-col gap-1 text-center auto-cols-max">
                                    <div className="flex flex-col p-2 bg-red-300 text-indigo-950 rounded-box ">
                                        <span className="countdown font-mono text-2xl" aria-label={`${timeLeftToStart.days} days`}>
                                            {timeLeftToStart.days}
                                        </span>
                                        nap
                                    </div>
                                    <div className="flex flex-col p-2 rounded-box bg-red-300 text-indigo-950 ">
                                        <span className="countdown font-mono text-2xl" aria-label={`${timeLeftToStart.hours} hours`}>
                                            {timeLeftToStart.hours}
                                        </span>
                                        óra
                                    </div>
                                    <div className="flex flex-col p-2 rounded-box bg-red-300 text-indigo-950">
                                        <span className="countdown font-mono text-2xl" aria-label={`${timeLeftToStart.minutes} minutes`}>
                                            {timeLeftToStart.minutes}
                                        </span>
                                        perc
                                    </div>
                                    <div className="flex flex-col p-2 rounded-box bg-red-300 text-indigo-950">
                                        <span className="countdown font-mono text-2xl" aria-label={`${timeLeftToStart.seconds} seconds`}>
                                            {timeLeftToStart.seconds}
                                        </span>
                                        mp
                                    </div>
                                </div>)
                        }
                    </div>
                </div>

                <div className="flex justify-evenly border-t border-white my-2 pt-2">
                    <p className="drop-shadow-lg text-stone-300 font-extrabold">Vége:</p>
                    {
                        (statusCheckResult == "started")
                            ?
                            (<div>
                                <div className="grid grid-flow-col gap-1 text-center auto-cols-max">
                                    <div className="flex flex-col p-2 rounded-box bg-red-300 text-indigo-950">
                                        <span className="countdown font-mono text-2xl" aria-label={`${timeLeftToEnd.days} days`}>
                                            {timeLeftToEnd.days}
                                        </span>
                                        days
                                    </div>
                                    <div className="flex flex-col p-2 rounded-box bg-red-300 text-indigo-950">
                                        <span className="countdown font-mono text-2xl" aria-label={`${timeLeftToEnd.hours} hours`}>
                                            {timeLeftToEnd.hours}
                                        </span>
                                        hours
                                    </div>
                                    <div className="flex flex-col p-2 rounded-box bg-red-300 text-indigo-950">
                                        <span className="countdown font-mono text-2xl" aria-label={`${timeLeftToEnd.minutes} minutes`}>
                                            {timeLeftToEnd.minutes}
                                        </span>
                                        min
                                    </div>
                                    <div className="flex flex-col p-2 rounded-box bg-red-300 text-indigo-950">
                                        <span className="countdown font-mono text-2xl" aria-label={`${timeLeftToEnd.seconds} seconds`}>
                                            {timeLeftToEnd.seconds}
                                        </span>
                                        sec
                                    </div>
                                </div>
                            </div>)
                            :
                            (<p className="text-red-500 italic">{formatDate(new Date(event.end_date))}</p>)
                    }

                </div>

                <div className="flex justify-evenly border-t border-white my-2 pt-2">
                    <p className="drop-shadow-lg text-stone-300 font-extrabold flex-none">Hely:</p>
                    <p className="drop-shadow-lg ml-10">{event.place}</p>
                </div>

                <div className="flex justify-evenly">
                    <p className="drop-shadow-lg text-stone-300 font-extrabold flex-none">Információ:</p>
                    <p
                        className={`ml-7 drop-shadow-lg inline-block max-w-xs overflow-hidden ${!showFull ? "whitespace-nowrap" : ""}`}
                        style={
                            !showFull
                                ? {
                                    WebkitMaskImage: "linear-gradient(to left, transparent, black 40%)",
                                    maskImage: "linear-gradient(to left, transparent, black 40%)",
                                    WebkitMaskSize: "100% 100%",
                                    maskSize: "100% 100%",
                                }
                                : {}
                        }
                    >
                        {event.details}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center border-t border-white my-2 pt-4">
                    <button
                        className="btn btn-sm btn-outline btn-accent"
                        onClick={() => setShowFull((prev) => !prev)}
                    >
                        {showFull ? "Rövid info" : "Teljes info"}
                    </button>

                    {
                        (event.ogr_id == profile.id)?(
                            
                                <button className="btn btn-sm btn-outline btn-info" onClick={()=>{navigate(`/event/${event.id}`)}}>Esemény szerkesztése</button>
                            
                        ):(

                        <button
                        className="btn btn-sm btn-outline btn-info"
                        onClick={() => navigate(`/event/${event.id}`)}>
                        Esemény részletei
                        </button>


                        )
                    }
                    
                </div>
                
            </div>
        </div>
    );
}

export default EventSchema;
