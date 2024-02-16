import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Calendar } from 'primereact/calendar'
import { InputText } from 'primereact/inputtext'
import { useLocation } from 'react-router-dom'
import { addLocale, FilterMatchMode, FilterOperator } from 'primereact/api'
import { JsonToExcel } from "react-json-to-excel"
import { FaSearch } from 'react-icons/fa'
import { MdOutlineFileDownload, MdOutlineClear } from 'react-icons/md'
import { useEffect, useRef, useState } from 'react'
import Botao from '@components/Botao'
import Texto from '@components/Texto'
import styled from 'styled-components'
import ModalMotivo from '../ModalMotivo'
import { Toast } from 'primereact/toast'
import http from '@http'
import { ArmazenadorToken } from '../../utils'

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
`

function DataTablePassagens() {
    
    const [passagens, setPassagens] = useState([])
    const [expandedRows, setExpandedRows] = useState(null);
    const [modalOpened, setModalOpened] = useState(false)
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const toastConfirmarPassagem = useRef(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        plate: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        container: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },       
    });

    const confirmarPassagem = (id) => {
        const myArray = id.split(",");
        const confirm = myArray.map((item) => {
           var sendData = {
                id: parseInt(item),
                is_ok: 1,
                updated_by: ArmazenadorToken.UserId
            }
            console.log(sendData)
            http.put('api/web/public/passagens', sendData)
            .then(response => {
                return response.code
                
            })
            .catch(erro => {
                console.error(erro)
            })
        })

        console.log(confirm)
        // if(response.code === 200)
        //         {
        //             toastConfirmarPassagem.current.show({severity:'success', summary: 'Mensagem', detail:'Salvo com sucesso!', life: 3000});
        //             setExpandedRows(null)
        //         }

        
    }

    function fetchPassages()
    {
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
            }
        })
        .catch(erro => {
            console.error(erro)
        })
    }

    useEffect(() => {
        if(passagens.length === 0)
        {
            fetchPassages()
        }

        const interval = setInterval(() => {
            fetchPassages()
          }, 5000);
          return () => clearInterval(interval);

    }, [startDate, endDate, modalOpened, confirmarPassagem, passagens])
 
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
        const myArray = rowData.datetime.split(" | ");
        const datas = myArray.map((item) => {
            if(item)
            {
                return formatDate(new Date(item)) + ' '
            }
        })
        return datas;
    };
    
    const plateBodyTemplate = (rowData) => {
        return rowData.plate ?? '----------';
    };
    
    const plateCameraTemplate = (rowData) => {
        return rowData.cameras ?? '----------';
    };

    const containerBodyTemplate = (rowData) => {
        return rowData.container ?? '----------';
    };

    const qtdImagensBodyTemplate = (rowData) => {
        return rowData.images.length;
    };

    const statusBodyTemplate = (rowData) => {
       
        const myArray = rowData.status.split(" | ");
        const is_not_ok = myArray.filter((item) => {
            return !item
        })
        
        return <StatusLabel className={is_not_ok.length === 0 ? 'active' : ''}/>
    }

    const rowExpansionTemplate = (data) => {
        const myArray = data.status.split(" | ");
        const is_not_ok = myArray.filter((item) => {
            return !item
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
                    {
                        is_not_ok.length !== 0 &&
                        <Botao estilo="azul" style={{width:"300px"}} size="small" weight="light" aoClicar={() => confirmarPassagem(data.id)}>CONFIRMAR PASSAGEM</Botao>
                    }
                </ContainerLadoALado>
                <div>
                    {data.images.map((item, index) => {
                        return <img key={`${data.id}-${index}`} width="240px" src={`http://localhost/api/web/public/${item}`} style={{margin: '5px'}} />
                    })}
                </div>
            </>
        );
    };

    const LimparDatas = () => {
        setStartDate('')
        setEndDate('')
    }

    const renderHeader = () => {

        const valor = filters['global'] ? filters['global'].value : '';
        
        addLocale('pt', {
            closeText: 'Fechar',
            prevText: 'Anterior',
            nextText: 'Próximo',
            currentText: 'Começo',
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

                <div style={{ width: '15%', flex: 1, display: 'flex', flexDirection: 'column', alignItens: 'center', flexWrap:'wrap' }}>
                    <Texto weight={400}>Limpar Filtros</Texto>
                    <Botao estilo="cinza" size="medium" aoClicar={LimparDatas}><MdOutlineClear className="icon" /></Botao>
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

    return (
        <>
            {location.pathname == '/relatorios' ?   <JsonToExcel
                title="Download CSV"
                data={passagens}
                fileName={`relatorio-ocr-${new Date()}`}
                btnClassName="button azul filled medium 300"
            /> : ''}
            <DataTable showGridlines header={header} scrollable onFilter={(e) => setFilters(e.filters)} scrollHeight="600px" filters={filters} value={passagens} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                    rowExpansionTemplate={rowExpansionTemplate} paginator rows={25} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ maxWidth: '98%', marginTop: '1rem' }}>
                <Column header="#" style={{ width: '3%', }} headerStyle={{ width: '3%', textAlign: 'center' }} expander={true} />
                <Column body={plateBodyTemplate} field="plate" header="Placa" style={{ width: '12%',textAlign: 'center'}} headerStyle={{ width: '12%', textAlign: 'center' }}></Column>
                <Column body={plateCameraTemplate} field="camera" header="Câmera" style={{ width: '10%',textAlign: 'center'}} headerStyle={{ width: '10%', textAlign: 'center' }}></Column>
                <Column body={dateBodyTemplate} header="Data/Hora" style={{ width: '10%',textAlign: 'center'}} headerStyle={{ width: '10%', textAlign: 'center'}}></Column>
                <Column body={containerBodyTemplate} field="container" header="Container" style={{ width: '12%',textAlign: 'center'}} headerStyle={{ width: '12%', textAlign: 'center' }}></Column>
                <Column field="gate" header="Gate" style={{ width: '10%',textAlign: 'center'}} headerStyle={{ width: '10%', textAlign: 'center' }}></Column>
                <Column field="direction" header="Direção" style={{ width: '10%',textAlign: 'center'}} headerStyle={{ width: '10%', textAlign: 'center' }}></Column>
                <Column body={qtdImagensBodyTemplate} header="Qtd. Imagens" style={{ width: '10%',textAlign: 'center'}} headerStyle={{ width: '10%', textAlign: 'center'}}></Column>
                <Column field="updated_by" header="Aprovação" style={{ width: '10%',textAlign: 'center'}} headerStyle={{ width: '10%', textAlign: 'center'}}/>
                <Column body={statusBodyTemplate} header="Status" style={{ width: '10%',textAlign: 'center'}} headerStyle={{ width: '10%', textAlign: 'center' }}></Column>
            </DataTable>
            
            <Toast ref={toastConfirmarPassagem} />
            <ModalMotivo aoFechar={() => setModalOpened(false)} opened={modalOpened} passagem={expandedRows} />
        </>
    )
}

export default DataTablePassagens