import React, { useContext, useState } from 'react';
import {useNavigate  } from "react-router-dom"
import axios from 'axios';
import { Spin } from 'antd';

const Login = () => {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate()
  const [isSpin, setisSpin] = useState(false);

  //   useEffect(() => {
  //     message.info('Login to continue to Manage Console');
  //     const authData = JSON.parse(localStorage.getItem('auth') || '{}');
  //     const redirectUrl = sessionStorage.getItem('redirectUrl');

  //     if (authData) {
  //       navigate(redirectUrl || '/');
  //     }
  //   }, [navigate]);

  const HandleLogin = async () => {
    try {
      setisSpin(true)
      await axios.post("http://148.113.44.181:3000/api/v1/auth/login", { userid: userid, password: password });
      localStorage.setItem('#657huythj0', 'q1w2e3r4t5y6u7i8o9p0a1s2d3f4g5h6j7k8l9m0n1b2v3c4x5z6y7w8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8u9V0W1X2Y3Z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x0Y1z2A3B4')
      navigate('/')
      setisSpin(false)
    } catch (error) {
      console.log("error", error);
    }
  };

  // const HandleSignup = async () => {
  //     try {
  //         const res = await axios.post("/api/v1/auth/signup", { userid: userid, password: password });
  //         console.log(res)
  //         // const user = {
  //         //     paymentMethod: "Online-pay"
  //         // }
  //         // localStorage.setItem("_dgUSR", JSON.stringify(user));
  //         router.push("/login");
  //     } catch (error) {
  //         message.error("Log In Failed")
  //         console.log("error", error);
  //     }
  // };

  return (
    <>
      <Spin size="large" spinning={isSpin} fullscreen={true} />
      <div className="flex items-center justify-center h-screen">

        <div className="flex flex-col items-center justify-center p-8 rounded-lg shadow-lg w-80" style={{ backgroundColor: "#191919" }}>
          <h1 className="text-white text-4xl font-medium mb-8">Log In</h1>

          <div className="mb-4 w-full">
            <label htmlFor="userid" className="text-sm text-white">User ID</label>
            <input
              type="text"
              id="userid"
              placeholder="User ID"
              value={userid}
              onChange={(e) => setUserid(e.target.value)}
              required
              className="w-full p-2 border border-black rounded mt-2 text-black"
            />
          </div>

          <div className="mb-6 w-full">
            <label htmlFor="password" className="text-sm text-white">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-black rounded mt-2 text-black"
            />
          </div>

          <button onClick={HandleLogin} className="w-full bg-teal-800 text-white py-2 rounded hover:bg-teal-700 transition">
            Login
          </button>
        </div>

      </div>
    </>
  );
};

export default Login;
