import { useContext, useState } from "react";
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import MatchTeam from "../../../../../user/src/components/common/MatchTeam";
import OrganizerContext from "../../../context/OrganizerContext";
import { toast } from "react-toastify";


function Match() {


    const { id } = useParams();
  const {isAuthenticated, authStatus, profile} = useContext(OrganizerContext);
  const [isloading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const [detailsNum, setDetailsNum] = useState(0);
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(true);
  const [teams, setTeams] = useState([]);
  const [match, setMatch] = useState([]);
  const [dateData, setDateData] = useState({
    dte: ""
  })
  const [apn1, setApn1] = useState("");
  const [apn2, setApn2] = useState("");
  const [status, setStatus] = useState("");
  const [isForm, setIsForm] = useState(false);
  const [isOgr, setIsOgr] = useState(0);
  const [winner, setWinner] = useState("");

    
  useEffect(()=>{


    window.scroll(0,0)
    setDisabled(true);
   
    fetch(`${import.meta.env.VITE_BASE_URL}/list/matchbyid/${id}`,{
      method: "GET",
      headers: { "Content-type": "application/json" },
    }).then(res=> res.json())
    .then(adat=> {

        if(!adat.message){
          setMatch(adat); 
          setFormData({
            status: adat.match.status,
            place: adat.match.place,
            details: adat.match.details,
            rslt: adat.match.rslt

          }); setDateData({
            dte: adat.match.dte
          });

          setIsOgr(adat.match.tournament.event.ogr_id); setRefresh(false); setIsLoading(false);
        }

        
        
  })
  .catch(err=> alert(err));
  

    teamsFetch();
    



  }, [isloading])



  const teamsFetch = () => {
    
    fetch(`${import.meta.env.VITE_BASE_URL}/list/applicationsbytnt/`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
          
          tnt_id: id
          
      })
    })
    .then(res=>res.json())
    .then(adat=> {setTeams(adat); setRefresh(false)})
    .catch(err=>alert(err));
    


  };

  const [formData, setFormData] = useState({
    place: "",
    dte: "",
    details: "",
    winner: "",
    rslt: "",
    
  });



  const formReset = () => {
    
    setFormData({
      
    place: match.match.place,
    details: match.match.details,
    rslt: match.match.rslt

    });

    setDateData({
    dte: formatDateTime(match.match.dte)
    });

    setStatus("");
    setWinner("");
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
  
      return `${ev}. ${honap}. ${nap}. ${ora}:${perc}`; 
    } else {
      return '';
    }
  };

  const modify = (method) => {

      if(winner!=""){
        if(winner != match.match.application1.team.full_name && winner != match.match.application2.team.full_name){
          return toast.error("Csak a fenti két csapat közül az egyik lehet a győztes!");
        }
      }
    

    fetch(`${import.meta.env.VITE_BASE_URL}/update/match`, {
      method: method,
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({

        id: parseInt(match.match.id), 
        apn1_id: parseInt(match.match.apn1_id), 
        apn2_id: parseInt(match.match.apn2_id), 
        tnt_id: parseInt(match.match.tnt_id), 
        status: match.match.status, 
        uj_status: status, 
        place: formData.place, 
        dte: dateData.dte, 
        details: formData.details, 
        winner: winner, 
        rslt: formData.rslt
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


  const torles = (method) => {
  
    fetch(`${import.meta.env.VITE_BASE_URL}/delete/match`, {
      method: method,
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(
        {
          id: parseInt(match.match.id),
          apn1_id: parseInt(match.match.apn1_id),
          apn2_id: parseInt(match.match.apn2_id),
          tnt_id: parseInt(match.match.tnt_id)


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
    modify('PATCH');
  };

  const writeData = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
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
          ((isOgr == profile.id) && isAuthenticated)?(

            <>
            {
              (!isForm)?
              (
                <>

              <div className="m-10 rounded-md bg-gradient-to-br from-indigo-950 to-slate-500 sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] mx-auto text-primary-content">
                  <div className="card-body">
                  <div className="flex justify-center pb-8 gap-10">
                      <img className="w-56 h-56" src={`https://www.svgrepo.com/show/535410/game-controller.svg`} />
                        <div className="card-title">
                          <div className="pl-14">
                            <p className="text-3xl pb-2 text-white text-center font-bold">{match.match.tournament.name}</p>
                            <p className="text-3xl pb-2 text-white text-center">{match.match.tournament.game_mode}</p>
                            <p className="text-2xl pb-2 text-white text-center">{formatDateTime(dateFormat(match.match.dte))}</p>
                            <p className="text-3xl pb-2 text-white text-center font-bold">
                              
                            {
                            (match.match.status=="unstarted")?(
                              <p>{"Még nem kezdődött el"}</p>
                          ):(
                              (match.match.status=="ended")?(
                                  <p>{"Befejeződött"}</p>
                              ):(
                                  (match.match.status=="interrupted")?(
                                      <p>{"Félbeszakított"}</p>
                                  ):(
                                      (match.match.status=="started")?(
                                          <p>{"Elkezdődött"}</p>
                                      ):(
                                          <></>
                                        )
                                    )
                                )
                            )
                          
                            
                            }
                              </p>

                              <div className="flex flex-col">
                                  <button className="btn mt-3 text-white" onClick={() => {setIsForm(true); setDisabled(false);}}>Adatok módosítása</button>
                                  <button className="btn mt-3 bg-red-600 hover:bg-red-700 text-white" onClick={() => {torles("DELETE")}}>Törlés</button>
                              </div>
                          </div>
                        </div>
                      </div>


    <form>
      <div className="w-full mx-auto rounded-lg shadow-lg md:mt-6 md:max-w-full sm:max-w-4xl xl:p-0 bg-gray-800 dark:border-gray-700">
        <div className="p-8 md:p-10">
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div key={'apn1_id'}>
              <label className="block text-sm font-medium text-white">
                Csapat 1
              </label>
              <input id="apn1" disabled type="text" value={match.match.application1.team.full_name} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
            </div>

            <div key={'apn2_id'}>
              <label className="block text-sm font-medium text-white">
                Csapat 2
              </label>
              <input id="apn2" disabled type="text" value={match.match.application2.team.full_name} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
            </div>
          
            <div key={'status'}>
              <label className="block text-sm font-medium text-white">
                Státusz
              </label>
              <select id="status" disabled defaultValue={"Státusz"} className="select mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm">
                <option disabled={true}>Státusz</option>
                <option onClick={()=>{setStatus("ended")}}>Befejeződött</option>
                <option onClick={()=>{setStatus("started")}}>Elkezdődött</option>
                <option onClick={()=>{setStatus("interrupted")}}>Félbeszakított</option>
                <option onClick={()=>{setStatus("unstarted")}}>Még nem kezdődött el</option>
                
                </select>
            </div>

            <div key={'place'}>
              <label className="block text-sm font-medium text-white">
                Hely
              </label>
              <input id="place" disabled onChange={writeData} type="text" value={formData.place} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
            </div>

            <div key={'dte'}>
              <label className="block text-sm font-medium text-white">
                Időpont
              </label>
              <input id="dte" onChange={(time)=> {
                setDateData((prevState) => ({
                  ...prevState,
                  dte: time.target.value,}));}
                }
               type="datetime-local" disabled value={dateFormat(dateData.dte)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
            </div>
            
            <div >
              <label className="block text-sm font-medium text-white">
                Győztes
              </label>
              <select id="winner" disabled defaultValue="Győztes" className="select mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm">
              <option disabled={true}>Győztes</option>
                {
                    (teams.length!=0)?(
                      teams.map((e)=>(
                        <>
                            <option onClick={()=> {setWinner(e.team.full_name)}} key={e.id}>{e.team.full_name}</option>
                        </>
                    ))
                    ):(
                      <></>
                    )
                }
                </select>
            </div>

            <div key={'rslt'}>
              <label className="block text-sm font-medium text-white">
                Eredmény
              </label>
              <input id="rslt" disabled onChange={writeData} type="text" value={formData.rslt} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
            </div>

          </div>
          <div key={'details'} className="mt-6">
              <label className="block text-sm font-medium text-white">
                {`Leírás (${detailsNum}/512)`}
              </label>
              <textarea disabled maxLength={512} onInput={handleInput} id="details" type="text" onChange={writeData} value={formData.details} className="mt-1 block w-full h-auto hyphens-auto px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
            </div>
        </div>
        
      </div>
    </form>
      


    </div>
    

  </div>
                




                </>
            )
              :(
              
              
                <>


<div className="m-10 rounded-md bg-gradient-to-br from-indigo-950 to-slate-500 sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] mx-auto text-primary-content">
    <div className="card-body">
    <div className="flex justify-center pb-8 gap-10">
        <img className="w-56 h-56" src={`https://www.svgrepo.com/show/535410/game-controller.svg`} />
          <div className="card-title">
            <div className="pl-14">
              <p className="text-3xl pb-2 text-white text-center font-bold">{match.match.tournament.name}</p>
              <p className="text-3xl pb-2 text-white text-center">{match.match.tournament.game_mode}</p>
              <p className="text-2xl pb-2 text-white text-center">{formatDateTime(dateFormat(match.match.dte))}</p>
              <p className="text-3xl pb-2 text-white text-center font-bold">
                
              {
              (match.match.status=="unstarted")?(
                <p>{"Még nem kezdődött el"}</p>
            ):(
                (match.match.status=="ended")?(
                    <p>{"Befejeződött"}</p>
                ):(
                    (match.match.status=="interrupted")?(
                        <p>{"Félbeszakított"}</p>
                    ):(
                        (match.match.status=="started")?(
                            <p>{"Elkezdődött"}</p>
                        ):(
                            <></>
                          )
                      )
                  )
              )
            
              
              }
                </p>

                <div className="flex flex-col">
                                  <button className="btn mt-3 text-white" type="submit" onClick={()=> modify('PATCH')}>Módosítás</button>
                                  <button className="btn mt-3 text-white" type="button" onClick={() => { setIsForm(false); setDisabled(true); formReset() }}>Mégse</button>

                </div>
            </div>
          </div>
        </div>


    <form onSubmit={onSubmit}>
      <div className="w-full mx-auto rounded-lg shadow-lg md:mt-6 md:max-w-full sm:max-w-4xl xl:p-0 bg-gray-800 dark:border-gray-700">
        <div className="p-8 md:p-10">
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div key={'apn1_id'}>
              <label className="block text-sm font-medium text-white">
                Csapat 1
              </label>
              <input id="apn1" disabled type="text" value={match.match.application1.team.full_name} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
            </div>

            <div key={'apn2_id'}>
              <label className="block text-sm font-medium text-white">
                Csapat 2
              </label>
              <input id="apn2" disabled type="text" value={match.match.application2.team.full_name} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-gray-400 shadow-sm" />
            </div>
          
            <div key={'status'}>
              <label className="block text-sm font-medium text-white">
                Státusz
              </label>
              <select id="status" defaultValue="Státusz" className="select mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm">
                <option disabled={true}>Státusz</option>
                <option onClick={()=>{setStatus("ended")}}>Befejeződött</option>
                <option onClick={()=>{setStatus("started")}}>Elkezdődött</option>
                <option onClick={()=>{setStatus("interrupted")}}>Félbeszakított</option>
                <option onClick={()=>{setStatus("unstarted")}}>Még nem kezdődött el</option>
                
                </select>
            </div>

            <div key={'place'}>
              <label className="block text-sm font-medium text-white">
                Hely
              </label>
              <input id="place" onChange={writeData} type="text" value={formData.place} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
            </div>

            <div key={'dte'}>
              <label className="block text-sm font-medium text-white">
                Időpont
              </label>
              <input id="dte" onChange={(time)=> {
                setDateData((prevState) => ({
                  ...prevState,
                  dte: time.target.value,}));}
                }
               type="datetime-local" value={dateFormat(dateData.dte)} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white">
                Győztes
              </label>
              <select id="winner" defaultValue="Győztes" className="select mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm">
              <option disabled={true}>Győztes</option>
                {
                   (teams.length!=0)?(
                    teams.map((e)=>(
                      <>
                          <option onClick={()=> {setWinner(e.team.full_name)}} key={e.id}>{e.team.full_name}</option>
                      </>
                  ))
                  ):(
                    <></>
                  )
                }
                </select>
            </div>

            <div key={'rslt'}>
              <label className="block text-sm font-medium text-white">
                Eredmény
              </label>
              <input id="rslt" onChange={writeData} type="text" value={formData.rslt} className="mt-1 block w-full px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
            </div>

          </div>
          <div key={'details'} className="mt-6">
              <label className="block text-sm font-medium text-white">
                {`Leírás (${detailsNum}/512)`}
              </label>
              <textarea maxLength={512} onInput={handleInput} id="details" type="text" onChange={writeData} value={formData.details} className="mt-1 block w-full h-auto hyphens-auto px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 border-gray-600 text-white shadow-sm" />
            </div>
        </div>
       
        
      </div>
    </form>
      


    </div>
    

  </div>
                
                
                </>
            
            )
            }

                  </>
          ):(
            
            <>



<>
    <div className="m-10 rounded-md bg-gradient-to-br from-indigo-950 to-slate-500 sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] mx-auto text-primary-content">
      <div className="card-body">
        <div className="flex justify-center pb-8 gap-10">
        <img className="w-56 h-56" src={`https://www.svgrepo.com/show/535410/game-controller.svg`} />
          <div className="card-title">
            <div className="pl-14">
              <p className="text-3xl pb-2 text-white text-center font-bold">{match.match.tournament.name}</p>
              <p className="text-3xl pb-2 text-white text-center">{match.match.tournament.game_mode}</p>
              <p className="text-2xl pb-2 text-white text-center">{formatDateTime(dateFormat(match.match.dte))}</p>
              <p className="text-3xl pb-2 text-white text-center font-bold">
                
              {
              (match.match.status=="unstarted")?(
                <p>{"Még nem kezdődött el"}</p>
            ):(
                (match.match.status=="ended")?(
                    <p>{"Befejeződött"}</p>
                ):(
                    (match.match.status=="interrupted")?(
                        <p>{"Félbeszakított"}</p>
                    ):(
                        (match.match.status=="started")?(
                            <p>{"Elkezdődött"}</p>
                        ):(
                            <></>
                          )
                      )
                  )
              )
            
              
              }
                </p>
            </div>
          </div>
        </div>


        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">

          <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm text-white font-bold">
                  Hely
                </dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                  <p className="break-words overflow-hidden max-w-full" >{match.match.place}</p>
                </dd>
            </div>
           
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm text-white font-bold">
                  Leírás
                </dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                  <p className="break-words overflow-hidden max-w-full" >{match.match.details}</p>
                </dd>
            </div>

            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                
                <div className="w-full col-span-10 mb-10 mx-auto rounded-lg shadow-lg md:mt-6 md:max-w-full sm:max-w-4xl xl:p-0 bg-gray-800 dark:border-gray-700">
                    <h2 className="mt-10 text-center text-4xl font-bold tracking-tight text-indigo-600">
                        <p>Versenyző csapatok</p>
                    </h2>

                    <div className="mx-auto mt-5 h-1 w-[60%] bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full" />
                      
                  <div className="p-8 md:p-10 text-center">
                    
                    {
                        (match.match.rslt!=null)?(
                            <p className="text-4xl text-white font-bold mb-10">{match.match.rslt}</p>
                        ):(
                            <p className="text-4xl text-white font-bold mb-10">Nincs eredmény</p>
                        )
                    }

                     <div className="flex flex-col">
                      <div className="grid gap-12 grid-cols-1 md:grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 justify-items-center">



                      <div>
                        <MatchTeam application={match.match.application1}/>
                      </div>


                      <div>
                        <MatchTeam application={match.match.application2}/>
                      </div>
                        
                      </div>
                     </div>                   
                    
                  </div>
                      </div> 




            </div>

              

              
            
          </dl>
        </div>

        

        
      </div>
    </div>

    
    
  </>
            
            
            
            
            
            
            
            </>


          )
          
        }
        
        </>
      )
    }

    
    
    </>

  )
}

export default Match