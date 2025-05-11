import Navbar from "./components/common/Navbar";
import UserLogin from "./components/user/UserLogin";
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
import UserPassReset from "./components/user/UserPassReset";
import UserEmailVerify from "./components/user/UserEmailVerify";
import Main from "./components/loggedout/Main";
import UserTeams from "./components/user/UserTeams";
import Event from "./components/common/Event";
import Tournament from "./components/common/Tournament";
import TeamEdit from "./components/user/TeamEdit";
import NewTeam from "./components/user/NewTeam";
import MyInvites from "./components/common/Invite/MyInvites";
import Match from "./components/common/Match";
import OrganizerProfile from "./components/common/OrganizerProfile";


function App() {
  const isAuthenticated = useContext(UserContext);

  return (

    <BrowserRouter>
      <UserProvider>
        <Navbar />
        <ToastContainer autoClose={3000} />
        <div className="flex flex-col min-h-screen">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/myteams" element={<UserTeams />} />
            <Route path="/newteam" element={<NewTeam />} />
            <Route path="/teamedit/:id" element={<TeamEdit />} />
            <Route path="/myinvites" element={<MyInvites />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/password-reset" element={<UserPassReset />} />
            <Route path="/email-verify" element={<UserEmailVerify />} />
            <Route path="/player-search" element={<SearchU />} />
            <Route path="/team-search" element={<SearchTe />} />
            <Route path="/tournament-search" element={<SearchTo />} />
            <Route path="/event-search" element={<SearchE />} />
            <Route path="/profile/:name" element={<UserProfile />} />
            <Route path="/event/:id" element={<Event />} />
            <Route path="/tournament/:id" element={<Tournament />} />
            <Route path="/match/:id" element={<Match />} />
            <Route path="/organizer/profile/:name" element={<OrganizerProfile/> }/>
            
          </Routes>
        </div>
        <Footer />
      </UserProvider>
    </BrowserRouter>

  );
}

export default App;
