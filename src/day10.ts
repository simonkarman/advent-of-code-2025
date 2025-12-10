import { ClassicDay, Skip } from './day';

interface Machine {
  light: number;
  buttons: number[];
  buttonIndices: number[][];
  joltage: number[];
}

export class Day10 implements ClassicDay<Machine> {
  transformInput(lines: string[]): Machine[] {
    return lines.map(line => {
      const parts = line.split(' ');
      const light = parts[0].slice(1, -1).split('').map(v => v === '#').reduce((acc, c, i) => acc + (c ? 2 ** i : 0), 0);
      const buttonIndices = parts.slice(1, -1).map(p => p.slice(1, -1).split(',').map(Number));
      const buttons = buttonIndices.map(indices => indices.reduce((acc, c) => acc + 2 ** c, 0));
      const joltage = parts[parts.length - 1].slice(1, -1).split(',').map(Number);
      return { light, buttons, buttonIndices, joltage };
    });
  }

  getAnswers = () => ({
    exampleA: 7,
    a: 473,
    exampleB: 33,
    b: Skip,
  })

  private leastPressesLight(machine: Machine): number {
    const nodes = new Map</*light*/number, /*steps*/number>();

    // Breadth-first search to find the least presses
    const open: { light: number, steps: number }[] = [
      { light: 0, steps: 0 }, // Start with all lights off
    ];
    while (open.length > 0) {
      const current = open.shift()!;
      const steps = current.steps + 1;
      if (nodes.has(current.light)) {
        continue;
      }
      nodes.set(current.light, steps);

      const neighbors = machine.buttons.map(b => current.light ^ b);
      for (const neighbor of neighbors) {
        if (neighbor === machine.light) {
          return steps;
        }
        open.push({ light: neighbor, steps });
      }
    }
    return -1; // No solution found
  }

  solutionA(machines: Machine[]): number {
    return machines.map(m => this.leastPressesLight(m)).reduce((acc, c) => acc + c, 0);
  }

  private leastPressesJoltage(targetJoltage: number[], startJoltage: number[], buttonIndices: number[][]): number {
    const maxSteps = targetJoltage.reduce((acc, c) => acc + c, 0);
    const joltageAsString = (joltage: number[]) => joltage.join(',');
    const targetAsString = joltageAsString(targetJoltage);
    const nodes = new Map</*joltage*/string, /*steps*/number>();

    // Breadth-first search to find the least presses
    const open: { joltage: number[], steps: number }[] = [
      { joltage: startJoltage, steps: 0 }, // Start with all joltage indicators at zero
    ];
    while (open.length > 0) {
      const current = open.shift()!;
      const steps = current.steps + 1;
      if (steps > maxSteps) {
        continue;
      }
      const key = joltageAsString(current.joltage);
      if (nodes.has(key)) {
        continue;
      }
      nodes.set(key, steps);

      const neighbors = buttonIndices.map(indices => {
        const copy = [...current.joltage];
        indices.forEach(i => copy[i] = copy[i] + 1);
        return copy;
      });
      for (const neighbor of neighbors) {
        // Skip neighbors that exceed target joltage for one of the fields
        if (neighbor.some((v, i) => v > targetJoltage[i])) {
          continue;
        }

        const neighborAsString = joltageAsString(neighbor);
        if (neighborAsString === targetAsString) {
          console.info(nodes);
          return steps;
        }
        open.push({ joltage: neighbor, steps });
      }
    }
    return -1; // No solution found
  }

  private leastPressesJoltage2(targetJoltage: number[], startJoltage: number[], buttonIndices: number[][]): number {
    // Try and simplify
    // If there are indices that only one of the buttons can increase, we can use that to calculate the number of presses for those buttons directly
    const indicesWithOneOccurrence = buttonIndices
      .flatMap(indices => indices)
      .reduce((acc, v) => {
        acc.set(v, (acc.get(v) || 0) + 1);
        return acc;
      }, new Map<number, number>())
      .entries()
      .filter(([, count]) => count === 1)
      .map(([index]) => index)
      .toArray();

    if (indicesWithOneOccurrence.length > 0) {
      let totalPresses = 0;
      let newStartJoltage = [...startJoltage];
      let skipButtonIndices = new Set<number>();
      for (const index of indicesWithOneOccurrence) {
        const buttonIndex = buttonIndices.findIndex(indices => indices.includes(index));
        if (skipButtonIndices.has(buttonIndex)) {
          continue;
        }
        skipButtonIndices.add(buttonIndex);
        const pressesNeeded = targetJoltage[index] - newStartJoltage[index];
        // Apply presses
        for (const idx of buttonIndices[buttonIndex]) {
          newStartJoltage[idx] += pressesNeeded;
        }
        totalPresses += pressesNeeded;
      }
      const newButtons = buttonIndices.filter((_, i) => !skipButtonIndices.has(i));
      console.info('After simplification:', newStartJoltage, 'with total presses:', totalPresses, 'and remaining buttons:', newButtons);
      return totalPresses + this.leastPressesJoltage2(targetJoltage, newStartJoltage, newButtons);
    }
    return this.leastPressesJoltage(targetJoltage, startJoltage, buttonIndices);
  }

  solutionB(machines: Machine[]): number {
    return machines.map(m => {
      const start = new Array(m.joltage.length).fill(0);
      return this.leastPressesJoltage2(m.joltage, start, m.buttonIndices);
    }).reduce((acc, c) => acc + c, 0);
  }
}
