import { useState, useEffect } from 'react'
import './admin.css'

import { auth, db } from '../../firebaseConnection'
import { signOut } from 'firebase/auth'

import { toast, ToastContainer, Bounce } from 'react-toastify';

import { FaDeleteLeft } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { CiLogout } from "react-icons/ci";

import {
    addDoc,
    collection,
    onSnapshot,
    query,
    orderBy,
    where,
    doc,
    deleteDoc,
    updateDoc,
} from 'firebase/firestore'

function Admin() {
    const [tarefaInput, setTarefaInput] = useState('')
    const [user, setUser] = useState({})
    const [tarefas, setTarefas] = useState([])
    const [edit, setEdit] = useState({})

    useEffect(() => {
        async function loadTarefas() {
            const userDetail = localStorage.getItem("@detailUser")
            setUser(JSON.parse(userDetail))

            if (userDetail) {
                const data = JSON.parse(userDetail)
                const tarefaRef = collection(db, "tarefas")
                const q = query(tarefaRef, orderBy('created', 'desc'), where('userUid', '==', data?.uid))

                const unsub = onSnapshot(q, (snapshot) => {
                    let lista = []
                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            tarefa: doc.data().tarefa,
                            userUid: doc.data().userUid
                        })
                    })
                    setTarefas(lista)
                })
            }
        }
        loadTarefas()
    }, [])

    async function handleRegister(e) {
        e.preventDefault()

        if (tarefaInput.length > '68') {
            toast.info('Limite de caracteres excedido, máximo de caracteres 60.', {
                position: "top-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            })
            return;
        } else if (tarefaInput.length < '7') {
            toast.info('Mínimo de caracteres são 7.', {
                position: "top-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            })
            return;
        }

        if (tarefaInput === '') {
            toast.info('Digite a sua tarefa...', {
                position: "top-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            return;
        }

        if (edit?.id) {
            handleUpdateTarefa()
            return;
        }

        await addDoc(collection(db, "tarefas"), {
            tarefa: tarefaInput,
            created: new Date(),
            userUid: user?.uid
        })
            .then((value) => {
                setTarefaInput('')
                toast.success('Tarefa registrada com sucesso', {
                    position: "top-left",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
            }).catch((error) => {
                console.log(error)
            })
    }

    async function handleLogout() {
        await signOut(auth)
    }

    async function deleteTarefa(id) {
        if (Object.keys(edit).length === 0) {
            const docRef = doc(db, "tarefas", id);
            await deleteDoc(docRef)
                .then(() => {
                    toast.success('Tarefa removida com sucesso...', {
                        position: "top-left",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        transition: Bounce,
                    });
                })
                .catch(() => {
                    toast.error('Erro ao remover tarefa', {
                        position: "top-left",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        transition: Bounce,
                    });
                });
        } else {
            toast.info('Não é possível remover enquanto estiver editando.', {
                position: "top-left",
                autoClose: 2000,
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

    function editTarefa(item) {
        setTarefaInput(item.tarefa)
        setEdit(item)
    }

    async function handleUpdateTarefa() {
        const docRef = doc(db, "tarefas", edit?.id)
        await updateDoc(docRef, {
            tarefa: tarefaInput
        })
            .then(() => {
                setTarefaInput('')
                setEdit({})
                toast.success('Tarefa atualizada com sucesso...', {
                    position: "top-left",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
            }).catch((error) => {
                console.log(error)
                setTarefaInput('')
                setEdit({})
            })
    }

    return (
        <div className='admin-container'>
            <h1>Página ADMIN!</h1>

            <form className='form' onSubmit={handleRegister}>
                <textarea
                    placeholder='Digite sua tarefa...'
                    value={tarefaInput}
                    onChange={(e) => setTarefaInput(e.target.value)}
                />

                {
                    Object.keys(edit).length > 0 ? (
                        <button className='btn-register' style={{ backgroundColor: '#6add39' }} type='submit'>Atualizar tarefa</button>
                    ) : (
                        <button className='btn-register' type='submit'>Registrar tarefa</button>
                    )
                }

            </form>

            {
                tarefas.map((item) => (
                    <article key={item.id} className='list'>
                        <p>{item.tarefa}</p>

                        <div>
                            <MdEdit onClick={() => editTarefa(item)} className='btn-icon' />
                            
                            <FaDeleteLeft
                                onClick={() => deleteTarefa(item.id)}
                                className='btn-icon'
                                style={{ cursor: Object.keys(edit).length === 0 ? 'pointer' : 'not-allowed', opacity: Object.keys(edit).length === 0 ? 1 : 0.5 }}
                            />
                        </div>
                    </article>
                ))
            }

            <button className='btn-logout' onClick={handleLogout}><CiLogout className='btn-logout-son'/></button>

            <ToastContainer
                position="top-left"
                autoClose={2000}
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

export default Admin
