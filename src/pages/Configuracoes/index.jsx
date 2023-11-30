import http from '@http'
import Titulo from '@components/Titulo'
import CampoTexto from '@components/CampoTexto'
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
    const [camera, setCamera] = useState({
        name: '',
        direction: 1,
        position: '',
        representative_img_id: 1
    })
    const [motivos, setMotivos] = useState([])
    const [gates, setGates] = useState([])
    const [imagens, setImagens] = useState([])
    const [direcoes, setDirecoes] = useState([])
    const [selectedGate, setSelectedGate] = useState('')
    const [selectedCamera, setSelectedCamera] = useState('')
    const [selectedMotivo, setSelectedMotivo] = useState('')
    const [classError, setClassError] = useState([])

    const setDirecao = (direction) => {
        setCamera(estadoAnterior => {
            return {
                ...estadoAnterior,
                direction
            }
        })
    }

    const setPosicao = (position) => {
        setCamera(estadoAnterior => {
            return {
                ...estadoAnterior,
                position
            }
        })
    }

    function fetchCameras()
    {
        http.get('api/web/public/cameras')
        .then(response => {
            response.map((item) => {
                let obj = {
                    name: item.name,
                    code: item.id,
                    direction: item.direction,
                    position: item.position
                }
                if(!cameras.includes(obj))
                {
                    setCameras((estadoAnterior) => [...estadoAnterior, obj])
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
                    setMotivos(estadoAnterior => [...estadoAnterior, obj])
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
    
    function fetchDirecoes()
    {
        http.get('api/web/public/direcoes')
        .then(response => {
            response.map((item) => {
                let obj = {
                    name: item.description,
                    code: item.id
                }
                if(!direcoes.includes(obj))
                {
                    setDirecoes(estadoAnterior => [...estadoAnterior, obj]);
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
        fetchGates()
        fetchImagensRepresentativas()
        fetchDirecoes()
    }, [])

    const SelecionarCamera = (value) => {
        
        setSelectedCamera(value)
        const filtered = cameras.filter((item) => {
           return parseInt(item.code) === parseInt(value)
        })
       setCamera(filtered[0])
    }
    
    return (
        <>
            <Titulo>
                <h2 style={{ fontWeight: 500, color: '#B9B9B9' }}>CONFIGURAÇÕES</h2>
            </Titulo>
            <Frame>
                <h4 style={{ fontWeight: 500, color: '#B9B9B9' }}>CÂMERAS E DIREÇÕES</h4>
                <div>
                    <ContainerLadoALado>
                        <DropdownItens camposVazios={classError} setValor={SelecionarCamera} valor={selectedCamera} options={cameras} name="cameras" placeholder=""  />
                        <Botao weight="light" size="small" estilo="azul">ADICIONAR CÂMERA</Botao>
                    </ContainerLadoALado>
                    {camera.position &&
                        <CampoTexto valor={camera.position} setValor={setPosicao} label="POSIÇÃO" name="position" placeholder="" />
                    }
                    {camera.direction &&
                        <DropdownItens camposVazios={classError} setValor={setDirecao} valor={camera.direction} options={direcoes} name="direction" placeholder="" />
                    }
                </div>
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

                {imagens.map((item, index) => {
                    return <img key={index} width="100px" src={`https://api.uniebco.com.br/api/web/public/img/${item.url}.png`} />
                })
                }
            </Frame>
        </>
    )
}

export default Configuracoes
