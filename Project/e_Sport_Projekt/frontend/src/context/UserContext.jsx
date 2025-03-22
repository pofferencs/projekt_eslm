import { createContext, useState } from "react"

const UserContext = createContext();

export const UserProvider = ({children})=>{

  const [refresh, setRefresh] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authStatus = () =>{
    fetch(`${import.meta.env.VITE_BASE_URL}/user/auth`,{
      method: 'GET',
      credentials: 'include',
      headers:{
        "Content-Type":"application/json"
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

  const logout = () =>{
   
    fetch(`${import.meta.env.VITE_BASE_URL}/user/logout`,{
     method: 'POST',
     credentials: 'include',
     headers: {
      "Content-Type": "application/json"
     } 
    }).catch(err=>{alert(err)});

    setIsAuthenticated(false);
    update()
  }

  const login = (formData, method) => {
    fetch(`${import.meta.env.VITE_BASE_URL}/user/login`, {
      method: method,
      credentials: 'include',
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(token => {
        if (!token.message) {
          sessionStorage.setItem('tokenU', token);
          authStatus();
          pageRefresh();
        } else {
          alert(token.message);
        }
      })
      .catch(err => alert(err));

  }

  const pageRefresh = () =>{
    window.location.reload();
  }



  return<UserContext.Provider value={{
    refresh,
    update,
    logout,
    authStatus,
    isAuthenticated,
    login,
    pageRefresh
  }}>{children}</UserContext.Provider>
}

export default UserContext;