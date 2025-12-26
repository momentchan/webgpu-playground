import { useMemo, useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import { getMaterial } from "./getMaterial";
import {
  createAsciiTexture,
  generateInstanceAttributes,
} from "./utils";
import {
  ASCII_SIZE,
  ASCII_INSTANCES,
} from "./constant";
import { useTexture } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useScene2 } from "../hooks/useScene2";

export default function AsciicodeEffect() {
  const { scene, camera, gl } = useThree();
  const { scene2, camera2, renderTarget, animateCubes } = useScene2();

  const instancedMeshRef = useRef(null);

  const tex = useTexture("/textures/Anne_Hathaway.jpg");

  const asciiTextureData = useMemo(() => createAsciiTexture(), []);

  const material = useMemo(() => {
    if (!tex || !asciiTextureData || !renderTarget.texture) return null;
    return getMaterial({
      tex: tex,
      asciiTexture: asciiTextureData.asciiTexture,
      sceneTexture: renderTarget.texture,
      len: asciiTextureData.length,
    });
  }, [tex, asciiTextureData, renderTarget]);

  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(ASCII_SIZE, ASCII_SIZE, 1, 1);
  }, []);

  const { uvs, randoms, positions } = useMemo(() => {
    return generateInstanceAttributes();
  }, []);

  // Set instance attributes on the instanced mesh
  useLayoutEffect(() => {
    if (instancedMeshRef.current && uvs && randoms && positions) {
      instancedMeshRef.current.geometry.setAttribute(
        "aPixelUV",
        new THREE.InstancedBufferAttribute(uvs, 2)
      );
      instancedMeshRef.current.geometry.setAttribute(
        "aRandom",
        new THREE.InstancedBufferAttribute(randoms, 1)
      );
      instancedMeshRef.current.geometry.setAttribute(
        "aPosition",
        new THREE.InstancedBufferAttribute(positions, 3)
      );
    }
  }, [uvs, randoms, positions]);

  useFrame((state, delta) => {
    animateCubes(state.clock.elapsedTime, delta);

    gl.setRenderTarget(renderTarget);
    gl.render(scene2, camera2);
    gl.setRenderTarget(null);
    gl.render(scene, camera);
  }, 1);

  if (!material) return null;

  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[geometry, material, ASCII_INSTANCES]}
    />
  );
}
