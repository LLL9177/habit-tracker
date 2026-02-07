import { useEffect, useState } from "react"
// import { UserAgentTypeContext } from "../UserAgentType";

// smth new (or not) i learnt (remembered) here is that react is smart. It compares trees after updating state and changes only the ones
// that differ.
export default function Messages({ message, setMessage }) {
  const isHidden = !message;
  if (isHidden) return null;

  // const deviceType = useContext(UserAgentTypeContext);

  return (
    <div>
      <TimerLine setMessage={setMessage} />
      <p>{message}</p>
    </div>
  );
}

function TimerLine({ setMessage }) {
  const [lineWidth, setLineWidth] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setLineWidth(w => {
        if (w <= 0) {
          clearInterval(interval);
          setMessage(null);
          return 0;
        }
        return w - 0.2;
      });
    }, 10);

    return () => clearInterval(interval);
  }, [setMessage]);

  return (
    <div
      className="timer-line"
      style={{ width: `${lineWidth}%` }}
    />
  );
}