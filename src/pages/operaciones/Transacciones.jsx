import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import HeaderLayout from '../../components/layouts/HeaderLayout';
import Button from '../../components/elements/Button';
import { FaPlusCircle, FaSave, FaEdit, FaTrash, FaPrint } from 'react-icons/fa';
import Modal from '../../components/elements/Modal';
import Input from '../../components/elements/Input';
import Select from '../../components/elements/Select';
import { instanceWithToken } from '../../utils/instance';
import { toast } from 'sonner';
import Table from '../../components/elements/Table';
import Checkbox from '../../components/elements/Checkbox';

const Transacciones = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('');
    const [entidadId, setEntidadId] = useState('');
    const [sucursalId, setSucursalId] = useState('');
    const [nroOperacion, setNroOperacion] = useState('');
    const [importe, setImporte] = useState(0);
    const [comision, setComision] = useState(0);
    const [montoTotal, setMontoTotal] = useState(0);
    const [adicionales, setAdicionales] = useState(false);
    const [nroDestino, setNroDestino] = useState('');
    const [nroRemitente, setNroRemitente] = useState('');
    const [titular, setTitular] = useState('');
    const [documento, setDocumento] = useState('');
    const [banco, setBanco] = useState('');
    const [categori, setCategori] = useState('');
    const [servicio, setServicio] = useState('');
    const [empresa, setEmpresa] = useState('');
    const [numeroRecibo, setNumeroRecibo] = useState('');
    const [codigoUsuario, setCodigoUsuario] = useState('');
    const [empresas, setEmpresas] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [entidades, setEntidades] = useState([]);
    const [transacciones, setTransacciones] = useState([]);
    const [selectedTransaccion, setSelectedTransaccion] = useState(null);
    const [showTicket, setShowTicket] = useState(false);

    const closeModal = () => {
        setModalOpen(false);
        setType('');
        setEntidadId('');
        setSucursalId('');
        setNroOperacion('');
        setImporte(0);
        setComision(0);
        setMontoTotal(0);
        setAdicionales(false);
        setNroDestino('');
        setNroRemitente('');
        setTitular('');
        setDocumento('');
        setBanco('');
        setCategori('');
        setServicio('');
        setEmpresa('');
        setNumeroRecibo('');
        setCodigoUsuario('');
        setSelectedTransaccion(null);
    };

    const fetchData = async () => {
        try {
            const [transaccionesRes, empresasRes, sucursalesRes, entidadesRes] = await Promise.all([
                instanceWithToken.get('operaciones'),
                instanceWithToken.get('empresa'),
                instanceWithToken.get('empresa-sucursales'),
                instanceWithToken.get('empresa-entidades')
            ]);
            setTransacciones(transaccionesRes.data);
            setEmpresas(empresasRes.data.data);
            setSucursales(sucursalesRes.data);
            setEntidades(entidadesRes.data);
        } catch (error) {
            toast.error('Error al obtener datos.');
        }
    };

    const handleSave = async () => {
        setLoading(true);
        const payload = {
            type,
            entidadId,
            empresaId: Cookies.get("empresaId") || '',
            sucursalId,
            userId: Cookies.get("userId") || '',
            nro_operacion: nroOperacion,
            importe: parseFloat(importe),
            comision: parseFloat(comision),
            monto_total: parseFloat(montoTotal),
            adicionales: adicionales ? {
                nro_destino,
                nro_remitente,
                titular,
                documento,
                banco,
                categori,
                servicio,
                empresa,
                numero_recibo,
                codigoUsuario
            } : null
        };
        try {
            await instanceWithToken.post('operaciones', payload);
            toast.success('Transacción creada con éxito!');
            closeModal();
            fetchData();
            setShowTicket(true);
        } catch {
            toast.error('Error al guardar la transacción. ¡Intente nuevamente!');
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => {
        setModalOpen(true);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        { header: 'ID', key: 'publicId' },
        { header: 'Tipo', key: 'type' },
        { header: 'Nro. Operación', key: 'nro_operacion' },
        { header: 'Importe', key: 'importe' },
        { header: 'Comisión', key: 'comision' },
        { header: 'Monto Total', key: 'monto_total' },
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
                title="Transacciones"
                actions={<Button icon={FaPlusCircle} onClick={openModal} title="Nueva Transacción" />}
            />
            <Modal isOpen={modalOpen} onClose={closeModal} titulo="Nueva Transacción">
                <Select
                    options={[
                        { value: 'DEPOSITO', label: 'Depósito' },
                        { value: 'RETIRO', label: 'Retiro' },
                        { value: 'TRANSFERENCIA', label: 'Transferencia' }
                    ]}
                    value={type}
                    setValue={setType}
                    placeholder="Tipo de Operación"
                />
                <Select
                    options={entidades.map(e => ({ value: e.id, label: e.nombre }))}
                    value={entidadId}
                    setValue={setEntidadId}
                    placeholder="Seleccione una entidad"
                />
                <Select
                    options={sucursales.map(s => ({ value: s.id, label: s.name }))}
                    value={sucursalId}
                    setValue={setSucursalId}
                    placeholder="Seleccione una sucursal"
                />
                <Input value={nroOperacion} setvalue={setNroOperacion} placeholder="Nro. Operación" />
                <Input value={importe} setvalue={setImporte} placeholder="Importe" type="number" />
                <Input value={comision} setvalue={setComision} placeholder="Comisión" type="number" />
                <Input value={montoTotal} setvalue={setMontoTotal} placeholder="Monto Total" type="number" />
                <Checkbox label="Agregar Adicionales" checked={adicionales} onChange={(e) => setAdicionales(e.target.checked)} />
                {adicionales && (
                    <>
                        <Input value={nroDestino} setvalue={setNroDestino} placeholder="Nro. Destino" />
                        <Input value={nroRemitente} setvalue={setNroRemitente} placeholder="Nro. Remitente" />
                        <Input value={titular} setvalue={setTitular} placeholder="Titular" />
                        <Input value={documento} setvalue={setDocumento} placeholder="Documento" />
                        <Input value={banco} setvalue={setBanco} placeholder="Banco" />
                        <Input value={categori} setvalue={setCategori} placeholder="Categoría" />
                        <Input value={servicio} setvalue={setServicio} placeholder="Servicio" />
                        <Input value={empresa} setvalue={setEmpresa} placeholder="Empresa" />
                        <Input value={numeroRecibo} setvalue={setNumeroRecibo} placeholder="Nro. Recibo" />
                        <Input value={codigoUsuario} setvalue={setCodigoUsuario} placeholder="Código de Usuario" />
                    </>
                )}
                <div className="flex gap-2 mt-4">
                    <Button icon={FaSave} onClick={handleSave} title="Guardar Transacción" loading={loading} size="full" />
                    <Button title="Cancelar" onClick={closeModal} size="full" variant="secondary" />
                </div>
            </Modal>
            <Table columns={columns} data={transacciones} />
            {showTicket && (
                <Modal isOpen={showTicket} onClose={() => setShowTicket(false)} titulo="Ticket de Transacción">
                    <div className="p-4 bg-gray-100 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Ticket de Transacción</h2>
                        <p><strong>Tipo:</strong> {type}</p>
                        <p><strong>Nro. Operación:</strong> {nroOperacion}</p>
                        <p><strong>Importe:</strong> {importe}</p>
                        <p><strong>Comisión:</strong> {comision}</p>
                        <p><strong>Monto Total:</strong> {montoTotal}</p>
                        {adicionales && (
                            <>
                                <p><strong>Nro. Destino:</strong> {nroDestino}</p>
                                <p><strong>Nro. Remitente:</strong> {nroRemitente}</p>
                                <p><strong>Titular:</strong> {titular}</p>
                                <p><strong>Documento:</strong> {documento}</p>
                                <p><strong>Banco:</strong> {banco}</p>
                                <p><strong>Categoría:</strong> {categori}</p>
                                <p><strong>Servicio:</strong> {servicio}</p>
                                <p><strong>Empresa:</strong> {empresa}</p>
                                <p><strong>Nro. Recibo:</strong> {numeroRecibo}</p>
                                <p><strong>Código de Usuario:</strong> {codigoUsuario}</p>
                            </>
                        )}
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Button icon={FaPrint} onClick={() => window.print()} title="Imprimir Ticket" size="full" />
                        <Button title="Cerrar" onClick={() => setShowTicket(false)} size="full" variant="secondary" />
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Transacciones;