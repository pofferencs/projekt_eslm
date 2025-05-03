import { useContext, useEffect, useState } from "react"
import OrganizerContext from "../../../context/OrganizerContext";
import { useNavigate } from "react-router-dom";


function Game() {

  
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInput, setIsInput] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const {isAuthenticated} = useContext(OrganizerContext);
  const navigate = useNavigate();
  

  useEffect(()=>{

    if(!isAuthenticated){
      navigate('/');
    }

  }, [isAuthenticated]);


  useEffect(()=>{

    fetch(`${import.meta.env.VITE_BASE_URL}/list/game`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
    .then(res=>res.json())
    .then(adat=> {setGames(adat); setLoading(false); setRefresh(false)})
    .catch(err=>alert(err));

  },[refresh]);



  return (

    <>

      <h2 className="mt-10 text-center text-4xl font-bold tracking-tight text-indigo-600">
        Játékok kezelése
      </h2>

    
      <div className="mt-10 flex flex-col gap-5 justify-center">
      

      {
        (isInput==true)?(
          <div className="flex flex-col">
          <div className="flex flex-row justify-center gap-2">
              <button className="btn bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-500 transition duration-200 w-fit">Felvétel</button>
              <button className="btn bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-500 transition duration-200 w-fit" onClick={()=> setIsInput(false)}>Mégse</button>
            </div>
            <input
                id="game"
                type="text"
                placeholder="Játék"
                className="mt-5 w-72 px-3 py-2.5 mx-auto border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-zinc-700 border-zinc-600 text-white shadow-sm"
                required/>
            </div>
        ):(
          <div className="flex flex-row justify-center gap-2">
          <button className="btn bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-500 transition duration-200 w-fit" onClick={()=> setIsInput(true)}>Új játék felvétele</button>
          </div>
        )
      }

      

    </div>


    <div className="flex flex-row justify-center mt-5">
      <div className="w-full rounded-lg shadow-lg md:mt-6 sm:max-w-xl xl:p-0 bg-zinc-800 dark:border-zinc-700">
      {
        (loading == true)? (
          <p></p>
        ):(          

            games.map((x, i)=>(

              <div key={i} className="flex flex-row m-5">
                <div className="mx-auto my-auto">
                <input
                id={x.name}
                type="text"
                placeholder={x.name}
                className="mt-5 w-72 px-3 py-2.5 mx-auto my-auto border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-zinc-700 border-zinc-600 text-white shadow-sm"
                required disabled/>
                </div>
                <div className="flex flex-row gap-5">
                  <button onClick={()=> {
                    if(document.getElementById(x.name).hasAttribute('disabled')){
                      document.getElementById(x.name).toggleAttribute('disabled')
                    }else{
                      document.getElementById(x.name).toggleAttribute('disabled');
                      
                    }

                  }} className="btn bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-500 transition duration-200" ><img src="https://www.svgrepo.com/show/511904/edit-1479.svg" className="w-5" alt="Átnevezés"/></button>
                  <button className="btn bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-500 transition duration-200"><img src="https://www.svgrepo.com/show/500534/delete-filled.svg" className="w-5" alt="Törlés"/></button>
                </div>
              </div>

            ))
        )

        
      } 
      </div>
    </div>
    

    </>
  )
}

export default Game