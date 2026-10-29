"use client";

import { useAnimations, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type { KeyboardEvent, MutableRefObject, PointerEvent, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LoopOnce, MathUtils, Vector3 } from "three";
import type { Camera, Group, Object3D } from "three";
import styles from "./OpeningBookExperience.module.css";

interface Props {
  modelUrl: string;
  opening: boolean;
  opened: boolean;
  closing: boolean;
  paused: boolean;
  visible: boolean;
  scrollRoot: RefObject<HTMLElement | null>;
  onReady: () => void;
  onOpened: () => void;
  onClosed: () => void;
  onProgress: (value: number) => void;
  onUnavailable: () => void;
}

interface PointerAim { x: number; y: number; }

function AnimatedBook({
  modelUrl, opening, opened, closing, paused, visible, scrollRoot, pointerAim, onReady, onOpened, onClosed, onProgress, onUnavailable,
}: Props & { pointerAim: MutableRefObject<PointerAim> }) {
  const root = useRef<Group>(null);
  const cameraRef = useRef<Camera | null>(null);
  const { scene, animations } = useGLTF(modelUrl);
  const { actions, mixer } = useAnimations(animations, root);
  const modelScene = useMemo(() => {
    const clone = scene.clone(true);
    const nonModelNodes: Object3D[] = [];
    clone.traverse((object) => {
      if (object.type === "Camera" || object.type.endsWith("Light")) nonModelNodes.push(object);
    });
    nonModelNodes.forEach((object) => object.parent?.remove(object));
    return clone;
  }, [scene]);
  const { camera, invalidate } = useThree();
  const scrollProgress = useRef(0);
  const openingProgress = useRef(opened ? 1 : 0);
  const focus = useMemo(() => new Vector3(0.18, 0, 0.02), []);
  const desiredCamera = useMemo(() => new Vector3(), []);
  const scrollStart = useMemo(() => new Vector3(0.52, 0.58, 0.82), []);
  const scrollEnd = useMemo(() => new Vector3(0.1, 1.0, 1.45), []);
  const closedFocus = useMemo(() => new Vector3(0.18, 0, 0.02), []);
  const openFocus = useMemo(() => new Vector3(0, 0, 0.02), []);
  const cameraNear = useMemo(() => new Vector3(0.47, 0.55, 0.72), []);
  const cameraReveal = useMemo(() => new Vector3(0.50, 0.98, 1.95), []);
  const cameraOpen = useMemo(() => new Vector3(0.50, 0.84, 1.55), []);
  const cameraEnd = useMemo(() => new Vector3(0.30, 1.0, 1.82), []);

  useEffect(() => {
    cameraRef.current = camera;
    return () => { cameraRef.current = null; };
  }, [camera]);

  useEffect(() => {
    onReady();
  }, [onReady]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const triggerElement = scrollRoot.current;
    if (!triggerElement || opening || closing || opened) return;

    const trigger = ScrollTrigger.create({
      trigger: triggerElement,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
        invalidate();
      },
    });

    return () => trigger.kill();
  }, [closing, invalidate, opened, opening, scrollRoot]);

  useEffect(() => {
    const requiredActions = [
      "HERO_Spine", "RIG_CoverHinge", "RIG_PageTurn_01", "HERO_Page_01",
      "RIG_PageTurn_02", "HERO_Page_02", "RIG_PageTurn_03", "HERO_Page_03",
    ];
    if (requiredActions.some((name) => !actions[name])) {
      onUnavailable();
      return;
    }

    const allActions = requiredActions.map((name) => actions[name]).filter((action) => action !== null);
    for (const action of allActions) {
      action.reset();
      action.setLoop(LoopOnce, 1);
      action.clampWhenFinished = true;
      action.play();
      action.paused = true;
      action.time = action.getClip().duration * openingProgress.current;
    }
    mixer.update(0);

    const activeCamera = cameraRef.current;
    if (!activeCamera) {
      onUnavailable();
      return;
    }

    const setPose = (value: number) => {
      const next = MathUtils.clamp(value, 0, 1);
      openingProgress.current = next;
      allActions.forEach((action) => { action.time = action.getClip().duration * next; });
      mixer.update(0);

      const approach = MathUtils.smoothstep(Math.min(next / 0.09, 1), 0, 1);
      const reveal = MathUtils.smoothstep(MathUtils.clamp((next - 0.09) / 0.16, 0, 1), 0, 1);
      const settle = MathUtils.smoothstep(MathUtils.clamp((next - 0.25) / 0.32, 0, 1), 0, 1);
      const exit = MathUtils.smoothstep(Math.max((next - 0.92) / 0.08, 0), 0, 1);
      activeCamera.position.lerpVectors(scrollStart, cameraNear, approach)
        .lerp(cameraReveal, reveal)
        .lerp(cameraOpen, settle)
        .lerp(cameraEnd, exit);
      focus.lerpVectors(closedFocus, openFocus, Math.max(approach, reveal, settle));
      if (visible) invalidate();
      onProgress(next);
    };

    const target = closing ? 0 : (opening || opened ? 1 : 0);
    if (!opening && !closing) {
      if (opened) setPose(1);
      else setPose(openingProgress.current);
      return;
    }
    if (paused) return;

    const playhead = { value: openingProgress.current };
    const distance = Math.abs(target - playhead.value);
    if (distance < 0.001) {
      setPose(target);
      if (target === 1) onOpened(); else onClosed();
      return;
    }
    const tween = gsap.to(playhead, {
      value: target,
      duration: Math.max(0.22, 4.63 * distance),
      ease: "none",
      onUpdate: () => setPose(playhead.value),
      onComplete: () => {
        setPose(target);
        if (target === 1) onOpened(); else onClosed();
      },
    });

    return () => { tween.kill(); };
  }, [actions, camera, cameraEnd, cameraNear, cameraOpen, cameraReveal, closing, closedFocus, focus, invalidate, mixer, onClosed, onOpened, onProgress, onUnavailable, openFocus, opened, opening, paused, scrollStart, visible]);

  useFrame((_, delta) => {
    const activeCamera = cameraRef.current;
    if (!activeCamera) return;

    if (!opening && !closing && !opened) {
      const progress = scrollProgress.current;
      desiredCamera.lerpVectors(scrollStart, scrollEnd, progress);
      focus.lerpVectors(closedFocus, openFocus, progress);
      activeCamera.position.x = MathUtils.damp(activeCamera.position.x, desiredCamera.x, 5, delta);
      activeCamera.position.y = MathUtils.damp(activeCamera.position.y, desiredCamera.y, 5, delta);
      activeCamera.position.z = MathUtils.damp(activeCamera.position.z, desiredCamera.z, 5, delta);
    }

    if (root.current) {
      const aimX = opening || closing ? 0 : pointerAim.current.x;
      const aimY = opening || closing ? 0 : pointerAim.current.y;
      root.current.rotation.x = MathUtils.damp(root.current.rotation.x, aimX, 5.5, delta);
      root.current.rotation.y = MathUtils.damp(root.current.rotation.y, aimY, 5.5, delta);
    }

    activeCamera.lookAt(focus);

    const cameraMoving = !opening && !closing && !opened && activeCamera.position.distanceToSquared(desiredCamera) > 0.00001;
    const bookMoving = root.current && (
      Math.abs(root.current.rotation.x - (opening || closing ? 0 : pointerAim.current.x)) > 0.001
      || Math.abs(root.current.rotation.y - (opening || closing ? 0 : pointerAim.current.y)) > 0.001
    );
    if (visible && (cameraMoving || bookMoving)) invalidate();
  });

  return (
    <group ref={root} position={[0.18, 0, 0]} scale={1.55}>
      <primitive object={modelScene} position={[-0.18, 0, 0]} />
    </group>
  );
}

