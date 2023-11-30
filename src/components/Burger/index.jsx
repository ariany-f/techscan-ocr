import styled from 'styled-components'

const StyledBurger = styled.button`
    position: absolute;
    top: 3%;
    left: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 2rem;
    height: 2rem;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 10;
    
    &:focus {
        outline: none;
    }
  
    div {
        width: 2rem;
        height: 0.25rem;
        background: #B9B9B9;
        border-radius: 10px;
        transition: all 0.3s linear;
        position: relative;;
        transform-origin: 1px;
    }
    :first-child {
        transform: ${ props => props.$open ? 'rotate(45deg)' : 'rotate(0)'};
    }

    :nth-child(2) {
        opacity: ${ props => props.$open ? '0' : '1'};
        transform: ${ props => props.$open ? 'translateX(20px)' : 'translateX(0)'};
    }

    :nth-child(3) {
        transform: ${ props => props.$open ? 'rotate(-45deg)' : 'rotate(0)'};
    }
    
    @media only screen and (min-width: 769px) {
        /* For mobile phones: */
        button {
            display: none!important;
        }
        div {
            display: none!important;
        }
    } 
`

const Burger = ({ open, setOpen }) => {
    return (
      <StyledBurger $open={open} onClick={() => setOpen(!open)}>
        <div />
        <div />
        <div />
      </StyledBurger>
    )
  }
  
  export default Burger;