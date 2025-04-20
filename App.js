import './App.css';
import SignUp from './components/SignUp/signUp';
import Login from './components/Login/login';
import UnLockAdmin from './components/UnLockAdmin/unLockAdmin';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unlock" element={<UnLockAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
