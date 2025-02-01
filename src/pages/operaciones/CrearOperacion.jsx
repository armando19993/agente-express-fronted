import React, { useState } from 'react';
import Input from '../../components/elements/Input';
import Select from '../../components/elements/Select';
import { useParams } from 'react-router-dom';
import Button from '../../components/elements/Button';
import { FaSave } from 'react-icons/fa';

const TYPE_OPERATION = [
    { value: 'PAGO_SERVICIO', label: 'Pago de Servicio', tipo: 'cashout' },
    { value: 'DEPOSITO', label: 'Deposito', tipo: 'cashout' },
    { value: 'PAGO_TARJETA', label: 'Pago de Tarjeta', tipo: 'cashout' },
    { value: 'GIRO', label: 'Giro', tipo: 'cashout' },
    { value: 'DEPOSITOS_YAPE', label: 'Deposito Yape', tipo: 'cashout' },
    { value: 'PASARELA_PAGO', label: 'Pasarela de Pago', tipo: 'cashin' },
    { value: 'RETIRO', label: 'Retiro', tipo: 'cashin' }
];

const DYNAMIC_FIELDS = {
    PAGO_SERVICIO: [
        { label: 'Categoría', type: 'text', key: 'categoria' },
        { label: 'Servicio', type: 'text', key: 'servicio' },
        { label: 'Empresa', type: 'text', key: 'empresa' },
        { label: 'Número de Recibo', type: 'text', key: 'nro_recibo' },
        { label: 'Código de Usuario', type: 'text', key: 'codigo_usuario' },
        { label: 'Titular', type: 'text', key: 'titular' },
    ],
    DEPOSITO: [
        { label: 'Banco Destino', type: 'text', key: 'banco_destino' },
        { label: 'Número de Cuenta', type: 'text', key: 'nro_cuenta' },
        { label: 'Titular', type: 'text', key: 'titular' },
    ],
    DEPOSITOS_YAPE: [
        { label: 'Banco Destino', type: 'text', key: 'banco_destino' },
        { label: 'Número de Cuenta', type: 'text', key: 'nro_cuenta' },
        { label: 'Titular', type: 'text', key: 'titular' },
    ],
    GIRO: [
        { label: 'Banco de Destino', type: 'text', key: 'banco_destino' },
        { label: 'DNI del Beneficiario', type: 'text', key: 'dni_beneficiario' },
        { label: 'Beneficiario', type: 'text', key: 'beneficiario' },
    ],
    PAGO_TARJETA: [
        { label: 'Banco Destino', type: 'text', key: 'banco_destino' },
        { label: 'Número de Tarjeta', type: 'text', key: 'nro_tarjeta' },
        { label: 'Titular', type: 'text', key: 'titular' },
    ],
    PASARELA_PAGO: [
        {label: 'Tipo de Retiro', type: 'text', key: 'tipo_retiro'},
        {label: 'Nro Operacion', type: 'text', key: 'nro_operacion'},
    ],
    RETIRO: [
        {label: 'Tipo de Retiro', type: 'text', key: 'tipo_retiro'},
        {label: 'Nro Operacion', type: 'text', key: 'nro_operacion'},
    ]
};

const CrearOperacion = () => {
    const { tipo } = useParams();
    const [tipoOperacion, setTipoOperacion] = useState("");
    const [entidad, setEntidad] = useState("");
    const [dynamicFieldsValues, setDynamicFieldsValues] = useState({});

    const filteredOptions = TYPE_OPERATION.filter(option => option.tipo === tipo);

    const handleDynamicFieldChange = (key, value) => {
        setDynamicFieldsValues((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const renderDynamicFields = () => {
        if (!tipoOperacion) return null;

        const fields = DYNAMIC_FIELDS[tipoOperacion];

        return fields.map((field) => (
            <Input
                key={field.key}
                label={field.label}
                value={dynamicFieldsValues[field.key] || ''}
                onChange={(e) => handleDynamicFieldChange(field.key, e.target.value)}
            />
        ));
    };

    return (
        <>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='col-span-2'>
                    <div className='w-[100%] bg-white rounded-b-2xl mb-3'>
                        <div className='bg-[#70C544] p-4 text-white font-bold'>
                            Datos
                        </div>

                        <div className='grid grid-cols-2 gap-4 p-3'>
                            <Select
                                value={tipoOperacion}
                                setvalue={setTipoOperacion}
                                options={filteredOptions}
                                placeholder={'Tipo Operacion'}
                            />
                            <Select
                                value={entidad}
                                setvalue={setEntidad}
                                options={[]}
                                placeholder={'Entidad'}
                            />
                            <Input placeholder={'Nro Operacion'} type='datetime' />
                            <Input placeholder={'Fecha'} type='date' />
                        </div>
                    </div>

                    <div className='w-[100%] bg-white rounded-b-2xl mb-3'>
                        <div className='bg-[#70C544] p-4 text-white font-bold'>
                            {tipoOperacion}
                        </div>

                        <div className='grid grid-cols-3 gap-4 p-3'>
                            {renderDynamicFields()} {/* Renderizar campos dinámicos aquí */}
                        </div>
                    </div>
                </div>

                <div className='w-[100%] bg-white rounded-b-2xl mb-3'>
                    <div className='bg-[#70C544] p-4 text-white font-bold'>
                        Cargos
                    </div>

                    <div className='grid grid-cols-1 gap-4 p-3'>
                        <Input value={0} label={'Importe'} />
                        <Input value={0} label={'Comision'} />
                        <Input value={0} label={'Monto Total'} />
                        <Button icon={FaSave} title={'Guardar Operacion'} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CrearOperacion;