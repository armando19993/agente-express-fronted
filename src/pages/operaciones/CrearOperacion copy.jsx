import React, { useState, useEffect } from 'react';
import Input from '../../components/elements/Input';
import Select from '../../components/elements/Select';
import { useParams } from 'react-router-dom';
import Button from '../../components/elements/Button';
import { FaSave, FaPaste } from 'react-icons/fa';

// Opciones de tipo de operación
const TYPE_OPERATION = [
    { value: 'PAGO_SERVICIO', label: 'Pago de Servicio', tipo: 'cashout' },
    { value: 'DEPOSITO', label: 'Deposito', tipo: 'cashout' },
    { value: 'PAGO_TARJETA', label: 'Pago de Tarjeta', tipo: 'cashout' },
    { value: 'GIRO', label: 'Giro', tipo: 'cashout' },
    { value: 'DEPOSITOS_YAPE', label: 'Deposito Yape', tipo: 'cashout' },
    { value: 'PASARELA_PAGO', label: 'Pasarela de Pago', tipo: 'cashin' },
    { value: 'RETIRO', label: 'Retiro', tipo: 'cashin' }
];

// Configuración de campos dinámicos según el tipo de operación
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
        { label: 'Tipo de Retiro', type: 'text', key: 'tipo_retiro' },
        { label: 'Nro Operacion', type: 'text', key: 'nro_operacion' },
    ],
    RETIRO: [
        { label: 'Tipo de Retiro', type: 'text', key: 'tipo_retiro' },
        { label: 'Nro Operacion', type: 'text', key: 'nro_operacion' },
    ]
};

// Configuración de extracción para cada tipo (esto es un ejemplo, deberás ajustarlo a tus necesidades)
const EXTRACTION_CONFIG = {
    PAGO_SERVICIO: [
        {
            // Extrae el importe luego de "S/ "
            key: 'importe',
            regex: /Monto pagado[\s\S]*?S\/\s*([\d.,]+)/i,
            transform: (val) => val.replace(',', '.')
        },
        {
            key: 'empresa',
            regex: /Pagado a[\s\S]*?(\w+)/i
        },
        {
            key: 'servicio',
            regex: /Servicio[\s\S]*?([A-Z\s]+)/i
        },
        {
            key: 'codigo_usuario',
            regex: /Código de usuario[\s\S]*?(\d+)/i
        },
        {
            key: 'titular',
            regex: /Titular del servicio[\s\S]*?([\w\s]+)/i
        },
        {
            key: 'nro_recibo',
            regex: /N° recibo:\s*(\d+)/i
        },
    ],
    // Otras configuraciones para DEPOSITO, GIRO, etc. se pueden definir de forma similar.
};

