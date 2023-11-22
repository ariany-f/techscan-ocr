import http from '@http'
import { useEffect, useState } from "react"
import { JsonToExcel } from "react-json-to-excel"
import DataTablePassagens from '../../components/DataTablePassagens'
import { MdOutlineFileDownload } from 'react-icons/md'

function Relatorios(){

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

    const icone = <MdOutlineFileDownload className="icon" size={20} />
    return (
        <>
            <JsonToExcel
                title={icone}
                data={passagens}
                fileName={`relatorio-ocr-${new Date()}`}
                btnClassName="button neutro filled medium 300"
            />
            <DataTablePassagens passagens={passagens} />
        </>
    )
}

export default Relatorios