import Header from "../components/Header"
import Footer from "../components/Footer"
import { useState } from "react"

function Register() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const VITE_URL = import.meta.env.VITE_API_URL
    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`${VITE_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            })
            const data = await res.json()
            alert(data.message)
        } catch (error) {
            alert("Error al conectar al servidor")
            console.log(error)
        }

    }
    return (
        <div>
            <Header />
            <form onSubmit={handleRegister}>
                <h2>Crear cuenta</h2>
                <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Crear cuenta</button>
            </form>
            <Footer />
        </div>
    )
}

export default Register