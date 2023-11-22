import http from '@http'
import { useEffect, useState } from "react"
import DataTableUsuarios from '../../components/DataTableUsuarios'


function Usuarios(){

    const [usuarios, setUsuarios] = useState([])

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
        
        const interval = setInterval(() => {
            fetchUsuarios()
          }, 15000);
          return () => clearInterval(interval);
    }, [])
    
    return (
        <>
            <DataTableUsuarios usuarios={usuarios} />
        </>
    )
}

export default Usuarios
