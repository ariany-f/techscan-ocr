import { DataTable } from 'primereact/datatable'
import Botao from '@components/Botao'
import { Column } from 'primereact/column'
import './DataTable.css'
import { useState } from 'react'
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

function DataTablePassagens({ passagens }) {

    const [expandedRows, setExpandedRows] = useState(null);

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
                <Botao estilo="neutro">Relatar Problema na Passagem</Botao>
                <div>
                    {data.images.map((item) => {
                        return <img width="240px" src={`https://179.228.234.15:4443/api/web/public/${item}`} style={{margin: '5px'}} />
                    })}
                </div>
            </>
        );
    };
    
    const allowExpansion = (rowData) => {
        return rowData.images.length > 0;
    };

    return (
        <>
            <DataTable value={passagens} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                    rowExpansionTemplate={rowExpansionTemplate} paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]}  style={{ maxWidth: '80vw', marginTop: '5rem' }}>
                <Column expander={allowExpansion} style={{ width: '0.2rem' }} />
                <Column body={plateBodyTemplate} header="Placa"></Column>
                <Column body={dateBodyTemplate} header="Data/Hora"></Column>
                <Column body={containerBodyTemplate} header="Container"></Column>
                <Column field="id_gate" header="Gate"></Column>
                <Column field="direction" header="Direção"></Column>
                <Column body={qtdImagensBodyTemplate} header="Qtd. Imagens"></Column>
                <Column body={statusBodyTemplate} header="Status"></Column>
            </DataTable>
        </>
    )
}

export default DataTablePassagens