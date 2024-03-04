import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Calendar } from 'primereact/calendar'
import { InputText } from 'primereact/inputtext'
import { useLocation } from 'react-router-dom'
import { addLocale, FilterMatchMode, FilterOperator } from 'primereact/api'
import { JsonToExcel } from "react-json-to-excel"
import { FaSearch } from 'react-icons/fa'
import { MdOutlineFileDownload, MdOutlineClear, MdOutlineRefresh } from 'react-icons/md'
import { useEffect, useRef, useState } from 'react'
import Botao from '@components/Botao'
import Texto from '@components/Texto'
import styled from 'styled-components'
import ModalMotivo from '../ModalMotivo'
import { Toast } from 'primereact/toast'
import http from '@http'
import { ArmazenadorToken } from '../../utils'
import ModalAlterarPlaca from '../ModalAlterarPlaca'
import ModalAlterarContainer from '../ModalAlterarContainer'
import ModalImagem from '../ModalImagem'
import Loading from '@components/Loading'

const ContainerLadoALado = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 20px;
    align-itens: center;
    flex-wrap: wrap;
`

const StatusLabel = styled.div`
    background-color: #FA896B;
    border-radius: 100%;
    height: 15px;
    width: 15px;
    margin: auto;
    &::before {
        content: '';
        position: relative;
        display: block;
        width: 300%;
        height: 300%;
        box-sizing: border-box;
        border-radius: 45px;
        background-color: #FA896B;
        animation: pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        left: -100%;
        top: -100%;
    }
    &::after {
        content: '',
        position: absolute;
        display: block;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border-radius: 15px;
        background-color: #FA896B;
        animation: pulse-dot 1.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) -.4s infinite;
    }
    &.active {
        background-color: #13DEB9;
    }
    &.active::before {
        animation: none;
        background-color: #13DEB9;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
    }
    &.active::after {
        animation: none;
        background-color: #13DEB9;
        width: 100%;
        height: 100%;
    }
    
    &.warning {
        background-color: #cfc13f;
    }
    &.warning::before {
        animation: none;
        background-color: #cfc13f;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
    }
    &.warning::after {
        animation: none;
        background-color: #cfc13f;
        width: 100%;
        height: 100%;
    }
