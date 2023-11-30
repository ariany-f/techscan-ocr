import http from '@http'
import Titulo from '@components/Titulo'
import CampoTexto from '@components/CampoTexto'
import Texto from '@components/Texto'
import Frame from '@components/Frame'
import Botao from '@components/Botao'
import DropdownItens from '@components/DropdownItens'
import { useEffect, useState } from "react"
import styled from 'styled-components'
import { FaSave, FaPlus } from "react-icons/fa"

const ContainerLadoALado = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 35px;
    align-itens: center;
    width: 100%;
`

const ImagemRepresentativa = styled.img`
    border: ${ props => props.$ativo ? '5px solid #58bd44' : '' };
    cursor: pointer;
`

function Configuracoes(){

    const [cameras, setCameras] = useState([])
    const [camera, setCamera] = useState({
        name: '',
        direction: 1,
        position: '',
        representative_img_id: null
    })
    const [motivos, setMotivos] = useState([])
    const [gates, setGates] = useState([])
    const [imagens, setImagens] = useState([])
    const [direcoes, setDirecoes] = useState([])
    const [selectedGate, setSelectedGate] = useState('')
    const [selectedCamera, setSelectedCamera] = useState('')
    const [selectedMotivo, setSelectedMotivo] = useState('')
    const [selectedCaminhao, setSelectedCaminhao] = useState(null)
    const [classError, setClassError] = useState([])

    const setDirecao = (direction) => {
        setCamera(estadoAnterior => {
            return {
                ...estadoAnterior,
                direction
            }
        })
    }

    const setName = (name) => {
        setCamera(estadoAnterior => {
            return {
                ...estadoAnterior,
                name
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
                    position: item.position,
                    representative_img_id: item.representative_img_id
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

    const selecionarCamera = (value) => {
        
        setSelectedCamera(value)
        const filtered = cameras.filter((item) => {
           return parseInt(item.code) === parseInt(value)
        })
        setCamera(filtered[0])
        if(filtered[0].representative_img_id)
        {
            setSelectedCaminhao(filtered[0].representative_img_id)
        }
    }

    const salvarNovaCamera = () => {
        console.log(camera)
    }
    
    const editarCamera = () => {
        console.log(camera)
    }

    const selecionarCaminhao = (id) => {
        setSelectedCaminhao(id)
    }
    
    return (
        <>
            <Titulo>
                <h2 style={{ fontWeight: 500, color: '#B9B9B9' }}>CONFIGURAÇÕES</h2>
            </Titulo>
            <Frame>
                <h4 style={{ fontWeight: 500, color: '#B9B9B9' }}>CÂMERAS E DIREÇÕES</h4>
                <div>
                    <DropdownItens camposVazios={classError} setValor={selecionarCamera} valor={selectedCamera} options={cameras} name="cameras" placeholder=""  />
                    <div style={{display: 'flex', gap: '32px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '20px'}}>
                        <>
                            <CampoTexto valor={camera?.name} setValor={setName} label="NOME" name="name" placeholder="" />
                            <CampoTexto valor={camera?.position} setValor={setPosicao} label="POSIÇÃO" name="position" placeholder="" />
                            <DropdownItens camposVazios={classError} setValor={setDirecao} valor={camera?.direction} options={direcoes} label="DIREÇÃO" name="direction" placeholder="" />
                        </>
                        <ContainerLadoALado>
                            <Texto>Imagem Representativa</Texto>
                            {imagens.map((item, index) => {
                                return <ImagemRepresentativa onClick={() => selecionarCaminhao(item.id)} $ativo={(parseInt(selectedCaminhao) === parseInt(item.id))} key={index} width="150px" src={`https://api.uniebco.com.br/api/web/public/img/${item.url}.png`} />
                            })}
                        </ContainerLadoALado>
                        <ContainerLadoALado>
                            <Botao weight="light" size="small" estilo="cinza" aoClicar={salvarNovaCamera}><FaSave className="icon" /> SALVAR CÂMERA</Botao>
                            <Botao weight="light" size="small" estilo="azul" aoClicar={editarCamera}><FaPlus className="icon" /> ADICIONAR NOVA CÂMERA</Botao>
                        </ContainerLadoALado>
                    </div>
                </div>
                <h4 style={{ fontWeight: 500, color: '#B9B9B9' }}>DESCRIÇÃO DE MOTIVOS DE ERROS</h4>
                
                <div>
                    <ContainerLadoALado>
                        <DropdownItens camposVazios={classError} setValor={setSelectedMotivo} valor={selectedMotivo} options={motivos} name="reasons" placeholder="" />
                        <Botao weight="light" size="small" estilo="azul">ADICIONAR MOTIVO</Botao>
                    </ContainerLadoALado>
                </div>

                <h4 style={{ fontWeight: 500, color: '#B9B9B9' }}>PORTÕES</h4>

                <div>
                    <ContainerLadoALado>
                        <DropdownItens camposVazios={classError} setValor={setSelectedGate} valor={selectedGate} options={gates} name="gates" placeholder="" />
                        <Botao weight="light" size="small" estilo="azul">ADICIONAR PORTÃO</Botao>
                    </ContainerLadoALado>
                </div>
            </Frame>
        </>
    )
}

export default Configuracoes
