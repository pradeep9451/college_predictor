import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Predict from './pages/Predict';
import About from './pages/About';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Signup from './pages/Signup';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import Profile from "./pages/Profile"; // adjust path if needed
import CollegeDetail from './pages/CollegeDetail';
import AdminCollegeForm from './pages/AdminCollegeForm';
import CollegeList from './pages/CollegeList';
import Contact from './pages/Contact';




function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // prevent flicker

  useEffect(() => {
  fetch("http://localhost:8000/api/auth/me", {
    credentials: "include", // ✅ includes session cookie
  })
    .then((res) => res.ok ? res.json() : Promise.reject())
    .then((data) => {
      setUser(data.user);
      localStorage.setItem("isLoggedIn", "true");
      setLoading(false);
    })
    .catch(() => {
      localStorage.setItem("isLoggedIn", "false");
      setUser(null);
      setLoading(false);
    });
}, []);


  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/college/:id" element={<CollegeDetail />} />
        <Route path="/admin" element={<AdminCollegeForm/>}/>


        <Route
          path="/predict"
          element={
            <PrivateRoute user={user}>
              <Predict />
            </PrivateRoute>
          }
        />
                <Route
          path="/college-list"
          element={
            <PrivateRoute user={user}>
              <CollegeList />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
