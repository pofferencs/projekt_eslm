import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import OrganizerContext from "../../../context/OrganizerContext";
import { toast } from "react-toastify";
import TournamentSchema from "../../common/schemas/TournamentSchema";

function Event() {

  const { id } = useParams();
  const {isAuthenticated, authStatus, profile} = useContext(OrganizerContext);
  const [event, setEvent] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const [organizer, setOrganizer] = useState([]);
  const [picPath, setPicPath] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [isValami, setIsValami] = useState(true);
  const [isForm, setIsForm] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [pfpFile, setPfpFile] = useState({});
  const [detailsNum, setDetailsNum] = useState(0);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [apnMinDate, setApnMinDate] = useState("");
  const [apnMaxDate, setApnMaxDate] = useState("");
  const [dateData, setDateData] = useState({
    start_date: "",
    end_date: ""
    
  })
  const navigate = useNavigate();
  
  useEffect(()=>{

    window.scroll(0,0)
    setDisabled(true);

    fetch(`${import.meta.env.VITE_BASE_URL}/list/event/${id}`,{
      method: "GET",
      headers: { "Content-type": "application/json" },
    }).then(res=>res.json())
    .then(adat=> {
      
      if(adat.message){
        navigate('/');
      }
      
      setEvent(adat); 
      setDateData({
        start_date: adat.start_date,
        end_date: adat.end_date
      })

      setIsLoading(false); 
      setFormData(adat);
      setDetailsNum(adat.details.length);

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

    // console.log(event)

  },[isloading])


  const [formData, setFormData] = useState({
    name: event.name,
    place: event.place,
    details: event.details,
    
  });

  const formReset = () => {
    
    setFormData({
      name: event.name,
      place: event.place,
      details: event.details,
    });

    setDateData({
      start_date: formatDateTime(dateData.start_date),
      end_date: formatDateTime(dateData.end_date)
    })


  };



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
  
      return `${ev}. ${honap}. ${nap}. ${ora}:${perc}`; // Formázott visszatérési érték
    } else {
      return '';
    }
  };


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

    // console.log(formData)

    fetch(`${import.meta.env.VITE_BASE_URL}/update/event`, {
      method: method,
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name: event.name,
        place: event.place,
        start_date: dateData.start_date,
        end_date: dateData.end_date,
        details: event.details,

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

    fetch(`${import.meta.env.VITE_BASE_URL}/delete/event`, {
      method: method,
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({id: id}),
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
  


  const handleInput = () => {
    const textarea = document.getElementById('details');
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
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
                    <img className="w-56 h-56" src={`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_BASE_PIC}${picPath}`} alt={`${event.name} profilképe`} title={`${event.name} profilképe`} />
                    <div className="card-title">
                      <div className="pl-14">
                        <p className="text-3xl pb-2 text-white">{event.name}</p>

                        <div className="flex flex-col">
                          <button className="btn mt-3 text-white w-52" onClick={() => {setIsForm(true); setDisabled(false);}}>Adatok módosítása</button>
                          <button className="btn mt-3 bg-red-600 hover:bg-red-700 text-white w-52" onClick={() => {torles('DELETE', event.id)}}>Törlés</button>

                        </div>
                      </div>
                    </div>
                  </div>


                  <div className="w-full mx-auto rounded-lg shadow-lg md:mt-6 md:max-w-full sm:max-w-4xl xl:p-0 bg-gray-800 dark:border-gray-700">
                    <div className="p-8 md:p-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Név
                          </label>
                          <input id="name" type="text" disabled={disabled} value={formData.name} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Hely
                          </label>
                          <input id="place" type="text" disabled={disabled} value={formData.place} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Kezdés
                          </label>
                          <input id="start_date" type="datetime-local" disabled={disabled} value={dateFormat(dateData.start_date)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white">
                            Vége
                          </label>
                          <input id="end_date" type="datetime-local" disabled={disabled} value={dateFormat(dateData.end_date)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-white">
                            Szervező
                          </label>
                          <input id="school" type="text" disabled value={organizer.full_name} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
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


                  <div className="w-full mb-10 mx-auto rounded-lg shadow-lg md:mt-6 md:max-w-full sm:max-w-4xl xl:p-0 bg-gray-800 dark:border-gray-700">
                    <h2 className="mt-10 text-center text-4xl font-bold tracking-tight text-indigo-600">
                          Az esemény versenyei
                    </h2>

                    <div className="mx-auto mt-5 h-1 w-[60%] bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full" />
                  <div className="p-8 md:p-10">
                    <div className="flex flex-row justify-center">
                      <button onClick={()=> navigate('/new-tournament')} className="btn mt-3 mb-10 text-white w-52">Új verseny felvétele</button>
                    </div>

                     <div className="flex flex-col">
                      <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-12 justify-items-center">
                        {
                          (!tournaments.length == 0)?(
                            tournaments.map((t,i)=>(
  
                              <TournamentSchema key={i} tournament={t}/>
                          
                          ))
                          ):(
                            <p className="text-center text-gray-500 mt-10">Nincsenek még versenyek!</p>
                          )
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
                              <p className="text-3xl pb-2 text-white">{event.name}</p>
                              
                              <form onSubmit={onSubmit}>
                                <div className="flex flex-wrap gap-2">
                                  <button className="btn mt-3 text-white" type="submit">Módosítás</button>
                                  <button className="btn mt-3 text-white" type="button" onClick={()=> { deleteImage(event.id, "event"); authStatus(); setIsLoading(true); }} >Fénykép törlés</button>

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
                                  <button className="btn mt-3 text-white" type="button" onClick={()=>{sendImage(pfpFile, "event", event.id); }}>Feltöltés</button>
                                </div>
                              </form>



                            </div>
                          </div>
                        </div>


                      <div className="w-full mx-auto rounded-lg shadow-lg md:mt-6 md:max-w-full sm:max-w-4xl xl:p-0 bg-gray-800 dark:border-gray-700">
                        <div className="p-8 md:p-10">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div key={'name'}>
                              <label className="block text-sm font-medium text-white">
                                Név
                              </label>
                              <input id="name" type="text" disabled={disabled} onChange={writeData} value={formData.name} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                            </div>

                            <div key={'place'}>
                              <label className="block text-sm font-medium text-white">
                                Hely
                              </label>
                              <input id="place" type="text" disabled={disabled} onChange={writeData} value={formData.place} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                            </div>

                            <div key={'start_date'}>
                              <label className="block text-sm font-medium text-white">
                                Kezdés
                              </label>
                              <input id="start_date" onChange={(time)=> {
                                setDateData((prevState) => ({
                                ...prevState,
                                start_date: time.target.value,}));}
                              }  type="datetime-local" value={dateFormat(dateData.start_date)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                            </div>

                            <div key={'end_date'}>
                              <label className="block text-sm font-medium text-white">
                                Vége
                              </label>
                              <input id="end_date" onChange={(time)=> {
                                setDateData((prevState) => ({
                                  ...prevState,
                                  end_date: time.target.value,}));}
                                
                                } type="datetime-local" value={dateFormat(dateData.end_date)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-white">
                                Szervező
                              </label>
                              <input type="text" disabled value={organizer.full_name} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
                            </div>

                          </div>
                          <div key={'details'} className="mt-6">
                              <label className="block text-sm font-medium text-white">
                              {`Leírás (${detailsNum}/512)`}
                              
                              </label>
                              <textarea maxLength={512} id="details" type="text" onInput={handleInput} disabled={disabled} onChange={writeData} value={formData.details} className="mt-1 block w-full h-auto hyphens-auto px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
                            </div>
                        </div>
                      </div>



                      <div className="w-full mb-10 mx-auto rounded-lg shadow-lg md:mt-6 md:max-w-full sm:max-w-4xl xl:p-0 bg-gray-800 dark:border-gray-700">
                      <h2 className="mt-10 text-center text-4xl font-bold tracking-tight text-indigo-600">
                        Az esemény versenyei
                      </h2>

                      <div className="mx-auto mt-5 h-1 w-[60%] bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full" />
                  <div className="p-8 md:p-10">
                    <div className="flex flex-row justify-center">
                      <button onClick={()=>{navigate('/new-tournament')}} className="btn mt-3 mb-10 text-white w-52">Új verseny felvétele</button>
                    </div>

                     <div className="flex flex-col">
                      <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-12 justify-items-center">
                        {
                          (!tournaments.length == 0)?(
                            tournaments.map((t,i)=>(
  
                              <TournamentSchema key={i} tournament={t}/>
                          
                          ))
                          ):(
                            <p className="text-center text-gray-500 mt-10">Nincsenek még versenyek!</p>
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
          ):(
            
            <>
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
                            <p>{formatDateTime(event.start_date)}</p>
                          </dd>
                        </div>
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm text-white font-bold">
                            Vége
                          </dt>
                          <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                            <p>{formatDateTime(event.end_date)}</p>
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
                          <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
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
                      <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-12 justify-items-center">
                        {
                          (!tournaments.length == 0)?(
                            tournaments.map((t,i)=>(
  
                              <TournamentSchema key={i} tournament={t}/>
                          
                          ))
                          ):(
                            <p className="text-gray-500 mt-10">Nincsenek még versenyek!</p>
                          )
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

export default Event