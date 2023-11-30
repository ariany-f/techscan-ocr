import styled from 'styled-components'
import styles from './MainContainer.module.css'

const DivContainer = styled.div`
    justify-content: ${ props => props.$align ? props.$align : 'center' };
    align-items: ${ props => props.$align == 'center' ? props.$align : 'initial' };
    text-align: ${ props => props.$align ? props.$align : 'center' };
    padding: ${ props => props.$padding ? props.$padding : '5vw 10vw' };
    height: 100vh;
    overflow-y: scroll;
`

function MainContainer({ children, align, padding = '5vw' }) {
    return (
        <DivContainer $align={align} $padding={padding} className={styles.main}>
            {children}
        </DivContainer>
    )
}

export default MainContainer