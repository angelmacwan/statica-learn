/* Updates ML lessons so hands-on examples run in the browser's standard Python runtime. */
const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'src/content/lessons/ml');
const runnable = {
  'intro-to-machine-learning': `# Each pair is one example: study hours and its known score.
examples = [(1, 52), (2, 58), (3, 65)]

features = [hours for hours, score in examples]
labels = [score for hours, score in examples]
print("Features (clues):", features)
print("Labels (answers):", labels)`,
  'types-of-machine-learning': `# Supervised learning starts with examples that include answers.
emails = [("Win a prize now", "spam"), ("See you at practice", "not spam")]

for message, label in emails:
    print(f"{label:8} | {message}")

print("\\nThe message is a feature. The label is the known answer.")`,
  'applications-of-ml': `# A tiny rule-based recommender. Real ML learns these choices from data.
videos = [
    {"title": "Easy pasta", "topic": "cooking"},
    {"title": "Basketball drills", "topic": "sport"},
    {"title": "Quick cookies", "topic": "cooking"},
]
interest = "cooking"
recommendations = [video["title"] for video in videos if video["topic"] == interest]
print("Recommended for you:", recommendations)`,
  'machine-learning-process': `# Keep test examples separate so they can check a finished model fairly.
examples = ["email 1", "email 2", "email 3", "email 4", "email 5"]
cutoff = 3
training_examples = examples[:cutoff]
test_examples = examples[cutoff:]

print("Training examples:", training_examples)
print("Test examples:    ", test_examples)`,
  'data-collection-and-cleaning': `from statistics import median

prices = [250, 270, 280, 300, 310, 320, 330, 340, 350, 950]
ordered = sorted(prices)
middle = median(ordered)
lower_half, upper_half = ordered[:5], ordered[5:]
q1, q3 = median(lower_half), median(upper_half)
iqr = q3 - q1
upper_bound = q3 + 1.5 * iqr
outliers = [price for price in prices if price > upper_bound]

print("Typical middle price:", middle)
print("Upper outlier boundary:", upper_bound)
print("Check these values:", outliers)`,
  'data-transformation': `from math import log1p

visits = [0, 1, 10, 100, 1000]
print("Original:", visits)
print("Log-scaled:", [round(log1p(value), 2) for value in visits])

colors = ["red", "blue", "green", "red"]
for color in colors:
    encoded = {name: int(color == name) for name in ["red", "blue", "green"]}
    print(color, "->", encoded)`,
  'feature-engineering': `from datetime import date

sales = [
    {"date": "2026-09-20", "sales": 120},
    {"date": "2026-09-21", "sales": 150},
    {"date": "2026-09-26", "sales": 450},
]

for record in sales:
    year, month, day = map(int, record["date"].split("-"))
    weekday = date(year, month, day).strftime("%A")
    is_weekend = weekday in ("Saturday", "Sunday")
    print(record["date"], "|", weekday, "| weekend:", is_weekend)`,
  'handling-missing-data': `from statistics import median

ages = [22, 25, None, 29, 100]
known_ages = [age for age in ages if age is not None]
typical_age = median(known_ages)
filled_ages = [typical_age if age is None else age for age in ages]

print("Original values:", ages)
print("Median used for the blank:", typical_age)
print("Filled values:", filled_ages)`,
  'scaling-and-normalization': `scores = [10, 20, 30, 40]
lowest, highest = min(scores), max(scores)

scaled = [(score - lowest) / (highest - lowest) for score in scores]
print("Original scores:", scores)
print("0-to-1 scaled:", [round(value, 2) for value in scaled])
print("The order stays the same; only the measuring scale changes.")`,
  'support-vector-machines': `# A simple boundary: values below 5 are group A; 5 or more are group B.
boundary = 5
points = [2, 4, 4.8, 5.2, 7]

for point in points:
    group = "A" if point < boundary else "B"
    distance_from_boundary = abs(point - boundary)
    print(f"point={point:>3} -> group {group}; distance from boundary={distance_from_boundary}")

print("The closest points to the boundary are the most important ones for an SVM.")`,
  'anomaly-detection': `from statistics import median

amounts = [10, 12, 11, 10.5, 500, 11.5, 600]
middle = median(amounts)
deviations = [abs(amount - middle) for amount in amounts]
typical_deviation = median(deviations)
threshold = 3 * typical_deviation

for amount in amounts:
    unusual = abs(amount - middle) > threshold
    label = "check this" if unusual else "usual range"
    print(f"{amount:>5}: {label}")`
};

const readOnly = new Set([
  'linear-regression',
  'logistic-regression',
  'decision-trees-and-random-forests',
  'ensemble-learning-and-boosting',
  'clustering-kmeans-dbscan',
  'principal-component-analysis-pca'
]);

for (const filename of fs.readdirSync(root).filter((file) => file.endsWith('.json'))) {
  const fullPath = path.join(root, filename);
  const lesson = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  const existingCode = lesson.blocks.find((block) => block.type === 'code');

  if (readOnly.has(lesson.slug)) {
    if (!existingCode) throw new Error(`Expected a model example in ${lesson.slug}`);
    existingCode.readOnly = true;
    existingCode.readOnlyNote = 'This is a model-training example for reading and discussion. It is intentionally not run in the lesson.';
  } else if (runnable[lesson.slug]) {
    const block = {
      type: 'code',
      language: 'python',
      starterCode: runnable[lesson.slug],
      solutionCode: runnable[lesson.slug]
    };
    if (existingCode) Object.assign(existingCode, block);
    else lesson.blocks.push(block);
  }

  if (lesson.slug === 'data-transformation') {
    lesson.blocks[0].content = lesson.blocks[0].content.replace(/```python[\s\S]*?```/, 'The runnable example below performs the same one-hot encoding with standard Python, so you can see each step.');
  }
  fs.writeFileSync(fullPath, `${JSON.stringify(lesson, null, 2)}\n`);
}
