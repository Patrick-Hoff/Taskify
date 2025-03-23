import { useState } from "react"

import { Link } from "react-router-dom"

import { auth } from '../../firebaseConnection'
import { createUserWithEmailAndPassword } from "firebase/auth"
import { useNavigate } from "react-router-dom"

import { toast, ToastContainer, Bounce } from 'react-toastify';


function Register() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault()

    if (email !== '' && password !== '') {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigate('/admin', { replace: true })
        }).catch((error) => {
          console.log(error)
          if (error.code === 'auth/email-already-in-use' || error.code === 'auth/invalid-email') {
            toast.error('Digite um email valido...', {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
              });
          } else if(error.code === 'auth/weak-password') {
            toast.info('A sua senha deve ter no minimo 6 caracteres.', {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
              });
          }
        })
    } else {
      toast.info('Preencha todos os campos...', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }


  }

  return (
    <div className="home-container">
      <h1>Cadastre-se</h1>
      <span>
        Vamos criar sua conta!
      </span>
      <form className="form" onSubmit={handleRegister}>
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

        <button type="submit">Cadastrar</button>
      </form>

      <Link className="button-link" to='/'>
        Já possui uma conta? Faça o login!
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
        theme="colored"
        transition={Bounce}
      />

    </div>
  )
}

export default Register