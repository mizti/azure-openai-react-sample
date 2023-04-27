import './App.css';
//import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import { Link } from "react-router-dom";
import Home from './components/Home';
import Navbar from './components/Navbar';
//import { useMsal } from '@azure/msal-react';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;