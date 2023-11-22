import http from '@http'
import { useEffect, useState } from "react"
import DataTablePassagens from '../../components/DataTablePassagens'

function Dashboard(){

    const [passagens, setPassagens] = useState([])

    function fetchPassages()
    {
        http.get('api/web/public/passagens')
        .then(response => {
            setPassagens(response)
        })
        .catch(erro => {
            console.error(erro)
        })
    }

    useEffect(() => {

        fetchPassages()

        const interval = setInterval(() => {
            fetchPassages()
          }, 15000);
          return () => clearInterval(interval);
    }, [])

    return (
        <>
            <DataTablePassagens passagens={passagens} />
        </>
    )
}

export default Dashboard