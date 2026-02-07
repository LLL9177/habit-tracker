import { useState, useRef, useEffect, useContext } from "react";
import fetchData from "../fetchData";
import { EditingContext } from "../editingContext";
import { EditingDataContext } from "../editingDatContext";

export default function Calendar({setMessage, fetchedData, setFetchedData}) {
    const [monthOffset, setMonthOffset] = useState(0); // It's just an offset from month number 0. Can be negative and positive.
    const [year, setYear] = useState(new Date().getFullYear())
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const daysRef = useRef(null);
    const currentMonthRef = useRef(null);

    function generateCalendar(year = new Date().getFullYear(), month = new Date().getMonth()) {
        const monthsDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        const firstDay = new Date(year, month, 1).getDay();
        const startIndex = (firstDay + 6) % 7;
        const calendarArray = new Array(7*5).fill('');
        for (let i = 0; i < monthsDays[month]; i++) {
            calendarArray[startIndex + i] = i + 1;
        }
        return calendarArray;
    }

    const calendarArray = generateCalendar(year, monthOffset);

    function incrementMonth() {
        const nextMonth = monthOffset + 1;
        currentMonthRef.current.classList.add("fade");
        setTimeout(() => {
            if (nextMonth > 11) {
                setMonthOffset(0);
                setYear(y => y + 1);
            } else {
                setMonthOffset(nextMonth);
            }
            currentMonthRef.current.classList.remove("fade");
        }, 100);
    }

    function decrementMonth() {
        const prevMonth = monthOffset - 1;
        currentMonthRef.current.classList.add("fade");
        setTimeout(() => {
            if (prevMonth < 0) {
                currentMonthRef.current.classList.add("fade");
                setTimeout(() => {currentMonthRef.current.classList.remove("fade")}, 20);
                setMonthOffset(11);
                setYear(y => y - 1);
            } else {
                setMonthOffset(prevMonth);
            }
            currentMonthRef.current.classList.remove("fade");
        }, 100);
    }

    useEffect(() => {
        const url = import.meta.env.VITE_BACKEND_URL + "/user/get_data";
        fetchData(url, {})
            .then((res) => {
                if (res.error) {
                    setMessage(res.error);
                } else {
                    setFetchedData(res.data);
                }
            }) 
    }, [setFetchedData, setMessage])

    return (
        <div className="calendar">
            <div className="head">
                <img 
                    src="/left-arrow.png" 
                    className="arrow-left" 
                    onClick={decrementMonth}
                    draggable="false"
                />
                <h2 className="current-month" ref={currentMonthRef}>{months[monthOffset]} {year} </h2>
                <img 
                    src="/right-arrow.png" 
                    className="arrow-right" 
                    onClick={incrementMonth}
                    draggable="false"
                />
            </div>
            <div className="days-of-week">
                <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
            </div>
                <Days 
                    ref={daysRef}
                    calendarArray={calendarArray}
                    fetchedData={typeof fetchedData == "string" ? JSON.parse(fetchedData) : []}
                    year={year}
                    month={monthOffset > 0 ? monthOffset+1 : -monthOffset + 1}
                />
        </div>
    )
}

function Days({ref, calendarArray, fetchedData, year, month}) {
    const [editing, setEditing] = useState(null);

    return (
        <div className="days" ref={ref}>
            {calendarArray.map((day, i) => {
                if (day === '' || fetchedData.length === 1) {
                    return (
                        <Day key={i} title="" date={`${day}:${month}:${year}`} editing={editing} setEditing={setEditing}>
                            {day}
                        </Day>
                    );
                } else {
                    const match = fetchedData.find(el => {
                        if (typeof el !== "number") {
                            const [d, m, y] = el.date.split(':').map(Number);
                            return d === day && m === month && y === year;
                        }
                    });
    
                    if (match) {
                        return (
                            <Day
                                key={i}
                                streak={match.streak}
                                isStreakAive={match.isStreakAlive}
                                title={match.title}
                                content={match.content}
                                date={match.date}
                                editing={editing} 
                                setEditing={setEditing}
                            >
                                {day}
                            </Day>
                        );
                    }
    
                    return (
                        <Day key={i} title="" date={`${day}:${month}:${year}`} editing={editing} setEditing={setEditing}>
                            {day}
                        </Day>
                    );
                }
                
            })}

        </div>
    );
}

function Day({streak, isStreakAive, title, content, children, date, editing, setEditing}) {
    const [isOpened, setIsOpened] = useState(false);
    const infoRef = useRef(null);
    const setEditingContextValue = useContext(EditingContext);
    const d = date.split(':')[0];

    let editedContent = '';
    if (content) {
        editedContent = content.length > 300
            ? content.slice(0, 300) + "…"
            : content;
    }

    function handleHover() {
        infoRef.current.classList.remove("hidden");
        setIsOpened(true);
    }

    function handleMouseLeave() {
        infoRef.current.classList.add("hidden");
        setIsOpened(false);
    }

    if (d == '') {
        return (
            <div className="day-wrapper">
            <div 
                className={"day"}
            >
                {children}
            </div>
            </div>
        )
    } else if (title !== '') {
        return (
            <div className="day-wrapper">
                <div 
                    className={isOpened ? "info" : "info hidden"}
                    ref={infoRef}
                >
                    <div className="title-container">
                        <img src="/foir.png" className="foir" />
                        <span className="this-streak-counter">{streak}</span>
                        <h3 className="title">{title}</h3>
                    </div>
                    <p className="content">{editedContent}</p>
                </div>
            <div 
                onMouseEnter={handleHover}
                onMouseLeave={handleMouseLeave}
                onClick={() => {
                    if (editing !== date) {
                        setEditingContextValue({
                            date: date,
                            streak: streak,
                            isStreakAive: isStreakAive,
                            title: title,
                            content: content
                        });
                        setEditing(date);
                    } else {
                        setEditingContextValue(null);
                        setEditing(null);
                    }
                }}
                className={"day " + (isStreakAive ? "with-streak" : "with-note") + ((editing ? editing == date : false) ? " editing" : '')}
            >
                {children}
            </div>
            </div>
        )
    } else {
        return (
            <div className="day-wrapper">
            <div 
                onClick={() => {
                    if (editing !== date) {
                        setEditingContextValue({
                            date: date,
                            streak: streak,
                            isStreakAive: isStreakAive,
                            title: title,
                            content: content
                        });
                        setEditing(date);
                    } else {
                        setEditingContextValue(null);
                        setEditing(null);
                    }
                }}
                className={editing == date ? "day editing" : "day"}
            >
                {children}
            </div>
            </div>
        )
    }
}