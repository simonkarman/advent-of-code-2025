import { Day } from './day';

interface TachyonManifold {
  width: number;
  start: number;
  splitters: number[][];
}

export class Day07 implements Day<TachyonManifold, number> {
  transformInput(lines: string[]): TachyonManifold {
    return {
      width: lines[0].length,
      start: lines[0].indexOf('S'),
      splitters: lines
        .slice(1)
        .map(
          (line) => line
            .split('')
            .map((char, x) => (char === '^' ? x : -1))
            .filter(x => x !== -1),
        ),
    };
  }

  getAnswers = () => ({
    exampleA: 21,
    a: 1533,
    exampleB: 40,
    b: 10733529153890,
  })

  private applyTo(oldPositions: number[], splitters: number[]): { splittersHit: number, positions: number[] } {
    const positions: number[] = new Array(oldPositions.length).fill(0);
    let splittersHit = 0;

    for (let x = 0; x < oldPositions.length; x++) {
      if (oldPositions[x] === 0) {
        continue; // No tachyons at this position
      }

      if (splitters.includes(x)) {
        splittersHit += 1;
        // Splitter found, distribute tachyons to left and right
        if (x > 0) {
          positions[x - 1] += oldPositions[x];
        }
        if (x < oldPositions.length - 1) {
          positions[x + 1] += oldPositions[x];
        }
      } else {
        // No splitter, tachyons continue straight
        positions[x] += oldPositions[x];
      }
    }

    return { positions, splittersHit };
  }

  solutionA(manifold: TachyonManifold): number {
    let positions: number[] = new Array(manifold.width).fill(0);
    positions[manifold.start] = 1;

    let totalSplits = 0;
    for (const splitters of manifold.splitters) {
      let result = this.applyTo(positions, splitters);
      positions = result.positions;
      totalSplits += result.splittersHit;
    }

    return totalSplits;
  }

  solutionB(manifold: TachyonManifold): number {
    let positions: number[] = new Array(manifold.width).fill(0);
    positions[manifold.start] = 1;

    for (const splitters of manifold.splitters) {
      let result = this.applyTo(positions, splitters);
      positions = result.positions;
    }

    return positions.reduce((acc, next) => acc + next, 0);
  }
}
