import http from '@http'
import Titulo from '@components/Titulo'
import Frame from '@components/Frame'
import Botao from '@components/Botao'
import DropdownItens from '@components/DropdownItens'
import { useEffect, useState } from "react"
import styled from 'styled-components'


const ContainerLadoALado = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 35px;
    align-itens: center;
`

function Configuracoes(){

    const [cameras, setCameras] = useState([])
    const [motivos, setMotivos] = useState([])
    const [gates, setGates] = useState([])
    const [imagens, setImagens] = useState([])
    const [selectedGate, setSelectedGate] = useState('')
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

    function fetchGates()
    {
        http.get('api/web/public/portoes')
        .then(response => {
            response.map((item) => {
                let obj = {
                    name: item.name,
                    code: item.id
                }
                if(!gates.includes(obj))
                {
                    setGates(estadoAnterior => [...estadoAnterior, obj]);
                }
            })
        })
        .catch(erro => {
            console.error(erro)
        })
    }
    

    function fetchImagensRepresentativas()
    {
        http.get('api/web/public/imagens-representativas')
        .then(response => {
            setImagens(response)
        })
        .catch(erro => {
            console.error(erro)
        })
    }

    useEffect(() => {

        fetchCameras()
        fetchMotivos()
        fetchGates()
        fetchImagensRepresentativas()
        
    }, [])
    
    return (
        <>
            <Titulo>
                <h2 style={{ fontWeight: 500, color: '#B9B9B9' }}>CONFIGURAÇÕES</h2>
            </Titulo>
            <Frame>
                <h4 style={{ fontWeight: 500, color: '#B9B9B9' }}>CÂMERAS E DIREÇÕES</h4>

                <ContainerLadoALado>
                    <DropdownItens camposVazios={classError} setValor={setSelectedCamera} valor={selectedCamera} options={cameras} name="cameras" placeholder="" />
                    <Botao weight="light" size="small" estilo="azul">ADICIONAR CÂMERA</Botao>
                </ContainerLadoALado>

                <h4 style={{ fontWeight: 500, color: '#B9B9B9' }}>DESCRIÇÃO DE MOTIVOS DE ERROS</h4>
                
                <ContainerLadoALado>
                    <DropdownItens camposVazios={classError} setValor={setSelectedMotivo} valor={selectedMotivo} options={motivos} name="reasons" placeholder="" />
                    <Botao weight="light" size="small" estilo="azul">ADICIONAR MOTIVO</Botao>
                </ContainerLadoALado>

                <h4 style={{ fontWeight: 500, color: '#B9B9B9' }}>PORTÕES</h4>

                <ContainerLadoALado>
                    <DropdownItens camposVazios={classError} setValor={setSelectedGate} valor={selectedGate} options={gates} name="gates" placeholder="" />
                    <Botao weight="light" size="small" estilo="azul">ADICIONAR PORTÃO</Botao>
                </ContainerLadoALado>

                {imagens.map((item) => {
                    return <img width="100px" src={`https://api.uniebco.com.br/api/web/public/img/${item.url}.png`} />
                })
                }
            </Frame>
        </>
    )
}

export default Configuracoes
