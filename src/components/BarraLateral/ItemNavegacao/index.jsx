import { styled } from "styled-components"

const ItemListaEstilizado = styled.li`
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
    width: 100%;
    background-color: ${ props => props.$ativo ? 'var(--secundaria)' : 'inherit' };

    &:hover{
        color: var(--secundaria);
        background-color: var(--styled-white);
        & .icon {
            fill: 'var(--secundaria)';
            color: 'var(--secundaria)';
        }
        
    }
`

const ItemNavegacao = ({children, ativo = false, aoClicar = null}) => {
    return <ItemListaEstilizado onClick={aoClicar} $ativo={ativo}>
        {children}
    </ItemListaEstilizado>
}

export default ItemNavegacao