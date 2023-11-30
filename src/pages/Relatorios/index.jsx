import DataTablePassagens from '../../components/DataTablePassagens'
import Titulo from '@components/Titulo'

function Relatorios(){

    return (
        <>
            <Titulo>
                <h2 style={{ fontWeight: 500, color: '#B9B9B9' }}>RELATÓRIOS</h2>
            </Titulo>
            <DataTablePassagens />
        </>
    )
}

export default Relatorios