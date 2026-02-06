import Calendar from "./components/Calendar";
import Register from "./components/Register";
import Login from "./components/Login";
import { useRef, useState } from "react";
import Messages from "./components/Messages";
import fetchData from "./fetchData";
import DayEditor from "./components/DayEditor";
import {EditingContext} from "./editingContext";
import UserRecords from "./components/UserRecods";
import Map from "./components/Map";
import { EditingDataContext } from "./editingDatContext";

const backgrounds = [
  "rgb(63, 51, 51)",
  "rgb(51, 63, 55)",
  "rgb(51, 51, 63)",
  "rgb(163, 153, 14)",
  "rgb(30, 61, 77)"
]
const background = backgrounds[Math.floor(Math.random()*backgrounds.length)];

export default function App() {
  const [message, setMessage] = useState(null);
  const [editing, setEditing] = useState(null)
  const [calendarData, setCalendarData] = useState([]);
  const [isLoginActive, setIsLoginActive] = useState(false);
  const col2 = calendarData.length==0 ? (
    <>
      {isLoginActive ? 
      (<Login 
        setMessage={setMessage} 
        setIsLoginActive={setIsLoginActive}
      />) 
      : (<Register 
        setMessage={setMessage} 
        setIsLoginActive={setIsLoginActive}
      />)}
    </>
  ) : (
    <>
      <UserRecords 
        setMessage={setMessage}
        calendarData={calendarData}
        setCalendarData={setCalendarData}
      />
    </>
  );

  function logout() {
    const url = import.meta.env.VITE_BACKEND_URL + "/auth/logout";
    fetchData(url, {})
      .then((res) => {
        if (res.error) {
          setMessage(res.error);
        } else {
          setMessage(res.message);
          setCalendarData([]);
        }
    })
  }

  return (
    <>
    <button class="logout" onClick={logout}></button>
    <div className="layout-stuff" style={{backgroundColor: background}}>
    <EditingDataContext value={editing}>
      <EditingContext value={setEditing}>
        <Calendar 
          setMessage={setMessage}
          fetchedData={calendarData}
          setFetchedData={setCalendarData}
        />
      </EditingContext>
    </EditingDataContext>
    {col2}
    <EditingContext value={setEditing}>
      <DayEditor 
        editing={editing}
        setEditing={setEditing}
        setCalendarData={setCalendarData}
        setMessage={setMessage}
      />
    </EditingContext>
    <Map />
    </div>
    </>
  )
}