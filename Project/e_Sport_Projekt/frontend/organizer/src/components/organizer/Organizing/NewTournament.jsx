import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import OrganizerContext from "../../../context/OrganizerContext";
import { toast } from "react-toastify";

function NewTournament() {


  const {isAuthenticated, authStatus, profile} = useContext(OrganizerContext);
  const [isloading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [game, setGame] = useState("");
  const [event, setEvent] = useState("");
  const [games, setGames] = useState([]);
  const navigate = useNavigate();


  let formObj = {
    name: "",
    num_participant: "",
    team_num: "",
    start_date: "",
    end_date: "",
    game_mode: "",
    max_participant: "",
    apn_start: "",
    apn_end: "",
    details: "",
    evt_id: "",
    gae_id: ""

  };



    useEffect(()=>{


      

      if(isAuthenticated){


        fetch(`${import.meta.env.VITE_BASE_URL}/list/game`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        })
        .then(res=>res.json())
        .then(adat=> {setGames(adat); setRefresh(false)})
        .catch(err=>alert(err));
  
        

        
  
        fetch(`${import.meta.env.VITE_BASE_URL}/list/eventsearchbyorganizer`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({id: profile.id})
            
        })
        .then(res=>res.json())
        .then(adat=> {setEvents(adat); setRefresh(false); setIsLoading(false)})
        .catch(err=>alert(err));
      }

      



    },[isAuthenticated])




  const [formData, setFormData] = useState(formObj);



  const dateFormat = (date) => {
    console.log(date);
  
    if (date != undefined) {
      const localDate = new Date(date); // Konvertálás Date objektummá
      const ev = localDate.getFullYear();
      const honap = String(localDate.getMonth() + 1).padStart(2, '0'); // Hónap 0-alapú
      const nap = String(localDate.getDate()).padStart(2, '0');
      const ora = String(localDate.getHours()).padStart(2, '0');
      const perc = String(localDate.getMinutes()).padStart(2, '0');
  
      return `${ev}-${honap}-${nap}T${ora}:${perc}`;
    } else {
      return ``;
    }
  };


  const kuldes = (method, formData) => {


    fetch(`${import.meta.env.VITE_BASE_URL}/insert/tournament`, {
      method: method,
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        num_participant: parseInt(formData.num_participant),
        team_num: parseInt(formData.team_num),
        start_date: formData.start_date,
        end_date: formData.end_date,
        game_mode: formData.game_mode,
        max_participant: parseInt(formData.max_participant),
        apn_start: formData.apn_start,
        apn_end: formData.apn_end,
        details: formData.details,
        evt_id: event,
        gae_id: game

      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {

          toast.error(data.message);
        } else {
          toast.success(data.message);
          authStatus();
          navigate('/');
          

        }

      }).catch(err => alert(err));

  };


  const onSubmit = (e) => {
    e.preventDefault();
    kuldes('POST', formData);
  };

  const writeData = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));

    console.log(formData)
  };



  return (
    <>
      {
        (isloading)?
        (
          <p></p>
        )
        :
        (

          <div className="m-10 rounded-md bg-gradient-to-br from-indigo-950 to-slate-500 sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] mx-auto text-primary-content">
                    <div className="card-body">
                    <div className="flex justify-center pb-8 gap-10">
                          <img className="w-56 h-56" src={`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_BASE_PIC}/tournament/tournament_0.png`} />
                          <div className="card-title">
                            <div className="pl-14">
                              <p className="text-3xl pb-2 text-indigo-500 font-bold">{"Verseny felvitele"}</p>
                              
                            </div>
                          </div>
                        </div>


                    <form onSubmit={onSubmit}>
                      <div className="w-full mx-auto rounded-lg shadow-lg md:mt-6 md:max-w-full sm:max-w-4xl xl:p-0 bg-gray-800 dark:border-gray-700">
                        <div className="p-8 md:p-10">
                        
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                            <div key={'name'}>
                              <label className="block text-sm font-medium text-white">
                                Név(*)
                              </label>
                              <input id="name" type="text" onChange={writeData} value={formData.name} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                            </div>

                            <div key={'num_participant'}>
                              <label className="block text-sm font-medium text-white">
                                Résztvevők száma(*)
                              </label>
                              <input id="num_participant" onChange={writeData} type="number" min={1} max={32} value={formData.num_participant} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                            </div>

                            <div key={'start_date'}>
                              <label className="block text-sm font-medium text-white">
                                Verseny kezdete(*)
                              </label>
                              <input id="start_date" onChange={writeData} type="datetime-local" value={dateFormat(formData.start_date)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                            </div>

                            <div key={'end_date'}>
                              <label className="block text-sm font-medium text-white">
                                Verseny vége(*)
                              </label>
                              <input id="end_date" onChange={writeData} type="datetime-local" value={dateFormat(formData.end_date)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                            </div>

                            <div key={'apn_start'}>
                              <label className="block text-sm font-medium text-white">
                                Jelentkezés kezdete(*)
                              </label>
                              <input id="apn_start" onChange={writeData} type="datetime-local" value={dateFormat(formData.apn_start)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                            </div>

                            <div key={'apn_end'}>
                              <label className="block text-sm font-medium text-white">
                                Jelentkezés vége(*)
                              </label>
                              <input id="apn_end" onChange={writeData} type="datetime-local" value={dateFormat(formData.apn_end)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                            </div>

                            <div key={'max_participant'}>
                              <label className="block text-sm font-medium text-white">
                                Maximum résztvevők száma(*)
                              </label>
                              <input id="max_participant" onChange={writeData} type="number" min={1} max={32} value={formData.max_participant} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                            </div>

                            <div key={'evt_id'}>
                              <label className="block text-sm font-medium text-white">
                                Esemény(*)
                              </label>
                              <select value={event[0]} onChange={writeData} id="evt_id" defaultValue="Pick a color" className="select mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm">
                                <option disabled={true}>Esemény</option>
                                {
                                  events.map((e)=>(
                                    <>
                                      <option onClick={()=> setEvent(e.id)} key={e.id}>{e.name}</option>
                                    </>
                                ))
                                }
                              </select>
                            </div>

                            <div key={'gae_id'}>
                              <label className="block text-sm font-medium text-white">
                                Játék(*)
                              </label>
                              <select value={game[0]} onChange={writeData} id="gae_id" defaultValue="Pick a color" className="select mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm">
                                <option disabled={true}>Játék</option>
                                {
                                  games.map((g)=>(
                                    <>
                                      <option onClick={()=> setGame(g.id)} key={g.id}>{g.name}</option>
                                    </>
                                ))
                                }
                              </select>
                            </div>

                            <div key={'game_mode'}>
                              <label className="block text-sm font-medium text-white">
                                Játékmód(*)
                              </label>
                              <input id="game_mode" onChange={writeData} type="text" value={formData.game_mode} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                            </div>

                            <div key={'team_num'}>
                              <label className="block text-sm font-medium text-white">
                                Csapatok száma
                              </label>
                              <input id="team_num" onChange={writeData} type="number" min={1} value={formData.team_num} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                            </div>

                            

                          </div>
                          <div key={'details'} className="mt-6">
                              <label className="block text-sm font-medium text-white">
                                Leírás
                              </label>
                              <input id="details" type="text" onChange={writeData} value={formData.details} className="mt-1 block w-full h-auto hyphens-auto px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                            </div>
                        </div>
                        <div className="flex flex-row justify-center">
                          <button className="btn mt-3 text-white w-32 m-5" type="submit">Létrehozás</button>
                        </div>
                        
                      </div>
                    </form>
                      


                    </div>
                    

                  </div>



        )
      }
            
                
    </>
  )
}

export default NewTournament