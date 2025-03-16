import { useState } from "react";
import { toast } from "react-toastify";
import Footer from "./Footer";

function SearchTe() {
    
    const [searchInput, setSearchInput] = useState("");
    const [result, setResult] = useState([]);

    
    const [talalat, setTalalat] = useState("");
   
    const onSubmit =  (e)=>{
      
      e.preventDefault();

      fetch(`${import.meta.env.VITE_BASE_URL}/list/tenamesearch/${searchInput}`,
        {
          method: 'GET',
          headers:{
            "Content-type": "application/json"
          }
        }
      )
      .then(console.log(searchInput))
      .then(res=>res.json())
      .then(adat=>setResult(adat))
      .then(talalat => setTalalat(result.length > 0 ? talalat = result : talalat = "Nincs találat!"))
      .catch(err=>toast.error(err))
      
      console.log(result)     
      
    }    
    

    const writeData = (e) =>{
      setSearchInput(e.target.value);

      console.log("Input mező>>>"+searchInput)
  }

    return (
        <div className="flex flex-col min-h-screen">
            <h2 className="mt-10 text-center text-4xl font-bold tracking-tight text-indigo-600" >Csapat kereső</h2>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={onSubmit}>
                    <label htmlFor="team" className="block text-sm/6 font-medium text-indigo-600">Csapat teljes neve</label>

                    <div className="mt-2">
                        <input type="text" name="team" id="team" autoComplete="team" value={searchInput} onChange={writeData} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Keresés</button>
                    </div>
                </form>
            </div>



            <div className="m-5 h-screen">
              {(result.length > 0) ? (
                result.map((team, i)=> (<div key={i}>
                  <p>{team.full_name}</p>

                  </div>))
              ):
                (
                  <p>{talalat}</p>
                )
              }
            </div> 
        </div>
    )
}

export default SearchTe