import { ClassicDay, Skip } from './day';

// After initializing this day you still need to do the following
//  two steps manually:
//   1) Update class name
//   2) Add this day to the tests
export class Day00 implements ClassicDay<string> {
  transformInput(lines: string[]): string[] {
    return lines;
  }

  getAnswers = () => ({
    exampleA: 0,
    a: Skip,
    exampleB: 0,
    b: Skip,
  })

  solutionA(entries: string[]): number {
    return 0;
  }

  solutionB(entries: string[]): number {
    return 0;
  }
}
