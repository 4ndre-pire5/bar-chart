import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import './App.css';
import BarChart from './BarChart';

function App() {

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const DATA_URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

  useEffect(() => {

    const fetchData = async() => {
      try {
        const response = await d3.json(DATA_URL);
        
        const formattedData = response.data.map(item => ({
          label: item[0],
          value: item[1]
        }));

        setChartData(formattedData);
        setLoading(false);
      } catch (err){
        console.log("Erro ao carregar os dados:", err);
        setError("Não foi possível carregar os dados do gráfico");
        setLoading(false);
      }
    };

    fetchData();
  },[]);

  if (loading) {
    return <div id='main'><h2>Carregando dados do gráfico...</h2></div>;
  }

  if (error) {
    return <div id='main'><h2>Erro: {error}</h2></div>;
  }

  if (chartData.length === 0) {
    return <div id='main'><h2>Nenhum dado disponível para o gráfico</h2></div>;
  }

  return (
    <>
      <div id='main'>
        <div id='title'>
          <h1>United States GDP</h1>
        </div>
        <div id='bar-chart'>
          <BarChart data={chartData} width={700} height={450} />
        </div>
      </div>
    </>
  );
}

export default App;
