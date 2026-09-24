import type { ArenaQuestion, Category, Difficulty } from './types';

export const CATEGORIES: Record<
  Category,
  { label: string; emoji: string; color: string }
> = {
  'math-magic': { label: 'Math Magic', emoji: '🧙‍♂️', color: 'bg-purple-100 text-purple-700' },
  'string-sorcery': { label: 'String Sorcery', emoji: '✨', color: 'bg-pink-100 text-pink-700' },
  'list-adventures': { label: 'List Adventures', emoji: '🗡️', color: 'bg-blue-100 text-blue-700' },
  'number-crunching': { label: 'Number Crunching', emoji: '🔢', color: 'bg-emerald-100 text-emerald-700' },
  'prime-time': { label: 'Prime Time', emoji: '👑', color: 'bg-amber-100 text-amber-700' },
  'loop-quest': { label: 'Loop Quest', emoji: '🔁', color: 'bg-orange-100 text-orange-700' },
  'sql-basics': { label: 'SQL Basics', emoji: '🗄️', color: 'bg-indigo-100 text-indigo-700' },
  'sql-joins': { label: 'SQL Joins', emoji: '🔗', color: 'bg-cyan-100 text-cyan-700' },
  'sql-aggregates': { label: 'SQL Aggregates', emoji: '📈', color: 'bg-teal-100 text-teal-700' },
  'sql-advanced': { label: 'SQL Advanced', emoji: '🚀', color: 'bg-violet-100 text-violet-700' },
};

export const DIFFICULTY_META: Record<
  Difficulty,
  { label: string; color: string }
