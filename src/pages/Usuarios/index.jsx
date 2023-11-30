import http from '@http'
import { useEffect, useState } from "react"
import DataTableUsuarios from '../../components/DataTableUsuarios'
import ModalUsuario from '../../components/ModalUsuario'
import Titulo from '@components/Titulo'


function Usuarios(){

    const [usuarios, setUsuarios] = useState([])
    const [modalOpened, setModalOpened] = useState(false)
    const [idUsuario, setIdUsuario] = useState(null)

    function fetchUsuarios()
    {
        http.get('api/web/public/users')
        .then(response => {
            setUsuarios(response)
        })
        .catch(erro => {
            console.error(erro)
        })
    }

    useEffect(() => {

        fetchUsuarios()
        
    }, [])

    const abrirDetalhesUsuario = (value) => {
        setIdUsuario(value.id)
        setModalOpened(true)
    }
    
    return (
        <>
            <Titulo>
                <h2 style={{ fontWeight: 500, color: '#B9B9B9' }}>USUÁRIOS</h2>
            </Titulo>
            <DataTableUsuarios aoSelecionar={abrirDetalhesUsuario} usuarios={usuarios} />
            <ModalUsuario idUsuario={idUsuario} aoFechar={() => setModalOpened(false)} opened={modalOpened} />
        </>
    )
}

export default Usuarios
