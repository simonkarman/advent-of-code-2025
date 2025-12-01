export type Skip = '--skip--';
export const Skip: Skip = '--skip--';

interface Answers<Result> {
  exampleA: Result | Skip;
  a: Result | Skip;
  exampleB: Result | Skip
  b: Result | Skip;
}

export interface Day<Input, Result> {
  transformInput(input: string[]): Input;
  getAnswers(): Answers<Result>;
  solutionA(input: Input): Result;
  solutionB(input: Input): Result;
}
export interface ClassicDay<Input> extends Day<Input[], number> {}
