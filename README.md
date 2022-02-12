# CrosswordBuilder

This library auto-generates crossword puzzles given a list of words. It's a buggy toy at the moment, but it does generate reasonable puzzles.

The algorith used is inefficient as it tries to place new words on an index of open letters which scales poorly. This has been somewhat mitigated by transitioning to a generator that produces puzzles incrementally and can return puzzles at any arbitrary point while executing.

```ts
// Make a new builder
const builder = newCrosswordBuilder();

// Add some words
builder.addWord('one');
builder.addWord('two');
builder.addWord('three');
builder.addWord('four');

// Give it at most a second to think
builder.buffer(1000);

// Take a look at the valid puzzles generated so far, ordered by their score
builder.validPuzzles();
```

## What do you mean by score?

Right now score means `surface area / word intersections`, where smaller is better. This is on my list of things to change over time.

Thoughts on improvements / variations on scoring:

- Value symmetry around the axis
- Value balanced quadrants
- Value fewer blank spaces

As boards generate, boards are thrown out when they are impossible to render (when different letters occupy the same space). Boards with adjacent letters that aren't currently part of words are kept as they may become valid with more words.

Since reasonably complicated boards have nearly infinite permutations, I am considering expoloring the search space in a random order.
