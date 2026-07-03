import * as THREE from 'three';

// Procedurally generate realistic high-definition planet textures using HTML5 Canvas
export function createPlanetTexture(name: string, emissiveColor?: string): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document.createElement('canvas'));
  }

  const width = name === 'Earth' || name === 'Jupiter' || name === 'Saturn' ? 1024 : 512;
  const height = width / 2;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  switch (name) {
    case 'Mercury': {
      // Gray rocky surface with craters
      ctx.fillStyle = '#555555';
      ctx.fillRect(0, 0, width, height);

      // Add high-frequency noise
      for (let i = 0; i < 8000; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const val = Math.floor(Math.random() * 40) - 20;
        ctx.fillStyle = `rgba(${85 + val}, ${85 + val}, ${85 + val}, 0.35)`;
        ctx.fillRect(x, y, 1.5, 1.5);
      }

      // Draw craters
      for (let i = 0; i < 45; i++) {
        const cx = Math.random() * width;
        const cy = Math.random() * height;
        const r = 2 + Math.random() * 12;

        // Crater shadow
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fill();

        // Crater highlight
        ctx.beginPath();
        ctx.arc(cx + r * 0.15, cy + r * 0.15, r * 0.85, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(110,110,110,0.6)';
        ctx.fill();

        // Central peak for larger craters
        if (r > 6) {
          ctx.beginPath();
          ctx.arc(cx + r * 0.1, cy + r * 0.1, 1, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(160,160,160,0.8)';
          ctx.fill();
        }
      }
      break;
    }

    case 'Venus': {
      // Dense yellow-orange clouds
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#755431');
      grad.addColorStop(0.2, '#cda26b');
      grad.addColorStop(0.4, '#e1b782');
      grad.addColorStop(0.6, '#b88c56');
      grad.addColorStop(0.8, '#d4ab75');
      grad.addColorStop(1, '#66492b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw wavy cloud bands
      ctx.globalAlpha = 0.15;
      for (let y = 0; y < height; y += 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x < width; x += 10) {
          const dy = Math.sin(x * 0.05 + y) * 8 + Math.cos(x * 0.02) * 5;
          ctx.lineTo(x, y + dy);
        }
        ctx.strokeStyle = Math.random() > 0.5 ? '#ffffff' : '#4d3013';
        ctx.lineWidth = 3 + Math.random() * 5;
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;
      break;
    }

    case 'Earth': {
      // Blue ocean base
      ctx.fillStyle = '#0a2342';
      ctx.fillRect(0, 0, width, height);

      // Procedural continents (drawing complex paths)
      ctx.fillStyle = '#1e4620'; // Base green for vegetation

      // Function to draw a continent blob
      const drawContinentBlob = (cx: number, cy: number, rx: number, ry: number) => {
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += 0.1) {
          const noise = 0.7 + Math.sin(a * 5) * 0.15 + Math.cos(a * 12) * 0.1;
          const x = cx + Math.cos(a) * rx * noise;
          const y = cy + Math.sin(a) * ry * noise;
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      };

      // America
      drawContinentBlob(width * 0.28, height * 0.45, width * 0.12, height * 0.35);
      // North America detail
      drawContinentBlob(width * 0.23, height * 0.25, width * 0.09, height * 0.2);
      // Eurasia / Africa
      drawContinentBlob(width * 0.65, height * 0.35, width * 0.18, height * 0.3);
      drawContinentBlob(width * 0.58, height * 0.6, width * 0.1, height * 0.22);
      // Australia
      drawContinentBlob(width * 0.85, height * 0.7, width * 0.07, height * 0.09);

      // Add desert/brown patches inside continents
      ctx.fillStyle = '#7a6645';
      ctx.globalCompositeOperation = 'source-atop';
      drawContinentBlob(width * 0.28, height * 0.48, width * 0.08, height * 0.2);
      drawContinentBlob(width * 0.62, height * 0.35, width * 0.12, height * 0.15); // Sahara / Middle East
      ctx.globalCompositeOperation = 'source-over';

      // Polar ice caps (Antarctica & Greenland)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height * 0.08); // North Pole
      ctx.fillRect(0, height * 0.92, width, height * 0.08); // South Pole

      // Semi-transparent cloud layers
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 15; i++) {
        ctx.beginPath();
        const cx = Math.random() * width;
        const cy = 0.15 * height + Math.random() * height * 0.7;
        const rx = 40 + Math.random() * 120;
        const ry = 10 + Math.random() * 25;
        ctx.ellipse(cx, cy, rx, ry, Math.random() * 0.2 - 0.1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
      break;
    }

    case 'Mars': {
      // Reddish-orange iron-oxide surface
      ctx.fillStyle = '#a34828';
      ctx.fillRect(0, 0, width, height);

      // Darker splotches
      ctx.fillStyle = '#5c2816';
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        const cx = Math.random() * width;
        const cy = Math.random() * height;
        const rx = 30 + Math.random() * 80;
        const ry = 15 + Math.random() * 40;
        ctx.ellipse(cx, cy, rx, ry, Math.random() * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Small craters
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      for (let i = 0; i < 200; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, 1 + Math.random() * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Polar Ice Caps
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(width * 0.5, 2, 45, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(width * 0.5, height - 2, 35, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'Jupiter': {
      // Horizontal colorful atmospheric bands
      const colors = ['#4a2f1c', '#7d4a2d', '#b38258', '#dfcaaa', '#cc9766', '#875133', '#eedecc'];
      let currentY = 0;
      while (currentY < height) {
        const bandH = 8 + Math.floor(Math.random() * 32);
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillRect(0, currentY, width, bandH);
        currentY += bandH;
      }

      // Add turbulence/wavy shear lines
      ctx.globalAlpha = 0.2;
      for (let y = 0; y < height; y += 8) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x < width; x += 15) {
          const dy = Math.sin(x * 0.03 + y) * 12 + Math.cos(x * 0.01) * 8;
          ctx.lineTo(x, y + dy);
        }
        ctx.strokeStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
        ctx.lineWidth = 4 + Math.random() * 6;
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;

      // Great Red Spot
      ctx.fillStyle = '#b53312';
      ctx.beginPath();
      ctx.ellipse(width * 0.65, height * 0.65, 38, 22, -0.05, 0, Math.PI * 2);
      ctx.fill();

      // Great Red Spot inner glow/ring
      ctx.strokeStyle = '#e88972';
      ctx.lineWidth = 3;
      ctx.stroke();
      break;
    }

    case 'Saturn': {
      // Muted gold/beige atmospheric bands
      const colors = ['#dfce9f', '#cfae7c', '#be9f6b', '#e2d3b2', '#ac8c58'];
      let currentY = 0;
      while (currentY < height) {
        const bandH = 12 + Math.floor(Math.random() * 40);
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillRect(0, currentY, width, bandH);
        currentY += bandH;
      }

      // Add soft blending/gradients
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      for (let i = 0; i < 15; i++) {
        ctx.fillRect(0, Math.random() * height, width, 5 + Math.random() * 15);
      }
      break;
    }

    case 'Uranus': {
      // Soft cyan/blue gradient
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#b8ebf2');
      grad.addColorStop(0.5, '#75c8d3');
      grad.addColorStop(1, '#53a2ae');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Very soft horizontal lines
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      for (let i = 0; i < 8; i++) {
        ctx.fillRect(0, Math.random() * height, width, 8 + Math.random() * 20);
      }
      break;
    }

    case 'Neptune': {
      // Deep ocean blue with faint white bands
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#2b4bbd');
      grad.addColorStop(0.5, '#1e389e');
      grad.addColorStop(1, '#0e1c5c');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Thin bright blue bands
      ctx.globalAlpha = 0.15;
      ctx.strokeStyle = '#618dff';
      for (let i = 0; i < 6; i++) {
        const y = Math.random() * height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x < width; x += 30) {
          ctx.lineTo(x, y + Math.sin(x * 0.02) * 5);
        }
        ctx.lineWidth = 2 + Math.random() * 4;
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;

      // Great Dark Spot
      ctx.fillStyle = '#0f183d';
      ctx.beginPath();
      ctx.ellipse(width * 0.4, height * 0.55, 30, 18, 0.1, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'Pluto': {
      // Grayish brown with distinct heart shape
      ctx.fillStyle = '#7c6553';
      ctx.fillRect(0, 0, width, height);

      // Draw Tombaugh Regio (The Heart)
      ctx.fillStyle = '#eadecc';
      ctx.beginPath();
      const hx = width * 0.45;
      const hy = height * 0.6;
      const size = 35;
      // Simple heart-like drawing with beziers
      ctx.moveTo(hx, hy);
      ctx.bezierCurveTo(hx - size / 2, hy - size / 2, hx - size, hy + size / 3, hx, hy + size);
      ctx.bezierCurveTo(hx + size, hy + size / 3, hx + size / 2, hy - size / 2, hx, hy);
      ctx.closePath();
      ctx.fill();

      // Darker equatorial regions
      ctx.fillStyle = '#3a2a1e';
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.ellipse(width * 0.2, height * 0.7, 90, 25, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(width * 0.8, height * 0.65, 80, 22, -0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
      break;
    }

    default: {
      // Default / Sun / Pulsar Star fallback texture
      ctx.fillStyle = emissiveColor || '#ff9900';
      ctx.fillRect(0, 0, width, height);

      const grad = ctx.createRadialGradient(width / 2, height / 2, 5, width / 2, height / 2, width / 2);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.2, '#ffcc00');
      grad.addColorStop(0.5, '#ff6600');
      grad.addColorStop(1, '#330000');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      break;
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Separate generator for Saturn's Rings
export function createSaturnRingTexture(): THREE.CanvasTexture {
  if (typeof window === 'undefined') {
    return new THREE.CanvasTexture(document.createElement('canvas'));
  }

  const width = 512;
  const height = 16; // 1D line mapped radially
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Clear transparent
  ctx.clearRect(0, 0, width, height);

  // Draw concentric bands horizontally (which represents radial rings)
  for (let x = 0; x < width; x++) {
    // Generate rings gaps and density using math
    const val = Math.sin(x * 0.15) * Math.cos(x * 0.05);
    const alpha = 0.1 + Math.abs(val) * 0.75 * (x > 50 && x < 450 ? 1 : 0);
    ctx.fillStyle = `rgba(215, 192, 149, ${alpha})`;
    ctx.fillRect(x, 0, 1, height);

    // Cassini Division
    if (x > 220 && x < 240) {
      ctx.clearRect(x, 0, 1, height);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
