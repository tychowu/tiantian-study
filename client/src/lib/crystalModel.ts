export type Sample = { temp: number; water: number; dissolved: number; powder: number; crystal: number; seeded: boolean; day: number };
export type CrystalAction = "add" | "stir" | "heat" | "cool" | "seed" | "day" | "water";
export const initial: Sample = { temp: 25, water: 80, dissolved: 0, powder: 0, crystal: 0, seeded: false, day: 0 };
// Teaching units, not a measured solubility curve or a real recipe.
export const capacity = (s: Sample) => Math.round((6 + (s.temp - 25) / 5) * s.water / 80);
export function step(s: Sample, action: CrystalAction): Sample {
  const n = { ...s };
  if (action === "add" && n.dissolved + n.powder + n.crystal < 40) n.powder += 2;
  if (action === "heat") n.temp = Math.min(85, n.temp + 15);
  if (action === "cool") n.temp = Math.max(25, n.temp - 15);
  if (action === "water" && n.water <= 125) n.water += 15;
  if (action === "seed") n.seeded = true;
  if (action === "day" && n.water >= 15) { n.day++; n.water -= 15; }
  if (action === "stir") {
    const amount = Math.min(n.powder, Math.max(0, capacity(n) - n.dissolved));
    n.powder -= amount; n.dissolved += amount;
  }
  // Powder nucleates immediately; a placed seed grows on the next time step.
  if ((n.powder > 0 || (n.seeded && action === "day")) && n.dissolved > capacity(n)) {
    const excess = n.dissolved - capacity(n); n.dissolved -= excess; n.crystal += excess;
  }
  if (["heat", "water", "stir", "day"].includes(action)) {
    const amount = Math.min(n.crystal, Math.max(0, capacity(n) - n.dissolved));
    n.crystal -= amount; n.dissolved += amount;
  }
  return n;
}
