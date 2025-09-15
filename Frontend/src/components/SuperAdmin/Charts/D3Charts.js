// components/D3Charts.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const D3Charts = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data?.length) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // clear

    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const x = d3
      .scaleBand()
      .domain(data.map((d, i) => i))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.amount)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const xAxis = (g) =>
      g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat((d, i) => `U${i + 1}`));

    const yAxis = (g) =>
      g.attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));

    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);

    svg
      .append("g")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d, i) => x(i))
      .attr("y", (d) => y(d.amount))
      .attr("height", (d) => y(0) - y(d.amount))
      .attr("width", x.bandwidth())
      .attr("fill", "#667eea");
  }, [data]);

  return (
    <svg ref={ref} width={500} height={300}>
      {/* D3 chart renders here */}
    </svg>
  );
};

export default D3Charts;
