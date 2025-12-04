import { Day, Skip } from './day';

class Grid {
  public width: number;
  public height: number;
  public cells: boolean[];

  constructor(lines: string[]) {
    this.width = lines[0].length;
    this.height = lines.length;
    this.cells = lines.flatMap(line => line.split('').map(c => c === '@'));
  }

  getXY(index: number): { x: number; y: number } | undefined {
    if (index < 0 || index >= this.cells.length) {
      return undefined;
    }
    const y = Math.floor(index / this.width);
    const x = index % this.width;
    return { x, y };
  }

  getIndex(x: number, y: number): number | undefined {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return undefined;
    }
    return y * this.width + x;
  }

  getCell(x: number, y: number): boolean | undefined {
    const index = this.getIndex(x, y);
    if (index === undefined) {
      return undefined;
    }
    return this.cells[index];
  }

  public getAccessiblePaperRolls(): number[] {
    return this.cells.map((cell, cellIndex) => {
      // Skip any cell that is not a paper roll
      if (!cell) {
        return undefined;
      }

      // Check all adjacent cells
      const { x, y } = this.getXY(cellIndex)!;
      let numberOfAdjacentPaperRolls = 0;
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) {
            continue; // Skip self
          }
          const adjacentCell = this.getCell(x + dx, y + dy);
          if (adjacentCell === true) {
            numberOfAdjacentPaperRolls += 1;
          }
        }
      }

      return numberOfAdjacentPaperRolls < 4 ? cellIndex : undefined;
    }).filter(cellIndex => cellIndex !== undefined) as number[];
  }
};

export class Day04 implements Day<Grid, number> {
  transformInput(lines: string[]): Grid {
    return new Grid(lines);
  }

  getAnswers = () => ({
    exampleA: 13,
    a: 1376,
    exampleB: 43,
    b: 8587,
  })

  solutionA(grid: Grid): number {
    return grid.getAccessiblePaperRolls().length;
  }

  solutionB(grid: Grid): number {
    let totalRemoved = 0;
    while (true) {
      const accessibleRolls = grid.getAccessiblePaperRolls();
      if (accessibleRolls.length === 0) {
        return totalRemoved;
      }
      totalRemoved += accessibleRolls.length;

      // Remove accessible rolls
      for (const index of accessibleRolls) {
        grid.cells[index] = false;
      }
    }
  }
}
