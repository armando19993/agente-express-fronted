import React, { useEffect, useState } from 'react'
import { instanceWithToken } from '../utils/instance'
import { toast } from 'sonner'

const Empresas = () => {

    const [empresas, setEmpresas] = useState([])

    const getEmpresas = () => {
        instanceWithToken.get('empresa').then((result) => {
            console.log(result)
        }).catch((error) => {
            toast.error(`Tienes un error de tipo: ${error?.response?.data.message}`)
            console.log(error)
        }).finally(() => {

        })
    }

    useEffect(() => {
        getEmpresas()
    }, [])


    const columns = [
        { header: 'ID', key: 'publicId' },
        { header: 'Razon Social', key: 'razon_social' },
        { header: 'Telefono', key: 'phone' },
        {
            header: 'Acciones',
            key: 'actions',
            render: (row) => (
                <div className="flex gap-2">
                    <Button icon={FaEdit} color="info" onClick={() => openModal('edit', row)} title="Editar" />
                    <Button icon={FaTrash} color='danger' onClick={() => openModal('delete', row)} title="Eliminar" />
                </div>
            ),
        },
    ];

    return (
        <div>Empresas</div>
    )
}

export default Empresas