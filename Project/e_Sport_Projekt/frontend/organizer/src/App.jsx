import Navbar from "./components/common/Navbar";
import OrganizerLogin from "./components/organizer/OrganizerLogin";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import OrganizerContext from "./context/OrganizerContext";
import { OrganizerProvider } from "./context/OrganizerContext";
import { useContext, useEffect } from "react";
import SearchU from "./components/common/searches/SearchU";
import SearchTe from "./components/common/searches/SearchTe";
import SearchTo from "./components/common/searches/SearchTo";
import SearchE from "./components/common/searches/SearchE";
import Footer from "./components/common/Footer";
import Register from "./components/loggedout/Register";
import OrganizerProfile from "./components/organizer/OrganizerProfile";
import { ToastContainer } from "react-toastify";
import OrganizerPassReset from "./components/organizer/OrganizerPassReset";
import OrganizerEmailVerify from "./components/organizer/OrganizerEmailVerify";
import Main from "./components/loggedout/Main";
import { UserProvider } from "../../user/src/context/UserContext";
import UserProfile from "./components/user/UserProfile";

function App() {
  const isAuthenticated = useContext(OrganizerContext);

  return (
    
      <BrowserRouter>
      <OrganizerProvider>
        <UserProvider>
        <Navbar />
        <ToastContainer autoClose={3000} />
        <div className="flex flex-col min-h-screen">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<OrganizerLogin />} />
            <Route path="/password-reset" element={<OrganizerPassReset />} />
            <Route path="/email-verify" element={<OrganizerEmailVerify />} />
            <Route path="/player-search" element={<SearchU />} />
            <Route path="/team-search" element={<SearchTe />} />
            <Route path="/tournament-search" element={<SearchTo />} />
            <Route path="/event-search" element={<SearchE />} />
            <Route path="/organizer/profile/:name" element={<OrganizerProfile />} />
            <Route path="/user/profile/:name" element={<UserProfile />} />
            
          </Routes>
        </div>
        <Footer />
        </UserProvider>
        </OrganizerProvider>
      </BrowserRouter>
    
  );
}

export default App;
