import * as fs from 'fs';
import { Day, Skip } from '../src/day';
import { Day00 } from '../src/day00';

const days: Day<unknown, unknown>[] = [
  new Day00(),
];

const runner = (shouldSkip: boolean) => shouldSkip ? test.skip : test;

days.map(day => {
  const loadInputFrom = (fileName: string): unknown => {
    return day.transformInput(fs.readFileSync(`./input/${fileName.toLowerCase()}`).toString().split('\n'));
  };
  const loadExampleInput = () => loadInputFrom(`${day.constructor.name}example.txt`);
  const loadInput = () => loadInputFrom(`${day.constructor.name}.txt`);
  const answers = day.getAnswers();

  describe(day.constructor.name, () => {
    describe('A', () => {
      runner(answers.exampleA === Skip)('example', () => {
        expect(day.solutionA(loadExampleInput())).toBe(answers.exampleA);
      });
      runner(answers.a === Skip)('answer', () => {
        expect(day.solutionA(loadInput())).toBe(answers.a);
      });
    });
    describe('B', () => {
      runner(answers.exampleB === Skip)('example', () => {
        expect(day.solutionB(loadExampleInput())).toBe(answers.exampleB);
      });
      runner(answers.b === Skip)('answer', () => {
        expect(day.solutionB(loadInput())).toBe(answers.b);
      });
    });
  });
});
