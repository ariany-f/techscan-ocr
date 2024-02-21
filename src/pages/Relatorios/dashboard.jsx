import { Chart } from 'primereact/chart'
import Titulo from '@components/Titulo'
import styled from 'styled-components';
import { Calendar } from 'primereact/calendar'
import Botao from '@components/Botao'
import Texto from '@components/Texto'
import { useCallback, useEffect, useRef, useState } from 'react';
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

  const [dianteira, setDianteira] = useState([]);
  const [traseira, setTraseira] = useState([]);
  const [container, setContainer] = useState([]);

  const [dataDianteira, setDataDianteira] = useState({})
  const [configDianteira, setConfigDianteira] = useState({})
  const [dataTraseira, setDataTraseira] = useState({})
  const [configTraseira, setConfigTraseira] = useState({})
  const [dataContainer, setDataContainer] = useState({})
  const [configContainer, setConfigContainer] = useState({})
  const [loading, setLoading] = useState(false)
  const refDianteira = useRef(null)
  const refTraseira = useRef(null)
  const refContainer = useRef(null)
  const reportRef = useRef(null)

  const {
      usuario
  } = useSessaoUsuarioContext()

  const LimparDatas = () => {
      setStartDate('')
      setEndDate('')
  }

  const exportPdf = useCallback(() => {

        // get size of report page
        var reportPageHeight = reportRef.current.offsetHeight;
        var reportPageWidth = reportRef.current.offsetWidth;
        var pdf = new jsPDF('l', 'pt', [reportPageWidth, reportPageHeight]);

        pdf.setTextColor(0,0,0);
        pdf.setFontSize(20);
        pdf.text(80, 30, 'Placa Dianteira')
        pdf.text(refTraseira.current.getCanvas().offsetWidth + 80, 30, 'Placa Traseira')
        pdf.text(refTraseira.current.getCanvas().offsetWidth + refDianteira.current.getCanvas().offsetWidth + 80, 30, 'Container')
        pdf.addImage(refTraseira.current.getBase64Image(), 'PNG', 0, 80);
        pdf.addImage(refDianteira.current.getBase64Image(), 'PNG', refTraseira.current.getCanvas().offsetWidth, 80);
        pdf.addImage(refContainer.current.getBase64Image(), 'PNG', refTraseira.current.getCanvas().offsetWidth + refDianteira.current.getCanvas().offsetWidth, 80);
         
        // download the pdf
        pdf.save('filename.pdf');
  }, []);

  function fetchData()
  {
      setLoading(true)
      const filterData = {

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

      http.post('api/web/public/estatisticas', filterData)
      .then(response => {
          if(response)
          {
              setDianteira(response.filter(item =>
                (item.Camera === 'plate' || item.Camera === 'LPR') && item.Posicao === 'frente'
              ))
              setTraseira(response.filter(item =>
                (item.Camera === 'plate' || item.Camera === 'LPR') && item.Posicao === 'traseira'
              ))
              setContainer(response.filter(item =>
                item.Camera !== 'plate' && item.Camera !== 'LPR'
              ))
              setPrimeiraVez(true)
          }
      })
      .catch(erro => {
          console.error(erro)
      })
  }

  useEffect(() => {
    
    fetchData()
    setTimeout(() => {
        setDataDianteira(
        {
            labels: [
              'Acertos',
              'Erros'
            ],
            datasets: [{
              label: '',
              data: [((dianteira[0]) ? (usuario.company === 'LACHMAN' ? ((dianteira[0]['Acertos']/100)*100) : dianteira[0]['Acertos']) : '0'), ((dianteira[0]) ? (usuario.company === 'LACHMAN' ? ((dianteira[0]['Erros']/100)*100) : dianteira[0]['Erros']) : '0')],
              backgroundColor: [
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
              ],
              hoverOffset: 4
            }]
        });

        setDataTraseira({
          labels: [
            'Acertos',
            'Erros'
          ],
          datasets: [{
            label: '',
            data: [((traseira[0]) ? (usuario.company === 'LACHMAN' ? ((traseira[0]['Acertos']/100)*60) : traseira[0]['Acertos']) : '0'), ((traseira[0]) ? (usuario.company === 'LACHMAN' ? ((traseira[0]['Erros']/100)*60) : traseira[0]['Erros']) : '0')],
            backgroundColor: [
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
          }]
        });

        setDataContainer({
            labels: [
              'Acertos',
              'Erros'
            ],
            datasets: [{
              label: '',
              data: [((container[0]) ? (usuario.company === 'LACHMAN' ? ((container[0]['Acertos']/100)*50) : container[0]['Acertos']) : '0'), ((container[0]) ? (usuario.company === 'LACHMAN' ? ((container[0]['Erros']/100)*50) : container[0]['Erros']) : '0')],
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
        
        setLoading(false)

        if(!primeiraVez)
        {
          LimparDatas()
        }
    }, 3000);
    

}, [startDate, endDate])
        
      addLocale('pt', {
          closeText: 'Fechar',
          prevText: 'Anterior',
          nextText: 'Próximo',
          currentText: 'Começo',
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

      const TotalPassagensDianteira = dataDianteira.datasets && dataDianteira.datasets[0] ? parseInt(dataDianteira.datasets[0].data[0]) + parseInt(dataDianteira.datasets[0].data[1]) : 0
      const TotalPassagensTraseira = dataTraseira.datasets && dataTraseira.datasets[0] ? parseInt(dataTraseira.datasets[0].data[0]) + parseInt(dataTraseira.datasets[0].data[1]) : 0
      const TotalPassagensContainer = dataContainer.datasets && dataContainer.datasets[0] ? parseInt(dataContainer.datasets[0].data[0]) + parseInt(dataContainer.datasets[0].data[1]) : 0

      const capturasOCRDianteira = usuario.company === 'Lachman' ? (TotalPassagensDianteira/100)*100 : TotalPassagensDianteira
      const capturasOCRTraseira = usuario.company === 'Lachman' ? Math.floor((TotalPassagensTraseira/100)*60) : TotalPassagensTraseira
      const capturasOCRContainer = usuario.company === 'Lachman' ? Math.floor((TotalPassagensContainer/100)*50) : TotalPassagensContainer

      return (
        <>
          <Loading opened={loading} />
          <Titulo>
              <h2 style={{ fontWeight: 500, color: '#B9B9B9' }}>ESTATÍSTICAS</h2>
          </Titulo>
          <ContainerLadoALado>
                <div style={{ width: '20%', flex: 1, display: 'flex', flexDirection: 'column', alignItens: 'center', flexWrap:'wrap' }}>
                    <Texto weight={400}>Data/Hora Inicial</Texto>
                    <Calendar locale="pt" dateFormat="dd/mm/yy" value={startDate} onChange={(e) => setStartDate(e.value)} showTime hourFormat="24" />
                </div>
                <div style={{ width: '20%', flex: 1, display: 'flex', flexDirection: 'column', alignItens: 'center', flexWrap:'wrap' }}>
                    <Texto weight={400}>Data/Hora Final</Texto>
                    <Calendar locale="pt" dateFormat="dd/mm/yy" value={endDate} onChange={(e) => setEndDate(e.value)} showTime hourFormat="24" />
                </div>

                <div style={{ width: '10%', flex: 1, display: 'flex', flexDirection: 'column', alignItens: 'center', flexWrap:'wrap' }}>
                    <Texto weight={400}>Limpar Filtros</Texto>
                    <Botao estilo="cinza" size="medium" aoClicar={LimparDatas}><MdOutlineClear className="icon" /></Botao>
                </div>
                <div style={{ width: '10%', flex: 1, display: 'flex', flexDirection: 'column', alignItens: 'center', flexWrap:'wrap' }}>
                  <Botao estilo="azul" size="medium" aoClicar={exportPdf}>Download PDF</Botao>
                </div>
            </ContainerLadoALado>
            <ContainerLadoALado ref={reportRef}>
			      {(Object.keys(dataDianteira).length > 0) &&
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
                   ('Assertividade: ' + Math.floor(
                                      !isNaN(parseInt(dataDianteira.datasets[0].data[0]) / capturasOCRDianteira) 
                                      ? parseInt(dataDianteira.datasets[0].data[0]) / capturasOCRDianteira 
                                      : 100)
                    + '%')
                    : ''}
                </p>
                <p style={{marginTop: '15px'}}>
                  {`Capturas OCR: ${capturasOCRDianteira}`}
                </p>
              </div>
			      }
			
			      {(Object.keys(dataTraseira).length > 0) &&
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
                  ('Assertividade: ' + Math.floor(
                                      !isNaN(parseInt(dataTraseira.datasets[0].data[0]) / capturasOCRTraseira) 
                                      ? parseInt(dataTraseira.datasets[0].data[0]) / capturasOCRTraseira 
                                      : 100)
                    + '%')
                    : ''}
                 </p>
                 <p style={{marginTop: '15px'}}>
                  {`Capturas OCR: ${capturasOCRTraseira}`}
                </p>
              </div>
			        }
			      {(Object.keys(dataContainer).length > 0) &&
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
                  ('Assertividade: ' + Math.floor(
                                        !isNaN(parseInt(dataContainer.datasets[0].data[0]) / capturasOCRContainer) 
                                        ? parseInt(dataContainer.datasets[0].data[0]) / capturasOCRContainer 
                                        : 100)
                  + '%')
                  : ''}
                  </p>
                <p style={{marginTop: '15px'}}>
                  {`Capturas OCR: ${capturasOCRContainer}`}
                </p>
              </div>
			        }
          </ContainerLadoALado>
        </>
      )
}

export default RelatorioDashboard