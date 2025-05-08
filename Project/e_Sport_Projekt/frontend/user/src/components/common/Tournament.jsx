import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import UserContext from "../../context/UserContext";
import { toast } from "react-toastify";
import ApplicationCard from "../user/ApplicationCard";
import MatchSchema from "./schemas/MatchSchema";

function Tournament() {

  const { id } = useParams();
  const { isAuthenticated, authStatus, profile } = useContext(UserContext);
  const [tournament, setTournament] = useState([]);
  const [event, setEvent] = useState([]);
  const [game, setGame] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const [picPath, setPicPath] = useState("");
  const [applicationsTeam, setApplicationsTeam] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [team, setTeam] = useState("");
  const [canApply, setCanApply] = useState(true);
  const [isApplication, setIsApplication] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();



  useEffect(() => {

    window.scroll(0, 0)



    fetch(`${import.meta.env.VITE_BASE_URL}/list/tntsearchid/${id}`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
    }).then(res => res.json())

      .then(adat => {

        if (adat.message) {
          navigate('/');
        }

        setTournament(adat); setIsLoading(false);

        setPicPath(
          fetch(`${import.meta.env.VITE_BASE_URL}/list/tournamentpic/${id}`, {
            method: "GET",
            headers: { "Content-type": "application/json" },
          }).then(res => res.json())
            .then(adat => {
              setPicPath(adat); applicationsFetch(); setIsLoading(false);

              setEvent(
                fetch(`${import.meta.env.VITE_BASE_URL}/list/event/${tournament.evt_id}`, {
                  method: "GET",
                  headers: { "Content-type": "application/json" },
                }).then(res => res.json())
                  .then(adat => {
                    setEvent(adat); setIsLoading(false);
                    setGame(
                      fetch(`${import.meta.env.VITE_BASE_URL}/list/game`, {
                        method: "GET",
                        headers: { "Content-type": "application/json" },
                      }).then(res => res.json())
                        .then(adat => {
                          setGame(
                            adat.find((x) => x.id == tournament.gae_id)
                          ); 
                          let today = new Date(Date.now()).toISOString();
                          setCanApply(Boolean(((today > tournament.apn_start) && (today < tournament.apn_end))));
                          setIsLoading(false);
                        }
                        )
                    )
                  })
                  .catch(err => alert(err))
              )


            })
            .catch(err => alert(err))
        );




      })
      .catch(err => alert(err));

      matchesFetch();

    //console.log(event)

  }, [isloading])



  const matchesFetch = () => {

    fetch(`${import.meta.env.VITE_BASE_URL}/list/matches/${id}`, {
      method: "GET",
      headers: { "Content-type": "application/json" },
    })
      .then(res => res.json())
      .then(adat => {
        setMatches(adat.matches);

      })
      .catch(err => alert(err));


  };


  const myTeamsFetch = () => {

    fetch(`${import.meta.env.VITE_BASE_URL}/list/myteams/${profile.id}`, {
      method: "GET",
      headers: { "Content-type": "application/json" },
    })
      .then(res => res.json())
      .then(adat => {
        setMyTeams(adat);

      })
      .catch(err => alert(err));
  }

  const teamMembersFetch = (team) => {
    fetch(`${import.meta.env.VITE_BASE_URL}/list/team/${team}/members`, {
      method: "GET",
      headers: { "Content-type": "application/json" },
    })
      .then(res => res.json())
      .then(adat => {
        setTeamMembers(adat);

      })
      .catch(err => alert(err));
  }

  const selectMember = (e) => {



    //document.getElementById(`option-${member}`).classList.replace('text-white', 'text-green-500');
    //toast.error(`Magaddal együtt annyi tagot kell kiválassz, amennyi csapattagszám van meghatározva! (${tournament.team_num} fő)`);
    //document.getElementById(`option-${member}`).classList.replace('text-green-500', 'text-white');

    setSelectedMembers((prevMembers) => {
      if (prevMembers.includes(e)) {

        document.getElementById(`option-${e}`).classList.replace('text-green-500', 'text-white');

        return prevMembers.filter(member => member !== e);

      } else {

        document.getElementById(`option-${e}`).classList.replace('text-white', 'text-green-500');

        return [...prevMembers, e];
      }
    });


  }




  const applicationSend = (tnt_id, tem_id, members) => {

    if (members.length > tournament.team_num || members.length < tournament.team_num - 1) {
      toast.error(`Magaddal együtt annyi tagot kell kiválassz, amennyi csapattagszám van meghatározva! (${tournament.team_num} fő)`);
    } else {



      fetch(`${import.meta.env.VITE_BASE_URL}/insert/application/submit`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          tnt_id: tnt_id,
          tem_id: tem_id,
          uer1_id: profile.id,
          uer2_id: members[0],
          uer3_id: members[1],
          uer4_id: members[2],
          uer5_id: members[3],
        })
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) {

            toast.error(data.message);
          } else {
            toast.success(data.message);
          }
        })
        .catch((err) => alert(err));
    }
  };




  const applicationsFetch = () => {
    let obj = [];


    fetch(`${import.meta.env.VITE_BASE_URL}/list/tnt-applications`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        uer1_id: profile.id,
        tnt_id: tournament.id
      })
    }).then(res => res.json())
      .then(adat => {
        if (!adat.message) {

          adat.map((x) => (obj.push(x.team)))
          setApplicationsTeam(adat);

        }

      }).catch(err => alert(err))

    setApplicationsTeam(obj);
  }



  const dateFormat = (dateTime) => {
    if (dateTime) {
      const [date, time] = dateTime.split('T'); // Szétválasztjuk a dátumot és az időt
      const [ev, honap, nap] = date.split('-'); // A dátumot év, hónap, nap részekre bontjuk
      const [ora, perc] = time.split(':'); // Az időt óra és perc részekre bontjuk

      return `${ev}. ${honap}. ${nap}. ${ora}:${perc}`; // Formázott visszatérési érték
    } else {
      return '';
    }
  };




  return (
    <>
      <div className="m-10 rounded-md bg-gradient-to-br from-indigo-950 to-slate-500 sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] mx-auto text-primary-content">
        <div className="card-body">
          <div className="flex justify-center pb-8 gap-10">
            <img className="w-56 h-56" src={`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_BASE_PIC}${picPath}`} alt={`${tournament.name} profilképe`} title={`${tournament.name} profilképe`} />
            <div className="card-title">
              <div className="pl-14">
                <p className="text-3xl pb-2 text-white">{tournament.name}</p>
                <div className="mt-2">
                  {
                    (!isAuthenticated) ? (
                      <>
                      </>
                    ) : (

                      (!canApply) ? (
                        <>
                        </>
                      ) : (
                        (!isApplication) ? (
                          <>
                            <button onClick={() => { setIsApplication(true); myTeamsFetch(); }} className="btn bg-indigo-600 border-none text-white hover:bg-indigo-700">Jelentkezés a versenyre</button>
                          </>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-row gap-2">
                              <button className="btn btn-success" onClick={() => { applicationSend(tournament.id, team, selectedMembers); }}>Jelentkezés beküldése</button>
                              <button onClick={() => { setIsApplication(false); setTeam(""); setTeamMembers([]); }} className="btn btn-error">Mégse</button>
                            </div>
                            <select id="myTeams" defaultValue="Csapataim" className="select mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm">
                              <option disabled={true}>Csapataim</option>
                              {
                                (myTeams.length == 0) ? (
                                  <>
                                    <option disabled={true}>Nincsen csapatod!</option>
                                  </>
                                ) : (
                                  myTeams.map((e) => (
                                    <>
                                      <option onClick={() => { setTeam(e.id); teamMembersFetch(e.id) }} key={e.id}>{e.full_name}</option>
                                    </>
                                  ))
                                )
                              }
                            </select>

                            <select id="teamMembers" defaultValue="Csapataim" className="select mt-1 block w-auto px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm">
                              <option disabled={true}>Csapattagok</option>
                              {
                                (teamMembers.length == 0) ? (
                                  <>
                                    <option disabled={true}></option>
                                  </>
                                ) : (
                                  teamMembers.map((e) => (
                                    (e.id != profile.id) ? (
                                      <>
                                        <option id={`option-${e.id}`} className="text-white" key={e.id} onClick={() => { selectMember(e.id); }}>{e.full_name} ({e.usr_name})</option>
                                      </>
                                    ) : (
                                      <></>
                                    )
                                  ))
                                )
                              }
                            </select>
                          </div>
                        )
                      )
                    )
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-b border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm text-white font-bold">
                  Név
                </dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                  <p>{tournament.name}</p>
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm text-white font-bold">
                  Résztvevők száma
                </dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                  <p>{tournament.num_participant}</p>
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm text-white font-bold">
                  Verseny kezdete
                </dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                  <p>{dateFormat(tournament.start_date)}</p>
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm text-white font-bold">
                  Verseny vége
                </dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                  <p>{dateFormat(tournament.end_date)}</p>
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm text-white font-bold">
                  Jelentkezés kezdete
                </dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                  <p>{dateFormat(tournament.apn_start)}</p>
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm text-white font-bold">
                  Jelentkezés vége
                </dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                  <p>{dateFormat(tournament.apn_end)}</p>
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm text-white font-bold">
                  Maximális résztvevők száma
                </dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                  <p>{tournament.max_participant}</p>
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm text-white font-bold">
                  Esemény
                </dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                  <p>{event.name}</p>
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm text-white font-bold">
                  Játék
                </dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                  <p>{
                    (!game) ? (<p></p>) : (<>{game.name}</>)
                  }</p>
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm text-white font-bold">
                  Játékmód
                </dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                  <p>{tournament.game_mode}</p>
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm text-white font-bold">
                  Csapatok száma
                </dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                  <p>{tournament.team_num}</p>
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm text-white font-bold">
                  Leírás
                </dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                  <p className="break-words overflow-hidden max-w-full" >{tournament.details}</p>
                </dd>
              </div>
            </dl>
          </div>

          {
            (!isAuthenticated) ? (
              <></>
            ) : (
              <>
                <div className="w-full mb-10 mx-auto rounded-lg shadow-lg md:mt-6 md:max-w-full sm:max-w-4xl xl:p-0 bg-gray-800 dark:border-gray-700 pt-10">
                  <div className="flex flex-row horizontal justify-center mt-10 gap-5">
                    <h2 className="text-center text-4xl font-bold tracking-tight text-indigo-600">
                      Leadott jelentkezéseim
                    </h2>
                    <button onClick={() => { applicationsFetch(); }} className="btn border-none bg-indigo-600 hover:bg-indigo-800"><img className="h-5" src="https://www.svgrepo.com/show/533694/refresh-ccw.svg" /></button>
                  </div>

                  <div className="mx-auto mt-5 h-1 w-[60%] bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full" />
                  <div className="p-8 md:p-10">

                    <div className="flex flex-col">
                      <div className="grid xl:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-12 justify-items-center">

                        {
                          applicationsTeam.map((application) => (
                            <ApplicationCard key={application.id} team={application.team} application={application} tournament={application.tournament} />))

                        }
                      </div>
                    </div>



                  </div>
                </div>
              </>
            )
          }


              <div className="w-full mb-10 mx-auto rounded-lg shadow-lg md:mt-6 md:max-w-full sm:max-w-4xl xl:p-0 bg-gray-800 dark:border-gray-700 pt-10">
                  <div className="flex flex-row horizontal justify-center mt-10 gap-5">
                    <h2 className="text-center text-4xl font-bold tracking-tight text-indigo-600">
                      Meccsek
                    </h2>
                    <button onClick={() => { matchesFetch(); console.log(matches)}} className="btn border-none bg-indigo-600 hover:bg-indigo-800"><img className="h-5" src="https://www.svgrepo.com/show/533694/refresh-ccw.svg" /></button>
                  </div>

                  <div className="mx-auto mt-5 h-1 w-[60%] bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full" />
                  <div className="p-8 md:p-10">

                    <div className="flex flex-col">
                      <div className="grid xl:grid-cols-1 md:grid-cols-1 sm:grid-cols-1 gap-12 justify-items-center">

                        {
                          matches.map((match) => (
                            <MatchSchema key={match.id} match={match} />
                          ))
                        }
                        
                      </div>
                    </div>


                    
                  </div>
                </div>


        </div>
      </div>
    </>
  )
}

export default Tournament