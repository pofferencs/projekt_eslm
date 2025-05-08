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
import NewEvent from "./components/organizer/Organizing/NewEvent";
import NewTournament from "./components/organizer/Organizing/NewTournament";
import Event from "./components/organizer/Organizing/Event";
import Tournament from "./components/organizer/Organizing/Tournament";
import Game from "./components/organizer/Organizing/Game";
import Match from "./components/organizer/Organizing/Match";
import NewMatch from "./components/organizer/Organizing/NewMatch";

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

            {/* Organizer rész */}
            <Route path="/new-event" element={<NewEvent/>} />
            <Route path="/new-tournament" element={<NewTournament />} />
            <Route path="/event/:id" element={<Event />} />
            <Route path="/tournament/:id" element={<Tournament />} />
            <Route path="/game" element={<Game />} />
            <Route path="/match/:id" element={<Match/>} />
            <Route path="/new-match/:id" element={<NewMatch/>} />
            
          </Routes>
        </div>
        <Footer />
        </UserProvider>
        </OrganizerProvider>
      </BrowserRouter>
    
  );
}

export default App;
