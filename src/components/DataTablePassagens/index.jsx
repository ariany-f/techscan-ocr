import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Calendar } from 'primereact/calendar'
import { InputText } from 'primereact/inputtext';
import { addLocale, FilterMatchMode, FilterOperator } from 'primereact/api'
import { FaSearch } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import Botao from '@components/Botao'
import Texto from '@components/Texto'
import styled from 'styled-components'
import ModalMotivo from '../ModalMotivo'
import http from '@http'

const ContainerLadoALado = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 35px;
    align-itens: center;
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
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        plate: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        container: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },       
    });

    function fetchPassages()
    {
        http.get('api/web/public/passagens')
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

        fetchPassages()

        const interval = setInterval(() => {
            fetchPassages()
          }, 15000);
          return () => clearInterval(interval);

    }, [startDate, endDate])
 
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
            minute: 'numeric'
        });
    };

    const dateBodyTemplate = (rowData) => {
        return formatDate(new Date(rowData.datetime));
    };
    
    const plateBodyTemplate = (rowData) => {
        return rowData.plate ?? '----------';
    };

    const containerBodyTemplate = (rowData) => {
        return rowData.container ?? '----------';
    };

    const qtdImagensBodyTemplate = (rowData) => {
        return rowData.images.length;
    };

    const statusBodyTemplate = (rowData) => {
        return <StatusLabel className={rowData.status ? 'active' : ''}/>
    }

    const rowExpansionTemplate = (data) => {
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
                <Botao weight="300" aoClicar={() => setModalOpened(true)} estilo="neutro">Relatar Problema na Passagem</Botao>

                <div>
                    {data.images.map((item, index) => {
                        return <img key={`${data.id}-${index}`} width="240px" src={`https://api.uniebco.com.br/api/web/public/${item}`} style={{margin: '5px'}} />
                    })}
                </div>
            </>
        );
    };

    const renderHeader = () => {
        const valor = filters['global'] ? filters['global'].value : '';
        
        addLocale('pt', {
            firstDayOfWeek: 1,
            showMonthAfterYear: true,
            dayNames: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
            dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'],
            dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
            monthNames: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
            monthNamesShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
            today: 'Hoje',
            clear: 'Limpar'
        });

        return (
            <ContainerLadoALado>
                <div style={{ width: '40%', display: 'flex', flexDirection: 'column', alignItens: 'center' }}>
                    <Texto weight={700}>Data/Hora Inicial</Texto>
                    <Calendar locale="pt" dateFormat="dd/mm/yy" value={startDate} onChange={(e) => setStartDate(e.value)} showTime hourFormat="24" />
                </div>
                <div style={{ width: '40%', display: 'flex', flexDirection: 'column', alignItens: 'center' }}>
                    <Texto weight={700}>Data/Hora Final</Texto>
                    <Calendar locale="pt" dateFormat="dd/mm/yy" value={endDate} onChange={(e) => setEndDate(e.value)} showTime hourFormat="24" />
                </div>
                <div style={{ paddingTop: '1%', width: '40%', display: 'flex', flexDirection: 'column', alignItens: 'center' }}>
                    <Botao estilo="vermillion">Filtrar Datas</Botao>
                </div>
                <span className="p-input-icon-left" style={{paddingTop: '1rem'}}>
                    <FaSearch />
                    <InputText type="search" value={valor || ''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Procurar" />
                </span>
            </ContainerLadoALado>
        );
    };

    const header = renderHeader();

    return (
        <>
            <DataTable header={header} scrollable onFilter={(e) => setFilters(e.filters)} scrollHeight="660px" filters={filters} value={passagens} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                    rowExpansionTemplate={rowExpansionTemplate} paginator rows={25} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ maxWidth: '95%', marginTop: '1rem' }}>
                <Column header="#" headerStyle={{ width: '5%', textAlign: 'center' }} expander={true} />
                <Column body={plateBodyTemplate} field="plate" header="Placa" headerStyle={{ width: '10%', textAlign: 'center' }}></Column>
                <Column body={dateBodyTemplate} header="Data/Hora" headerStyle={{ width: '10%', textAlign: 'center'}}></Column>
                <Column body={containerBodyTemplate} field="container" header="Container" headerStyle={{ width: '5%', textAlign: 'center' }}></Column>
                <Column field="id_gate" header="Gate" headerStyle={{ width: '4%', textAlign: 'center' }}></Column>
                <Column field="direction" header="Direção" headerStyle={{ width: '4%', textAlign: 'center' }}></Column>
                <Column body={qtdImagensBodyTemplate} header="Qtd. Imagens" headerStyle={{ width: '4%', textAlign: 'center'}}></Column>
                <Column body={statusBodyTemplate} header="Status" headerStyle={{ width: '8%', textAlign: 'center' }}></Column>
            </DataTable>
            <ModalMotivo aoFechar={() => setModalOpened(false)} opened={modalOpened} passagem={expandedRows} />
        </>
    )
}

export default DataTablePassagens