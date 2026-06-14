"use client";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme") === "light";
    setIsLight(saved);
    if (saved) {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }
  }, []);

  const toggle = () => {
    const newVal = !isLight;
    setIsLight(newVal);
    if (newVal) {
      document.body.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="sidebar-link"
      style={{
        width: "100%",
        border: "none",
        background: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 14px",
        textAlign: "left"
      }}
    >
      {isLight ? (
        <>
          <Moon size={18} /> Mode Gelap
        </>
      ) : (
        <>
          <Sun size={18} /> Mode Terang
        </>
      )}
    </button>
  );
}
