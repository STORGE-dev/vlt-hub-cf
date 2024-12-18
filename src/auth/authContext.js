import React, { createContext, useState } from 'react';

const AuthContext = createContext();


const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const loginAuth = () => {
        console.log("loggin")
        localStorage.setItem('#657huythj0', 'q1w2e3r4t5y6u7i8o9p0a1s2d3f4g5h6j7k8l9m0n1b2v3c4x5z6y7w8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8u9V0W1X2Y3Z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x0Y1z2A3B4')
        setIsAuthenticated(true);

    };

    const Authenticate = () => {
        const key = localStorage.getItem('#657huythj0');
        console.log(key)
        if (key) {
            const AuthKey = key === 'q1w2e3r4t5y6u7i8o9p0a1s2d3f4g5h6j7k8l9m0n1b2v3c4x5z6y7w8A9B0C1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8u9V0W1X2Y3Z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x0Y1z2A3B4' ? true : false
            if(AuthKey===true){
                setIsAuthenticated(true);
            }
            
        } else {
            setIsAuthenticated(false);
        }
    }

    const logout = () => {
        localStorage.removeItem('#657huythj0');
        setIsAuthenticated(false);
    };

    return (

        <AuthContext.Provider value={{
            isAuthenticated,
            Authenticate,
            loginAuth,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
