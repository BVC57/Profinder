// components/ThreeJSChart.jsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const Bar = ({ position, height }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, height, 1]} />
      <meshStandardMaterial color="#00bcd4" />
    </mesh>
  );
};

const ThreeJSChart = ({ data }) => {
  return (
    <Canvas camera={{ position: [0, 10, 10], fov: 50 }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />

      {data.map((d, i) => (
        <Bar key={i} position={[i * 2, d.amount / 2, 0]} height={d.amount} />
      ))}
    </Canvas>
  );
};

export default ThreeJSChart;
