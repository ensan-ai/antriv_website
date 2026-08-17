import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import * as THREE from "three";
import {
  ProductionAuditDialog,
  ProductionFooter,
  ProductionHeader,
  ProductionSections,
} from "./ProductionSections.jsx";

const STEPS = [
  { id: "01", label: "Capture", detail: "Inputs arrive" },
  { id: "02", label: "Decide", detail: "Rules evaluate" },
  { id: "03", label: "Act", detail: "Work moves" },
  { id: "04", label: "Report", detail: "Results surface" },
];

function CorridorScene({ progressRef, reducedMotion }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111313);
    scene.fog = new THREE.Fog(0x111313, 18, 80);

    const camera = new THREE.PerspectiveCamera(47, 1, 0.1, 150);
    camera.position.set(3.2, 2.8, 14);

    const supportCanvas = document.createElement("canvas");
    const webglSupported = Boolean(
      supportCanvas.getContext("webgl2") || supportCanvas.getContext("webgl"),
    );
    if (!webglSupported) {
      mount.classList.add("is-fallback");
      let fallbackFrame;
      const renderFallback = () => {
        const fallbackProgress = reducedMotion ? 0.08 : progressRef.current;
        mount.style.setProperty("--fallback-scale", String(1.02 + fallbackProgress * 0.12));
        mount.style.setProperty("--fallback-shift", `${fallbackProgress * -2.5}%`);
        fallbackFrame = window.requestAnimationFrame(renderFallback);
      };
      renderFallback();
      return () => window.cancelAnimationFrame(fallbackFrame);
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);

    const world = new THREE.Group();
    scene.add(world);

    const graphite = new THREE.MeshStandardMaterial({
      color: 0x292a29,
      roughness: 0.78,
      metalness: 0.22,
    });
    const graphiteDeep = new THREE.MeshStandardMaterial({
      color: 0x181a1a,
      roughness: 0.92,
      metalness: 0.08,
    });
    const graphiteFace = new THREE.MeshStandardMaterial({
      color: 0x343531,
      roughness: 0.72,
      metalness: 0.16,
    });
    const copper = new THREE.MeshStandardMaterial({
      color: 0xa9572c,
      emissive: 0x5c1d08,
      emissiveIntensity: 0.2,
      roughness: 0.34,
      metalness: 0.78,
    });
    const copperLive = copper.clone();
    copperLive.color.setHex(0xe07137);
    copperLive.emissive.setHex(0xd84d18);
    copperLive.emissiveIntensity = 2.2;

    const centerX = 3.2;
    const width = 10.8;
    const height = 6.3;
    const bay = 4.2;
    const frameCount = 25;
    const animatedSegments = [];
    const nodes = [];

    const verticalGeometry = new THREE.BoxGeometry(0.26, height, 0.44);
    const horizontalGeometry = new THREE.BoxGeometry(width + 0.26, 0.26, 0.44);
    const floorGeometry = new THREE.BoxGeometry(width, 0.18, 3.92);
    const wallGeometry = new THREE.BoxGeometry(0.18, height - 0.55, 3.92);
    const ceilingGeometry = new THREE.BoxGeometry(width, 0.12, 3.92);

    for (let index = 0; index < frameCount; index += 1) {
      const z = 8 - index * bay;
      const frameMaterial = index % 3 === 0 ? graphiteFace : graphite;

      [-1, 1].forEach((direction) => {
        const side = new THREE.Mesh(verticalGeometry, frameMaterial);
        side.position.set(centerX + direction * width * 0.5, height * 0.5, z);
        world.add(side);
      });

      [0.12, height].forEach((y) => {
        const beam = new THREE.Mesh(horizontalGeometry, frameMaterial);
        beam.position.set(centerX, y, z);
        world.add(beam);
      });

      if (index < frameCount - 1) {
        const floor = new THREE.Mesh(floorGeometry, index % 2 ? graphiteDeep : graphite);
        floor.position.set(centerX, 0, z - bay * 0.5);
        world.add(floor);

        if (index % 2 === 0) {
          [-1, 1].forEach((direction) => {
            const wall = new THREE.Mesh(wallGeometry, graphiteDeep);
            wall.position.set(centerX + direction * width * 0.5, height * 0.5, z - bay * 0.5);
            world.add(wall);
          });

          const ceiling = new THREE.Mesh(ceilingGeometry, graphiteDeep);
          ceiling.position.set(centerX, height + 0.05, z - bay * 0.5);
          world.add(ceiling);
        }
      }
    }

    const railGeometry = new THREE.BoxGeometry(0.1, 0.08, bay * 0.86);
    for (let index = 0; index < frameCount - 2; index += 1) {
      const rail = new THREE.Mesh(railGeometry, copper.clone());
      rail.position.set(centerX + 0.9, 0.18, 5.9 - index * bay);
      rail.material.emissiveIntensity = 0.08;
      rail.userData.threshold = index / (frameCount - 3);
      world.add(rail);
      animatedSegments.push(rail);
    }

    const nodeDepths = [2, -18, -38, -58];
    nodeDepths.forEach((z, index) => {
      const nodeGroup = new THREE.Group();
      nodeGroup.position.set(centerX + 0.9, 0.24, z);

      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.5, 0.14, 24),
        graphiteFace,
      );
      base.rotation.x = Math.PI * 0.5;
      nodeGroup.add(base);

      const core = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 24), copper.clone());
      core.position.y = 0.14;
      core.material.emissiveIntensity = 0.15;
      nodeGroup.add(core);

      const branch = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.07, 0.08), copper.clone());
      branch.position.set(index % 2 ? -1.75 : 1.75, -0.03, 0);
      branch.material.emissiveIntensity = 0.12;
      nodeGroup.add(branch);

      nodeGroup.userData.threshold = index / 4;
      nodeGroup.userData.core = core;
      nodeGroup.userData.branch = branch;
      world.add(nodeGroup);
      nodes.push(nodeGroup);
    });

    const portal = new THREE.Group();
    portal.position.set(centerX, 0, -66);
    const portalMat = copperLive.clone();
    portalMat.emissiveIntensity = 1.4;
    const portalSideGeometry = new THREE.BoxGeometry(0.16, 5.5, 0.18);
    [-1, 1].forEach((direction) => {
      const side = new THREE.Mesh(portalSideGeometry, portalMat);
      side.position.set(direction * 3.6, 2.75, 0);
      portal.add(side);
    });
    const portalTop = new THREE.Mesh(new THREE.BoxGeometry(7.35, 0.16, 0.18), portalMat);
    portalTop.position.set(0, 5.5, 0);
    portal.add(portalTop);
    world.add(portal);

    scene.add(new THREE.AmbientLight(0x8d8177, 0.42));
    const key = new THREE.DirectionalLight(0xffd4b5, 2.1);
    key.position.set(-4, 10, 12);
    scene.add(key);
    const copperLight = new THREE.PointLight(0xc75a2a, 18, 26, 2);
    copperLight.position.set(centerX + 0.9, 1.1, -4);
    scene.add(copperLight);

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (event) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      camera.aspect = clientWidth / Math.max(clientHeight, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight, false);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    const clock = new THREE.Clock();
    let animationFrame;
    let smoothProgress = reducedMotion ? 0.06 : 0;

    const render = () => {
      const elapsed = clock.getElapsedTime();
      const targetProgress = reducedMotion ? 0.08 : progressRef.current;
      smoothProgress += (targetProgress - smoothProgress) * 0.075;

      const cameraZ = 14 - smoothProgress * 63;
      const parallaxX = reducedMotion ? 0 : pointer.x * 0.18;
      const parallaxY = reducedMotion ? 0 : pointer.y * -0.1;
      camera.position.x += (centerX + parallaxX - camera.position.x) * 0.045;
      camera.position.y += (2.8 + parallaxY - camera.position.y) * 0.045;
      camera.position.z = cameraZ;
      camera.lookAt(centerX + parallaxX * 0.35, 2.65 + parallaxY * 0.2, cameraZ - 16);

      animatedSegments.forEach((segment) => {
        const active = smoothProgress + 0.055 >= segment.userData.threshold;
        segment.material.color.lerp(new THREE.Color(active ? 0xe07137 : 0x7f3a21), 0.12);
        segment.material.emissive.lerp(new THREE.Color(active ? 0xd84d18 : 0x351208), 0.12);
        segment.material.emissiveIntensity +=
          ((active ? 1.8 : 0.08) - segment.material.emissiveIntensity) * 0.12;
      });

      nodes.forEach((node, index) => {
        const active = smoothProgress + 0.09 >= node.userData.threshold;
        const pulse = active ? 1 + Math.sin(elapsed * 2.1 + index) * 0.09 : 0.78;
        node.userData.core.scale.setScalar(pulse);
        node.userData.core.material.emissiveIntensity +=
          ((active ? 2.6 : 0.12) - node.userData.core.material.emissiveIntensity) * 0.1;
        node.userData.branch.material.emissiveIntensity +=
          ((active ? 1.55 : 0.08) - node.userData.branch.material.emissiveIntensity) * 0.1;
      });

      portalMat.emissiveIntensity = 1.15 + Math.sin(elapsed * 1.3) * 0.22;
      copperLight.position.z = cameraZ - 8;
      copperLight.intensity = 10 + smoothProgress * 18;

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [progressRef, reducedMotion]);

  return <div className="corridor-scene" ref={mountRef} aria-hidden="true" />;
}

