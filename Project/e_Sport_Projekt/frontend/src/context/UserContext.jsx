import { createContext, useState } from "react"

const UserContext = createContext();

export const UserProvider = ({children})=>{

  const [refresh, setRefresh] = useState(false);
  const[isAuthenticated, setIsAuthenticated] = useState(false);

  const autStatus = () =>{
    fetch(`${import.meta.env.VITE_BASE_URL}/user/auth`,{
      method: 'GET',
      credentials: 'include',
      headers:{
        "Content-tpye":"application/json"
      }
    })
    .then(res=>res.json())
    .then(auth=>{
      if(auth.authenticated){
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    })
    .catch(err=>{alert(err);setIsAuthenticated(false)});
  }

  const update = ()=>{
    setRefresh(prev=>!prev);
  }

  const logout = (tokenName) =>{
    sessionStorage.removeItem(tokenName);
    setIsAuthenticated(false);
    update()
  }



  return<UserContext.Provider value={{
    refresh,
    update,
    logout,
    autStatus,
    isAuthenticated
  }}>{children}</UserContext.Provider>
}

export default UserContext;