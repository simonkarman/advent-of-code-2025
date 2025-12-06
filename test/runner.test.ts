import * as fs from 'fs';
import { describe, test, expect } from 'vitest';
import { Day, Skip } from '../src/day';
import { Day00 } from '../src/day00';
import { Day01 } from '../src/day01';
import { Day02 } from '../src/day02';
import { Day03 } from '../src/day03';
import { Day04 } from '../src/day04';
import { Day05 } from '../src/day05';
import { Day06 } from '../src/day06';

const days: Day<unknown, unknown>[] = [
  new Day00(),
  new Day01(),
  new Day02(),
  new Day03(),
  new Day04(),
  new Day05(),
  new Day06(),
];

const runner = (shouldSkip: boolean) => shouldSkip ? test.skip : test;

days.map(day => {
  const loadInputFrom = (fileName: string): unknown => {
    return day.transformInput(fs.readFileSync(`./input/${fileName.toLowerCase()}`).toString().trimRight().split('\n'));
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
