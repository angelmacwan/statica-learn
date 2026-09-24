import type { ArenaQuestion } from './types';

export const ARENA_QUESTIONS: ArenaQuestion[] = [
  // ─── Math Magic ──────────────────────────────────────────────────────────────
  {
    id: 'q-simple-interest',
    slug: 'simple-interest',
    title: 'The Bank Vault',
    category: 'math-magic',
    difficulty: 'easy',
    description: `## The Bank Vault

You're the teller at Pixel Bank. A customer walks in and wants to know how much **simple interest** they'll earn.

Write a function that takes three numbers:
- \`principal\` — the starting amount of money
- \`rate\` — the yearly interest rate (as a percentage)
- \`time\` — number of years

Return the **simple interest** earned (not the total, just the interest).

**Formula:** \`interest = (principal × rate × time) / 100\`

\`\`\`
simple_interest(1000, 5, 3)  →  150.0
simple_interest(500, 10, 2)  →  100.0
\`\`\``,
    hint: 'Just plug the numbers into the formula. No loops needed!',
    starterCode: {
      python: `def simple_interest(principal, rate, time):
    # your code here
    pass
`,
      javascript: `function simple_interest(principal, rate, time) {
  // your code here
}
exports.simple_interest = simple_interest;
`,
    },
    tests: [
      { description: 'Basic case: 1000 at 5% for 3 years', input: [1000, 5, 3], expectedOutput: 150.0 },
      { description: '500 at 10% for 2 years', input: [500, 10, 2], expectedOutput: 100.0 },
      { description: '2000 at 2% for 1 year', input: [2000, 2, 1], expectedOutput: 40.0 },
      { description: 'Zero time = zero interest', input: [5000, 8, 0], expectedOutput: 0.0 },
    ],
    tags: ['math', 'arithmetic', 'easy'],
  },
  {
    id: 'q-triangle-area',
    slug: 'triangle-area',
    title: 'Triangle Architect',
    category: 'math-magic',
    difficulty: 'easy',
    description: `## Triangle Architect

You're designing a triangular roof for a tiny house. To order materials you need the **area** of the triangle.

Write a function that takes the \`base\` and \`height\` of a triangle and returns its area.

**Formula:** \`area = 0.5 × base × height\`

\`\`\`
triangle_area(10, 5)   →  25.0
triangle_area(6, 4)    →  12.0
\`\`\``,
    hint: 'Area = half base times height.',
    starterCode: {
      python: `def triangle_area(base, height):
    # your code here
    pass
`,
      javascript: `function triangle_area(base, height) {
  // your code here
}
exports.triangle_area = triangle_area;
`,
    },
    tests: [
      { description: 'Base 10, height 5', input: [10, 5], expectedOutput: 25.0 },
      { description: 'Base 6, height 4', input: [6, 4], expectedOutput: 12.0 },
      { description: 'Base 3, height 8', input: [3, 8], expectedOutput: 12.0 },
      { description: 'Both 1', input: [1, 1], expectedOutput: 0.5 },
    ],
    tags: ['math', 'geometry', 'easy'],
  },
  {
    id: 'q-sum-of-squares',
    slug: 'sum-of-squares',
    title: 'Square Summoner',
    category: 'math-magic',
    difficulty: 'easy',
    description: `## Square Summoner

A wizard needs the sum of squares from 0 to n (inclusive) to power their spell.

Write a function that takes a number \`n\` and returns:

\`0² + 1² + 2² + ... + n²\`

\`\`\`
sum_of_squares(3)  →  14   (0 + 1 + 4 + 9)
sum_of_squares(4)  →  30   (0 + 1 + 4 + 9 + 16)
\`\`\``,
    hint: 'Loop from 0 to n and keep adding the square of each number.',
    starterCode: {
      python: `def sum_of_squares(n):
    # your code here
    pass
`,
      javascript: `function sum_of_squares(n) {
  // your code here
}
exports.sum_of_squares = sum_of_squares;
`,
    },
    tests: [
      { description: 'n = 3', input: [3], expectedOutput: 14 },
      { description: 'n = 4', input: [4], expectedOutput: 30 },
      { description: 'n = 0', input: [0], expectedOutput: 0 },
      { description: 'n = 5', input: [5], expectedOutput: 55 },
    ],
    tags: ['math', 'loops', 'easy'],
  },

  // ─── Number Crunching ─────────────────────────────────────────────────────
  {
    id: 'q-max-of-two',
    slug: 'max-of-two',
    title: 'Pick the Winner',
    category: 'number-crunching',
    difficulty: 'easy',
    description: `## Pick the Winner

Two numbers walk into a contest. Only the bigger one gets the trophy.

Write a function that takes two numbers \`a\` and \`b\` and returns the **larger** one. If they're equal, return either one.

\`\`\`
max_of_two(3, 7)   →  7
max_of_two(10, 5)  →  10
max_of_two(4, 4)   →  4
\`\`\``,
    hint: 'A simple if-else is all you need. No built-in max()!',
    starterCode: {
      python: `def max_of_two(a, b):
    # your code here
    pass
`,
      javascript: `function max_of_two(a, b) {
  // your code here
}
exports.max_of_two = max_of_two;
`,
    },
    tests: [
      { description: '3 vs 7', input: [3, 7], expectedOutput: 7 },
      { description: '10 vs 5', input: [10, 5], expectedOutput: 10 },
      { description: 'Equal numbers', input: [4, 4], expectedOutput: 4 },
      { description: 'Negatives', input: [-3, -1], expectedOutput: -1 },
    ],
    tags: ['conditionals', 'easy'],
  },
  {
    id: 'q-max-of-three',
    slug: 'max-of-three',
    title: 'The Three-Way Duel',
    category: 'number-crunching',
    difficulty: 'easy',
    description: `## The Three-Way Duel

Three numbers enter the arena. Only the greatest survives.

Write a function that takes three numbers \`a\`, \`b\`, \`c\` and returns the **largest**.

\`\`\`
max_of_three(3, 7, 5)    →  7
max_of_three(10, 5, 15)  →  15
max_of_three(1, 1, 1)    →  1
\`\`\``,
    hint: 'Compare them one by one. Find the max of two, then compare with the third.',
    starterCode: {
      python: `def max_of_three(a, b, c):
    # your code here
    pass
`,
      javascript: `function max_of_three(a, b, c) {
  // your code here
}
exports.max_of_three = max_of_three;
`,
    },
    tests: [
      { description: '3, 7, 5', input: [3, 7, 5], expectedOutput: 7 },
      { description: '10, 5, 15', input: [10, 5, 15], expectedOutput: 15 },
      { description: 'All equal', input: [1, 1, 1], expectedOutput: 1 },
      { description: 'First is biggest', input: [100, 2, 3], expectedOutput: 100 },
    ],
    tags: ['conditionals', 'easy'],
  },
  {
    id: 'q-sum-of-digits',
    slug: 'sum-of-digits',
    title: 'Digit Collector',
    category: 'number-crunching',
    difficulty: 'easy',
    description: `## Digit Collector

A quirky robot only eats the **sum of digits** of a number as fuel.

Write a function that takes a list of numbers and returns the **sum of all the numbers** in the list.

\`\`\`
sum_list([1, 2, 3, 4])      →  10
sum_list([10, 20, 30])      →  60
sum_list([5])               →  5
\`\`\``,
    hint: 'Start at 0 and loop through, adding each number.',
    starterCode: {
      python: `def sum_list(numbers):
    # your code here
    pass
`,
      javascript: `function sum_list(numbers) {
  // your code here
}
exports.sum_list = sum_list;
`,
    },
    tests: [
      { description: '[1, 2, 3, 4]', input: [[1, 2, 3, 4]], expectedOutput: 10 },
      { description: '[10, 20, 30]', input: [[10, 20, 30]], expectedOutput: 60 },
      { description: 'Single element', input: [[5]], expectedOutput: 5 },
      { description: 'Empty list', input: [[]], expectedOutput: 0 },
    ],
    tags: ['lists', 'loops', 'easy'],
  },
  {
    id: 'q-reverse-number',
    slug: 'reverse-number',
    title: 'The Mirror Machine',
    category: 'number-crunching',
    difficulty: 'medium',
    description: `## The Mirror Machine

You found an old machine that reverses numbers. Feed it 123 and it spits out 321.

Write a function that takes a positive integer \`n\` and returns the number with its digits reversed.

\`\`\`
reverse_number(123)   →  321
reverse_number(1000)  →  1
reverse_number(456)   →  654
\`\`\``,
    hint: 'Use modulo (%) to grab the last digit, then floor division (//) to chop it off. Build the reversed number digit by digit.',
    starterCode: {
      python: `def reverse_number(n):
    # your code here
    pass
`,
      javascript: `function reverse_number(n) {
  // your code here
}
exports.reverse_number = reverse_number;
`,
    },
    tests: [
      { description: '123 → 321', input: [123], expectedOutput: 321 },
      { description: '1000 → 1 (leading zeros drop)', input: [1000], expectedOutput: 1 },
      { description: '456 → 654', input: [456], expectedOutput: 654 },
      { description: 'Single digit', input: [7], expectedOutput: 7 },
    ],
    tags: ['math', 'loops', 'medium'],
  },

  // ─── String Sorcery ───────────────────────────────────────────────────────
  {
    id: 'q-reverse-string',
    slug: 'reverse-string',
    title: 'Backwards Translator',
    category: 'string-sorcery',
    difficulty: 'easy',
    description: `## Backwards Translator

You've discovered an ancient tribe that reads everything backwards. Help translate messages for them!

Write a function that takes a string and returns it **reversed**.

\`\`\`
reverse_string("hello")        →  "olleh"
reverse_string("Hello World")  →  "dlroW olleH"
reverse_string("abc")          →  "cba"
\`\`\``,
    hint: 'Loop through the string and build the reversed version by prepending each character.',
    starterCode: {
      python: `def reverse_string(s):
    # your code here
    pass
`,
      javascript: `function reverse_string(s) {
  // your code here
}
exports.reverse_string = reverse_string;
`,
    },
    tests: [
      { description: '"hello"', input: ['hello'], expectedOutput: 'olleh' },
      { description: '"Hello World"', input: ['Hello World'], expectedOutput: 'dlroW olleH' },
      { description: '"abc"', input: ['abc'], expectedOutput: 'cba' },
      { description: 'Single char', input: ['z'], expectedOutput: 'z' },
    ],
    tags: ['strings', 'loops', 'easy'],
  },
  {
    id: 'q-reverse-words',
    slug: 'reverse-words',
    title: 'Word Flipper',
    category: 'string-sorcery',
    difficulty: 'easy',
    description: `## Word Flipper

A prankster swapped all the words in your messages around. Write a function to flip them back!

Given a sentence, reverse the **order of the words** (not the letters).

\`\`\`
reverse_words("Hello young Programmer")  →  "Programmer young Hello"
reverse_words("one two three")           →  "three two one"
\`\`\``,
    hint: 'Split the sentence into a list of words, reverse the list, then join them back with spaces.',
    starterCode: {
      python: `def reverse_words(sentence):
    # your code here
    pass
`,
      javascript: `function reverse_words(sentence) {
  // your code here
}
exports.reverse_words = reverse_words;
`,
    },
    tests: [
      { description: 'Three words', input: ['Hello young Programmer'], expectedOutput: 'Programmer young Hello' },
      { description: '"one two three"', input: ['one two three'], expectedOutput: 'three two one' },
      { description: 'Single word', input: ['hello'], expectedOutput: 'hello' },
      { description: 'Two words', input: ['cat dog'], expectedOutput: 'dog cat' },
    ],
    tags: ['strings', 'easy'],
  },
  {
    id: 'q-check-palindrome',
    slug: 'check-palindrome',
    title: 'Palindrome Detective',
    category: 'string-sorcery',
    difficulty: 'easy',
    description: `## Palindrome Detective

A palindrome is a word that reads the same forwards and backwards — like "racecar" or "madam". Pretty cool, right?

Write a function that returns \`True\` (or \`true\` in JS) if the string is a palindrome, and \`False\` otherwise. Ignore case.

\`\`\`
is_palindrome("racecar")  →  True
is_palindrome("hello")    →  False
is_palindrome("Madam")    →  True
\`\`\``,
    hint: 'Convert to lowercase first, then compare the string with its reverse.',
    starterCode: {
      python: `def is_palindrome(s):
    # your code here
    pass
`,
      javascript: `function is_palindrome(s) {
  // your code here
}
exports.is_palindrome = is_palindrome;
`,
    },
    tests: [
      { description: '"racecar"', input: ['racecar'], expectedOutput: true },
      { description: '"hello"', input: ['hello'], expectedOutput: false },
      { description: '"Madam" (case insensitive)', input: ['Madam'], expectedOutput: true },
      { description: '"level"', input: ['level'], expectedOutput: true },
      { description: '"python"', input: ['python'], expectedOutput: false },
    ],
    tags: ['strings', 'easy'],
  },
  {
    id: 'q-remove-duplicates',
    slug: 'remove-duplicate-chars',
    title: 'Clone Buster',
    category: 'string-sorcery',
    difficulty: 'easy',
    description: `## Clone Buster

An evil machine keeps duplicating characters in your strings. Your job is to remove all the clones!

Write a function that takes a string and returns a new string with all **duplicate characters removed**, keeping only the first occurrence of each character.

\`\`\`
remove_duplicates("programming")  →  "progamin"
remove_duplicates("hello")        →  "helo"
remove_duplicates("aabbcc")       →  "abc"
\`\`\``,
    hint: 'Loop through the string. Only add a character to your result if it is not already there.',
    starterCode: {
      python: `def remove_duplicates(s):
    # your code here
    pass
`,
      javascript: `function remove_duplicates(s) {
  // your code here
}
exports.remove_duplicates = remove_duplicates;
`,
    },
    tests: [
      { description: '"programming"', input: ['programming'], expectedOutput: 'progamin' },
      { description: '"hello"', input: ['hello'], expectedOutput: 'helo' },
      { description: '"aabbcc"', input: ['aabbcc'], expectedOutput: 'abc' },
      { description: 'No duplicates', input: ['abc'], expectedOutput: 'abc' },
    ],
    tags: ['strings', 'easy'],
  },

  // ─── Conversions ─────────────────────────────────────────────────────────
  {
    id: 'q-celsius-to-fahrenheit',
    slug: 'celsius-to-fahrenheit',
    title: 'Weather Wizard',
    category: 'math-magic',
    difficulty: 'easy',
    description: `## Weather Wizard

Your friend in the US keeps sending temperatures in Fahrenheit, but you think in Celsius. Let's fix that — the other way round.

Write a function that converts a temperature from **Celsius to Fahrenheit**.

**Formula:** \`F = (C × 9/5) + 32\`

\`\`\`
celsius_to_fahrenheit(0)    →  32.0
celsius_to_fahrenheit(100)  →  212.0
celsius_to_fahrenheit(37)   →  98.6
\`\`\``,
    hint: 'Just plug the value into the formula.',
    starterCode: {
      python: `def celsius_to_fahrenheit(c):
    # your code here
    pass
`,
      javascript: `function celsius_to_fahrenheit(c) {
  // your code here
}
exports.celsius_to_fahrenheit = celsius_to_fahrenheit;
`,
    },
    tests: [
      { description: '0°C = 32°F', input: [0], expectedOutput: 32.0 },
      { description: '100°C = 212°F', input: [100], expectedOutput: 212.0 },
      { description: '37°C ≈ 98.6°F', input: [37], expectedOutput: 98.60000000000001 },
      { description: '-40°C = -40°F', input: [-40], expectedOutput: -40.0 },
    ],
    tags: ['math', 'conversions', 'easy'],
  },
  {
    id: 'q-decimal-to-binary',
    slug: 'decimal-to-binary',
    title: 'Binary Decoder',
    category: 'math-magic',
    difficulty: 'medium',
    description: `## Binary Decoder

Computers secretly speak in 0s and 1s. Let's decode them!

Write a function that takes a positive integer and returns its **binary representation as a string**.

\`\`\`
decimal_to_binary(10)  →  "1010"
decimal_to_binary(5)   →  "101"
decimal_to_binary(255) →  "11111111"
\`\`\``,
    hint: 'Repeatedly divide the number by 2. Collect the remainders in reverse order.',
    starterCode: {
      python: `def decimal_to_binary(n):
    # your code here
    pass
`,
      javascript: `function decimal_to_binary(n) {
  // your code here
}
exports.decimal_to_binary = decimal_to_binary;
`,
    },
    tests: [
      { description: '10 → "1010"', input: [10], expectedOutput: '1010' },
      { description: '5 → "101"', input: [5], expectedOutput: '101' },
      { description: '255 → "11111111"', input: [255], expectedOutput: '11111111' },
      { description: '1 → "1"', input: [1], expectedOutput: '1' },
    ],
    tags: ['math', 'medium'],
  },

  // ─── List Adventures ──────────────────────────────────────────────────────
  {
    id: 'q-largest-in-list',
    slug: 'largest-in-list',
    title: 'The Big Cheese',
    category: 'list-adventures',
    difficulty: 'easy',
    description: `## The Big Cheese

Find the biggest number hiding in a list — without using Python's built-in \`max()\` or JavaScript's \`Math.max()\`.

Write a function that returns the **largest element** of a list.

\`\`\`
find_largest([3, 1, 4, 1, 5, 9, 2])  →  9
find_largest([10, 20, 5])            →  20
find_largest([-1, -5, -2])           →  -1
\`\`\``,
    hint: 'Start by assuming the first element is the largest. Loop through and update whenever you find something bigger.',
    starterCode: {
      python: `def find_largest(numbers):
    # your code here (no max() allowed!)
    pass
`,
      javascript: `function find_largest(numbers) {
  // your code here (no Math.max() allowed!)
}
exports.find_largest = find_largest;
`,
    },
    tests: [
      { description: 'Mixed numbers', input: [[3, 1, 4, 1, 5, 9, 2]], expectedOutput: 9 },
      { description: '[10, 20, 5]', input: [[10, 20, 5]], expectedOutput: 20 },
      { description: 'All negatives', input: [[-1, -5, -2]], expectedOutput: -1 },
      { description: 'Single element', input: [[42]], expectedOutput: 42 },
    ],
    tags: ['lists', 'loops', 'easy'],
  },
  {
    id: 'q-second-largest',
    slug: 'second-largest',
    title: 'The Runner-Up',
    category: 'list-adventures',
    difficulty: 'medium',
    description: `## The Runner-Up

Everyone remembers the winner. But can you find the **second biggest** number in a list?

Write a function that returns the second largest **unique** value in a list.

\`\`\`
second_largest([3, 1, 4, 5, 9, 2])  →  5
second_largest([10, 20, 5])         →  10
second_largest([1, 1, 2, 2, 3])     →  2
\`\`\``,
    hint: 'Track two variables: the largest and second_largest. Update both as you loop through.',
    starterCode: {
      python: `def second_largest(numbers):
    # your code here
    pass
`,
      javascript: `function second_largest(numbers) {
  // your code here
}
exports.second_largest = second_largest;
`,
    },
    tests: [
      { description: 'Normal list', input: [[3, 1, 4, 5, 9, 2]], expectedOutput: 5 },
      { description: '[10, 20, 5]', input: [[10, 20, 5]], expectedOutput: 10 },
      { description: 'Duplicates', input: [[1, 1, 2, 2, 3]], expectedOutput: 2 },
      { description: 'Two elements', input: [[7, 3]], expectedOutput: 3 },
    ],
    tags: ['lists', 'loops', 'medium'],
  },
  {
    id: 'q-second-smallest',
    slug: 'second-smallest',
    title: 'The Silver Medal',
    category: 'list-adventures',
    difficulty: 'medium',
    description: `## The Silver Medal

Gold is taken. Find who gets the **silver** — the second smallest number.

Write a function that returns the second smallest **unique** value in a list.

\`\`\`
second_smallest([3, 1, 4, 5, 9, 2])  →  2
second_smallest([10, 20, 5])         →  10
second_smallest([1, 1, 2, 2, 3])     →  2
\`\`\``,
    hint: 'Track the smallest and second_smallest. Update carefully when you find a new small number.',
    starterCode: {
      python: `def second_smallest(numbers):
    # your code here
    pass
`,
      javascript: `function second_smallest(numbers) {
  // your code here
}
exports.second_smallest = second_smallest;
`,
    },
    tests: [
      { description: 'Normal list', input: [[3, 1, 4, 5, 9, 2]], expectedOutput: 2 },
      { description: '[10, 20, 5]', input: [[10, 20, 5]], expectedOutput: 10 },
      { description: 'Duplicates', input: [[1, 1, 2, 2, 3]], expectedOutput: 2 },
      { description: 'Two elements', input: [[7, 3]], expectedOutput: 7 },
    ],
    tags: ['lists', 'loops', 'medium'],
  },

  // ─── Prime Time ───────────────────────────────────────────────────────────
  {
    id: 'q-check-prime',
    slug: 'check-prime',
    title: 'Prime Patrol',
    category: 'prime-time',
    difficulty: 'medium',
    description: `## Prime Patrol

Some numbers are prime — they can only be divided by 1 and themselves. Your job is to catch them!

Write a function that returns \`True\` if the given number is **prime**, and \`False\` otherwise.

\`\`\`
is_prime(7)   →  True
is_prime(10)  →  False
is_prime(2)   →  True
is_prime(1)   →  False
\`\`\``,
    hint: 'Try dividing the number by every integer from 2 up to (but not including) the number itself. If any divide evenly, it is not prime.',
    starterCode: {
      python: `def is_prime(n):
    # your code here
    pass
`,
      javascript: `function is_prime(n) {
  // your code here
}
exports.is_prime = is_prime;
`,
    },
    tests: [
      { description: '7 is prime', input: [7], expectedOutput: true },
      { description: '10 is not prime', input: [10], expectedOutput: false },
      { description: '2 is prime (smallest)', input: [2], expectedOutput: true },
      { description: '1 is not prime', input: [1], expectedOutput: false },
      { description: '17 is prime', input: [17], expectedOutput: true },
      { description: '9 is not prime', input: [9], expectedOutput: false },
    ],
    tags: ['math', 'loops', 'medium'],
  },
  {
    id: 'q-prime-factors',
    slug: 'prime-factors',
    title: 'Factor Hunter',
    category: 'prime-time',
    difficulty: 'medium',
    description: `## Factor Hunter

Every number has a secret recipe made of prime numbers. Find all the ingredients!

Write a function that returns a list of all **prime factors** of a given number.

\`\`\`
prime_factors(35)   →  [5, 7]
prime_factors(12)   →  [2, 2, 3]
prime_factors(7)    →  [7]
\`\`\``,
    hint: 'Start with divisor = 2. If the number divides evenly, add the divisor to your factors list and divide the number. If not, increase the divisor by 1. Keep going until n <= 1.',
    starterCode: {
      python: `def prime_factors(n):
    # your code here
    pass
`,
      javascript: `function prime_factors(n) {
  // your code here
}
exports.prime_factors = prime_factors;
`,
    },
    tests: [
      { description: '35 = 5 × 7', input: [35], expectedOutput: [5, 7] },
      { description: '12 = 2 × 2 × 3', input: [12], expectedOutput: [2, 2, 3] },
      { description: '7 is prime', input: [7], expectedOutput: [7] },
      { description: '100 = 2 × 2 × 5 × 5', input: [100], expectedOutput: [2, 2, 5, 5] },
    ],
    tags: ['math', 'loops', 'medium'],
  },
  {
    id: 'q-all-primes',
    slug: 'all-primes-up-to-n',
    title: 'Prime Sieve',
    category: 'prime-time',
    difficulty: 'medium',
    description: `## Prime Sieve

You need to print out all prime numbers up to a given number for your math class poster. Let's automate that!

Write a function that returns a list of all prime numbers from 2 up to (and including) \`n\`.

\`\`\`
all_primes(10)  →  [2, 3, 5, 7]
all_primes(20)  →  [2, 3, 5, 7, 11, 13, 17, 19]
all_primes(2)   →  [2]
\`\`\``,
    hint: 'Reuse or rewrite your is_prime check inside a loop that goes from 2 to n.',
    starterCode: {
      python: `def all_primes(n):
    # your code here
    pass
`,
      javascript: `function all_primes(n) {
  // your code here
}
exports.all_primes = all_primes;
`,
    },
    tests: [
      { description: 'Up to 10', input: [10], expectedOutput: [2, 3, 5, 7] },
      { description: 'Up to 20', input: [20], expectedOutput: [2, 3, 5, 7, 11, 13, 17, 19] },
      { description: 'Just 2', input: [2], expectedOutput: [2] },
      { description: 'Up to 1', input: [1], expectedOutput: [] },
    ],
    tags: ['math', 'loops', 'medium'],
  },
  {
    id: 'q-smallest-prime-factor',
    slug: 'smallest-prime-factor',
    title: 'The Tiny Factor',
    category: 'prime-time',
    difficulty: 'easy',
    description: `## The Tiny Factor

Every number has a smallest prime factor. It's the smallest prime that divides it evenly.

Write a function that finds the **smallest prime factor** of a given number.

\`\`\`
smallest_prime_factor(12)  →  2
smallest_prime_factor(35)  →  5
smallest_prime_factor(7)   →  7
\`\`\``,
    hint: 'Start checking from 2 upwards. The first number that divides evenly is your answer.',
    starterCode: {
      python: `def smallest_prime_factor(n):
    # your code here
    pass
`,
      javascript: `function smallest_prime_factor(n) {
  // your code here
}
exports.smallest_prime_factor = smallest_prime_factor;
`,
    },
    tests: [
      { description: '12 → 2', input: [12], expectedOutput: 2 },
      { description: '35 → 5', input: [35], expectedOutput: 5 },
      { description: '7 is prime, factor is itself', input: [7], expectedOutput: 7 },
      { description: '100 → 2', input: [100], expectedOutput: 2 },
    ],
    tags: ['math', 'loops', 'easy'],
  },

  // ─── Loop Quest ──────────────────────────────────────────────────────────
  {
    id: 'q-armstrong-number',
    slug: 'armstrong-number',
    title: 'The Armstrong Oracle',
    category: 'loop-quest',
    difficulty: 'medium',
    description: `## The Armstrong Oracle

An Armstrong number is a number that equals the sum of its own digits each raised to the power of the number of digits.

For example:
- 153 → 1³ + 5³ + 3³ = 1 + 125 + 27 = **153** ✓
- 9474 → 9⁴ + 4⁴ + 7⁴ + 4⁴ = **9474** ✓

Write a function that returns \`True\` if the number is an Armstrong number.

\`\`\`
is_armstrong(153)   →  True
is_armstrong(370)   →  True
is_armstrong(100)   →  False
\`\`\``,
    hint: 'Convert the number to a string to count digits and loop through each digit easily.',
    starterCode: {
      python: `def is_armstrong(n):
    # your code here
    pass
`,
      javascript: `function is_armstrong(n) {
  // your code here
}
exports.is_armstrong = is_armstrong;
`,
    },
    tests: [
      { description: '153 is Armstrong', input: [153], expectedOutput: true },
      { description: '370 is Armstrong', input: [370], expectedOutput: true },
      { description: '100 is not', input: [100], expectedOutput: false },
      { description: '9474 is Armstrong', input: [9474], expectedOutput: true },
      { description: '10 is not', input: [10], expectedOutput: false },
    ],
    tags: ['math', 'loops', 'medium'],
  },
  {
    id: 'q-gcd',
    slug: 'greatest-common-divisor',
    title: 'The Common Ground',
    category: 'loop-quest',
    difficulty: 'medium',
    description: `## The Common Ground

Two fractions walk into a simplification machine. To simplify them, you need the Greatest Common Divisor (GCD) — the biggest number that divides both evenly.

Write a function that returns the GCD of two numbers.

\`\`\`
gcd(12, 8)   →  4
gcd(100, 75) →  25
gcd(7, 3)    →  1
\`\`\``,
    hint: 'Use the Euclidean algorithm: gcd(a, b) = gcd(b, a % b). When b = 0, return a.',
    starterCode: {
      python: `def gcd(a, b):
    # your code here
    pass
`,
      javascript: `function gcd(a, b) {
  // your code here
}
exports.gcd = gcd;
`,
    },
    tests: [
      { description: 'gcd(12, 8) = 4', input: [12, 8], expectedOutput: 4 },
      { description: 'gcd(100, 75) = 25', input: [100, 75], expectedOutput: 25 },
      { description: 'gcd(7, 3) = 1 (coprime)', input: [7, 3], expectedOutput: 1 },
      { description: 'gcd(0, 5) = 5', input: [0, 5], expectedOutput: 5 },
    ],
    tags: ['math', 'loops', 'medium'],
  },
  {
    id: 'q-lcm',
    slug: 'least-common-multiple',
    title: 'The Meeting Point',
    category: 'loop-quest',
    difficulty: 'medium',
    description: `## The Meeting Point

Two buses leave the station at different intervals. When do they meet again? That's the Least Common Multiple (LCM)!

Write a function that returns the **LCM** of two numbers.

\`\`\`
lcm(4, 6)    →  12
lcm(3, 5)    →  15
lcm(12, 18)  →  36
\`\`\``,
    hint: 'Use the relationship: LCM(a, b) = (a × b) / GCD(a, b). You can reuse your GCD function.',
    starterCode: {
      python: `def lcm(a, b):
    # your code here
    pass
`,
      javascript: `function lcm(a, b) {
  // your code here
}
exports.lcm = lcm;
`,
    },
    tests: [
      { description: 'lcm(4, 6) = 12', input: [4, 6], expectedOutput: 12 },
      { description: 'lcm(3, 5) = 15', input: [3, 5], expectedOutput: 15 },
      { description: 'lcm(12, 18) = 36', input: [12, 18], expectedOutput: 36 },
      { description: 'lcm(7, 7) = 7', input: [7, 7], expectedOutput: 7 },
    ],
    tags: ['math', 'medium'],
  },
  {
    id: 'q-dict-of-cubes',
    slug: 'dictionary-of-cubes',
    title: 'Cube Map',
    category: 'loop-quest',
    difficulty: 'easy',
    description: `## Cube Map

Build a lookup table where each number maps to its cube.

Write a function that takes a number \`n\` and returns a dictionary (or object) where keys are numbers from 1 to n and values are their cubes.

\`\`\`
cube_map(3)   →  {1: 1, 2: 8, 3: 27}
cube_map(5)   →  {1: 1, 2: 8, 3: 27, 4: 64, 5: 125}
\`\`\``,
    hint: 'Loop from 1 to n and put each number and its cube into a dictionary.',
    starterCode: {
      python: `def cube_map(n):
    # your code here
    pass
`,
      javascript: `function cube_map(n) {
  // your code here - use an object {}
}
exports.cube_map = cube_map;
`,
    },
    tests: [
      { description: 'n=3', input: [3], expectedOutput: { 1: 1, 2: 8, 3: 27 } },
      { description: 'n=5', input: [5], expectedOutput: { 1: 1, 2: 8, 3: 27, 4: 64, 5: 125 } },
      { description: 'n=1', input: [1], expectedOutput: { 1: 1 } },
    ],
    tags: ['dictionaries', 'loops', 'easy'],
  },
];

export const CATEGORIES = {
  'math-magic': { label: 'Math Magic', emoji: '🔢', color: 'bg-violet-100 text-violet-700' },
  'string-sorcery': { label: 'String Sorcery', emoji: '✍️', color: 'bg-blue-100 text-blue-700' },
  'list-adventures': { label: 'List Adventures', emoji: '📋', color: 'bg-green-100 text-green-700' },
  'number-crunching': { label: 'Number Crunching', emoji: '💥', color: 'bg-orange-100 text-orange-700' },
  'prime-time': { label: 'Prime Time', emoji: '⭐', color: 'bg-yellow-100 text-yellow-700' },
  'loop-quest': { label: 'Loop Quest', emoji: '🔁', color: 'bg-pink-100 text-pink-700' },
} as const;

export const DIFFICULTY_META = {
  easy: { label: 'Easy', color: 'text-green-600 bg-green-50 border-green-200' },
  medium: { label: 'Medium', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  hard: { label: 'Hard', color: 'text-red-600 bg-red-50 border-red-200' },
} as const;
