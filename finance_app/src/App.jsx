import { Routes, Route } from "react-router-dom";
import Login from "./windows/Login"; 
import Signup from "./windows/Signup"; 

function App() {
  return(
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgotpassword" element={<forgot />} />
    </Routes>
  ); 
}

export default App
