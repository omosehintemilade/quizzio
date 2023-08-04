import React from "react";

export default function Navbar({ time }) {
  return (
    <div
      className={`fixed top-0 left-0 right-0 shadow-lg py-5 text-center ${
        time <= 0 ? "bg-red-600 text-white" : ""
      }`}
    >
      Timer Countdown: 00:{time < 10 ? "0" + time : time}
    </div>
  );
}
