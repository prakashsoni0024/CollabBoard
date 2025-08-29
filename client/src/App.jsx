import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Whiteboard from "./components/Whiteboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/whiteboard/:roomId" element={<Whiteboard />} />
      </Routes>
    </Router>
  );
}

export default App;

