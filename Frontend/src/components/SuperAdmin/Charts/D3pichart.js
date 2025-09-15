import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const D3PieChart = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data?.length) return;
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    const width = 300, height = 300, radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal(d3.schemeSet3);

    const pie = d3.pie().value(d => d.amount);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const group = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const arcs = group.selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i));

    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .text(d => `₹${d.data.amount}`);
  }, [data]);

  return <svg ref={ref}></svg>;
};

export default D3PieChart;
