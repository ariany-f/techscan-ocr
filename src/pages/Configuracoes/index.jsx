import http from '@http'
import Titulo from '@components/Titulo'
import Frame from '@components/Frame'
import DropdownItens from '@components/DropdownItens'
import { useEffect, useState } from "react"

function Configuracoes(){

    const [cameras, setCameras] = useState([])
    const [motivos, setMotivos] = useState([])
    const [selectedCamera, setSelectedCamera] = useState('')
    const [selectedMotivo, setSelectedMotivo] = useState('')
    const [classError, setClassError] = useState([])

    function fetchCameras()
    {
        http.get('api/web/public/cameras')
        .then(response => {
            response.map((item) => {
                let obj = {
                    name: item.name,
                    code: item.id
                }
                if(!cameras.includes(obj))
                {
                    setCameras(estadoAnterior => [...estadoAnterior, obj]);
                }
            })
        })
        .catch(erro => {
            console.error(erro)
        })
    }

    function fetchMotivos()
    {
        http.get('api/web/public/motivos')
        .then(response => {
            response.map((item) => {
                let obj = {
                    name: item.label,
                    code: item.id
                }
                if(!motivos.includes(obj))
                {
                    setMotivos(estadoAnterior => [...estadoAnterior, obj]);
                }
            })
        })
        .catch(erro => {
            console.error(erro)
        })
    }

    useEffect(() => {

        fetchCameras()
        fetchMotivos()
        
    }, [])
    
    return (
        <>
            <Titulo>
                <h2 style={{ fontWeight: 500, color: '#B9B9B9' }}>CONFIGURAÇÕES</h2>
            </Titulo>
            <Frame>
                <h4 style={{ fontWeight: 500, color: '#B9B9B9' }}>CÂMERAS E DIREÇÕES</h4>

                 <DropdownItens camposVazios={classError} setValor={setSelectedCamera} valor={selectedCamera} options={cameras} label="CÂMERAS" name="camera" placeholder="" />

                <h4 style={{ fontWeight: 500, color: '#B9B9B9' }}>DESCRIÇÃO DE MOTIVOS DE ERROS</h4>
                
                <DropdownItens camposVazios={classError} setValor={setSelectedMotivo} valor={selectedMotivo} options={motivos} label="DESCRIÇÕES" name="reasons" placeholder="" />
            </Frame>
        </>
    )
}

export default Configuracoes
