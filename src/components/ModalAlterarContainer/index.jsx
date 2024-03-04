import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Texto from "@components/Texto"
import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
import DropdownItens from '@components/DropdownItens'
import { useEffect, useState } from "react"
import styled from "styled-components"
import http from '@http'
import styles from './ModalMotivo.module.css'
import { Autocomplete, TextField } from "@mui/material"
import { ArmazenadorToken } from "../../utils"

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
    width: 40vw;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    border: none;
    margin: 0 auto;
    top: 22vh;
    padding: 24px;
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
        fill: var(--primaria);
        stroke: var(--primaria);
        color: var(--primaria);
    }
    & .frame:nth-of-type(1) {
        gap: 24px;
        & .frame {
            margin-bottom: 24px;
            & p{
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            & b {
                font-weight: 800;
                font-size: 14px;
            }
        }
    }
`

function ModalAlterarContainer({ opened = false, aoClicar, aoFechar, passagem }) {

    const [date, setDate] = useState(new Date())
    const [container, setContainer] = useState('')
    const [dropdownContainers, setDropdownContainers] = useState([])
    const [selectedContainer, setSelectedContainer] = useState(null)

    function updateContainer()
    {
        const filtered = dropdownContainers.filter(item => {
            return item.code === selectedContainer
        })

        var sendData = {
            id: filtered.code,
            plate: filtered.plate,
            container: container,
            updated_by: ArmazenadorToken.UserId
        }
        http.patch('api/web/public/passagens', sendData)
        .then(response => {

        })
        .catch(erro => {
            console.error(erro)
        })
       
        aoFechar()
    }

    useEffect(() => {

        if(passagem && passagem[0])
        {
            const containers = (passagem[0].itens.map(item => {
                return {
                    name: item.container,
                    code: item.id,
                    plate: item.plate
                }
            }))
           setDropdownContainers(containers)
           setSelectedContainer(containers[0].code)
        }

    }, [passagem])

    return(
        <>
            {opened &&
            <Overlay>
                <DialogEstilizado id="modal-alterar-placa" open={opened}>
                    <Frame>
                        <Titulo>
                            <h6>Alterar Container</h6>
                            <SubTitulo>
                                <Texto>Seu registro será gravado com data e horário:&nbsp;
                                {date.toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric'
                                })}
                                </Texto>
                            </SubTitulo>
                            <DropdownItens setValor={setSelectedContainer} valor={selectedContainer} options={dropdownContainers} label="Selecionar Container" name="container" placeholder="" />
                        </Titulo>
                        <CampoTexto valor={container} setValor={setContainer} label="Container" placeholder="Digite o Container"/>
                       
                    </Frame>
                    <form method="dialog">
                        <div className={styles.containerBottom}>
                            <Botao aoClicar={aoFechar} estilo="cinza" weight="light" formMethod="dialog" size="medium" filled>CANCELAR</Botao>
                            <Botao aoClicar={updateContainer} weight="light" estilo="azul" size="medium" filled>SALVAR</Botao>
                        </div>
                    </form>
                </DialogEstilizado>
            </Overlay>}
        </>
    )
}

export default ModalAlterarContainer