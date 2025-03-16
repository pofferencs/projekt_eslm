import Navbar from "./components/common/Navbar";
import UserMain from "./components/user/UserMain";
import UserLogin from './components/user/UserLogin';
import LoggedOutMain from "./components/loggedout/LoggedOutMain";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import UserContext from "./context/UserContext";
import { UserProvider } from './context/UserContext';
import { useContext } from "react";
import SearchU from "./components/common/SearchU";
import SearchTe from "./components/common/SearchTe";
import SearchTo from "./components/common/SearchTo";
import SearchE from "./components/common/SearchE";
import Footer from "./components/common/Footer";


function App() {

  const isAuthenticated = useContext(UserContext);
  const authStatus = useContext(UserContext);
  const token = sessionStorage.getItem('tokenU');

  return (

    <UserProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {token || isAuthenticated ? (
            <>
              <Route path="/" element={<UserMain />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<LoggedOutMain />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
          <Route path="/login" element={<UserLogin />} />
          <Route path="/player-search" element={<SearchU />} />
          <Route path="/team-search" element={<SearchTe />} />
          <Route path="/tournament-search" element={<SearchTo />} />
          <Route path="/event-search" element={<SearchE />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App
