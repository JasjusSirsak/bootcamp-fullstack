import { useState, useEffect } from 'react';

export default function Clock() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span 
      style={{ 
        display: 'inline-block', 
        minWidth: '95px', 
        fontVariantNumeric: 'tabular-nums' 
      }}
    >
      {time}
    </span>
  );
}