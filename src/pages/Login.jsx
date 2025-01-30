import React, { useEffect, useState } from 'react';
import imgLogo from '../assets/logo.png';
import { instance } from '../utils/instance';
import Input from '../components/elements/Input';
import Cookies from 'js-cookie'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Login = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")

    useEffect(() => {
        const authenticate = Cookies.get("sesion")
        if(authenticate){
            navigate("/")
        }
    }, [])

    const login = () => {
        const payload = {
            user, password
        }

        instance.post('auth/login', payload).then((result) => {
            Cookies.set("token", result.data.token)
            Cookies.set("sesion", true)
            Cookies.set("role", result.data.data.type_user)
            Cookies.set("usuario", result.data.data.user)
            Cookies.set("id", result.data.data.id)
            Cookies.set("nombre", result.data.data.name)
            Cookies.set("empresaId", result.data.data.empresaId)
            toast.success('Sesion Iniciada con exito');
            console.log(result.data.data)
            navigate("/")
        }).catch((e) => {
            toast.error("Error al iniciar sesion, corrige tus datos")
        })
    }
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center items-center">
            <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12 flex flex-col items-center">
                    <div>
                        <img
                            src={imgLogo}
                            className="w-150 mx-auto"
                            alt="Logo"
                        />
                    </div>
                    <div className="mt-12 flex flex-col items-center justify-center w-full">
                        <h1 className="text-2xl xl:text-3xl font-extrabold">
                            Inicia sesión
                        </h1>
                        <div className="w-full flex flex-col items-center justify-center flex-1 mt-8">
                            <div className="w-full max-w-xs">
                                <Input
                                    value={user}
                                    setvalue={setUser}
                                    placeholder={"Usuario"}
                                />
                                <Input
                                    type='password'
                                    value={password}
                                    setvalue={setPassword}
                                    placeholder={"Contraseña"}
                                />
                                <button
                                    onClick={login}
                                    className="mt-5 tracking-wide font-semibold bg-[#70C544] text-gray-100 w-full py-4 rounded-lg hover:bg-[#A8E392] transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                >
                                    <svg
                                        className="w-6 h-6 -ml-2"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                        <circle cx="8.5" cy="7" r="4" />
                                        <path d="M20 8v6M23 11h-6" />
                                    </svg>
                                    <span className="ml-3">
                                        Iniciar Sesion
                                    </span>
                                </button>

                                <p class="mt-6 text-xs text-gray-600 text-center">
                                    No tienes Cuenta?
                                    <Link to={'/register'} class="ml-3 border-b border-gray-500 border-dotted">
                                        Registrate
                                    </Link>
                                  
                                </p>

                            </div>

                        </div>
                    </div>
                </div>
                <div className="flex-1 bg-[#C4F1B9] text-center hidden lg:flex">
                    <div
                        className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
                        style={{ backgroundImage: "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')" }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default Login;