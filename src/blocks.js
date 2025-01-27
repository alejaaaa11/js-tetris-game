import { COLORS } from "./colors";

export class Block {
  /**
   * Creates a tetris block
   * @param {number[][]} matrix squared matrix
   */
  constructor(matrix) {
    this.matrix = matrix;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.rotate(Math.round(Math.random() * 3));
  }

  rotate(n = 1) {
    if (n <= 0) return;

    for (let i = 0; i < n; i++) {
      this.matrix = this.nextRotation;
    }
  }

  get nextRotation() {
    let matrix = this.matrix.map(row => row.map(col => col));
    const N = matrix.length - 1;
    const result = matrix.map((row, i) => row.map((_, j) => matrix[N - j][i]));

    matrix.length = 0;
    matrix.push(...result);

    return matrix;
  }
}

export class L extends Block {
  constructor() {
    super([[1, 0, 0], [1, 0, 0], [1, 1, 0]]);
  }
}
export class J extends Block {
  constructor() {
    super([[0, 0, 1], [0, 0, 1], [0, 1, 1]]);
  }
}

export class T extends Block {
  constructor() {
    super([[1, 1, 1], [0, 1, 0], [0, 0, 0]]);
  }
}

export class Z extends Block {
  constructor() {
    super([[1, 1, 0], [0, 1, 1], [0, 0, 0]]);
  }
}

export class S extends Block {
  constructor() {
    super([[0, 1, 1], [1, 1, 0], [0, 0, 0]]);
  }
}

export class O extends Block {
  constructor() {
    super([[1, 1], [1, 1]]);
  }
}

export class I extends Block {
  constructor() {
    super([[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]);
  }
}

const BLOCKS = [L, J, T, O, I, S, Z];

export function createRamdomBlock() {
  const BLOCK = BLOCKS[Math.floor(Math.random() * BLOCKS.length)];
  return new BLOCK();
}
