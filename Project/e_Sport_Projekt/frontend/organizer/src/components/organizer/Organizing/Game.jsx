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

  let formObj = {
    name: ""
  }

  const [game, setGame] = useState(formObj);
  

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


  const writeData = (e) => {
    setGame((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));

    console.log(game);
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
                  id={x.id}
                  type="text"
                  value={game.name}
                  onChange={writeData}
                  placeholder={x.name}
                  className="w-72 px-3 py-2.5 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-zinc-700 border-zinc-600 text-gray-400 shadow-sm"
                  required disabled/>
                
                </div>
                <div className="flex flex-row gap-5">
                  <button onClick={()=> {
                    if(document.getElementById(x.id).hasAttribute('disabled')){
                      setGame("");
                      document.getElementById(x.id).toggleAttribute('disabled');
                      document.getElementById(`btn-${x.id}`).toggleAttribute('disabled');
                      document.getElementById(`rn-${x.id}`).removeAttribute('src');
                      document.getElementById(`rn-${x.id}`).setAttribute('src', "https://www.svgrepo.com/show/453311/cancel.svg");

                      document.getElementById(x.id).classList.remove('text-gray-400');
                      document.getElementById(x.id).classList.add('text-white');
                    }else{
                      setGame("");
                      document.getElementById(x.id).value = "";
                      document.getElementById(x.id).toggleAttribute('disabled');
                      document.getElementById(`btn-${x.id}`).toggleAttribute('disabled');
                      document.getElementById(`rn-${x.id}`).removeAttribute('src');
                      document.getElementById(`rn-${x.id}`).setAttribute('src', "https://www.svgrepo.com/show/511904/edit-1479.svg");

                      document.getElementById(x.id).classList.remove('text-white');
                      document.getElementById(x.id).classList.add('text-gray-400');
                      
                    }

                  }} className="btn bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-500 transition duration-200" ><img id={`rn-${x.id}`} src="https://www.svgrepo.com/show/511904/edit-1479.svg" className="w-5" alt="Átnevezés"/></button>
                  <button id={`btn-${x.id}`} disabled className="btn bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-500 transition duration-200"><img src="https://www.svgrepo.com/show/514262/tick-checkbox.svg" className="w-5" alt="Módosít"/></button>
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