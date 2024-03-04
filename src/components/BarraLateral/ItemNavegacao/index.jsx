import { Link } from "react-router-dom"
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

const ItemNavegacao = ({children, ativo = false, aoClicar = null, subItem}) => {
    return <ItemListaEstilizado onClick={aoClicar} $ativo={ativo}>
        {children}
        {subItem && subItem.length > 0 && subItem.map(item => {
            return (
                <Link key={item.id} className="link" to={item.url}>
                    <ul>
                        <SubItemEstilizado $ativo={('/'+location.pathname.split('/')[1]+'/'+location.pathname.split('/')[2]) === item.url} >
                            {item.icone}
                            {item.itemTitulo}
                        </SubItemEstilizado>
                    </ul>
                </Link>
            )
        })}
    </ItemListaEstilizado>
}

export default ItemNavegacao