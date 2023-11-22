import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './DataTable.css'
import { useState } from 'react';
import styled from 'styled-components';

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

function DataTableUsuarios({ usuarios }) {

    const[selectedUsuarios, setSelectedUsuarios] = useState(0)

    function verDetalhes(value)
    {
        setSelectedUsuarios(value)
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
    };

    const qtdImagensBodyTemplate = (rowData) => {
        return rowData.images.length;
    };

    const statusBodyTemplate = (rowData) => {
        return <StatusLabel className={rowData.status ? 'active' : ''}/>
    }

    return (
        <>
            <DataTable value={usuarios} showGridlines selection={selectedUsuarios} onSelectionChange={(e) => verDetalhes(e.value)} selectionMode="single" paginator rows={6} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem', marginTop: '5rem' }}>
                <Column field="id" header="Id"></Column>
                <Column field="email" header="Email"></Column>
                <Column body={dateBodyTemplate} header="Data de Criação"></Column>
                
            </DataTable>
        </>
    )
}

export default DataTableUsuarios