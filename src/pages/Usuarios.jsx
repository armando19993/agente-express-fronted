import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import HeaderLayout from '../components/layouts/HeaderLayout';
import Button from '../components/elements/Button';
import { FaPlusCircle, FaSave, FaEdit, FaTrash } from 'react-icons/fa';
import Modal from '../components/elements/Modal';
import Input from '../components/elements/Input';
import Select from '../components/elements/Select';
import { instanceWithToken } from '../utils/instance';
import { toast } from 'sonner';
import Table from '../components/elements/Table';

const Usuarios = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('create');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [telefono, setTelefono] = useState('');
    const [typeUser, setTypeUser] = useState('OPERADOR');
    const [empresaId, setEmpresaId] = useState(Cookies.get("empresaId") || '');
    const [empresas, setEmpresas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const role = Cookies.get("role");

    const closeModal = () => {
        setModalOpen(false);
        setUser('');
        setPassword('');
        setName('');
        setTelefono('');
        setTypeUser('OPERADOR');
        setSelectedUser(null);
        if (role === 'SUPERADM') setEmpresaId('');
    };

    const getUsuarios = () => {
        instanceWithToken.get('users').then((result) => {
            setUsuarios(result.data.data);
        });
    };

    const getEmpresas = () => {
        instanceWithToken.get('empresa').then((result) => {
            setEmpresas(result.data.data);
        });
    };

    const handleSave = () => {
        setLoading(true);
        const payload = {
            user,
            password,
            name,
            telefono,
            type_user: typeUser,
            empresaId: empresaId || null
        };

        if (modalType === 'create') {
            instanceWithToken.post('users', payload)
                .then(() => {
                    toast.success('Usuario creado con éxito!');
                    closeModal();
                    getUsuarios();
                })
                .catch(() => toast.error('No se ha podido crear el usuario. ¡Intente nuevamente!'))
                .finally(() => setLoading(false));
        } else if (modalType === 'edit' && selectedUser) {
            instanceWithToken.put(`users/${selectedUser.id}`, payload)
                .then(() => {
                    toast.success('Usuario actualizado con éxito!');
                    closeModal();
                    getUsuarios();
                })
                .catch(() => toast.error('No se ha podido actualizar el usuario. ¡Intente nuevamente!'))
                .finally(() => setLoading(false));
        }
    };

    const openModal = (type, usuario = null) => {
        setModalType(type);
        setSelectedUser(usuario);
        if (type === 'edit' && usuario) {
            setUser(usuario.user);
            setPassword('');
            setName(usuario.name);
            setTelefono(usuario.telefono || '');
            setTypeUser(usuario.type_user);
            setEmpresaId(usuario.empresaId || '');
        } else {
            setUser('');
            setPassword('');
            setName('');
            setTelefono('');
            setTypeUser('OPERADOR');
            if (role === 'SUPERADM') setEmpresaId('');
        }

        if (role === 'SUPERADM') {
            getEmpresas();
        }
        setModalOpen(true);
    };

    useEffect(() => {
        getUsuarios();
    }, []);

    const typeUserOptions = role === 'SUPERADM' ? [
        { value: 'SUPERADM', label: 'Super Administrador' },
        { value: 'ADMIN', label: 'Administrador' },
        { value: 'OPERADOR', label: 'Operador' }
    ] : [
        { value: 'ADMIN', label: 'Administrador' },
        { value: 'OPERADOR', label: 'Operador' }
    ];

    const columns = [
        { header: 'ID', key: 'publicId' },
        { header: 'Usuario', key: 'user' },
        { header: 'Nombre', key: 'name' },
        { header: 'Teléfono', key: 'telefono' },
        { header: 'Rol', key: 'type_user' },
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
                title="Usuarios"
                actions={<Button icon={FaPlusCircle} onClick={() => openModal('create')} title="Agregar Usuario" />}
            />

            <Modal isOpen={modalOpen} onClose={closeModal} titulo={`${modalType === 'create' ? 'Crear' : 'Editar'} Usuario`}>
                <Input value={user} setvalue={setUser} placeholder="Usuario" />
                <Input value={password} setvalue={setPassword} placeholder="Contraseña" type="password" />
                <Input value={name} setvalue={setName} placeholder="Nombre" />
                <Input value={telefono} setvalue={setTelefono} placeholder="Teléfono" />
                <Select options={typeUserOptions} value={typeUser} setValue={setTypeUser} placeholder="Seleccione el tipo de usuario" />
                {role === 'SUPERADM' && (
                    <Select
                        options={empresas.map(e => ({ value: e.id, label: e.razon_social }))}
                        value={empresaId}
                        setvalue={setEmpresaId}
                        placeholder="Seleccione una empresa"
                    />
                )}
                <div className="flex gap-2 mt-4">
                    <Button icon={FaSave} onClick={handleSave} title="Guardar Usuario" loading={loading} size="full" />
                    <Button title="Cancelar" onClick={closeModal} size="full" variant="secondary" />
                </div>
            </Modal>
            <Table columns={columns} data={usuarios} />
        </div>
    );
};

export default Usuarios;