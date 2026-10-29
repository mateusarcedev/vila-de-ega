"use client";

import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { MathUtils, Vector3 } from "three";
import type { Camera, Group, Object3D } from "three";
import type { HistoricalEvent } from "@/types/history";

interface Props {
  events: HistoricalEvent[];
  progress: MutableRefObject<number>;
  onSelect: (index: number) => void;
  reducedMotion: boolean;
}

const modelUrl = "/scenes/models/tefe-timeline-display.glb";

function DisplayModel({ events, progress, onSelect, reducedMotion }: Props) {
  const root = useRef<Group>(null);
  const { scene } = useGLTF(modelUrl);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    const anchors = new Map<string, Object3D>();
    clone.traverse((object) => {
      if (object.name.startsWith("ANCHOR_")) anchors.set(object.name.slice("ANCHOR_".length), object);
      const marker = object.name.match(/^MARKER_(\d{2})_/);
      if (marker && "material" in object && object.material) {
        const target = object as Object3D & { material?: unknown };
        if (Array.isArray(target.material)) {
          target.material = target.material.map((material) => (material as { clone: () => unknown }).clone());
        } else if (typeof target.material === "object" && target.material !== null && "clone" in target.material) {
          target.material = (target.material as { clone: () => unknown }).clone();
        }
      }
    });
    return { scene: clone, anchors };
  }, [scene]);

  const camera = useThree((state) => state.camera);
  const cameraRef = useRef<Camera | null>(null);
  const lookTarget = useMemo(() => new Vector3(0, .82, 0), []);
  const desiredPosition = useMemo(() => new Vector3(), []);
  const desiredTarget = useMemo(() => new Vector3(), []);
  const focusIndex = useRef(-1);

  useEffect(() => { cameraRef.current = camera; }, [camera]);

  useFrame((_, delta) => {
    const activeCamera = cameraRef.current;
    if (!activeCamera) return;
    const amount = MathUtils.clamp(progress.current, 0, 1) * (events.length - 1);
    const left = Math.min(events.length - 1, Math.floor(amount));
    const right = Math.min(events.length - 1, left + 1);
    const blend = amount - left;
    const leftAnchor = model.anchors.get(events[left]?.id);
    const rightAnchor = model.anchors.get(events[right]?.id);
    const leftX = leftAnchor?.position.x ?? -4.2 + left * 1.4;
    const rightX = rightAnchor?.position.x ?? -4.2 + right * 1.4;
    const centerX = MathUtils.lerp(leftX, rightX, blend);
    const selected = Math.round(amount);

    desiredPosition.set(centerX - .16, 2.05, 3.0);
    desiredTarget.set(centerX, .77, .03);
    const speed = reducedMotion ? 1 : 7.5;
    activeCamera.position.x = reducedMotion ? desiredPosition.x : MathUtils.damp(activeCamera.position.x, desiredPosition.x, speed, delta);
    activeCamera.position.y = reducedMotion ? desiredPosition.y : MathUtils.damp(activeCamera.position.y, desiredPosition.y, speed, delta);
    activeCamera.position.z = reducedMotion ? desiredPosition.z : MathUtils.damp(activeCamera.position.z, desiredPosition.z, speed, delta);
    lookTarget.lerp(desiredTarget, reducedMotion ? 1 : 1 - Math.exp(-8 * delta));
    activeCamera.lookAt(lookTarget);

    if (selected !== focusIndex.current) {
      focusIndex.current = selected;
      model.scene.traverse((object) => {
        const match = object.name.match(/^MARKER_(\d{2})_/);
        if (!match || !("material" in object) || !object.material) return;
        const materialList = Array.isArray(object.material) ? object.material : [object.material];
        const isSelected = Number(match[1]) === selected + 1;
        materialList.forEach((material) => {
          const pbr = material as { emissive?: { set: (color: string) => void }; emissiveIntensity?: number };
          if (!pbr.emissive) return;
          pbr.emissive.set(isSelected ? "#7c5626" : "#000000");
          if (pbr.emissiveIntensity !== undefined) pbr.emissiveIntensity = isSelected ? .45 : 0;
        });
      });
    }
  });

  function selectMarker(event: { object: Object3D; stopPropagation: () => void }) {
    event.stopPropagation();
    let current: Object3D | null = event.object;
    while (current) {
      const match = current.name.match(/^MARKER_(\d{2})_/);
      if (match) {
        onSelect(Math.max(0, Math.min(events.length - 1, Number(match[1]) - 1)));
        return;
      }
      current = current.parent;
    }
  }

  return (
    <group ref={root} onPointerDown={selectMarker}>
      <primitive object={model.scene} />
    </group>
  );
}

export default function SpatialTimelineCanvas(props: Props) {
  return (
    <Canvas
      aria-label="Estrutura curatorial 3D com sete marcos históricos navegáveis"
      camera={{ position: [-4.2, 2.05, 3], fov: 34, near: .05, far: 40 }}
      dpr={[1, 1.35]}
      frameloop="always"
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      onCreated={({ gl, camera }) => {
        gl.setClearColor(0x000000, 0);
        camera.lookAt(-4.2, .77, .03);
        gl.domElement.setAttribute("aria-hidden", "true");
      }}
    >
      <ambientLight intensity={.56} />
      <hemisphereLight args={["#f6e8cc", "#193b34", .68]} />
      <directionalLight position={[1.5, 5, 4]} intensity={1.45} color="#ffe6bb" />
      <directionalLight position={[-4, 2.2, -2]} intensity={.52} color="#9bb8b0" />
      <DisplayModel {...props} />
    </Canvas>
  );
}
