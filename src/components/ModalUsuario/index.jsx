import Frame from "@components/Frame"
import Botao from "@components/Botao"
import CampoTexto from "@components/CampoTexto"
import DropdownItens from '@components/DropdownItens'
import { RiCloseFill } from 'react-icons/ri'
import { FaUserCircle } from 'react-icons/fa'
import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { Toast } from 'primereact/toast'
import http from '@http';

const Col12 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
`

const Col6 = styled.div`
    background-color: ${props => props.$bg ? props.$bg : 'initial'};
    width: ${props => props.$width ? props.$width : '50%'};
    padding: 20px;
    display: flex;
    gap: 20px;
    flex-direction: column;
    align-items: center;
    justify-content: ${props => props.$verticalAlign ? props.$verticalAlign : 'center'};
    text-align: center;
`

const CloseDiv = styled.div`
    position: absolute;
    right: 1%;
    top: 1%;
`

const Overlay = styled.div`
    background-color: rgba(0,0,0,0.80);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`

const DialogEstilizado = styled.dialog`
    display: flex;
    width: 60vw;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
    border: none;
    margin: 0 auto;
    top: 10vh;  
    padding: 0;
    & button.close {
        & .fechar {
            box-sizing: initial;
            fill: var(--primaria);
            stroke: var(--primaria);
            color: var(--primaria);
        }
        position: absolute;
        right: 20px;
        top: 20px;
        cursor: pointer;
        border: none;
        background-color: initial;
    }
    & .icon {
        margin-right: 5px;
        box-sizing: initial;
        fill: 'white';
        stroke: 'white';
        color:'white';
    }
`

function ModalUsuario({ opened = false, aoClicar, aoFechar, idUsuario = null }) {

    const [classError, setClassError] = useState([])
    const [usuario, setUsuario] = useState({
        name: '',
        email: '',
        permission_id: 1,
        new_password: '',
        status: 1,
        password: ''
    })
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const toast = useRef(null);

    const statuses = [
        {
            name: 'Ativo',
            code: 1
        },
        {
            name: 'Desativado',
            code: 2
        }
    ]

    const permissions = [
        {
            name: 'Administrador',
            code: 1
        },
        {
            name: 'Operador',
            code: 2
        }
    ]

    const setNome = (name) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                name
            }
        })
    }
    const setEmail = (email) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                email
            }
        })
    }
    const setSenha = (password) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                password
            }
        })
    }
    const setNewPassword = (new_password) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                new_password
            }
        })
    }
    const setStatus = (status) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                status
            }
        })
    }
    const setPermission = (permission_id) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                permission_id
            }
        })
    }

    const editarUsuario = () => {

        setNewPassword(password)

        if(usuario.id)
        {
            console.log(usuario)
            http.put(`api/web/public/users`, usuario)
            .then((response) => {
               if(response.code == 200)
               {
                    toast.current.show({severity:'success', summary: 'Mensagem', detail:'Salvo com sucesso!', life: 3000});
               }
            })
            .catch(erro => {
                console.error(erro)
            })
        }
        else{
            http.post(`api/web/public/users`, usuario)
            .then((response) => {
            if(response.code == 200)
            {
                    toast.current.show({severity:'success', summary: 'Mensagem', detail:'Salvo com sucesso!', life: 3000});
                    aoFechar()
            }
            })
            .catch(erro => {
                console.error(erro)
            })
        }
    }

    useEffect(() => {
        if(opened && idUsuario && usuario.email === '')
        {
            http.get(`api/web/public/users/${idUsuario}`)
                .then((response) => {
                    setUsuario(response[0])
                    setName(response[0].name)
                    setNewPassword('')
                })
                .catch(erro => {
                    console.error(erro)
                })
        }
    }, [idUsuario])

    const fecharModal = () => {
        setUsuario({
            name: '',
            email: '',
            permission_id: 1,
            new_password: '',
            status: 1,
            password: ''
        })
        aoFechar()
    }

    return (
        <>
            {opened &&
            <Overlay>
                <Toast ref={toast} />
                <DialogEstilizado id="modal-detalhes-usuario" open={opened}>
                    <Frame>
                        <CloseDiv>
                            <form method="dialog">
                                <button className="close" onClick={fecharModal} formMethod="dialog">
                                    <RiCloseFill size={20} className="fechar" />
                                </button>
                            </form>
                        </CloseDiv>
                        <Col12>
                            <Col6 $bg="black" style={{paddingTop: '40px', paddingBottom: '40px'}} $width="30%" $verticalAlign="space-between">
                                <div style={{display: 'flex', gap: '10px', flexDirection: 'column', alignItems:'center'}}>
                                    <FaUserCircle size={100} className="icon"/>
                                    <p style={{ color: 'white', textTransform: 'uppercase' }}>{name}</p>
                                </div>
                                <p style={{color: 'white', cursor: 'pointer'}} onClick={fecharModal}>VOLTAR</p>
                            </Col6>
                            <Col6 $width="70%" style={{paddingTop: '40px'}} $verticalAlign="center">
                                <CampoTexto
                                    numeroCaracteres={50}
                                    camposVazios={classError}
                                    valor={usuario?.name}
                                    type="text"
                                    setValor={setNome}
                                    placeholder=""
                                    label="NOME"
                                />
                                <DropdownItens camposVazios={classError} setValor={setStatus} valor={usuario?.status} options={statuses} label="STATUS" name="status" placeholder="" />
                                <CampoTexto
                                    numeroCaracteres={50}
                                    camposVazios={classError}
                                    valor={usuario?.email}
                                    type="email"
                                    setValor={setEmail}
                                    placeholder=""
                                    label="EMAIL"
                                />
                                <DropdownItens camposVazios={classError} setValor={setPermission} valor={usuario?.permission_id} options={permissions} label="PERMISSÃO" name="permission_id" placeholder="" />
                                <CampoTexto
                                    numeroCaracteres={50}
                                    camposVazios={classError}
                                    valor={password}
                                    type="password"
                                    setValor={setPassword}
                                    placeholder=""
                                    label="SENHA"
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
                                    <div style={{ display: 'flex', gap: '20px' }}>
                                        <Botao size="small" aoClicar={fecharModal} estilo="cinza" weight="light">CANCELAR</Botao>
                                        <Botao size="small" aoClicar={editarUsuario} estilo="azul" weight="light">SALVAR</Botao>
                                    </div>
                                </div>
                            </Col6>
                        </Col12>
                    </Frame>
                </DialogEstilizado>
            </Overlay>}
        </>
    )
}

export default ModalUsuario