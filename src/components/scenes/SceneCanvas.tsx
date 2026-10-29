"use client";

import { Bounds, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function SceneCanvas({ modelUrl, title }: { modelUrl: string; title: string }) {
  return (
    <Canvas
      aria-label={`Cena tridimensional: ${title}`}
      camera={{ position: [4, 3, 6], fov: 38 }}
      dpr={[1, 1.5]}
      gl={{ powerPreference: "low-power", antialias: true }}
    >
      <color attach="background" args={["#e7dfce"]} />
      <ambientLight intensity={1.4} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} />
      <Suspense fallback={null}>
        <Bounds fit clip observe margin={1.2}>
          <Model url={modelUrl} />
        </Bounds>
      </Suspense>
      <OrbitControls enablePan={false} minDistance={2} maxDistance={14} />
    </Canvas>
  );
}
