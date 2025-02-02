'use client';

import MyButton from "@/components/Button";
import UrlGeneration from "@/components/UrlGeneration";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_20px_1fr_20px] items-center justify-items-center min-h-dvh p-8 pb-20 gap-6 sm:p-20 font-sans bg-blue-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Slide Connect</h1>

      <form className="flex flex-col gap-8 row-start-3 items-center sm:items-start bg-white p-10 rounded-2xl shadow-lg w-96">
        <div className="flex items-center gap-4 w-full">
          <label htmlFor="username" className="text-gray-700 font-medium">Username:</label>
          <input
            id="username"
            className="text-black border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-1"
            type="text"
            name="name"
            placeholder="Enter your username"
          />
        </div>
        <div className="flex flex-col items-center w-full gap-4">
          <MyButton title="File Upload" typeOfClick="upload" />
          <MyButton title="Submit" typeOfClick="submit" />
        </div>
      </form>

      <div className="text-2xl font-bold text-gray-800 mt-10">
        <UrlGeneration />
      </div>
    </div>
  );
}
