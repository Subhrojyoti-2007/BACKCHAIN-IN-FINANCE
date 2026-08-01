import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeJSGlobe() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Glowing Blockchain Globe
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const geometry = new THREE.IcosahedronGeometry(2, 4);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x3B82F6, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.2 
    });
    const globe = new THREE.Mesh(geometry, material);
    globeGroup.add(globe);

    // Points for Nodes
    const pointsGeom = new THREE.IcosahedronGeometry(2, 4);
    const pointsMat = new THREE.PointsMaterial({ 
      color: 0x06B6D4, 
      size: 0.06,
      transparent: true,
      opacity: 0.8
    });
    const nodes = new THREE.Points(pointsGeom, pointsMat);
    globeGroup.add(nodes);

    // Floating Particles
    const particlesCount = 300;
    const particlesGeom = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 12;
    }
    particlesGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({ 
      size: 0.03, 
      color: 0x8B5CF6,
      transparent: true,
      opacity: 0.4
    });
    const particles = new THREE.Points(particlesGeom, particlesMat);
    scene.add(particles);

    // Lights
    const light = new THREE.PointLight(0x3B82F6, 1, 10);
    light.position.set(2, 2, 2);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));

    camera.position.z = 5;

    let animationFrameId;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      globeGroup.rotation.y += 0.001;
      globeGroup.rotation.x += 0.0005;
      particles.rotation.y += 0.0002;
      renderer.render(scene, camera);
    }

    const handleResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      container.removeChild(renderer.domElement);
      // Clean up ThreeJS resources
      geometry.dispose();
      material.dispose();
      pointsGeom.dispose();
      pointsMat.dispose();
      particlesGeom.dispose();
      particlesMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full drop-shadow-[0_0_40px_rgba(76,215,246,0.2)]">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}
