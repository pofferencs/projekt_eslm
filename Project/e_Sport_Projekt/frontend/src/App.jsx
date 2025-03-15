import Navbar from "./components/common/Navbar";
import UserMain from "./components/user/UserMain";
import UserLogin from './components/user/UserLogin';
import LoggedOutMain from "./components/loggedout/LoggedOutMain";
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import UserContext from "./context/UserContext";
import { UserProvider } from './context/UserContext';
import { useContext } from "react";
import SearchU from "./components/common/SearchU";


function App() {

  const isAuthenticated  = useContext(UserContext);
  const authStatus  = useContext(UserContext);
  const token = sessionStorage.getItem('tokenU');
  
  

  return (

      <div>
        <UserProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              {
              (isAuthenticated || token) && (
                <Route path="/" element={<UserMain />} />
              )}
              {(!isAuthenticated || !token) &&(
                <Route path="/" element={<LoggedOutMain />} />
              )}
              <Route path="/login" element={<UserLogin />} />
              <Route path="/player-search" element={<SearchU />}/>
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </div>
  )
}

export default App
