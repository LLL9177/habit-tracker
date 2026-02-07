import { useState } from "react";
import { EditingContext } from "../editingContext";
import fetchData from "../fetchData";

export default function DayEditor({editing, setEditing, setCalendarData, setMessage}) {
    const [text, setText] = useState('');
    const [title, setTitle] = useState('');
    const [isStreakAlive, setIsStreakAlive] = useState(editing ? editing.isStreakAive : false);

    function handleChange(e) {
        if (e.target.value.length < 1000) {
            setText(e.target.value);
        }
    }

    function handleDeleteButtonHover(e) {
        e.target.style.backgroundImage = "url(/trash_button_hover.png)"
    }

    function handleDeleteButtonMouseLeave(e) {
        e.target.style.backgroundImage = "url(/trash_button.png)"
    }

    function handleEditButtonHover(e) {
        e.target.style.backgroundImage = "url(/edit_button_hover.png)"
    }

    function handleEditButtonMouseLeave(e) {
        e.target.style.backgroundImage = "url(/edit_button.png)"
    }

    function handleEdit(e) {
        e.preventDefault();
        const url = import.meta.env.VITE_BACKEND_URL + "/user/post_data";
        const data = {
            date: editing.date,
            title: title,
            content: text,
            isStreakAlive: isStreakAlive,
        }
        fetchData(url, {"data": data})
            .then((res) => {
                if (res.data) {
                    setMessage(res.message)
                    setCalendarData(res.data);
                    setText('');
                    setTitle('');
                    setEditing(null);
                } else {
                    setMessage(res.error);
                }
            })
    }

    return (
        <div className="day-editor">
            {editing
                ? <></>
                : <div className="day-editor_cover"><h1>Please click on one of the days in the calendar to start editing</h1></div>
            }
            <form onSubmit={(e) => {handleEdit(e)}}>
                <Checkbox 
                    onClick={setIsStreakAlive}
                />
                <input 
                    type="text" 
                    value={title}
                    onChange={(e) => {setTitle(e.target.value)}}
                    autoComplete="off"
                    requred={"true"}
                    class="title"
                    placeholder="Title"
                    disabled={editing ? false : true}
                />
                <div className="content-wrapper">
                    <textarea 
                        value={text}
                        onChange={(e) => {handleChange(e)}}
                        placeholder="Write down a note here"
                        requred={"true"}
                        class="content"
                        disabled={editing ? false : true}
                    />
                </div>
                <div className="control-buttons">
                    <button 
                        type="submit" 
                        class="edit"
                        disabled={editing ? false : true}
                        style={{backgroundImage: "url(/edit_button.png)"}}
                        onMouseEnter={(e) => {handleEditButtonHover(e)}}
                        onMouseLeave={(e) => {handleEditButtonMouseLeave(e)}}
                    >
                        </button>
                    <button 
                        class="delete"
                        disabled={editing ? false : true}
                        style={{backgroundImage: "url(/trash_button.png)"}}
                        onMouseEnter={(e) => {handleDeleteButtonHover(e)}}
                        onMouseLeave={(e) => {handleDeleteButtonMouseLeave(e)}}
                    >
                        </button>
                </div>
            </form>
        </div>
    )
}

function Checkbox({onClick}) {
    const [checked, setChecked] = useState(false);
    const imgChecked = "/foir.png";
    const imgUnchecked = "/lost_foir.png";
    
    return (
        <img 
            src={checked ? imgChecked : imgUnchecked}
            class="checkbox"
            onClick={() => {setChecked(!checked); onClick(!checked)}}
        />
    )
}