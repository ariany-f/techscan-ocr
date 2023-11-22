import EstilosGlobais from '@components/GlobalStyles';
import { Outlet } from "react-router-dom";
import MainSection from "@components/MainSection"
import Banner from "@components/Banner"
import MainContainer from "@components/MainContainer"
import Container from "@components/Container"

function Publico() {

    return (
        <>
            <EstilosGlobais />
            <MainSection>
                <Banner />
                <Container>
                    <MainContainer>
                        <Outlet />
                    </MainContainer>
                </Container>
            </MainSection>
        </>
    )
}

export default Publico