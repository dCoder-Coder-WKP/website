import { describe, it, expect } from 'vitest';
import { distributeToppings } from './toppingDistribution';

describe('Topping Distribution', () => {
  it('distributeToppings returns correct count of positions', () => {
    const count = 12;
    const positions = distributeToppings(count, 1.5, 12345);
    expect(positions).toHaveLength(count);
  });

  it('no two positions closer than minimum distance', () => {
    const count = 12;
    const minDistance = 0.35;
    // We use a safe number where Poisson disk usually succeeds entirely
    const positions = distributeToppings(count, 1.5, 999);
    
    let violationFound = false;
    for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
            const dx = positions[i][0] - positions[j][0];
            const dz = positions[i][1] - positions[j][1];
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist < minDistance - 0.01) { // 0.01 tolerance for floating point 
                violationFound = true;
            }
        }
    }
    // Only failing if the loop had to fall back to tight random packing (which happens maxAttempts hit)
    // For small counts like 12, it shouldn't hit it.
    expect(violationFound).toBe(false);
  });

  it('all positions within specified radius', () => {
    const radius = 1.5;
    const positions = distributeToppings(20, radius, 42); // tested with high count
    positions.forEach(([x, z]) => {
      const distFromCenter = Math.sqrt(x * x + z * z);
      expect(distFromCenter).toBeLessThanOrEqual(radius + 0.001);
    });
  });

  it('same seed produces same layout (deterministic)', () => {
    const seed = 555;
    const run1 = distributeToppings(10, 1.5, seed);
    const run2 = distributeToppings(10, 1.5, seed);
    
    expect(run1).toEqual(run2);
    
    // Different seed should be different
    const run3 = distributeToppings(10, 1.5, 556);
    expect(run1).not.toEqual(run3);
  });
});
