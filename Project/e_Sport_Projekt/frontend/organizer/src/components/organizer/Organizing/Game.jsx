import { useContext, useEffect, useState } from "react"
import OrganizerContext from "../../../context/OrganizerContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


function Game() {

  
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInput, setIsInput] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const {isAuthenticated, authStatus} = useContext(OrganizerContext);
  const [gameName, setGameName] = useState("");
  const navigate = useNavigate();

  let formObj = {
    id: 0,
    name: ""
  }

  const [game, setGame] = useState(formObj);
  

  useEffect(()=>{

    if(!isAuthenticated){
      navigate('/');
    }

  }, [isAuthenticated]);

  const gameFetch = () =>{
    fetch(`${import.meta.env.VITE_BASE_URL}/list/game`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
    .then(res=>res.json())
    .then(adat=> {setGames(adat); setLoading(false); setRefresh(false)})
    .catch(err=>alert(err));
  }


  useEffect(()=>{

    gameFetch();

  },[refresh]);

  
  const kuldes = (name)=>{

    // console.log(name)
    setRefresh(true);

    fetch(`${import.meta.env.VITE_BASE_URL}/insert/game`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name: gameName
      }
      ),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          
          toast.error(data.message);
        } else {
          toast.success(data.message);
          authStatus();
          setRefresh(false)
          gameFetch();
        }

      }).catch(err => alert(err));    

  };


  const torles = (id)=>{

    setRefresh(true);

    fetch(`${import.meta.env.VITE_BASE_URL}/delete/game`, {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        id: id
      }
      ),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          
          toast.error(data.message);
        } else {
          toast.success(data.message);
          authStatus();
          setRefresh(false)
        }

      }).catch(err => alert(err));

  };


  const modify = (id, get, set)=>{

    setRefresh(true);

    fetch(`${import.meta.env.VITE_BASE_URL}/update/game`, {
      method: "PATCH",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        id: id,
        name_get: get,
        name_set: set
      }
      ),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          
          toast.error(data.message);
        } else {
          toast.success(data.message);
          authStatus();
          setRefresh(false);
          document.getElementById(`input-${id}`).value = "";
        }

      }).catch(err => alert(err));
  };


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
              <button onClick={()=> kuldes(gameName)} className="btn bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-500 transition duration-200 w-fit">Felvétel</button>
              <button className="btn bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-500 transition duration-200 w-fit" onClick={()=> {setIsInput(false); setGameName("")}}>Mégse</button>
            </div>
            <input
                id="game"
                type="text"
                onChange={(e)=>{setGameName(e.target.value)}}
                placeholder="Játék neve"
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

    <div className="flex flex-row justify-center mt-5 mb-5">
      <div className="w-full rounded-lg shadow-lg md:mt-6 sm:max-w-xl xl:p-0 bg-zinc-800 dark:border-zinc-700">
      {
        (loading == true)? (
          <p></p>
        ):(          
            games.map((x, i)=>(

              <div key={i} className="flex flex-row m-5">
                <div className="mx-auto my-auto">
                  <input
                  id={`input-${x.id}`}
                  type="text"
                  placeholder={x.name}
                  className="w-72 px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-zinc-700 border-zinc-600 text-white shadow-sm"
                  required/>
                
                </div>
                  <div className="flex flex-row gap-5">
                    <button id={`btn-mod-${x.id}`} onClick={()=>{modify(x.id, x.name, document.getElementById(`input-${x.id}`).value)}} className="btn bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-500 transition duration-200"><img src="https://www.svgrepo.com/show/281284/file-files-and-folders.svg" className="w-6" alt="Átnevezés"/></button>
                    <button id={`btn-del-${x.id}`} onClick={()=>{torles(x.id)}} className="btn bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-500 transition duration-200"><img src="https://www.svgrepo.com/show/500534/delete-filled.svg" className="w-6" alt="Törlés"/></button>
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