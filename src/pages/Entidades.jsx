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

const Entidades = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('create');
    const [loading, setLoading] = useState(false);
    const [entidad, setEntidad] = useState('');
    const [comision, setComision] = useState('0.00');
    const [empresaId, setEmpresaId] = useState(Cookies.get("empresaId") || '');
    const [empresas, setEmpresas] = useState([]);
    const [entidades, setEntidades] = useState([]);
    const [selectedEntidad, setSelectedEntidad] = useState(null);
    const role = Cookies.get("role");

    const closeModal = () => {
        setModalOpen(false);
        setEntidad('');
        setComision('0.00');
        setSelectedEntidad(null);
        if (role === 'SUPERADM') setEmpresaId('');
    };

    const getEntidades = () => {
        instanceWithToken.get('empresa-entidad').then((result) => {
            setEntidades(result.data);
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
            entidad,
            comision: parseFloat(comision),
            empresaId: role === 'SUPERADM' ? empresaId || null : Cookies.get("empresaId")
        };

        if (modalType === 'create') {
            instanceWithToken.post('empresa-entidad', payload)
                .then(() => {
                    toast.success('Entidad creada con éxito!');
                    closeModal();
                    getEntidades();
                })
                .catch(() => toast.error('No se ha podido crear la entidad. ¡Intente nuevamente!'))
                .finally(() => setLoading(false));
        } else if (modalType === 'edit' && selectedEntidad) {
            instanceWithToken.patch(`empresa-entidad/${selectedEntidad.id}`, payload)
                .then(() => {
                    toast.success('Entidad actualizada con éxito!');
                    closeModal();
                    getEntidades();
                })
                .catch(() => toast.error('No se ha podido actualizar la entidad. ¡Intente nuevamente!'))
                .finally(() => setLoading(false));
        }
    };

    const handleDelete = () => {
        if (selectedEntidad) {
            setLoading(true);
            instanceWithToken.delete(`empresa-entidad/${selectedEntidad.id}`)
                .then(() => {
                    toast.success('Entidad eliminada con éxito!');
                    closeModal();
                    getEntidades();
                })
                .catch(() => toast.error('No se ha podido eliminar la entidad. ¡Intente nuevamente!'))
                .finally(() => setLoading(false));
        }
    };

    const openModal = (type, entidad = null) => {
        setModalType(type);
        setSelectedEntidad(entidad);
        if (type === 'edit' && entidad) {
            setEntidad(entidad.entidad);
            setComision(entidad.comision);
            setEmpresaId(entidad.empresaId || '');
        } else {
            setEntidad('');
            setComision('0.00');
            setEmpresaId(role === 'SUPERADM' ? '' : Cookies.get("empresaId"));
        }

        if (role === 'SUPERADM') {
            getEmpresas();
        }

        setModalOpen(true);
    };

    useEffect(() => {
        getEntidades();
    }, []);

    const columns = [
        { header: 'ID', key: 'publicId' },
        { header: 'Entidad', key: 'entidad' },
        { header: 'Comisión', key: 'comision' },
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
                title="Entidades"
                actions={
                    <Button icon={FaPlusCircle} onClick={() => openModal('create')} title="Agregar Entidad" />
                }
            />

            <Modal isOpen={modalOpen} onClose={closeModal} titulo={`${modalType === 'create' ? 'Crear' : modalType === 'edit' ? 'Editar' : 'Eliminar'} Entidad`}>
                {modalType !== 'delete' ? (
                    <>
                        <Input value={entidad} setvalue={setEntidad} placeholder="Entidad" />
                        <Input value={comision} setvalue={setComision} placeholder="Comisión" type="number" step="0.01" />
                        {role === 'SUPERADM' && (
                            <Select
                                options={empresas.map(e => ({ value: e.id, label: e.razon_social }))}
                                value={empresaId}
                                setvalue={setEmpresaId}
                                placeholder="Seleccione una empresa"
                            />
                        )}
                    </>
                ) : (
                    <p>¿Estás seguro de que deseas eliminar la entidad {entidad}?</p>
                )}
                <div className="flex gap-2 mt-4">
                    {modalType !== 'delete' ? (
                        <Button icon={FaSave} onClick={handleSave} title={modalType === 'create' ? 'Guardar Entidad' : 'Actualizar Entidad'} loading={loading} size="full" />
                    ) : (
                        <Button icon={FaTrash} onClick={handleDelete} title="Eliminar Entidad" loading={loading} size="full" />
                    )}
                    <Button title="Cancelar" onClick={closeModal} size="full" variant="secondary" />
                </div>
            </Modal>

            <Table columns={columns} data={entidades} />
        </div>
    );
};

export default Entidades;
