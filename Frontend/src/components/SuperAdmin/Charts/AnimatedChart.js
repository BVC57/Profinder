import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const AnimatedBar = ({ position, height }) => {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[1, height, 1]} />
      <meshStandardMaterial color="#ff9800" />
    </mesh>
  );
};

const ThreeJSChart = ({ data }) => {
  return (
    <Canvas camera={{ position: [0, 10, 15], fov: 60 }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      {data.map((d, i) => (
        <AnimatedBar key={i} position={[i * 2, d.amount / 2, 0]} height={d.amount} />
      ))}
    </Canvas>
  );
};

export default ThreeJSChart;
