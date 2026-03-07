// Deterministic random number generator (mulberry32)
// See: https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
function mulberry32(a: number) {
  return function () {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/**
 * Distributes items evenly within a circle using a simple iterative approach with distance checks,
 * simulating Poisson-disk sampling for a fixed count.
 * @param count Number of positions to generate
 * @param radius Radius of the circular area
 * @param seed Seed for the random generator 
 * @returns Array of [x, z] coordinates
 */
export function distributeToppings(count: number, radius: number, seed: number): [number, number][] {
  const random = mulberry32(seed);
  const minDistance = 0.35; // specified minimum distance between samples
  const minSq = minDistance * minDistance;
  
  const positions: [number, number][] = [];
  const maxAttempts = count * 100;
  let attempts = 0;

  while(positions.length < count && attempts < maxAttempts) {
    attempts++;
    
    // Generate random point in circle using sqrt for uniform distribution
    const r = radius * Math.sqrt(random());
    const theta = random() * 2 * Math.PI;
    
    const x = r * Math.cos(theta);
    const z = r * Math.sin(theta);
    
    // Check against all existing points
    let isValid = true;
    for (const [px, pz] of positions) {
      const dx = px - x;
      const dz = pz - z;
      if ((dx * dx + dz * dz) < minSq) {
        isValid = false;
        break;
      }
    }
    
    if (isValid) {
      positions.push([x, z]);
    }
  }

  // If we couldn't place everything due to crowding, just fall back to random for the rest
  // (though with count=8-16, r=1.5, minD=0.35 it usually succeeds)
  while(positions.length < count) {
    const r = radius * Math.sqrt(random());
    const theta = random() * 2 * Math.PI;
    positions.push([r * Math.cos(theta), r * Math.sin(theta)]);
  }

  return positions;
}
