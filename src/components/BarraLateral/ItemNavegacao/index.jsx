import { useEffect, useState } from "react"
import { Link, NavLink, useNavigate, useNavigation } from "react-router-dom"
import { styled } from "styled-components"

const ItemListaEstilizado = styled.li`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    color: ${ props => props.$ativo ? 'var(--styled-white)' : 'var(--white)' };
    & div {
        -moz-transition: all .3s linear;
        -o-transition: all .1s linear;
        -webkit-transition: all .3s linear;
        transition: all .3s linear;
        display: flex;
        cursor: pointer;
        color: ${ props => props.$ativo ? 'var(--styled-white)' : 'var(--white)' };
        font-family: var(--fonte-secundaria);
        align-items: center;
        padding: 13px 30px;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 20px; /* 142.857% */
        gap: 12px;
        background-color: ${ props => props.$ativo ? 'var(--secundaria)' : 'inherit' };
        &:hover{
            color: var(--secundaria);
            background-color: var(--styled-white);
            & .icon {
                fill: 'var(--secundaria)';
                color: 'var(--secundaria)';
            }
            
        }
    }
    & svg * {
        fill: var(--white);
        stroke: var(--white);
    }
`

const ListaEstilizada = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
`

const SubItemEstilizado = styled.li`
    color: ${ props => props.$ativo ? 'var(--styled-white)' : 'var(--white)' };
    line-height: 20px; /* 142.857% */
    font-size: 14px;
    padding: 13px 30px;
    font-weight: 500;
    width: 100%;
    background-color: ${ props => props.$ativo ? 'var(--primaria)' : 'inherit' };
    &:hover{
        color: var(--secundaria);
        background-color: var(--styled-white);
        & .icon {
            fill: 'var(--secundaria)';
            color: 'var(--secundaria)';
        }
    }
`

const LinkButton = styled.button`
    color: ${ props => props.$ativo ? 'var(--styled-white)' : 'var(--white)' };
    background-color: ${ props => props.$ativo ? 'var(--primaria)' : 'inherit' };
    border: none;
    cursor: pointer;
    &:hover{
        color: var(--secundaria);
        background-color: var(--styled-white);
        & .icon {
            fill: 'var(--secundaria)';
            color: 'var(--secundaria)';
        }
    }
`

const ItemNavegacao = ({children, ativo = false, aoClicar = null, subItem}) => {

    const navegar = useNavigate()
    const [endereco, setEndereco] = useState(null)

    useEffect(() => {
        //   if(!recarga.name)
        //   {
        //     setColaboradores([])
        //     setDepartamentos([])
        //     navegar(-1)
        //   }
        }, [])

    function goTo() {
        console.log(endereco)
        if(endereco)
        {
            navegar(endereco)
        }
    }

    return <ItemListaEstilizado onClick={aoClicar} $ativo={ativo}>
        {children}
        {subItem && subItem.length > 0 && subItem.map(item => {
            return (
                <LinkButton type="button" aria-label="Navegar" key={item.id} className="link" onClick={() => {setEndereco(item.url);goTo()}}>
                    <ListaEstilizada>
                        <SubItemEstilizado $ativo={('/'+location.pathname.split('/')[1]+'/'+location.pathname.split('/')[2]) === item.url} >
                            {item.icone}
                            {item.itemTitulo}
                        </SubItemEstilizado>
                    </ListaEstilizada>
                </LinkButton>
            )
        })}
    </ItemListaEstilizado>
}

export default ItemNavegacao