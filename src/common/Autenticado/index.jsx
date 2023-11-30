import EstilosGlobais from '@components/GlobalStyles'
import BarraLateral from '@components/BarraLateral'
import MainSection from '@components/MainSection'
import MainContainer from '@components/MainContainer'
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useSessaoUsuarioContext } from "../../contexts/SessaoUsuario"
import Burger from '@components/Burger'
import Menu from '@components/Menu'
import { useState } from 'react'

function Autenticado() {
    
    const {
        usuarioEstaLogado
    } = useSessaoUsuarioContext()

    const [open, setOpen] = useState(false);
    
    return (
        <>
            {usuarioEstaLogado ?
                <>
                    <EstilosGlobais />
                    <div>
                        <Burger open={open} setOpen={setOpen} />
                        <Menu open={open} setOpen={setOpen} />
                    </div>
                    <MainSection>
                        <BarraLateral />
                        <MainContainer align="flex-start" padding="2.5vh 1vw">
                            <Outlet />
                        </MainContainer>
                    </MainSection>
                </>
            :<Navigate to="/login" replace={true}/>}
        </>
    )
}

export default Autenticado