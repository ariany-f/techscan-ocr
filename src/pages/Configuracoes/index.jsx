import http from '@http'
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

        </>
    )
}

export default Configuracoes
