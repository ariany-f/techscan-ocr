import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SessaoUsuarioProvider } from "./contexts/SessaoUsuario"
import Autenticado from '@common/Autenticado'
import Publico from '@common/Publico'
import Login from '@pages/Login'
import Dashboard from '@pages/Dashboard'
import Usuarios from '@pages/Usuarios'
import Configuracoes from '@pages/Configuracoes'
import Relatorios from '@pages/Relatorios'
import NaoEncontrada from '@pages/NaoEncontrada'

function AppRouter() {
  

  return (
    <BrowserRouter>
        <SessaoUsuarioProvider>
            <Routes>
                <Route path="/login" element={<Publico/>}>
                    <Route index element={<Login />} />
                </Route>

                <Route path="/" element={<Autenticado/>}>
                    <Route index element={<Dashboard />} />
                    <Route path="usuarios" element={<Usuarios />} />
                    <Route path="relatorios" element={<Relatorios />} />
                    <Route path="configuracoes" element={<Configuracoes />} />
                </Route>
                <Route path="*" element={<NaoEncontrada />}></Route>
            </Routes>
        </SessaoUsuarioProvider>
    </BrowserRouter>
  )
}

export default AppRouter