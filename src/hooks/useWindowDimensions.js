import { useState, useEffect } from "react";

// From this stack overflow thread:
// https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export default function useWindowDimensions(disabled) {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      if (!disabled) setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [disabled]);

  return windowDimensions;
}
