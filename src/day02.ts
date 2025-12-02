import { ClassicDay } from './day';

type ProductRange = { start: number, end: number };

export class Day02 implements ClassicDay<ProductRange> {
  transformInput(lines: string[]): ProductRange[] {
    return lines[0].split(',').map(s => {
      const [a, b] = s.split('-').map(n => Number.parseInt(n, 10));
      return { start: a, end: b };
    });
  }

  getAnswers = () => ({
    exampleA: 1227775554,
    a: 24157613387,
    exampleB: 4174379265,
    b: 33832678380,
  })

  private arrayFromTo(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  }

  private isRepeatedSequence(s: string): boolean {
    // Immediate rejection for odd length strings
    if (s.length % 2 === 1) {
      return false;
    }

    const firstHalf = s.slice(0, s.length / 2);
    const secondHalf = s.slice(s.length / 2);
    return firstHalf === secondHalf;
  }

  solutionA(ranges: ProductRange[]): number {
    return ranges
      .flatMap(range => this.arrayFromTo(range.start, range.end))
      .filter(n => this.isRepeatedSequence(n.toString()))
      .reduce((sum, n) => sum + n, 0);
  }

  private hasRepeatedSequence(s: string): boolean {
    const dividers: number[] = [];
    for (let i = 1; i <= s.length / 2; i++) {
      if (s.length % i === 0) {
        dividers.push(i);
      }
    }

    // Check for each divisor if there is a repeated sequence
    return dividers.some(d => {
      const segments: string[] = [];
      for (let i = 0; i < s.length; i += d) {
        segments.push(s.slice(i, i + d));
      }
      return segments.every(seg => seg === segments[0]);
    });
  }

  solutionB(ranges: ProductRange[]): number {
    return ranges
      .flatMap(range => this.arrayFromTo(range.start, range.end))
      .filter(n => this.hasRepeatedSequence(n.toString()))
      .reduce((sum, n) => sum + n, 0);
  }
}
