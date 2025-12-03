import { ClassicDay } from './day';

export class Day03 implements ClassicDay<number[]> {
  transformInput(lines: string[]): number[][] {
    return lines.map(line => line.split('').map(c => Number.parseInt(c)));
  }

  getAnswers = () => ({
    exampleA: 357,
    a: 17383,
    exampleB: 3121910778619,
    b: 172601598658203,
  })

  solutionA(banks: number[][]): number {
    return banks.map(bank => {
      const highestIndex = bank.indexOf(Math.max(...bank.slice(0, bank.length - 1)));
      const highestIndexAfter = bank.indexOf(Math.max(...bank.slice(highestIndex + 1)));
      return Number.parseInt(`${bank[highestIndex]}${bank[highestIndexAfter]}`, 10);
    }).reduce((sum, n) => sum + n, 0);
  }

  private cache: Map<string, number> = new Map();
  private solveFor(bank: number[], remainingDigits: number): number {
    if (this.cache.has(bank.join('') + '_' + remainingDigits)) {
      return this.cache.get(bank.join('') + '_' + remainingDigits)!;
    }
    const c = this._solveFor(bank, remainingDigits);
    this.cache.set(bank.join('') + '_' + remainingDigits, c);
    return c;
  }

  private _solveFor(bank: number[], remainingDigits: number): number {
    if (remainingDigits === 0) {
      throw new Error('Cannot select 0 digits');
    }
    if (remainingDigits === 1) {
      return Math.max(...bank);
    }
    // Find all highest number in the first part of the array that still would fit the other remaining digits
    let highestNumber = -1;
    let highestNumberIndices: number[] = [];
    for (let i = 0; i <= bank.length - remainingDigits; i++) {
      const currentDigit = bank[i];
      if (currentDigit > highestNumber) {
        highestNumber = currentDigit;
        highestNumberIndices = [i];
      } else if (currentDigit === highestNumber) {
        highestNumberIndices.push(i);
      }
    }

    // For each of the highest number indices, solve for the rest of the digits
    let highestResult = -1;
    for (const index of highestNumberIndices) {
      const nextPart = bank.slice(index + 1);
      const subResult = this.solveFor(nextPart, remainingDigits - 1);
      const combinedResult = Number.parseInt(`${highestNumber}${subResult}`, 10);
      if (combinedResult > highestResult) {
        highestResult = combinedResult;
      }
    }
    return highestResult;
  }

  solutionB(banks: number[][]): number {
    return banks.map((bank, index) => {
      return this.solveFor(bank, 12);
    }).reduce((sum, n) => sum + n, 0);;
  }
}
