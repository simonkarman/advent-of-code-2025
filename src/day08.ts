import { ClassicDay } from './day';

type Position = {
  x: number;
  y: number;
  z: number;
}

export class Day08 implements ClassicDay<Position> {
  transformInput(lines: string[]): Position[] {
    return lines.map(l => l.split(',').map(Number)).map(([x, y, z]) => ({ x, y, z }));
  }

  getAnswers = () => ({
    exampleA: 40,
    a: 79560,
    exampleB: 25272,
    b: 31182420,
  })

  private distance(a: Position, b: Position): number {
    return Math.sqrt(
      Math.pow(b.x - a.x, 2) +
      Math.pow(b.y - a.y, 2) +
      Math.pow(b.z - a.z, 2),
    );
  }

  private findCircuits = (
    boxes: Position[],
    stopCondition: (info: { numberOfConnections: number, largestCircuitSize: number }) => boolean,
  ) => {
    const distances: { fromIndex: number, toIndex: number, distance: number }[] = [];
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        distances.push({ fromIndex: i, toIndex: j, distance: this.distance(boxes[i], boxes[j]) });
      }
    }
    distances.sort((a, b) => a.distance - b.distance);

    let circuits: { boxesIndices: number[] }[] = [];
    const findCircuitIndexContainingBoxIndex = (boxIndex: number): number | undefined => {
      for (let i = 0; i < circuits.length; i++) {
        if (circuits[i].boxesIndices.includes(boxIndex)) {
          return i;
        }
      }
    };
    let numberOfConnections = 0;
    let lastMatch = { fromIndex: 0, toIndex: 0, distance: 0 };
    while (!stopCondition({ numberOfConnections, largestCircuitSize: circuits[0]?.boxesIndices.length ?? 0 })) {
      const distance = distances.shift()!;
      const circuitFromIndex = findCircuitIndexContainingBoxIndex(distance.fromIndex);
      const circuitToIndex = findCircuitIndexContainingBoxIndex(distance.toIndex);

      const numberOfMatches = [circuitFromIndex, circuitToIndex].filter(v => v !== undefined).length;

      // If neither box is in a circuit, create a new circuit
      if (numberOfMatches === 0) {
        circuits.push({ boxesIndices: [distance.fromIndex, distance.toIndex] });
      }
      // If one box is in a circuit, add the other box to that circuit
      else if (numberOfMatches === 1) {
        if (circuitFromIndex !== undefined) {
          circuits[circuitFromIndex].boxesIndices.push(distance.toIndex);
        } else if (circuitToIndex !== undefined) {
          circuits[circuitToIndex].boxesIndices.push(distance.fromIndex);
        }
      }
      // If both boxes are in different circuits, merge the circuits
      else if (numberOfMatches === 2) {
        if (circuitFromIndex !== circuitToIndex) {
          const circuitFrom = circuits[circuitFromIndex!];
          const circuitTo = circuits[circuitToIndex!];
          circuitFrom.boxesIndices.push(...circuitTo.boxesIndices);
          circuits.splice(circuitToIndex!, 1);
        } else {
          // Both boxes are already in the same circuit, do nothing
        }
      }

      numberOfConnections += 1;
      lastMatch = distance;
    }
    return { circuits, lastMatch };
  };

  solutionA(boxes: Position[]): number {
    const isExample = boxes.length <= 30;
    const maxNumberOfConnections = isExample ? 10 : 1000;
    let result = this.findCircuits(boxes, ({ numberOfConnections }) => numberOfConnections >= maxNumberOfConnections);
    return result.circuits
      .map(c => c.boxesIndices.length)
      .toSorted((a, b) => b - a)
      .slice(0, 3)
      .reduce((a, b) => a * b, 1);
  }

  solutionB(boxes: Position[]): number {
    let result = this.findCircuits(boxes, ({ largestCircuitSize }) => largestCircuitSize >= boxes.length);
    return boxes[result.lastMatch.fromIndex].x * boxes[result.lastMatch.toIndex].x;
  }
}
