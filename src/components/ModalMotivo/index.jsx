import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import { useEffect, useState } from "react"
import styled from "styled-components"
import http from '@http'
import styles from './ModalMotivo.module.css'

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

function ModalMotivo({ opened = false, aoClicar, aoFechar }) {

    const [motivos, setMotivos] = useState([])

    function fetchMotivos()
    {
        http.get('api/web/public/motivos')
        .then(response => {
            setMotivos(response)
        })
        .catch(erro => {
            console.error(erro)
        })
    }

    useEffect(() => {
       fetchMotivos()
    }, [])

    function salvarMotivo(){

    }

    return(
        <>
            {opened &&
            <Overlay>
                <DialogEstilizado id="modal-motivo" open={opened}>
                    <Frame>
                        <Titulo>
                            <h6>Selecione um problema</h6>
                        </Titulo>
                        <select>
                            <option value="" default>Outro</option>
                            {
                                motivos.map((item) => {
                                    return <option value={item.id}>{item.description}</option>
                                })
                            }
                        </select>
                        <CampoTexto label="Motivo" placeholder="Digite o motivo do erro de passagem"/>
                    </Frame>
                    <form method="dialog">
                        <div className={styles.containerBottom}>
                            <Botao aoClicar={aoFechar} estilo="neutro" formMethod="dialog" size="medium" filled>Cancelar</Botao>
                            <Botao aoClicar={salvarMotivo} estilo="vermilion" size="medium" filled>Alterar</Botao>
                        </div>
                    </form>
                </DialogEstilizado>
            </Overlay>}
        </>
    )
}

export default ModalMotivo