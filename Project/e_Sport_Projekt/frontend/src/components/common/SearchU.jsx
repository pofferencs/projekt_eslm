import { useState, useEffect } from "react";
import { toast } from "react-toastify";

function SearchU() {
    
    const [searchInput, setSearchInput] = useState("");
    const [result, setResult] = useState([]);
   
    const onSubmit =  (e)=>{
      
      e.preventDefault();

      fetch(`${import.meta.env.VITE_BASE_URL}/list/unamesearch/${searchInput}`,
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
      .catch(err=>toast.error(err))
      
      console.log(result)     
      
    }    

    const writeData = (e) =>{
      setSearchInput(e.target.value);

      console.log("Input mező>>>"+searchInput)
  }

    return (
        <div>
            <h2 className="mt-10 text-center text-4xl font-bold tracking-tight text-indigo-600" >Játékos kereső</h2>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={onSubmit}>
                    <label htmlFor="username" className="block text-sm/6 font-medium text-indigo-600">Felhasználónév</label>

                    <div className="mt-2">
                        <input type="text" name="username" id="username" autoComplete="username" required value={getData.usr_name} onChange={writeData} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Keresés</button>
                    </div>
                </form>
            </div>



            <div className="m-5">
              {(result.length > 0) ? (
                result.map((user, i)=> (<div key={i}><p >{user.usr_name}</p></div>))
              ):
                (
                  <p>asd</p>
                )
              }
            </div> 


        </div>
    )
}

export default SearchU