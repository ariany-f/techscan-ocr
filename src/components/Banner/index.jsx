import styled from 'styled-components'
import styles from './Banner.module.css'
import logo from '@imagens/logo.png'
import { Link } from 'react-router-dom'

const BannerLateral = styled.div`
    height: 100vh;
    display: flex;
    width: 40vw;
    align-items: center;
    justify-content: center;
    background: var(--gradient-gradient-1, linear-gradient(180deg, var(--primaria) 0%, var(--secundaria) 100%));
`

function Banner() {
    return (
        <div className={styles.container}>
            <BannerLateral>
                <Link to="/login" className={styles.logo} >
                    <img width="350vw;" src={logo} alt="Logo"/>
                </Link>
            </BannerLateral>
        </div>
    )
}

export default Banner