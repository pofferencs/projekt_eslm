import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import UserContext from "../../context/UserContext";
import TournamentSchema from "./schemas/TournamentSchema";


function Event() {



    const { id } = useParams();
    const {isAuthenticated, authStatus, profile} = useContext(UserContext);
    const [event, setEvent] = useState([]);
    const [isloading, setIsLoading] = useState(true);
    const [organizer, setOrganizer] = useState([]);
    const [picPath, setPicPath] = useState("");
    const [tournaments, setTournaments] = useState([]);
    const navigate = useNavigate();


    useEffect(()=>{

        window.scroll(0,0)
    
       
            fetch(`${import.meta.env.VITE_BASE_URL}/list/event/${id}`,{
                method: "GET",
                headers: { "Content-type": "application/json" },
              }).then(res=>res.json())
              .then(adat=> {

                if(adat.message){
                    navigate('/');
                }
      
                  setEvent(adat); setIsLoading(false);          
          
                setPicPath(
                  fetch(`${import.meta.env.VITE_BASE_URL}/list/eventpic/${event.id}`,{
                    method: "GET",
                    headers: { "Content-type": "application/json" },
                  }).then(res=>res.json())
                  .then(adat=> {setPicPath(adat); setIsLoading(false);
          
                    setOrganizer(
                      fetch(`${import.meta.env.VITE_BASE_URL}/list/organizerid`,{
                        method: "POST",
                        headers: { "Content-type": "application/json" },
                        body: JSON.stringify({
                          
                            id: event.ogr_id
                          
                        })
                      }).then(res=>res.json())
                      .then(adat=> {setOrganizer(adat); setIsLoading(false);
                      }
                    )
          
          
                  )})
                  .catch(err=> alert(err))
                );
          
                fetch(`${import.meta.env.VITE_BASE_URL}/list/tournamentbyeventname`,{
                  method: "POST",
                  headers: { "Content-type": "application/json" },
                  body: JSON.stringify({
                    name: event.name
                          
                  })
                }).then(res=>res.json())
                .then(adat=> {setTournaments(adat); setIsLoading(false);})
                .catch(err=>alert(err));
          
          
              })
              .catch(err=> alert(err));
        

        // if(event){
        //     console.log({eventecske: event})
        // }  
    
        //console.log(event)
    
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
        {
            (isloading)?(
                <>
                </>
            ):
            (

                <div className="m-10 rounded-md bg-gradient-to-br from-indigo-950 to-slate-500 sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] mx-auto text-primary-content">
                        <div className="card-body">
                            <div className="flex justify-center pb-8 gap-10">
                            <img className="w-56 h-56" src={`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_BASE_PIC}${picPath}`} alt={`${event.name} profilképe`} title={`${event.name} profilképe`} />
                            <div className="card-title">
                                <div className="pl-14">
                                <p className="text-3xl pb-2 text-white">{event.name}</p>
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
                            <p>{event.name}</p>
                          </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                            Hely
                          </dt>
                          <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                            <p>{event.place}</p>
                          </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                            Kezdés
                          </dt>
                          <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                            <p>{dateFormat(event.start_date)}</p>
                          </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                            Vége
                          </dt>
                          <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                            <p>{dateFormat(event.end_date)}</p>
                          </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                            Szervező
                          </dt>
                          <dd className="mt-1 text-sm text-indigo-500 hover:text-indigo-600 sm:mt-0 sm:col-span-2">
                          <Link to={`/organizer/profile/${organizer.usr_name}`}><p>{organizer.full_name}</p></Link>
                          </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                            Leírás
                          </dt>
                          <dd className="mt-1 break-words overflow-hidden max-w-full text-sm text-white sm:mt-0 sm:col-span-2">
                            <p>{event.details}</p>
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="w-full mb-10 mx-auto rounded-lg shadow-lg md:mt-6 md:max-w-full sm:max-w-4xl xl:p-0 bg-gray-800 dark:border-gray-700">
                    <h2 className="mt-10 text-center text-4xl font-bold tracking-tight text-indigo-600">
                      Az esemény versenyei
                    </h2>

                    <div className="mx-auto mt-5 h-1 w-[60%] bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full" />
                      
                  <div className="p-8 md:p-10">

                     <div className="flex flex-col">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-items-center">
                        {
                          (!tournaments.length == 0)?(
                            tournaments.map((t,i)=>(
  
                              <TournamentSchema key={i} tournament={t}/>
                          
                          ))
                          ):(
                            <div className="p-8 md:p-10">

                              <p className="text-center text-gray-500 mt-10">Nincsenek még versenyek!</p>

                            </div>
                          )
                        }
                      </div>
                     </div>
                    
                    
                  </div>
                      </div> 


                    
                  </div>
                </div>
            )
                }
                
              </>


    
  )
}

export default Event