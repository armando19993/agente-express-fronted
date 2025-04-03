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

// Configuración para extraer datos del texto pegado según el tipo de operación
const EXTRACTION_CONFIG = {
    PAGO_SERVICIO: [
        { key: 'categoria', regex: /Categoría:\s*(.+)/i },
        { key: 'servicio', regex: /Servicio:\s*(.+)/i },
        { key: 'empresa', regex: /Empresa:\s*(.+)/i },
        { key: 'nro_recibo', regex: /Número de Recibo:\s*(\d+)/i },
        { key: 'codigo_usuario', regex: /Código de Usuario:\s*(.+)/i },
        { key: 'titular', regex: /Titular:\s*(.+)/i },
        { key: 'importe', regex: /Importe:\s*([\d,.]+)/i, transform: (val) => parseFloat(val.replace(',', '')) },
    ],
    DEPOSITO: [
        { key: 'banco_destino', regex: /Banco Destino:\s*(.+)/i },
        { key: 'nro_cuenta', regex: /Número de Cuenta:\s*(\d+)/i },
        { key: 'titular', regex: /Titular:\s*(.+)/i },
        { key: 'importe', regex: /Importe:\s*([\d,.]+)/i, transform: (val) => parseFloat(val.replace(',', '')) },
    ],

    PAGO_TARJETA: [
        { key: 'nro_tarjeta', regex: /Número de Tarjeta:\s*(\d+)/i },
        { key: 'titular', regex: /Titular:\s*(.+)/i },
    ],

    // Agrega configuraciones similares para otros tipos de operación...
};

