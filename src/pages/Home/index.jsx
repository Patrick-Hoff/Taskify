import { useState } from "react"
import './home.css'

import { Link } from "react-router-dom"

import { auth } from '../../firebaseConnection'
import { signInWithEmailAndPassword } from "firebase/auth"

import { useNavigate } from "react-router-dom"

import { toast, ToastContainer, Bounce } from 'react-toastify';
import { CiLogin } from "react-icons/ci";

function Home() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault()

    if (email !== '' && password !== '') {

      await signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigate('/admin', { replace: true })
        }).catch((error) => {
          console.log(error)
          if (error.code === 'auth/invalid-email' || error.code === 'auth/invalid-credential') {
            toast.info('Email ou senha invalidos...', {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              transition: Bounce,
            });
          }
        })

    } else {
      toast.info('Email ou senha invalidos...', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }


  }

  return (
    <div className="home-container">
      <h1>Lista de tarefas</h1>
      <span>
        Gerencie sua agenda de forma fácil.
      </span>
      <form className="form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Digite seu email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="*********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="bnt-login-father">Acessar <CiLogin className="btn-login" /></button>
      </form>

      <Link className="button-link" to='/register'>
        Não possui uma conta? Cadastre-se
      </Link>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />

    </div>
  )
}

export default Home