// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Signup from './components/Signup';
import Signin from './components/Signin';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Homepage from './components/Homepage';
import { UserProvider } from './components/UserContext';
import NavbarMain from './components/HomepageComponents/NavbarMain';

// Create a Layout component that will handle Navbar rendering based on route
const Layout = () => {
    const location = useLocation(); // Get current route
    return (
        <>
            {/* Conditionally render NavbarMain based on the current path */}
            {location.pathname === '/homepage' && <NavbarMain />}
            
            {/* Render routes */}
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/homepage" element={<Homepage />} />
            </Routes>
        </>
    );
};

function App() {
    return (
        <UserProvider>
            <Router>
                <Layout /> {/* Use the Layout component for conditional rendering */}
            </Router>
        </UserProvider>
    );
}

export default App;
