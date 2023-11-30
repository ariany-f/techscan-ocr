import http from '@http'
import Titulo from '@components/Titulo'
import Frame from '@components/Frame'
import { useEffect, useState } from "react"

function Configuracoes(){

    const [cameras, setCameras] = useState([])

    function fetchCameras()
    {
        http.get('api/web/public/cameras')
        .then(response => {
            setCameras(response)
            console.log(response);
        })
        .catch(erro => {
            console.error(erro)
        })
    }

    useEffect(() => {

        fetchCameras()
        
        const interval = setInterval(() => {
            fetchCameras()
          }, 15000);
          return () => clearInterval(interval);
    }, [])
    
    return (
        <>
            <Titulo>
                <h2 style={{ fontWeight: 500, color: '#B9B9B9' }}>CONFIGURAÇÕES</h2>
            </Titulo>
            <Frame>
                <h4 style={{ fontWeight: 500, color: '#B9B9B9' }}>TABELA PRINCIPAL</h4>
            </Frame>
        </>
    )
}

export default Configuracoes
