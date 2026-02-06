import { useState, useEffect } from "react";
import fetchData from "../fetchData";

const greetings = [
  "Welcome,",
  "Hello,",
  "Hey,",
  "Hey there,",
  "Greetings,",
  "Ahoi,",
  "Good to see you,",
  "Nice to have you here,",
  "What’s up,",
  "How’s it going,",
  "Glad you’re back,",
  "Yo,",
  "Ah yes...",
  "Another day, another login -",
  "The legend returns,",
  "System online. User detected: ",
  "All systems ready,",
  "You made it,",
  "We’re live,",
  "Let’s go,",
];
const welcomeMessage = greetings[Math.floor(Math.random()*greetings.length)];

export default function UserRecords({setMessage, calendarData, setCalendarData}) {
    const [username, setUsername] = useState('');
    const parsedData = calendarData.length >= 2 ? JSON.parse(calendarData) : '__';

    useEffect(() => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL + "/user/get_username"
        fetchData(backendUrl, {})
            .then((res) => {
                if (res.error) {
                    setMessage(res.error);
                } else {
                    setUsername(res.username)
                }
            })
    }, [])

    return (
        <div className="user-records">
            <div className="idk">
                <h1>{welcomeMessage} {username}</h1>
            </div>
            <div className="counters">
                <h2>Current streak: {parsedData ? parsedData[0] : ''}</h2>
                <h2>All time best: {parsedData ? parsedData[1] : ''}</h2>
            </div>
            <p>
                And remember: Don't break the chain. And if you did, never miss twice.
            </p>
        </div>
    )
}