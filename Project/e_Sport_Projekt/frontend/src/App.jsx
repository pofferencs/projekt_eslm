import Navbar from "./components/common/Navbar";
import UserMain from "./components/user/UserMain";
import UserLogin from './components/user/UserLogin';


import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

import {UserProvider} from './context/UserContext';

function App() {


  return (

      <div>
        <UserProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<UserMain />} />
              <Route path="/login" element={<UserLogin />} />
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </div>
  )
}

export default App
