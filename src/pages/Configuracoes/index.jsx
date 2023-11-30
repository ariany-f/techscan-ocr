import http from '@http'
import Titulo from '@components/Titulo'
import CampoTexto from '@components/CampoTexto'
import Texto from '@components/Texto'
import ModalNovoMotivo from '@components/ModalNovoMotivo'
import ModalNovoPortao from '@components/ModalNovoPortao'
import Frame from '@components/Frame'
import Botao from '@components/Botao'
import DropdownItens from '@components/DropdownItens'
import { useEffect, useRef, useState } from "react"
import styled from 'styled-components'
import { FaSave, FaPlus } from "react-icons/fa"
import { Toast } from 'primereact/toast'

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
const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    width:100%;
`;

const Col6 = styled.div`
    padding: 20px;
    width: 445px;
`;

function Configuracoes(){

    const InicialCamera = {
        name: '',
        direction: 1,
        position: '',
        code: '',
        representative_img_id: 1
    }
    const [cameras, setCameras] = useState([])
    const [camera, setCamera] = useState(InicialCamera)
    const [motivos, setMotivos] = useState([])
    const [gates, setGates] = useState([])
    const [imagens, setImagens] = useState([])
    const [direcoes, setDirecoes] = useState([])
    const [selectedGate, setSelectedGate] = useState('')
    const [selectedCamera, setSelectedCamera] = useState(null)
    const [selectedMotivo, setSelectedMotivo] = useState('')
    const [selectedCaminhao, setSelectedCaminhao] = useState(1)
    const [classError, setClassError] = useState([])
    const [modalNovoMotivoOpened, setModalNovoMotivoOpened] = useState(false)
    const [modalNovoPortaoOpened, setModalNovoPortaoOpened] = useState(false)
    const toast = useRef(null);


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

    const setRepresentativeImgId = (representative_img_id) => {
        setCamera(estadoAnterior => {
            return {
                ...estadoAnterior,
                representative_img_id
            }
        })
    }

    function fetchCameras()
    {
        http.get('api/web/public/cameras')
        .then(response => {
            let obj = {
                name: 'Selecione uma câmera para começar',
                code: '',
                direction: 1,
                position: '',
                id: null,
                representative_img_id: 1
            }
            setCameras((estadoAnterior) => [...estadoAnterior, obj])

            response.map((item, index) => {
                let obj = {
                    name: item.name,
                    id: item.id,
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
            response.map((item, index) => {
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
    
    const selecionarCamera = (value) => {
        setSelectedCamera(value)
        if(value === '')
        {
            setCamera(InicialCamera)
        }
        else{
            const filtered = cameras.filter((item) => {
                return parseInt(item.code) === parseInt(value)
            })
            setCamera(filtered[0])
            if(filtered[0].representative_img_id)
            {
                setSelectedCaminhao(filtered[0].representative_img_id)
            }
        }
    }

    const salvarCamera = () => {
        if(camera.id)
        {
            http.put('api/web/public/cameras', camera)
            .then(response => {
                if(response.code == 200)
                {
                    toast.current.show({severity:'success', summary: 'Mensagem', detail:'Salvo com sucesso!', life: 3000});
                }
            })
            .catch(erro => {
                console.error(erro)
            })
        }
    }

    const alterarRepresentativeImg = (id) => {
        setRepresentativeImgId(id)
        setSelectedCaminhao(id)
    }
    
    useEffect(() => {
        fetchMotivos()
    }, [modalNovoMotivoOpened])
    
    useEffect(() => {
        fetchGates()
    }, [modalNovoPortaoOpened])

    useEffect(() => {
        fetchCameras()
        fetchImagensRepresentativas()
        fetchDirecoes()
    }, [])
    
    return (
        <>
            <div style={{maxWidth: '1240px'}}>
                <Toast ref={toast} />
                <Titulo>
                    <h2 style={{ fontWeight: 500, color: '#B9B9B9' }}>CONFIGURAÇÕES</h2>
                </Titulo>
                <Frame>
                    <div>
                        <h5 style={{ fontWeight: 500, color: '#B9B9B9' }}>CÂMERAS E DIREÇÕES</h5>
                        <div style={{display: 'flex', gap: '32px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '20px', maxWidth: '95vw'}}>
                            <DropdownItens 
                                camposVazios={classError} 
                                setValor={selecionarCamera} 
                                valor={selectedCamera} 
                                options={cameras} 
                                name="cameras" 
                                label="CÂMERA SELECIONADA"  
                            />
                            <Col12 style={{border: '1px solid #B9B9B9', padding: '15px'}}>
                                <Col6>
                                    <CampoTexto valor={camera?.name} setValor={setName} label="NOME" name="name" placeholder="" />
                                </Col6>
                                <Col6>
                                    <CampoTexto valor={camera?.position} setValor={setPosicao} label="POSIÇÃO" name="position" placeholder="" />
                                </Col6>
                                <Col6>
                                    <DropdownItens camposVazios={classError} setValor={setDirecao} valor={camera?.direction} options={direcoes} label="DIREÇÃO" name="direction" placeholder="" />
                                </Col6>
                                <Col12>
                                    <Texto>Imagem Representativa</Texto>
                                </Col12>
                                <ContainerLadoALado  style={{marginTop: '30px', flexWrap: 'wrap'}}>
                                    {imagens.map((item, index) => {
                                        return <ImagemRepresentativa onClick={() => alterarRepresentativeImg(item.id)} $ativo={(parseInt(selectedCaminhao) === parseInt(item.id))} key={index} width="135px" src={`https://api.uniebco.com.br/api/web/public/img/${item.url}.png`} />
                                    })}
                                </ContainerLadoALado>
                            </Col12>
                            <Col12>
                                <ContainerLadoALado>
                                    {camera && camera.code &&
                                        <Botao weight="light" size="small" estilo="cinza" aoClicar={salvarCamera}><FaSave className="icon" /> SALVAR CÂMERA</Botao>
                                    }
                                </ContainerLadoALado>
                            </Col12>
                        </div>
                    </div>

                    <div>
                        <h5 style={{ fontWeight: 500, color: '#B9B9B9' }}>DESCRIÇÃO DE MOTIVOS DE ERROS</h5>
                        
                        <div>
                            <ContainerLadoALado>
                                <DropdownItens camposVazios={classError} setValor={setSelectedMotivo} valor={selectedMotivo} options={motivos} name="reasons" placeholder="" />
                                <Botao aoClicar={() => setModalNovoMotivoOpened(true)} weight="light" size="small" estilo="azul"><FaPlus className="icon" /> ADICIONAR MOTIVO</Botao>
                            </ContainerLadoALado>
                        </div>
                    </div>

                    <div>
                        <h5 style={{ fontWeight: 500, color: '#B9B9B9' }}>PORTÕES</h5>

                        <div>
                            <ContainerLadoALado>
                                <DropdownItens camposVazios={classError} setValor={setSelectedGate} valor={selectedGate} options={gates} name="gates" placeholder="" />
                                <Botao aoClicar={() =>setModalNovoPortaoOpened(true)} weight="light" size="small" estilo="azul"><FaPlus className="icon" /> ADICIONAR PORTÃO</Botao>
                            </ContainerLadoALado>
                        </div>
                    </div>
                </Frame>
                <ModalNovoMotivo opened={modalNovoMotivoOpened} aoFechar={() => setModalNovoMotivoOpened(false)}/>
                <ModalNovoPortao opened={modalNovoPortaoOpened} aoFechar={() => setModalNovoPortaoOpened(false)}/>
            </div>
        </>
    )
}

export default Configuracoes
