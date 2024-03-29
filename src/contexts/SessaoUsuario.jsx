import http from '@http';
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArmazenadorToken } from '../utils';

const usuarioInicial = {
    email: '',
    password: '',
    company: ''
}

export const SessaoUsuarioContext = createContext({
    usuario: usuarioInicial,
    erros: {},
    setUsuarioEstaLogado: () => null,
    setCompany: () => null,
    setEmail: () => null,
    setPassword: () => null,
    submeterLogout: () => null,
    submeterLogin: () => null
})

export const useSessaoUsuarioContext = () => {

    return useContext(SessaoUsuarioContext);
}

export const SessaoUsuarioProvider = ({ children }) => {

    const navegar = useNavigate()

    const [usuario, setUsuario] = useState(usuarioInicial)
    const [usuarioEstaLogado, setUsuarioEstaLogado] = useState(!!ArmazenadorToken.AccessToken)

    const setEmail = (email) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                email
            }
        })
    }
    const setCompany = (company) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                company
            }
        })
    } 
    
    const setPassword = (password) => {
        setUsuario(estadoAnterior => {
            return {
                ...estadoAnterior,
                password
            }
        })
    }
   
    const submeterLogin = () => {
        usuario.gate_id = 1
        return http.post('api/web/public/users/login', usuario)
            .then((response) => {
                return response
            })
            .catch(erro => {
                console.error(erro)
            })
    }

    const submeterLogout = () => {
        setUsuarioEstaLogado(false)
        ArmazenadorToken.removerToken()
    }


    const contexto = {
        usuario,
        usuarioEstaLogado,
        setUsuarioEstaLogado,
        setEmail,
        setCompany,
        setPassword,
        submeterLogin,
        submeterLogout,
    }

    return (<SessaoUsuarioContext.Provider value={contexto}>
        {children}
    </SessaoUsuarioContext.Provider>)
}