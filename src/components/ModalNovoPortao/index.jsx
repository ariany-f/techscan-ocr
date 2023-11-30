import Botao from "@components/Botao"
import Frame from "@components/Frame"
import CampoTexto from "@components/CampoTexto"
import Titulo from "@components/Titulo"
import { useState } from "react"
import styled from "styled-components"
import http from '@http'
import styles from './ModalNovoPortao.module.css'
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

function ModalNovoPortao({ opened = false, aoClicar, aoFechar, passagem }) {

    const [name, setName] = useState('')
    const toastPortao = useRef(null);

    function salvarPortao()
    {
        var sendData = {
            name: name,
        }
        http.post('api/web/public/portoes', sendData)
        .then(response => {
            if(response.code === 200)
            {
                toastPortao.current.show({severity:'success', summary: 'Mensagem', detail:'Salvo com sucesso!', life: 3000});
                const interval = setInterval(() => {
                    aoFechar()
                  }, 3000);
                return () => clearInterval(interval);
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
                <Toast ref={toastPortao} />
                <DialogEstilizado id="modal-motivo" open={opened}>
                    <Frame>
                        <Titulo>
                            <h6 style={{ fontWeight: 500, color: '#B9B9B9' }}>CRIAR PORTÃO</h6>
                        </Titulo>
                        <CampoTexto valor={name} setValor={setName} label="DESCRIÇÃO" placeholder="Digite o nome do portão"/>
                    </Frame>
                    <form method="dialog">
                        <div className={styles.containerBottom}>
                            <Botao aoClicar={aoFechar} weight="light" estilo="cinza" formMethod="dialog" size="medium" filled>CANCELAR</Botao>
                            <Botao aoClicar={salvarPortao} weight="light" estilo="azul" size="medium" filled>SALVAR</Botao>
                        </div>
                    </form>
                </DialogEstilizado>
            </Overlay>}
        </>
    )
}

export default ModalNovoPortao