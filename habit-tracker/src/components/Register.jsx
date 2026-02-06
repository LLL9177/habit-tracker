import fetchData from "../fetchData";
import { useState } from "react";

// don't forget that this is just a temporary register. It will have that logic, but we won't show it to user every second.
export default function Register({setMessage, setIsLoginActive}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');

    function submitForm(e) {
        e.preventDefault();
        const url = import.meta.env.VITE_BACKEND_URL + "/auth/register";
        const data = {
            username: username,
            password: password,
            passwordAgain: passwordAgain
        };
        fetchData(url, data)
            .then((res) => {
                setMessage(res.message || res.error);
                if (res.message) {
                    window.location.href = '/';
                }
            })
    }

    function handleLoginInstead() {
        setIsLoginActive(true);
    }

    return (
        <div className="register">
        <form onSubmit={e => {submitForm(e)}}>
            <label htmlFor="username">Login</label>
            <input 
                type="text" 
                name="username" 
                required 
                onChange={(e) => {setUsername(e.target.value)}}
                autoComplete="off"
            />
            <label htmlFor="password">Password</label>
            <input 
                type="password" 
                name="password" 
                required 
                onChange={(e) => {setPassword(e.target.value)}}
                autoComplete="off"
            />
            <label htmlFor="password-again">Repeat Password</label>
            <input 
                type="password" 
                name="password-again" 
                required 
                onChange={(e) => {setPasswordAgain(e.target.value)}}
                autoComplete="off"
            />
            <button type="submit">submit</button>
        </form>
        <button class="login-instead" onClick={handleLoginInstead}>Log in instead</button>
        </div>
    )
}