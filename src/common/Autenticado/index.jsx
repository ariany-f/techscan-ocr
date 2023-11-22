import EstilosGlobais from '@components/GlobalStyles'
import BarraLateral from '@components/BarraLateral'
import MainSection from '@components/MainSection'
import MainContainer from '@components/MainContainer'
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useSessaoUsuarioContext } from "../../contexts/SessaoUsuario"

function Autenticado() {
    
    const {
        usuarioEstaLogado
    } = useSessaoUsuarioContext()
    
    return (
        <>
            {usuarioEstaLogado ?
                <>
                    <EstilosGlobais />
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