import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import OrganizerContext from "../../../context/OrganizerContext";
import { toast } from "react-toastify";
import ApplicationCard from "./ApplicationCard";
import MatchSchema from "../../common/schemas/MatchSchema";

function Tournament() {


  const { id } = useParams();
  const {isAuthenticated, authStatus, profile} = useContext(OrganizerContext);
  const [tournament, setTournament] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [pendingTeams, setPendingTeams] = useState([]);
  const [approvedTeams, setApprovedTeams] = useState([]);
  const [event, setEvent] = useState([]);
  const [game, setGame] = useState([]);
  const [gameName, setGameName] = useState("");
  const [isloading, setIsLoading] = useState(true);
  const [organizer, setOrganizer] = useState([]);
  const [picPath, setPicPath] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [isValami, setIsValami] = useState(true);
  const [isForm, setIsForm] = useState(false);
  const [pfpFile, setPfpFile] = useState({});
  const [detailsNum, setDetailsNum] = useState(0);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [apnMinDate, setApnMinDate] = useState("");
  const [apnMaxDate, setApnMaxDate] = useState("");
  const [matches, setMatches] = useState([]);
  const [dateData, setDateData] = useState({
    start_date: "",
    end_date: ""
    
  })
  const navigate = useNavigate();


  useEffect(()=>{
  
      window.scroll(0,0)
      setDisabled(true);
      

        fetch(`${import.meta.env.VITE_BASE_URL}/list/tntsearchid/${id}`,{
          method: "POST",
          headers: { "Content-type": "application/json" },
        }).then(res=>res.json())
        .then(adat=> {
          if(adat.message){
            navigate('/');
          }
          setTournament(adat); setFormData(adat);;
          setDetailsNum(adat.details.length);
          setPicPath(
            fetch(`${import.meta.env.VITE_BASE_URL}/list/tournamentpic/${id}`,{
              method: "GET",
              headers: { "Content-type": "application/json" },
            }).then(res=>res.json())
            .then(adat=> {setPicPath(adat);

              setEvent(
                fetch(`${import.meta.env.VITE_BASE_URL}/list/event/${tournament.evt_id}`,{
                method: "GET",
                headers: { "Content-type": "application/json" },
              }).then(res=>res.json())
              .then(adat=> {
                setEvent(adat); 
                setMinDate(dateFormat(adat.start_date)); 
                setMaxDate(dateFormat(adat.end_date));
                setApnMinDate(apnMinTimeSet(adat.start_date));
                setApnMaxDate(apnMaxTimeSet(adat.end_date))

                setGame(
                  fetch(`${import.meta.env.VITE_BASE_URL}/list/game`,{
                    method: "GET",
                    headers: { "Content-type": "application/json" },
                  }).then(res=>res.json())
                  .then(adat=> {
                      setGame(
                        adat.find((x)=>x.id == tournament.gae_id)
                      );  
                      
                     
                        pendingFetch();
                        approvedFetch();
                        //authStatus()
                        formReset()
                        setIsLoading(false);
                      
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

        
        matchesFetch();

    },[isloading])


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


    const pendingFetch = () => {
      let obj = [];

      setPendingApplications([]);
      
      fetch(`${import.meta.env.VITE_BASE_URL}/list/pending/${id}`,{
        method: "GET",
        headers: { "Content-type": "application/json" },
      }).then(res=>res.json())
      .then(adat=>
        {
        if(!adat.message){
          
          adat.map((x)=>(obj.push(x.team)))
          setPendingApplications(adat);
          
          
        }

      }).catch(err=>alert(err))

      setPendingTeams(obj);
    }

    const approvedFetch = () => {
      let obj = [];
      setApprovedApplications([]);


      fetch(`${import.meta.env.VITE_BASE_URL}/list/approved/${id}`,{
        method: "GET",
        headers: { "Content-type": "application/json" },
      }).then(res=>res.json())
      .then(adat=>
        {
        if(!adat.message){
          
          adat.map((x)=>(obj.push(x.team)))
          setApprovedApplications(adat);
          
        }

      }).catch(err=>alert(err))

      setApprovedTeams(obj);
    }
  
  
    const [formData, setFormData] = useState({
      name: "",
      num_participant: "",
      team_num: "",
      game_mode: "",
      max_participant: "",
      details: "",
      evt_id: "",
      gae_id: ""

    });
    
    const dateFormat = (date) => {
    
      if (date != undefined) {
        const localDate = new Date(date);
        const ev = localDate.getFullYear();
        const honap = String(localDate.getMonth() + 1).padStart(2, '0');
        const nap = String(localDate.getDate()).padStart(2, '0');
        const ora = String(localDate.getHours()).padStart(2, '0');
        const perc = String(localDate.getMinutes()).padStart(2, '0');
    
        return `${ev}-${honap}-${nap}T${ora}:${perc}`;
      } else {
        return ``;
      }
    };

    const formatDateTime = (dateTime) => {
      if (dateTime) {
        const [date, time] = dateTime.split('T');
        const [ev, honap, nap] = date.split('-');
        const [ora, perc] = time.split(':');
    
        return `${ev}. ${honap}. ${nap}. ${ora}:${perc}`; 
      } else {
        return '';
      }
    };



    const apnMinTimeSet = (startDate) =>{

      if(startDate!=undefined){
        const tournamentStartDate = new Date(dateFormat(startDate))
        tournamentStartDate.setTime(tournamentStartDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        const ev = tournamentStartDate.getFullYear();
        const honap = String(tournamentStartDate.getMonth() + 1).padStart(2, '0');
        const nap = String(tournamentStartDate.getDate()).padStart(2, '0');
        const ora = String(tournamentStartDate.getHours()).padStart(2, '0');
        const perc = String(tournamentStartDate.getMinutes()).padStart(2, '0');
    
        return `${ev}-${honap}-${nap}T${ora}:${perc}`
      }
  
    }
  
    const apnMaxTimeSet = (endDate) =>{
  
      if(endDate!=undefined){
        const tournamentStartDate = new Date(endDate)
        tournamentStartDate.setTime(tournamentStartDate.getTime() - 7 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000 + 58 * 60 * 1000);
        const ev = tournamentStartDate.getFullYear();
        const honap = String(tournamentStartDate.getMonth() + 1).padStart(2, '0');
        const nap = String(tournamentStartDate.getDate()).padStart(2, '0');
        const ora = String(tournamentStartDate.getHours()).padStart(2, '0');
        const perc = String(tournamentStartDate.getMinutes()).padStart(2, '0');
    
        return `${ev}-${honap}-${nap}T${ora}:${perc}`
      }
  
    }
  
  
    const onSubmit = (e) => {
      e.preventDefault();
      modify('PATCH', formData);
    };
  
    const writeData = (e) => {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    };
  
  
  
  
  const sendImage = async (file, type, id) => {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", type);  // pl. 'user'
      formData.append("id", id);      // pl. 0
    
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/insert/upload`, {
          method: "POST",
          body: formData
        });
    
        const data = await res.json();
    
        if (!res.ok) {
          toast.error(data.message || "Hiba történt");
        } else {
          toast.success(data.message);
          authStatus();
          setIsLoading(true);
        }
      } catch (error) {
        alert("Hiba a feltöltés során: " + error.message);
      }
  
      
    };
  
    const deleteImage = async (id, type) => {
  
      
      fetch(`${import.meta.env.VITE_BASE_URL}/delete/picture`, {
          method: "DELETE",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({id: id, type: type})
        })
        .then(async res=>{
          const data = await res.json();
    
        if (!res.ok) {
          toast.error(data.message || "Hiba történt");
        } else {
          toast.success(data.message);
        }
        })
        .catch(err=>alert(err));
    
        
      
    };
  
  
  
    const modify = (method, formData) => {
  
      console.log(formData)
  
      fetch(`${import.meta.env.VITE_BASE_URL}/update/tournament`, {
        method: method,
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          id: parseInt(id),
          name: formData.name,
          num_participant: parseInt(formData.num_participant),
          team_num: parseInt(formData.team_num),
          start_date: dateData.start_date,
          end_date: dateData.end_date,
          game_mode: formData.game_mode,
          max_participant: parseInt(formData.max_participant),
          apn_start: dateData.apn_start,
          apn_end: dateData.apn_end,
          details: formData.details,
          evt_id: event.id,
          gae_id: game.id
  
        }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
  
            toast.error(data.message);
          } else {
            toast.success(data.message);
            authStatus();
            setIsForm(false);
            setIsLoading(true);
            
  
          }
  
        }).catch(err => alert(err));
  
    };
  
  
    const torles = (method, id) => {
  
      fetch(`${import.meta.env.VITE_BASE_URL}/delete/tournament`, {
        method: method,
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({id: id, evt_id: event.id, gae_id: game.id}),
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


  const formReset = () => {
    
    setFormData({

      name: tournament.name,
      num_participant: tournament.num_participant,
      max_participant: tournament.max_participant,
      game_mode: tournament.game_mode,
      team_num: tournament.team_num,
      details: tournament.details
      
    });

    setDateData({
      start_date: formatDateTime(tournament.start_date),
      end_date: formatDateTime(tournament.end_date),
      apn_start: formatDateTime(tournament.apn_start),
      apn_end: formatDateTime(tournament.apn_end)

    })
  };


  

  const handleInput = () => {
    const textarea = document.getElementById('details');
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setDetailsNum(textarea.value.length)
  };


  return (
    
    <>

    {
      (isloading)?(
        <p></p>
      ):(

        <>
        {
          ((event.ogr_id == profile.id) && isAuthenticated)?(

            <>
            {
              (!isForm)?
              (

                
              
                <div className="m-10 rounded-md bg-gradient-to-br from-indigo-950 to-slate-500 sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] mx-auto text-primary-content">
                  
                <div className="card-body">
                <div className="flex justify-center pb-8 gap-10">
                    <img className="w-56 h-56" src={`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_BASE_PIC}${picPath}`} alt={`${tournament.name} profilképe`} title={`${tournament.name} profilképe`} />
                    <div className="card-title">
                      <div className="pl-14">
                        <p className="text-3xl pb-2 text-white">{tournament.name}</p>

                        <div className="flex flex-col">
                          <button className="btn mt-3 text-white w-52" onClick={() => {setIsForm(true); setDisabled(false);}}>Adatok módosítása</button>
                          <button className="btn mt-3 bg-red-600 hover:bg-red-700 text-white w-52" onClick={() => {torles('DELETE', tournament.id)}}>Törlés</button>

                        </div>
                      </div>
                    </div>
                  </div>


                  <div className="w-full mx-auto rounded-lg shadow-lg md:mt-6 md:max-w-full sm:max-w-4xl xl:p-0 bg-gray-800 dark:border-gray-700">
                    <div className="p-8 md:p-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Név(*)
                          </label>
                          <input id="name" type="text" disabled={disabled} value={formData.name} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Résztvevő csapatok száma(*)
                          </label>
                          <input id="num_participant" type="number" min={0} max={formData.max_participant} disabled={disabled} value={formData.num_participant} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Verseny kezdete(*)
                          </label>
                          <input id="start_date" type="datetime-local" disabled={disabled} value={dateFormat(dateData.start_date)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Verseny vége(*)
                          </label>
                          <input id="end_date" type="datetime-local" disabled={disabled} value={dateFormat(dateData.end_date)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-white">
                            Jelentkezés kezdete(*)
                          </label>
                          <input id="apn_start" type="datetime-local" disabled={disabled} value={dateFormat(dateData.apn_start)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white">
                            Jelentkezés vége(*)
                          </label>
                          <input id="apn_end" type="datetime-local" disabled={disabled} value={dateFormat(dateData.apn_end)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Maximális csapatok száma(*)
                          </label>
                          <input id="max_participant" type="number" min={1} disabled={disabled} value={formData.max_participant} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white">
                            Esemény
                          </label>
                          <input id="event" type="text" disabled value={event.name} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Játék
                          </label>
                          <input id="game" type="text" disabled value={(!game)?(<></>):(game.name)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Csapattagok száma(*)
                          </label>
                          <input id="team_num" type="number" min={1} disabled={disabled} value={formData.team_num} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Játékmód(*)
                          </label>
                          <input id="game_mode" type="text" disabled={disabled} value={formData.game_mode} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>

                      </div>
                      
                      <div className="mt-6">
                          <label className="block text-sm font-medium text-white">
                            Leírás
                          </label>
                          <textarea id="details" type="text" disabled={disabled} value={formData.details} className="mt-1 block w-full hyphens-auto px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>
                    </div>
                  </div>

                  <div className="w-full mb-10 mx-auto rounded-lg shadow-lg md:mt-6 md:max-w-full sm:max-w-4xl xl:p-0 bg-gray-800 dark:border-gray-700 pt-10">
                    <div className="flex flex-row horizontal justify-center mt-10 gap-5">
                      <h2 className="text-center text-4xl font-bold tracking-tight text-indigo-600">
                            Jelentkező csapatok
                      </h2>
                      <button  onClick={()=>pendingFetch()} className="btn border-none bg-indigo-600 hover:bg-indigo-800"><img className="h-5" src="https://www.svgrepo.com/show/533694/refresh-ccw.svg"/></button>
                    </div>

                    <div className="mx-auto mt-5 h-1 w-[60%] bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full" />
                  <div className="p-8 md:p-10">
                    
                     <div className="flex flex-col">
                      <div className="grid xl:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-12 justify-items-center">
                        {
                              pendingApplications.map((application)=>(
                                <ApplicationCard key={application.id} team={application.team} application={application} />))
                        }
                      </div>
                     </div>
                    
                    
                  </div>
                </div>


                <div className="w-full mb-10 mx-auto rounded-lg shadow-lg md:mt-6 md:max-w-full sm:max-w-4xl xl:p-0 bg-gray-800 dark:border-gray-700 pt-10">
                <div className="flex flex-row horizontal justify-center mt-10 gap-5">
                      <h2 className="text-center text-4xl font-bold tracking-tight text-indigo-600">
                            Jelentkezett csapatok
                      </h2>
                      <button onClick={()=>approvedFetch()} className="btn border-none bg-indigo-600 hover:bg-indigo-800"><img className="h-5" src="https://www.svgrepo.com/show/533694/refresh-ccw.svg"/></button>
                    </div>

                    <div className="mx-auto mt-5 h-1 w-[60%] bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full" />
                  <div className="p-8 md:p-10">
                    
                     <div className="flex flex-col">
                      <div className="grid xl:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-12 justify-items-center">
                        {
                          
                          approvedApplications.map((application)=>(
                            <ApplicationCard key={application.id} team={application.team} application={application} />))
                        
                        }
                        
                      </div>
                     </div>


                     
                    
                    
                  </div>
                </div>


                <div className="w-full mb-10 mx-auto rounded-lg shadow-lg md:mt-6 md:max-w-full sm:max-w-4xl xl:p-0 bg-gray-800 dark:border-gray-700 pt-10">
                  <div className="flex flex-row horizontal justify-center mt-10 gap-5">
                    <h2 className="text-center text-4xl font-bold tracking-tight text-indigo-600">
                      Meccsek
                    </h2>
                    <button onClick={() => { matchesFetch(); console.log(matches)}} className="btn border-none bg-indigo-600 hover:bg-indigo-800"><img className="h-5" src="https://www.svgrepo.com/show/533694/refresh-ccw.svg" /></button>
                  </div>

                  <div className="mx-auto mt-5 h-1 w-[60%] bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full" />
                  <div className="p-8 md:p-10">

                  <div className="flex flex-row justify-center">
                      <button onClick={()=>{navigate(`/new-match/${id}`)}} className="btn mt-3 mb-10 text-white w-52">Új meccs felvétele</button>
                    </div>

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

              
            
            
            )
              :(
              
              
                <div className="m-10 rounded-md bg-gradient-to-br from-indigo-950 to-slate-500 sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] mx-auto text-primary-content">
                    <div className="card-body">
                    <div className="flex justify-center pb-8 gap-10">
                          <img className="w-56 h-56" src={`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_BASE_PIC}${picPath}`} />
                          <div className="card-title">
                            <div className="pl-14">
                              <p className="text-3xl pb-2 text-white">{tournament.name}</p>
                              
                              <form onSubmit={onSubmit}>
                                <div className="flex flex-wrap gap-2">
                                  <button className="btn mt-3 text-white" type="submit">Módosítás</button>
                                  <button className="btn mt-3 text-white" type="button" onClick={()=> { deleteImage(tournament.id, "tournament"); authStatus(); setIsLoading(true); }} >Fénykép törlés</button>

                                  <button className="btn mt-3 text-white" type="button" onClick={() => { setIsForm(false); setDisabled(true); formReset() }}>Mégse</button>

                                </div>

                              </form>
                              {/* Fénykép feltöltés */}
                              <form encType="multipart/form-data">
                                <div className="mt-3">
                                  <label className="block text-sm font-medium text-white" htmlFor="image">
                                    Fénykép cseréje
                                  </label>
                                  <input
                                    className="block w-full mb-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 mt-1"
                                    id="image"
                                    name="image"
                                    type="file"
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      setPfpFile(file);
                                    }}
                                  />
                                  <button className="btn mt-3 text-white" type="button" onClick={()=>{sendImage(pfpFile, "tournament", tournament.id); }}>Feltöltés</button>
                                </div>
                              </form>



                            </div>
                          </div>
                        </div>


                        <div className="w-full mx-auto rounded-lg shadow-lg md:mt-6 md:max-w-full sm:max-w-4xl xl:p-0 bg-gray-800 dark:border-gray-700">
                    <div className="p-8 md:p-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Név(*)
                          </label>
                          <input id="name" type="text" disabled={disabled} onChange={writeData} value={formData.name} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Résztvevő csapatok száma(*)
                          </label>
                          <input id="num_participant" min={1} type="number" max={formData.max_participant} disabled={disabled} onChange={writeData} value={formData.num_participant} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Verseny kezdete(*)
                          </label>
                          <input id="start_date" onChange={(time)=> {
                                setDateData((prevState) => ({
                                ...prevState,
                                start_date: time.target.value,})); setApnMaxDate(apnMaxTimeSet(dateFormat(time.target.value)))}
                              }  min={dateFormat(minDate)} max={dateFormat(maxDate)} type="datetime-local"  value={dateFormat(dateData.start_date)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Verseny vége(*)
                          </label>
                          <input id="end_date" onChange={(time)=> {
                                setDateData((prevState) => ({
                                  ...prevState,
                                  end_date: time.target.value,}));}
                                
                                } min={dateFormat(minDate)} max={dateFormat(maxDate)} type="datetime-local" value={dateFormat(dateData.end_date)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-white">
                            Jelentkezés kezdete(*)
                          </label>
                          <input id="apn_start" onChange={(time)=> {
                                setDateData((prevState) => ({
                                  ...prevState,
                                  apn_start: time.target.value,}));}
                                
                                } type="datetime-local" min={dateFormat(apnMinDate)} max={dateFormat(apnMaxDate)} value={dateFormat(dateData.apn_start)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white">
                            Jelentkezés vége(*)
                          </label>
                          <input id="apn_end" onChange={(time)=> {
                                setDateData((prevState) => ({
                                  ...prevState,
                                  apn_end: time.target.value,}));}
                                
                                } type="datetime-local" min={dateFormat(apnMinDate)} max={dateFormat(apnMaxDate)} value={dateFormat(dateData.apn_end)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Maximális csapatok száma(*)
                          </label>
                          <input id="max_participant" type="number" min={1} disabled={disabled} onChange={writeData} value={formData.max_participant} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white">
                            Esemény
                          </label>
                          <input id="event" type="text" disabled value={event.name} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Játék
                          </label>
                          <input id="game" type="text" disabled value={(!game)?(<></>):(game.name)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                          Csapattagok száma(*)
                          </label>
                          <input id="team_num" type="number" min={1} disabled={disabled} onChange={writeData} value={formData.team_num} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Játékmód(*)
                          </label>
                          <input id="game_mode" type="text" disabled={disabled} onChange={writeData} value={formData.game_mode} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                        </div>

                      </div>
                      
                      <div className="mt-6">
                          <label className="block text-sm font-medium text-white">
                          {`Leírás (${detailsNum}/512)`}
                          </label>
                          <textarea maxLength={512} id="details" type="text" onInput={handleInput} disabled={disabled} onChange={writeData} value={formData.details} className="mt-1 block w-full hyphens-auto px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                        </div>
                    </div>
                  </div>                  

                    </div>

                    
                  </div>
            
            )
            }

                  </>
          ):(
            
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
                            <p>{formatDateTime(tournament.start_date)}</p>
                          </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                          Verseny vége
                          </dt>
                          <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                            <p>{formatDateTime(tournament.end_date)}</p>
                          </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                            Jelentkezés kezdete
                          </dt>
                          <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                            <p>{formatDateTime(tournament.apn_start)}</p>
                          </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                            Jelentkezés vége
                          </dt>
                          <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                            <p>{formatDateTime(tournament.apn_end)}</p>
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
                            Csapattagok száma
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
                            <p className="break-words">{tournament.details}</p>
                          </dd>
                        </div>
                        
                      </dl>
                    </div>

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
        
        </>
      )
    }

    
    
    </>
  )
}

export default Tournament