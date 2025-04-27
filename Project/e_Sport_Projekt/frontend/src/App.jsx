import Navbar from "./components/common/Navbar";
import UserMain from "./components/user/UserMain";
import UserLogin from "./components/user/UserLogin";
import LoggedOutMain from "./components/loggedout/LoggedOutMain";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import UserContext from "./context/UserContext";
import { UserProvider } from "./context/UserContext";
import { useContext, useEffect } from "react";
import SearchU from "./components/common/searches/SearchU";
import SearchTe from "./components/common/searches/SearchTe";
import SearchTo from "./components/common/searches/SearchTo";
import SearchE from "./components/common/searches/SearchE";
import Footer from "./components/common/Footer";
import Register from "./components/loggedout/Register";
import UserProfile from "./components/user/UserProfile";
import { ToastContainer } from "react-toastify";

function App() {
  const isAuthenticated = useContext(UserContext);

  return (
    
      <BrowserRouter>
      <UserProvider>
        <Navbar />
        <ToastContainer autoClose={3000}/>
        <div className="flex flex-col min-h-screen">
          <Routes>
            
            { (isAuthenticated) ? (
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
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/player-search" element={<SearchU />} />
            <Route path="/team-search" element={<SearchTe />} />
            <Route path="/tournament-search" element={<SearchTo />} />
            <Route path="/event-search" element={<SearchE />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/profile/:name" element={<UserProfile />} />
            
          </Routes>
        </div>
        <Footer />
        </UserProvider>
      </BrowserRouter>
    
  );
}

export default App;
