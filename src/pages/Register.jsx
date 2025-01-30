import React, { useState } from 'react';
import imgLogo from '../assets/logo.png';
import { instance, instanceWithToken } from '../utils/instance';
import Input from '../components/elements/Input';
import Cookies from 'js-cookie'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { duration } from 'moment/moment';
import Button from '../components/elements/Button';
import { FaUserGraduate } from 'react-icons/fa';

const Register = () => {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [razon_social, setRazonSocial] = useState("")
    const [documento, setDocumento] = useState("")
    const [telefono, setTelefono] = useState("")
    const [direccion, setDireccion] = useState("")
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const [regsitrando, setRegistrando] = useState(false)

    const register = () => {
        const payload = { name, razon_social, documento, telefono, direccion, user, password, }

        if (!name || !razon_social || !documento || !telefono || !direccion || !user || !password) {
            toast.error("Debes Llenar todos los campos correctamente")
        }

        instanceWithToken.post('auth/register', payload).then((result) => {
            toast.success("Empresa registrada con exito, procede a iniciar sesion")
            navigate("/login")
        }).catch((e) => {
            console.log(e)
            toast.error(e.status === 400 ? e.response.data.message : "Error al registrar, intenta nuevamente!")
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
                            Registrate
                        </h1>
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center mt-8">
                            {/* Título que ocupa las dos columnas */}
                            <span className="col-span-2 text-center text-lg font-semibold mb-4">
                                Datos de la Empresa
                            </span>

                            {/* Inputs */}
                            <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    autocomplete={false}
                                    value={razon_social}
                                    setvalue={setRazonSocial}
                                    placeholder={"Razon Social"}
                                />
                                <Input
                                    value={documento}
                                    setvalue={setDocumento}
                                    placeholder={"Documento"}
                                />
                                <Input
                                    autocomplete={false}
                                    value={telefono}
                                    setvalue={setTelefono}
                                    placeholder={"Telefono"}
                                />
                                <Input
                                    value={direccion}
                                    setvalue={setDireccion}
                                    placeholder={"Direccion"}
                                />

                            </div>

                            <span className="col-span-2 text-center text-lg font-semibold mb-4">
                                Datos del Usuario
                            </span>

                            <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">

                                <Input
                                    autocomplete={false}
                                    value={user}
                                    setvalue={setUser}
                                    placeholder={"Usuario"}
                                />
                                <Input
                                    type="password"
                                    value={password}
                                    setvalue={setPassword}
                                    placeholder={"Contraseña"}
                                />


                            </div>
                            <div className="col-span-2 gap-4">
                                <Input
                                    value={name}
                                    setvalue={setName}
                                    placeholder={"Nombre"}
                                />
                            </div>

                            {/* Botón que ocupa las dos columnas */}

                            <Button
                                loading={regsitrando}
                                title={'Registrate'}
                                icon={FaUserGraduate}
                                onClick={register}
                            />


                            {/* Enlace que ocupa las dos columnas */}
                            <p className="col-span-2 mt-6 text-xs text-gray-600 text-center">
                                Tienes una cuenta?
                                <Link
                                    to={"/login"}
                                    className="ml-3 border-b border-gray-500 border-dotted"
                                >
                                    Inicia Sesion
                                </Link>
                            </p>
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

export default Register;