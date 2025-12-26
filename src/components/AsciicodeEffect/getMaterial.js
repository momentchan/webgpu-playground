import * as THREE from "three/webgpu";
import {
  createAsciiCodeShader,
  createPositionMathShader,
} from "./shaders/asciiCodeShader";

/**
 * Creates an ASCII material with custom shaders
 * @param {Object} params - Material parameters
 * @param {Texture} params.tex - Main texture (currently unused but kept for future use)
 * @param {Texture} params.asciiTexture - ASCII character texture
 * @param {Texture} params.sceneTexture - Texture from the rendered scene
 * @param {number} params.len - Length of ASCII dictionary
 * @returns {THREE.NodeMaterial|null} The created material or null if tex is not provided
 */
export function getMaterial({ tex, asciiTexture, sceneTexture, len }) {
  if (!tex) return null;

  const material = new THREE.NodeMaterial();

  const asciiCodeShader = createAsciiCodeShader({
    sceneTexture,
    asciiTexture,
    len,
  });

  const positionMathShader = createPositionMathShader();

  material.colorNode = asciiCodeShader();
  material.positionNode = positionMathShader();

  material.transparent = true;
  material.side = THREE.DoubleSide;

  return material;
}

