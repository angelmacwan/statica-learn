# Foundations of Machine Learning

### A Teaching Reference Guide

> This guide is written for beginners. No prior machine learning experience is assumed. Wherever a chart, graph, or diagram would help, you will see a placeholder like this:
>
> 📊 **[CHART: description of what to generate]**
> 🧩 **[MERMAID: description of the diagram]**
>
> Generate these separately (in Python or with Mermaid) and drop the images in where the placeholders are.

---

## Table of Contents

1. [Introduction to Machine Learning](#1-introduction-to-machine-learning)
2. [Types of Machine Learning](#2-types-of-machine-learning)
3. [Applications of ML](#3-applications-of-ml)
4. [Machine Learning Process](#4-machine-learning-process)
5. [Data Collection and Cleaning](#5-data-collection-and-cleaning)
6. [Data Transformation](#6-data-transformation)
7. [Feature Engineering](#7-feature-engineering)
8. [Handling Missing Data](#8-handling-missing-data)
9. [Scaling and Normalization](#9-scaling-and-normalization)
10. [Linear Regression](#10-linear-regression)
11. [Logistic Regression](#11-logistic-regression)
12. [Decision Trees](#12-decision-trees)
13. [Support Vector Machines](#13-support-vector-machines)
14. [Ensemble Learning](#14-ensemble-learning)
15. [Clustering](#15-clustering)
16. [Principal Component Analysis (PCA)](#16-principal-component-analysis-pca)
17. [Anomaly Detection](#17-anomaly-detection)

---

## 1. Introduction to Machine Learning

### Definition and Concepts

Machine Learning (ML) is a way of teaching computers to find patterns in data and make decisions or predictions, without a human writing an exact rule for every situation.

Think about how you learned to recognize a dog. Nobody gave you a checklist like "four legs AND fur AND a tail AND barks = dog." Instead, you saw hundreds of dogs (different sizes, colors, breeds) and your brain slowly figured out the pattern. Machine learning works the same way: you show a computer lots of examples, and it learns the pattern on its own.

Formally: **Machine Learning is a field of computer science where algorithms improve their performance on a task by learning from data, rather than being explicitly programmed with fixed rules.**

Key terms you will keep seeing:

- **Model**: the "thing" that has learned the pattern and can now make predictions.
- **Training**: the process of showing data to the model so it can learn.
- **Data point / sample**: one example in your dataset (e.g., one house, one email, one photo).
- **Feature**: a measurable property of a data point (e.g., a house's size, an email's word count).
- **Label / target**: the answer you want the model to predict (e.g., house price, spam or not spam).

### Machine Learning vs Traditional Programming

In **traditional programming**, a human writes explicit rules (code), and the computer applies those rules to input data to produce output.

```
Traditional Programming:
   Rules + Data  --->  Program  --->  Output
```

In **machine learning**, you flip this around. You give the computer the data AND the correct answers (output), and it figures out the rules (the model) by itself.

```
Machine Learning:
   Data + Output  --->  Program  --->  Rules (Model)
```

**Example:** Suppose you want to detect spam emails.

- _Traditional approach:_ A programmer writes rules like "if the email contains the word 'lottery' or 'free money', mark it as spam." This breaks quickly, spammers just avoid those exact words.
- _ML approach:_ You feed the computer thousands of emails already labeled "spam" or "not spam." The model learns patterns on its own (unusual sender addresses, certain word combinations, excessive punctuation, etc.) and can catch spam it has never seen before.

🧩 **[MERMAID: Simple two-panel flowchart comparing "Traditional Programming" (Rules + Data → Program → Output) vs "Machine Learning" (Data + Output → Program → Rules)]**

### Importance and Applications

Machine learning matters because a lot of real-world problems are too complex, or change too often, for a human to hand-write rules for. A few reasons ML has become so important:

- **Scale**: ML can process millions of data points far faster than any human.
- **Adaptability**: Models can be retrained as new data comes in (e.g., new types of spam, new shopping trends).
- **Pattern discovery**: ML can find patterns that are too subtle or complex for humans to notice, such as tiny signs of fraud in a transaction.
- **Personalization**: Every user gets a tailored experience, like a unique Netflix homepage or Spotify playlist.

We will look at concrete applications in Section 3, but the short version: ML powers the recommendations you see on YouTube and Instagram, the voice assistant on your phone, the filters on your camera app, video game opponents, and much more.

---

## 2. Types of Machine Learning

There are a few major "flavors" of machine learning, and choosing the right one depends on what kind of data you have and what problem you're solving.

### Supervised, Unsupervised, and Semi-Supervised Learning

**Supervised Learning**: You train the model using data that already has the correct answers attached (called _labels_). It's like studying with a textbook that has an answer key. The model learns to map inputs to the correct outputs.

- _Example:_ Showing a model 10,000 photos labeled "cat" or "dog" so it can learn to label new photos correctly.
- Two main types of tasks:
    - **Classification**: predicting a category (spam/not spam, cat/dog, pass/fail).
    - **Regression**: predicting a number (house price, temperature, exam score).

**Unsupervised Learning**: You give the model data with NO labels, and it tries to find structure or patterns on its own.

- _Example:_ Giving a model data about thousands of shoppers (age, spending habits, products bought) with no predefined groups, and letting it discover natural customer segments (e.g., "budget shoppers," "luxury buyers").
- Common tasks: clustering (grouping similar things) and dimensionality reduction (simplifying data while keeping the important parts).

**Semi-Supervised Learning**: A mix of both. You have a small amount of labeled data and a large amount of unlabeled data. This is common in real life because labeling data is expensive and time-consuming (someone has to sit and label every photo by hand!), while unlabeled data is everywhere.

- _Example:_ You have 500 medical scans labeled by a doctor as "healthy" or "diseased," and 50,000 unlabeled scans. The model uses the small labeled set to guide how it learns from the much larger unlabeled set.

📊 **[CHART: A simple diagram with three boxes side by side labeled "Supervised (fully labeled data)", "Semi-Supervised (some labeled, mostly unlabeled)", and "Unsupervised (no labels)", each with a small icon representing data points, some colored (labeled) and some gray (unlabeled)]**

### Reinforcement Learning

Reinforcement Learning (RL) is different from the other three. Instead of learning from a fixed dataset, an **agent** learns by interacting with an **environment**, taking **actions**, and receiving **rewards** or **penalties**.

Think of training a dog: when it sits on command, you give it a treat (reward). When it misbehaves, you say "no" (penalty). Over time, the dog learns which actions lead to treats. RL agents learn the same way, just with numbers instead of treats.

Key components:

- **Agent**: the learner/decision maker (e.g., a video game character).
- **Environment**: the world the agent operates in (e.g., the game itself).
- **Action**: a choice the agent makes (e.g., move left, jump).
- **Reward**: feedback from the environment (e.g., +10 points for collecting a coin, -100 for falling in a pit).
- **Policy**: the strategy the agent develops for choosing actions.

_Example:_ This is how AI learned to play games like Chess, Go, and Dota 2 at a superhuman level, and how self-driving cars learn to make driving decisions in simulation before ever touching a real road.

🧩 **[MERMAID: A loop diagram showing Agent → Action → Environment → Reward/State → back to Agent, forming a continuous cycle]**

---

## 3. Applications of ML

This section is a tour of where ML shows up in everyday life. Understanding real applications makes the underlying math and code feel a lot less abstract.

### Image and Speech Recognition

**Image recognition** is teaching a model to identify what's inside an image: objects, faces, text, scenes.

- Unlocking your phone with Face ID.
- Instagram/Snapchat filters that detect your face to place dog ears or glasses on it.
- Google Photos automatically grouping pictures of the same person.

**Speech recognition** converts spoken audio into text (and often, understanding it too).

- Siri, Google Assistant, and Alexa turning your voice into commands.
- Auto-generated captions on YouTube videos.
- Voice typing on your phone's keyboard.

### Natural Language Processing

Natural Language Processing (NLP) is the branch of ML focused on understanding and generating human language (text or speech).

- Auto-complete and spell-check on your phone.
- Google Translate.
- Chatbots and virtual assistants (including the kind of AI you might be chatting with right now).
- Sentiment analysis: automatically figuring out whether a tweet or review is positive or negative.

### Recommender Systems

Recommender systems predict what a user will like based on their past behavior and the behavior of similar users.

- Netflix suggesting shows based on what you've watched.
- YouTube's "Up Next" video queue.
- Spotify's "Discover Weekly" playlist.
- Amazon's "Customers who bought this also bought…" section.

There are two broad strategies:

- **Content-based filtering**: recommend items similar to what you already liked (e.g., you liked one sci-fi movie, so you get more sci-fi movies).
- **Collaborative filtering**: recommend items liked by people similar to you (e.g., "users like you also enjoyed…").

### Fraud Detection

Banks and payment companies use ML to spot suspicious transactions in real time.

- If your card is suddenly used in a different country five minutes after being used at your local store, an ML model flags it as likely fraud.
- Models learn normal spending patterns for each user and raise an alert when something deviates sharply.

This is a classic example of **anomaly detection**, which we'll cover in depth in Section 17.

### Autonomous Vehicles

Self-driving cars combine several ML techniques at once:

- **Image recognition** to detect pedestrians, other cars, traffic lights, and lane markings.
- **Reinforcement learning** to make driving decisions (when to brake, turn, or accelerate).
- **Sensor fusion**, combining cameras, radar, and lidar data to build a full picture of the car's surroundings.

📊 **[CHART: A simple icon grid (2 columns x 3 rows) with icons/labels for each application area: Image/Speech Recognition, NLP, Recommender Systems, Fraud Detection, Autonomous Vehicles, and a "+ more" box]**

---

## 4. Machine Learning Process

Building a machine learning model isn't just "write code, get answer." It's a structured pipeline. Understanding this pipeline is more important than memorizing any single algorithm, because every ML project follows roughly the same journey.

### Step-by-step overview

1. **Data Collection and Cleaning** – Gather raw data and fix obvious problems (duplicates, corrupted entries).
2. **Data Preprocessing** – Prepare the cleaned data so a model can actually use it (handling missing values, encoding categories, scaling numbers).
3. **Feature Selection and Engineering** – Decide which pieces of information (features) actually help the model, and create new ones if useful.
4. **Model Selection and Training** – Choose an algorithm (like linear regression or a decision tree) and let it learn from the data.
5. **Evaluation and Fine-Tuning** – Test how well the model performs, and adjust it to improve accuracy.

🧩 **[MERMAID: A left-to-right flowchart with 5 boxes: "1. Data Collection & Cleaning" → "2. Data Preprocessing" → "3. Feature Engineering" → "4. Model Selection & Training" → "5. Evaluation & Fine-Tuning", with a curved arrow looping back from step 5 to step 3, labeled "iterate"]**

Notice the loop back arrow: machine learning is rarely a straight line. You almost always go back and improve earlier steps based on what you learn later. If your model performs badly, the fix is often not "try a fancier algorithm," it's "go back and improve your data or features."

**A simple analogy:** Think of this like preparing for a big exam.

1. _Data Collection_: gathering your class notes, textbooks, and past papers.
2. _Preprocessing_: organizing your notes, throwing out irrelevant pages, fixing messy handwriting.
3. _Feature Engineering_: figuring out which topics are actually likely to be tested.
4. _Model Training_: studying, practicing problems, building your understanding.
5. _Evaluation_: taking a mock test, seeing your score, and revising the topics you got wrong.

We will explore each of these steps in detail in the following sections.

---

## 5. Data Collection and Cleaning

Every ML model is only as good as the data it learns from. There's a well-known saying: **"Garbage in, garbage out."** If your data is bad, no algorithm, however advanced, can save you.

### Data Sources and Formats

Data can come from many places:

- **Databases** (SQL tables from a company's systems).
- **APIs** (e.g., pulling live weather data or tweets).
- **Files** like CSV, JSON, Excel spreadsheets.
- **Web scraping** (extracting data from websites).
- **Sensors/IoT devices** (temperature sensors, fitness trackers).
- **Public datasets** (Kaggle, government open-data portals, UCI Machine Learning Repository).

Common formats you'll work with as a beginner: **CSV** (comma-separated values, like a simple spreadsheet), **JSON** (nested key-value data, common from APIs), and **images/audio** files for computer vision or speech tasks.

```python
import pandas as pd

# Reading a CSV file
df = pd.read_csv("students.csv")

# Reading a JSON file
df_json = pd.read_json("survey_results.json")

print(df.head())  # preview the first 5 rows
```

### Data Quality Assessment

Before doing anything else, you need to understand what you're working with. Ask questions like:

- How many rows and columns are there?
- Are there duplicate rows?
- Are there missing values?
- Do the data types make sense (is "age" stored as text instead of a number)?
- Are there impossible values (like a negative age, or a test score of 150 out of 100)?

```python
print(df.shape)          # (rows, columns)
print(df.info())         # data types and non-null counts
print(df.describe())     # statistical summary of numeric columns
print(df.duplicated().sum())  # count of duplicate rows
```

### Handling Missing Data

Real-world data almost always has gaps, someone skipped a survey question, a sensor briefly failed, a form field was optional. We will cover this in full detail in Section 8, but at the collection stage, the first job is simply to **detect** missing data.

```python
print(df.isnull().sum())  # count of missing values per column
```

### Outlier Detection and Removal

An **outlier** is a data point that is very different from the rest, it doesn't fit the general pattern.

_Example:_ In a dataset of house prices in a middle-class neighborhood, a single $50 million mansion would be an outlier. It might be a data entry error, or it might be genuinely real but so unusual that it distorts the model's understanding of "typical" prices.

Common ways to detect outliers:

- **Visual inspection**: box plots and scatter plots make outliers easy to spot by eye.
- **Z-score method**: flag any value more than 3 standard deviations from the mean.
- **IQR (Interquartile Range) method**: flag values that fall far outside the middle 50% of the data.

```python
import numpy as np

# IQR method
Q1 = df["price"].quantile(0.25)
Q3 = df["price"].quantile(0.75)
IQR = Q3 - Q1

lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

outliers = df[(df["price"] < lower_bound) | (df["price"] > upper_bound)]
print(f"Found {len(outliers)} outliers")

# Removing them
df_clean = df[(df["price"] >= lower_bound) & (df["price"] <= upper_bound)]
```

📊 **[CHART: A box plot of a numeric column (e.g., "price") showing the box, whiskers, and individual outlier points marked beyond the whiskers]**

Note: outliers shouldn't always be deleted blindly. Sometimes they represent genuinely important, rare events (like fraud!). Always ask _why_ a value is unusual before removing it.

---

## 6. Data Transformation

Once data is clean, it often still isn't in a shape a model can learn from well. Data transformation reshapes values so that algorithms can interpret them properly.

### Normalization and Standardization

These two terms are often confused, but they mean different things:

- **Normalization** (Min-Max Scaling) squeezes values into a fixed range, usually 0 to 1.
- **Standardization** (Z-score scaling) rescales values so they have a mean of 0 and a standard deviation of 1.

_Why does this matter?_ Imagine a dataset with "age" (values like 18-70) and "income" (values like 20,000-200,000). Many algorithms calculate distances between data points (like comparing how "close" two people are). Without scaling, income would completely dominate the distance calculation just because its numbers are bigger, even if age is equally important.

We cover the exact formulas and code in Section 9.

### Scaling Techniques

Beyond simple normalization/standardization, there are a few other scaling approaches:

- **Min-Max Scaling**: rescales to a fixed range (commonly [0, 1]).
- **Standard Scaling (Z-score)**: centers data around 0 with unit variance.
- **Robust Scaling**: uses the median and IQR instead of mean/standard deviation, making it resistant to outliers.
- **MaxAbs Scaling**: divides by the maximum absolute value, useful for data that's already centered at zero (e.g., sparse data).

(Full comparison with code in Section 9.)

### Log Transformation

Some data is heavily **skewed**, most values are small, but a few are enormously large (income, house prices, website traffic are classic examples). A log transformation compresses large values and spreads out small ones, making skewed data behave more like a normal (bell-curve) distribution, which many algorithms perform better with.

```python
import numpy as np

df["log_income"] = np.log1p(df["income"])  # log1p = log(1 + x), handles zero values safely
```

📊 **[CHART: Two histograms side by side, "Before Log Transform" showing a heavily right-skewed distribution (long tail to the right), and "After Log Transform" showing a roughly bell-shaped, symmetric distribution]**

### Binning and One-Hot Encoding

**Binning** (also called discretization) converts a continuous number into categories/buckets.

_Example:_ Converting "age" into bins like "0-12 (Child)", "13-19 (Teen)", "20-59 (Adult)", "60+ (Senior)".

```python
df["age_group"] = pd.cut(
    df["age"],
    bins=[0, 12, 19, 59, 120],
    labels=["Child", "Teen", "Adult", "Senior"]
)
```

**One-Hot Encoding** converts categorical (text) data into numeric columns a model can use, since most ML algorithms only understand numbers, not words like "Red," "Green," "Blue."

For a "color" column with values Red, Green, Blue, one-hot encoding creates three new columns:

| color | color_Red | color_Green | color_Blue |
| ----- | --------- | ----------- | ---------- |
| Red   | 1         | 0           | 0          |
| Blue  | 0         | 0           | 1          |
| Green | 0         | 1           | 0          |

```python
df_encoded = pd.get_dummies(df, columns=["color"])
```

---

## 7. Feature Engineering

Feature engineering is often described as the single highest-leverage skill in machine learning. It's the art and science of deciding what information to feed the model, and in what form.

### Feature Extraction

Feature extraction means creating NEW, more useful features from raw data.

_Examples:_

- From a "date_of_birth" column, extract "age" and "birth_month."
- From a "full_address" text field, extract "city" and "zip_code" as separate columns.
- From a timestamp, extract "hour_of_day" or "is_weekend" (which might matter a lot for predicting things like traffic or sales).
- From an image, extract features like edges, colors, or shapes (in deep learning, this often happens automatically).

```python
df["purchase_date"] = pd.to_datetime(df["purchase_date"])
df["day_of_week"] = df["purchase_date"].dt.day_name()
df["is_weekend"] = df["purchase_date"].dt.dayofweek >= 5
```

### Feature Selection

Not every feature actually helps a model, some are irrelevant, redundant, or even harmful (adding noise). Feature selection is the process of choosing the most useful subset of features.

Common approaches:

- **Filter methods**: rank features by a statistical score (e.g., correlation with the target) and keep the top ones.
- **Wrapper methods**: try different subsets of features by actually training models and comparing performance (e.g., Recursive Feature Elimination).
- **Embedded methods**: feature importance is calculated as part of training the model itself (e.g., decision trees naturally rank feature importance).

```python
# Correlation-based filter method
correlations = df.corr(numeric_only=True)["target"].abs().sort_values(ascending=False)
print(correlations)
```

### Dimensionality Reduction

When you have a huge number of features (sometimes thousands), it can slow down training, cause overfitting, and make the data hard to visualize. Dimensionality reduction techniques compress many features into fewer, while trying to preserve the important information.

The most common technique, **Principal Component Analysis (PCA)**, gets its own dedicated section (Section 16) because it's such a foundational tool.

### Handling Categorical Data

Categorical data represents groups or labels rather than numbers, like "country," "gender," "product category." There are two broad types:

- **Nominal**: no natural order (e.g., colors, countries).
- **Ordinal**: has a natural order (e.g., "Low," "Medium," "High").

For nominal data, one-hot encoding (Section 6) is typically used. For ordinal data, **label encoding** (mapping categories to ordered numbers) preserves the ranking:

```python
size_mapping = {"Small": 1, "Medium": 2, "Large": 3}
df["size_encoded"] = df["size"].map(size_mapping)
```

---

## 8. Handling Missing Data

Missing data is one of the most common real-world data problems, and handling it well (rather than ignoring it) can make a big difference in model quality.

### Imputation Techniques

**Imputation** means filling in missing values with a reasonable substitute rather than deleting the data.

Common strategies:

- **Mean/Median imputation**: fill numeric gaps with the column's average (mean) or middle value (median). Median is safer when the column has outliers.
- **Mode imputation**: fill categorical gaps with the most frequent category.
- **Forward/backward fill**: for time-series data, carry the last known value forward (or the next known value backward).
- **Model-based imputation**: use another ML model (like k-Nearest Neighbors) to predict what the missing value probably was, based on other columns.

```python
from sklearn.impute import SimpleImputer

# Numeric column: fill with median
num_imputer = SimpleImputer(strategy="median")
df["age"] = num_imputer.fit_transform(df[["age"]])

# Categorical column: fill with most frequent value
cat_imputer = SimpleImputer(strategy="most_frequent")
df["city"] = cat_imputer.fit_transform(df[["city"]]).ravel()
```

### Dealing with NaN Values

In Python, missing values usually appear as `NaN` (Not a Number). Before imputing, it helps to understand HOW MUCH is missing and WHY.

```python
missing_percent = df.isnull().mean() * 100
print(missing_percent.sort_values(ascending=False))
```

A useful rule of thumb:

- If a column is missing a small amount of data (say, under 5%), imputation is usually safe.
- If a column is missing a huge amount (say, over 60%), it may be better to drop the column entirely, since there's not much real signal left to recover.

Also worth checking: is the data **missing completely at random**, or is there a pattern (e.g., high-income respondents skip the "income" question more often)? Patterns like this can bias your model if not handled carefully.

📊 **[CHART: A horizontal bar chart showing percentage of missing values per column, sorted from highest to lowest]**

### Removing Irrelevant Features

Sometimes the right move isn't to fix a column, it's to remove it entirely. Consider dropping a feature if:

- It has too much missing data to reliably impute.
- It has zero or near-zero variance (e.g., a column where every value is the same).
- It's a duplicate or near-duplicate of another feature (e.g., "height_cm" and "height_inches" carry the same information).
- It's an identifier with no predictive meaning (e.g., "customer_ID" or "row_number").

```python
df = df.drop(columns=["customer_id", "row_number"])
```

---

## 9. Scaling and Normalization

Many ML algorithms (especially those based on distance, like k-Nearest Neighbors, SVMs, or anything using gradient descent, like linear/logistic regression and neural networks) are sensitive to the scale of the input features. This section covers the main scaling methods in detail.

### Min-Max Scaling

Rescales every value into a fixed range, typically [0, 1], using the formula:

```
x_scaled = (x - min(x)) / (max(x) - min(x))
```

```python
from sklearn.preprocessing import MinMaxScaler

scaler = MinMaxScaler()
df[["age_scaled", "income_scaled"]] = scaler.fit_transform(df[["age", "income"]])
```

**Best for:** data with known, bounded ranges (like pixel values 0-255 in images), and algorithms like neural networks that expect small input ranges.

**Downside:** very sensitive to outliers, a single extreme value can squash all the "normal" values into a tiny sliver of the range.

### Z-Score Normalization (Standardization)

Rescales data to have a mean of 0 and a standard deviation of 1, using the formula:

```
z = (x - mean(x)) / std(x)
```

```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
df[["age_z", "income_z"]] = scaler.fit_transform(df[["age", "income"]])
```

**Best for:** algorithms that assume roughly normally-distributed data, such as linear regression, logistic regression, PCA, and SVMs.

### Robust Scaling

Instead of using the mean and standard deviation (which outliers distort heavily), robust scaling uses the **median** and **IQR (interquartile range)**:

```
x_scaled = (x - median(x)) / IQR(x)
```

```python
from sklearn.preprocessing import RobustScaler

scaler = RobustScaler()
df[["income_robust"]] = scaler.fit_transform(df[["income"]])
```

**Best for:** data with significant outliers that you don't want to remove but also don't want dominating the scale.

📊 **[CHART: Three small scatter/number-line plots side by side showing the same raw dataset (with one outlier) after Min-Max Scaling, Standardization, and Robust Scaling, to visually show how differently each handles the outlier]**

**Quick decision guide:**

| Situation                                            | Recommended Scaler        |
| ---------------------------------------------------- | ------------------------- |
| No major outliers, algorithm needs bounded range     | Min-Max Scaling           |
| Roughly normal distribution, general-purpose default | Standardization (Z-score) |
| Data has significant outliers you want to keep       | Robust Scaling            |

---

## 10. Linear Regression

Linear Regression is usually the very first algorithm people learn in ML, and for good reason: it's simple, interpretable, and forms the mathematical basis for many more advanced methods (including logistic regression and neural networks).

### Simple Linear Regression

Simple linear regression predicts a numeric target using **one** input feature, by fitting a straight line through the data:

```
y = mx + b
```

Where:

- `y` = the predicted value (target)
- `x` = the input feature
- `m` = the slope (how much y changes when x increases by 1)
- `b` = the intercept (the value of y when x = 0)

_Example:_ Predicting a student's exam score (`y`) based on hours studied (`x`). The model learns the best-fit line through historical data of (hours studied, score) pairs.

```python
from sklearn.linear_model import LinearRegression
import numpy as np

X = np.array([[1], [2], [3], [4], [5]])  # hours studied
y = np.array([50, 55, 65, 70, 85])        # exam score

model = LinearRegression()
model.fit(X, y)

print("Slope:", model.coef_[0])
print("Intercept:", model.intercept_)

# Predict score for 6 hours of studying
predicted = model.predict([[6]])
print("Predicted score:", predicted[0])
```

📊 **[CHART: A scatter plot of "hours studied" vs "exam score" with a best-fit straight line drawn through the points]**

### Multiple Linear Regression

Multiple linear regression extends the same idea to **several** input features at once:

```
y = b0 + b1*x1 + b2*x2 + ... + bn*xn
```

_Example:_ Predicting house price using square footage, number of bedrooms, and neighborhood crime rate all at once, rather than just one feature.

```python
X = df[["sqft", "bedrooms", "crime_rate"]]
y = df["price"]

model = LinearRegression()
model.fit(X, y)

print("Coefficients:", model.coef_)
print("Intercept:", model.intercept_)
```

Each coefficient tells you how much the target changes when that one feature increases by 1, holding all other features constant.

### Assessing Model Fit

How do you know if your regression line is any good? A few key metrics:

- **R² (R-squared)**: the proportion of variance in the target explained by the model, ranges from 0 to 1 (higher is better). An R² of 0.85 means the model explains 85% of the variation in the data.
- **Mean Squared Error (MSE)**: the average of the squared differences between predicted and actual values. Lower is better; squaring penalizes large errors more heavily.
- **Mean Absolute Error (MAE)**: the average of the absolute differences between predicted and actual values. Easier to interpret since it's in the same units as the target.

```python
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error

predictions = model.predict(X)
print("R²:", r2_score(y, predictions))
print("MSE:", mean_squared_error(y, predictions))
print("MAE:", mean_absolute_error(y, predictions))
```

### Handling Nonlinearity

Linear regression assumes a straight-line relationship, but many real relationships curve. Some fixes:

- **Polynomial features**: add x², x³, etc. as extra features, letting the model fit curves while still technically being "linear" in the coefficients.
- **Log/other transformations**: transform the input or target to make the relationship more linear (as covered in Section 6).
- **Switch algorithms**: for strongly nonlinear data, models like decision trees or SVMs with nonlinear kernels may fit better.

```python
from sklearn.preprocessing import PolynomialFeatures

poly = PolynomialFeatures(degree=2)
X_poly = poly.fit_transform(X)

model = LinearRegression()
model.fit(X_poly, y)
```

📊 **[CHART: A scatter plot of curved data with a straight regression line fitting poorly, next to the same data with a polynomial curve fitting well]**

---

## 11. Logistic Regression

Despite the name, Logistic Regression is used for **classification**, not regression, predicting a category, not a number. It's one of the most widely used algorithms for "yes/no" style problems.

### Binary Logistic Regression

Binary logistic regression predicts one of two classes (e.g., spam/not spam, pass/fail, fraud/not fraud).

Instead of fitting a straight line, it fits an **S-shaped curve** called the **sigmoid function**, which squashes any input into a value between 0 and 1, interpreted as a probability:

```
sigmoid(z) = 1 / (1 + e^(-z))
```

If the predicted probability is above a threshold (commonly 0.5), the model predicts class 1; otherwise, class 0.

_Example:_ Predicting whether a student passes an exam (1) or fails (0) based on hours studied.

```python
from sklearn.linear_model import LogisticRegression
import numpy as np

X = np.array([[1], [2], [3], [4], [5], [6], [7], [8]])  # hours studied
y = np.array([0, 0, 0, 0, 1, 1, 1, 1])                    # pass (1) or fail (0)

model = LogisticRegression()
model.fit(X, y)

# Predict probability of passing with 4.5 hours studied
prob = model.predict_proba([[4.5]])
print("Probability of pass:", prob[0][1])
```

📊 **[CHART: An S-shaped (sigmoid) curve plotted from a low probability near 0 to a high probability near 1, with the x-axis labeled "hours studied" and a horizontal dashed line at probability = 0.5 marking the decision threshold]**

### Multinomial Logistic Regression

When there are **more than two** classes (e.g., classifying a fruit as apple, banana, or orange), multinomial logistic regression extends the same idea, computing a probability for each class and picking the one with the highest probability.

```python
model = LogisticRegression(multi_class="multinomial")
model.fit(X_train, y_train)  # y_train contains multiple classes, e.g., 0, 1, 2
```

### Evaluating Classification Models

R² and MSE (used for regression) don't apply here, classification needs its own metrics:

- **Accuracy**: the percentage of predictions that were correct. Simple, but misleading on imbalanced data (e.g., if 99% of emails aren't spam, a model that always predicts "not spam" gets 99% accuracy while being useless).
- **Precision**: of all the times the model predicted "positive" (e.g., spam), how often was it right? Important when false positives are costly.
- **Recall**: of all the actual positives, how many did the model catch? Important when missing a positive case is costly (e.g., missing a fraud case).
- **F1 Score**: the harmonic mean of precision and recall, a single number balancing both.
- **Confusion Matrix**: a table showing correct and incorrect predictions broken down by class.

```python
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

predictions = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, predictions))
print("Precision:", precision_score(y_test, predictions))
print("Recall:", recall_score(y_test, predictions))
print("F1 Score:", f1_score(y_test, predictions))
print("Confusion Matrix:\n", confusion_matrix(y_test, predictions))
```

📊 **[CHART: A 2x2 confusion matrix heatmap with axes "Predicted" and "Actual", showing counts for True Positive, True Negative, False Positive, and False Negative]**

### Regularization Techniques

Regularization helps prevent **overfitting** (when a model memorizes training data instead of learning general patterns) by adding a penalty for overly complex models.

- **L1 Regularization (Lasso)**: can shrink some feature weights all the way to zero, effectively performing feature selection automatically.
- **L2 Regularization (Ridge)**: shrinks weights toward zero but rarely to exactly zero, spreading influence across features more evenly.

```python
model_l1 = LogisticRegression(penalty="l1", solver="liblinear", C=1.0)
model_l2 = LogisticRegression(penalty="l2", C=1.0)
```

The parameter `C` controls the strength of regularization: smaller `C` means stronger regularization (simpler model).

---

## 12. Decision Trees

A Decision Tree makes predictions by asking a series of yes/no questions, like a flowchart, splitting the data step by step until it reaches a decision.

### Building Decision Trees

_Example:_ Deciding whether to play outside:

- Is it raining? If yes → stay inside.
- If no: Is it too hot (above 35°C)? If yes → stay inside.
- If no → play outside.

🧩 **[MERMAID: A decision tree flowchart starting at "Is it raining?" branching to "Stay inside" (yes) and "Is it too hot?" (no), which branches further to "Stay inside" (yes) and "Play outside" (no)]**

The algorithm builds this tree automatically from data by repeatedly choosing the feature and split point that best separates the classes at each step, using a measure like:

- **Gini Impurity**: measures how "mixed" the classes are in a group (0 = perfectly pure, all one class).
- **Entropy / Information Gain**: measures the reduction in uncertainty after a split.

```python
from sklearn.tree import DecisionTreeClassifier, plot_tree
import matplotlib.pyplot as plt

X = df[["hours_studied", "attendance"]]
y = df["passed"]

model = DecisionTreeClassifier(criterion="gini", max_depth=3)
model.fit(X, y)

# Visualize the tree
plt.figure(figsize=(12, 8))
plot_tree(model, feature_names=["hours_studied", "attendance"], class_names=["Fail", "Pass"], filled=True)
plt.savefig("decision_tree.png")
```

📊 **[CHART: use the matplotlib code above (plot_tree) to generate and insert an actual decision tree diagram image]**

### Pruning and Overfitting

Left unchecked, a decision tree can keep splitting until every single training example has its own tiny leaf, this **memorizes** the training data perfectly but performs terribly on new data. This is called **overfitting**.

**Pruning** limits how large the tree can grow, forcing it to generalize rather than memorize. Common controls:

- `max_depth`: maximum number of levels in the tree.
- `min_samples_split`: minimum number of samples required to split a node.
- `min_samples_leaf`: minimum number of samples required at a leaf (end) node.

```python
model = DecisionTreeClassifier(max_depth=4, min_samples_leaf=10)
```

📊 **[CHART: Two line plots side by side, "Training Accuracy vs Tree Depth" and "Test Accuracy vs Tree Depth", showing training accuracy keeps rising while test accuracy peaks then drops, illustrating overfitting]**

### Random Forests

A single decision tree can be unstable, small changes in data can produce a very different tree. A **Random Forest** fixes this by training MANY decision trees on random subsets of the data and features, then averaging their predictions (for regression) or taking a majority vote (for classification).

This is an example of **ensemble learning** (covered fully in Section 14): combining many "weak" or simple models into one stronger model.

```python
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
model.fit(X_train, y_train)
```

_Why "random"?_ Each tree sees a random subset of the training rows (called bootstrap sampling) and, at each split, only considers a random subset of features. This randomness makes each tree different, and averaging many different-but-decent trees tends to cancel out their individual mistakes.

### Feature Importance

Decision trees (and random forests) can tell you which features mattered most for their predictions, based on how much each feature reduced impurity across all its splits.

```python
importances = model.feature_importances_
for name, importance in zip(X.columns, importances):
    print(f"{name}: {importance:.3f}")
```

📊 **[CHART: A horizontal bar chart ranking features by importance score, from highest to lowest]**

---

## 13. Support Vector Machines

Support Vector Machines (SVMs) are powerful classifiers that work by finding the best possible boundary (called a **hyperplane**) that separates classes with the widest possible margin.

### Linear SVMs

Imagine plotting two classes of points on a 2D graph. Many different lines could separate them, but SVM specifically finds the line that maximizes the distance (**margin**) between itself and the nearest points of each class, these nearest points are called **support vectors**, and they're the only points that actually determine where the boundary goes.

```python
from sklearn.svm import SVC

model = SVC(kernel="linear", C=1.0)
model.fit(X_train, y_train)
```

📊 **[CHART: A scatter plot with two classes of points (different colors), a solid line separating them (the decision boundary), two dashed parallel lines on either side (the margin), and the closest points to the boundary circled and labeled "support vectors"]**

_Why maximize the margin?_ A wider margin generally means the model will generalize better to new, unseen data, it's not just barely squeezing between the classes, it has confident breathing room.

### Nonlinear SVMs

Real data is often NOT separable by a straight line. Imagine one class forming a circle in the middle of a graph, surrounded by the other class, no straight line can separate them.

### Kernels and Kernel Trick

The **kernel trick** is what makes SVMs so powerful: it mathematically projects data into a higher dimension where a straight-line separation DOES become possible, without actually having to compute that higher-dimensional space directly (which would be very expensive).

Common kernels:

- **Linear**: for data that's already separable by a straight line.
- **Polynomial**: captures curved boundaries using polynomial combinations of features.
- **RBF (Radial Basis Function)**: the most popular nonlinear kernel, handles complex, circular/blob-like boundaries well.

```python
model_rbf = SVC(kernel="rbf", C=1.0, gamma="scale")
model_rbf.fit(X_train, y_train)
```

📊 **[CHART: Two scatter plots side by side. Left: a 2D plot where one class forms a circular cluster surrounded by the other class, not linearly separable. Right: the same data with a curved (RBF kernel) decision boundary correctly separating the circular cluster from the rest]**

### SVM for Classification and Regression

While SVMs are best known for classification (**SVC**, Support Vector Classifier), the same core idea can be adapted for regression too (**SVR**, Support Vector Regression), where instead of finding a boundary between classes, the model fits a line/curve while allowing a margin of tolerable error around it.

```python
from sklearn.svm import SVR

model = SVR(kernel="rbf", C=1.0)
model.fit(X_train, y_train)
```

---

## 14. Ensemble Learning

Ensemble learning is based on a simple but powerful idea: **a group of models working together usually outperforms any single model alone**, much like how a group of students with different strengths, working together, often solves problems better than any one student alone.

### Bagging and Boosting

There are two major families of ensemble methods:

**Bagging (Bootstrap Aggregating)**: trains many models **independently and in parallel**, each on a random subset of the data, then combines their predictions (by voting or averaging). Random Forest (Section 12) is the most famous bagging method. Bagging mainly reduces **variance** (makes the model less sensitive to the specific training data it saw).

**Boosting**: trains models **sequentially**, where each new model focuses specifically on correcting the mistakes of the previous ones. Boosting mainly reduces **bias** (makes the overall model less "wrong" on average) but can be more prone to overfitting if not carefully tuned.

🧩 **[MERMAID: Two side-by-side diagrams. Left "Bagging": multiple trees trained in parallel from random data subsets, all feeding into a "Majority Vote / Average" box. Right "Boosting": a sequential chain of models, Model 1 → errors → Model 2 (focuses on errors) → errors → Model 3, all feeding into a "Weighted Combination" box]**

### AdaBoost

AdaBoost (Adaptive Boosting) is one of the earliest and most influential boosting algorithms. It works by:

1. Training a simple model (often a very shallow decision tree, called a "stump").
2. Identifying which training examples it got wrong.
3. Increasing the "weight" (importance) of those misclassified examples so the next model pays more attention to them.
4. Repeating this process, building a chain of models.
5. Combining all models' predictions with a weighted vote (better-performing models get more say).

```python
from sklearn.ensemble import AdaBoostClassifier

model = AdaBoostClassifier(n_estimators=50, learning_rate=1.0, random_state=42)
model.fit(X_train, y_train)
```

### Gradient Boosting

Gradient Boosting is a more general and powerful boosting technique. Instead of reweighting misclassified examples like AdaBoost, each new model is trained to predict the **residual errors** (the difference between actual and predicted values) of the combined models so far, gradually "correcting" the ensemble's mistakes.

```python
from sklearn.ensemble import GradientBoostingClassifier

model = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=3)
model.fit(X_train, y_train)
```

### XGBoost

XGBoost (Extreme Gradient Boosting) is an optimized, highly efficient implementation of gradient boosting. It's one of the most popular algorithms in real-world ML competitions and industry applications because it's fast, handles missing data automatically, and includes built-in regularization to fight overfitting.

```python
# Requires: pip install xgboost
import xgboost as xgb

model = xgb.XGBClassifier(n_estimators=100, learning_rate=0.1, max_depth=3)
model.fit(X_train, y_train)

predictions = model.predict(X_test)
```

📊 **[CHART: A line plot comparing model accuracy across boosting rounds/iterations for AdaBoost, Gradient Boosting, and XGBoost, showing how error typically decreases as more models are added to the ensemble]**

---

## 15. Clustering

Clustering is an **unsupervised learning** technique (no labels required) that groups similar data points together based on their features.

### K-Means Clustering

K-Means is the most widely used clustering algorithm. You choose a number `k` (how many clusters you want), and the algorithm:

1. Randomly places `k` "center" points (**centroids**).
2. Assigns every data point to its nearest centroid.
3. Moves each centroid to the average position of all points assigned to it.
4. Repeats steps 2-3 until the centroids stop moving significantly.

_Example:_ Grouping customers into clusters based on spending habits and visit frequency, without knowing in advance what those groups should be.

```python
from sklearn.cluster import KMeans

X = df[["annual_spend", "visits_per_month"]]

model = KMeans(n_clusters=3, random_state=42, n_init=10)
df["cluster"] = model.fit_predict(X)

print(model.cluster_centers_)  # coordinates of the final cluster centers
```

📊 **[CHART: A scatter plot of two features (e.g., annual spend vs visits per month) with points colored by cluster assignment (3 different colors), and an X or star marker at each cluster centroid]**

A key question: how do you choose `k`? The **Elbow Method** is common, plot the model's error for different values of `k`, and look for the point where adding more clusters stops helping much (the "elbow" of the curve).

```python
inertias = []
for k in range(1, 10):
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    km.fit(X)
    inertias.append(km.inertia_)

# plot k (1-9) vs inertias to find the elbow point
```

📊 **[CHART: An "Elbow Method" line plot with number of clusters (k) on the x-axis and inertia (error) on the y-axis, showing a sharp drop followed by a flattening curve, with the "elbow" point marked]**

### Hierarchical Clustering

Instead of picking `k` upfront, hierarchical clustering builds a full tree of nested clusters, from every point being its own cluster, all the way up to one giant cluster containing everyone.

- **Agglomerative (bottom-up)**: starts with each point as its own cluster and repeatedly merges the closest pair of clusters.
- **Divisive (top-down)**: starts with one big cluster and repeatedly splits it.

The result is usually visualized as a **dendrogram**, a tree diagram showing the order and distance at which clusters were merged. You can then "cut" the tree at any height to get a specific number of clusters.

```python
from scipy.cluster.hierarchy import dendrogram, linkage

linked = linkage(X, method="ward")

# plot linked as a dendrogram to visualize merge order
```

📊 **[CHART: use scipy's dendrogram function on the "linked" variable above to generate an actual dendrogram tree diagram]**

### Density-Based Clustering

**DBSCAN** (Density-Based Spatial Clustering of Applications with Noise) groups points that are closely packed together, and marks isolated points in low-density regions as **noise/outliers**, rather than forcing every point into a cluster.

Unlike K-Means, DBSCAN does not require choosing the number of clusters in advance, and it can find clusters of unusual, non-circular shapes.

```python
from sklearn.cluster import DBSCAN

model = DBSCAN(eps=0.5, min_samples=5)
df["cluster"] = model.fit_predict(X)
# Points labeled -1 are considered noise/outliers
```

📊 **[CHART: A scatter plot showing DBSCAN correctly identifying two curved, non-circular clusters (e.g., two crescent moon shapes) plus a few scattered noise points marked separately, something K-Means would struggle with]**

### Evaluating Clustering

Since there are no true labels in clustering, evaluation looks different from supervised learning:

- **Silhouette Score**: measures how similar a point is to its own cluster compared to other clusters. Ranges from -1 to 1 (higher is better).
- **Inertia (for K-Means)**: sum of squared distances from points to their assigned cluster center (lower is better, but always decreases as k increases, hence the elbow method).
- **Visual inspection**: for 2D/3D data, simply plotting the clusters is often the most intuitive check.

```python
from sklearn.metrics import silhouette_score

score = silhouette_score(X, df["cluster"])
print("Silhouette Score:", score)
```

---

## 16. Principal Component Analysis (PCA)

PCA is the most widely used **dimensionality reduction** technique. It compresses many correlated features into a smaller number of new, uncorrelated features called **principal components**, while preserving as much of the original information (variance) as possible.

### Dimensionality Reduction

Why reduce dimensions at all? A few reasons:

- **Visualization**: humans can only see in 2D or 3D. If you have 50 features, PCA can compress them down to 2 or 3 so you can actually plot and explore the data.
- **Speed**: fewer features mean faster training.
- **Reducing noise/redundancy**: many real-world features are correlated with each other (e.g., "house size in sqft" and "number of rooms" carry overlapping information). PCA combines redundant information into fewer, more efficient features.
- **Fighting the curse of dimensionality**: as the number of features grows very large, data becomes sparse and many algorithms perform worse.

```python
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

# Always standardize before PCA!
X_scaled = StandardScaler().fit_transform(X)

pca = PCA(n_components=2)
X_reduced = pca.fit_transform(X_scaled)
```

📊 **[CHART: A scatter plot of data reduced to 2 principal components (PC1 on x-axis, PC2 on y-axis), with points colored by their original category if available, showing how PCA can reveal separation even after compressing many features down to just 2]**

### Eigenvalues and Eigenvectors

Under the hood, PCA works using linear algebra concepts called eigenvalues and eigenvectors:

- **Eigenvectors** point in the directions of maximum variance in the data, these become the new axes (the principal components).
- **Eigenvalues** tell you HOW MUCH variance exists along each eigenvector's direction, bigger eigenvalue means that direction captures more information.

You don't need to calculate these by hand, `sklearn` handles the math, but understanding the intuition helps: PCA finds the "most informative angles" to look at your data from, and orders them from most to least informative.

🧩 **[MERMAID or CHART: A scatter plot of 2D correlated data (an elongated diagonal cloud of points) with two arrows drawn through the center: a longer arrow along the direction of greatest spread (PC1) and a shorter, perpendicular arrow (PC2)]**

### Variance Explained Ratio

After fitting PCA, you can check exactly how much of the original information each principal component preserved:

```python
pca_full = PCA()
pca_full.fit(X_scaled)

print("Variance explained by each component:", pca_full.explained_variance_ratio_)
print("Cumulative variance explained:", pca_full.explained_variance_ratio_.cumsum())
```

A common approach: keep adding components until you've explained a target amount of variance, often 90-95%.

📊 **[CHART: A "Scree Plot", a line plot with number of principal components on the x-axis and cumulative explained variance (%) on the y-axis, rising steeply at first then flattening, often with a horizontal dashed line at 95% marking a reasonable cutoff]**

### Applications of PCA

- **Image compression**: reducing the number of values needed to represent an image while keeping it visually recognizable.
- **Data visualization**: compressing high-dimensional datasets (like gene expression data with thousands of genes) down to 2D/3D plots.
- **Noise reduction**: dropping low-variance components can remove noise while keeping the meaningful signal.
- **Speeding up other ML models**: reducing the number of input features before training a classifier, especially useful when working with very wide datasets.

---

## 17. Anomaly Detection

Anomaly detection (also called outlier detection) is about identifying data points that are significantly different from the norm, often because they represent something rare, unusual, or potentially problematic.

### Types of Anomalies

- **Point anomalies**: a single data point that is far outside the normal range (e.g., a single $50,000 transaction on a card that usually spends $50 at a time).
- **Contextual anomalies**: a value that's normal in one context but not another (e.g., 30°C is normal in summer but highly unusual in winter).
- **Collective anomalies**: a group of data points that are unusual together, even if each individual point looks normal (e.g., a sudden burst of many small transactions in a row can indicate fraud, even if each one is small enough to look ordinary alone).

### Approaches to Anomaly Detection

Broad strategies include:

- **Statistical methods**: flag points that fall far from the mean (e.g., z-score thresholds, as covered in Section 5).
- **Distance-based methods**: flag points that are far from their neighbors (e.g., k-Nearest Neighbors distance).
- **Density-based methods**: flag points in low-density regions (e.g., DBSCAN naturally does this, as covered in Section 15).
- **Model-based methods**: train a model specifically designed to isolate or score anomalies, like Isolation Forest or One-Class SVM (below).

### Isolation Forest

Isolation Forest works on a clever insight: anomalies are "few and different," so they should be **easier to isolate** than normal points.

The algorithm randomly picks a feature and a random split value, repeatedly, building a tree. Normal points, being surrounded by lots of similar points, take many splits to isolate. Anomalies, being rare and different, tend to get isolated in very few splits, closer to the root of the tree.

```python
from sklearn.ensemble import IsolationForest

model = IsolationForest(contamination=0.05, random_state=42)  # expect ~5% anomalies
df["anomaly"] = model.fit_predict(X)
# -1 = anomaly, 1 = normal
```

📊 **[CHART: A scatter plot of mostly normal, densely packed points with a few clearly separated points marked in a different color/shape and labeled "anomalies detected by Isolation Forest"]**

### One-Class SVM

One-Class SVM adapts the Support Vector Machine idea (Section 13) for anomaly detection. Instead of separating two classes, it learns a boundary that tightly encloses the "normal" data. Any new point that falls OUTSIDE this boundary is flagged as an anomaly.

```python
from sklearn.svm import OneClassSVM

model = OneClassSVM(kernel="rbf", nu=0.05, gamma="scale")  # nu ~ expected proportion of anomalies
df["anomaly"] = model.fit_predict(X)
# -1 = anomaly, 1 = normal
```

**Isolation Forest vs One-Class SVM, when to use which:**

|                               | Isolation Forest                    | One-Class SVM                                     |
| ----------------------------- | ----------------------------------- | ------------------------------------------------- |
| Speed on large datasets       | Fast                                | Slower                                            |
| Handles high dimensions       | Well                                | Can struggle                                      |
| Assumes a specific data shape | No                                  | Somewhat (depends on kernel)                      |
| Common use case               | Fraud detection, large tabular data | Smaller datasets, well-understood "normal" region |

_Real-world example tying it all together:_ A credit card company uses Isolation Forest, trained on years of normal transaction data, to score every new transaction in real time. Transactions scoring as strong anomalies get flagged for review or temporarily blocked, exactly the kind of application mentioned back in Section 3.

---

## Quick Reference: When to Use What

| Goal                                                      | Look at                                                   |
| --------------------------------------------------------- | --------------------------------------------------------- |
| Predict a number                                          | Linear Regression (Section 10)                            |
| Predict a category (2 classes)                            | Logistic Regression (11), SVM (13)                        |
| Predict a category (many classes)                         | Multinomial Logistic Regression (11), Decision Trees (12) |
| Interpretable rules                                       | Decision Trees (12)                                       |
| Best possible accuracy, don't care about interpretability | Random Forest / Gradient Boosting / XGBoost (12, 14)      |
| Group similar items with no labels                        | K-Means, Hierarchical, DBSCAN (15)                        |
| Too many features                                         | PCA (16)                                                  |
| Find rare/unusual data points                             | Isolation Forest, One-Class SVM (17)                      |

---

_End of module. Remember: every algorithm here is just a tool, the real skill in machine learning is understanding your data well enough to know which tool fits the job._
