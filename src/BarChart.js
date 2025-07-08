import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3'; // Importa todas as funcionalidades do D3.js

const BarChart = ({ data, width = 600, height = 400 }) => {
    const svgRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        // Limpa o SVG antes de desenhar, útil para atualizações
        svg.selectAll('*').remove();

        const margin = { top: 20, right: 20, bottom: 60, left: 80 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        const xScale = d3.scaleBand()
            .domain(data.map(d => d.label)) // Rótulos dos dados para o eixo X
            .range([0, innerWidth])

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value) * 1.1]) // Valores máximos para o eixo Y
            .range([innerHeight, 0]); // Inverte para que o 0 seja na parte inferior

        // Desenha as barras
        g.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d.label))
            .attr('y', d => yScale(d.value))
            .attr('width', xScale.bandwidth())
            .attr('height', d => innerHeight - yScale(d.value))
            .attr('fill', 'steelblue')
            .attr('data-date', d => d.label)
            .attr('data-gdp', d => d.value);

        // Desenha o eixo X
        const minYear = 1950;
        const maxYear = d3.max(data, d => parseInt(d.label.substring(0, 4)));
        const actualMaxYear = Math.ceil(maxYear / 10) * 10;

        const tickDates = [];
        for (let year = minYear; year <= actualMaxYear; year += 5) {
            const dateStringForYear = data.find(d => d.label.startsWith(String(year)) && d.label.endsWith("-01-01"));
            if (dateStringForYear) {
                tickDates.push(dateStringForYear.label);
            } else if (year >= minYear && year <= maxYear) { // Caso não exista exato, mas o ano esteja no range
                // Se o ano específico "YYYY-01-01" não existe, mas o ano "YYYY" está no nosso intervalo,
                // podemos tentar encontrar a primeira data do ano.
                const anyDateInYear = data.find(d => d.label.startsWith(String(year)));
                if (anyDateInYear) {
                    tickDates.push(anyDateInYear.label);
                }
            }
        }

        g.append('g')
            .attr('id', 'x-axis')
            .attr('transform', `translate(0, ${innerHeight})`) // Posiciona o eixo na parte inferior
            .call(d3.axisBottom(xScale)
                .tickValues(tickDates) 
                .tickFormat(d => String(d).substring(0, 4)));


        // Desenha o eixo Y
        g.append('g')
            .attr('id', 'y-axis')
            .call(d3.axisLeft(yScale));


    }, [data, width, height]); // Dependências do useEffect: o efeito será re-executado se 'data', 'width' ou 'height' mudarem

    return (
        <svg ref={svgRef}></svg>
    );
};

export default BarChart;