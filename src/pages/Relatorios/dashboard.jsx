import { Chart } from 'primereact/chart'
import Titulo from '@components/Titulo'
import styled from 'styled-components';
import { Calendar } from 'primereact/calendar'
import Botao from '@components/Botao'
import Texto from '@components/Texto'
import { useCallback, useEffect, useRef, useState } from 'react';
import DropdownItens from '@components/DropdownItens'
import http from '@http'
import { MdOutlineClear } from 'react-icons/md';
import { addLocale } from 'primereact/api'
import Loading from '@components/Loading'
import { useSessaoUsuarioContext } from "../../contexts/SessaoUsuario"
import { jsPDF } from "jspdf";
import { Chart as Chartinho } from 'chart.js/auto';
import { CategoryScale } from 'chart.js';

const ContainerLadoALado = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 20px;
    align-itens: center;
    flex-wrap: wrap;
    width: 80vw;
`
Chartinho.register(CategoryScale)

function RelatorioDashboard() {

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [primeiraVez, setPrimeiraVez] = useState(false);
  const [passagesDirection, setPassagesDirection] = useState(null)
  const [changeFields, setChangeFields] = useState(false)

  const [dianteira, setDianteira] = useState(null);
  const [traseira, setTraseira] = useState(null);
  const [container, setContainer] = useState(null);

  const [dataDianteira, setDataDianteira] = useState(null)
  const [configDianteira, setConfigDianteira] = useState({})
  const [dataTraseira, setDataTraseira] = useState(null)
  const [configTraseira, setConfigTraseira] = useState({})
  const [dataContainer, setDataContainer] = useState(null)
  const [configContainer, setConfigContainer] = useState({})
  const [loading, setLoading] = useState(false)
  const refDianteira = useRef(null)
  const refTraseira = useRef(null)
  const refContainer = useRef(null)
  const reportRef = useRef(null)
  
  const [TotalPassagensDianteira, setTotalPassagensDianteira] = useState(0)
  const [TotalPassagensTraseira, setTotalPassagensTraseira] = useState(0)
  const [TotalPassagensContainer, setTotalPassagensContainer] = useState(0)

  const [capturasOCRDianteira, setCapturasOCRDianteira] = useState(0)
  const [capturasOCRTraseira, setCapturasOCRTraseira] = useState(0)
  const [capturasOCRContainer, setCapturasOCRContainer] = useState(0)

  const [percentageDianteira, setPercentageDianteira] = useState(100);
  const [percentageTraseira, setPercentageTraseira] = useState(100);
  const [percentageContainer, setPercentageContainer] = useState(100);

            
  const availableDirections = [
    {
        name: 'Todos',
        code: null
    },
    {
        name: 'Entrada',
        code: 1,
    },
    {
        name: 'Saída',
        code: 2
    }
  ]


  addLocale('pt', {
    closeText: 'Fechar',
    prevText: 'Anterior',
    nextText: 'Próximo',
    monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
    monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun', 'Jul','Ago','Set','Out','Nov','Dez'],
    dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
    dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
    dayNamesMin: ['D','S','T','Q','Q','S','S'],
    weekHeader: 'Semana',
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: '',
    timeOnlyTitle: 'Só Horas',
    timeText: 'Tempo',
    hourText: 'Hora',
    minuteText: 'Minuto',
    secondText: 'Segundo',
    currentText: 'Data Atual',
    ampm: false,
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    allDayText : 'Todo Dia'
});

  const {
      usuario
  } = useSessaoUsuarioContext()

  const LimparDatas = () => {
      setStartDate('')
      setEndDate('')
      setChangeFields(true)
  }

  const exportPdf = useCallback(() => {

        // get size of report page
        var reportPageHeight = reportRef.current.offsetHeight;
        var reportPageWidth = reportRef.current.offsetWidth;
        var pdf = new jsPDF('l', 'pt', [reportPageWidth, reportPageHeight]);

        pdf.setTextColor(0,0,0);
        pdf.setFontSize(20);
        
        pdf.text(20, 30, 'Lachman São Bernardo')
        
        if(startDate || endDate)
        {
          pdf.setFontSize(12);
          pdf.text(20, 50, 'Período do resultado: ' + startDate.toLocaleDateString('sv-SE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
          }) + ' a ' + endDate.toLocaleDateString('sv-SE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
          }))
        }

        
        if(passagesDirection)
        {
          let dir = availableDirections.filter(obj => {
            return parseInt(obj.code) === parseInt(passagesDirection)
          })
          pdf.text(20, 70, 'Filtrado por ' + dir[0].name)
        }

        pdf.setFontSize(20);
        pdf.text(40, 100, 'Placa Dianteira')
        pdf.text(refTraseira.current.getCanvas().offsetWidth + 40, 100, 'Placa Traseira')
        pdf.text(refTraseira.current.getCanvas().offsetWidth + refDianteira.current.getCanvas().offsetWidth + 40, 100, 'Container')

        pdf.addImage(refDianteira.current.getBase64Image(), 'PNG', 0, 130);
        pdf.addImage(refTraseira.current.getBase64Image(), 'PNG', refDianteira.current.getCanvas().offsetWidth, 130);
        pdf.addImage(refContainer.current.getBase64Image(), 'PNG', refTraseira.current.getCanvas().offsetWidth + refDianteira.current.getCanvas().offsetWidth, 130);
         
        pdf.setFontSize(10);

        const TotalPassagensDianteira = dataDianteira.datasets && dataDianteira.datasets[0] ? parseInt(dataDianteira.datasets[0].data[0]) + parseInt(dataDianteira.datasets[0].data[1]) : 0
        const TotalPassagensTraseira = dataTraseira.datasets && dataTraseira.datasets[0] ? parseInt(dataTraseira.datasets[0].data[0]) + parseInt(dataTraseira.datasets[0].data[1]) : 0
        const TotalPassagensContainer = dataContainer.datasets && dataContainer.datasets[0] ? parseInt(dataContainer.datasets[0].data[0]) + parseInt(dataContainer.datasets[0].data[1]) : 0

        let capturasOCRDianteira = usuario.company === 'Lachman' ? (TotalPassagensDianteira*1) : TotalPassagensDianteira
        let capturasOCRTraseira = usuario.company === 'Lachman' ? (TotalPassagensTraseira*0.6) : TotalPassagensTraseira
        let capturasOCRContainer = usuario.company === 'Lachman' ? (TotalPassagensContainer*0.5) : TotalPassagensContainer

        const percentageDianteira = Math.floor(
          !isNaN(parseInt(dataDianteira.datasets[0].data[0]) / capturasOCRDianteira) 
          ? Math.min(100, parseInt(dataDianteira.datasets[0].data[0]) / capturasOCRDianteira*100)
          : 100);
      
        const percentageTraseira = Math.floor(
            !isNaN(parseInt(dataTraseira.datasets[0].data[0]) / capturasOCRTraseira) 
            ? Math.min(100, parseInt(dataTraseira.datasets[0].data[0]) / capturasOCRTraseira*100)
            : 100);
      
        const percentageContainer = Math.floor(
            !isNaN(parseInt(dataContainer.datasets[0].data[0]) / capturasOCRContainer) 
            ? Math.min(100, parseInt(dataContainer.datasets[0].data[0]) / capturasOCRContainer*100)
            : 100);

        if(usuario.company === 'Lachman')
        {
            capturasOCRDianteira = TotalPassagensDianteira*(percentageDianteira/100)
            capturasOCRTraseira = TotalPassagensTraseira*(percentageTraseira/100)
            capturasOCRContainer = TotalPassagensContainer*(percentageContainer/100)
        }

        pdf.text(60, 350, 'Nº Passagens ' + TotalPassagensDianteira)
        pdf.text(60, 370, 'Assertividade ' +  percentageDianteira + '%')
        pdf.text(60, 390, 'Capturas OCR ' + Math.floor(capturasOCRDianteira))
     
        
        pdf.text(refTraseira.current.getCanvas().offsetWidth + 60, 350, 'Nº Passagens ' + TotalPassagensTraseira)
        pdf.text(refTraseira.current.getCanvas().offsetWidth + 60, 370, 'Assertividade: ' + percentageTraseira + '%')
        pdf.text(refTraseira.current.getCanvas().offsetWidth + 60, 390, 'Capturas OCR ' + Math.floor(capturasOCRTraseira))
      
        
        pdf.text(refTraseira.current.getCanvas().offsetWidth + refDianteira.current.getCanvas().offsetWidth + 60, 350, 'Nº Passagens ' + TotalPassagensContainer)
        pdf.text(refTraseira.current.getCanvas().offsetWidth + refDianteira.current.getCanvas().offsetWidth + 60, 370, 'Assertividade: ' + percentageContainer + '%')
        pdf.text(refTraseira.current.getCanvas().offsetWidth + refDianteira.current.getCanvas().offsetWidth + 60, 390, 'Capturas OCR ' + Math.floor(capturasOCRContainer))
     
        // download the pdf
        pdf.save('Relatorio_Assertividade.pdf');

  }, [dataDianteira, dataTraseira, dataContainer, usuario]);

  function fetchData()
  {
      const filterData = {
          direction: (passagesDirection && passagesDirection !== "0") ? passagesDirection : null,
          dataInicial: startDate ? startDate.toLocaleDateString('sv-SE', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric'
          }) : null,
          dataFinal: endDate ? endDate.toLocaleDateString('sv-SE', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric'
          }) : null
      }

      setLoading(true)
      
      http.post('api/web/public/estatisticas', filterData)
      .then(response => {
          if(response)
          {
              setDianteira(response.filter(item => {
                return (item.Camera === 'plate' || item.Camera === 'LPR') && (item.Posicao === 'frente')
              }))
              setTraseira(response.filter(item => {
                return (item.Camera === 'plate' || item.Camera === 'LPR') && item.Posicao === 'traseira'
              }))
              setContainer(response.filter(item => {
                return item.Camera !== 'plate' && item.Camera !== 'LPR'
              }))
          }
      })
      .catch(erro => {
          console.error(erro)
      })
  }

  function configurarGraficos(dianteira, traseira, container) {
    
    let totPassagensDiant = 0
    let totPassagensTraseira = 0
    let totPassagensContainer = 0
    let capturasDianteira = 0
    let capturasTraseira = 0
    let capturasContainer = 0

    if(dianteira[0]) {
        totPassagensDiant = parseInt(dianteira[0]['Acertos']) + parseInt(dianteira[0]['Erros'])
        setTotalPassagensDianteira(totPassagensDiant)
        capturasDianteira = (totPassagensDiant-parseInt(dianteira[0]['Erros']))
        setCapturasOCRDianteira(capturasDianteira)
        setPercentageDianteira((!isNaN(parseInt(dianteira[0]['Acertos']) / totPassagensDiant) ? Math.min(100, parseInt(dianteira[0]['Acertos']) / totPassagensDiant*100): 100));

        if(usuario.company === 'Lachman')
        {

        }
    }
    if(traseira[0]) {
        totPassagensTraseira = parseInt(traseira[0]['Acertos']) + parseInt(traseira[0]['Erros'])
        setTotalPassagensTraseira(totPassagensTraseira)
        capturasTraseira = (totPassagensTraseira-parseInt(traseira[0]['Erros']))
        setCapturasOCRTraseira(capturasTraseira)
        setPercentageTraseira((!isNaN(parseInt(traseira[0]['Acertos']) / totPassagensTraseira) ? Math.min(100, parseInt(traseira[0]['Acertos']) / totPassagensTraseira*100): 100));

      if(usuario.company === 'Lachman')
      {
          capturasTraseira = (totPassagensTraseira*0.6);
          setPercentageTraseira((!isNaN(parseInt(traseira[0]['Acertos']) / capturasTraseira) ? Math.min(100, parseInt(traseira[0]['Acertos']) / capturasTraseira*100): 100));
          capturasTraseira = (totPassagensTraseira*(percentageTraseira/100));
          setCapturasOCRTraseira(capturasTraseira)
      }
    }
    if(container[0]) {
        totPassagensContainer = parseInt(container[0]['Acertos']) + parseInt(container[0]['Erros'])
        setTotalPassagensContainer(totPassagensContainer)
        capturasContainer = (totPassagensContainer - parseInt(container[0]['Erros']))
        setCapturasOCRContainer(capturasContainer)
        setPercentageContainer((!isNaN(parseInt(container[0]['Acertos']) / totPassagensContainer) ? Math.min(100, parseInt(container[0]['Acertos']) / totPassagensContainer*100) : 100));
        
        if(usuario.company === 'Lachman')
        {
          capturasContainer = (totPassagensContainer*0.5);
          setPercentageContainer((!isNaN(parseInt(container[0]['Acertos']) / capturasContainer) ? Math.min(100, parseInt(container[0]['Acertos']) / capturasContainer*100): 100));
          capturasContainer = (totPassagensContainer*(percentageTraseira/100));
          setCapturasOCRContainer(capturasContainer)
        }
    }
  }

  function montarGraficos()
  {
    setDataDianteira(
      {
          labels: [
            'Acertos',
            'Erros'
          ],
          datasets: [{
            label: '',
            data: [
                    ((capturasOCRDianteira) ? parseInt(capturasOCRDianteira) : '0'),
                    ((capturasOCRDianteira) ? parseInt(TotalPassagensDianteira-capturasOCRDianteira) : '0')
                  ],
            backgroundColor: [
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
          }]
      })
  
      setDataTraseira({
        labels: [
          'Acertos',
          'Erros'
        ],
        datasets: [{
          label: '',
          data: [
                  ((capturasOCRTraseira) ? parseInt(capturasOCRTraseira) : '0'), 
                  ((capturasOCRTraseira) ? (parseInt(TotalPassagensTraseira)-parseInt(capturasOCRTraseira)) : '0')
                ],
          backgroundColor: [
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      })
  
      setDataContainer({
          labels: [
            'Acertos',
            'Erros'
          ],
          datasets: [{
            label: '',
            data: [
                    ((capturasOCRContainer) ? parseInt(capturasOCRContainer) : '0'), 
                    ((capturasOCRContainer) ? (parseInt(TotalPassagensContainer)-parseInt(capturasOCRContainer)) : '0')
                  ],
            backgroundColor: [
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
          }]
      })

      setConfigDianteira({
        type: 'pie',
        data: dataDianteira
      });
  
      setConfigTraseira({
        type: 'pie',
        data: dataTraseira
      });
  
      setConfigContainer({
        type: 'pie',
        data: dataContainer
      });
      setPrimeiraVez(true)
  }

  useEffect(() => {

    if(changeFields)
    {
      setDianteira(null)
      setTraseira(null)
      setContainer(null)
      setChangeFields(false)
    }

    if((!dianteira) || (!traseira) || (!container))
    {
      setDataDianteira(null)
      setDataTraseira(null)
      setDataContainer(null)
      fetchData()
    }

    if(dianteira && traseira && container && (!dataDianteira) && (!dataTraseira) && (!dataContainer))
    {
      setCapturasOCRContainer(null)
      setCapturasOCRDianteira(null)
      setCapturasOCRTraseira(null)
      setPrimeiraVez(false)
      configurarGraficos(dianteira, traseira, container)
    }

    if(capturasOCRTraseira || capturasOCRDianteira || capturasOCRContainer)
    {
      if(!primeiraVez)
      {
        montarGraficos()
      }
    }
    

    if(dataDianteira && dataTraseira && dataContainer)
    {
      setLoading(false)
    }
    
}, [changeFields, startDate, endDate, passagesDirection, dianteira, traseira, container, dataDianteira, dataTraseira, dataContainer, capturasOCRDianteira, capturasOCRTraseira, capturasOCRContainer])

      return (
        <>
          <Loading opened={loading} />

          <Titulo>
              <h2 style={{ fontWeight: 500, color: '#B9B9B9' }}>ASSERTIVIDADE</h2>
          </Titulo>

          <ContainerLadoALado>
                <div style={{ width: '20%', flex: 1, display: 'flex', flexDirection: 'column', alignItens: 'center', flexWrap:'wrap' }}>
                    <Texto weight={400}>Data/Hora Inicial</Texto>
                    <Calendar locale="pt" dateFormat="dd/mm/yy" value={startDate} onChange={(e) => {setStartDate(e.value);setChangeFields(true)}} showTime hourFormat="24" />
                </div>
                <div style={{ width: '20%', flex: 1, display: 'flex', flexDirection: 'column', alignItens: 'center', flexWrap:'wrap' }}>
                    <Texto weight={400}>Data/Hora Final</Texto>
                    <Calendar locale="pt" dateFormat="dd/mm/yy" value={endDate} onChange={(e) => {setEndDate(e.value);setChangeFields(true)}} showTime hourFormat="24" />
                </div>

                <div style={{ width: '10%', flex: 1, display: 'flex', flexDirection: 'column', alignItens: 'center', flexWrap:'wrap' }}>
                    <DropdownItens setValor={(e) => {setPassagesDirection(e);setChangeFields(true)}} valor={passagesDirection} options={availableDirections} label="Selecionar Direção" name="direction" placeholder="" />
                </div>

                <div style={{ width: '5%', flex: 1, display: 'flex', flexDirection: 'column', alignItens: 'center', flexWrap:'wrap' }}>
                    <Texto weight={400}>Limpar Filtros</Texto>
                    <Botao estilo="cinza" size="medium" aoClicar={LimparDatas}><MdOutlineClear className="icon" /></Botao>
                </div>
                <div style={{ width: '5%', flex: 1, display: 'flex', flexDirection: 'column', alignItens: 'center', flexWrap:'wrap' }}>
                  <Texto weight={400}>Download PDF</Texto>
                  <Botao estilo="azul" size="medium" aoClicar={exportPdf}>Download PDF</Botao>
                </div>
            </ContainerLadoALado>

            <ContainerLadoALado ref={reportRef}>
              {dataDianteira && (Object.keys(dataDianteira).length > 0) &&
                <div>
                  <Titulo>
                    <h6>Placa Dianteira</h6>
                  </Titulo>
                  <Chart ref={refDianteira} type="pie" data={dataDianteira} options={configDianteira} className="w-full md:w-10rem" />
                  <p style={{marginTop: '15px'}}>
                    {`Nº Passagens: ${TotalPassagensDianteira}`}
                  </p>
                  <p style={{marginTop: '15px'}}>
                    { dataDianteira.datasets && dataDianteira.datasets[0] ?
                    ('Assertividade: ' + percentageDianteira + '%')
                      : ''}
                  </p>
                  <p style={{marginTop: '15px'}}>
                    {`Capturas OCR: ${Math.floor(capturasOCRDianteira)}`}
                  </p>
                </div>
              }
              {dataTraseira && (Object.keys(dataTraseira).length > 0) &&
                <div>
                  <Titulo>
                    <h6>Placa Traseira</h6>
                  </Titulo>
                  <Chart ref={refTraseira} type="pie" data={dataTraseira} options={configTraseira} className="w-full md:w-10rem" />
                  <p style={{marginTop: '15px'}}>
                    {`Nº Passagens: ${TotalPassagensTraseira}`}
                  </p>
                  <p style={{marginTop: '15px'}}>{
                    dataTraseira.datasets && dataTraseira.datasets[0] ?
                    ('Assertividade: ' + percentageTraseira + '%')
                      : ''}
                  </p>
                  <p style={{marginTop: '15px'}}>
                    {`Capturas OCR: ${Math.floor(capturasOCRTraseira)}`}
                  </p>
                </div>
              }
              {dataContainer && (Object.keys(dataContainer).length > 0) &&
                <div>
                  <Titulo>
                    <h6>Conteiner</h6>
                  </Titulo>
                  <Chart ref={refContainer} type="pie" data={dataContainer} options={configContainer} className="w-full md:w-10rem" />
                  <p style={{marginTop: '15px'}}>
                    {`Nº Passagens: ${TotalPassagensContainer}`}
                  </p>
                  <p style={{marginTop: '15px'}}> {
                    dataContainer.datasets && dataContainer.datasets[0] ?
                    ('Assertividade: ' + percentageContainer + '%')
                    : ''}
                    </p>
                  <p style={{marginTop: '15px'}}>
                    {`Capturas OCR: ${Math.floor(capturasOCRContainer)}`}
                  </p>
                </div>
              }
          </ContainerLadoALado>
        </>
      )
}

export default RelatorioDashboard