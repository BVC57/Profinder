import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const D3LineChart = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data?.length) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };

    const parseDate = d => new Date(d.createdAt);
    const formattedData = data.map(d => ({
      ...d,
      date: parseDate(d)
    }));

    const x = d3.scaleTime()
      .domain(d3.extent(formattedData, d => d.date))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(formattedData, d => d.amount)])
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.amount));

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg.append("path")
      .datum(formattedData)
      .attr("fill", "none")
      .attr("stroke", "#4caf50")
      .attr("stroke-width", 2)
      .attr("d", line);
  }, [data]);

  return <svg ref={ref} width={500} height={300}></svg>;
};

export default D3LineChart;
