import { ClassicDay } from './day';

interface MathProblem {
  inputs: number[];
  operation: '*' | '+';
}

export class Day06 implements ClassicDay<string> {
  transformInput(lines: string[]): string[] {
    return lines.map(line => line.substr(0, line.length - 1));
  }

  getAnswers = () => ({
    exampleA: 4277556,
    a: 5552221122013,
    exampleB: 3263827,
    b: 11371597126232,
  });

  private solve(mathProblem: MathProblem): number {
    if (mathProblem.operation === '+') {
      return mathProblem.inputs.reduce((a, b) => a + b, 0);
    }
    return mathProblem.inputs.reduce((a, b) => a * b, 1);
  }

  solutionA(lines: string[]): number {
    const mathProblems: MathProblem[] = lines[0].split(/\s+/g).map(() => ({ inputs: [], operation: '+' }));
    lines.forEach(line => {
      line.trim().split(/\s+/g).forEach((part, i) => {
        if (part === '*' || part === '+') {
          mathProblems[i].operation = part as '*' | '+';
          return;
        }
        mathProblems[i].inputs.push(Number.parseInt(part, 10));
      });
    });
    return mathProblems.reduce((acc, p) => this.solve(p) + acc, 0);
  }

  solutionB(lines: string[]): number {
    const width = lines[0].length;
    const height = lines.length;
    let total = 0;
    const currentMathProblem: MathProblem = { inputs: [], operation: '+' };
    for (let x = width - 1; x >= 0; x--) {
      // Form number
      let numbers = '';
      for (let y = 0; y < height - 1; y++) {
        numbers += lines[y][x];
      }
      numbers = numbers.trim();
      if (numbers === '') {
        continue;
      }
      currentMathProblem.inputs.push(Number.parseInt(numbers, 10));

      // Check if this ends the math problem
      const operationChar = lines[height - 1][x];
      if (operationChar === '+' || operationChar === '*') {
        currentMathProblem.operation = operationChar as '*' | '+';

        // Solve current math problem
        total += this.solve(currentMathProblem);

        // Reset for next math problem
        currentMathProblem.inputs = [];
        currentMathProblem.operation = '+';
      }
    }
    return total;
  }
}
