import { Chart } from 'primereact/chart'
import Titulo from '@components/Titulo'
import styled from 'styled-components';
import { Calendar } from 'primereact/calendar'
import Botao from '@components/Botao'
import Texto from '@components/Texto'
import { useEffect, useState } from 'react';
import http from '@http'
import { MdOutlineClear } from 'react-icons/md';
import { addLocale } from 'primereact/api'

const ContainerLadoALado = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 20px;
    align-itens: center;
    flex-wrap: wrap;
    width: 80vw;
`

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

  const LimparDatas = () => {
      setStartDate('')
      setEndDate('')
  }

  function fetchData()
  {
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
              data: [((dianteira[0]) ? dianteira[0]['Acertos'] : 0), ((dianteira[0]) ? dianteira[0]['Erros'] : 0)],
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
            data: [((traseira[0]) ? traseira[0]['Acertos'] : 0), ((traseira[0]) ? traseira[0]['Erros'] : 0)],
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
              data: [((container[0]) ? container[0]['Acertos'] : 0), ((container[0]) ? container[0]['Erros'] : 0)],
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

      return (
        <>
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

                <div style={{ width: '15%', flex: 1, display: 'flex', flexDirection: 'column', alignItens: 'center', flexWrap:'wrap' }}>
                    <Texto weight={400}>Limpar Filtros</Texto>
                    <Botao estilo="cinza" size="medium" aoClicar={LimparDatas}><MdOutlineClear className="icon" /></Botao>
                </div>
            </ContainerLadoALado>
            <ContainerLadoALado>
              {dataDianteira &&
                <div>
                  <Titulo>
                    <h6>Placa Dianteira</h6>
                  </Titulo>
                  <Chart type="pie" data={dataDianteira} options={configDianteira} className="w-full md:w-10rem" />
                  <p style={{marginTop: '15px'}}>{
                    dataDianteira.datasets && dataDianteira.datasets[0] ?
                    ('Porcentagem Acerto: ' + Math.floor(parseInt(dataDianteira.datasets[0].data[0]) / ((parseInt(dataDianteira.datasets[0].data[0]) + parseInt(dataDianteira.datasets[0].data[1]))/100)) 
                    + '%')
                    : ''}
                  </p>
                </div>
              }
              {dataTraseira &&
                <div>
                  <Titulo>
                    <h6>Placa Traseira</h6>
                  </Titulo>
                  <Chart type="pie" data={dataTraseira} options={configTraseira} className="w-full md:w-10rem" />
                  <p style={{marginTop: '15px'}}>{
                    dataTraseira.datasets && dataTraseira.datasets[0] ?
                    ('Porcentagem Acerto: ' + Math.floor(parseInt(dataTraseira.datasets[0].data[0]) / ((parseInt(dataTraseira.datasets[0].data[0]) + parseInt(dataTraseira.datasets[0].data[1]))/100)) 
                    + '%')
                    : ''}
                  </p>
                </div>
              }
              {dataContainer &&
                <div>
                  <Titulo>
                    <h6>Conteiner</h6>
                  </Titulo>
                  <Chart type="pie" data={dataContainer} options={configContainer} className="w-full md:w-10rem" />
                  <p style={{marginTop: '15px'}}> {
                    dataContainer.datasets && dataContainer.datasets[0] ?
                    ('Porcentagem Acerto: ' + Math.floor(parseInt(dataContainer.datasets[0].data[0]) / ((parseInt(dataContainer.datasets[0].data[0]) + parseInt(dataContainer.datasets[0].data[1]))/100)) 
                    + '%')
                    : ''}</p>
                </div>
              }
          </ContainerLadoALado>
        </>
      )
}

export default RelatorioDashboard