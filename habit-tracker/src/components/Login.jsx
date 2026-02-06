import { useState } from "react";
import fetchData from "../fetchData";

export default function Login({setMessage, setIsLoginActive}) {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    function submitLogin(e) {
        e.preventDefault();
        const url = import.meta.env.VITE_BACKEND_URL + "/auth/login";
        const data = {
            username: login,
            password: password
        }
        fetchData(url, data)
            .then((res) => {
                setMessage(res.message || res.error);
                if (res.message) {
                    window.location.href = '/';
                }
            })
    }

    function handleRegisterInstead() {
        setIsLoginActive(false);
    }

    return (
        <div className="login">
            <form onSubmit={(e) => {submitLogin(e)}}>
                <label htmlFor="username">Login</label>
                <input 
                    type="text" 
                    name="username" 
                    onChange={(e) => {setLogin(e.target.value)}}
                    autoComplete="off"
                />
                <label htmlFor="password">Password</label>
                <input 
                    type="password" 
                    name="password" 
                    onChange={(e) => {setPassword(e.target.value)}}
                    autoComplete="off"
                />
                <button type="submit">Log in</button>
            </form>
            <button class="register-instead" onClick={handleRegisterInstead}>Register instead</button>
        </div>
    )
}