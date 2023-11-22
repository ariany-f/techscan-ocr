import { styled } from "styled-components"
import ItemNavegacao from "./ItemNavegacao"
import { AiOutlineHome } from "react-icons/ai"
import { PiUserCircleThin } from "react-icons/pi"
import { CiSettings, CiBellOn } from 'react-icons/ci'
import "./BarraLateral.css"
import { Link, useLocation } from "react-router-dom"
import logo from '/imagens/logo.png'
import { useSessaoUsuarioContext } from "../../contexts/SessaoUsuario"

const ListaEstilizada = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`
const BarraLateralEstilizada = styled.aside`
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    flex-shrink: 0;
    background: var(--gradient-gradient-1, linear-gradient(180deg, var(--primaria) 0%, var(--secundaria) 100%));
`
const NavTitulo = styled.p`
    color: var(--white);
    opacity: 0.5;
    display: flex;
    padding: 10px 30px;
    align-items: center;
    gap: 10px;
    align-self: stretch;
    font-weight: 300;
`

const ItemFimDePagina = styled.div`
    position: absolute;
    bottom: 0;
    & li {
        font-size: 20px;
    }
`

const Logo = styled.img`
    padding: 15px 30px;
`

function BarraLateral() {
    
    const {
        submeterLogout
    } = useSessaoUsuarioContext()

    const location = useLocation();

    const itensMenu = [
        {
            "id": 1,
            "url": "/",
            "pageTitulo": "INÍCIO",
            "icone": <AiOutlineHome size={20} className="icon" />,
            "itemTitulo": "INÍCIO"
        },
        {
            "id": 2,
            "url": "/usuarios",
            "pageTitulo": "USUÁRIOS",
            "icone": <PiUserCircleThin titulo="Extrato" size={20} className="icon" />,
            "itemTitulo": "USUÁRIOS"
        },
        {
            "id": 3,
            "url": "/relatorios",
            "pageTitulo": "RELATÓRIOS",
            "icone": <CiBellOn size={20} className="icon" />,
            "itemTitulo": "RELATÓRIOS"
        },
        {
            "id": 4,
            "url": "/configuracoes",
            "pageTitulo": "CONFIGURAÇÕES",
            "icone": <CiSettings size={20} className="icon" />,
            "itemTitulo": "CONFIGURAÇÕES"
        }
    ];

    return (
        <BarraLateralEstilizada>
             <Logo width="250vw" src={logo} alt="Logo OCR" />
            <nav>
                <NavTitulo>HOME</NavTitulo>
                <ListaEstilizada>
                    {itensMenu.map((item) => {
                        return (
                            <Link key={item.id} className="link" to={item.url}>
                                <ItemNavegacao ativo={(('/'+location.pathname.split('/')[1]) === item.url)}>
                                    {item.icone}
                                    {item.itemTitulo}
                                </ItemNavegacao>
                            </Link>
                        )
                    })}
                </ListaEstilizada>
            </nav>
            <ItemFimDePagina>
                <ItemNavegacao aoClicar={() => submeterLogout()}>
                    Sair
                </ItemNavegacao>
            </ItemFimDePagina>
        </BarraLateralEstilizada>
    )
}

export default BarraLateral