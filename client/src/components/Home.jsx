import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import FAQSection from "./FAQSection";
import Footer from "./Footer";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (roomId.trim().length >= 4) {
      navigate(`/whiteboard/${roomId}`);
    } else {
      alert("Please enter a valid Room ID (at least 4 characters).");
    }
  };

  return (
    <>
      <Navbar />
      <div className=" min-h-screen items-center justify-center bg-[#e9ecef] pt-16 scroll-smooth ">
        <div className="mx-auto mb-12 mt-25">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 md:mb-8 text-gray-800">
            Sketch up your ideas with Draw
          </h1>
          <p className="text-center text-gray-600 text-lg">
            Enter a Room ID to join an existing whiteboard session or create a
            new one.
          </p>
        </div>
        <div className="max-w-lg flex flex-col items-center justify-center mx-auto bg-white p-8 rounded-lg shadow-lg">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#343a40]"
          />
          <button
            onClick={handleJoin}
            className="w-full bg-[#495057] hover:bg-[#343a40] text-white font-medium py-3 rounded-lg transition-all duration-200"
          >
            🚪 Join Room
          </button>
        </div>

        <section className="text-center my-15 py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-gray-800">
            Made for artists of all ages
          </h2>

          <div className="flex flex-col md:flex-row justify-center gap-10 px-4 md:px-20">
            {/* Students */}
            <div className="flex-1 max-w-sm mx-auto">
              <img
                src="https://content-management-files.canva.com/cdn-cgi/image/f=auto,q=70/91e0dee0-5bcd-4f75-9a08-79d745a8f878/draw_01_benefit_students2x.png" // Replace with your actual path
                alt="Students"
                className="mx-auto mb-6 w-16 h-16"
              />
              <h3 className="text-xl font-semibold mb-4">Students</h3>
              <p className="text-gray-600">
                With intuitive elements and automatic drawing tools, it’s easier
                to rekindle creativity and increase design confidence for
                students of all ages.
              </p>
            </div>

            {/* Teachers */}
            <div className="flex-1 max-w-sm mx-auto">
              <img
                src="https://content-management-files.canva.com/cdn-cgi/image/f=auto,q=70/bdfeb69c-ad50-4bff-a5db-10fddd7484f6/draw_02_benefit_teachers2x.png"
                alt="Teachers"
                className="mx-auto mb-6 w-16 h-16"
              />
              <h3 className="text-xl font-semibold mb-4">Teachers</h3>
              <p className="text-gray-600">
                Improve communication and creativity in the classroom with
                automatic syncing to your whiteboard for class brainstorming.
              </p>
            </div>

            {/* Professionals */}
            <div className="flex-1 max-w-sm mx-auto">
              <img
                src="https://content-management-files.canva.com/cdn-cgi/image/f=auto,q=70/e3317d6f-63f5-4036-ba26-bf44b4f2202b/draw_03_benefit_professionals2x.png"
                alt="Professionals"
                className="mx-auto mb-6 w-16 h-16"
              />
              <h3 className="text-xl font-semibold mb-4">Professionals</h3>
              <p className="text-gray-600">
                Make your team process collaborative, with easy drawing &
                editing and a tool designed for brainstorming and project
                inspiration.
              </p>
            </div>
          </div>
        </section>
        <FAQSection />
       
      </div>
       <Footer />
    </>
  );
};

export default Home;
