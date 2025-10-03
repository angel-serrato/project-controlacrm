import User from "../models/User.js"

export const registerUser = async (req, res) => {
  const { username, password } = req.body
  try {
    const exists = await User.findOne({ username })
    if (exists) return res.status(400).json({ message: "Usuario ya existe" })
    const user = await User.create({ username, password })
    res.status(201).json({ message: "Usuario creado", userId: user._id })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const loginUser = async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await User.findOne({ username })
    if (!user) return res.status(401).json({ message: "credenciales invalidas" })
    res.json({ message: "login exitoso", userId: user._id })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
