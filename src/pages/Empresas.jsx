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

const Empresas = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('create');
    const [loading, setLoading] = useState(false);
    const [razonSocial, setRazonSocial] = useState('');
    const [documento, setDocumento] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [typeMembresia, setTypeMembresia] = useState('FREE');
    const [statusMembresia, setStatusMembresia] = useState('ACTIVO');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [empresas, setEmpresas] = useState([]);
    const [selectedEmpresa, setSelectedEmpresa] = useState(null);

    const closeModal = () => {
        setModalOpen(false);
        setRazonSocial('');
        setDocumento('');
        setTelefono('');
        setDireccion('');
        setTypeMembresia('FREE');
        setStatusMembresia('ACTIVO');
        setFechaInicio('');
        setFechaFin('');
        setSelectedEmpresa(null);
    };

    const fetchData = async () => {
        try {
            const empresasRes = await instanceWithToken.get('empresa');
            setEmpresas(empresasRes.data.data);
        } catch (error) {
            toast.error('Error al obtener datos.');
        }
    };

    const handleSave = async () => {
        setLoading(true);
        const payload = {
            razon_social: razonSocial,
            documento,
            telefono,
            direccion,
            type_membresia: typeMembresia,
            status_membresia: statusMembresia,
            fecha_inicio: fechaInicio || null,
            fecha_fin: fechaFin || null,
        };
        try {
            if (modalType === 'create') {
                await instanceWithToken.post('empresa', payload);
                toast.success('Empresa creada con éxito!');
            } else if (modalType === 'edit' && selectedEmpresa) {
                await instanceWithToken.patch(`empresa/${selectedEmpresa.id}`, payload);
                toast.success('Empresa actualizada con éxito!');
            }
            closeModal();
            fetchData();
        } catch {
            toast.error('Error al guardar la empresa. ¡Intente nuevamente!');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (selectedEmpresa) {
            setLoading(true);
            try {
                await instanceWithToken.delete(`empresa/${selectedEmpresa.id}`);
                toast.success('Empresa eliminada con éxito!');
                closeModal();
                fetchData();
            } catch {
                toast.error('No se ha podido eliminar la empresa. ¡Intente nuevamente!');
            } finally {
                setLoading(false);
            }
        }
    };

    const openModal = (type, empresa = null) => {
        setModalType(type);
        setSelectedEmpresa(empresa);
        if (empresa) {
            setRazonSocial(empresa.razon_social || '');
            setDocumento(empresa.documento || '');
            setTelefono(empresa.telefono || '');
            setDireccion(empresa.direccion || '');
            setTypeMembresia(empresa.type_membresia || 'FREE');
            setStatusMembresia(empresa.status_membresia || 'ACTIVO');
            setFechaInicio(empresa.fecha_inicio || '');
            setFechaFin(empresa.fecha_fin || '');
        } else {
            setRazonSocial('');
            setDocumento('');
            setTelefono('');
            setDireccion('');
            setTypeMembresia('FREE');
            setStatusMembresia('ACTIVO');
            setFechaInicio('');
            setFechaFin('');
        }
        setModalOpen(true);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        { header: 'ID', key: 'publicId' },
        { header: 'Razón Social', key: 'razon_social' },
        { header: 'Documento', key: 'documento' },
        { header: 'Teléfono', key: 'telefono' },
        { header: 'Dirección', key: 'direccion' },
        { header: 'Tipo Membresía', key: 'type_membresia' },
        { header: 'Estado Membresía', key: 'status_membresia' },
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
                title="Empresas"
                actions={<Button icon={FaPlusCircle} onClick={() => openModal('create')} title="Agregar Empresa" />}
            />
            <Modal isOpen={modalOpen} onClose={closeModal} titulo={`${modalType === 'create' ? 'Crear' : modalType === 'edit' ? 'Editar' : 'Eliminar'} Empresa`}>
                {modalType !== 'delete' ? (
                    <>
                        <Input value={razonSocial} setvalue={setRazonSocial} placeholder="Razón Social" />
                        <Input value={documento} setvalue={setDocumento} placeholder="Documento" />
                        <Input value={telefono} setvalue={setTelefono} placeholder="Teléfono" />
                        <Input value={direccion} setvalue={setDireccion} placeholder="Dirección" />
                        <Select
                            options={[
                                { value: 'FREE', label: 'Gratis' },
                                { value: 'PAID', label: 'Premium' },
                            ]}
                            value={typeMembresia}
                            setvalue={setTypeMembresia}
                            placeholder="Seleccione tipo de membresía"
                        />
                        <Select
                            options={[
                                { value: 'ACTIVO', label: 'Activo' },
                                { value: 'INACTIVO', label: 'Inactivo' },
                            ]}
                            value={statusMembresia}
                            setvalue={setStatusMembresia}
                            placeholder="Seleccione estado de membresía"
                        />
                        <Input
                            type="date"
                            value={fechaInicio}
                            setvalue={setFechaInicio}
                            placeholder="Fecha de inicio"
                        />
                        <Input
                            type="date"
                            value={fechaFin}
                            setvalue={setFechaFin}
                            placeholder="Fecha de fin"
                        />
                    </>
                ) : (
                    <p>¿Estás seguro de que deseas eliminar la empresa {razonSocial} ({documento})?</p>
                )}
                <div className="flex gap-2 mt-4">
                    {modalType !== 'delete' ? (
                        <Button icon={FaSave} onClick={handleSave} title={modalType === 'create' ? 'Guardar Empresa' : 'Actualizar Empresa'} loading={loading} size="full" />
                    ) : (
                        <Button icon={FaTrash} onClick={handleDelete} title="Eliminar Empresa" loading={loading} size="full" />
                    )}
                    <Button title="Cancelar" onClick={closeModal} size="full" variant="secondary" />
                </div>
            </Modal>
            <Table columns={columns} data={empresas} />
        </div>
    );
};

export default Empresas;