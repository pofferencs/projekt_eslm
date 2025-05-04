import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import OrganizerContext from "../../../context/OrganizerContext";
import { toast } from "react-toastify";

function Tournament() {


  const { id } = useParams();
  const {isAuthenticated, authStatus, profile} = useContext(OrganizerContext);
  const [tournament, setTournament] = useState([]);
  const [event, setEvent] = useState([]);
  const [game, setGame] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const [organizer, setOrganizer] = useState([]);
  const [picPath, setPicPath] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [isValami, setIsValami] = useState(true);
  const [isForm, setIsForm] = useState(false);
  const [pfpFile, setPfpFile] = useState({});
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
          
          setTournament(adat); setIsLoading(false); setFormData(adat); 

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
  
    };
  
  
    const [formData, setFormData] = useState(formObj);
    
    const dateFormat = (date) => {
  
      if (date != undefined) {
        const [ev, honap, nap] = date.split('T')[0].split('-')
  
        return `${ev}-${honap}-${nap}`;
      } else {
        return ``;
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
        body: JSON.stringify(formData),
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
    formObj = {
      name: tournament.name,
      num_participant: tournament.num_participant,
      start_date: tournament.start_date,
      end_date: tournament.end_date,
      apn_start: tournament.apn_start,
      apn_end: tournament.apn_end,
      max_participant: tournament.max_participant,
      game_mode: tournament.game_mode,
      team_num: tournament.team_num
    }

    setFormData(formObj);
  };






  return (
    
    <>

    {
      (isloading)?(
        <p></p>
      ):(

        <>
        {
          (event.ogr_id == profile.id)?(

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
                            Résztvevők száma(*)
                          </label>
                          <input id="place" type="number" disabled={disabled} value={formData.num_participant} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Verseny kezdete(*)
                          </label>
                          <input id="start_date" type="date" disabled={disabled} value={dateFormat(formData.start_date)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Verseny vége(*)
                          </label>
                          <input id="end_date" type="date" disabled={disabled} value={dateFormat(formData.end_date)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-white">
                            Jelentkezés kezdete(*)
                          </label>
                          <input id="apn_start" type="date" disabled={disabled} value={dateFormat(formData.apn_start)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white">
                            Jelentkezés vége(*)
                          </label>
                          <input id="apn_end" type="date" disabled={disabled} value={dateFormat(formData.apn_end)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Maximális résztvevők száma(*)
                          </label>
                          <input id="max_participant" type="number" disabled={disabled} value={formData.max_participant} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white">
                            Esemény
                          </label>
                          <input id="start_date" type="text" disabled value={event.name} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Játék
                          </label>
                          <input id="start_date" type="text" disabled value={(!game)?(<p></p>):(<>{game.name}</>)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Játékmód(*)
                          </label>
                          <input id="game_mode" type="text" disabled={disabled} value={formData.game_mode} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Csapatok száma
                          </label>
                          <input id="team_num" type="number" disabled={disabled} value={formData.team_num} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>

                      </div>
                      
                      <div className="mt-6">
                          <label className="block text-sm font-medium text-white">
                            Leírás
                          </label>
                          <input type="text" disabled={disabled} value={formData.details} className="mt-1 block w-full hyphens-auto px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
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
                              <p className="text-3xl pb-2 text-white">{event.name}</p>
                              
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
                            Résztvevők száma(*)
                          </label>
                          <input id="place" type="number" disabled={disabled} onChange={writeData} value={formData.num_participant} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Verseny kezdete(*)
                          </label>
                          <input id="start_date" type="date" disabled={disabled} onChange={writeData} value={dateFormat(formData.start_date)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Verseny vége(*)
                          </label>
                          <input id="end_date" type="date" disabled={disabled} onChange={writeData} value={dateFormat(formData.end_date)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-white">
                            Jelentkezés kezdete(*)
                          </label>
                          <input id="apn_start" type="date" disabled={disabled} onChange={writeData} value={dateFormat(formData.apn_start)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white">
                            Jelentkezés vége(*)
                          </label>
                          <input id="apn_end" type="date" disabled={disabled} onChange={writeData} value={dateFormat(formData.apn_end)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Maximális résztvevők száma(*)
                          </label>
                          <input id="max_participant" type="number" min={1} disabled={disabled} onChange={writeData} value={formData.max_participant} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white">
                            Esemény
                          </label>
                          <input id="start_date" type="text" disabled value={event.name} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Játék
                          </label>
                          <input id="start_date" type="text" disabled value={(!game)?(<p></p>):(<>{game.name}</>)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Játékmód(*)
                          </label>
                          <input id="game_mode" type="text" disabled={disabled} onChange={writeData} value={formData.game_mode} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Csapatok száma
                          </label>
                          <input id="team_num" type="number" min={1} disabled={disabled} onChange={writeData} value={formData.team_num} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                        </div>

                      </div>
                      
                      <div className="mt-6">
                          <label className="block text-sm font-medium text-white">
                            Leírás
                          </label>
                          <input type="text" disabled={disabled} onChange={writeData} value={formData.details} className="mt-1 block w-full hyphens-auto px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
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
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <p>{tournament.name}</p>
                          </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                            Résztvevők száma
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <p>{tournament.num_participant}</p>
                          </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                            Verseny kezdete
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <p>{dateFormat(tournament.start_date)}</p>
                          </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                          Verseny vége
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <p>{dateFormat(tournament.end_date)}</p>
                          </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                            Jelentkezés kezdete
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <p>{dateFormat(tournament.apn_start)}</p>
                          </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                            Jelentkezés vége
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <p>{dateFormat(tournament.apn_end)}</p>
                          </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                            Maximális résztvevők száma
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <p>{tournament.max_participant}</p>
                          </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                            Esemény
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <p>{event.name}</p>
                          </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                            Játék
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <p>{
                              (!game)?(<p></p>):(<>{game.name}</>)
                              }</p>
                          </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                            Játékmód
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <p>{tournament.game_mode}</p>
                          </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                            Csapatok száma
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <p>{tournament.team_num}</p>
                          </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                            Leírás
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
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
        
        </>
      )
    }
    
    
    </>
  )
}

export default Tournament