`

function DataTablePassagens() {
    
    const [passagens, setPassagens] = useState(null)
    const [expandedRows, setExpandedRows] = useState(null);
    const [modalOpened, setModalOpened] = useState(false)
    const [modalPlateOpened, setModalPlateOpened] = useState(false)
    const [modalContainerOpened, setModalContainerOpened] = useState(false)
    const [modalImagemOpened, setModalImagemOpened] = useState(false)
    const [imagemModal, setImagemModal] = useState(null)
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const toastConfirmarPassagem = useRef(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        plate: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        container: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },       
    }); 
    const [loading, setLoading] = useState(false)
    const timerRef = useRef(null);

    const confirmarPassagem = (id) => {
        const myArray = id;
        const confirm = myArray.map((item) => {
           var sendData = {
                id: parseInt(item),
                is_ok: 1,
                updated_by: ArmazenadorToken.UserId
            }
            http.put('api/web/public/passagens', sendData)
            .then(response => {
                return response
                
            })
            .catch(erro => {
                console.error(erro)
            })
        })

        toastConfirmarPassagem.current.show({severity:'success', summary: 'Mensagem', detail:'Salvo com sucesso!', life: 3000});
        setExpandedRows(null)
    }

    function abrirImagem(item)
    {
        setImagemModal(item)
        setModalImagemOpened(true)
    }

    function fetchPassages()
    {
        setLoading(true)
        const filterData = {

            dataInicial: startDate ? startDate.toLocaleDateString('sv-SE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            }) : null,
            dataFinal: endDate ? endDate.toLocaleDateString('sv-SE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            }) : null
        }
        http.post('api/web/public/passagens', filterData)
        .then(response => {
            if(response)
            {
                setPassagens(response)
                setLoading(false)
            }
        })
        .catch(erro => {
            console.error(erro)
            setLoading(false)
        })
    }

    useEffect(() => {

        if(!passagens)
        {
            fetchPassages()
        }

        // useRef value stored in .current property
        timerRef.current = window.setTimeout(() => {
            fetchPassages()
        }, 60000);

        // clear on component unmount
        return () => {
            window.clearTimeout(timerRef.current);
        };

        // const timeoutID = window.setTimeout(() => {
        //     fetchPassages()
        // }, 1000);
    
        // return () => window.clearTimeout(timeoutID );

    }, [startDate, endDate, modalOpened, toastConfirmarPassagem, passagens, modalPlateOpened, modalContainerOpened])
 
    const onGlobalFilterChange = (event) => {
        const value = event.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
    };

    const formatDate = (value) => {
        return value.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });
    };

    const dateBodyTemplate = (rowData) => {
        const myArray = rowData.itens;
        const datas = myArray.map((item) => {
            if(item.datetime)
            {
                return formatDate(new Date(item.datetime)) + ' '
            }
        })
        return datas;
    };
    
    const plateBodyTemplate = (rowData) => {
        const plates = rowData.itens.map((item) => {
            return item.plate ?? '----------';
        })
        return plates;
    };
    
    const plateCameraTemplate = (rowData) => {
        const cameras = rowData.itens.map((item) => {
            if(item.camera)
            {
                return item.camera ?? '----------';
            }
        })
        return cameras;
    };

    const containerBodyTemplate = (rowData) => {
        const containers = rowData.itens.map((item) => {
            return item.container ?? '----------';
        })
        return containers;
    };
    
    const updatedByBodyTemplate = (rowData) => {
        const updated = rowData.itens.map((item) => {
            return item.updated_by ?? '----------';
        })
        return updated;
    };
    
    const DirectionBodyTemplate = (rowData) => {
        const directions = rowData.itens.map((item) => {
            return item.direction ?? '----------';
        })
        return directions;
    };
    
    const GateBodyTemplate = (rowData) => {
        const gates = rowData.itens.map((item) => {
            return item.gate ?? '----------';
        })
        return gates;
    };

    const qtdImagensBodyTemplate = (rowData) => {
        let countImages = 0;
        const images = rowData.itens.map((item) => {
            if(item.images)
            {
                countImages =+ item.images.length
            }
        })
        return countImages;
    };

    const statusBodyTemplate = (rowData) => {
        let is_warned = false
        const is_not_ok = rowData.itens.filter((item) => {

            if(item.updated_by)
            {
                is_warned = true
            }

            return item.is_ok === 0
        })
        
        return <StatusLabel className={is_not_ok.length === 0 ? 'active' : (is_warned ? 'warning' : '')}/>
    }

    const rowExpansionTemplate = (data) => {
        const myArray = data.itens;
        let is_warned = false
        const is_not_ok = myArray.filter((item) => {
            if(item.updated_by)
            {
                is_warned = true
            }

            return item.is_ok === 0
        })
        
        return (
            <>
                {data.error_reason
                ? <>
                    <Texto>Problemas na passagem:</Texto>
                    {data.error_reason}
                    &nbsp;em {formatDate(new Date(data.updated_at))}
                    {data.updated_by ? (" por " + data.updated_by) : ''}
                </>
                : ''
                }
                
                <ContainerLadoALado>
                    <Botao estilo="cinza" weight="light" style={{width:"300px"}} size="small" aoClicar={() => setModalOpened(true)}>RELATAR ERRO</Botao>
                    <Botao estilo="azul" weight="light" style={{width:"300px"}} size="small" aoClicar={() => setModalPlateOpened(true)}>ALTERAR PLACA</Botao>
                    <Botao estilo="azul" weight="light" style={{width:"300px"}} size="small" aoClicar={() => setModalContainerOpened(true)}>ALTERAR CONTAINER</Botao>
                    {
                        (is_not_ok.length !== 0 && !is_warned) &&
                        <Botao estilo="azul" style={{width:"300px"}} size="small" weight="light" aoClicar={() => confirmarPassagem(data.id)}>CONFIRMAR PASSAGEM</Botao>
                    }
                </ContainerLadoALado>
                <div>
                    {data.itens.map((passage, index) => {
                       return Object.values(passage.images).map((item, index) => {
                            return <img onClick={() => abrirImagem(item)} key={`${data.id}-${index}`} width="240px" src={`http://${window.location.hostname}/api/web/public/${item}`} style={{margin: '5px'}} />
                        })
                    })}
                </div>
            </>
        );
    };

    const LimparDatas = () => {
        setStartDate('')
        setEndDate('')
    }

    const RefreshData = () => {
        fetchPassages()
    }

    const renderHeader = () => {

        const valor = filters['global'] ? filters['global'].value : '';
        
        addLocale('pt', {
            closeText: 'Fechar',
            prevText: 'Anterior',
            nextText: 'Próximo',
            monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
            monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun', 'Jul','Ago','Set','Out','Nov','Dez'],
            dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
            dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
            dayNamesMin: ['D','S','T','Q','Q','S','S'],
            weekHeader: 'Semana',
            firstDay: 1,
            isRTL: false,
            showMonthAfterYear: false,
            yearSuffix: '',
            timeOnlyTitle: 'Só Horas',
            timeText: 'Tempo',
            hourText: 'Hora',
            minuteText: 'Minuto',
            secondText: 'Segundo',
            currentText: 'Data Atual',
            ampm: false,
            month: 'Mês',
            week: 'Semana',
            day: 'Dia',
            allDayText : 'Todo Dia'
        });

        return (
            <ContainerLadoALado>
                <div style={{ width: '20%', flex: 1, display: 'flex', flexDirection: 'column', alignItens: 'center', flexWrap:'wrap' }}>
                    <Texto weight={400}>Data/Hora Inicial</Texto>
                    <Calendar locale="pt" dateFormat="dd/mm/yy" value={startDate} onChange={(e) => setStartDate(e.value)} showTime hourFormat="24" />
                </div>
                <div style={{ width: '20%', flex: 1, display: 'flex', flexDirection: 'column', alignItens: 'center', flexWrap:'wrap' }}>
                    <Texto weight={400}>Data/Hora Final</Texto>
                    <Calendar locale="pt" dateFormat="dd/mm/yy" value={endDate} onChange={(e) => setEndDate(e.value)} showTime hourFormat="24" />
                </div>

                <div style={{ width: '10%', flex: 1, display: 'flex', flexDirection: 'column', alignItens: 'center', flexWrap:'wrap' }}>
                    <Texto weight={400}>Limpar Filtros</Texto>
                    <Botao estilo="cinza" size="medium" aoClicar={LimparDatas}><MdOutlineClear className="icon" /></Botao>
                </div>

                <div style={{ width: '10%', flex: 1, display: 'flex', flexDirection: 'column', alignItens: 'center', flexWrap:'wrap' }}>
                    <Texto weight={400}>Recarregar</Texto>
                    <Botao estilo="azul" size="medium" aoClicar={RefreshData}><MdOutlineRefresh className="icon" /></Botao>
                </div>

                <span className="p-input-icon-left" style={{paddingTop: '1rem'}}>
                    <FaSearch />
                    <InputText type="search" value={valor || ''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Procurar" />
                </span>
            </ContainerLadoALado>
        );
    };

    const header = renderHeader();

    const location = useLocation();

    const icone = <MdOutlineFileDownload className="icon" size={20} />


    const expandedRowsChange = (e) => {
        setExpandedRows(null)
        const open = e.data.slice(-1)
        setExpandedRows(open)
    }

    return (
        <>
            {location.pathname == '/relatorios' ?   <JsonToExcel
                title="Download CSV"
                data={passagens}
                fileName={`relatorio-ocr-${new Date()}`}
                btnClassName="button azul filled medium 300"
            /> : ''}
            
            <Loading opened={loading} />
            <DataTable showGridlines header={header} scrollable onFilter={(e) => setFilters(e.filters)} style={{zIndex: 0}} scrollHeight="600px" filters={filters} value={passagens} expandedRows={expandedRows} onRowToggle={(e) => expandedRowsChange(e)}
                    rowExpansionTemplate={rowExpansionTemplate} paginator rows={25} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ maxWidth: '98%', marginTop: '1rem' }}>
                <Column header="#" style={{ width: '3%', }} headerStyle={{ width: '3%', textAlign: 'center' }} expander={true} />
                <Column body={plateBodyTemplate} field="plate" header="Placa" style={{ width: '12%',textAlign: 'center'}} headerStyle={{ width: '12%', textAlign: 'center' }}></Column>
                <Column body={plateCameraTemplate} field="camera" header="Câmera" style={{ width: '10%',textAlign: 'center'}} headerStyle={{ width: '10%', textAlign: 'center' }}></Column>
                <Column body={dateBodyTemplate} header="Data/Hora" style={{ width: '10%',textAlign: 'center'}} headerStyle={{ width: '10%', textAlign: 'center'}}></Column>
                <Column body={containerBodyTemplate} field="container" header="Container" style={{ width: '12%',textAlign: 'center'}} headerStyle={{ width: '12%', textAlign: 'center' }}></Column>
                <Column body={GateBodyTemplate} field="gate" header="Gate" style={{ width: '10%',textAlign: 'center'}} headerStyle={{ width: '10%', textAlign: 'center' }}></Column>
                <Column body={DirectionBodyTemplate} field="direction" header="Direção" style={{ width: '10%',textAlign: 'center'}} headerStyle={{ width: '10%', textAlign: 'center' }}></Column>
                <Column body={qtdImagensBodyTemplate} header="Qtd. Imagens" style={{ width: '10%',textAlign: 'center'}} headerStyle={{ width: '10%', textAlign: 'center'}}></Column>
                <Column body={updatedByBodyTemplate} field="updated_by" header="Aprovação" style={{ width: '10%',textAlign: 'center'}} headerStyle={{ width: '10%', textAlign: 'center'}}/>
                <Column body={statusBodyTemplate} header="Status" style={{ width: '10%',textAlign: 'center'}} headerStyle={{ width: '10%', textAlign: 'center' }}></Column>
            </DataTable>
            
            <Toast ref={toastConfirmarPassagem} />
            <ModalMotivo aoFechar={() => setModalOpened(false)} opened={modalOpened} passagem={expandedRows} />
            <ModalAlterarPlaca aoFechar={() => setModalPlateOpened(false)} opened={modalPlateOpened} passagem={expandedRows} />
            <ModalAlterarContainer aoFechar={() => setModalContainerOpened(false)} opened={modalContainerOpened} passagem={expandedRows} />
            <ModalImagem aoFechar={() => setModalImagemOpened(false)} opened={modalImagemOpened} imagem={imagemModal} />
        </>
    )
}

export default DataTablePassagens