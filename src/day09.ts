import { ClassicDay } from './day';

interface Point { x: number, y: number }

export class Day09 implements ClassicDay<Point> {
  transformInput(lines: string[]): Point[] {
    return lines.map(l => l.split(',').map(Number)).map(([x, y]) => ({ x, y }));
  }

  getAnswers = () => ({
    exampleA: 50,
    a: 4777824480,
    exampleB: 24,
    b: 1542119040,
  })

  solutionA(points: Point[]): number {
    let largestRectangleSize = 0;
    for (let pointAIndex = 0; pointAIndex < points.length; pointAIndex++) {
      const pointA = points[pointAIndex];
      for (let pointBIndex = pointAIndex + 1; pointBIndex < points.length; pointBIndex++) {
        const pointB = points[pointBIndex];
        const rectangleSize = (Math.abs(pointB.x - pointA.x) + 1) * (Math.abs(pointB.y - pointA.y) + 1);
        if (rectangleSize > largestRectangleSize) {
          largestRectangleSize = rectangleSize;
        }
      }
    }
    return largestRectangleSize;
  }

  solutionB(_points: Point[]): number {
    const minX = Math.min(..._points.map(p => p.x)) - 1;
    const minY = Math.min(..._points.map(p => p.y)) - 1;
    const __points = _points.map((p) => ({ x: p.x - minX, y: p.y - minY }));

    const xs = __points.map(p => p.x).toSorted((a, b) => a - b).filter((_, i) => i % 2 === 0);
    const ys = __points.map(p => p.y).toSorted((a, b) => a - b).filter((_, i) => i % 2 === 0);
    const points = __points.map(p => ({ x: 1 + xs.indexOf(p.x) * 2, y: 1 + ys.indexOf(p.y) * 2 }));

    const grid: number[][] = [];
    const width = Math.max(...points.map(p => p.x)) + 1;
    const height = Math.max(...points.map(p => p.y)) + 1;

    for (let y = 0; y <= height; y++) {
      grid[y] = [];
      for (let x = 0; x <= width; x++) {
        grid[y][x] = 0;
      }
    }

    points.forEach((p, pIndex) => {
      grid[p.y][p.x] = 1;
      const nextPoint = points[(pIndex + 1) % points.length];
      const deltaX = Math.sign(nextPoint.x - p.x);
      const deltaY = Math.sign(nextPoint.y - p.y);
      if (deltaX !== 0) {
        let currentX = p.x + deltaX;
        while (currentX !== nextPoint.x) {
          if (grid[p.y][currentX] === 0) {
            grid[p.y][currentX] = 2;
          }
          currentX += deltaX;
        }
      }
      if (deltaY !== 0) {
        let currentY = p.y + deltaY;
        while (currentY !== nextPoint.y) {
          if (grid[currentY][p.x] === 0) {
            grid[currentY][p.x] = 2;
          }
          currentY += deltaY;
        }
      }
    });

    // Flood fill all cells with -1 that are 0 and connected to the border
    let open = [{ x: 0, y: 0 }];
    const floodFill = (x: number, y: number) => {
      if (x < 0 || x > width || y < 0 || y > height) {
        return;
      }
      if (grid[y][x] !== 0) {
        return;
      }
      grid[y][x] = -1;
      const add = (nx: number, ny: number) => {
        if (nx < 0 || nx > width || ny < 0 || ny > height) {
          return;
        }
        if (grid[ny][nx] !== 0) {
          return;
        }
        open.push({ x: nx, y: ny });
      };
      add(x + 1, y);
      add(x - 1, y);
      add(x, y + 1);
      add(x, y - 1);
    };
    while (open.length > 0) {
      const point = open.pop()!;
      floodFill(point.x, point.y);
    }

    // Log grid for debugging
    // for (let y = 0; y <= height; y++) {
    //   console.log(grid[y].map(v => v === -1 ? '.' : v === 1 ? '#' : 'X').join(''));
    // }

    const hasOnlyValidPoints = (pointA: Point, pointB: Point): boolean => {
      for (let y = Math.min(pointA.y, pointB.y); y <= Math.max(pointA.y, pointB.y); y++) {
        for (let x = Math.min(pointA.x, pointB.x); x <= Math.max(pointA.x, pointB.x); x++) {
          if (grid[y][x] < 0) {
            return false;
          }
        }
      }
      return true;
    };

    let largestRectangleSize = 0;
    for (let pointAIndex = 0; pointAIndex < points.length; pointAIndex++) {
      for (let pointBIndex = pointAIndex + 1; pointBIndex < points.length; pointBIndex++) {
        const pointA = _points[pointAIndex];
        const pointB = _points[pointBIndex];
        const rectangleSize = (Math.abs(pointB.x - pointA.x) + 1) * (Math.abs(pointB.y - pointA.y) + 1);
        if (
          rectangleSize > largestRectangleSize &&
          hasOnlyValidPoints(points[pointAIndex], points[pointBIndex])
        ) {
          largestRectangleSize = rectangleSize;
        }
      }
    }
    return largestRectangleSize;
  }
}
