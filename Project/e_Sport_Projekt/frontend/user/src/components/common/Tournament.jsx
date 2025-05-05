import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import UserContext from "../../context/UserContext";

function Tournament() {

    const { id } = useParams();
    const {isAuthenticated, authStatus, profile} = useContext(UserContext);
    const [tournament, setTournament] = useState([]);
    const [event, setEvent] = useState([]);
    const [game, setGame] = useState([]);
    const [isloading, setIsLoading] = useState(true);
    const [organizer, setOrganizer] = useState([]);
    const [picPath, setPicPath] = useState("");
    const navigate = useNavigate();



  useEffect(()=>{
  
    window.scroll(0,0)

    

      fetch(`${import.meta.env.VITE_BASE_URL}/list/tntsearchid/${id}`,{
        method: "POST",
        headers: { "Content-type": "application/json" },
      }).then(res=>res.json())
      
      .then(adat=> {

        if(adat.message){
          navigate('/');
        }
        
        setTournament(adat); setIsLoading(false);

        setPicPath(
          fetch(`${import.meta.env.VITE_BASE_URL}/list/tournamentpic/${id}`,{
            method: "GET",
            headers: { "Content-type": "application/json" },
          }).then(res=>res.json())
          .then(adat=> {setPicPath(adat); setIsLoading(false);

            setEvent(
              fetch(`${import.meta.env.VITE_BASE_URL}/list/event/${tournament.evt_id}`,{
              method: "GET",
              headers: { "Content-type": "application/json" },
            }).then(res=>res.json())
            .then(adat=> {setEvent(adat); setIsLoading(false);
              setGame(
                fetch(`${import.meta.env.VITE_BASE_URL}/list/game`,{
                  method: "GET",
                  headers: { "Content-type": "application/json" },
                }).then(res=>res.json())
                .then(adat=> {
                    setGame(
                      adat.find((x)=>x.id == tournament.gae_id)
                    ); setIsLoading(false)
                }
              )
            )})
            .catch(err=>alert(err))
          )


          })
          .catch(err=> alert(err))
        );
  
        
  
  
      })
      .catch(err=> alert(err));
  
      console.log(event)
  
    


  },[isloading])



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
                              (!game)?(<p></p>):(<>{game.name}</>)
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
                            <p>{tournament.details}</p>
                          </dd>
                        </div>
                      </dl>
                    </div>

                    

                    
                  </div>
                </div>
                
              </>
  )
}

export default Tournament