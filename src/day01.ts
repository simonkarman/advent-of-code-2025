import { ClassicDay } from './day';

interface Rotation {
  direction: 'L' | 'R',
  distance: number,
}

export class Day01 implements ClassicDay<Rotation> {
  transformInput(lines: string[]): Rotation[] {
    return lines.map(e => ({
      direction: e[0] as Rotation['direction'],
      distance: Number.parseInt(e.slice(1)),
    }));
  }

  getAnswers = () => ({
    exampleA: 3,
    a: 1102,
    exampleB: 6,
    b: 6175,
  })

  solutionA(entries: Rotation[]): number {
    let dial = 50;
    let timesAtZero = 0;
    for (const entry of entries) {
      if (entry.direction === 'L') {
        dial -= entry.distance;
      } else {
        dial += entry.distance;
      }

      dial = ((dial % 100) + 100) % 100;

      if (dial === 0) {
        timesAtZero += 1;
      }
    }
    return timesAtZero;
  }

  solutionB(entries: Rotation[]): number {
    let dial = 50;
    let timesThroughZero = 0;
    for (const entry of entries) {
      if (entry.direction === 'L') {
        if (dial - entry.distance <= 0) {
          timesThroughZero += (dial === 0 ? 0 : 1) + Math.floor((entry.distance - dial) / 100);
        }
        dial -= entry.distance;
      } else {
        if (dial + entry.distance >= 100) {
          timesThroughZero += 1 + Math.floor((entry.distance - (100 - dial)) / 100);
        }
        dial += entry.distance;
      }

      dial = ((dial % 100) + 100) % 100;
    }
    return timesThroughZero;
  }
}

/*
1
1
2
2
3
4
4
5
5
6
 */
