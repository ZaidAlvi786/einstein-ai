import React, { useState, useEffect } from "react";
import ReactMarkDown from "../Markdown";

const Typewriter = ({ text, delay, onTypingEnd, highlightedText }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text?.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      onTypingEnd();
    }
  }, [currentIndex, delay, text]);

  return <ReactMarkDown data={currentText} highlightedText={highlightedText} />;
};

export { Typewriter };