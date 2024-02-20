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
    width: 80vw;
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
            background-color: var(--white);
            border-radius: 20px;
            padding: 5px;
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

function ModalImagem({ opened = false, aoClicar, aoFechar, imagem = null }) {

    const [classError, setClassError] = useState([])
    const fecharModal = () => {
       
        aoFechar()
    }

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) 
                aoFechar();
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);

    return (
        <>
            {opened &&
            <Overlay>
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
                            <img style={{width: '100%'}} src={`https://${window.location.hostname}/api/web/public/${imagem}`}/>
                        </Col12>
                    </Frame>
                </DialogEstilizado>
            </Overlay>}
        </>
    )
}

export default ModalImagem