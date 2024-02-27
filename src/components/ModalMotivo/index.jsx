import Botao from "@components/Botao"
import Frame from "@components/Frame"
import Texto from "@components/Texto"
import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import SubTitulo from "@components/SubTitulo"
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

function ModalMotivo({ opened = false, aoClicar, aoFechar, passagem }) {

    const [motivos, setMotivos] = useState([])
    const [selectedMotivo, setSelectedMotivo] = useState([])
    const [typedMotivo, setTypedMotivo] = useState('')
    const [date, setDate] = useState(new Date())
    const outro = {id: 0, label: 'Outro', is_ocr_error: 0}

    function fetchMotivos()
    {
        http.get('api/web/public/motivos')
        .then(response => {
            response.push(outro)
            setMotivos(response)
        })
        .catch(erro => {
            console.error(erro)
        })
    }

    function updateMotivo()
    {
        const myArray = passagem[0].id.split(",");
        const confirm = myArray.map((item) => {
           var sendData = {
                id: parseInt(item),
                is_ocr_error: selectedMotivo.is_ocr_error,
                preset_reason: selectedMotivo.id !== 0 ? selectedMotivo.id : null,
                description_reason: typedMotivo,
                updated_by: ArmazenadorToken.UserId
            }
            http.put('api/web/public/passagens', sendData)
            .then(response => {
            })
            .catch(erro => {
                console.error(erro)
            })
         })
 
         aoFechar()
        
    }
    
    useEffect(() => {
        const intervalId = setInterval(() => {
            setDate(new Date());
        }, 10000)
        return () => clearInterval(intervalId);
    }, [])

    useEffect(() => {
       fetchMotivos()
    }, [])

    function compareObjs(obj1,obj2){
        return JSON.stringify(obj1) === JSON.stringify(obj2);
     }
    
    function alterarMotivo(value){
        setSelectedMotivo(value)
    }

    return(
        <>
            {opened &&
            <Overlay>
                <DialogEstilizado id="modal-motivo" open={opened}>
                    <Frame>
                        <Titulo>
                            <h6>Relatar problema na passagem</h6>
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
                        <Autocomplete
                            onChange={(event, item) => {alterarMotivo(item)}}
                            options={motivos}
                            sx={{ width: '100%' }}
                            renderInput={(params) => <TextField {...params} label="Descrição do problema" />}
                        />
                        {compareObjs(selectedMotivo, outro)
                            ? <CampoTexto valor={typedMotivo} setValor={setTypedMotivo} label="Descrição" placeholder="Digite o motivo do erro de passagem"/>
                            : ''
                        }
                    </Frame>
                    <form method="dialog">
                        <div className={styles.containerBottom}>
                            <Botao aoClicar={aoFechar} estilo="cinza" weight="light" formMethod="dialog" size="medium" filled>CANCELAR</Botao>
                            <Botao aoClicar={updateMotivo} weight="light" estilo="azul" size="medium" filled>RELATAR</Botao>
                        </div>
                    </form>
                </DialogEstilizado>
            </Overlay>}
        </>
    )
}

export default ModalMotivo