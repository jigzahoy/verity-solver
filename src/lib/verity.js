const normalKeys = {
  c: "ts",
  t: "cs",
  s: "ct",
};

const challengeKeys = {
  c: "cc",
  t: "tt",
  s: "ss",
};

const objectToSymbols = {
  ct: ["triangle", "circle"], // cone
  cs: ["square", "circle"], // cylinder
  ts: ["triangle", "square"], // prism
  cc: ["circle", "circle"], // sphere
  tt: ["triangle", "triangle"], // pyramid
  ss: ["square", "square"], // cube
};

const symbolsToLetters = {
  circle: "C",
  square: "S",
  triangle: "T",
  left: "L",
  middle: "M",
  right: "R",
};

function shiftArrayRight(array) {
  const k = 1; // step
  for (let i = 0; i < k; i++) {
    array.unshift(array.pop());
  }
  return array;
}

export function solveVerity(inside, outside, options = { isChallenge: false }) {
  if (isInvalid(inside, outside)) {
    return [];
  }

  try {
    let requiredShapes = inside.map((obj) => normalKeys[obj]);
    if (options.isChallenge) {
      const shiftedShapes = shiftArrayRight(inside);
      requiredShapes = shiftedShapes.map((obj) => challengeKeys[obj]);
    }

    return getSwaps(outside, requiredShapes);
  } catch (e) {
    console.error(e);
    return [];
  }
}

function getSwaps(outsideShapes, requiredShapes) {
  const start = splitKeys(outsideShapes).flat();
  const target = splitKeys(requiredShapes).flat();

  const queue = [{ current: [...start], swaps: [] }];
  const visited = new Set([start.toString()]);

  while (queue.length > 0) {
    const { current, swaps } = queue.shift();

    if (current.toString() === target.toString()) {
      return swaps;
    }

    for (let i = 0; i < current.length; i++) {
      for (let j = i + 1; j < current.length; j++) {
        const swapped = [...current];
        [swapped[i], swapped[j]] = [swapped[j], swapped[i]];

        if (!visited.has(swapped.toString())) {
          visited.add(swapped.toString());
          const swapDetails = {
            symbol: current[i],
            from: getSideByIndex(i),
            swapWith: current[j],
            to: getSideByIndex(j),
            state: swapped
          };

          queue.push({ current: swapped, swaps: [...swaps, swapDetails] });
        }
      }
    }
  }

  // Invalid
  return [];
}

function getSideByIndex(index) {
  // [0, 1, 2, 3, 4, 5]
  //     L     M     R
  if (index <= 1) return "l";
  else if (index <= 3) return "m";
  else return "r";
}

function isInvalid(inside, outside) {
  const uniqueInside = new Set(inside);
  if (uniqueInside.size === 3) return false;

  const counts = { c: 0, t: 0, s: 0 };
  const outsideFlat = splitKeys(outside).flat();

  outsideFlat.forEach((el) => {
    counts[el]++;
  });

  const isOutsideValid =
    counts["c"] === 2 && counts["t"] === 2 && counts["s"] === 2;

  return !isOutsideValid;
}

function splitKeys(value) {
  return value.map((item) => item.split(/(?!$)/u));
}
