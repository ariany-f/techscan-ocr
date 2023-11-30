import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CheckboxContainer from "@components/CheckboxContainer"
import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import { useState } from "react"
import styled from "styled-components"
import http from '@http'
import styles from './ModalNovoMotivo.module.css'
import { useRef } from "react"
import { Toast } from 'primereact/toast'

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

function ModalNovoMotivo({ opened = false, aoClicar, aoFechar, passagem }) {

    const [name, setName] = useState('')
    const [is_ocr_error, setIsOcrError] = useState(false)
    const toast = useRef(null);

    function salvarMotivo()
    {
        var sendData = {
            description: name,
            is_ocr_error: is_ocr_error,
        }
        http.post('api/web/public/motivos', sendData)
        .then(response => {
            if(response.code === 200)
            {
                toast.current.show({severity:'success', summary: 'Mensagem', detail:'Salvo com sucesso!', life: 3000});
                aoFechar()
            }
        })
        .catch(erro => {
            console.error(erro)
        })
    }
 

    return(
        <>
            {opened &&
            <Overlay>
                
                <Toast ref={toast} />
                <DialogEstilizado id="modal-motivo" open={opened}>
                    <Frame>
                        <Titulo>
                            <h6 style={{ fontWeight: 500, color: '#B9B9B9' }}>CRIAR MOTIVO DE ERRO DE PASSAGEM</h6>
                        </Titulo>
                        <CampoTexto valor={name} setValor={setName} label="DESCRIÇÃO" placeholder="Digite o motivo do erro de passagem"/>
                        <CheckboxContainer name="is_ocr_error" valor={is_ocr_error} setValor={setIsOcrError} label="Erro de OCR?" />
                    </Frame>
                    <form method="dialog">
                        <div className={styles.containerBottom}>
                            <Botao aoClicar={aoFechar} weight="light" estilo="cinza" formMethod="dialog" size="medium" filled>CANCELAR</Botao>
                            <Botao aoClicar={salvarMotivo} weight="light" estilo="azul" size="medium" filled>SALVAR</Botao>
                        </div>
                    </form>
                </DialogEstilizado>
            </Overlay>}
        </>
    )
}

export default ModalNovoMotivo