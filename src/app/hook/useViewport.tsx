import { useState, useEffect } from "react";

export const useViewport = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [screenSize, setScreenSize] = useState<string>("xl"); // Default to 'xl'

  useEffect(() => {
    const handleWindowResize = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
      setHeight(window.innerHeight);

      // Determine screen size based on width
      if (newWidth < 576) {
        setScreenSize("sm"); // Mobile
      } else if (newWidth < 768) {
        setScreenSize("md"); // Tablet
      } else {
        setScreenSize("xl"); // Desktop and larger
      }
    };

    window.addEventListener("resize", handleWindowResize);
    handleWindowResize(); // Call once to set initial size
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return { width, height, screenSize };
};
