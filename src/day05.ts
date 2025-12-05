import { Day } from './day';

type Operation = {
  position: number;
  operation: 'ingredient' | 'start' | 'end';
}

type Inventory = {
  operations: Operation[];
};

export class Day05 implements Day<Inventory, number> {
  transformInput(lines: string[]): Inventory {
    const operations: Operation[] = [];
    lines.forEach(line => {
      // Skip the empty line
      if (line.trim() === '') {
        return;
      }

      if (line.includes('-')) {
        const [start, end] = line.split('-').map(v => Number.parseInt(v, 10));
        operations.push(
          { position: start, operation: 'start' },
          { position: end, operation: 'end' },
        );
      } else {
        operations.push({ position: Number.parseInt(line, 10), operation: 'ingredient' });
      }
    });
    operations.sort((a, b) => {
      if (a.position === b.position) {
        const order = ['start', 'ingredient', 'end'];
        return order.indexOf(a.operation) - order.indexOf(b.operation);
      }
      return a.position - b.position;
    });
    return {
      operations,
    };
  }

  getAnswers = () => ({
    exampleA: 3,
    a: 567,
    exampleB: 14,
    b: 354149806372909,
  })

  solutionA(inventory: Inventory): number {
    let currentRangeDepth = 0;
    let numberOfValidIngredients = 0;
    inventory.operations.forEach(operation => {
      if (operation.operation === 'start') {
        currentRangeDepth += 1;
      } else if (operation.operation === 'end') {
        currentRangeDepth -= 1;
      } else if (operation.operation === 'ingredient') {
        if (currentRangeDepth > 0) {
          numberOfValidIngredients += 1;
        }
      }
    });
    return numberOfValidIngredients;
  }

  solutionB(inventory: Inventory): number {
    let startAt = 0;
    let currentRangeDepth = 0;
    let numberOfValidIngredients = 0;
    inventory.operations.forEach(operation => {
      if (operation.operation === 'ingredient') {
        return;
      }

      if (currentRangeDepth === 0) {
        startAt = operation.position;
      }

      if (operation.operation === 'start') {
        currentRangeDepth += 1;
      } else if (operation.operation === 'end') {
        currentRangeDepth -= 1;
        if (currentRangeDepth === 0) {
          numberOfValidIngredients += (operation.position - startAt + 1);
        }
      }
    });
    return numberOfValidIngredients;
  }
}
