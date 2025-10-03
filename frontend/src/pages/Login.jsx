import Header from "../components/Header"
import Footer from "../components/Footer"
import { useState } from "react"
import { Navigate } from "react-router"

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [redirect, setRedirect] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post("http://localhost:5173/api/auth/login", {
        username,
        password,
      })
      localStorage.setItem("userId", data.userId)
      setRedirect(true)
    } catch (error) {
      alert(error.response?.data?.message || "error en login")
    }
  }
  if (redirect) return <Navigate to="/" replace />
  return (
    <div>
      <Header />
      <form onSubmit={handleSubmit}>
        <h2>Iniciar sesion</h2>
        <input type="text" placeholder="Usuario" value={username} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Entrar</button>
      </form>
      <Footer />
    </div>
  )
}

export default Login