export function App() {
  const heroTrackRef = useRef(null);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(query.matches);
    updatePreference();
    query.addEventListener("change", updatePreference);
    return () => query.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    let frame = null;
    const update = () => {
      frame = null;
      const track = heroTrackRef.current;
      const available = track ? track.offsetHeight - window.innerHeight : 0;
      const start = track ? track.offsetTop : 0;
      const next = available > 0
        ? Math.min(1, Math.max(0, (window.scrollY - start) / available))
        : 0;
      progressRef.current = next;
      setProgress(next);
    };
    const onScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const activeStep = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length));
  const openAudit = () => setDialogOpen(true);

  return (
    <div className="site-shell">
      <ProductionHeader onAudit={openAudit} />
      <main className="experience">
      <section
        className="scroll-track"
        id="top"
        ref={heroTrackRef}
        aria-label="ANTRIV operational intelligence experience"
      >
        <div className="sticky-stage" data-end={progress > 0.89}>
          <CorridorScene progressRef={progressRef} reducedMotion={reducedMotion} />
          <div className="left-veil" aria-hidden="true" />
          <div className="noise" aria-hidden="true" />

          <div className="hero-copy">
            <div className="eyebrow-row">
              <span className="eyebrow">OPERATIONAL INTELLIGENCE</span>
              <span className="eyebrow-code">UAE / GCC</span>
            </div>
            <h1>Intelligent systems.<br />Built for real work.</h1>
            <p className="hero-lede">
              We turn fragmented operations into one accountable system — designed around how your team actually works.
            </p>
            <div className="hero-actions">
              <motion.button
                className="primary-button lift-action"
                type="button"
                whileHover={reducedMotion ? undefined : { y: -5, scale: 1.035 }}
                whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                transition={{ type: "spring", stiffness: 360, damping: 24, mass: 0.65 }}
                onClick={openAudit}
              >
                Book a workflow audit
              </motion.button>
              <motion.button
                className="text-button lift-link"
                type="button"
                whileHover={reducedMotion ? undefined : { y: -4, scale: 1.035 }}
                whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                transition={{ type: "spring", stiffness: 360, damping: 24, mass: 0.65 }}
                onClick={() => window.scrollTo({ top: window.innerHeight * 1.45, behavior: reducedMotion ? "auto" : "smooth" })}
              >
                Enter the system <span aria-hidden="true">↓</span>
              </motion.button>
            </div>
          </div>

          <aside className="process-rail" aria-label="Workflow stages">
            <div className="rail-heading">
              <span>LIVE WORKFLOW</span>
              <span>{String(Math.round(progress * 100)).padStart(2, "0")}%</span>
            </div>
            <div className="progress-line"><span style={{ transform: `scaleX(${progress})` }} /></div>
            <ol>
              {STEPS.map((step, index) => (
                <li className={index <= activeStep ? "active" : ""} key={step.id}>
                  <span className="step-number">{step.id}</span>
                  <span className="step-copy"><strong>{step.label}</strong><small>{step.detail}</small></span>
                </li>
              ))}
            </ol>
          </aside>

          <div className="scroll-marker" aria-hidden="true">
            <span>SCROLL TO ADVANCE</span>
            <i />
          </div>

          <div className="end-state" data-visible={progress > 0.89}>
            <span className="eyebrow">SYSTEM ONLINE</span>
            <strong>One workflow.<br />Clear ownership.</strong>
          </div>
        </div>
      </section>
      <ProductionSections onAudit={openAudit} />
      </main>
      <ProductionFooter onAudit={openAudit} />
      <ProductionAuditDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}
