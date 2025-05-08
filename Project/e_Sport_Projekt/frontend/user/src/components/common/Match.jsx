import { useState } from "react";
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import MatchTeam from "./MatchTeam";


function Match() {


    const {id} = useParams();
    const [match, setMatch] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(()=>{

        window.scroll(0,0)


        fetch(`${import.meta.env.VITE_BASE_URL}/list/matchbyid/${id}`,{
            method: "GET",
            headers: { "Content-type": "application/json" },
        }).then(res=> res.json())
        .then(adat=> {

            if(!adat.message){
                setMatch(adat); setIsLoading(false);
              }else{
                navigate('/');
              }
        })
        .catch(err=> alert(err));


    },[isLoading])


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


  return (
    
  <>
  
    {
        (isLoading)? (
            <p></p>
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

export default Match