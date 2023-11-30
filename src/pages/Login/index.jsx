import Botao from "@components/Botao"
import CampoTexto from "@components/CampoTexto"
import Frame from "@components/Frame"
import SubTitulo from "@components/SubTitulo"
import Titulo from "@components/Titulo"
import { useNavigate } from "react-router-dom"
import { useSessaoUsuarioContext } from "../../contexts/SessaoUsuario"
import { useState } from "react"

function Login() {

    const [classError, setClassError] = useState([])
    const navegar = useNavigate()

    const { 
        usuario,
        setEmail,
        setPassword,
        submeterLogin,
        setUsuarioEstaLogado
    } = useSessaoUsuarioContext()
    
    const sendData = (evento) => {
        evento.preventDefault()

        document.querySelectorAll('input').forEach(function(element) {
            if(element.value !== '')
            {
                if(classError.includes(element.name))
                {
                    setClassError(classError.filter(item => item !== element.name))
                }
            }
            else
            {
                if(!classError.includes(element.name))
                {
                    setClassError(estadoAnterior => [...estadoAnterior, element.name])
                }
            }
        })

        if(document.querySelectorAll("form .error").length === 0 && document.querySelectorAll('input:not([value]), input[value=""]').length === 0)
        {
            submeterLogin().then((response) => {
                setUsuarioEstaLogado(true)
            })
        }
    }


    return (
        <>
            <Titulo>
                <h2>Bem-vindo</h2>
                <SubTitulo>
                Acesse a área da sua empresa
                </SubTitulo>
            </Titulo>
            <form>
                <Frame>
                    <CampoTexto camposVazios={classError} name="email" valor={usuario.email} setValor={setEmail} type="email" label="Email" placeholder="Digite seu Email" />
                    <CampoTexto camposVazios={classError} name="password" valor={usuario.password} setValor={setPassword} type="password" label="Senha" placeholder="Digite sua senha" />
                </Frame>
            </form>
            <Botao aoClicar={evento => sendData(evento)} estilo="azul" size="medium" filled>Confirmar</Botao>
            
          
        </>
    )
}

export default Login