export interface Planet {
  name: string;
  radius: number; // in Three.js units
  orbitRadius: number; // distance from Sun
  orbitalSpeed: number; // radians per second
  rotationSpeed: number; // self-rotation speed
  color?: string; // fallback color if no texture
  texture?: string; // relative URL from public folder
}

export const planets: Planet[] = [
  {
    name: 'Mercury',
    radius: 0.055,
    orbitRadius: 0.6,
    orbitalSpeed: 0.02,
    rotationSpeed: 0.004,
    texture: '/textures/planets/mercury.jpg',
  },
  {
    name: 'Venus',
    radius: 0.091,
    orbitRadius: 0.9,
    orbitalSpeed: 0.015,
    rotationSpeed: 0.002,
    texture: '/textures/planets/venus.jpg',
  },
  {
    name: 'Earth',
    radius: 0.1,
    orbitRadius: 1.2,
    orbitalSpeed: 0.01,
    rotationSpeed: 0.01,
    texture: '/textures/planets/earth.jpg',
  },
  {
    name: 'Mars',
    radius: 0.053,
    orbitRadius: 1.6,
    orbitalSpeed: 0.008,
    rotationSpeed: 0.008,
    texture: '/textures/planets/mars.jpg',
  },
  {
    name: 'Jupiter',
    radius: 0.33,
    orbitRadius: 3.0,
    orbitalSpeed: 0.004,
    rotationSpeed: 0.03,
    texture: '/textures/planets/jupiter.jpg',
  },
  {
    name: 'Saturn',
    radius: 0.28,
    orbitRadius: 4.5,
    orbitalSpeed: 0.003,
    rotationSpeed: 0.025,
    texture: '/textures/planets/saturn.jpg',
  },
  {
    name: 'Uranus',
    radius: 0.13,
    orbitRadius: 5.8,
    orbitalSpeed: 0.002,
    rotationSpeed: 0.022,
    texture: '/textures/planets/uranus.jpg',
  },
  {
    name: 'Neptune',
    radius: 0.13,
    orbitRadius: 6.6,
    orbitalSpeed: 0.0015,
    rotationSpeed: 0.022,
    texture: '/textures/planets/neptune.jpg',
  },
  {
    name: 'Pluto',
    radius: 0.02,
    orbitRadius: 7.5,
    orbitalSpeed: 0.001,
    rotationSpeed: 0.004,
    texture: '/textures/planets/pluto.jpg',
  },
];
