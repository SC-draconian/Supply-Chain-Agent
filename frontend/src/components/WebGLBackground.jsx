import { useEffect, useRef } from 'react';

const WebGLBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('WebGL not supported, falling back to CSS animations');
      return;
    }

    // Vertex Shader Source
    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment Shader Source
    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        vec2 p = uv - 0.5;
        p.x *= aspect;

        float t = u_time * 0.12;

        // Domain warping using simple trig functions for organic flow
        vec2 p1 = p + vec2(sin(t + p.y * 1.8), cos(t + p.x * 2.2)) * 0.35;
        vec2 p2 = p + vec2(cos(t * 1.1 - p.y * 1.4), sin(t * 0.9 + p.x * 1.6)) * 0.3;

        // Premium Dark Color Palette (Luminous Enterprise)
        // Deep Navy Base (#0b1326)
        vec3 baseColor = vec3(0.043, 0.075, 0.149);
        // Violet Glow (#8b5cf6)
        vec3 violetGlow = vec3(0.545, 0.361, 0.965);
        // Blue Glow (#3b82f6)
        vec3 blueGlow = vec3(0.231, 0.510, 0.965);

        // Distances to moving warped fields
        float d1 = length(p1 - vec2(-0.2, 0.15)) * 1.4;
        float d2 = length(p2 - vec2(0.25, -0.2)) * 1.6;

        float glow1 = 1.0 / (1.0 + d1 * d1 * 4.0);
        float glow2 = 1.0 / (1.0 + d2 * d2 * 5.0);

        float pulse = sin(t * 0.6) * 0.08 + 0.92;

        vec3 color = baseColor;
        color += violetGlow * glow1 * 0.32 * pulse;
        color += blueGlow * glow2 * 0.28 * pulse;

        // Vignette effect to draw focus to center panels
        float vignette = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
        vignette = clamp(pow(16.0 * vignette, 0.35), 0.0, 1.0);
        color *= vignette;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Compile shader helper
    const compileShader = (source, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    // Create Program
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Set up vertex buffer
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
    const timeLoc = gl.getUniformLocation(program, 'u_time');

    // Resize Handler
    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };
    
    window.addEventListener('resize', resize);
    resize();

    // Render loop
    let animationFrameId;
    const startTime = performance.now();

    const render = () => {
      const currentTime = performance.now();
      const elapsedSeconds = (currentTime - startTime) / 1000.0;

      // Clear
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Set uniforms
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, elapsedSeconds);

      // Draw
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default WebGLBackground;