const CrearOperacion = () => {
    const { tipo } = useParams();
    const [tipoOperacion, setTipoOperacion] = useState("");
    const [entidad, setEntidad] = useState("");
    const [dynamicFieldsValues, setDynamicFieldsValues] = useState({});
    const [staticFieldsValues, setStaticFieldsValues] = useState({
        importe: '',
        nro_operacion: '',
        comision: 1,
        fecha: '',
    });

    const montoTotal = (parseFloat(staticFieldsValues.importe) || 0) + (parseFloat(staticFieldsValues.comision) || 1);
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

    const detectTipoOperacion = (text) => {
        const firstLine = text.split('\n')[0].toLowerCase();
        if (firstLine.includes('pago de servicio')) return 'PAGO_SERVICIO';
        if (firstLine.includes('depósito') || firstLine.includes('deposito')) return 'DEPOSITO';
        if (firstLine.includes('giro')) return 'GIRO';
        if (firstLine.includes('tarjeta')) return 'PAGO_TARJETA';
        if (firstLine.includes('yape')) return 'DEPOSITOS_YAPE';
        if (firstLine.includes('pasarela')) return 'PASARELA_PAGO';
        if (firstLine.includes('retiro')) return 'RETIRO';
        return "";
    };
    //mercedes

    // Configuración de extracción por tipo de operación
    const extractionConfig = {
        PAGO_SERVICIO: [
            {
                pattern: /(Recibo)\s*[:]?\s*(\d+)/i,
                field: 'nro_recibo',
                groupIndex: 2 // El grupo de captura que contiene el valor
            },
            {
                pattern: /(Usuario)\s*[:]?\s*(\d+)/i,
                field: 'codigo_usuario',
                groupIndex: 2
            },
            {
                pattern: /Titular del servicio\s*[:]?\s*([^\n]+)/i,
                field: 'titular',
                groupIndex: 1
            },
            {
                pattern: /([^\n]+)\s*\nServicio/i,
                field: 'servicio',
                groupIndex: 1
            },
            {
                pattern: /Pagado a\s*[:]?\s*([^\n]+)/i,
                field: 'empresa',
                groupIndex: 1
            }
        ],

        DEPOSITO: [
            {
                pattern: /Banco destino\s*[:]?\s*([^\n]+)/i,
                field: 'banco_destino',
                groupIndex: 1
            },
            {
                pattern: /(?:Enviado a|Enviar a)\s*[:]?\s*([^\n]+)/i,
                field: 'titular',
                groupIndex: 1
            },

            {
                pattern: /(?:Enviado a|Enviar a)\s*[:]?\s*[^\n]+\s*\n([*]+\s*\d+)/i,
                field: 'nro_cuenta',
                groupIndex: 1
            },
        ],

        PAGO_TARJETA: [
            {
                pattern: /Pagado a\s*[:]?\s*([^\n]+)/i,
                field: 'titular',
                groupIndex: 1
            },

            {
                pattern: /Pagado a\s*[:]?\s*[^\n]+\s*\n([*]+\s*\d+)/i,
                field: 'nro_tarjeta',
                groupIndex: 1
            },
        ]


    };

    //data dinamica
    const extractDynamicData = (text, operationType) => {
        const config = extractionConfig[operationType];
        if (!config) return;

        const updates = {};

        config.forEach(({ pattern, field, groupIndex }) => {
            const match = text.match(pattern);
            if (match && match[groupIndex]) {
                updates[field] = match[groupIndex].trim();
            }
        });

        if (Object.keys(updates).length > 0) {
            setDynamicFieldsValues(prev => ({ ...prev, ...updates }));
        }
    };


    //formato para la FECHA
    const parseDateString = (dateStr) => {
        // Si ya está en formato yyyy-MM-dd, retornar directamente
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

        // Convertir formatos como "18 marzo 2024"
        const months = {
            enero: '01', febrero: '02', marzo: '03', abril: '04',
            mayo: '05', junio: '06', julio: '07', agosto: '08',
            septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12'
        };

        // Probar formato "18 marzo 2024"
        const match = dateStr.match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/i);
        if (match) {
            const [, day, monthName, year] = match;
            const month = months[monthName.toLowerCase()];
            if (month) {
                return `${year}-${month}-${day.padStart(2, '0')}`;
            }
        }

        // Probar formato "18/03/2024"
        const slashMatch = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
        if (slashMatch) {
            const [, day, month, year] = slashMatch;
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }

        return ''; // Si no se puede parsear, retornar vacío
    };


    const parsePastedText = (text) => {

        const detectedTipo = detectTipoOperacion(text);
        if (detectedTipo) {
            setTipoOperacion(detectedTipo);
        }

        // Extraer datos específicos para el tipo detectado

        if (detectedTipo && EXTRACTION_CONFIG[detectedTipo]) {
            const extractedData = extractDataByConfig(text, EXTRACTION_CONFIG[detectedTipo]);
            const { importe, ...rest } = extractedData;
            if (importe) {
                setStaticFieldsValues((prev) => ({ ...prev, importe }));
            }
            setDynamicFieldsValues((prev) => ({
                ...prev,
                ...rest,
            }));
        }

        // Extraer número de OPERACION (patrón común)
        const nroOperacionMatch = text.match(/(Nº de operación|Número de operación|Operación Nº)\s*[:]?\s*(\d+)/i);
        console.log("OPERACION", nroOperacionMatch)
        if (nroOperacionMatch && nroOperacionMatch[2]) {
            setStaticFieldsValues((prev) => ({
                ...prev,
                nro_operacion: nroOperacionMatch[2].trim()
            }));
        }
        // Extraer IMPORTE si no se encontró en la configuración específica
        const importeMatch = text.match(/(Monto|Pagado|Transferido|enviado|Importe|Total)\s*[:]?\s*(S\/)?\s*([\d,.]+)/i);
        console.log("MONTO", importeMatch)
        if (!staticFieldsValues.importe) {
            if (importeMatch && importeMatch[3]) {
                const importe = parseFloat(importeMatch[3].replace(',', ''));
                setStaticFieldsValues((prev) => ({ ...prev, importe }));
            }
        }
        //Extraer la FECHA
        const fechaMatch = text.match(/(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo)\s*,?\s*(\d{1,2}\s*(?:de\s*)?[A-Za-z]+\s*(?:de\s*)?\d{4}|\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i);
        console.log("FECHA", fechaMatch)
        if (!staticFieldsValues.fecha && fechaMatch && fechaMatch[2]) {
            const rawDate = fechaMatch[2].trim();
            const formattedDate = parseDateString(rawDate);
            if (formattedDate) {
                setStaticFieldsValues(prev => ({
                    ...prev,
                    fecha: formattedDate
                }));
            }
        }

        //Extraccion segun TIPO DE DOCUMENTO
        //PAGO DE SERVICIO.
        if (tipoOperacion === 'PAGO_SERVICIO') {
            extractDynamicData(text, 'PAGO_SERVICIO');
        }
        if (tipoOperacion === 'DEPOSITO') {
            extractDynamicData(text, 'DEPOSITO');
        }

    };

    const handlePasteButtonClick = async () => {
        try {
            // Usamos la API del portapapeles
            const text = await navigator.clipboard.readText();
            if (text) {
                parsePastedText(text);
            } else {
                alert('No hay texto en el portapapeles');
            }
        } catch (err) {
            console.error('Error al leer el portapapeles:', err);
            // Fallback para navegadores que no soportan navigator.clipboard.readText()
            const text = prompt('Por favor pega el contenido aquí:');
            if (text) {
                parsePastedText(text);
            }
        }
    };

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
                                value={staticFieldsValues.fecha || ''}
                                onChange={(e) => handleStaticFieldChange('fecha', e.target.value)}
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
                            disabled
                        />
                        <Input s
                            value={montoTotal}
                            label={'Monto Total'}
                            disabled
                        />
                        <Button icon={FaSave} title={'Guardar Operacion'} />

                        <Button
                            icon={FaPaste}
                            title={'Pegar Datos'}
                            onClick={handlePasteButtonClick}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CrearOperacion;