const CrearOperacion = () => {
    const { tipo } = useParams();
    const [tipoOperacion, setTipoOperacion] = useState("");
    const [entidad, setEntidad] = useState("");
    // Campos dinámicos para la operación (según DYNAMIC_FIELDS)
    const [dynamicFieldsValues, setDynamicFieldsValues] = useState({});
    // Campos estáticos: importe, nro_operacion, etc.
    // Definimos comisión en 1 por defecto
    const [staticFieldsValues, setStaticFieldsValues] = useState({
        importe: 0,
        nro_operacion: '',
        comision: 1,
    });

    // Calculamos el monto total (importe + comisión)
    const montoTotal = (parseFloat(staticFieldsValues.importe) || 0) + (parseFloat(staticFieldsValues.comision) || 1);

    // Opciones filtradas según el parámetro "tipo" de la URL
    const filteredOptions = TYPE_OPERATION.filter(option => option.tipo === tipo);

    const handleDynamicFieldChange = (key, value) => {
        setDynamicFieldsValues((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleStaticFieldChange = (key, value) => {
        setStaticFieldsValues((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // Función que realiza la extracción de datos basado en la configuración
    const extractDataByConfig = (text, config) => {
        const data = {};
        config.forEach(({ key, regex, transform }) => {
            const match = text.match(regex);
            if (match && match[1]) {
                data[key] = transform ? transform(match[1].trim()) : match[1].trim();
            }
        });
        return data;
    };

    // Función para detectar el tipo de operación a partir del texto pegado.
    const detectTipoOperacion = (text) => {
        // Ejemplo: si la primera línea contiene "Pago de servicio exitoso", se asigna PAGO_SERVICIO.
        const firstLine = text.split('\n')[0].toLowerCase();
        if (firstLine.includes('pago de servicio exitoso')) {
            return 'PAGO_SERVICIO';
        }
        // Aquí podrías agregar más condiciones para otros tipos...
        return "";
    };

    // const parsePastedText = (text) => {
    //     // Detectamos el tipo de operación basándonos en el contenido
    //     const detectedTipo = detectTipoOperacion(text);
    //     if (detectedTipo) {
    //         setTipoOperacion(detectedTipo);
    //     }

    //     // Extraer datos específicos para el tipo detectado (si existe configuración)
    //     if (detectedTipo && EXTRACTION_CONFIG[detectedTipo]) {
    //         const extractedData = extractDataByConfig(text, EXTRACTION_CONFIG[detectedTipo]);
    //         // Se asignan los valores extraídos a los campos dinámicos o estáticos según la clave.
    //         // En este ejemplo, asumimos que "importe" se asigna a staticFieldsValues y el resto a dynamicFieldsValues.
    //         const { importe, ...rest } = extractedData;
    //         if (importe) {
    //             setStaticFieldsValues((prev) => ({ ...prev, importe }));
    //         }
    //         setDynamicFieldsValues((prev) => ({
    //             ...prev,
    //             ...rest,
    //         }));
    //     }

    //     // Extraer el número de operación
    //     const nroOperacionMatch = text.match(/Nº de operación\s*(\d+)/i);
    //     if (nroOperacionMatch && nroOperacionMatch[1]) {
    //         setStaticFieldsValues((prev) => ({
    //             ...prev,
    //             nro_operacion: nroOperacionMatch[1].trim()
    //         }));
    //     }
    // };

    const parsePastedText = (text) => {
        // Detectamos el tipo de operación basándonos en el contenido
        const detectedTipo = detectTipoOperacion(text);
        if (detectedTipo) {
            setTipoOperacion(detectedTipo);
        }

        // Extraer datos específicos para el tipo detectado
        if (detectedTipo && EXTRACTION_CONFIG[detectedTipo]) {
            const extractedData = extractDataByConfig(text, EXTRACTION_CONFIG[detectedTipo]);

            // Asignamos los valores extraídos a los campos dinámicos o estáticos según corresponda
            const { importe, nro_recibo, codigo_usuario, titular, empresa, servicio, ...rest } = extractedData;

            setStaticFieldsValues((prev) => ({
                ...prev,
                importe: importe || prev.importe,
                nro_operacion: nro_recibo || prev.nro_operacion
            }));

            setDynamicFieldsValues((prev) => ({
                ...prev,
                codigo_usuario: codigo_usuario || prev.codigo_usuario,
                titular: titular || prev.titular,
                empresa: empresa || prev.empresa,
                servicio: servicio || prev.servicio,
                ...rest
            }));
        }
    };


    const handlePaste = async (event) => {
        event.preventDefault();
        const text = (event.clipboardData || window.clipboardData).getData('text');
        parsePastedText(text);
    };

    const handlePasteButtonClick = async () => {
        const text = await navigator.clipboard.readText();
        parsePastedText(text);
    };

    useEffect(() => {
        document.addEventListener('paste', handlePaste);
        return () => {
            document.removeEventListener('paste', handlePaste);
        };
    }, []);

    // Renderizamos los campos dinámicos según el tipo de operación seleccionado
    const renderDynamicFields = () => {
        if (!tipoOperacion) return null;
        const fields = DYNAMIC_FIELDS[tipoOperacion] || [];
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
                            <Input
                                placeholder={'Nro Operacion'}
                                type='text'
                                value={staticFieldsValues.nro_operacion}
                                onChange={(e) => handleStaticFieldChange('nro_operacion', e.target.value)}
                            />
                            <Input
                                placeholder={'Fecha'}
                                type='date'
                            // Podrías manejar otro estado para la fecha
                            />
                        </div>
                    </div>

                    <div className='w-[100%] bg-white rounded-b-2xl mb-3'>
                        <div className='bg-[#70C544] p-4 text-white font-bold'>
                            {tipoOperacion ? TYPE_OPERATION.find(op => op.value === tipoOperacion)?.label : 'Operación'}
                        </div>

                        <div className='grid grid-cols-3 gap-4 p-3'>
                            {renderDynamicFields()}
                        </div>
                    </div>
                </div>

                <div className='w-[100%] bg-white rounded-b-2xl mb-3'>
                    <div className='bg-[#70C544] p-4 text-white font-bold'>
                        Cargos
                    </div>

                    <div className='grid grid-cols-1 gap-4 p-3'>
                        <Input
                            value={staticFieldsValues.importe || 0}
                            label={'Importe'}
                            onChange={(e) => handleStaticFieldChange('importe', e.target.value)}
                        />
                        <Input
                            value={staticFieldsValues.comision}
                            label={'Comisión'}
                            // Si la comisión siempre es 1, puedes deshabilitar el input:
                            disabled
                        />
                        <Input
                            value={montoTotal}
                            label={'Monto Total'}
                            disabled
                        />
                        <Button icon={FaSave} title={'Guardar Operacion'} />
                        <Button icon={FaPaste} title={'Pegar Datos'} onClick={handlePasteButtonClick} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CrearOperacion;