export default function BookSceneCanvas(props: Props) {
  const pointerAim = useRef<PointerAim>({ x: 0, y: 0 });

  function movePointer(event: PointerEvent<HTMLDivElement>) {
    if (props.opening) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    pointerAim.current.x = MathUtils.clamp(y * -0.15, -0.075, 0.075);
    pointerAim.current.y = MathUtils.clamp(x * 0.18, -0.09, 0.09);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (props.opening) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      pointerAim.current.y = MathUtils.clamp(
        pointerAim.current.y + (event.key === "ArrowLeft" ? -0.045 : 0.045), -0.09, 0.09,
      );
    }
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      pointerAim.current.x = MathUtils.clamp(
        pointerAim.current.x + (event.key === "ArrowUp" ? -0.035 : 0.035), -0.075, 0.075,
      );
    }
    if (event.key === "Home") {
      pointerAim.current = { x: 0, y: 0 };
    }
  }

  return (
    <div
      className={styles.canvasSurface}
      data-book-canvas
      onPointerMove={movePointer}
      onPointerLeave={() => { pointerAim.current = { x: 0, y: 0 }; }}
      onKeyDown={handleKeyDown}
    >
      <Canvas
        aria-label="Livro artístico tridimensional interativo"
        camera={{ position: [0.52, 0.58, 0.82], fov: 38, near: 0.05, far: 20 }}
        dpr={[1, 1.5]}
      frameloop={props.visible || props.opening || props.closing ? "always" : "demand"}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        onCreated={({ gl, camera: activeCamera }) => {
          activeCamera.lookAt(0.18, 0, 0.02);
          gl.setClearColor(0x000000, 0);
          gl.domElement.tabIndex = 0;
          gl.domElement.setAttribute("aria-label", "Livro artístico 3D. Use as setas para alterar levemente o ângulo.");
        }}
      >
        <ambientLight intensity={0.32} />
        <hemisphereLight args={["#fff0d5", "#243b34", 0.48]} />
        <directionalLight position={[2.5, 3.5, 4]} intensity={1.12} color="#ffe4bc" />
        <directionalLight position={[-3, -1.5, 2]} intensity={0.28} color="#bfd4d0" />
        <AnimatedBook {...props} pointerAim={pointerAim} />
      </Canvas>
    </div>
  );
}
