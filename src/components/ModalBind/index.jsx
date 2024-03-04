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
    width: 60vw;
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

function ModalBind({ opened = false, aoClicar, aoFechar, passagem }) {

    const [date, setDate] = useState(new Date())
    const [dropdownEvents, setDropdownEvents] = useState([])
    const [selectedEvent, setSelectedEvent] = useState(null)

    function updateBind()
    {
        const filtered = dropdownEvents.filter(item => {
            return item.code === selectedEvent
        })

        var sendData = {
            id: filtered.code,
            updated_by: ArmazenadorToken.UserId
        }
        http.patch('api/web/public/passagens/desvincular', sendData)
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
            const plates = (passagem[0].itens.map(item => {
                return {
                    name: item.plate ? `Placa: ${item.plate} | Camera: ${item.camera} | Data/Hora: ${item.datetime}` : `Container: ${item.container} | Camera: ${item.camera} | Data/Hora: ${item.datetime}`,
                    code: item.id,
                }
            }))
           setDropdownEvents(plates)
           setSelectedEvent(plates[0].code)
        }

    }, [passagem])

    return(
        <>
            {opened &&
            <Overlay>
                <DialogEstilizado id="modal-alterar-placa" open={opened}>
                    <Frame>
                        <Titulo>
                            <h6>Desvincular passagem</h6>
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
                        </Titulo>
                        <DropdownItens setValor={setSelectedEvent} valor={selectedEvent} options={dropdownEvents} label="Selecionar Evento" name="plate" placeholder="" />
                    </Frame>
                    <form method="dialog">
                        <div className={styles.containerBottom}>
                            <Botao aoClicar={aoFechar} estilo="cinza" weight="light" formMethod="dialog" size="medium" filled>CANCELAR</Botao>
                            <Botao aoClicar={updateBind} weight="light" estilo="azul" size="medium" filled>SALVAR</Botao>
                        </div>
                    </form>
                </DialogEstilizado>
            </Overlay>}
        </>
    )
}

export default ModalBind