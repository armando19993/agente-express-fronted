import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import HeaderLayout from '../components/layouts/HeaderLayout';
import Button from '../components/elements/Button';
import { FaPlusCircle, FaSave, FaEdit, FaTrash } from 'react-icons/fa';
import Modal from '../components/elements/Modal';
import Input from '../components/elements/Input';
import Select from '../components/elements/Select'; // Nuevo componente Select
import { instanceWithToken } from '../utils/instance';
import { toast } from 'sonner';
import Table from '../components/elements/Table';

const Sucursales = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('create');
    const [loading, setLoading] = useState(false);
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [empresaId, setEmpresaId] = useState(Cookies.get("empresaId") || '');
    const [empresas, setEmpresas] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [selectedSucursal, setSelectedSucursal] = useState(null);

    const closeModal = () => {
        setModalOpen(false);
        setNombre('');
        setDireccion('');
        setTelefono('');
        setSelectedSucursal(null);
        if (!Cookies.get("empresaId")) setEmpresaId('');
    };

    const getSucursales = () => {
        instanceWithToken.get('empresa-sucursales').then((result) => {
            setSucursales(result.data);
        });
    };

    const getEmpresas = () => {
        instanceWithToken.get('empresa').then((result) => {
            setEmpresas(result.data);
        });
    };

    const handleSave = () => {
        setLoading(true);
        const payload = {
            name: nombre,
            direccion: direccion,
            telefono: telefono,
            empresaId: empresaId || null
        };

        if (modalType === 'create') {
            instanceWithToken.post('empresa-sucursales', payload)
                .then(() => {
                    toast.success('Sucursal creada con éxito!');
                    closeModal();
                    getSucursales();
                })
                .catch(() => toast.error('No se ha podido crear la sucursal. ¡Intente nuevamente!'))
                .finally(() => {
                    setLoading(false)
                    getSucursales()
                });
        } else if (modalType === 'edit' && selectedSucursal) {
            instanceWithToken.patch(`empresa-sucursales/${selectedSucursal.id}`, payload)
                .then(() => {
                    toast.success('Sucursal actualizada con éxito!');
                    closeModal();
                    getSucursales();
                })
                .catch(() => toast.error('No se ha podido actualizar la sucursal. ¡Intente nuevamente!'))
                .finally(() => {
                    setLoading(false)
                    getSucursales()
                });
        }
    };

    const handleDelete = () => {
        if (selectedSucursal) {
            setLoading(true);
            instanceWithToken.delete(`empresa-sucursales/${selectedSucursal.id}`)
                .then(() => {
                    toast.success('Sucursal eliminada con éxito!');
                    closeModal();
                    getSucursales();
                })
                .catch(() => toast.error('No se ha podido eliminar la sucursal. ¡Intente nuevamente!'))
                .finally(() => setLoading(false));
        }
    };

    const openModal = (type, sucursal = null) => {
        setModalType(type);
        setSelectedSucursal(sucursal);
        if (type === 'edit' && sucursal) {
            setNombre(sucursal.name);
            setDireccion(sucursal.direccion);
            setTelefono(sucursal.telefono);
            setEmpresaId(sucursal.empresaId || '');
        } else if (type === 'delete' && sucursal) {
            setNombre(sucursal.name);
            setDireccion(sucursal.direccion);
            setTelefono(sucursal.telefono);
        } else {
            setNombre('');
            setDireccion('');
            setTelefono('');
            setEmpresaId(Cookies.get("empresaId") || '');
        }

        if (!Cookies.get("empresaId")) {
            getEmpresas();
        }

        setModalOpen(true);
    };

    useEffect(() => {
        getSucursales();
        getEmpresas()
    }, []);

    const columns = [
        { header: 'ID', key: 'publicId' },
        { header: 'Nombre', key: 'name' },
        { header: 'Dirección', key: 'direccion' },
        { header: 'Teléfono', key: 'telefono' },
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
                title="Sucursales"
                actions={
                    <Button icon={FaPlusCircle} onClick={() => openModal('create')} title="Agregar Sucursal" />
                }
            />

            <Modal isOpen={modalOpen} onClose={closeModal} titulo={`${modalType === 'create' ? 'Crear' : modalType === 'edit' ? 'Editar' : 'Eliminar'} Sucursal`}>
                {modalType !== 'delete' ? (
                    <>
                        <Input value={nombre} setvalue={setNombre} placeholder="Nombre" />
                        <Input value={direccion} setvalue={setDireccion} placeholder="Dirección" />
                        <Input value={telefono} setvalue={setTelefono} placeholder="Teléfono" />
                        {!Cookies.get("empresaId") && (
                            <Select
                                options={empresas.map(e => ({ value: e.id, label: e.name }))}
                                value={empresaId}
                                setValue={setEmpresaId}
                                placeholder="Seleccione una empresa"
                            />
                        )}
                    </>
                ) : (
                    <p>¿Estás seguro de que deseas eliminar la sucursal {nombre} ({direccion})?</p>
                )}
                <div className="flex gap-2 mt-4">
                    {modalType !== 'delete' ? (
                        <Button icon={FaSave} onClick={handleSave} title={modalType === 'create' ? 'Guardar Sucursal' : 'Actualizar Sucursal'} loading={loading} size="full" />
                    ) : (
                        <Button icon={FaTrash} onClick={handleDelete} title="Eliminar Sucursal" loading={loading} size="full" />
                    )}
                    <Button title="Cancelar" onClick={closeModal} size="full" variant="secondary" />
                </div>
            </Modal>

            <Table columns={columns} data={sucursales} />
        </div>
    );
};

export default Sucursales;
