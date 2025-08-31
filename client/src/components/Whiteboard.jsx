import React, { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // For unique note IDs

const socket = io("https://collabboard-dq8t.onrender.com");

// const socket = io("http://localhost:5000");

let lastX = 0;
let lastY = 0;

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(2);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const { roomId } = useParams();
  const [notes, setNotes] = useState([]);
  const [selectedColor, setSelectedColor] = useState("#ffff88");
  

  // Load notes from localStorage when app starts
  useEffect(() => {
    const saved = localStorage.getItem("notes");
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (err) {
        console.error("Invalid notes in localStorage", err);
        setNotes([]);
      }
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("notes", JSON.stringify(notes));
    }
  }, [notes]);

  useEffect(() => {
    socket.emit("joinRoom", roomId);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 🔁 New user receives full board state
    socket.on("initBoard", (history) => {
      history.forEach(({ x0, y0, x1, y1, color, brushSize }) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      });
    });

    // 🎯 Draw from other users
    socket.on("draw", ({ x0, y0, x1, y1, color, brushSize }) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    });

    // 🧹 Clear from other users
    socket.on("clear", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Clean up listeners when component unmounts
    return () => {
      socket.off("initBoard");
      socket.off("draw");
      socket.off("clear");
    };
  }, [roomId]);

  const getRelativeCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack((prev) => [...prev, imageData]);
    setRedoStack([]); // clear redo on new action
  };

  const undo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (undoStack.length === 0) return;

    const lastState = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setRedoStack((prev) => [...prev, current]);
    ctx.putImageData(lastState, 0, 0);
  };

  const redo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (redoStack.length === 0) return;

    const nextState = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack((prev) => [...prev, current]);
    ctx.putImageData(nextState, 0, 0);
  };

  const startDrawing = (e) => {
    const coords = getRelativeCoords(e);
    lastX = coords.x;
    lastY = coords.y;
    setDrawing(true);
    saveState(); // save before new draw
  };

  const draw = (e) => {
    if (!drawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const coords = getRelativeCoords(e);
    const x = coords.x;
    const y = coords.y;

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    socket.emit("draw", {
      x0: lastX,
      y0: lastY,
      x1: x,
      y1: y,
      color,
      brushSize,
    });

    lastX = x;
    lastY = y;
  };

  // for touch devices
  const startTouchDrawing = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const coords = getRelativeCoords(touch);
    lastX = coords.x;
    lastY = coords.y;
    setDrawing(true);
    saveState();
  };

  const touchDraw = (e) => {
    e.preventDefault();
    if (!drawing) return;

    const touch = e.touches[0];
    const coords = getRelativeCoords(touch);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    socket.emit("draw", {
      x0: lastX,
      y0: lastY,
      x1: coords.x,
      y1: coords.y,
      color,
      brushSize,
    });

    lastX = coords.x;
    lastY = coords.y;
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const exportImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const clearBoard = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit("clear");
    saveState(); // save before clear
  };

  return (
    <div className="relative">
      {/* Toolbar */}
      <div className="absolute top-2 left-2 right-2 z-10 bg-white/90 p-4 rounded-lg shadow-md max-w-[98%] mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        {/* Drawing Tools */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-gray-700">🎨 Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 border border-gray-300 cursor-pointer"
          />

          <label className="text-sm font-medium text-gray-700">🖌️ Brush:</label>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-28"
          />

          <div className="flex items-center  gap-2 mt-2 sm:mt-0">
            <button
              onClick={exportImage}
              className="bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-600 transition"
            >
              📷 Export
            </button>

            <button
              onClick={clearBoard}
              className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 transition"
            >
              🧹 Clear
            </button>

            <button
              onClick={undo}
              className="bg-yellow-500 text-white px-3 py-1 rounded shadow hover:bg-yellow-600 transition"
            >
              ↩️ Undo
            </button>

            <button
              onClick={redo}
              className="bg-green-500 text-white px-3 py-1 rounded shadow hover:bg-green-600 transition"
            >
              ↪️ Redo
            </button>
          </div>
        </div>

        {/* Sticky Note Tools */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-gray-800">
            🗒️ Note Color:
          </label>
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-10 h-10 border border-gray-300 cursor-pointer"
            title="Choose note color"
          />

          <button
            onClick={() => {
              const newNote = {
                id: uuidv4(),
                x: 100,
                y: 100,
                text: "New Note",
                color: selectedColor,
              };
              setNotes((prev) => [...prev, newNote]);
              socket.emit("addNote", newNote);
            }}
            className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md shadow hover:bg-blue-800 transition-colors"
          >
            ➕ Add Note
          </button>
        </div>
      </div>

      <div>
        {notes.map((note) => (
          <div
            key={note.id}
            className="absolute p-3 rounded-lg w-[180px] shadow-lg cursor-move bg-opacity-90"
            style={{ left: note.x, bottom: note.y, backgroundColor: note.color }}
            draggable
            onDragEnd={(e) => {
              const updated = { ...note, x: e.clientX, y: e.clientY };
              setNotes((prev) =>
                prev.map((n) => (n.id === updated.id ? updated : n))
              );
              socket.emit("updateNote", updated);
            }}
          >
            {/* Delete Button */}
            <div className="flex justify-end mb-1">
              <button
                onClick={() => {
                  setNotes((prev) => prev.filter((n) => n.id !== note.id));
                  socket.emit("deleteNote", note.id);
                }}
                className="text-red-500 font-bold hover:text-red-700"
                title="Delete Note"
              >
                ❌
              </button>
            </div>

            {/* Editable Content */}
            <div
              contentEditable
              suppressContentEditableWarning
              className="whitespace-pre-wrap break-words focus:outline-none"
              onBlur={(e) => {
                const updated = { ...note, text: e.target.innerText };
                setNotes((prev) =>
                  prev.map((n) => (n.id === updated.id ? updated : n))
                );
                socket.emit("updateNote", updated);
              }}
            >
              {note.text}
            </div>
          </div>
        ))}
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startTouchDrawing}
        onTouchMove={touchDraw}
        onTouchEnd={stopDrawing}
        className="border-2 border-black block bg-white w-screen h-screen touch-none"
      />
    </div>
  );
};

export default Whiteboard;