> = {
  easy: { label: 'Easy', color: 'bg-green-50 text-green-700 border-green-200' },
  medium: { label: 'Medium', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  hard: { label: 'Hard', color: 'bg-red-50 text-red-700 border-red-200' },
};

export const ARENA_QUESTIONS: ArenaQuestion[] = [
  {
    "id": "py-001",
    "slug": "even-or-odd",
    "title": "Even or Odd",
    "category": "number-crunching",
    "difficulty": "easy",
    "description": "## Even or Odd\n\nWrite a function `is_even(n)` that returns True if the number `n` is even, and False otherwise.",
    "hint": "Use the modulo operator % to check for the remainder.",
    "starterCode": {
      "python": "def is_even(n):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "is_even(4) → True",
        "input": [
          4
        ],
        "expectedOutput": true
      },
      {
        "description": "is_even(7) → False",
        "input": [
          7
        ],
        "expectedOutput": false
      },
      {
        "description": "is_even(0) → True",
        "input": [
          0
        ],
        "expectedOutput": true
      },
      {
        "description": "is_even(-2) → True",
        "input": [
          -2
        ],
        "expectedOutput": true
      }
    ],
    "tags": [
      "conditions",
      "easy"
    ]
  },
  {
    "id": "py-002",
    "slug": "sum-of-array",
    "title": "Sum of Array",
    "category": "loop-quest",
    "difficulty": "easy",
    "description": "## Sum of Array\n\nWrite a function `sum_array(arr)` that takes a list of numbers and returns their sum. Do not use the built-in sum() function.",
    "hint": "Use a for loop to iterate through the list.",
    "starterCode": {
      "python": "def sum_array(arr):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "sum_array([1, 2, 3]) → 6",
        "input": [
          [
            1,
            2,
            3
          ]
        ],
        "expectedOutput": 6
      },
      {
        "description": "sum_array([]) → 0",
        "input": [
          []
        ],
        "expectedOutput": 0
      },
      {
        "description": "sum_array([-1, 1, 5]) → 5",
        "input": [
          [
            -1,
            1,
            5
          ]
        ],
        "expectedOutput": 5
      }
    ],
    "tags": [
      "loops",
      "easy"
    ]
  },
  {
    "id": "py-003",
    "slug": "reverse-string-using-stack",
    "title": "Reverse String using Stack",
    "category": "string-sorcery",
    "difficulty": "medium",
    "description": "## Reverse String using Stack\n\nWrite a function `reverse_string(s)` that reverses a string using a list as a stack.",
    "hint": "Push all characters into a list using append(), then pop() them out to build the reversed string.",
    "starterCode": {
      "python": "def reverse_string(s):\n    stack = []\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "reverse_string('hello') → 'olleh'",
        "input": [
          "hello"
        ],
        "expectedOutput": "olleh"
      },
      {
        "description": "reverse_string('') → ''",
        "input": [
          ""
        ],
        "expectedOutput": ""
      },
      {
        "description": "reverse_string('a') → 'a'",
        "input": [
          "a"
        ],
        "expectedOutput": "a"
      },
      {
        "description": "reverse_string('Python') → 'nohtyP'",
        "input": [
          "Python"
        ],
        "expectedOutput": "nohtyP"
      }
    ],
    "tags": [
      "stacks",
      "medium"
    ]
  },
  {
    "id": "py-004",
    "slug": "fizzbuzz",
    "title": "FizzBuzz",
    "category": "number-crunching",
    "difficulty": "easy",
    "description": "## FizzBuzz\n\nWrite a function `fizzbuzz(n)` that returns:\n- `'FizzBuzz'` if n is divisible by both 3 and 5\n- `'Fizz'` if n is divisible by 3 only\n- `'Buzz'` if n is divisible by 5 only\n- The number as a string otherwise",
    "hint": "Check the combined case (divisible by 15) first, before checking for 3 or 5 alone.",
    "starterCode": {
      "python": "def fizzbuzz(n):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "fizzbuzz(15) → 'FizzBuzz'",
        "input": [
          15
        ],
        "expectedOutput": "FizzBuzz"
      },
      {
        "description": "fizzbuzz(9) → 'Fizz'",
        "input": [
          9
        ],
        "expectedOutput": "Fizz"
      },
      {
        "description": "fizzbuzz(10) → 'Buzz'",
        "input": [
          10
        ],
        "expectedOutput": "Buzz"
      },
      {
        "description": "fizzbuzz(7) → '7'",
        "input": [
          7
        ],
        "expectedOutput": "7"
      }
    ],
    "tags": [
      "conditions",
      "easy"
    ]
  },
  {
    "id": "py-005",
    "slug": "count-vowels",
    "title": "Count Vowels",
    "category": "loop-quest",
    "difficulty": "easy",
    "description": "## Count Vowels\n\nWrite a function `count_vowels(s)` that returns the number of vowels (a, e, i, o, u) in the string `s`. The check should be case-insensitive.",
    "hint": "Convert the string to lowercase first, then loop through each character and check if it is in the vowel set.",
    "starterCode": {
      "python": "def count_vowels(s):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "count_vowels('hello') → 2",
        "input": [
          "hello"
        ],
        "expectedOutput": 2
      },
      {
        "description": "count_vowels('Python') → 1",
        "input": [
          "Python"
        ],
        "expectedOutput": 1
      },
      {
        "description": "count_vowels('AEIOU') → 5",
        "input": [
          "AEIOU"
        ],
        "expectedOutput": 5
      },
      {
        "description": "count_vowels('gym') → 0",
        "input": [
          "gym"
        ],
        "expectedOutput": 0
      }
    ],
    "tags": [
      "loops",
      "easy"
    ]
  },
  {
    "id": "py-006",
    "slug": "find-the-maximum",
    "title": "Find the Maximum",
    "category": "list-adventures",
    "difficulty": "easy",
    "description": "## Find the Maximum\n\nWrite a function `find_max(lst)` that returns the largest number in the list without using the built-in `max()` function.",
    "hint": "Start by assuming the first element is the maximum, then loop through the rest to compare.",
    "starterCode": {
      "python": "def find_max(lst):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "find_max([3, 1, 4, 1, 5, 9, 2]) → 9",
        "input": [
          [
            3,
            1,
            4,
            1,
            5,
            9,
            2
          ]
        ],
        "expectedOutput": 9
      },
      {
        "description": "find_max([-5, -1, -3]) → -1",
        "input": [
          [
            -5,
            -1,
            -3
          ]
        ],
        "expectedOutput": -1
      },
      {
        "description": "find_max([42]) → 42",
        "input": [
          [
            42
          ]
        ],
        "expectedOutput": 42
      }
    ],
    "tags": [
      "lists",
      "easy"
    ]
  },
  {
    "id": "py-007",
    "slug": "remove-duplicates",
    "title": "Remove Duplicates",
    "category": "list-adventures",
    "difficulty": "easy",
    "description": "## Remove Duplicates\n\nWrite a function `remove_duplicates(lst)` that takes a list and returns a new list with all duplicate values removed. The order of elements does not matter.",
    "hint": "Convert the list to a set to automatically remove duplicates, then convert it back to a list.",
    "starterCode": {
      "python": "def remove_duplicates(lst):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "sorted(remove_duplicates([1, 2, 2, 3, 3])) → [1, 2, 3]",
        "input": [
          "remove_duplicates([1, 2, 2, 3, 3])"
        ],
        "expectedOutput": [
          1,
          2,
          3
        ]
      },
      {
        "description": "sorted(remove_duplicates([5, 5, 5])) → [5]",
        "input": [
          "remove_duplicates([5, 5, 5])"
        ],
        "expectedOutput": [
          5
        ]
      },
      {
        "description": "sorted(remove_duplicates([1, 2, 3])) → [1, 2, 3]",
        "input": [
          "remove_duplicates([1, 2, 3])"
        ],
        "expectedOutput": [
          1,
          2,
          3
        ]
      },
      {
        "description": "remove_duplicates([]) → []",
        "input": [
          []
        ],
        "expectedOutput": []
      }
    ],
    "tags": [
      "sets",
      "easy"
    ]
  },
  {
    "id": "py-008",
    "slug": "word-frequency-counter",
    "title": "Word Frequency Counter",
    "category": "list-adventures",
    "difficulty": "easy",
    "description": "## Word Frequency Counter\n\nWrite a function `word_frequency(text)` that takes a string of space-separated words and returns a dictionary mapping each word to how many times it appears.",
    "hint": "Split the string by spaces to get individual words, then use a dict to count occurrences.",
    "starterCode": {
      "python": "def word_frequency(text):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "word_frequency('the cat sat on the mat') → {'the': 2, 'cat': 1, 'sat': 1, 'on': 1, 'mat': 1}",
        "input": [
          "the cat sat on the mat"
        ],
        "expectedOutput": {
          "the": 2,
          "cat": 1,
          "sat": 1,
          "on": 1,
          "mat": 1
        }
      },
      {
        "description": "word_frequency('hello hello hello') → {'hello': 3}",
        "input": [
          "hello hello hello"
        ],
        "expectedOutput": {
          "hello": 3
        }
      },
      {
        "description": "word_frequency('one') → {'one': 1}",
        "input": [
          "one"
        ],
        "expectedOutput": {
          "one": 1
        }
      }
    ],
    "tags": [
      "dictionaries",
      "easy"
    ]
  },
  {
    "id": "py-009",
    "slug": "factorial",
    "title": "Factorial",
    "category": "math-magic",
    "difficulty": "easy",
    "description": "## Factorial\n\nWrite a function `factorial(n)` that returns the factorial of a non-negative integer `n`. Recall that `0! = 1` and `n! = n * (n-1) * ... * 1`.",
    "hint": "You can solve this with a loop or recursion. Start with result = 1 and multiply from 1 up to n.",
    "starterCode": {
      "python": "def factorial(n):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "factorial(0) → 1",
        "input": [
          0
        ],
        "expectedOutput": 1
      },
      {
        "description": "factorial(1) → 1",
        "input": [
          1
        ],
        "expectedOutput": 1
      },
      {
        "description": "factorial(5) → 120",
        "input": [
          5
        ],
        "expectedOutput": 120
      },
      {
        "description": "factorial(10) → 3628800",
        "input": [
          10
        ],
        "expectedOutput": 3628800
      }
    ],
    "tags": [
      "math",
      "easy"
    ]
  },
  {
    "id": "py-010",
    "slug": "is-palindrome",
    "title": "Is Palindrome",
    "category": "string-sorcery",
    "difficulty": "easy",
    "description": "## Is Palindrome\n\nWrite a function `is_palindrome(s)` that returns True if the string `s` is a palindrome (reads the same forwards and backwards), and False otherwise. The check should be case-insensitive.",
    "hint": "Convert to lowercase, then compare the string with its reverse using slicing: s[::-1].",
    "starterCode": {
      "python": "def is_palindrome(s):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "is_palindrome('racecar') → True",
        "input": [
          "racecar"
        ],
        "expectedOutput": true
      },
      {
        "description": "is_palindrome('Madam') → True",
        "input": [
          "Madam"
        ],
        "expectedOutput": true
      },
      {
        "description": "is_palindrome('hello') → False",
        "input": [
          "hello"
        ],
        "expectedOutput": false
      },
      {
        "description": "is_palindrome('a') → True",
        "input": [
          "a"
        ],
        "expectedOutput": true
      }
    ],
    "tags": [
      "strings",
      "easy"
    ]
  },
  {
    "id": "py-011",
    "slug": "list-intersection",
    "title": "List Intersection",
    "category": "list-adventures",
    "difficulty": "easy",
    "description": "## List Intersection\n\nWrite a function `intersect(a, b)` that takes two lists and returns a sorted list of elements that appear in **both** lists, with no duplicates.",
    "hint": "Convert both lists to sets, use the & operator (or .intersection()) to find common elements, then sort the result.",
    "starterCode": {
      "python": "def intersect(a, b):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "intersect([1, 2, 3, 4], [3, 4, 5, 6]) → [3, 4]",
        "input": [
          [
            1,
            2,
            3,
            4
          ],
          [
            3,
            4,
            5,
            6
          ]
        ],
        "expectedOutput": [
          3,
          4
        ]
      },
      {
        "description": "intersect([1, 1, 2], [2, 2, 3]) → [2]",
        "input": [
          [
            1,
            1,
            2
          ],
          [
            2,
            2,
            3
          ]
        ],
        "expectedOutput": [
          2
        ]
      },
      {
        "description": "intersect([1, 2], [3, 4]) → []",
        "input": [
          [
            1,
            2
          ],
          [
            3,
            4
          ]
        ],
        "expectedOutput": []
      }
    ],
    "tags": [
      "sets",
      "easy"
    ]
  },
  {
    "id": "py-012",
    "slug": "celsius-to-fahrenheit",
    "title": "Celsius to Fahrenheit",
    "category": "math-magic",
    "difficulty": "easy",
    "description": "## Celsius to Fahrenheit\n\nWrite a function `celsius_to_fahrenheit(c)` that converts a temperature from Celsius to Fahrenheit. The formula is: `F = (C x 9/5) + 32`.",
    "hint": "Apply the formula directly. Python's division is floating-point by default.",
    "starterCode": {
      "python": "def celsius_to_fahrenheit(c):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "celsius_to_fahrenheit(0) → 32.0",
        "input": [
          0
        ],
        "expectedOutput": 32
      },
      {
        "description": "celsius_to_fahrenheit(100) → 212.0",
        "input": [
          100
        ],
        "expectedOutput": 212
      },
      {
        "description": "celsius_to_fahrenheit(-40) → -40.0",
        "input": [
          -40
        ],
        "expectedOutput": -40
      },
      {
        "description": "celsius_to_fahrenheit(37) → 98.6",
        "input": [
          37
        ],
        "expectedOutput": 98.6
      }
    ],
    "tags": [
      "math",
      "easy"
    ]
  },
  {
    "id": "py-013",
    "slug": "count-occurrences",
    "title": "Count Occurrences",
    "category": "list-adventures",
    "difficulty": "easy",
    "description": "## Count Occurrences\n\nWrite a function `count_occurrences(lst)` that takes a list and returns a dictionary where each key is a unique item and the value is the number of times it appears.",
    "hint": "Loop through the list. For each item, increment its count in the dictionary using dict.get(item, 0) + 1.",
    "starterCode": {
      "python": "def count_occurrences(lst):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "count_occurrences([1, 2, 2, 3, 3, 3]) → {1: 1, 2: 2, 3: 3}",
        "input": [
          [
            1,
            2,
            2,
            3,
            3,
            3
          ]
        ],
        "expectedOutput": {
          "1": 1,
          "2": 2,
          "3": 3
        }
      },
      {
        "description": "count_occurrences(['a', 'b', 'a']) → {'a': 2, 'b': 1}",
        "input": [
          [
            "a",
            "b",
            "a"
          ]
        ],
        "expectedOutput": {
          "a": 2,
          "b": 1
        }
      },
      {
        "description": "count_occurrences([]) → {}",
        "input": [
          []
        ],
        "expectedOutput": {}
      }
    ],
    "tags": [
      "dictionaries",
      "easy"
    ]
  },
  {
    "id": "py-014",
    "slug": "sum-of-digits",
    "title": "Sum of Digits",
    "category": "math-magic",
    "difficulty": "easy",
    "description": "## Sum of Digits\n\nWrite a function `sum_of_digits(n)` that returns the sum of all digits of a non-negative integer `n`. For example, `sum_of_digits(123)` should return `6`.",
    "hint": "Convert the number to a string, iterate over each character, convert back to int, and sum them up.",
    "starterCode": {
      "python": "def sum_of_digits(n):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "sum_of_digits(123) → 6",
        "input": [
          123
        ],
        "expectedOutput": 6
      },
      {
        "description": "sum_of_digits(0) → 0",
        "input": [
          0
        ],
        "expectedOutput": 0
      },
      {
        "description": "sum_of_digits(9999) → 36",
        "input": [
          9999
        ],
        "expectedOutput": 36
      },
      {
        "description": "sum_of_digits(100) → 1",
        "input": [
          100
        ],
        "expectedOutput": 1
      }
    ],
    "tags": [
      "math",
      "easy"
    ]
  },
  {
    "id": "py-015",
    "slug": "flatten-a-nested-list",
    "title": "Flatten a Nested List",
    "category": "list-adventures",
    "difficulty": "medium",
    "description": "## Flatten a Nested List\n\nWrite a function `flatten(lst)` that takes a list of lists and returns a single flat list containing all elements.",
    "hint": "Use a nested loop: iterate over each sublist in lst, then over each element in the sublist.",
    "starterCode": {
      "python": "def flatten(lst):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "flatten([[1, 2], [3, 4], [5]]) → [1, 2, 3, 4, 5]",
        "input": [
          [
            [
              1,
              2
            ],
            [
              3,
              4
            ],
            [
              5
            ]
          ]
        ],
        "expectedOutput": [
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "description": "flatten([[1], [2], [3]]) → [1, 2, 3]",
        "input": [
          [
            [
              1
            ],
            [
              2
            ],
            [
              3
            ]
          ]
        ],
        "expectedOutput": [
          1,
          2,
          3
        ]
      },
      {
        "description": "flatten([]) → []",
        "input": [
          []
        ],
        "expectedOutput": []
      },
      {
        "description": "flatten([[1, 2, 3]]) → [1, 2, 3]",
        "input": [
          [
            [
              1,
              2,
              3
            ]
          ]
        ],
        "expectedOutput": [
          1,
          2,
          3
        ]
      }
    ],
    "tags": [
      "lists",
      "medium"
    ]
  },
  {
    "id": "py-016",
    "slug": "prime-check",
    "title": "Prime Check",
    "category": "math-magic",
    "difficulty": "medium",
    "description": "## Prime Check\n\nWrite a function `is_prime(n)` that returns True if `n` is a prime number, and False otherwise. A prime number is greater than 1 and has no divisors other than 1 and itself.",
    "hint": "Check divisors from 2 up to the square root of n. If any divide evenly, n is not prime. Use int(n**0.5) + 1 as the upper bound.",
    "starterCode": {
      "python": "def is_prime(n):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "is_prime(2) → True",
        "input": [
          2
        ],
        "expectedOutput": true
      },
      {
        "description": "is_prime(7) → True",
        "input": [
          7
        ],
        "expectedOutput": true
      },
      {
        "description": "is_prime(1) → False",
        "input": [
          1
        ],
        "expectedOutput": false
      },
      {
        "description": "is_prime(9) → False",
        "input": [
          9
        ],
        "expectedOutput": false
      },
      {
        "description": "is_prime(13) → True",
        "input": [
          13
        ],
        "expectedOutput": true
      }
    ],
    "tags": [
      "math",
      "medium"
    ]
  },
  {
    "id": "py-017",
    "slug": "unique-characters",
    "title": "Unique Characters",
    "category": "list-adventures",
    "difficulty": "easy",
    "description": "## Unique Characters\n\nWrite a function `has_unique_chars(s)` that returns True if all characters in the string `s` are unique (no duplicates), and False otherwise.",
    "hint": "Compare the length of the string to the length of a set made from the string. If they are equal, all characters are unique.",
    "starterCode": {
      "python": "def has_unique_chars(s):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "has_unique_chars('abcde') → True",
        "input": [
          "abcde"
        ],
        "expectedOutput": true
      },
      {
        "description": "has_unique_chars('hello') → False",
        "input": [
          "hello"
        ],
        "expectedOutput": false
      },
      {
        "description": "has_unique_chars('') → True",
        "input": [
          ""
        ],
        "expectedOutput": true
      },
      {
        "description": "has_unique_chars('z') → True",
        "input": [
          "z"
        ],
        "expectedOutput": true
      }
    ],
    "tags": [
      "sets",
      "easy"
    ]
  },
  {
    "id": "py-018",
    "slug": "merge-and-sort",
    "title": "Merge and Sort",
    "category": "list-adventures",
    "difficulty": "easy",
    "description": "## Merge and Sort\n\nWrite a function `merge_sorted(a, b)` that takes two lists of numbers and returns a single sorted list containing all elements from both.",
    "hint": "Concatenate the two lists using + and then sort the result with the built-in sorted() function.",
    "starterCode": {
      "python": "def merge_sorted(a, b):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "merge_sorted([3, 1], [4, 2]) → [1, 2, 3, 4]",
        "input": [
          [
            3,
            1
          ],
          [
            4,
            2
          ]
        ],
        "expectedOutput": [
          1,
          2,
          3,
          4
        ]
      },
      {
        "description": "merge_sorted([], [1, 2]) → [1, 2]",
        "input": [
          [],
          [
            1,
            2
          ]
        ],
        "expectedOutput": [
          1,
          2
        ]
      },
      {
        "description": "merge_sorted([5], [5]) → [5, 5]",
        "input": [
          [
            5
          ],
          [
            5
          ]
        ],
        "expectedOutput": [
          5,
          5
        ]
      },
      {
        "description": "merge_sorted([], []) → []",
        "input": [
          [],
          []
        ],
        "expectedOutput": []
      }
    ],
    "tags": [
      "lists",
      "easy"
    ]
  },
  {
    "id": "py-019",
    "slug": "most-frequent-element",
    "title": "Most Frequent Element",
    "category": "list-adventures",
    "difficulty": "medium",
    "description": "## Most Frequent Element\n\nWrite a function `most_frequent(lst)` that returns the element that appears most often in the list. If there is a tie, return any one of the tied elements.",
    "hint": "First count each element's frequency using a dictionary, then find the key with the highest value.",
    "starterCode": {
      "python": "def most_frequent(lst):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "most_frequent([1, 2, 2, 3]) → 2",
        "input": [
          [
            1,
            2,
            2,
            3
          ]
        ],
        "expectedOutput": 2
      },
      {
        "description": "most_frequent(['a', 'b', 'a', 'c', 'a']) → 'a'",
        "input": [
          [
            "a",
            "b",
            "a",
            "c",
            "a"
          ]
        ],
        "expectedOutput": "a"
      },
      {
        "description": "most_frequent([7]) → 7",
        "input": [
          [
            7
          ]
        ],
        "expectedOutput": 7
      }
    ],
    "tags": [
      "dictionaries",
      "medium"
    ]
  },
  {
    "id": "py-020",
    "slug": "fibonacci-sequence",
    "title": "Fibonacci Sequence",
    "category": "loop-quest",
    "difficulty": "medium",
    "description": "## Fibonacci Sequence\n\nWrite a function `fibonacci(n)` that returns a list containing the first `n` Fibonacci numbers. The sequence starts: 0, 1, 1, 2, 3, 5, 8 ...",
    "hint": "Start with a list [0, 1] and use a loop to append the sum of the last two elements until you have n numbers.",
    "starterCode": {
      "python": "def fibonacci(n):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "fibonacci(1) → [0]",
        "input": [
          1
        ],
        "expectedOutput": [
          0
        ]
      },
      {
        "description": "fibonacci(5) → [0, 1, 1, 2, 3]",
        "input": [
          5
        ],
        "expectedOutput": [
          0,
          1,
          1,
          2,
          3
        ]
      },
      {
        "description": "fibonacci(8) → [0, 1, 1, 2, 3, 5, 8, 13]",
        "input": [
          8
        ],
        "expectedOutput": [
          0,
          1,
          1,
          2,
          3,
          5,
          8,
          13
        ]
      },
      {
        "description": "fibonacci(0) → []",
        "input": [
          0
        ],
        "expectedOutput": []
      }
    ],
    "tags": [
      "loops",
      "medium"
    ]
  },
  {
    "id": "py-021",
    "slug": "two-sum",
    "title": "Two Sum",
    "category": "list-adventures",
    "difficulty": "medium",
    "description": "## Two Sum\n\nWrite a function `two_sum(nums, target)` that returns a list with the **indices** of two numbers that add up to `target`. You may assume exactly one solution exists.",
    "hint": "Use a dictionary to store each number's index as you iterate. For each number, check if (target - number) already exists in the dict.",
    "starterCode": {
      "python": "def two_sum(nums, target):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "two_sum([2, 7, 11, 15], 9) → [0, 1]",
        "input": [
          [
            2,
            7,
            11,
            15
          ],
          9
        ],
        "expectedOutput": [
          0,
          1
        ]
      },
      {
        "description": "two_sum([3, 2, 4], 6) → [1, 2]",
        "input": [
          [
            3,
            2,
            4
          ],
          6
        ],
        "expectedOutput": [
          1,
          2
        ]
      },
      {
        "description": "two_sum([3, 3], 6) → [0, 1]",
        "input": [
          [
            3,
            3
          ],
          6
        ],
        "expectedOutput": [
          0,
          1
        ]
      }
    ],
    "tags": [
      "dictionaries",
      "medium"
    ]
  },
  {
    "id": "py-022",
    "slug": "grade-calculator",
    "title": "Grade Calculator",
    "category": "number-crunching",
    "difficulty": "easy",
    "description": "## Grade Calculator\n\nWrite a function `get_grade(score)` that returns a letter grade based on the score:\n- `'A'` for 90-100\n- `'B'` for 80-89\n- `'C'` for 70-79\n- `'D'` for 60-69\n- `'F'` for below 60",
    "hint": "Use a chain of if/elif/else conditions to map score ranges to grade letters.",
    "starterCode": {
      "python": "def get_grade(score):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "get_grade(95) → 'A'",
        "input": [
          95
        ],
        "expectedOutput": "A"
      },
      {
        "description": "get_grade(83) → 'B'",
        "input": [
          83
        ],
        "expectedOutput": "B"
      },
      {
        "description": "get_grade(72) → 'C'",
        "input": [
          72
        ],
        "expectedOutput": "C"
      },
      {
        "description": "get_grade(65) → 'D'",
        "input": [
          65
        ],
        "expectedOutput": "D"
      },
      {
        "description": "get_grade(55) → 'F'",
        "input": [
          55
        ],
        "expectedOutput": "F"
      }
    ],
    "tags": [
      "conditions",
      "easy"
    ]
  },
  {
    "id": "py-023",
    "slug": "filter-even-numbers",
    "title": "Filter Even Numbers",
    "category": "list-adventures",
    "difficulty": "easy",
    "description": "## Filter Even Numbers\n\nWrite a function `filter_evens(lst)` that returns a new list containing only the even numbers from the input list. Use a list comprehension.",
    "hint": "A list comprehension has the form: [x for x in lst if condition]. Use x % 2 == 0 as your condition.",
    "starterCode": {
      "python": "def filter_evens(lst):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "filter_evens([1, 2, 3, 4, 5, 6]) → [2, 4, 6]",
        "input": [
          [
            1,
            2,
            3,
            4,
            5,
            6
          ]
        ],
        "expectedOutput": [
          2,
          4,
          6
        ]
      },
      {
        "description": "filter_evens([1, 3, 5]) → []",
        "input": [
          [
            1,
            3,
            5
          ]
        ],
        "expectedOutput": []
      },
      {
        "description": "filter_evens([2, 4, 6]) → [2, 4, 6]",
        "input": [
          [
            2,
            4,
            6
          ]
        ],
        "expectedOutput": [
          2,
          4,
          6
        ]
      },
      {
        "description": "filter_evens([]) → []",
        "input": [
          []
        ],
        "expectedOutput": []
      }
    ],
    "tags": [
      "lists",
      "easy"
    ]
  },
  {
    "id": "py-024",
    "slug": "power-function",
    "title": "Power Function",
    "category": "math-magic",
    "difficulty": "easy",
    "description": "## Power Function\n\nWrite a function `power(base, exp)` that returns `base` raised to the power of `exp` (a non-negative integer). Do **not** use the `**` operator or the `pow()` built-in.",
    "hint": "Use a loop that multiplies `result` by `base` exactly `exp` times, starting from result = 1.",
    "starterCode": {
      "python": "def power(base, exp):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "power(2, 10) → 1024",
        "input": [
          2,
          10
        ],
        "expectedOutput": 1024
      },
      {
        "description": "power(3, 3) → 27",
        "input": [
          3,
          3
        ],
        "expectedOutput": 27
      },
      {
        "description": "power(5, 0) → 1",
        "input": [
          5,
          0
        ],
        "expectedOutput": 1
      },
      {
        "description": "power(7, 1) → 7",
        "input": [
          7,
          1
        ],
        "expectedOutput": 7
      }
    ],
    "tags": [
      "math",
      "easy"
    ]
  },
  {
    "id": "py-025",
    "slug": "anagram-check",
    "title": "Anagram Check",
    "category": "list-adventures",
    "difficulty": "medium",
    "description": "## Anagram Check\n\nWrite a function `is_anagram(s1, s2)` that returns True if `s1` and `s2` are anagrams of each other (contain the same characters in any order, case-insensitive), and False otherwise. Spaces are not counted.",
    "hint": "Sort both strings after converting to lowercase (and removing spaces) and compare them. Two sorted anagrams will be identical.",
    "starterCode": {
      "python": "def is_anagram(s1, s2):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "is_anagram('listen', 'silent') → True",
        "input": [
          "listen",
          "silent"
        ],
        "expectedOutput": true
      },
      {
        "description": "is_anagram('hello', 'world') → False",
        "input": [
          "hello",
          "world"
        ],
        "expectedOutput": false
      },
      {
        "description": "is_anagram('abc', 'cab') → True",
        "input": [
          "abc",
          "cab"
        ],
        "expectedOutput": true
      },
      {
        "description": "is_anagram('rat', 'car') → False",
        "input": [
          "rat",
          "car"
        ],
        "expectedOutput": false
      }
    ],
    "tags": [
      "sets",
      "medium"
    ]
  },
  {
    "id": "py-026",
    "slug": "the-farmer-s-harvest",
    "title": "The Farmer's Harvest",
    "category": "list-adventures",
    "difficulty": "easy",
    "description": "## The Farmer's Harvest\n\nA farmer collected fruits from his orchard and tossed them all into a single basket:\n\nfruits = [\"apple\", \"apple\", \"banana\", \"orange\", \"banana\", \"apple\"]\n\nHelp him count how many of each fruit he collected.\n\nWrite a function  that takes the basket (a list of strings) and returns a dictionary with the count of each fruit.",
    "hint": "Loop through the list. For each fruit, use dict.get(fruit, 0) + 1 to increment its count.",
    "starterCode": {
      "python": "def count_harvest(fruits):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "count_harvest([\"apple\", \"apple\", \"banana\", \"orange\", \"banana\", \"apple\"]) → {\"apple\": 3, \"banana\": 2, \"orange\": 1}",
        "input": [
          [
            "apple",
            "apple",
            "banana",
            "orange",
            "banana",
            "apple"
          ]
        ],
        "expectedOutput": {
          "apple": 3,
          "banana": 2,
          "orange": 1
        }
      },
      {
        "description": "count_harvest([\"mango\"]) → {\"mango\": 1}",
        "input": [
          [
            "mango"
          ]
        ],
        "expectedOutput": {
          "mango": 1
        }
      },
      {
        "description": "count_harvest([]) → {}",
        "input": [
          []
        ],
        "expectedOutput": {}
      }
    ],
    "tags": [
      "dictionaries",
      "easy"
    ]
  },
  {
    "id": "py-027",
    "slug": "the-lost-robot",
    "title": "The Lost Robot",
    "category": "loop-quest",
    "difficulty": "easy",
    "description": "## The Lost Robot\n\nA robot starts at position 0 on a number line.\n\nIt receives a list of movement commands:\n\ncommands = [\"LEFT\", \"LEFT\", \"RIGHT\", \"RIGHT\", \"RIGHT\"]\n\nEach \"RIGHT\" moves it +1, each \"LEFT\" moves it -1.\n\nWrite a function  that returns the robot's final position.",
    "hint": "Start with position = 0. Loop through commands and add +1 for RIGHT, -1 for LEFT.",
    "starterCode": {
      "python": "def final_position(commands):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "final_position([\"LEFT\", \"LEFT\", \"RIGHT\", \"RIGHT\", \"RIGHT\"]) → 1",
        "input": [
          [
            "LEFT",
            "LEFT",
            "RIGHT",
            "RIGHT",
            "RIGHT"
          ]
        ],
        "expectedOutput": 1
      },
      {
        "description": "final_position([\"RIGHT\", \"RIGHT\", \"RIGHT\"]) → 3",
        "input": [
          [
            "RIGHT",
            "RIGHT",
            "RIGHT"
          ]
        ],
        "expectedOutput": 3
      },
      {
        "description": "final_position([\"LEFT\", \"RIGHT\"]) → 0",
        "input": [
          [
            "LEFT",
            "RIGHT"
          ]
        ],
        "expectedOutput": 0
      },
      {
        "description": "final_position([]) → 0",
        "input": [
          []
        ],
        "expectedOutput": 0
      }
    ],
    "tags": [
      "loops",
      "easy"
    ]
  },
  {
    "id": "py-028",
    "slug": "dungeon-treasure",
    "title": "Dungeon Treasure",
    "category": "number-crunching",
    "difficulty": "easy",
    "description": "## Dungeon Treasure\n\nAn adventurer is exploring a dungeon. Each room has a value:\n\nrooms = [10, -5, 20, -3, 15]\n\nPositive values are treasure chests (add to score).\nNegative values are traps (subtract from score).\nThe adventurer starts with 0 points.\n\nWrite a function  that returns the adventurer's final score.",
    "hint": "Loop through the list and add each value to a running total. Positive and negative numbers handle themselves!",
    "starterCode": {
      "python": "def dungeon_score(rooms):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "dungeon_score([10, -5, 20, -3, 15]) → 37",
        "input": [
          [
            10,
            -5,
            20,
            -3,
            15
          ]
        ],
        "expectedOutput": 37
      },
      {
        "description": "dungeon_score([-1, -2, -3]) → -6",
        "input": [
          [
            -1,
            -2,
            -3
          ]
        ],
        "expectedOutput": -6
      },
      {
        "description": "dungeon_score([100]) → 100",
        "input": [
          [
            100
          ]
        ],
        "expectedOutput": 100
      },
      {
        "description": "dungeon_score([]) → 0",
        "input": [
          []
        ],
        "expectedOutput": 0
      }
    ],
    "tags": [
      "conditions",
      "easy"
    ]
  },
  {
    "id": "py-029",
    "slug": "the-baker-s-bill",
    "title": "The Baker's Bill",
    "category": "loop-quest",
    "difficulty": "easy",
    "description": "## The Baker's Bill\n\nA baker sells items at fixed prices:\n\nprices = {\"bread\": 2.5, \"cake\": 8.0, \"cookie\": 1.5}\n\nA customer places an order:\n\norder = [\"bread\", \"cookie\", \"cake\", \"cookie\", \"bread\"]\n\nWrite a function  that calculates and returns the customer's total bill.",
    "hint": "Loop through the order list. For each item, look up its price in the dictionary and add it to the total.",
    "starterCode": {
      "python": "def total_bill(prices, order):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "total_bill({\"bread\": 2.5, \"cake\": 8.0, \"cookie\": 1.5}, [\"bread\", \"cookie\", \"cake\", \"cookie\", \"bread\"]) → 16.0",
        "input": [
          {
            "bread": 2.5,
            "cake": 8,
            "cookie": 1.5
          },
          [
            "bread",
            "cookie",
            "cake",
            "cookie",
            "bread"
          ]
        ],
        "expectedOutput": 16
      },
      {
        "description": "total_bill({\"bread\": 2.5, \"cake\": 8.0, \"cookie\": 1.5}, []) → 0",
        "input": [
          {
            "bread": 2.5,
            "cake": 8,
            "cookie": 1.5
          },
          []
        ],
        "expectedOutput": 0
      },
      {
        "description": "total_bill({\"bread\": 2.5, \"cake\": 8.0, \"cookie\": 1.5}, [\"cake\"]) → 8.0",
        "input": [
          {
            "bread": 2.5,
            "cake": 8,
            "cookie": 1.5
          },
          [
            "cake"
          ]
        ],
        "expectedOutput": 8
      }
    ],
    "tags": [
      "loops",
      "easy"
    ]
  },
  {
    "id": "py-030",
    "slug": "the-heatwave-alert",
    "title": "The Heatwave Alert",
    "category": "number-crunching",
    "difficulty": "easy",
    "description": "## The Heatwave Alert\n\nA weather station recorded daily temperatures for a week:\n\ntemps = [28, 34, 41, 39, 25, 36, 42]\n\nThe city issues a heatwave alert for any day above 35 degrees.\n\nWrite a function  that returns how many days triggered a heatwave alert.",
    "hint": "Loop through the list and use an if-condition to check if each temperature is greater than 35.",
    "starterCode": {
      "python": "def heatwave_days(temps):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "heatwave_days([28, 34, 41, 39, 25, 36, 42]) → 4",
        "input": [
          [
            28,
            34,
            41,
            39,
            25,
            36,
            42
          ]
        ],
        "expectedOutput": 4
      },
      {
        "description": "heatwave_days([20, 22, 18]) → 0",
        "input": [
          [
            20,
            22,
            18
          ]
        ],
        "expectedOutput": 0
      },
      {
        "description": "heatwave_days([36, 36, 36]) → 3",
        "input": [
          [
            36,
            36,
            36
          ]
        ],
        "expectedOutput": 3
      },
      {
        "description": "heatwave_days([]) → 0",
        "input": [
          []
        ],
        "expectedOutput": 0
      }
    ],
    "tags": [
      "conditions",
      "easy"
    ]
  },
  {
    "id": "py-031",
    "slug": "the-secret-handshake",
    "title": "The Secret Handshake",
    "category": "list-adventures",
    "difficulty": "easy",
    "description": "## The Secret Handshake\n\nTwo secret societies each have a list of members:\n\nclub_a = [\"Alice\", \"Bob\", \"Charlie\", \"Diana\"]\nclub_b = [\"Eve\", \"Bob\", \"Frank\", \"Diana\"]\n\nA double agent is someone who belongs to BOTH clubs.\n\nWrite a function  that returns a sorted list of names that appear in both clubs.",
    "hint": "Convert both lists to sets and use the & operator to find the intersection. Then sort the result.",
    "starterCode": {
      "python": "def double_agents(club_a, club_b):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "double_agents([\"Alice\", \"Bob\", \"Charlie\", \"Diana\"], [\"Eve\", \"Bob\", \"Frank\", \"Diana\"]) → [\"Bob\", \"Diana\"]",
        "input": [
          [
            "Alice",
            "Bob",
            "Charlie",
            "Diana"
          ],
          [
            "Eve",
            "Bob",
            "Frank",
            "Diana"
          ]
        ],
        "expectedOutput": [
          "Bob",
          "Diana"
        ]
      },
      {
        "description": "double_agents([\"Alice\", \"Bob\"], [\"Charlie\", \"Diana\"]) → []",
        "input": [
          [
            "Alice",
            "Bob"
          ],
          [
            "Charlie",
            "Diana"
          ]
        ],
        "expectedOutput": []
      },
      {
        "description": "double_agents([\"X\", \"Y\", \"Z\"], [\"X\", \"Y\", \"Z\"]) → [\"X\", \"Y\", \"Z\"]",
        "input": [
          [
            "X",
            "Y",
            "Z"
          ],
          [
            "X",
            "Y",
            "Z"
          ]
        ],
        "expectedOutput": [
          "X",
          "Y",
          "Z"
        ]
      }
    ],
    "tags": [
      "sets",
      "easy"
    ]
  },
  {
    "id": "py-032",
    "slug": "the-arcade-leaderboard",
    "title": "The Arcade Leaderboard",
    "category": "list-adventures",
    "difficulty": "easy",
    "description": "## The Arcade Leaderboard\n\nThe local arcade keeps track of high scores:\n\nscores = [\"Alice:1500\", \"Bob:3200\", \"Charlie:800\", \"Diana:4100\", \"Eve:2950\"]\n\nEach entry is a string in the format \"Name:Score\".\n\nWrite a function  that returns the name of the player with the highest score.",
    "hint": "Split each entry by \":\" to separate the name and score. Convert the score to int before comparing.",
    "starterCode": {
      "python": "def top_player(scores):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "top_player([\"Alice:1500\", \"Bob:3200\", \"Charlie:800\", \"Diana:4100\", \"Eve:2950\"]) → \"Diana\"",
        "input": [
          [
            "Alice:1500",
            "Bob:3200",
            "Charlie:800",
            "Diana:4100",
            "Eve:2950"
          ]
        ],
        "expectedOutput": "Diana"
      },
      {
        "description": "top_player([\"X:100\", \"Y:200\"]) → \"Y\"",
        "input": [
          [
            "X:100",
            "Y:200"
          ]
        ],
        "expectedOutput": "Y"
      },
      {
        "description": "top_player([\"Solo:9999\"]) → \"Solo\"",
        "input": [
          [
            "Solo:9999"
          ]
        ],
        "expectedOutput": "Solo"
      }
    ],
    "tags": [
      "lists",
      "easy"
    ]
  },
  {
    "id": "py-033",
    "slug": "the-bouncer-s-checklist",
    "title": "The Bouncer's Checklist",
    "category": "number-crunching",
    "difficulty": "easy",
    "description": "## The Bouncer's Checklist\n\nA nightclub bouncer checks if a guest can enter. The rules are:\n\n1. Must be 18 or older\n2. Must be on the guest list\n\nWrite a function  that returns True if the guest meets BOTH conditions, and False otherwise.",
    "hint": "Use a single if-statement with two conditions joined by .",
    "starterCode": {
      "python": "def can_enter(age, name, guest_list):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "can_enter(21, \"Alice\", [\"Alice\", \"Bob\", \"Charlie\"]) → True",
        "input": [
          21,
          "Alice",
          [
            "Alice",
            "Bob",
            "Charlie"
          ]
        ],
        "expectedOutput": true
      },
      {
        "description": "can_enter(16, \"Bob\", [\"Alice\", \"Bob\", \"Charlie\"]) → False",
        "input": [
          16,
          "Bob",
          [
            "Alice",
            "Bob",
            "Charlie"
          ]
        ],
        "expectedOutput": false
      },
      {
        "description": "can_enter(25, \"Dave\", [\"Alice\", \"Bob\", \"Charlie\"]) → False",
        "input": [
          25,
          "Dave",
          [
            "Alice",
            "Bob",
            "Charlie"
          ]
        ],
        "expectedOutput": false
      },
      {
        "description": "can_enter(18, \"Charlie\", [\"Alice\", \"Bob\", \"Charlie\"]) → True",
        "input": [
          18,
          "Charlie",
          [
            "Alice",
            "Bob",
            "Charlie"
          ]
        ],
        "expectedOutput": true
      }
    ],
    "tags": [
      "conditions",
      "easy"
    ]
  },
  {
    "id": "py-034",
    "slug": "the-space-fuel-calculator",
    "title": "The Space Fuel Calculator",
    "category": "math-magic",
    "difficulty": "easy",
    "description": "## The Space Fuel Calculator\n\nA rocket burns fuel on its journey to Mars. For every kilometer traveled, it uses 3.5 units of fuel.\n\nHowever, if the journey is longer than 1000 km, the ship switches to hyper-drive which uses only 2.0 units per km for the excess distance.\n\nWrite a function  that returns the total fuel required.",
    "hint": "Check if distance > 1000. If so, calculate fuel for the first 1000 km normally, then add the discounted rate for the rest.",
    "starterCode": {
      "python": "def fuel_needed(distance):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "fuel_needed(500) → 1750.0",
        "input": [
          500
        ],
        "expectedOutput": 1750
      },
      {
        "description": "fuel_needed(1000) → 3500.0",
        "input": [
          1000
        ],
        "expectedOutput": 3500
      },
      {
        "description": "fuel_needed(1200) → 3900.0",
        "input": [
          1200
        ],
        "expectedOutput": 3900
      },
      {
        "description": "fuel_needed(0) → 0.0",
        "input": [
          0
        ],
        "expectedOutput": 0
      }
    ],
    "tags": [
      "math",
      "easy"
    ]
  },
  {
    "id": "py-035",
    "slug": "the-exam-roll-call",
    "title": "The Exam Roll Call",
    "category": "list-adventures",
    "difficulty": "easy",
    "description": "## The Exam Roll Call\n\nA teacher has the class roster and the list of students who actually showed up:\n\nroster = [\"Alice\", \"Bob\", \"Charlie\", \"Diana\", \"Eve\"]\npresent = [\"Alice\", \"Charlie\", \"Eve\"]\n\nWrite a function  that returns a sorted list of students who did NOT show up.",
    "hint": "Convert both lists to sets. Use the - operator (set difference) to find who is in the roster but not present.",
    "starterCode": {
      "python": "def find_absent(roster, present):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "find_absent([\"Alice\", \"Bob\", \"Charlie\", \"Diana\", \"Eve\"], [\"Alice\", \"Charlie\", \"Eve\"]) → [\"Bob\", \"Diana\"]",
        "input": [
          [
            "Alice",
            "Bob",
            "Charlie",
            "Diana",
            "Eve"
          ],
          [
            "Alice",
            "Charlie",
            "Eve"
          ]
        ],
        "expectedOutput": [
          "Bob",
          "Diana"
        ]
      },
      {
        "description": "find_absent([\"Alice\", \"Bob\"], [\"Alice\", \"Bob\"]) → []",
        "input": [
          [
            "Alice",
            "Bob"
          ],
          [
            "Alice",
            "Bob"
          ]
        ],
        "expectedOutput": []
      },
      {
        "description": "find_absent([\"Alice\", \"Bob\", \"Charlie\"], []) → [\"Alice\", \"Bob\", \"Charlie\"]",
        "input": [
          [
            "Alice",
            "Bob",
            "Charlie"
          ],
          []
        ],
        "expectedOutput": [
          "Alice",
          "Bob",
          "Charlie"
        ]
      }
    ],
    "tags": [
      "lists",
      "easy"
    ]
  },
  {
    "id": "py-036",
    "slug": "the-election-counter",
    "title": "The Election Counter",
    "category": "list-adventures",
    "difficulty": "medium",
    "description": "## The Election Counter\n\nA small town held an election. The ballots were collected and stored as a list of candidate names:\n\nballots = [\"Alice\", \"Bob\", \"Alice\", \"Charlie\", \"Bob\", \"Alice\", \"Bob\", \"Bob\"]\n\nWrite a function  that counts the votes and returns the name of the candidate with the most votes. If the list is empty, return None.",
    "hint": "First count all votes into a dictionary. Then find the key with the maximum value using max() with a key argument.",
    "starterCode": {
      "python": "def election_winner(ballots):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "election_winner([\"Alice\", \"Bob\", \"Alice\", \"Charlie\", \"Bob\", \"Alice\", \"Bob\", \"Bob\"]) → \"Bob\"",
        "input": [
          [
            "Alice",
            "Bob",
            "Alice",
            "Charlie",
            "Bob",
            "Alice",
            "Bob",
            "Bob"
          ]
        ],
        "expectedOutput": "Bob"
      },
      {
        "description": "election_winner([\"Alice\", \"Alice\", \"Alice\"]) → \"Alice\"",
        "input": [
          [
            "Alice",
            "Alice",
            "Alice"
          ]
        ],
        "expectedOutput": "Alice"
      },
      {
        "description": "election_winner([]) → None",
        "input": [
          []
        ],
        "expectedOutput": null
      }
    ],
    "tags": [
      "dictionaries",
      "medium"
    ]
  },
  {
    "id": "py-037",
    "slug": "the-stock-trader",
    "title": "The Stock Trader",
    "category": "list-adventures",
    "difficulty": "medium",
    "description": "## The Stock Trader\n\nA stock trader is looking at prices over the past week:\n\nprices = [7, 1, 5, 3, 6, 4]\n\nShe can buy on one day and sell on a later day. She wants to know the maximum profit she can make.\n\nWrite a function  that returns the maximum profit possible. If no profit can be made, return 0.",
    "hint": "Track the lowest price seen so far as you loop. At each step, calculate profit = current_price - min_price and update the maximum profit found.",
    "starterCode": {
      "python": "def max_profit(prices):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "max_profit([7, 1, 5, 3, 6, 4]) → 5",
        "input": [
          [
            7,
            1,
            5,
            3,
            6,
            4
          ]
        ],
        "expectedOutput": 5
      },
      {
        "description": "max_profit([7, 6, 4, 3, 1]) → 0",
        "input": [
          [
            7,
            6,
            4,
            3,
            1
          ]
        ],
        "expectedOutput": 0
      },
      {
        "description": "max_profit([1, 2]) → 1",
        "input": [
          [
            1,
            2
          ]
        ],
        "expectedOutput": 1
      },
      {
        "description": "max_profit([3, 3, 3]) → 0",
        "input": [
          [
            3,
            3,
            3
          ]
        ],
        "expectedOutput": 0
      }
    ],
    "tags": [
      "lists",
      "medium"
    ]
  },
  {
    "id": "py-038",
    "slug": "the-treasure-map",
    "title": "The Treasure Map",
    "category": "loop-quest",
    "difficulty": "medium",
    "description": "## The Treasure Map\n\nA pirate follows a treasure map. Starting at position (0, 0), she receives a list of directions:\n\ndirections = [\"N\", \"N\", \"E\", \"S\", \"E\", \"E\", \"N\"]\n\nEach move changes her position:\n- \"N\" → y + 1\n- \"S\" → y - 1\n- \"E\" → x + 1\n- \"W\" → x - 1\n\nWrite a function  that returns her final position as a list [x, y].",
    "hint": "Start with x=0, y=0. Loop through directions and update x or y based on each command.",
    "starterCode": {
      "python": "def treasure_location(directions):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "treasure_location([\"N\", \"N\", \"E\", \"S\", \"E\", \"E\", \"N\"]) → [3, 2]",
        "input": [
          [
            "N",
            "N",
            "E",
            "S",
            "E",
            "E",
            "N"
          ]
        ],
        "expectedOutput": [
          3,
          2
        ]
      },
      {
        "description": "treasure_location([\"N\", \"S\", \"E\", \"W\"]) → [0, 0]",
        "input": [
          [
            "N",
            "S",
            "E",
            "W"
          ]
        ],
        "expectedOutput": [
          0,
          0
        ]
      },
      {
        "description": "treasure_location([\"E\", \"E\", \"E\"]) → [3, 0]",
        "input": [
          [
            "E",
            "E",
            "E"
          ]
        ],
        "expectedOutput": [
          3,
          0
        ]
      },
      {
        "description": "treasure_location([]) → [0, 0]",
        "input": [
          []
        ],
        "expectedOutput": [
          0,
          0
        ]
      }
    ],
    "tags": [
      "loops",
      "medium"
    ]
  },
  {
    "id": "py-039",
    "slug": "the-spell-checker",
    "title": "The Spell Checker",
    "category": "list-adventures",
    "difficulty": "medium",
    "description": "## The Spell Checker\n\nA wizard keeps a spellbook. Each spell has a mana cost:\n\nspellbook = {\"fireball\": 30, \"heal\": 15, \"shield\": 20, \"teleport\": 50}\n\nThe wizard has 80 mana and wants to cast a sequence of spells:\n\nsequence = [\"heal\", \"fireball\", \"shield\"]\n\nWrite a function  that simulates casting the spells in order. Return a list of spell names that were successfully cast (only cast a spell if there is enough mana remaining).",
    "hint": "Loop through the sequence. For each spell, look up its cost. If mana >= cost, subtract the cost and add the spell to your results list.",
    "starterCode": {
      "python": "def cast_spells(spellbook, sequence, mana):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "cast_spells({\"fireball\": 30, \"heal\": 15, \"shield\": 20, \"teleport\": 50}, [\"heal\", \"fireball\", \"shield\"], 80) → [\"heal\", \"fireball\", \"shield\"]",
        "input": [
          {
            "fireball": 30,
            "heal": 15,
            "shield": 20,
            "teleport": 50
          },
          [
            "heal",
            "fireball",
            "shield"
          ],
          80
        ],
        "expectedOutput": [
          "heal",
          "fireball",
          "shield"
        ]
      },
      {
        "description": "cast_spells({\"fireball\": 30, \"heal\": 15, \"shield\": 20, \"teleport\": 50}, [\"teleport\", \"fireball\"], 40) → [\"teleport\"]",
        "input": [
          {
            "fireball": 30,
            "heal": 15,
            "shield": 20,
            "teleport": 50
          },
          [
            "teleport",
            "fireball"
          ],
          40
        ],
        "expectedOutput": [
          "teleport"
        ]
      },
      {
        "description": "cast_spells({\"fireball\": 30, \"heal\": 15, \"shield\": 20, \"teleport\": 50}, [\"fireball\", \"fireball\", \"fireball\"], 80) → [\"fireball\", \"fireball\"]",
        "input": [
          {
            "fireball": 30,
            "heal": 15,
            "shield": 20,
            "teleport": 50
          },
          [
            "fireball",
            "fireball",
            "fireball"
          ],
          80
        ],
        "expectedOutput": [
          "fireball",
          "fireball"
        ]
      }
    ],
    "tags": [
      "dictionaries",
      "medium"
    ]
  },
  {
    "id": "py-040",
    "slug": "the-virus-spread",
    "title": "The Virus Spread",
    "category": "list-adventures",
    "difficulty": "medium",
    "description": "## The Virus Spread\n\nScientists model a viral spread across a row of cities. Each city is either infected (1) or healthy (0):\n\ncities = [0, 1, 0, 0, 1, 0, 0, 0]\n\nAfter one day, a healthy city becomes infected if it has at least one infected neighbor (left or right).\n\nWrite a function  that returns the new state of the cities after one day of spreading. The original list should not be modified.",
    "hint": "Create a new list. For each city at index i, check if cities[i] is 1, or if any neighbor (i-1 or i+1, within bounds) is 1.",
    "starterCode": {
      "python": "def spread(cities):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "spread([0, 1, 0, 0, 1, 0, 0, 0]) → [1, 1, 1, 1, 1, 1, 0, 0]",
        "input": [
          [
            0,
            1,
            0,
            0,
            1,
            0,
            0,
            0
          ]
        ],
        "expectedOutput": [
          1,
          1,
          1,
          1,
          1,
          1,
          0,
          0
        ]
      },
      {
        "description": "spread([1, 0, 0, 0, 1]) → [1, 1, 0, 1, 1]",
        "input": [
          [
            1,
            0,
            0,
            0,
            1
          ]
        ],
        "expectedOutput": [
          1,
          1,
          0,
          1,
          1
        ]
      },
      {
        "description": "spread([0, 0, 0]) → [0, 0, 0]",
        "input": [
          [
            0,
            0,
            0
          ]
        ],
        "expectedOutput": [
          0,
          0,
          0
        ]
      },
      {
        "description": "spread([1, 1, 1]) → [1, 1, 1]",
        "input": [
          [
            1,
            1,
            1
          ]
        ],
        "expectedOutput": [
          1,
          1,
          1
        ]
      }
    ],
    "tags": [
      "lists",
      "medium"
    ]
  },
  {
    "id": "py-041",
    "slug": "find-missing-number",
    "title": "Find Missing Number",
    "category": "list-adventures",
    "difficulty": "medium",
    "description": "## Find Missing Number\n\nWrite a function `find_missing(arr)` that takes a list of integers containing unique numbers from 1 to n+1 (where one number in the sequence is missing, and the list length is n) and returns the missing number. The list is not sorted.",
    "hint": "Calculate the sum of numbers from 1 to n+1 using the formula `(n + 1) * (n + 2) // 2`, where `n = len(arr)`. The missing number is this expected sum minus the sum of the numbers in `arr`.",
    "starterCode": {
      "python": "def find_missing(arr):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "find_missing([1, 2, 4]) → 3",
        "input": [
          [
            1,
            2,
            4
          ]
        ],
        "expectedOutput": 3
      },
      {
        "description": "find_missing([3, 1, 5, 4]) → 2",
        "input": [
          [
            3,
            1,
            5,
            4
          ]
        ],
        "expectedOutput": 2
      },
      {
        "description": "find_missing([2, 3, 4, 5, 6, 1, 8]) → 7",
        "input": [
          [
            2,
            3,
            4,
            5,
            6,
            1,
            8
          ]
        ],
        "expectedOutput": 7
      },
      {
        "description": "find_missing([2]) → 1",
        "input": [
          [
            2
          ]
        ],
        "expectedOutput": 1
      }
    ],
    "tags": [
      "lists",
      "medium"
    ]
  },
  {
    "id": "py-042",
    "slug": "palindrome-checker",
    "title": "Palindrome Checker",
    "category": "string-sorcery",
    "difficulty": "easy",
    "description": "## Palindrome Checker\n\nWrite a function `is_palindrome(s)` that returns True if the string `s` is a palindrome, and False otherwise. A palindrome is a word, phrase, number, or other sequence of characters that reads the same forward and backward, ignoring case and all non-alphanumeric characters.",
    "hint": "Filter the string to keep only lowercase alphanumeric characters, then compare it to its reverse `filtered[::-1]`.",
    "starterCode": {
      "python": "def is_palindrome(s):\n    # Write your code here\n    pass",
      "javascript": "// Implement equivalent solution in JavaScript\nfunction solution() {\n  // your code here\n}"
    },
    "tests": [
      {
        "description": "is_palindrome('A man, a plan, a canal: Panama') → True",
        "input": [
          "A man, a plan, a canal: Panama"
        ],
        "expectedOutput": true
      },
      {
        "description": "is_palindrome('race a car') → False",
        "input": [
          "race a car"
        ],
        "expectedOutput": false
      },
      {
        "description": "is_palindrome(' ')  → True",
        "input": [
          " "
        ],
        "expectedOutput": true
      },
      {
        "description": "is_palindrome(\"No 'x' in Nixon\") → True",
        "input": [
          "No 'x' in Nixon"
        ],
        "expectedOutput": true
      }
    ],
    "tags": [
      "strings",
      "easy"
    ]
  },
  {
    "id": "sk-001",
    "slug": "all-students",
    "title": "All Students",
    "category": "sql-basics",
    "difficulty": "easy",
    "description": "## All Students\n\n**Dataset:** School\n\nGet a list of all `students`. Return their `name` and `age`.",
    "hint": "Use a simple `SELECT` statement to get columns from the `students` table.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "school",
      "easy"
    ],
    "schema_sql": "CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, grade INTEGER); CREATE TABLE classes (id INTEGER PRIMARY KEY, subject TEXT, teacher TEXT); CREATE TABLE enrollments (student_id INTEGER, class_id INTEGER, enrollment_date TEXT);",
    "seed_sql": "INSERT INTO students VALUES (1,'John Doe',14,9),(2,'Jane Smith',15,10),(3,'Sam Brown',14,9),(4,'Emily Davis',16,11),(5,'Michael Wilson',15,10); INSERT INTO classes VALUES (1,'Math','Mr. Miller'),(2,'Science','Ms. Green'),(3,'History','Mr. Brown'); INSERT INTO enrollments VALUES (1,1,'2023-09-01'),(1,2,'2023-09-01'),(2,1,'2023-09-01'),(3,3,'2023-09-02'),(4,2,'2023-09-02'),(5,1,'2023-09-03');",
    "answer_sql": "SELECT name, age FROM students;",
    "ordered": false
  },
  {
    "id": "sk-002",
    "slug": "find-young-students",
    "title": "Find Young Students",
    "category": "sql-basics",
    "difficulty": "easy",
    "description": "## Find Young Students\n\n**Dataset:** School\n\nFind all `students` who are `14` years old. Return their names.",
    "hint": "Use a `WHERE` clause to filter the `age` column.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "school",
      "easy"
    ],
    "schema_sql": "CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, grade INTEGER); CREATE TABLE classes (id INTEGER PRIMARY KEY, subject TEXT, teacher TEXT); CREATE TABLE enrollments (student_id INTEGER, class_id INTEGER, enrollment_date TEXT);",
    "seed_sql": "INSERT INTO students VALUES (1,'John Doe',14,9),(2,'Jane Smith',15,10),(3,'Sam Brown',14,9),(4,'Emily Davis',16,11),(5,'Michael Wilson',15,10);",
    "answer_sql": "SELECT name FROM students WHERE age = 14;",
    "ordered": false
  },
  {
    "id": "sk-003",
    "slug": "count-total-students",
    "title": "Count Total Students",
    "category": "sql-basics",
    "difficulty": "easy",
    "description": "## Count Total Students\n\n**Dataset:** School\n\nHow many `students` are enrolled in the school in total? Return the count as `total_students`.",
    "hint": "Use the COUNT(*) function.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "school",
      "easy"
    ],
    "schema_sql": "CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, grade INTEGER);",
    "seed_sql": "INSERT INTO students VALUES (1,'John Doe',14,9),(2,'Jane Smith',15,10),(3,'Sam Brown',14,9),(4,'Emily Davis',16,11),(5,'Michael Wilson',15,10);",
    "answer_sql": "SELECT COUNT(*) AS total_students FROM students;",
    "ordered": false
  },
  {
    "id": "sk-004",
    "slug": "students-in-grade-10",
    "title": "Students in Grade 10",
    "category": "sql-basics",
    "difficulty": "easy",
    "description": "## Students in Grade 10\n\n**Dataset:** School\n\nList the names of `students` who are in the 10th `grade`. Sort them alphabetically by `name`.",
    "hint": "Filter by `grade` and use `ORDER BY`.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "school",
      "easy"
    ],
    "schema_sql": "CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, grade INTEGER);",
    "seed_sql": "INSERT INTO students VALUES (1,'John Doe',14,9),(2,'Jane Smith',15,10),(3,'Sam Brown',14,9),(4,'Emily Davis',16,11),(5,'Michael Wilson',15,10);",
    "answer_sql": "SELECT name FROM students WHERE grade = 10 ORDER BY name ASC;",
    "ordered": false
  },
  {
    "id": "sk-005",
    "slug": "classes-and-teachers",
    "title": "Classes and Teachers",
    "category": "sql-basics",
    "difficulty": "easy",
    "description": "## Classes and Teachers\n\n**Dataset:** School\n\nGet a list of all subjects and the `teacher` who teaches them.",
    "hint": "Select columns from the `classes` table.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "school",
      "easy"
    ],
    "schema_sql": "CREATE TABLE classes (id INTEGER PRIMARY KEY, subject TEXT, teacher TEXT);",
    "seed_sql": "INSERT INTO classes VALUES (1,'Math','Mr. Miller'),(2,'Science','Ms. Green'),(3,'History','Mr. Brown');",
    "answer_sql": "SELECT subject, teacher FROM classes;",
    "ordered": false
  },
  {
    "id": "sk-006",
    "slug": "average-student-age",
    "title": "Average Student Age",
    "category": "sql-basics",
    "difficulty": "medium",
    "description": "## Average Student Age\n\n**Dataset:** School\n\nWhat is the average `age` of all `students`? Round the result to 1 decimal place.",
    "hint": "Use the AVG() function combined with ROUND().",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "school",
      "medium"
    ],
    "schema_sql": "CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, grade INTEGER);",
    "seed_sql": "INSERT INTO students VALUES (1,'John Doe',14,9),(2,'Jane Smith',15,10),(3,'Sam Brown',14,9),(4,'Emily Davis',16,11),(5,'Michael Wilson',15,10);",
    "answer_sql": "SELECT ROUND(AVG(age), 1) FROM students;",
    "ordered": false
  },
  {
    "id": "sk-007",
    "slug": "student-enrollment-count",
    "title": "Student Enrollment Count",
    "category": "sql-basics",
    "difficulty": "medium",
    "description": "## Student Enrollment Count\n\n**Dataset:** School\n\nFor each student, count how many `classes` they are enrolled in. Return student `name` and `class_count`.",
    "hint": "`JOIN` `students` and `enrollments`, then `GROUP BY` student `name`.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "school",
      "medium"
    ],
    "schema_sql": "CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, grade INTEGER); CREATE TABLE enrollments (student_id INTEGER, class_id INTEGER, enrollment_date TEXT);",
    "seed_sql": "INSERT INTO students VALUES (1,'John Doe',14,9),(2,'Jane Smith',15,10),(3,'Sam Brown',14,9); INSERT INTO enrollments VALUES (1,1,'2023-09-01'),(1,2,'2023-09-01'),(2,1,'2023-09-01');",
    "answer_sql": "SELECT s.name, COUNT(e.class_id) AS class_count FROM students s JOIN enrollments e ON s.id = e.student_id GROUP BY s.name;",
    "ordered": false
  },
  {
    "id": "sk-008",
    "slug": "students-in-math-class",
    "title": "Students in Math Class",
    "category": "sql-basics",
    "difficulty": "medium",
    "description": "## Students in Math Class\n\n**Dataset:** School\n\nFind the names of all `students` enrolled in the 'Math' class.",
    "hint": "You'll need to join all three tables: `students`, `enrollments`, and `classes`.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "school",
      "medium"
    ],
    "schema_sql": "CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, grade INTEGER); CREATE TABLE classes (id INTEGER PRIMARY KEY, subject TEXT, teacher TEXT); CREATE TABLE enrollments (student_id INTEGER, class_id INTEGER, enrollment_date TEXT);",
    "seed_sql": "INSERT INTO students VALUES (1,'John Doe',14,9),(2,'Jane Smith',15,10); INSERT INTO classes VALUES (1,'Math','Mr. Miller'),(2,'Science','Ms. Green'); INSERT INTO enrollments VALUES (1,1,'2023-09-01'),(2,1,'2023-09-01'),(2,2,'2023-09-01');",
    "answer_sql": "SELECT s.name FROM students s JOIN enrollments e ON s.id = e.student_id JOIN classes c ON e.class_id = c.id WHERE c.subject = 'Math';",
    "ordered": false
  },
  {
    "id": "ec-001",
    "slug": "customers-from-mumbai",
    "title": "Customers from Mumbai",
    "category": "sql-joins",
    "difficulty": "easy",
    "description": "## Customers from Mumbai\n\n**Dataset:** E-commerce\n\nList the names and emails of all `customers` who are from Mumbai.",
    "hint": "Use a `WHERE` clause to filter by `city`. String comparisons in SQL are case-sensitive by default in SQLite.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "e-commerce",
      "easy"
    ],
    "schema_sql": "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, email TEXT, city TEXT, joined_date TEXT); CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price REAL); CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, order_date TEXT, status TEXT); CREATE TABLE order_items (id INTEGER PRIMARY KEY, order_id INTEGER, product_id INTEGER, quantity INTEGER, unit_price REAL);",
    "seed_sql": "INSERT INTO customers VALUES (1,'Priya Sharma','priya@example.com','Mumbai','2022-01-15'),(2,'Rahul Mehta','rahul@example.com','Delhi','2022-02-20'),(3,'Anita Desai','anita@example.com','Mumbai','2022-03-10'),(4,'Vikram Singh','vikram@example.com','Bangalore','2022-04-05'),(5,'Neha Patel','neha@example.com','Mumbai','2022-05-18'),(6,'Arjun Rao','arjun@example.com','Chennai','2022-06-22'),(7,'Sunita Joshi','sunita@example.com','Delhi','2022-07-30'),(8,'Deepak Kumar','deepak@example.com','Bangalore','2022-08-14'),(9,'Kavya Nair','kavya@example.com','Mumbai','2022-09-01'),(10,'Rohan Gupta','rohan@example.com','Hyderabad','2022-10-12'),(11,'Meera Iyer','meera@example.com','Chennai','2022-11-05'),(12,'Sanjay Bose','sanjay@example.com','Kolkata','2022-12-19'),(13,'Pooja Agarwal','pooja@example.com','Mumbai','2023-01-08'),(14,'Amit Chaudhary','amit@example.com','Hyderabad','2023-02-14'),(15,'Ritu Verma','ritu@example.com','Delhi','2023-03-22'); INSERT INTO products VALUES (1,'Smartphone Pro','Electronics',45999.00),(2,'Wireless Earbuds','Electronics',3499.00),(3,'Laptop Ultra','Electronics',89999.00),(4,'Cotton T-Shirt','Clothing',799.00),(5,'Denim Jeans','Clothing',2499.00),(6,'Running Shoes','Clothing',4999.00),(7,'Python Cookbook','Books',699.00),(8,'SQL Mastery','Books',549.00),(9,'Design Patterns','Books',799.00),(10,'Coffee Maker','Home',3299.00),(11,'Air Purifier','Home',12999.00),(12,'LED Desk Lamp','Home',1499.00),(13,'Smartwatch','Electronics',15999.00),(14,'Yoga Mat','Clothing',1299.00),(15,'Blender Pro','Home',4599.00),(16,'Novel: Midnight','Books',399.00),(17,'Mechanical Keyboard','Electronics',6999.00),(18,'Winter Jacket','Clothing',5999.00),(19,'Bookshelf','Home',8999.00),(20,'Headphones Max','Electronics',22999.00); INSERT INTO orders VALUES (1,1,'2023-01-10','completed'),(2,2,'2023-01-15','completed'),(3,3,'2023-02-01','completed'),(4,4,'2023-02-14','pending'),(5,5,'2023-02-20','completed'),(6,6,'2023-03-05','cancelled'),(7,1,'2023-03-12','completed'),(8,7,'2023-03-18','completed'),(9,8,'2023-04-01','completed'),(10,9,'2023-04-10','pending'),(11,10,'2023-04-22','completed'),(12,11,'2023-05-01','completed'),(13,3,'2023-05-15','completed'),(14,12,'2023-05-20','cancelled'),(15,13,'2023-06-01','completed'),(16,2,'2023-06-10','completed'),(17,14,'2023-06-25','pending'),(18,15,'2023-07-04','completed'),(19,5,'2023-07-15','completed'),(20,1,'2023-07-20','completed'),(21,4,'2023-08-01','completed'),(22,6,'2023-08-12','completed'),(23,9,'2023-08-25','completed'),(24,10,'2023-09-01','pending'),(25,13,'2023-09-10','completed'),(26,15,'2023-09-22','completed'),(27,3,'2023-10-01','completed'),(28,7,'2023-10-14','completed'),(29,11,'2023-10-28','completed'),(30,14,'2023-11-05','completed'),(31,2,'2023-11-12','completed'),(32,8,'2023-11-20','cancelled'),(33,5,'2023-12-01','completed'),(34,12,'2023-12-10','completed'),(35,1,'2023-12-15','completed'),(36,6,'2023-12-20','completed'),(37,9,'2023-12-28','pending'),(38,13,'2023-12-30','completed'),(39,15,'2024-01-05','completed'),(40,4,'2024-01-10','completed'); INSERT INTO order_items VALUES (1,1,1,1,45999.00),(2,1,2,2,3499.00),(3,2,4,3,799.00),(4,2,7,1,699.00),(5,3,3,1,89999.00),(6,3,8,2,549.00),(7,4,5,2,2499.00),(8,4,10,1,3299.00),(9,5,6,1,4999.00),(10,5,13,1,15999.00),(11,6,11,1,12999.00),(12,7,2,1,3499.00),(13,7,12,2,1499.00),(14,8,17,1,6999.00),(15,9,20,1,22999.00),(16,10,14,2,1299.00),(17,10,16,3,399.00),(18,11,9,2,799.00),(19,11,4,5,799.00),(20,12,15,1,4599.00),(21,13,1,1,45999.00),(22,13,19,1,8999.00),(23,14,18,1,5999.00),(24,15,13,2,15999.00),(25,16,5,1,2499.00),(26,16,4,2,799.00),(27,17,11,1,12999.00),(28,18,6,2,4999.00),(29,19,2,3,3499.00),(30,20,17,1,6999.00),(31,21,3,1,89999.00),(32,22,7,2,699.00),(33,23,20,1,22999.00),(34,24,10,2,3299.00),(35,25,13,1,15999.00),(36,26,15,2,4599.00),(37,27,1,1,45999.00),(38,28,8,3,549.00),(39,29,12,2,1499.00),(40,30,5,1,2499.00),(41,31,9,1,799.00),(42,32,11,1,12999.00),(43,33,2,4,3499.00),(44,34,19,1,8999.00),(45,35,20,1,22999.00),(46,36,4,6,799.00),(47,37,13,1,15999.00),(48,38,17,2,6999.00),(49,39,3,1,89999.00),(50,40,6,3,4999.00),(51,40,14,2,1299.00),(52,35,1,1,45999.00),(53,33,6,1,4999.00),(54,31,17,1,6999.00),(55,29,9,2,799.00),(56,27,2,2,3499.00),(57,25,4,4,799.00),(58,23,5,1,2499.00),(59,21,8,2,549.00),(60,19,10,1,3299.00),(61,38,15,1,4599.00),(62,36,12,3,1499.00),(63,34,7,2,699.00),(64,32,16,4,399.00),(65,30,20,1,22999.00),(66,28,11,1,12999.00),(67,26,13,1,15999.00),(68,24,18,1,5999.00),(69,22,3,1,89999.00),(70,20,6,1,4999.00),(71,18,19,1,8999.00),(72,16,9,2,799.00),(73,14,4,3,799.00),(74,12,2,2,3499.00),(75,10,7,1,699.00),(76,8,5,1,2499.00),(77,6,14,1,1299.00),(78,4,12,1,1499.00),(79,2,6,1,4999.00),(80,1,14,1,1299.00);",
    "answer_sql": "SELECT name, email FROM customers WHERE city = 'Mumbai';",
    "ordered": false
  },
  {
    "id": "ec-002",
    "slug": "count-orders-per-status",
    "title": "Count Orders per Status",
    "category": "sql-joins",
    "difficulty": "easy",
    "description": "## Count Orders per Status\n\n**Dataset:** E-commerce\n\nCount how many `orders` exist for each `status`. Return `status` and `order_count`, sorted by `order_count` descending.",
    "hint": "Use `GROUP BY` on the `status` column and COUNT(*) to tally up `orders`. Then `ORDER BY` the count.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "e-commerce",
      "easy"
    ],
    "schema_sql": "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, email TEXT, city TEXT, joined_date TEXT); CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price REAL); CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, order_date TEXT, status TEXT); CREATE TABLE order_items (id INTEGER PRIMARY KEY, order_id INTEGER, product_id INTEGER, quantity INTEGER, unit_price REAL);",
    "seed_sql": "INSERT INTO customers VALUES (1,'Priya Sharma','priya@example.com','Mumbai','2022-01-15'),(2,'Rahul Mehta','rahul@example.com','Delhi','2022-02-20'),(3,'Anita Desai','anita@example.com','Mumbai','2022-03-10'),(4,'Vikram Singh','vikram@example.com','Bangalore','2022-04-05'),(5,'Neha Patel','neha@example.com','Mumbai','2022-05-18'),(6,'Arjun Rao','arjun@example.com','Chennai','2022-06-22'),(7,'Sunita Joshi','sunita@example.com','Delhi','2022-07-30'),(8,'Deepak Kumar','deepak@example.com','Bangalore','2022-08-14'),(9,'Kavya Nair','kavya@example.com','Mumbai','2022-09-01'),(10,'Rohan Gupta','rohan@example.com','Hyderabad','2022-10-12'),(11,'Meera Iyer','meera@example.com','Chennai','2022-11-05'),(12,'Sanjay Bose','sanjay@example.com','Kolkata','2022-12-19'),(13,'Pooja Agarwal','pooja@example.com','Mumbai','2023-01-08'),(14,'Amit Chaudhary','amit@example.com','Hyderabad','2023-02-14'),(15,'Ritu Verma','ritu@example.com','Delhi','2023-03-22'); INSERT INTO products VALUES (1,'Smartphone Pro','Electronics',45999.00),(2,'Wireless Earbuds','Electronics',3499.00),(3,'Laptop Ultra','Electronics',89999.00),(4,'Cotton T-Shirt','Clothing',799.00),(5,'Denim Jeans','Clothing',2499.00),(6,'Running Shoes','Clothing',4999.00),(7,'Python Cookbook','Books',699.00),(8,'SQL Mastery','Books',549.00),(9,'Design Patterns','Books',799.00),(10,'Coffee Maker','Home',3299.00),(11,'Air Purifier','Home',12999.00),(12,'LED Desk Lamp','Home',1499.00),(13,'Smartwatch','Electronics',15999.00),(14,'Yoga Mat','Clothing',1299.00),(15,'Blender Pro','Home',4599.00),(16,'Novel: Midnight','Books',399.00),(17,'Mechanical Keyboard','Electronics',6999.00),(18,'Winter Jacket','Clothing',5999.00),(19,'Bookshelf','Home',8999.00),(20,'Headphones Max','Electronics',22999.00); INSERT INTO orders VALUES (1,1,'2023-01-10','completed'),(2,2,'2023-01-15','completed'),(3,3,'2023-02-01','completed'),(4,4,'2023-02-14','pending'),(5,5,'2023-02-20','completed'),(6,6,'2023-03-05','cancelled'),(7,1,'2023-03-12','completed'),(8,7,'2023-03-18','completed'),(9,8,'2023-04-01','completed'),(10,9,'2023-04-10','pending'),(11,10,'2023-04-22','completed'),(12,11,'2023-05-01','completed'),(13,3,'2023-05-15','completed'),(14,12,'2023-05-20','cancelled'),(15,13,'2023-06-01','completed'),(16,2,'2023-06-10','completed'),(17,14,'2023-06-25','pending'),(18,15,'2023-07-04','completed'),(19,5,'2023-07-15','completed'),(20,1,'2023-07-20','completed'),(21,4,'2023-08-01','completed'),(22,6,'2023-08-12','completed'),(23,9,'2023-08-25','completed'),(24,10,'2023-09-01','pending'),(25,13,'2023-09-10','completed'),(26,15,'2023-09-22','completed'),(27,3,'2023-10-01','completed'),(28,7,'2023-10-14','completed'),(29,11,'2023-10-28','completed'),(30,14,'2023-11-05','completed'),(31,2,'2023-11-12','completed'),(32,8,'2023-11-20','cancelled'),(33,5,'2023-12-01','completed'),(34,12,'2023-12-10','completed'),(35,1,'2023-12-15','completed'),(36,6,'2023-12-20','completed'),(37,9,'2023-12-28','pending'),(38,13,'2023-12-30','completed'),(39,15,'2024-01-05','completed'),(40,4,'2024-01-10','completed'); INSERT INTO order_items VALUES (1,1,1,1,45999.00),(2,1,2,2,3499.00),(3,2,4,3,799.00),(4,2,7,1,699.00),(5,3,3,1,89999.00),(6,3,8,2,549.00),(7,4,5,2,2499.00),(8,4,10,1,3299.00),(9,5,6,1,4999.00),(10,5,13,1,15999.00),(11,6,11,1,12999.00),(12,7,2,1,3499.00),(13,7,12,2,1499.00),(14,8,17,1,6999.00),(15,9,20,1,22999.00),(16,10,14,2,1299.00),(17,10,16,3,399.00),(18,11,9,2,799.00),(19,11,4,5,799.00),(20,12,15,1,4599.00),(21,13,1,1,45999.00),(22,13,19,1,8999.00),(23,14,18,1,5999.00),(24,15,13,2,15999.00),(25,16,5,1,2499.00),(26,16,4,2,799.00),(27,17,11,1,12999.00),(28,18,6,2,4999.00),(29,19,2,3,3499.00),(30,20,17,1,6999.00),(31,21,3,1,89999.00),(32,22,7,2,699.00),(33,23,20,1,22999.00),(34,24,10,2,3299.00),(35,25,13,1,15999.00),(36,26,15,2,4599.00),(37,27,1,1,45999.00),(38,28,8,3,549.00),(39,29,12,2,1499.00),(40,30,5,1,2499.00),(41,31,9,1,799.00),(42,32,11,1,12999.00),(43,33,2,4,3499.00),(44,34,19,1,8999.00),(45,35,20,1,22999.00),(46,36,4,6,799.00),(47,37,13,1,15999.00),(48,38,17,2,6999.00),(49,39,3,1,89999.00),(50,40,6,3,4999.00),(51,40,14,2,1299.00);",
    "answer_sql": "SELECT status, COUNT(*) AS order_count FROM orders GROUP BY status ORDER BY order_count DESC;",
    "ordered": false
  },
  {
    "id": "ec-003",
    "slug": "top-3-customers-by-spend",
    "title": "Top 3 Customers by Spend",
    "category": "sql-joins",
    "difficulty": "medium",
    "description": "## Top 3 Customers by Spend\n\n**Dataset:** E-commerce\n\nFind the top 3 `customers` by total amount spent. Return `customer_name` and `total_spent` (rounded to 2 decimal places), ordered from highest to lowest.",
    "hint": "Join `customers` → `orders` → `order_items`. Multiply `quantity` × `unit_price` to get line item value, then SUM and `GROUP BY` customer.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "e-commerce",
      "medium"
    ],
    "schema_sql": "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, email TEXT, city TEXT, joined_date TEXT); CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price REAL); CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, order_date TEXT, status TEXT); CREATE TABLE order_items (id INTEGER PRIMARY KEY, order_id INTEGER, product_id INTEGER, quantity INTEGER, unit_price REAL);",
    "seed_sql": "INSERT INTO customers VALUES (1,'Priya Sharma','priya@example.com','Mumbai','2022-01-15'),(2,'Rahul Mehta','rahul@example.com','Delhi','2022-02-20'),(3,'Anita Desai','anita@example.com','Mumbai','2022-03-10'),(4,'Vikram Singh','vikram@example.com','Bangalore','2022-04-05'),(5,'Neha Patel','neha@example.com','Mumbai','2022-05-18'),(6,'Arjun Rao','arjun@example.com','Chennai','2022-06-22'),(7,'Sunita Joshi','sunita@example.com','Delhi','2022-07-30'),(8,'Deepak Kumar','deepak@example.com','Bangalore','2022-08-14'),(9,'Kavya Nair','kavya@example.com','Mumbai','2022-09-01'),(10,'Rohan Gupta','rohan@example.com','Hyderabad','2022-10-12'),(11,'Meera Iyer','meera@example.com','Chennai','2022-11-05'),(12,'Sanjay Bose','sanjay@example.com','Kolkata','2022-12-19'),(13,'Pooja Agarwal','pooja@example.com','Mumbai','2023-01-08'),(14,'Amit Chaudhary','amit@example.com','Hyderabad','2023-02-14'),(15,'Ritu Verma','ritu@example.com','Delhi','2023-03-22'); INSERT INTO products VALUES (1,'Smartphone Pro','Electronics',45999.00),(2,'Wireless Earbuds','Electronics',3499.00),(3,'Laptop Ultra','Electronics',89999.00),(4,'Cotton T-Shirt','Clothing',799.00),(5,'Denim Jeans','Clothing',2499.00),(6,'Running Shoes','Clothing',4999.00),(7,'Python Cookbook','Books',699.00),(8,'SQL Mastery','Books',549.00),(9,'Design Patterns','Books',799.00),(10,'Coffee Maker','Home',3299.00),(11,'Air Purifier','Home',12999.00),(12,'LED Desk Lamp','Home',1499.00),(13,'Smartwatch','Electronics',15999.00),(14,'Yoga Mat','Clothing',1299.00),(15,'Blender Pro','Home',4599.00),(16,'Novel: Midnight','Books',399.00),(17,'Mechanical Keyboard','Electronics',6999.00),(18,'Winter Jacket','Clothing',5999.00),(19,'Bookshelf','Home',8999.00),(20,'Headphones Max','Electronics',22999.00); INSERT INTO orders VALUES (1,1,'2023-01-10','completed'),(2,2,'2023-01-15','completed'),(3,3,'2023-02-01','completed'),(4,4,'2023-02-14','pending'),(5,5,'2023-02-20','completed'),(6,6,'2023-03-05','cancelled'),(7,1,'2023-03-12','completed'),(8,7,'2023-03-18','completed'),(9,8,'2023-04-01','completed'),(10,9,'2023-04-10','pending'),(11,10,'2023-04-22','completed'),(12,11,'2023-05-01','completed'),(13,3,'2023-05-15','completed'),(14,12,'2023-05-20','cancelled'),(15,13,'2023-06-01','completed'),(16,2,'2023-06-10','completed'),(17,14,'2023-06-25','pending'),(18,15,'2023-07-04','completed'),(19,5,'2023-07-15','completed'),(20,1,'2023-07-20','completed'),(21,4,'2023-08-01','completed'),(22,6,'2023-08-12','completed'),(23,9,'2023-08-25','completed'),(24,10,'2023-09-01','pending'),(25,13,'2023-09-10','completed'),(26,15,'2023-09-22','completed'),(27,3,'2023-10-01','completed'),(28,7,'2023-10-14','completed'),(29,11,'2023-10-28','completed'),(30,14,'2023-11-05','completed'),(31,2,'2023-11-12','completed'),(32,8,'2023-11-20','cancelled'),(33,5,'2023-12-01','completed'),(34,12,'2023-12-10','completed'),(35,1,'2023-12-15','completed'),(36,6,'2023-12-20','completed'),(37,9,'2023-12-28','pending'),(38,13,'2023-12-30','completed'),(39,15,'2024-01-05','completed'),(40,4,'2024-01-10','completed'); INSERT INTO order_items VALUES (1,1,1,1,45999.00),(2,1,2,2,3499.00),(3,2,4,3,799.00),(4,2,7,1,699.00),(5,3,3,1,89999.00),(6,3,8,2,549.00),(7,4,5,2,2499.00),(8,4,10,1,3299.00),(9,5,6,1,4999.00),(10,5,13,1,15999.00),(11,6,11,1,12999.00),(12,7,2,1,3499.00),(13,7,12,2,1499.00),(14,8,17,1,6999.00),(15,9,20,1,22999.00),(16,10,14,2,1299.00),(17,10,16,3,399.00),(18,11,9,2,799.00),(19,11,4,5,799.00),(20,12,15,1,4599.00),(21,13,1,1,45999.00),(22,13,19,1,8999.00),(23,14,18,1,5999.00),(24,15,13,2,15999.00),(25,16,5,1,2499.00),(26,16,4,2,799.00),(27,17,11,1,12999.00),(28,18,6,2,4999.00),(29,19,2,3,3499.00),(30,20,17,1,6999.00),(31,21,3,1,89999.00),(32,22,7,2,699.00),(33,23,20,1,22999.00),(34,24,10,2,3299.00),(35,25,13,1,15999.00),(36,26,15,2,4599.00),(37,27,1,1,45999.00),(38,28,8,3,549.00),(39,29,12,2,1499.00),(40,30,5,1,2499.00),(41,31,9,1,799.00),(42,32,11,1,12999.00),(43,33,2,4,3499.00),(44,34,19,1,8999.00),(45,35,20,1,22999.00),(46,36,4,6,799.00),(47,37,13,1,15999.00),(48,38,17,2,6999.00),(49,39,3,1,89999.00),(50,40,6,3,4999.00),(51,40,14,2,1299.00),(52,35,1,1,45999.00),(53,33,6,1,4999.00),(54,31,17,1,6999.00),(55,29,9,2,799.00),(56,27,2,2,3499.00),(57,25,4,4,799.00),(58,23,5,1,2499.00),(59,21,8,2,549.00),(60,19,10,1,3299.00),(61,38,15,1,4599.00),(62,36,12,3,1499.00),(63,34,7,2,699.00),(64,32,16,4,399.00),(65,30,20,1,22999.00),(66,28,11,1,12999.00),(67,26,13,1,15999.00),(68,24,18,1,5999.00),(69,22,3,1,89999.00),(70,20,6,1,4999.00),(71,18,19,1,8999.00),(72,16,9,2,799.00),(73,14,4,3,799.00),(74,12,2,2,3499.00),(75,10,7,1,699.00),(76,8,5,1,2499.00),(77,6,14,1,1299.00),(78,4,12,1,1499.00),(79,2,6,1,4999.00),(80,1,14,1,1299.00);",
    "answer_sql": "SELECT c.name AS customer_name, ROUND(SUM(oi.quantity * oi.unit_price), 2) AS total_spent FROM customers c JOIN orders o ON c.id = o.customer_id JOIN order_items oi ON o.id = oi.order_id GROUP BY c.id, c.name ORDER BY total_spent DESC LIMIT 3;",
    "ordered": true
  },
  {
    "id": "ec-004",
    "slug": "most-popular-product-category",
    "title": "Most Popular Product Category",
    "category": "sql-joins",
    "difficulty": "medium",
    "description": "## Most Popular Product Category\n\n**Dataset:** E-commerce\n\nFind the most popular product `category` by total `quantity` sold. Return `category` and `total_quantity_sold`, ordered from highest to lowest.",
    "hint": "You need to join `products` with `order_items`. Use SUM(`quantity`) and `GROUP BY` `category`.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "e-commerce",
      "medium"
    ],
    "schema_sql": "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, email TEXT, city TEXT, joined_date TEXT); CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price REAL); CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, order_date TEXT, status TEXT); CREATE TABLE order_items (id INTEGER PRIMARY KEY, order_id INTEGER, product_id INTEGER, quantity INTEGER, unit_price REAL);",
    "seed_sql": "INSERT INTO customers VALUES (1,'Priya Sharma','priya@example.com','Mumbai','2022-01-15'),(2,'Rahul Mehta','rahul@example.com','Delhi','2022-02-20'),(3,'Anita Desai','anita@example.com','Mumbai','2022-03-10'),(4,'Vikram Singh','vikram@example.com','Bangalore','2022-04-05'),(5,'Neha Patel','neha@example.com','Mumbai','2022-05-18'),(6,'Arjun Rao','arjun@example.com','Chennai','2022-06-22'),(7,'Sunita Joshi','sunita@example.com','Delhi','2022-07-30'),(8,'Deepak Kumar','deepak@example.com','Bangalore','2022-08-14'),(9,'Kavya Nair','kavya@example.com','Mumbai','2022-09-01'),(10,'Rohan Gupta','rohan@example.com','Hyderabad','2022-10-12'),(11,'Meera Iyer','meera@example.com','Chennai','2022-11-05'),(12,'Sanjay Bose','sanjay@example.com','Kolkata','2022-12-19'),(13,'Pooja Agarwal','pooja@example.com','Mumbai','2023-01-08'),(14,'Amit Chaudhary','amit@example.com','Hyderabad','2023-02-14'),(15,'Ritu Verma','ritu@example.com','Delhi','2023-03-22'); INSERT INTO products VALUES (1,'Smartphone Pro','Electronics',45999.00),(2,'Wireless Earbuds','Electronics',3499.00),(3,'Laptop Ultra','Electronics',89999.00),(4,'Cotton T-Shirt','Clothing',799.00),(5,'Denim Jeans','Clothing',2499.00),(6,'Running Shoes','Clothing',4999.00),(7,'Python Cookbook','Books',699.00),(8,'SQL Mastery','Books',549.00),(9,'Design Patterns','Books',799.00),(10,'Coffee Maker','Home',3299.00),(11,'Air Purifier','Home',12999.00),(12,'LED Desk Lamp','Home',1499.00),(13,'Smartwatch','Electronics',15999.00),(14,'Yoga Mat','Clothing',1299.00),(15,'Blender Pro','Home',4599.00),(16,'Novel: Midnight','Books',399.00),(17,'Mechanical Keyboard','Electronics',6999.00),(18,'Winter Jacket','Clothing',5999.00),(19,'Bookshelf','Home',8999.00),(20,'Headphones Max','Electronics',22999.00); INSERT INTO orders VALUES (1,1,'2023-01-10','completed'),(2,2,'2023-01-15','completed'),(3,3,'2023-02-01','completed'),(4,4,'2023-02-14','pending'),(5,5,'2023-02-20','completed'),(6,6,'2023-03-05','cancelled'),(7,1,'2023-03-12','completed'),(8,7,'2023-03-18','completed'),(9,8,'2023-04-01','completed'),(10,9,'2023-04-10','pending'),(11,10,'2023-04-22','completed'),(12,11,'2023-05-01','completed'),(13,3,'2023-05-15','completed'),(14,12,'2023-05-20','cancelled'),(15,13,'2023-06-01','completed'),(16,2,'2023-06-10','completed'),(17,14,'2023-06-25','pending'),(18,15,'2023-07-04','completed'),(19,5,'2023-07-15','completed'),(20,1,'2023-07-20','completed'),(21,4,'2023-08-01','completed'),(22,6,'2023-08-12','completed'),(23,9,'2023-08-25','completed'),(24,10,'2023-09-01','pending'),(25,13,'2023-09-10','completed'),(26,15,'2023-09-22','completed'),(27,3,'2023-10-01','completed'),(28,7,'2023-10-14','completed'),(29,11,'2023-10-28','completed'),(30,14,'2023-11-05','completed'),(31,2,'2023-11-12','completed'),(32,8,'2023-11-20','cancelled'),(33,5,'2023-12-01','completed'),(34,12,'2023-12-10','completed'),(35,1,'2023-12-15','completed'),(36,6,'2023-12-20','completed'),(37,9,'2023-12-28','pending'),(38,13,'2023-12-30','completed'),(39,15,'2024-01-05','completed'),(40,4,'2024-01-10','completed'); INSERT INTO order_items VALUES (1,1,1,1,45999.00),(2,1,2,2,3499.00),(3,2,4,3,799.00),(4,2,7,1,699.00),(5,3,3,1,89999.00),(6,3,8,2,549.00),(7,4,5,2,2499.00),(8,4,10,1,3299.00),(9,5,6,1,4999.00),(10,5,13,1,15999.00),(11,6,11,1,12999.00),(12,7,2,1,3499.00),(13,7,12,2,1499.00),(14,8,17,1,6999.00),(15,9,20,1,22999.00),(16,10,14,2,1299.00),(17,10,16,3,399.00),(18,11,9,2,799.00),(19,11,4,5,799.00),(20,12,15,1,4599.00),(21,13,1,1,45999.00),(22,13,19,1,8999.00),(23,14,18,1,5999.00),(24,15,13,2,15999.00),(25,16,5,1,2499.00),(26,16,4,2,799.00),(27,17,11,1,12999.00),(28,18,6,2,4999.00),(29,19,2,3,3499.00),(30,20,17,1,6999.00),(31,21,3,1,89999.00),(32,22,7,2,699.00),(33,23,20,1,22999.00),(34,24,10,2,3299.00),(35,25,13,1,15999.00),(36,26,15,2,4599.00),(37,27,1,1,45999.00),(38,28,8,3,549.00),(39,29,12,2,1499.00),(40,30,5,1,2499.00),(41,31,9,1,799.00),(42,32,11,1,12999.00),(43,33,2,4,3499.00),(44,34,19,1,8999.00),(45,35,20,1,22999.00),(46,36,4,6,799.00),(47,37,13,1,15999.00),(48,38,17,2,6999.00),(49,39,3,1,89999.00),(50,40,6,3,4999.00),(51,40,14,2,1299.00),(52,35,1,1,45999.00),(53,33,6,1,4999.00),(54,31,17,1,6999.00),(55,29,9,2,799.00),(56,27,2,2,3499.00),(57,25,4,4,799.00),(58,23,5,1,2499.00),(59,21,8,2,549.00),(60,19,10,1,3299.00),(61,38,15,1,4599.00),(62,36,12,3,1499.00),(63,34,7,2,699.00),(64,32,16,4,399.00),(65,30,20,1,22999.00),(66,28,11,1,12999.00),(67,26,13,1,15999.00),(68,24,18,1,5999.00),(69,22,3,1,89999.00),(70,20,6,1,4999.00),(71,18,19,1,8999.00),(72,16,9,2,799.00),(73,14,4,3,799.00),(74,12,2,2,3499.00),(75,10,7,1,699.00),(76,8,5,1,2499.00),(77,6,14,1,1299.00),(78,4,12,1,1499.00),(79,2,6,1,4999.00),(80,1,14,1,1299.00);",
    "answer_sql": "SELECT p.category, SUM(oi.quantity) AS total_quantity_sold FROM products p JOIN order_items oi ON p.id = oi.product_id GROUP BY p.category ORDER BY total_quantity_sold DESC;",
    "ordered": true
  },
  {
    "id": "ec-005",
    "slug": "customers-with-no-orders",
    "title": "Customers with No Orders",
    "category": "sql-joins",
    "difficulty": "medium",
    "description": "## Customers with No Orders\n\n**Dataset:** E-commerce\n\nFind all `customers` who have never placed an order. Return their `name` and `email`.",
    "hint": "Use a `LEFT JOIN` between `customers` and `orders`. When a `LEFT JOIN` finds no match, the joined columns will be NULL — filter for that.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "e-commerce",
      "medium"
    ],
    "schema_sql": "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, email TEXT, city TEXT, joined_date TEXT); CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price REAL); CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, order_date TEXT, status TEXT); CREATE TABLE order_items (id INTEGER PRIMARY KEY, order_id INTEGER, product_id INTEGER, quantity INTEGER, unit_price REAL);",
    "seed_sql": "INSERT INTO customers VALUES (1,'Priya Sharma','priya@example.com','Mumbai','2022-01-15'),(2,'Rahul Mehta','rahul@example.com','Delhi','2022-02-20'),(3,'Anita Desai','anita@example.com','Mumbai','2022-03-10'),(4,'Vikram Singh','vikram@example.com','Bangalore','2022-04-05'),(5,'Neha Patel','neha@example.com','Mumbai','2022-05-18'),(6,'Arjun Rao','arjun@example.com','Chennai','2022-06-22'),(7,'Sunita Joshi','sunita@example.com','Delhi','2022-07-30'),(8,'Deepak Kumar','deepak@example.com','Bangalore','2022-08-14'),(9,'Kavya Nair','kavya@example.com','Mumbai','2022-09-01'),(10,'Rohan Gupta','rohan@example.com','Hyderabad','2022-10-12'),(11,'Meera Iyer','meera@example.com','Chennai','2022-11-05'),(12,'Sanjay Bose','sanjay@example.com','Kolkata','2022-12-19'),(13,'Pooja Agarwal','pooja@example.com','Mumbai','2023-01-08'),(14,'Amit Chaudhary','amit@example.com','Hyderabad','2023-02-14'),(15,'Ritu Verma','ritu@example.com','Delhi','2023-03-22'); INSERT INTO products VALUES (1,'Smartphone Pro','Electronics',45999.00); INSERT INTO orders VALUES (1,1,'2023-01-10','completed'),(2,2,'2023-01-15','completed'),(3,3,'2023-02-01','completed'),(4,4,'2023-02-14','pending'),(5,5,'2023-02-20','completed'),(6,6,'2023-03-05','cancelled'),(7,1,'2023-03-12','completed'),(8,7,'2023-03-18','completed'),(9,8,'2023-04-01','completed'),(10,9,'2023-04-10','pending'),(11,10,'2023-04-22','completed'),(12,11,'2023-05-01','completed'),(13,3,'2023-05-15','completed'),(14,12,'2023-05-20','cancelled'),(15,13,'2023-06-01','completed'),(16,2,'2023-06-10','completed'),(17,14,'2023-06-25','pending'); INSERT INTO order_items VALUES (1,1,1,1,45999.00);",
    "answer_sql": "SELECT c.name, c.email FROM customers c LEFT JOIN orders o ON c.id = o.customer_id WHERE o.id IS NULL;",
    "ordered": false
  },
  {
    "id": "ec-006",
    "slug": "average-order-value-per-city",
    "title": "Average Order Value per City",
    "category": "sql-joins",
    "difficulty": "medium",
    "description": "## Average Order Value per City\n\n**Dataset:** E-commerce\n\nCalculate the average order value per `city`. An order's value is the sum of (`quantity` × `unit_price`) across all its items. Return `city` and `avg_order_value` rounded to 2 decimal places.",
    "hint": "You'll need to join `customers` → `orders` → `order_items`. First compute each order's total, then average those totals by `city`.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "e-commerce",
      "medium"
    ],
    "schema_sql": "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, email TEXT, city TEXT, joined_date TEXT); CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price REAL); CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, order_date TEXT, status TEXT); CREATE TABLE order_items (id INTEGER PRIMARY KEY, order_id INTEGER, product_id INTEGER, quantity INTEGER, unit_price REAL);",
    "seed_sql": "INSERT INTO customers VALUES (1,'Priya Sharma','priya@example.com','Mumbai','2022-01-15'),(2,'Rahul Mehta','rahul@example.com','Delhi','2022-02-20'),(3,'Anita Desai','anita@example.com','Mumbai','2022-03-10'),(4,'Vikram Singh','vikram@example.com','Bangalore','2022-04-05'),(5,'Neha Patel','neha@example.com','Mumbai','2022-05-18'),(6,'Arjun Rao','arjun@example.com','Chennai','2022-06-22'),(7,'Sunita Joshi','sunita@example.com','Delhi','2022-07-30'),(8,'Deepak Kumar','deepak@example.com','Bangalore','2022-08-14'),(9,'Kavya Nair','kavya@example.com','Mumbai','2022-09-01'),(10,'Rohan Gupta','rohan@example.com','Hyderabad','2022-10-12'),(11,'Meera Iyer','meera@example.com','Chennai','2022-11-05'),(12,'Sanjay Bose','sanjay@example.com','Kolkata','2022-12-19'),(13,'Pooja Agarwal','pooja@example.com','Mumbai','2023-01-08'),(14,'Amit Chaudhary','amit@example.com','Hyderabad','2023-02-14'),(15,'Ritu Verma','ritu@example.com','Delhi','2023-03-22'); INSERT INTO products VALUES (1,'Smartphone Pro','Electronics',45999.00); INSERT INTO orders VALUES (1,1,'2023-01-10','completed'),(2,2,'2023-01-15','completed'),(3,3,'2023-02-01','completed'),(4,4,'2023-02-14','pending'),(5,5,'2023-02-20','completed'),(6,6,'2023-03-05','cancelled'),(7,1,'2023-03-12','completed'),(8,7,'2023-03-18','completed'),(9,8,'2023-04-01','completed'),(10,9,'2023-04-10','pending'),(11,10,'2023-04-22','completed'),(12,11,'2023-05-01','completed'),(13,3,'2023-05-15','completed'),(14,12,'2023-05-20','cancelled'),(15,13,'2023-06-01','completed'),(16,2,'2023-06-10','completed'),(17,14,'2023-06-25','pending'),(18,15,'2023-07-04','completed'); INSERT INTO order_items VALUES (1,1,1,1,45999.00),(2,1,2,2,3499.00),(3,2,4,3,799.00),(4,2,7,1,699.00),(5,3,3,1,89999.00),(6,3,8,2,549.00),(7,4,5,2,2499.00),(8,4,10,1,3299.00),(9,5,6,1,4999.00),(10,5,13,1,15999.00),(11,6,11,1,12999.00),(12,7,2,1,3499.00),(13,7,12,2,1499.00),(14,8,17,1,6999.00),(15,9,20,1,22999.00),(16,10,14,2,1299.00),(17,10,16,3,399.00),(18,11,9,2,799.00),(19,11,4,5,799.00),(20,12,15,1,4599.00),(21,13,1,1,45999.00),(22,13,19,1,8999.00),(23,14,18,1,5999.00),(24,15,13,2,15999.00);",
    "answer_sql": "SELECT c.city, ROUND(AVG(order_totals.total), 2) AS avg_order_value FROM customers c JOIN orders o ON c.id = o.customer_id JOIN (SELECT order_id, SUM(quantity * unit_price) AS total FROM order_items GROUP BY order_id) order_totals ON o.id = order_totals.order_id GROUP BY c.city;",
    "ordered": false
  },
  {
    "id": "ec-007",
    "slug": "month-with-highest-revenue-2023",
    "title": "Month with Highest Revenue (2023)",
    "category": "sql-joins",
    "difficulty": "hard",
    "description": "## Month with Highest Revenue (2023)\n\n**Dataset:** E-commerce\n\nFind the `month` in `2023` with the highest total revenue. Return `month` (as `YYYY-MM`) and `total_revenue` rounded to 2 decimal places.",
    "hint": "Use strftime('%Y-%m', `order_date`) to extract the year-`month`. Filter to `2023`, then SUM and `ORDER BY` `total_revenue` DESC `LIMIT 1`.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "e-commerce",
      "hard"
    ],
    "schema_sql": "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, email TEXT, city TEXT, joined_date TEXT); CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price REAL); CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, order_date TEXT, status TEXT); CREATE TABLE order_items (id INTEGER PRIMARY KEY, order_id INTEGER, product_id INTEGER, quantity INTEGER, unit_price REAL);",
    "seed_sql": "INSERT INTO customers VALUES (1,'Priya Sharma','priya@example.com','Mumbai','2022-01-15'),(2,'Rahul Mehta','rahul@example.com','Delhi','2022-02-20'),(3,'Anita Desai','anita@example.com','Mumbai','2022-03-10'); INSERT INTO products VALUES (1,'Smartphone Pro','Electronics',45999.00); INSERT INTO orders VALUES (1,1,'2023-01-10','completed'),(2,2,'2023-01-15','completed'),(3,3,'2023-02-01','completed'),(4,1,'2023-02-14','completed'),(5,2,'2023-03-05','completed'),(6,3,'2023-04-01','completed'),(7,1,'2023-05-15','completed'),(8,2,'2023-06-10','completed'),(9,3,'2023-07-04','completed'),(10,1,'2023-08-25','completed'),(11,2,'2023-09-10','completed'),(12,3,'2023-10-01','completed'),(13,1,'2023-10-14','completed'),(14,2,'2023-11-12','completed'),(15,3,'2023-12-01','completed'),(16,1,'2023-12-15','completed'),(17,2,'2023-12-30','completed'); INSERT INTO order_items VALUES (1,1,1,1,45999.00),(2,1,1,2,3499.00),(3,2,1,3,799.00),(4,2,1,1,699.00),(5,3,1,1,89999.00),(6,3,1,2,549.00),(7,4,1,2,2499.00),(8,4,1,1,3299.00),(9,5,1,1,4999.00),(10,5,1,1,15999.00),(11,6,1,1,12999.00),(12,7,1,1,3499.00),(13,7,1,2,1499.00),(14,8,1,1,6999.00),(15,9,1,1,22999.00),(16,10,1,2,1299.00),(17,10,1,3,399.00),(18,11,1,2,799.00),(19,11,1,5,799.00),(20,12,1,1,4599.00),(21,13,1,1,45999.00),(22,13,1,1,8999.00),(23,14,1,1,5999.00),(24,15,1,2,15999.00),(25,16,1,1,2499.00),(26,16,1,2,799.00),(27,17,1,1,12999.00);",
    "answer_sql": "SELECT strftime('%Y-%m', o.order_date) AS month, ROUND(SUM(oi.quantity * oi.unit_price), 2) AS total_revenue FROM orders o JOIN order_items oi ON o.id = oi.order_id WHERE strftime('%Y', o.order_date) = '2023' GROUP BY month ORDER BY total_revenue DESC LIMIT 1;",
    "ordered": true
  },
  {
    "id": "ec-008",
    "slug": "products-bought-together-most-often",
    "title": "Products Bought Together Most Often",
    "category": "sql-joins",
    "difficulty": "hard",
    "description": "## Products Bought Together Most Often\n\n**Dataset:** E-commerce\n\nFind the pair of `products` that appear in the same order most frequently. Return `product_a`, `product_b`, and `times_bought_together`. Only return the top pair (`product_a` < `product_b` to avoid duplicates).",
    "hint": "Self-join `order_items` on `order_id` where the two product_ids differ. Use `product_a` < `product_b` to avoid counting pairs twice. Then `GROUP BY` both product names and take `LIMIT 1`.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "e-commerce",
      "hard"
    ],
    "schema_sql": "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, email TEXT, city TEXT, joined_date TEXT); CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price REAL); CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, order_date TEXT, status TEXT); CREATE TABLE order_items (id INTEGER PRIMARY KEY, order_id INTEGER, product_id INTEGER, quantity INTEGER, unit_price REAL);",
    "seed_sql": "INSERT INTO customers VALUES (1,'Priya Sharma','priya@example.com','Mumbai','2022-01-15'); INSERT INTO products VALUES (1,'Smartphone Pro','Electronics',45999.00),(2,'Wireless Earbuds','Electronics',3499.00),(3,'Laptop Ultra','Electronics',89999.00),(4,'Cotton T-Shirt','Clothing',799.00),(5,'Denim Jeans','Clothing',2499.00); INSERT INTO orders VALUES (1,1,'2023-01-10','completed'),(2,1,'2023-02-10','completed'),(3,1,'2023-03-10','completed'),(4,1,'2023-04-10','completed'),(5,1,'2023-05-10','completed'); INSERT INTO order_items VALUES (1,1,1,1,45999.00),(2,1,2,1,3499.00),(3,2,1,1,45999.00),(4,2,2,1,3499.00),(5,3,1,1,45999.00),(6,3,2,1,3499.00),(7,4,2,1,3499.00),(8,4,3,1,89999.00),(9,5,4,1,799.00),(10,5,5,1,2499.00);",
    "answer_sql": "SELECT p1.name AS product_a, p2.name AS product_b, COUNT(*) AS times_bought_together FROM order_items oi1 JOIN order_items oi2 ON oi1.order_id = oi2.order_id AND oi1.product_id < oi2.product_id JOIN products p1 ON oi1.product_id = p1.id JOIN products p2 ON oi2.product_id = p2.id GROUP BY p1.id, p2.id ORDER BY times_bought_together DESC LIMIT 1;",
    "ordered": true
  },
  {
    "id": "hr-001",
    "slug": "list-all-senior-employees",
    "title": "List All Senior Employees",
    "category": "sql-aggregates",
    "difficulty": "easy",
    "description": "## List All Senior Employees\n\n**Dataset:** Company HR\n\nList the `name` and `salary` of all `employees` with `level` 'senior'. Order by `salary` descending.",
    "hint": "Use a simple `WHERE` clause filtering on the `level` column.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "company hr",
      "easy"
    ],
    "schema_sql": "CREATE TABLE departments (id INTEGER PRIMARY KEY, name TEXT, budget REAL); CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department_id INTEGER, manager_id INTEGER, salary REAL, hire_date TEXT, level TEXT);",
    "seed_sql": "INSERT INTO departments VALUES (1,'Engineering',5000000.00),(2,'Marketing',2000000.00),(3,'Sales',3000000.00),(4,'HR',1500000.00),(5,'Finance',2500000.00); INSERT INTO employees VALUES (1,'Alice Chen',1,NULL,180000.00,'2018-03-15','lead'),(2,'Bob Martinez',1,1,130000.00,'2019-06-01','senior'),(3,'Carol White',1,1,125000.00,'2020-01-10','senior'),(4,'David Lee',1,2,90000.00,'2021-04-20','mid'),(5,'Emma Wilson',1,2,75000.00,'2022-08-01','junior'),(6,'Frank Brown',2,NULL,160000.00,'2017-11-05','lead'),(7,'Grace Kim',2,6,120000.00,'2019-09-15','senior'),(8,'Henry Davis',2,6,95000.00,'2021-02-28','mid'),(9,'Iris Zhang',3,NULL,155000.00,'2018-07-20','lead'),(10,'Jack Taylor',3,9,115000.00,'2020-05-12','senior'),(11,'Kate Anderson',3,9,110000.00,'2020-11-01','senior'),(12,'Liam Thomas',3,10,85000.00,'2022-01-15','mid'),(13,'Mia Jackson',3,10,70000.00,'2023-03-01','junior'),(14,'Noah Harris',4,NULL,140000.00,'2019-01-08','lead'),(15,'Olivia Martin',4,14,105000.00,'2021-06-14','senior'),(16,'Paul Garcia',5,NULL,170000.00,'2017-05-22','lead'),(17,'Quinn Robinson',5,16,135000.00,'2019-10-30','senior'),(18,'Rachel Clark',5,16,128000.00,'2020-08-17','senior'),(19,'Sam Lewis',1,3,72000.00,'2023-06-01','junior'),(20,'Tara Walker',2,7,88000.00,'2022-03-15','mid');",
    "answer_sql": "SELECT name, salary FROM employees WHERE level = 'senior' ORDER BY salary DESC;",
    "ordered": false
  },
  {
    "id": "hr-002",
    "slug": "average-salary-per-department",
    "title": "Average Salary per Department",
    "category": "sql-aggregates",
    "difficulty": "easy",
    "description": "## Average Salary per Department\n\n**Dataset:** Company HR\n\nFind the average `salary` per department. Return `department_name` and `avg_salary` rounded to 2 decimal places.",
    "hint": "`JOIN` `employees` with `departments` on department_id. Use AVG() and `GROUP BY` the department `name`.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "company hr",
      "easy"
    ],
    "schema_sql": "CREATE TABLE departments (id INTEGER PRIMARY KEY, name TEXT, budget REAL); CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department_id INTEGER, manager_id INTEGER, salary REAL, hire_date TEXT, level TEXT);",
    "seed_sql": "INSERT INTO departments VALUES (1,'Engineering',5000000.00),(2,'Marketing',2000000.00),(3,'Sales',3000000.00),(4,'HR',1500000.00),(5,'Finance',2500000.00); INSERT INTO employees VALUES (1,'Alice Chen',1,NULL,180000.00,'2018-03-15','lead'),(2,'Bob Martinez',1,1,130000.00,'2019-06-01','senior'),(3,'Carol White',1,1,125000.00,'2020-01-10','senior'),(4,'David Lee',1,2,90000.00,'2021-04-20','mid'),(5,'Emma Wilson',1,2,75000.00,'2022-08-01','junior'),(6,'Frank Brown',2,NULL,160000.00,'2017-11-05','lead'),(7,'Grace Kim',2,6,120000.00,'2019-09-15','senior'),(8,'Henry Davis',2,6,95000.00,'2021-02-28','mid'),(9,'Iris Zhang',3,NULL,155000.00,'2018-07-20','lead'),(10,'Jack Taylor',3,9,115000.00,'2020-05-12','senior'),(11,'Kate Anderson',3,9,110000.00,'2020-11-01','senior'),(12,'Liam Thomas',3,10,85000.00,'2022-01-15','mid'),(13,'Mia Jackson',3,10,70000.00,'2023-03-01','junior'),(14,'Noah Harris',4,NULL,140000.00,'2019-01-08','lead'),(15,'Olivia Martin',4,14,105000.00,'2021-06-14','senior'),(16,'Paul Garcia',5,NULL,170000.00,'2017-05-22','lead'),(17,'Quinn Robinson',5,16,135000.00,'2019-10-30','senior'),(18,'Rachel Clark',5,16,128000.00,'2020-08-17','senior'),(19,'Sam Lewis',1,3,72000.00,'2023-06-01','junior'),(20,'Tara Walker',2,7,88000.00,'2022-03-15','mid');",
    "answer_sql": "SELECT d.name AS department_name, ROUND(AVG(e.salary), 2) AS avg_salary FROM departments d JOIN employees e ON d.id = e.department_id GROUP BY d.id, d.name;",
    "ordered": false
  },
  {
    "id": "hr-003",
    "slug": "employees-above-department-average",
    "title": "Employees Above Department Average",
    "category": "sql-aggregates",
    "difficulty": "hard",
    "description": "## Employees Above Department Average\n\n**Dataset:** Company HR\n\nFind all `employees` who earn more than the average `salary` of their own department. Return employee `name`, their `salary`, and the department `name`.",
    "hint": "Use a subquery or a correlated subquery. For each employee, compare their `salary` to AVG(`salary`) of their department_id.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "company hr",
      "hard"
    ],
    "schema_sql": "CREATE TABLE departments (id INTEGER PRIMARY KEY, name TEXT, budget REAL); CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department_id INTEGER, manager_id INTEGER, salary REAL, hire_date TEXT, level TEXT);",
    "seed_sql": "INSERT INTO departments VALUES (1,'Engineering',5000000.00),(2,'Marketing',2000000.00),(3,'Sales',3000000.00),(4,'HR',1500000.00),(5,'Finance',2500000.00); INSERT INTO employees VALUES (1,'Alice Chen',1,NULL,180000.00,'2018-03-15','lead'),(2,'Bob Martinez',1,1,130000.00,'2019-06-01','senior'),(3,'Carol White',1,1,125000.00,'2020-01-10','senior'),(4,'David Lee',1,2,90000.00,'2021-04-20','mid'),(5,'Emma Wilson',1,2,75000.00,'2022-08-01','junior'),(6,'Frank Brown',2,NULL,160000.00,'2017-11-05','lead'),(7,'Grace Kim',2,6,120000.00,'2019-09-15','senior'),(8,'Henry Davis',2,6,95000.00,'2021-02-28','mid'),(9,'Iris Zhang',3,NULL,155000.00,'2018-07-20','lead'),(10,'Jack Taylor',3,9,115000.00,'2020-05-12','senior'),(11,'Kate Anderson',3,9,110000.00,'2020-11-01','senior'),(12,'Liam Thomas',3,10,85000.00,'2022-01-15','mid'),(13,'Mia Jackson',3,10,70000.00,'2023-03-01','junior'),(14,'Noah Harris',4,NULL,140000.00,'2019-01-08','lead'),(15,'Olivia Martin',4,14,105000.00,'2021-06-14','senior'),(16,'Paul Garcia',5,NULL,170000.00,'2017-05-22','lead'),(17,'Quinn Robinson',5,16,135000.00,'2019-10-30','senior'),(18,'Rachel Clark',5,16,128000.00,'2020-08-17','senior'),(19,'Sam Lewis',1,3,72000.00,'2023-06-01','junior'),(20,'Tara Walker',2,7,88000.00,'2022-03-15','mid');",
    "answer_sql": "SELECT e.name, e.salary, d.name AS department_name FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.salary > (SELECT AVG(e2.salary) FROM employees e2 WHERE e2.department_id = e.department_id);",
    "ordered": false
  },
  {
    "id": "hr-004",
    "slug": "each-employee-s-manager",
    "title": "Each Employee's Manager",
    "category": "sql-aggregates",
    "difficulty": "medium",
    "description": "## Each Employee's Manager\n\n**Dataset:** Company HR\n\nShow each employee's `name` alongside their manager's `name`. Only include `employees` who have a manager (not top-`level` leads). Return `employee_name` and `manager_name`.",
    "hint": "Self-join the `employees` table: join `employees` AS e to `employees` AS m on e.`manager_id` = m.`id`. Exclude rows where `manager_id` is NULL.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "company hr",
      "medium"
    ],
    "schema_sql": "CREATE TABLE departments (id INTEGER PRIMARY KEY, name TEXT, budget REAL); CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department_id INTEGER, manager_id INTEGER, salary REAL, hire_date TEXT, level TEXT);",
    "seed_sql": "INSERT INTO departments VALUES (1,'Engineering',5000000.00),(2,'Marketing',2000000.00),(3,'Sales',3000000.00),(4,'HR',1500000.00),(5,'Finance',2500000.00); INSERT INTO employees VALUES (1,'Alice Chen',1,NULL,180000.00,'2018-03-15','lead'),(2,'Bob Martinez',1,1,130000.00,'2019-06-01','senior'),(3,'Carol White',1,1,125000.00,'2020-01-10','senior'),(4,'David Lee',1,2,90000.00,'2021-04-20','mid'),(5,'Emma Wilson',1,2,75000.00,'2022-08-01','junior'),(6,'Frank Brown',2,NULL,160000.00,'2017-11-05','lead'),(7,'Grace Kim',2,6,120000.00,'2019-09-15','senior'),(8,'Henry Davis',2,6,95000.00,'2021-02-28','mid'),(9,'Iris Zhang',3,NULL,155000.00,'2018-07-20','lead'),(10,'Jack Taylor',3,9,115000.00,'2020-05-12','senior'),(11,'Kate Anderson',3,9,110000.00,'2020-11-01','senior'),(12,'Liam Thomas',3,10,85000.00,'2022-01-15','mid'),(13,'Mia Jackson',3,10,70000.00,'2023-03-01','junior'),(14,'Noah Harris',4,NULL,140000.00,'2019-01-08','lead'),(15,'Olivia Martin',4,14,105000.00,'2021-06-14','senior'),(16,'Paul Garcia',5,NULL,170000.00,'2017-05-22','lead'),(17,'Quinn Robinson',5,16,135000.00,'2019-10-30','senior'),(18,'Rachel Clark',5,16,128000.00,'2020-08-17','senior'),(19,'Sam Lewis',1,3,72000.00,'2023-06-01','junior'),(20,'Tara Walker',2,7,88000.00,'2022-03-15','mid');",
    "answer_sql": "SELECT e.name AS employee_name, m.name AS manager_name FROM employees e JOIN employees m ON e.manager_id = m.id;",
    "ordered": false
  },
  {
    "id": "hr-005",
    "slug": "departments-over-budget",
    "title": "Departments Over Budget",
    "category": "sql-aggregates",
    "difficulty": "hard",
    "description": "## Departments Over Budget\n\n**Dataset:** Company HR\n\nFind `departments` where the total `salary` bill exceeds the department `budget`. Return `department_name`, `total_salaries`, and `budget`.",
    "hint": "SUM employee salaries per department and `JOIN` with the `departments` table. Use HAVING to filter groups where the sum exceeds the `budget`.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "company hr",
      "hard"
    ],
    "schema_sql": "CREATE TABLE departments (id INTEGER PRIMARY KEY, name TEXT, budget REAL); CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department_id INTEGER, manager_id INTEGER, salary REAL, hire_date TEXT, level TEXT);",
    "seed_sql": "INSERT INTO departments VALUES (1,'Engineering',500000.00),(2,'Marketing',400000.00),(3,'Sales',300000.00),(4,'HR',150000.00),(5,'Finance',250000.00); INSERT INTO employees VALUES (1,'Alice Chen',1,NULL,180000.00,'2018-03-15','lead'),(2,'Bob Martinez',1,1,130000.00,'2019-06-01','senior'),(3,'Carol White',1,1,125000.00,'2020-01-10','senior'),(4,'David Lee',1,2,90000.00,'2021-04-20','mid'),(5,'Emma Wilson',1,2,75000.00,'2022-08-01','junior'),(6,'Frank Brown',2,NULL,160000.00,'2017-11-05','lead'),(7,'Grace Kim',2,6,120000.00,'2019-09-15','senior'),(8,'Henry Davis',2,6,95000.00,'2021-02-28','mid'),(9,'Iris Zhang',3,NULL,155000.00,'2018-07-20','lead'),(10,'Jack Taylor',3,9,115000.00,'2020-05-12','senior'),(11,'Kate Anderson',3,9,110000.00,'2020-11-01','senior'),(12,'Liam Thomas',3,10,85000.00,'2022-01-15','mid'),(13,'Mia Jackson',3,10,70000.00,'2023-03-01','junior'),(14,'Noah Harris',4,NULL,140000.00,'2019-01-08','lead'),(15,'Olivia Martin',4,14,105000.00,'2021-06-14','senior'),(16,'Paul Garcia',5,NULL,170000.00,'2017-05-22','lead'),(17,'Quinn Robinson',5,16,135000.00,'2019-10-30','senior'),(18,'Rachel Clark',5,16,128000.00,'2020-08-17','senior'),(19,'Sam Lewis',1,3,72000.00,'2023-06-01','junior'),(20,'Tara Walker',2,7,88000.00,'2022-03-15','mid');",
    "answer_sql": "SELECT d.name AS department_name, SUM(e.salary) AS total_salaries, d.budget FROM departments d JOIN employees e ON d.id = e.department_id GROUP BY d.id, d.name, d.budget HAVING SUM(e.salary) > d.budget;",
    "ordered": false
  },
  {
    "id": "hr-006",
    "slug": "longest-serving-employee-per-department",
    "title": "Longest-Serving Employee per Department",
    "category": "sql-aggregates",
    "difficulty": "hard",
    "description": "## Longest-Serving Employee per Department\n\n**Dataset:** Company HR\n\nFind the longest-serving employee (earliest `hire_date`) in each department. Return `department_name`, `employee_name`, and `hire_date`.",
    "hint": "Use a subquery to find the MIN(`hire_date`) per department, then join back to find the employee with that date.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "company hr",
      "hard"
    ],
    "schema_sql": "CREATE TABLE departments (id INTEGER PRIMARY KEY, name TEXT, budget REAL); CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department_id INTEGER, manager_id INTEGER, salary REAL, hire_date TEXT, level TEXT);",
    "seed_sql": "INSERT INTO departments VALUES (1,'Engineering',5000000.00),(2,'Marketing',2000000.00),(3,'Sales',3000000.00),(4,'HR',1500000.00),(5,'Finance',2500000.00); INSERT INTO employees VALUES (1,'Alice Chen',1,NULL,180000.00,'2018-03-15','lead'),(2,'Bob Martinez',1,1,130000.00,'2019-06-01','senior'),(3,'Carol White',1,1,125000.00,'2020-01-10','senior'),(4,'David Lee',1,2,90000.00,'2021-04-20','mid'),(5,'Emma Wilson',1,2,75000.00,'2022-08-01','junior'),(6,'Frank Brown',2,NULL,160000.00,'2017-11-05','lead'),(7,'Grace Kim',2,6,120000.00,'2019-09-15','senior'),(8,'Henry Davis',2,6,95000.00,'2021-02-28','mid'),(9,'Iris Zhang',3,NULL,155000.00,'2018-07-20','lead'),(10,'Jack Taylor',3,9,115000.00,'2020-05-12','senior'),(11,'Kate Anderson',3,9,110000.00,'2020-11-01','senior'),(12,'Liam Thomas',3,10,85000.00,'2022-01-15','mid'),(13,'Mia Jackson',3,10,70000.00,'2023-03-01','junior'),(14,'Noah Harris',4,NULL,140000.00,'2019-01-08','lead'),(15,'Olivia Martin',4,14,105000.00,'2021-06-14','senior'),(16,'Paul Garcia',5,NULL,170000.00,'2017-05-22','lead'),(17,'Quinn Robinson',5,16,135000.00,'2019-10-30','senior'),(18,'Rachel Clark',5,16,128000.00,'2020-08-17','senior'),(19,'Sam Lewis',1,3,72000.00,'2023-06-01','junior'),(20,'Tara Walker',2,7,88000.00,'2022-03-15','mid');",
    "answer_sql": "SELECT d.name AS department_name, e.name AS employee_name, e.hire_date FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.hire_date = (SELECT MIN(e2.hire_date) FROM employees e2 WHERE e2.department_id = e.department_id);",
    "ordered": false
  },
  {
    "id": "mv-001",
    "slug": "high-rated-movies-after-2010",
    "title": "High-Rated Movies After 2010",
    "category": "sql-advanced",
    "difficulty": "easy",
    "description": "## High-Rated Movies After 2010\n\n**Dataset:** Movies\n\nFind all `movies` released after `2010` with a `rating` above `8.0`. Return `title`, `release_year`, and `rating`.",
    "hint": "Use `WHERE` with two conditions combined with AND. Make sure to filter `release_year` > `2010` and `rating` > `8.0`.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "movies",
      "easy"
    ],
    "schema_sql": "CREATE TABLE movies (id INTEGER PRIMARY KEY, title TEXT, release_year INTEGER, genre TEXT, rating REAL, runtime_mins INTEGER); CREATE TABLE actors (id INTEGER PRIMARY KEY, name TEXT, birth_year INTEGER); CREATE TABLE cast_members (movie_id INTEGER, actor_id INTEGER, role TEXT); CREATE TABLE reviews (id INTEGER PRIMARY KEY, movie_id INTEGER, reviewer_name TEXT, score INTEGER, review_date TEXT);",
    "seed_sql": "INSERT INTO movies VALUES (1,'The Shawshank Redemption',1994,'Drama',9.3,142),(2,'The Godfather',1972,'Crime',9.2,175),(3,'The Dark Knight',2008,'Action',9.0,152),(4,'Inception',2010,'Sci-Fi',8.8,148),(5,'Interstellar',2014,'Sci-Fi',8.6,169),(6,'The Matrix',1999,'Sci-Fi',8.7,136),(7,'Parasite',2019,'Thriller',8.5,132),(8,'1917',2019,'War',8.3,119),(9,'Joker',2019,'Drama',8.4,122),(10,'Avengers: Endgame',2019,'Action',8.4,181),(11,'La La Land',2016,'Romance',8.0,128),(12,'Get Out',2017,'Horror',7.7,104),(13,'Dunkirk',2017,'War',7.9,106),(14,'Blade Runner 2049',2017,'Sci-Fi',8.0,164),(15,'Mad Max: Fury Road',2015,'Action',8.1,120),(16,'The Revenant',2015,'Adventure',8.0,156),(17,'Whiplash',2014,'Drama',8.5,106),(18,'Birdman',2014,'Comedy',7.7,119),(19,'Gone Girl',2014,'Thriller',8.1,149),(20,'Her',2013,'Sci-Fi',8.0,126); INSERT INTO actors VALUES (1,'Tom Hanks',1956),(2,'Meryl Streep',1949),(3,'Leonardo DiCaprio',1974),(4,'Cate Blanchett',1969),(5,'Joaquin Phoenix',1974),(6,'Scarlett Johansson',1984),(7,'Brad Pitt',1963),(8,'Natalie Portman',1981),(9,'Matthew McConaughey',1969),(10,'Jennifer Lawrence',1990),(11,'Christian Bale',1974),(12,'Morgan Freeman',1937),(13,'Anne Hathaway',1982),(14,'Jessica Chastain',1977),(15,'Michael Fassbender',1977); INSERT INTO cast_members VALUES (1,12,'Andy Dufresne'),(3,11,'Bruce Wayne'),(4,3,'Cobb'),(5,9,'Cooper'),(5,13,'Brand'),(6,3,'Neo'),(7,5,'Ki-woo'),(9,5,'Arthur Fleck'),(11,4,'Mia'),(15,7,'Max'),(17,6,'Mia'),(19,4,'Amy'),(20,3,'Tony Stark'); INSERT INTO reviews VALUES (1,1,'Alice',5,'2023-01-10'),(2,1,'Bob',5,'2023-01-15'),(3,1,'Carol',4,'2023-02-01'),(4,2,'Dave',5,'2023-02-10'),(5,3,'Alice',5,'2023-03-01'),(6,3,'Eve',5,'2023-03-15'),(7,4,'Frank',4,'2023-04-01'),(8,4,'Grace',5,'2023-04-10'),(9,4,'Hank',5,'2023-04-20'),(10,5,'Alice',5,'2023-05-01'),(11,5,'Ivan',4,'2023-05-10'),(12,6,'Jane',5,'2023-06-01'),(13,7,'Alice',5,'2023-06-15'),(14,7,'Ken',4,'2023-06-20'),(15,8,'Lara',4,'2023-07-01'),(16,9,'Mike',3,'2023-07-10'),(17,9,'Alice',4,'2023-07-20'),(18,10,'Nina',4,'2023-08-01'),(19,11,'Oscar',3,'2023-08-10'),(20,11,'Alice',4,'2023-08-20'),(21,12,'Pete',3,'2023-09-01'),(22,13,'Alice',3,'2023-09-10'),(23,14,'Quinn',4,'2023-09-20'),(24,15,'Rose',5,'2023-10-01'),(25,15,'Alice',5,'2023-10-10'),(26,16,'Sam',4,'2023-10-20'),(27,17,'Alice',5,'2023-11-01'),(28,17,'Tom',5,'2023-11-10'),(29,17,'Alice',5,'2023-11-20'),(30,18,'Una',3,'2023-12-01'),(31,19,'Alice',4,'2023-12-10'),(32,19,'Vic',4,'2023-12-20'),(33,20,'Walt',4,'2024-01-05'),(34,3,'Alice',5,'2024-01-10');",
    "answer_sql": "SELECT title, release_year, rating FROM movies WHERE release_year > 2010 AND rating > 8.0;",
    "ordered": false
  },
  {
    "id": "mv-002",
    "slug": "average-rating-per-genre",
    "title": "Average Rating per Genre",
    "category": "sql-advanced",
    "difficulty": "easy",
    "description": "## Average Rating per Genre\n\n**Dataset:** Movies\n\nCalculate the average `rating` for each `genre`. Return `genre` and `avg_rating` rounded to 2 decimal places.",
    "hint": "`GROUP BY` the `genre` column and use ROUND(AVG(`rating`), 2).",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "movies",
      "easy"
    ],
    "schema_sql": "CREATE TABLE movies (id INTEGER PRIMARY KEY, title TEXT, release_year INTEGER, genre TEXT, rating REAL, runtime_mins INTEGER); CREATE TABLE actors (id INTEGER PRIMARY KEY, name TEXT, birth_year INTEGER); CREATE TABLE cast_members (movie_id INTEGER, actor_id INTEGER, role TEXT); CREATE TABLE reviews (id INTEGER PRIMARY KEY, movie_id INTEGER, reviewer_name TEXT, score INTEGER, review_date TEXT);",
    "seed_sql": "INSERT INTO movies VALUES (1,'The Shawshank Redemption',1994,'Drama',9.3,142),(2,'The Godfather',1972,'Crime',9.2,175),(3,'The Dark Knight',2008,'Action',9.0,152),(4,'Inception',2010,'Sci-Fi',8.8,148),(5,'Interstellar',2014,'Sci-Fi',8.6,169),(6,'The Matrix',1999,'Sci-Fi',8.7,136),(7,'Parasite',2019,'Thriller',8.5,132),(8,'1917',2019,'War',8.3,119),(9,'Joker',2019,'Drama',8.4,122),(10,'Avengers: Endgame',2019,'Action',8.4,181),(11,'La La Land',2016,'Romance',8.0,128),(12,'Get Out',2017,'Horror',7.7,104),(13,'Dunkirk',2017,'War',7.9,106),(14,'Blade Runner 2049',2017,'Sci-Fi',8.0,164),(15,'Mad Max: Fury Road',2015,'Action',8.1,120),(16,'The Revenant',2015,'Adventure',8.0,156),(17,'Whiplash',2014,'Drama',8.5,106),(18,'Birdman',2014,'Comedy',7.7,119),(19,'Gone Girl',2014,'Thriller',8.1,149),(20,'Her',2013,'Sci-Fi',8.0,126); INSERT INTO actors VALUES (1,'Tom Hanks',1956); INSERT INTO cast_members VALUES (1,1,'Andy'); INSERT INTO reviews VALUES (1,1,'Alice',5,'2023-01-10');",
    "answer_sql": "SELECT genre, ROUND(AVG(rating), 2) AS avg_rating FROM movies GROUP BY genre;",
    "ordered": false
  },
  {
    "id": "mv-003",
    "slug": "top-5-highest-rated-movies",
    "title": "Top 5 Highest-Rated Movies",
    "category": "sql-advanced",
    "difficulty": "easy",
    "description": "## Top 5 Highest-Rated Movies\n\n**Dataset:** Movies\n\nFind the top 5 highest-rated `movies`. Return `title`, `genre`, and `rating`, ordered by `rating` from highest to lowest.",
    "hint": "Use `ORDER BY` `rating` DESC and `LIMIT` 5.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "movies",
      "easy"
    ],
    "schema_sql": "CREATE TABLE movies (id INTEGER PRIMARY KEY, title TEXT, release_year INTEGER, genre TEXT, rating REAL, runtime_mins INTEGER); CREATE TABLE actors (id INTEGER PRIMARY KEY, name TEXT, birth_year INTEGER); CREATE TABLE cast_members (movie_id INTEGER, actor_id INTEGER, role TEXT); CREATE TABLE reviews (id INTEGER PRIMARY KEY, movie_id INTEGER, reviewer_name TEXT, score INTEGER, review_date TEXT);",
    "seed_sql": "INSERT INTO movies VALUES (1,'The Shawshank Redemption',1994,'Drama',9.3,142),(2,'The Godfather',1972,'Crime',9.2,175),(3,'The Dark Knight',2008,'Action',9.0,152),(4,'Inception',2010,'Sci-Fi',8.8,148),(5,'Interstellar',2014,'Sci-Fi',8.6,169),(6,'The Matrix',1999,'Sci-Fi',8.7,136),(7,'Parasite',2019,'Thriller',8.5,132),(8,'1917',2019,'War',8.3,119),(9,'Joker',2019,'Drama',8.4,122),(10,'Avengers: Endgame',2019,'Action',8.4,181),(11,'La La Land',2016,'Romance',8.0,128),(12,'Get Out',2017,'Horror',7.7,104),(13,'Dunkirk',2017,'War',7.9,106),(14,'Blade Runner 2049',2017,'Sci-Fi',8.0,164),(15,'Mad Max: Fury Road',2015,'Action',8.1,120),(16,'The Revenant',2015,'Adventure',8.0,156),(17,'Whiplash',2014,'Drama',8.5,106),(18,'Birdman',2014,'Comedy',7.7,119),(19,'Gone Girl',2014,'Thriller',8.1,149),(20,'Her',2013,'Sci-Fi',8.0,126); INSERT INTO actors VALUES (1,'Tom Hanks',1956); INSERT INTO cast_members VALUES (1,1,'Andy'); INSERT INTO reviews VALUES (1,1,'Alice',5,'2023-01-10');",
    "answer_sql": "SELECT title, genre, rating FROM movies ORDER BY rating DESC LIMIT 5;",
    "ordered": true
  },
  {
    "id": "mv-004",
    "slug": "actors-in-more-than-3-movies",
    "title": "Actors in More Than 3 Movies",
    "category": "sql-advanced",
    "difficulty": "medium",
    "description": "## Actors in More Than 3 Movies\n\n**Dataset:** Movies\n\nFind `actors` who have appeared in more than 3 `movies`. Return actor `name` and `movie_count`.",
    "hint": "`JOIN` `actors` with cast_members, `GROUP BY` actor, and use HAVING COUNT(*) > 3.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "movies",
      "medium"
    ],
    "schema_sql": "CREATE TABLE movies (id INTEGER PRIMARY KEY, title TEXT, release_year INTEGER, genre TEXT, rating REAL, runtime_mins INTEGER); CREATE TABLE actors (id INTEGER PRIMARY KEY, name TEXT, birth_year INTEGER); CREATE TABLE cast_members (movie_id INTEGER, actor_id INTEGER, role TEXT); CREATE TABLE reviews (id INTEGER PRIMARY KEY, movie_id INTEGER, reviewer_name TEXT, score INTEGER, review_date TEXT);",
    "seed_sql": "INSERT INTO movies VALUES (1,'The Shawshank Redemption',1994,'Drama',9.3,142),(2,'The Godfather',1972,'Crime',9.2,175),(3,'The Dark Knight',2008,'Action',9.0,152),(4,'Inception',2010,'Sci-Fi',8.8,148),(5,'Interstellar',2014,'Sci-Fi',8.6,169),(6,'The Matrix',1999,'Sci-Fi',8.7,136),(7,'Parasite',2019,'Thriller',8.5,132),(8,'1917',2019,'War',8.3,119),(9,'Joker',2019,'Drama',8.4,122),(10,'Avengers: Endgame',2019,'Action',8.4,181); INSERT INTO actors VALUES (1,'Tom Hanks',1956),(2,'Meryl Streep',1949),(3,'Leonardo DiCaprio',1974),(4,'Cate Blanchett',1969),(5,'Joaquin Phoenix',1974); INSERT INTO cast_members VALUES (1,1,'Andy'),(2,1,'Michael'),(3,1,'Bruce'),(4,1,'Cobb'),(5,1,'Cooper'),(6,2,'The Oracle'),(7,2,'Ki-woo parent'),(8,2,'British Officer'),(9,5,'Arthur'),(10,5,'Thanos fighter'),(4,3,'Cobb Lead'),(5,3,'Cooper Lead'),(6,3,'Neo'),(9,3,'Fleck');",
    "answer_sql": "SELECT a.name, COUNT(*) AS movie_count FROM actors a JOIN cast_members cm ON a.id = cm.actor_id GROUP BY a.id, a.name HAVING COUNT(*) > 3;",
    "ordered": false
  },
  {
    "id": "mv-005",
    "slug": "genre-with-most-reviews",
    "title": "Genre with Most Reviews",
    "category": "sql-advanced",
    "difficulty": "medium",
    "description": "## Genre with Most Reviews\n\n**Dataset:** Movies\n\nFind which movie `genre` has received the most total `reviews`. Return `genre` and `review_count`, ordered from most to fewest.",
    "hint": "`JOIN` `reviews` → `movies`. `GROUP BY` `genre`, COUNT the `reviews`, and `ORDER BY` count DESC.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "movies",
      "medium"
    ],
    "schema_sql": "CREATE TABLE movies (id INTEGER PRIMARY KEY, title TEXT, release_year INTEGER, genre TEXT, rating REAL, runtime_mins INTEGER); CREATE TABLE actors (id INTEGER PRIMARY KEY, name TEXT, birth_year INTEGER); CREATE TABLE cast_members (movie_id INTEGER, actor_id INTEGER, role TEXT); CREATE TABLE reviews (id INTEGER PRIMARY KEY, movie_id INTEGER, reviewer_name TEXT, score INTEGER, review_date TEXT);",
    "seed_sql": "INSERT INTO movies VALUES (1,'The Shawshank Redemption',1994,'Drama',9.3,142),(2,'The Godfather',1972,'Crime',9.2,175),(3,'The Dark Knight',2008,'Action',9.0,152),(4,'Inception',2010,'Sci-Fi',8.8,148),(5,'Interstellar',2014,'Sci-Fi',8.6,169),(6,'The Matrix',1999,'Sci-Fi',8.7,136),(7,'Parasite',2019,'Thriller',8.5,132),(8,'1917',2019,'War',8.3,119),(9,'Joker',2019,'Drama',8.4,122),(10,'Avengers: Endgame',2019,'Action',8.4,181),(11,'La La Land',2016,'Romance',8.0,128),(12,'Get Out',2017,'Horror',7.7,104),(13,'Dunkirk',2017,'War',7.9,106),(14,'Blade Runner 2049',2017,'Sci-Fi',8.0,164),(15,'Mad Max: Fury Road',2015,'Action',8.1,120),(16,'The Revenant',2015,'Adventure',8.0,156),(17,'Whiplash',2014,'Drama',8.5,106),(18,'Birdman',2014,'Comedy',7.7,119),(19,'Gone Girl',2014,'Thriller',8.1,149),(20,'Her',2013,'Sci-Fi',8.0,126); INSERT INTO actors VALUES (1,'Tom Hanks',1956); INSERT INTO cast_members VALUES (1,1,'Andy'); INSERT INTO reviews VALUES (1,1,'Alice',5,'2023-01-10'),(2,1,'Bob',5,'2023-01-15'),(3,1,'Carol',4,'2023-02-01'),(4,2,'Dave',5,'2023-02-10'),(5,3,'Alice',5,'2023-03-01'),(6,3,'Eve',5,'2023-03-15'),(7,4,'Frank',4,'2023-04-01'),(8,4,'Grace',5,'2023-04-10'),(9,4,'Hank',5,'2023-04-20'),(10,5,'Alice',5,'2023-05-01'),(11,5,'Ivan',4,'2023-05-10'),(12,6,'Jane',5,'2023-06-01'),(13,7,'Alice',5,'2023-06-15'),(14,7,'Ken',4,'2023-06-20'),(15,8,'Lara',4,'2023-07-01'),(16,9,'Mike',3,'2023-07-10'),(17,9,'Alice',4,'2023-07-20'),(18,10,'Nina',4,'2023-08-01'),(19,11,'Oscar',3,'2023-08-10'),(20,11,'Alice',4,'2023-08-20'),(21,12,'Pete',3,'2023-09-01'),(22,13,'Alice',3,'2023-09-10'),(23,14,'Quinn',4,'2023-09-20'),(24,15,'Rose',5,'2023-10-01'),(25,15,'Alice',5,'2023-10-10'),(26,16,'Sam',4,'2023-10-20'),(27,17,'Alice',5,'2023-11-01'),(28,17,'Tom',5,'2023-11-10'),(29,17,'Alice',5,'2023-11-20'),(30,18,'Una',3,'2023-12-01'),(31,19,'Alice',4,'2023-12-10'),(32,19,'Vic',4,'2023-12-20'),(33,20,'Walt',4,'2024-01-05'),(34,3,'Alice',5,'2024-01-10');",
    "answer_sql": "SELECT m.genre, COUNT(r.id) AS review_count FROM movies m JOIN reviews r ON m.id = r.movie_id GROUP BY m.genre ORDER BY review_count DESC;",
    "ordered": true
  },
  {
    "id": "mv-006",
    "slug": "movies-with-no-reviews",
    "title": "Movies with No Reviews",
    "category": "sql-advanced",
    "difficulty": "medium",
    "description": "## Movies with No Reviews\n\n**Dataset:** Movies\n\nFind all `movies` that have not received any `reviews`. Return `title` and `release_year`.",
    "hint": "Use a `LEFT JOIN` between `movies` and `reviews`. When no review exists, the review columns will be NULL.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "movies",
      "medium"
    ],
    "schema_sql": "CREATE TABLE movies (id INTEGER PRIMARY KEY, title TEXT, release_year INTEGER, genre TEXT, rating REAL, runtime_mins INTEGER); CREATE TABLE actors (id INTEGER PRIMARY KEY, name TEXT, birth_year INTEGER); CREATE TABLE cast_members (movie_id INTEGER, actor_id INTEGER, role TEXT); CREATE TABLE reviews (id INTEGER PRIMARY KEY, movie_id INTEGER, reviewer_name TEXT, score INTEGER, review_date TEXT);",
    "seed_sql": "INSERT INTO movies VALUES (1,'The Shawshank Redemption',1994,'Drama',9.3,142),(2,'The Godfather',1972,'Crime',9.2,175),(3,'The Dark Knight',2008,'Action',9.0,152),(4,'Inception',2010,'Sci-Fi',8.8,148),(5,'Interstellar',2014,'Sci-Fi',8.6,169); INSERT INTO actors VALUES (1,'Tom Hanks',1956); INSERT INTO cast_members VALUES (1,1,'Andy'); INSERT INTO reviews VALUES (1,1,'Alice',5,'2023-01-10'),(2,2,'Bob',5,'2023-01-15'),(3,3,'Carol',4,'2023-02-01');",
    "answer_sql": "SELECT m.title, m.release_year FROM movies m LEFT JOIN reviews r ON m.id = r.movie_id WHERE r.id IS NULL;",
    "ordered": false
  },
  {
    "id": "mv-007",
    "slug": "top-5-star-reviewer",
    "title": "Top 5-Star Reviewer",
    "category": "sql-advanced",
    "difficulty": "medium",
    "description": "## Top 5-Star Reviewer\n\n**Dataset:** Movies\n\nFind the reviewer who has given the most `5-star` `reviews`. Return `reviewer_name` and `five_star_count`.",
    "hint": "Filter `reviews` `WHERE` score = 5, then `GROUP BY` `reviewer_name` and count. Order by the count descending and take `LIMIT 1`.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "movies",
      "medium"
    ],
    "schema_sql": "CREATE TABLE movies (id INTEGER PRIMARY KEY, title TEXT, release_year INTEGER, genre TEXT, rating REAL, runtime_mins INTEGER); CREATE TABLE actors (id INTEGER PRIMARY KEY, name TEXT, birth_year INTEGER); CREATE TABLE cast_members (movie_id INTEGER, actor_id INTEGER, role TEXT); CREATE TABLE reviews (id INTEGER PRIMARY KEY, movie_id INTEGER, reviewer_name TEXT, score INTEGER, review_date TEXT);",
    "seed_sql": "INSERT INTO movies VALUES (1,'The Shawshank Redemption',1994,'Drama',9.3,142),(2,'The Godfather',1972,'Crime',9.2,175),(3,'The Dark Knight',2008,'Action',9.0,152),(4,'Inception',2010,'Sci-Fi',8.8,148),(5,'Interstellar',2014,'Sci-Fi',8.6,169); INSERT INTO actors VALUES (1,'Tom Hanks',1956); INSERT INTO cast_members VALUES (1,1,'Andy'); INSERT INTO reviews VALUES (1,1,'Alice',5,'2023-01-10'),(2,1,'Bob',5,'2023-01-15'),(3,2,'Alice',5,'2023-02-01'),(4,3,'Alice',5,'2023-03-01'),(5,3,'Bob',4,'2023-03-15'),(6,4,'Alice',5,'2023-04-01'),(7,4,'Carol',5,'2023-04-10'),(8,5,'Alice',3,'2023-05-01'),(9,5,'Bob',5,'2023-05-10'),(10,2,'Carol',4,'2023-06-01');",
    "answer_sql": "SELECT reviewer_name, COUNT(*) AS five_star_count FROM reviews WHERE score = 5 GROUP BY reviewer_name ORDER BY five_star_count DESC LIMIT 1;",
    "ordered": true
  },
  {
    "id": "mv-008",
    "slug": "prolific-reviewers-average-score",
    "title": "Prolific Reviewers' Average Score",
    "category": "sql-advanced",
    "difficulty": "hard",
    "description": "## Prolific Reviewers' Average Score\n\n**Dataset:** Movies\n\nFind the average score given by each reviewer who has submitted 5 or more `reviews`. Return `reviewer_name` and `avg_score` rounded to 2 decimal places.",
    "hint": "`GROUP BY` `reviewer_name`, use HAVING COUNT(*) >= 5 to filter, and ROUND(AVG(score), 2) for the score.",
    "starterCode": {
      "sql": "-- Write your SQL query below\nSELECT * FROM ...;"
    },
    "tests": [],
    "tags": [
      "sql",
      "movies",
      "hard"
    ],
    "schema_sql": "CREATE TABLE movies (id INTEGER PRIMARY KEY, title TEXT, release_year INTEGER, genre TEXT, rating REAL, runtime_mins INTEGER); CREATE TABLE actors (id INTEGER PRIMARY KEY, name TEXT, birth_year INTEGER); CREATE TABLE cast_members (movie_id INTEGER, actor_id INTEGER, role TEXT); CREATE TABLE reviews (id INTEGER PRIMARY KEY, movie_id INTEGER, reviewer_name TEXT, score INTEGER, review_date TEXT);",
    "seed_sql": "INSERT INTO movies VALUES (1,'The Shawshank Redemption',1994,'Drama',9.3,142),(2,'The Godfather',1972,'Crime',9.2,175),(3,'The Dark Knight',2008,'Action',9.0,152),(4,'Inception',2010,'Sci-Fi',8.8,148),(5,'Interstellar',2014,'Sci-Fi',8.6,169),(6,'The Matrix',1999,'Sci-Fi',8.7,136),(7,'Parasite',2019,'Thriller',8.5,132),(8,'1917',2019,'War',8.3,119),(9,'Joker',2019,'Drama',8.4,122),(10,'Avengers: Endgame',2019,'Action',8.4,181); INSERT INTO actors VALUES (1,'Tom Hanks',1956); INSERT INTO cast_members VALUES (1,1,'Andy'); INSERT INTO reviews VALUES (1,1,'Alice',5,'2023-01-10'),(2,2,'Alice',5,'2023-01-15'),(3,3,'Alice',4,'2023-02-01'),(4,4,'Alice',5,'2023-02-10'),(5,5,'Alice',4,'2023-03-01'),(6,6,'Alice',5,'2023-03-15'),(7,1,'Bob',5,'2023-04-01'),(8,2,'Bob',3,'2023-04-10'),(9,3,'Bob',4,'2023-04-20'),(10,4,'Bob',5,'2023-05-01'),(11,5,'Bob',4,'2023-05-10'),(12,6,'Bob',3,'2023-06-01'),(13,1,'Carol',4,'2023-06-15'),(14,2,'Carol',3,'2023-06-20'),(15,3,'Carol',5,'2023-07-01'),(16,4,'Carol',4,'2023-07-10'),(17,5,'Carol',3,'2023-07-20'),(18,1,'Dave',5,'2023-08-01'),(19,2,'Dave',4,'2023-08-10'),(20,3,'Dave',3,'2023-08-20');",
    "answer_sql": "SELECT reviewer_name, ROUND(AVG(score), 2) AS avg_score FROM reviews GROUP BY reviewer_name HAVING COUNT(*) >= 5;",
    "ordered": false
  }
];
