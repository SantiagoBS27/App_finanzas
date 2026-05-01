import { Routes, Route } from "react-router-dom";
import Login from "./windows/Login"; 
import Signup from "./windows/Signup"; 
import Home from "./windows/Home"; 

function App() {
  return(
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home name="Santi" />} />
      
    </Routes>
  ); 
}

export default App
