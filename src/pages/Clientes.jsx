import React, { useEffect, useState } from 'react';
import HeaderLayout from '../components/layouts/HeaderLayout';
import Button from '../components/elements/Button';
import { FaPlusCircle, FaSave, FaEdit, FaTrash } from 'react-icons/fa';
import Modal from '../components/elements/Modal';
import Input from '../components/elements/Input';
import { instanceWithToken } from '../utils/instance';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import Table from '../components/elements/Table';

const Clientes = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('create');
    const [loading, setLoading] = useState(false);
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [clientes, setClientes] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState(null);

    const navigate = useNavigate();

    // Cerrar el modal y resetear los estados
    const closeModal = () => {
        setModalOpen(false);
        setNombre('');
        setTelefono('');
        setSelectedCliente(null);
    };

    // Obtener la lista de clientes
    const getClients = () => {
        instanceWithToken.get('clientes').then((result) => {
            setClientes(result.data.clientes);
        });
    };

    // Crear o actualizar un cliente
    const handleSave = () => {
        setLoading(true);
        const payload = { name: nombre, phone: telefono };

        if (modalType === 'create') {
            instanceWithToken.post('clientes', payload)
                .then((result) => {
                    toast.success('Cliente creado con éxito!');
                    closeModal();
                    getClients();
                    navigate(`/admin/clients/${result.data.data.id}`);
                })
                .catch((e) => {
                    if (e.response?.data?.error === 'El teléfono ya está registrado') {
                        toast.error('El teléfono ya está registrado');
                    } else {
                        toast.error('No se ha podido crear el cliente. ¡Intente nuevamente!');
                    }
                })
                .finally(() => setLoading(false));
        } else if (modalType === 'edit' && selectedCliente) {
            instanceWithToken.put(`clientes/${selectedCliente.id}`, payload)
                .then(() => {
                    toast.success('Cliente actualizado con éxito!');
                    closeModal();
                    getClients();
                })
                .catch((e) => {
                    toast.error('No se ha podido actualizar el cliente. ¡Intente nuevamente!');
                })
                .finally(() => setLoading(false));
        }
    };

    // Eliminar un cliente
    const handleDelete = () => {
        if (selectedCliente) {
            setLoading(true);
            instanceWithToken.delete(`clientes/${selectedCliente.id}`)
                .then(() => {
                    toast.success('Cliente eliminado con éxito!');
                    closeModal();
                    getClients();
                })
                .catch(() => {
                    toast.error('No se ha podido eliminar el cliente. ¡Intente nuevamente!');
                })
                .finally(() => setLoading(false));
        }
    };

    // Abrir el modal para crear, editar o eliminar
    const openModal = (type, cliente = null) => {
        setModalType(type);
        setSelectedCliente(cliente);
        if (type === 'edit' && cliente) {
            setNombre(cliente.name);
            setTelefono(cliente.phone);
        } else if (type === 'delete' && cliente) {
            setNombre(cliente.name);
            setTelefono(cliente.phone);
        } else {
            setNombre('');
            setTelefono('');
        }
        setModalOpen(true);
    };

    // Efecto para cargar los clientes al montar el componente
    useEffect(() => {
        getClients();
    }, []);

    // Columnas de la tabla
    const columns = [
        { header: 'ID', key: 'publicId' },
        { header: 'Nombre', key: 'name' },
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
        <div className="container mx-auto p-5 rounded-2xl bg-white">
            <HeaderLayout
                title="Clientes"
                actions={
                    <Button icon={FaPlusCircle} onClick={() => openModal('create')} title="Agregar Cliente" />
                }
            />

            {/* Modal para crear, editar o eliminar */}
            <Modal isOpen={modalOpen} onClose={closeModal} titulo={`${modalType === 'create' ? 'Crear' : modalType === 'edit' ? 'Editar' : 'Eliminar'} Cliente`}>
                {modalType !== 'delete' ? (
                    <>
                        <Input value={nombre} setvalue={setNombre} placeholder="Nombre" />
                        <Input value={telefono} setvalue={setTelefono} placeholder="Telefono" />
                    </>
                ) : (
                    <p>¿Estás seguro de que deseas eliminar al cliente {nombre} ({telefono})?</p>
                )}
                <div className="flex gap-2 mt-4">
                    {modalType !== 'delete' ? (
                        <Button icon={FaSave} onClick={handleSave} title={modalType === 'create' ? 'Guardar Cliente' : 'Actualizar Cliente'} loading={loading} size="full" />
                    ) : (
                        <Button icon={FaTrash} onClick={handleDelete} title="Eliminar Cliente" loading={loading} size="full" />
                    )}
                    <Button title="Cancelar" onClick={closeModal} size="full" variant="secondary" />
                </div>
            </Modal>

            {/* Tabla de clientes */}
            <Table columns={columns} data={clientes} />
        </div>
    );
};

export default Clientes;