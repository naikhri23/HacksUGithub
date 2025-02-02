"use client";

import React, { useState, useEffect } from 'react';
import MyButton from "@/components/Button";
import UrlGeneration from "@/components/UrlGeneration";

export default function Home() {
  const [username, setUsername] = useState("");
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(username === "");
  }, [username]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  return (
    <div className="flex flex-col justify-center gap-12 items-center justify-items-center min-h-dvh p-8 pb-20 sm:p-20 font-sans">
      <div className="flex flex-row gap-4">
        <h1 className="font-bold text-6xl text-slate-700">Slide</h1>
        <h1 className="font-bold text-6xl text-cyan-600">SU</h1>
      </div>
     
      <form 
        onSubmit={handleSubmit}
        className="form-slide-up flex align-items-center flex-col gap-8 row-start-3 items-center justify-center sm:items-start bg-white py-12 px-36 rounded-2xl shadow-xl w-96"
      >
        <div className="flex justify-center items-center gap-4 w-full">
          <input
            id="username"
            className="text-black border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-1"
            type="text"
            name="name"
            placeholder="Enter your username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="flex flex-col items-center w-full gap-4">
          <MyButton 
            title="File Upload" 
            typeOfClick="upload" 
            color="bg-sky-600 hover:bg-sky-700" 
          />
          <MyButton 
            title="Submit" 
            typeOfClick="submit" 
            url={UrlGeneration()} 
            color="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400" 
            disabled={disabled}
          />
        </div>
      </form>
    </div>
  );
}