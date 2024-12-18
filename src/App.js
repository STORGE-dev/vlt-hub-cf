import { Routes, Route, useNavigate } from "react-router-dom"
import axios from "axios";
import Normal from "./pages/normal";
import Requests from "./pages/requests";
import Login from "./pages/login";
import { useEffect, useState } from "react";
import Settings from "./pages/settings";
import Alert from "./pages/alert";

axios.defaults.baseURL = "http://3.6.230.95"
axios.defaults.withCredentials = false

function App() {

  const navigate = useNavigate()
  const [IsAuthenticated,setIsAuthenticated] = useState(false)

  useEffect(() => {

    const auth = localStorage.getItem('#657huythj0')
    const key = 'q1w2e3r4t5y6u7i8o9p0a1s2d3f4g5h6j7k8l9m0n1b2v3c4x5z6y7w8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8u9V0W1X2Y3Z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x0Y1z2A3B4'
    if (auth === key) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
      navigate('/login');
    }
  }, []);


  return (

    <Routes>
      <Route path="/" element={<Normal />} />
      <Route path="/requests" element={<Requests />} />
      <Route path="/alert-request" element={<Alert />} />
      {/* <Route path="/settings" element={<Settings />} /> */}
      <Route path="/login" element={<Login />} />

    </Routes>


  );
}

export default App;
