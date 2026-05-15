declare module "three" {
  export class WebGLRenderer {
    constructor(parameters?: { alpha?: boolean });
    capabilities: { isWebGL2: boolean };
    domElement: HTMLCanvasElement;
    setClearColor(color: number, alpha?: number): void;
    setSize(width: number, height: number): void;
    setPixelRatio(value: number): void;
    render(scene: Scene, camera: OrthographicCamera): void;
    dispose(): void;
  }

  export class Scene {
    add(object: unknown): void;
  }

  export class OrthographicCamera {
    constructor(left: number, right: number, top: number, bottom: number, near?: number, far?: number);
    position: { z: number };
  }

  export class Vector2 {
    constructor(x?: number, y?: number);
    set(x: number, y: number): this;
  }

  export class Color {
    constructor(color?: string | number);
    set(color: string | number): this;
  }

  export class ShaderMaterial {
    constructor(parameters?: {
      vertexShader?: string;
      fragmentShader?: string;
      uniforms?: Record<string, { value: unknown }>;
      transparent?: boolean;
    });
    dispose(): void;
  }

  export class PlaneGeometry {
    constructor(width?: number, height?: number);
  }

  export class Mesh {
    constructor(geometry?: PlaneGeometry, material?: ShaderMaterial);
  }
}
