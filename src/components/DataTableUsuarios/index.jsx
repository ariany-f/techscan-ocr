import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { FaSearch, FaPlus } from 'react-icons/fa'
import { InputText } from 'primereact/inputtext'
import Botao from '@components/Botao'
import './DataTable.css'
import { useState } from 'react';
import styled from 'styled-components'

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

function DataTableUsuarios({ usuarios, aoSelecionar }) {

    const[selectedUsuarios, setSelectedUsuarios] = useState(0)
     const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },       
    });

    function verDetalhes(value)
    {
        aoSelecionar(value)
    }

    const formatDate = (value) => {
        return value.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const dateBodyTemplate = (rowData) => {
        return formatDate(new Date(rowData.created_at));
    }

    const onGlobalFilterChange = (event) => {
        const value = event.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
    };

    const renderHeader = () => {
        const value = filters['global'] ? filters['global'].value : '';

        return (
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap:'20px'}}>
                <span className="p-input-icon-left" style={{paddingTop: '1rem'}}>
                    <FaSearch />
                    <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Procurar" />
                </span>
                <Botao aoClicar={aoSelecionar} style={{ marginTop: '15px', width:'300px' }} estilo="azul" size="small" weight="light"><FaPlus className="icon"/> Adicionar Usuário</Botao>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <>
            <DataTable showGridlines dataKey="id" onFilter={(e) => setFilters(e.filters)} header={header} filters={filters} value={usuarios} selection={selectedUsuarios} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
                <Column field="id" header="Id" style={{ width: '5%',textAlign: 'center'}} headerStyle={{ width: '5%', justifyContent: 'center', textAlign: 'center'}}></Column>
                <Column field="name" header="Nome" style={{ width: '30%',textAlign: 'center'}} headerStyle={{ width: '30%', textAlign: 'center'}}></Column>
                <Column field="email" header="Email" style={{ width: '25%',textAlign: 'center'}} headerStyle={{ width: '25%', textAlign: 'center'}}></Column>
                <Column field="user_permissions" header="Permissão" style={{ width: '20%',textAlign: 'center'}} headerStyle={{ width: '20%', textAlign: 'center'}}></Column>
                <Column body={dateBodyTemplate} header="Data de Criação" style={{ width: '20%',textAlign: 'center'}} headerStyle={{ width: '20%', textAlign: 'center'}}></Column>
            </DataTable>
        </>
    )
}

export default DataTableUsuarios