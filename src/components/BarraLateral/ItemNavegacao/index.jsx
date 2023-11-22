import { styled } from "styled-components"

const ItemListaEstilizado = styled.li`
    -moz-transition: all .1s ease;
    -o-transition: all .1s ease;
    -webkit-transition: all .1s ease;
    transition: all .2s ease;
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
    width: 100%;
    background-color: ${ props => props.$ativo ? 'var(--terciaria)' : 'inherit' };

    & .icon {
        box-sizing: initial;
        fill: ${ props => props.$ativo ? 'var(--styled-white)' : 'var(--white)' };
        color: ${ props => props.$ativo ? 'var(--styled-white)' : 'var(--white)' };
    }
    
    & .icon *{
        fill: ${ props => props.$ativo ? 'var(--styled-white)' : 'var(--white)' };
        color: ${ props => props.$ativo ? 'var(--styled-white)' : 'var(--white)' };
    }

    &:hover{
        color: var(--styled-white);
        background-color: var(--secundaria);
    }
`

const ItemNavegacao = ({children, ativo = false, aoClicar = null}) => {
    return <ItemListaEstilizado onClick={aoClicar} $ativo={ativo}>
        {children}
    </ItemListaEstilizado>
}

export default ItemNavegacao