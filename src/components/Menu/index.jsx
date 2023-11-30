import { styled } from 'styled-components'
import ItemNavegacao from "@components/BarraLateral/ItemNavegacao"
import { AiOutlineHome } from "react-icons/ai"
import { PiUserCircleThin } from "react-icons/pi"
import { CiSettings, CiBellOn } from 'react-icons/ci'
import { FaUserCircle } from 'react-icons/fa'
import "./Menu.css"
import { Link, useLocation } from "react-router-dom"
import logo from '/imagens/logo.png'
import { useSessaoUsuarioContext } from "../../contexts/SessaoUsuario"
import { ArmazenadorToken } from './../../utils';

const ListaEstilizada = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`
const BarraLateralEstilizada = styled.aside`
    transform: ${ props => props.$open ? 'translateX(0)' : 'translateX(-100%)'};
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    height: 100vh;
    position: absolute;
    z-index: 9;
    top: 0;
    left: 0;
    transition: transform 0.3s ease-in-out;
    background: var(--gradient-gradient-1, linear-gradient(180deg, var(--primaria) 0%, var(--secundaria) 100%));
    & nav {
        padding: 0px;
        width: 100%;
    }
      
    @media only screen and (max-width: 768px) {
        width: 100%;
    }
`
const NavTitulo = styled.p`
    color: var(--styled-white);
    display: flex;
    padding: 20px 25px;
    align-items: center;
    gap: 10px;
    align-self: stretch;
    font-weight: 600;
    background-color: var(--terciaria)
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

const Menu = ({open}) => {
    
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
        <BarraLateralEstilizada className="mobile" $open={open}>
             <Logo width="250vw" src={logo} alt="Logo OCR" />
            <nav>
                <NavTitulo><FaUserCircle size={35} className="icon"/> {ArmazenadorToken.UserNome}</NavTitulo>
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
  export default Menu;
