TITLE: Basic GROQ Filter Query
DESCRIPTION: GROQ query demonstrating filtering documents where id is greater than 2 and projecting only the name field.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/01-overview.md#2025-04-12_snippet_1

LANGUAGE: example
CODE:

```
*[id > 2]{name}
```

---

TITLE: GROQ Query Result
DESCRIPTION: JSON result showing filtered and projected output from the GROQ query.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/01-overview.md#2025-04-12_snippet_2

LANGUAGE: json
CODE:

```
[
  { "name": "Drax"},
  { "name": "Groot"},
  { "name": "Rocket"}
]
```

---

TITLE: GROQ Operator Precedence Table
DESCRIPTION: Complete ordering of GROQ operators by precedence level (11 highest to 1 lowest) and their associativity rules. Includes compound expressions, arithmetic operators, ranges, comparisons, logical operators, and the arrow operator.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/10-precedence-associativity.md#2025-04-12_snippet_0

LANGUAGE: groq
CODE:

```
Level 11: Compound expressions
Level 10: +, ! (prefix)
Level 9: ** (right-associative)
Level 8: - (prefix)
Level 7: *, /, % (left-associative)
Level 6: +, - (left-associative)
Level 5: .., ... (non-associative)
Level 4: ==, !=, >, >=, <, <=, in, match (non-associative)
Level 4: asc, desc (postfix)
Level 3: && (left-associative)
Level 2: || (left-associative)
Level 1: => (non-associative)
```

---

TITLE: Demonstrating Pipe Function Call in GROQ
DESCRIPTION: Shows how to use pipe functions in GROQ to process arrays. This example filters people documents, orders them by name, and projects the age field.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/07-compound-expressions.md#2025-04-12_snippet_2

LANGUAGE: groq
CODE:

```
*[_type == "person"] | order(name) | {age}
```

---

TITLE: Querying Person Documents with Friends Filter in GROQ
DESCRIPTION: This GROQ query fetches all documents of type 'person', returning their name and friends from Norway. It demonstrates the use of nested scopes and filters.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/03-execution.md#2025-04-12_snippet_0

LANGUAGE: groq
CODE:

```
*[_type == "person"]{name, friends[country == "NO"]}
```

---

TITLE: Using Pipe Function in GROQ Query
DESCRIPTION: Demonstrates the use of pipe functions in a GROQ query, specifically using the 'order' function to sort results.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/12-pipe-functions.md#2025-04-12_snippet_0

LANGUAGE: groq
CODE:

```
*[_type == "person"] | order(name) | {age}
```

---

TITLE: Projection Traversal in GROQ
DESCRIPTION: Demonstrates how to create new objects from existing ones by selecting specific fields and computing derived fields with expressions.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/08-traversal-operators.md#2025-04-12_snippet_4

LANGUAGE: example
CODE:

```
*[_type == "person"]{name, "isLegal": age >= 18}
                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

---

TITLE: Comparing GROQ and JavaScript Equivalents for Data Filtering
DESCRIPTION: Example demonstrating the equivalence between a GROQ query that filters users by type and returns their IDs, and the equivalent JavaScript code using filter and map functions.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/03-execution.md#2025-04-12_snippet_3

LANGUAGE: javascript
CODE:

```
// The following GROQ:
*[_type == "user"]._id

// is equivalent to the following JavaScript:
data.filter(u => u._type == "user").map(u => u._id)
```

---

TITLE: GROQ Equality Algorithm
DESCRIPTION: Algorithm for determining equality between two values in GROQ. Handles null values and uses partial comparison for other types. Note that unlike SQL, GROQ treats null comparison with non-null values as false.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/05-equality-comparison.md#2025-04-12_snippet_0

LANGUAGE: pseudocode
CODE:

```
Equal(a, b):
- If both {a} and {b} is {null}:
  - Return {true}.
- Let {cmp} be the result of {PartialCompare(a, b)}.
- If {cmp} is {Equal}:
  - Return {true}.
- Otherwise:
  - Return {false}.
```

---

TITLE: Querying Person Documents with Children Subquery in GROQ
DESCRIPTION: This GROQ query fetches all documents of type 'person', returning their id, name, and a subquery for their children. It demonstrates the use of parent expressions for joins.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/03-execution.md#2025-04-12_snippet_1

LANGUAGE: groq
CODE:

```
*[_type == "person"]{
  id,
  name,
  "children": *[_type == "person" && parentId == ^.id]
}
```

---

TITLE: Attribute Access Traversal in GROQ
DESCRIPTION: Demonstrates how to access attributes of an object in GROQ using dot notation or square bracket notation with a string expression.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/08-traversal-operators.md#2025-04-12_snippet_0

LANGUAGE: example
CODE:

```
person.name
      ~~~~~

person["Full Name"]
      ~~~~~~~~~~~~~
```

---

TITLE: Scoring Results in GROQ Query
DESCRIPTION: Shows how to use the 'score' function to assign scores to query results based on a matching condition.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/12-pipe-functions.md#2025-04-12_snippet_1

LANGUAGE: groq
CODE:

```
*[_type == "listing"] | score(body match "jacuzzi")
```

---

TITLE: Using GROQ Boost Function Example
DESCRIPTION: Example showing how to use the boost() function within a score() context to increase relevance of matches in the title field compared to body field matches.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/11-functions.md#2025-04-12_snippet_0

LANGUAGE: groq
CODE:

```
* | score(boost(title matches "milk", 5.0), body matches "milk")
```

---

TITLE: Demonstrating Parenthesis Expression in GROQ
DESCRIPTION: Shows how parentheses can be used to control operator precedence in GROQ expressions. In this example, the addition operation is performed before multiplication.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/07-compound-expressions.md#2025-04-12_snippet_0

LANGUAGE: groq
CODE:

```
(1 + 2) * 3
```

---

TITLE: Query Execution Algorithm in GROQ
DESCRIPTION: Algorithm for executing a GROQ query, which creates a root scope from the context and evaluates the query expression within that scope, returning the final result.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/03-execution.md#2025-04-12_snippet_8

LANGUAGE: pseudocode
CODE:

```
ExecuteQuery(query, context):

- Let {scope} be the result of {NewRootScope(context)}.
- Let {expr} be the expression of {query}.
- Let {result} be the result of {Evalute(expr, scope)}.
- Return {result}.
```

---

TITLE: Demonstrating Traversal Expression in GROQ
DESCRIPTION: Illustrates how to traverse through nested data structures in GROQ, accessing arrays and dereferencing objects using the arrow operator.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/07-compound-expressions.md#2025-04-12_snippet_1

LANGUAGE: groq
CODE:

```
users.foo.bar[0].sources[]->name
```

---

TITLE: Filter Traversal in GROQ
DESCRIPTION: Shows how to filter an array using a conditional expression, returning only elements that match the specified condition.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/08-traversal-operators.md#2025-04-12_snippet_3

LANGUAGE: example
CODE:

```
*[_type == "person"]
 ~~~~~~~~~~~~~~~~~~~
```

---

TITLE: Using This Expression in GROQ
DESCRIPTION: A this expression uses the @ symbol to reference the current value in scope. This example filters numbers array elements that are greater than or equal to 10.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/06-simple-expressions.md#2025-04-12_snippet_0

LANGUAGE: groq
CODE:

```
*[_id == "doc"][0].numbers[@ >= 10]
```

---

TITLE: Using Function Call Expressions in GROQ
DESCRIPTION: Function call expressions invoke built-in GROQ functions. These examples show rounding a score to 2 decimal places and converting a description to lowercase using the global namespace.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/06-simple-expressions.md#2025-04-12_snippet_4

LANGUAGE: groq
CODE:

```
*{"score": round(score, 2)}
```

LANGUAGE: groq
CODE:

```
*{"description": global::lower(description)}
```

---

TITLE: Evaluating Equality Operators in GROQ
DESCRIPTION: Defines the evaluation process for equality operators (== and !=) in GROQ. It compares two expressions and returns the result based on their equality.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/09-operators.md#2025-04-12_snippet_3

LANGUAGE: GROQ
CODE:

```
EvaluateEquality(scope):

- Let {leftNode} be the first {Expression}.
- Let {left} be the result of {Evaluate(leftNode, scope)}.
- Let {rightNode} be the last {Expression}.
- Let {right} be the result of {Evaluate(rightNode, scope)}.
- Let {result} be the result of {Equal(left, right)}.
- If the operator is `!=`:
  - If {result} is {true}:
    - Return {false}.
  - If {result} is {false}:
    - Return {true}.
- Return {result}.
```

---

TITLE: GROQ Total Comparison Algorithm
DESCRIPTION: Algorithm for total comparison between two values, providing consistent ordering across different types. Uses type ordering and partial comparison to determine the final result.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/05-equality-comparison.md#2025-04-12_snippet_3

LANGUAGE: pseudocode
CODE:

```
TotalCompare(a, b):
- Let {aTypeOrder} be the result of {TypeOrder(a)}.
- Let {bTypeOrder} be the result of {TypeOrder(b)}.
- If {aTypeOrder} != {bTypeOrder}:
  - Return the result of {PartialCompare(aTypeOrder, bTypeOrder)}.
- Let {result} be the result of {PartialCompare(a, b)}.
- If {result} is {null}:
  - Return {Equal}.
- Otherwise:
  - Return {result}.
```

---

TITLE: Evaluating In Operator in GROQ
DESCRIPTION: Defines the evaluation process for the IN operator in GROQ. It checks if a value is within a range or an array of values.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/09-operators.md#2025-04-12_snippet_5

LANGUAGE: GROQ
CODE:

```
EvaluateIn(scope):

- Let {leftNode} be the first {Expression}.
- Let {left} be the result of {Evaluate(leftNode, scope)}.
- If the right-hand side is a {Range}:
  - Let {lowerNode} be the start node of the range.
  - Let {lower} be the result of {Evaluate(lowerNode, scope)}.
  - Let {upperNode} be the end node of the range.
  - Let {upper} be the result of {Evaluate(upperNode, scope)}.
  - Let {leftCmp} be the result of {PartialCompare(left, lower)}.
  - Let {rightCmp} be the result of {PartialCompare(left, upper)}.
  - If {leftCmp} or {rightCmp} is {null}:
    - Return {null}.
  - If {leftCmp} is {Less}:
    - Return {false}.
  - If {rightCmp} is {Greater}:
    - Return {false}.
  - If the range is exclusive and {rightCmp} is {Equal}:
    - Return {false}.
  - Return {true}.
- Let {rightNode} be the last {Expression}.
- Let {right} be the result of {Evaluate(rightNode, scope)}.
- If {right} is an array:
  - For each {value} in {right}:
    - If {Equal(left, value)} is {true}:
      - Return {true}.
  - Return {false}.
- Return {null}.
```

---

TITLE: Element Access Traversal in GROQ
DESCRIPTION: Shows how to access elements within an array using square bracket notation with an index. Supports 0-based indexing and negative indices to access elements from the end of the array.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/08-traversal-operators.md#2025-04-12_snippet_1

---

TITLE: Evaluating Match Operator in GROQ
DESCRIPTION: Defines the evaluation process for the MATCH operator in GROQ. It checks if a string or array of strings matches any of the given patterns.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/09-operators.md#2025-04-12_snippet_6

LANGUAGE: GROQ
CODE:

```
EvaluateMatch(scope):

- Let {leftNode} be the first {Expression}.
- Let {left} be the result of {Evaluate(leftNode, scope)}.
- Let {rightNode} be the last {Expression}.
- Let {right} be the result of {Evaluate(rightNode, scope)}.
- Let {tokens} be an empty array.
- If {left} is a string:
  - Concatenate {MatchTokenize(left)} to {tokens}.
- If {left} is an array:
  - For each {value} in {left}:
    - If {value} is a string:
      - Concatenate {MatchTokenize(value)} to {tokens}.
- Let {patterns} be an empty array.
- If {right} is a string:
  - Append {MatchAnalyzePattern(right)} to {patterns}.
- If {right} is an array:
  - For each {value} in {right}:
    - If {value} is a string:
      - Append {MatchAnalyzePattern(value)} to {patterns}.
    - Otherwise: \* Return {false}.
- If {patterns} is empty:
  - Return {false}.
- For each {pattern} in {patterns}:
  - If {pattern} does not matches {tokens}:
    - Return {false}.
- Return {true}.
```

---

TITLE: Evaluating Comparison Operators in GROQ
DESCRIPTION: Defines the evaluation process for comparison operators (<, <=, >, >=) in GROQ. It compares two expressions and returns the result based on their relative values.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/09-operators.md#2025-04-12_snippet_4

LANGUAGE: GROQ
CODE:

```
EvaluateComparison(scope):

- Let {leftNode} be the first {Expression}.
- Let {left} be the result of {Evaluate(leftNode, scope)}.
- Let {rightNode} be the last {Expression}.
- Let {right} be the result of {Evaluate(rightNode, scope)}.
- Let {cmp} be the result of {PartialCompare(left, right)}.
- If {cmp} is {null}:
  - Return {null}.
- If {cmp} is {Less} and the operator is {<} or {<=}:
  - Return {true}.
- If {cmp} is {Greater} and the operator is {>} or {>=}:
  - Return {true}.
- If {cmp} is {Equal} and the operator is {<=} or {>=}:
  - Return {true}.
- Return {false}.
```

---

TITLE: Evaluating Binary Plus Operator in GROQ
DESCRIPTION: Defines the evaluation process for the binary plus (+) operator in GROQ. It handles string concatenation, numeric addition, array concatenation, object merging, and datetime addition.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/09-operators.md#2025-04-12_snippet_9

LANGUAGE: GROQ
CODE:

```
EvaluatePlus(scope):

- Let {leftNode} be the first {Expression}.
- Let {left} be the result of {Evaluate(leftNode, scope)}.
- Let {rightNode} be the last {Expression}.
- Let {right} be the result of {Evaluate(rightNode, scope)}.
- If both {left} and {right} are strings:
  - Return the string concatenation of {left} and {right}.
- If both {left} and {right} are numbers:
  - Return the addition of {left} and {right}.
- If both {left} and {right} are arrays:
  - Return the concatenation of {left} and {right}.
- If both {left} and {right} are objects:
  - Return the merged object of {left} and {right}. For duplicate fields the value from {right} takes precedence.
- If {left} is a datetime and {right} is a number:
  - Return a new datetime that adds (or subtracts, if negative) {right} as a number of seconds to {left}.
- Return {null}.
```

---

TITLE: GROQ Type Order Algorithm
DESCRIPTION: Algorithm for determining the ordering of different data types in GROQ, used in total comparison operations. Assigns numeric values to different types for consistent ordering.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/05-equality-comparison.md#2025-04-12_snippet_2

LANGUAGE: pseudocode
CODE:

```
TypeOrder(val):
- If {val} is a datetime:
  - Return 1.
- If {val} is a number:
  - Return 2.
- If {val} is a string:
  - Return 3.
- If {val} is a boolean:
  - Return 4.
- Return 5.
```

---

TITLE: Implementing array::unique() Function in GROQ
DESCRIPTION: Filters duplicate values from an array, considering equality for comparable values. Takes one argument: the input array.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/11-functions.md#2025-04-12_snippet_9

LANGUAGE: pseudocode
CODE:

```
array_unique(args, scope):

- Let {arrNode} be the first element of {args}.
- Let {arr} be the result of {Evaluate(arrNode, scope)}.
- If {arr} is not an array:
  - Return {null}.
- Let {output} be an empty array.
- For each element in {arr}:
  - Let {elem} be the element
  - Let {found} be false.
  - If {elem} is comparable (see above):
    - For each element in {arr}:
      - Let {b} be the element.
      - Set {found} be the result of `Equal(elem, b)`
      - If {found} is true:
        - Break loop
  - If {found} is false:
    - Add {elem} to {output} at any position.
- Return {output}.

array_unique_validate(args):

- If the length of {args} is not 1:
  - Report an error.
```

---

TITLE: Using This Attribute Expression in GROQ
DESCRIPTION: This attribute expressions reference a property on the current object scope. This example filters documents where the name attribute equals "Michael Bluth".
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/06-simple-expressions.md#2025-04-12_snippet_1

LANGUAGE: groq
CODE:

```
*[_id == "document"][name == "Michael Bluth"]
```

---

TITLE: Implementing array::intersects() Function in GROQ
DESCRIPTION: Compares two arrays and returns true if they have any elements in common. Takes two arguments: the two arrays to compare.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/11-functions.md#2025-04-12_snippet_10

LANGUAGE: pseudocode
CODE:

```
array_intersects(args, scope):

- Let {firstNode} be the first element of {args}.
- Let {first} be the result of {Evaluate(firstNode, scope)}.
- If {first} is not an array:
  - Return {null}.
- Let {secondNode} be the first element of {args}.
- Let {second} be the result of {Evaluate(secondNode, scope)}.
- If {second} is not an array:
  - Return {null}.
- For each element in {first}:
  - Let {a} be the element.
  - For each element in {second}:
    - Let {b} be the element.
    - Set {equal} to be the result of `Equal(a, b)`.
    - If {equal} is true:
      - Return {true}.
- Return {false}.

array_intersects_validate(args):

- If the length of {args} is not 2:
  - Report an error.
```

---

TITLE: Implementing max() function in GROQ
DESCRIPTION: Finds the largest numeric value in an array. Null values are ignored, non-numbers cause null return. Returns null if array contains no numeric values.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/11-functions.md#2025-04-12_snippet_19

LANGUAGE: pseudocode
CODE:

```
math_max(args, scope):

- Let {arrNode} be the first element of {args}.
- Let {arr} be the result of {Evaluate(arrNode, scope)}.
- If {arr} is not an array, return {null}.
- Let {max} be {null}.
- For each element {elem} in {arr}:
  - If {elem} is null:
    - Ignore it.
  - If {elem} is not a number:
    - Return {null}.
  - Otherwise:
    - If {max} is {null} or {PartialCompare(elem, max)} is {Greater}:
      - Set {max} to {elem}.
- Return {max}.
```

---

TITLE: Implementing sum() function in GROQ
DESCRIPTION: The sum function computes the sum of all numbers in an array. Null values are ignored, non-numbers cause null return. Returns 0 if array contains no numeric values.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/11-functions.md#2025-04-12_snippet_13

LANGUAGE: pseudocode
CODE:

```
math_sum(args, scope):

- Let {arrNode} be the first element of {args}.
- Let {arr} be the result of {Evaluate(arrNode, scope)}.
- If {arr} is not an array, return {null}.
- Let {n} be zero.
- For each element {elem} in {arr}:
  - If {elem} is null:
    - Ignore it.
  - If {elem} is not a number:
    - Return {null}.
  - Otherwise:
    - Add {elem} to {n}.
- Return {n}.
```

---

TITLE: Slice Traversal in GROQ
DESCRIPTION: Demonstrates how to extract a subset of elements from an array using range notation, defining start and end indices.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/08-traversal-operators.md#2025-04-12_snippet_2

LANGUAGE: example
CODE:

```
people[0..10]
      ~~~~~~~
```

---

TITLE: Implementing min() function in GROQ
DESCRIPTION: Finds the smallest numeric value in an array. Null values are ignored, non-numbers cause null return. Returns null if array contains no numeric values.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/11-functions.md#2025-04-12_snippet_17

LANGUAGE: pseudocode
CODE:

```
math_min(args, scope):

- Let {arrNode} be the first element of {args}.
- Let {arr} be the result of {Evaluate(arrNode, scope)}.
- If {arr} is not an array, return {null}.
- Let {min} be {null}.
- For each element {elem} in {arr}:
  - If {elem} is null:
    - Ignore it.
  - If {elem} is not a number:
    - Return {null}.
  - Otherwise:
    - If {min} is {null} or {PartialCompare(elem, min)} is {Lower}:
      - Set {min} to {elem}.
- Return {min}.
```

---

TITLE: Implementing avg() function in GROQ
DESCRIPTION: Computes the arithmetic mean of all numbers in an array. Null values are ignored, non-numbers cause null return. Returns null if array contains no numeric values.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/11-functions.md#2025-04-12_snippet_15

LANGUAGE: pseudocode
CODE:

```
math_avg(args, scope):

- Let {arrNode} be the first element of {args}.
- Let {arr} be the result of {Evaluate(arrNode, scope)}.
- If {arr} is not an array, return {null}.
- Let {n} be zero.
- Let {count} be zero.
- For each element {elem} in {arr}:
  - If {elem} is null:
    - Ignore it.
  - If {elem} is not a number:
    - Return {null}.
  - Otherwise:
    - Increment {count}.
    - Add {elem} to {n}.
- If {count} is zero:
  - Return {null}.
- Return {n} divided by the {count}.
```

---

TITLE: Implementing global::pt() Function for Portable Text Validation
DESCRIPTION: This function evaluates whether an input object or array of objects conforms to the Portable Text specification. It returns the original value if valid, or null if invalid.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/14-extensions.md#2025-04-12_snippet_0

LANGUAGE: pseudocode
CODE:

```
global_pt(args, scope):

- Let {baseNode} be the first element of {args}.
- Let {base} be the result of {Evaluate(baseNode, scope)}.
- If {base} is an object:
  - Try to parse it as Portable Text Block:
  - If {base} is a valid Portable Text Block:
    - Return {base}.
- If {base} is an array of objects:
  - Try to parse it as an array of Portable Text blocks:
    - If all elements in {base} array are valid Portable Text blocks:
      - Return {base}.
- Otherwise:
  - Return {null}.
```

---

TITLE: Scoring Documents Based on a Condition in GROQ
DESCRIPTION: This GROQ query scores all documents based on whether 'a' is greater than 1. It demonstrates the basic use of the score function.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/03-execution.md#2025-04-12_snippet_2

LANGUAGE: groq
CODE:

```
* | score(a > 1)
```

---

TITLE: Implementing global::geo() Function for Geographic Data
DESCRIPTION: This function constructs a geographic value from an object or another geo value. It attempts to parse the input as either a Geo Point or GeoJSON object.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/14-extensions.md#2025-04-12_snippet_4

LANGUAGE: pseudocode
CODE:

```
global_geo(args, scope):

- Let {baseNode} be the first element of {args}.
- Let {base} be the result of {Evaluate(baseNode, scope)}.
- If {base} is an object:
  - Try to parse it as Geo Point and GeoJSON:
  - If {base} is a valid geo value:
    - Return {base}.
- If {base} is a geo value:
  - Return {base}.
- Otherwise:
  - Return {null}.
```

---

TITLE: Using Everything Expression in GROQ
DESCRIPTION: The everything expression uses the * symbol to reference the entire dataset. This example selects all documents where _type equals "person".
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/06-simple-expressions.md#2025-04-12_snippet_2

LANGUAGE: groq
CODE:

```
*[_type == "person"]
```

---

TITLE: Implementing geo::intersects() Function for Spatial Intersection
DESCRIPTION: This function determines if two geo values intersect in planar space. It returns true if the geo values share any geometric points.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/14-extensions.md#2025-04-12_snippet_10

LANGUAGE: pseudocode
CODE:

```
geo_intersects(args, scope):

- Let {firstNode} be the first element of {args}.
- Let {secondNode} be the second element of {args}.
- Let {first} be the result of {Evaluate(firstNode, scope)}.
- Let {second} be the result of {Evaluate(secondNode, scope)}.
- If {first} or {second} is a not a geo value:
  - Return {null}.
- If {first} intersects {second}:
  - Return {true}.
- Otherwise:
  - Return {false}.
```

---

TITLE: Evaluating Binary Minus Operator in GROQ
DESCRIPTION: Defines the evaluation process for the binary minus (-) operator in GROQ. It handles numeric subtraction, datetime difference, and datetime subtraction.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/09-operators.md#2025-04-12_snippet_10

LANGUAGE: GROQ
CODE:

```
EvaluateMinus(scope):

- Let {leftNode} be the first {Expression}.
- Let {left} be the result of {Evaluate(leftNode, scope)}.
- Let {rightNode} be the last {Expression}.
- Let {right} be the result of {Evaluate(rightNode, scope)}.
- If both {left} and {right} are numbers:
  - Return the subtraction of {left} from {right}.
- If both {left} and {right} are datetimes:
  - Return the difference, in seconds, between {left} from {right}.
- If {left} is a datetime and {right} is a number:
  - Return a new datetime being {left} minus {right} as seconds.
- Return {null}.
```

---

TITLE: GROQ Partial Comparison Algorithm
DESCRIPTION: Detailed algorithm for partial comparison between two values, handling different types including datetime, numbers, strings, and booleans. Returns Greater, Equal, Less, or null for incomparable values.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/05-equality-comparison.md#2025-04-12_snippet_1

LANGUAGE: pseudocode
CODE:

```
PartialCompare(a, b):
- If the type of {a} is different from the type of {b}:
  - Return {null}.
- If {a} is a datetime, consider the datetimes as absolute points in time in the UTC time zone:
  - If a < b:
    - Return {Less}.
  - If a > b:
    - Return {Greater}.
  - If a = b:
    - Return {Equal}.
- If {a} is a number:
  - If a < b:
    - Return {Less}.
  - If a > b:
    - Return {Greater}.
  - If a = b:
    - Return {Equal}.
- If {a} is a string:
  - For each Unicode code point ({aCodePoint}, {bCodePoint}) in {a} and {b}:
    - If {aCodePoint} < {bCodePoint}:
      - Return {Less}.
    - If {aCodePoint} > {bCodePoint}: \* Return {Greater}.
  - If {a} is shorter than {b}:
    - Return {Less}.
  - If {a} is longer than {b}:
    - Return {Greater}.
  - Return {Equal}.
- If {a} is a boolean:
  - Return the comparison between {a} and {b} with {false} < {true}.
- Return {null}.
```

---

TITLE: Multiple Scoring Expressions in GROQ Query
DESCRIPTION: Illustrates the use of multiple scoring expressions in a single 'score' function call to evaluate and rank results based on multiple criteria.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/12-pipe-functions.md#2025-04-12_snippet_2

LANGUAGE: groq
CODE:

```
*[_type == "listing"] | score(body match "jacuzzi", bedrooms > 2, available && !inContract)
```

---

TITLE: Evaluating And Operator in GROQ
DESCRIPTION: Defines the evaluation process for the AND (&&) operator in GROQ. It checks both operands and returns true only if both are true, false if either is false, and null for non-boolean operands.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/09-operators.md#2025-04-12_snippet_0

LANGUAGE: GROQ
CODE:

```
EvaluateAnd(scope):

- Let {leftNode} be the first {Expression}.
- Let {left} be the result of {Evaluate(leftNode, scope)}.
- Let {rightNode} be the last {Expression}.
- Let {right} be the result of {Evaluate(rightNode, scope)}.
- If {left} or {right} is {false}:
  - Return {false}.
- If {left} or {right} is not a boolean:
  - Return {null}.
- Return {true}.
```

---

TITLE: Implementing array::join() Function in GROQ
DESCRIPTION: Concatenates elements of an array into a single string using a specified separator. Takes two arguments: the array and the separator string.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/11-functions.md#2025-04-12_snippet_7

LANGUAGE: pseudocode
CODE:

```
array_join(args, scope):

- Let {arrNode} be the first element of {args}.
- Let {sepNode} be the second element of {args}.
- Let {arr} be the result of {Evaluate(arrNode, scope)}.
- Let {sep} be the result of {Evaluate(sepNode, scope)}.
- If {arr} is not an array:
  - Return {null}.
- If {sep} is not a string:
  - Return {null}.
- Let {output} be an empty string.
- For each element in {arr}:
  - Let {elem} be the element.
  - Let {index} be the index of the element.
  - If {index} is greater than or equal to 1, append {sep} to {output}.
  - Let {str} be the result of evaluating `global::string(elem)`.
  - If {str} is {null}:
    - Return {null}.
  - Otherwise:
    - Append {str} to {output}.
- Return {output}.

array_join_validate(args):

- If the length of {args} is not 2:
  - Report an error.
```

---

TITLE: Evaluating Or Operator in GROQ
DESCRIPTION: Defines the evaluation process for the OR (||) operator in GROQ. It returns true if either operand is true, false if both are false, and null if any operand is non-boolean.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/09-operators.md#2025-04-12_snippet_1

LANGUAGE: GROQ
CODE:

```
EvaluateOr(scope):

- Let {leftNode} be the first {Expression}.
- Let {left} be the result of {Evaluate(leftNode, scope)}.
- Let {rightNode} be the last {Expression}.
- Let {right} be the result of {Evaluate(rightNode, scope)}.
- If {left} or {right} is {true}:
  - Return {true}.
- If {left} or {right} is not a boolean:
  - Return {null}.
- Return {false}.
```

---

TITLE: Using Parent Expression in GROQ
DESCRIPTION: The parent expression (^) references a higher-level scope. This example finds people who have a reference to a friend document that has the isCool property.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/06-simple-expressions.md#2025-04-12_snippet_3

LANGUAGE: groq
CODE:

```
// Find all people who have a cool friend
*[_type == "person" && *[_id == ^.friend._ref][0].isCool]
```

---

TITLE: Evaluating Not Operator in GROQ
DESCRIPTION: Defines the evaluation process for the NOT (!) operator in GROQ. It returns the opposite boolean value for true or false, and null for non-boolean values.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/09-operators.md#2025-04-12_snippet_2

LANGUAGE: GROQ
CODE:

```
EvaluateNot(scope):

- Let {valueNode} be the {Expression}.
- Let {value} be the result of {Evaluate(valueNode, scope)}.
- If {value} is {false}:
  - Return {true}.
- If {value} is {true}:
  - Return {false}.
- Return {null}.
```

---

TITLE: Implementing array::compact() Function in GROQ
DESCRIPTION: Filters null values from an array. Takes one argument: the input array.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/11-functions.md#2025-04-12_snippet_8

LANGUAGE: pseudocode
CODE:

```
array_compact(args, scope):

- Let {arrNode} be the first element of {args}.
- Let {arr} be the result of {Evaluate(arrNode, scope)}.
- If {arr} is not an array:
  - Return null
- Let {output} be an empty array.
- For each element in {arr}:
  - Let {elem} be the element
  - If {elem} is not null:
    - Append {elem} to {output}.
- Return {output}.

array_compact_validate(args):

- If the length of {args} is not 1:
  - Report an error.
```

---

TITLE: Implementing diff::changedAny() Function in GROQ
DESCRIPTION: Compares two objects and returns true if any key paths matched by the selector are changed. Takes three arguments: left-hand side, right-hand side, and a selector.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/11-functions.md#2025-04-12_snippet_2

LANGUAGE: pseudocode
CODE:

```
diff_changedAny(args, scope):

- Let {lhs} be the first element of {args}.
- Let {rhs} be the second element of {args}.
- Let {selector} be the third element of {args}.
- Let {before} be the result of {Evaluate(lhs, scope)}.
- Let {after} be the result of {Evaluate(rhs, scope)}.
- Let {selectedKeyPaths} be the result of {EvaluateSelector(selector, before, scope)}.
- Let {diffKeyPaths} be the list of key paths that are different in {before} and {after}.
- If {diffKeyPaths} overlaps with {selectedKeyPaths}:
  - Return {true}.
- Otherwise:
  - Return {false}.

diff_changedAny_validate(args):

- If the length of {args} is not 3:
  - Report an error.
- If the third element is not a {Selector}:
  - Report an error.
```

---

TITLE: Implementing string::startsWith() Function in GROQ
DESCRIPTION: Evaluates whether a string starts with a given prefix. Takes two arguments: the input string and the prefix string.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/11-functions.md#2025-04-12_snippet_12

LANGUAGE: pseudocode
CODE:

```
string_startsWith(args, scope):

- Let {strNode} be the first element of {args}.
- Let {prefixNode} be the second element of {args}.
- Let {str} be the result of {Evaluate(strNode, scope)}.
- If {str} is not a string, return {null}.
- Let {prefix} be the result of {Evaluate(sepNode, scope)}.
- If {prefix} is not a string, return {null}.
- Let {n} be the length of {prefix}.
- If {n} is zero:
  - Return true.
- If the first {n} characters of {str} equal {prefix}:
  - Return true.
- Otherwise return false.

string_startsWith_validate(args):

- If the length of {args} is not 2:
  - Report an error.
```

---

TITLE: Implementing diff::changedOnly() Function in GROQ
DESCRIPTION: Compares two objects and returns true if only the key paths matched by the selector are changed. Takes three arguments: left-hand side, right-hand side, and a selector.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/11-functions.md#2025-04-12_snippet_3

LANGUAGE: pseudocode
CODE:

```
diff_changedOnly(args, scope):

- Let {lhs} be the first element of {args}.
- Let {rhs} be the second element of {args}.
- Let {selector} be the third element of {args}.
- Let {before} be the result of {Evaluate(lhs, scope)}.
- Let {after} be the result of {Evaluate(rhs, scope)}.
- Let {selectedKeyPaths} be the result of {EvaluateSelector(selector, before, scope)}.
- Let {diffKeyPaths} be the list of key paths that are different in {before} and {after}.
- If {diffKeyPaths} is a subset of {selectedKeyPaths}:
  - Return {true}.
- Otherwise:
  - Return {false}.

diff_changedOnly_validate(args):

- If the length of {args} is not 3:
  - Report an error.
- If the third element is not a {Selector}:
  - Report an error.
```

---

TITLE: Evaluating Binary Star Operator in GROQ
DESCRIPTION: Defines the evaluation process for the binary star (*) operator in GROQ. It performs multiplication for numeric operands.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/09-operators.md#2025-04-12_snippet_11

LANGUAGE: GROQ
CODE:

```
EvaluateStar(scope):

- Let {leftNode} be the first {Expression}.
- Let {left} be the result of {Evaluate(leftNode, scope)}.
- Let {rightNode} be the last {Expression}.
- Let {right} be the result of {Evaluate(rightNode, scope)}.
- If both {left} and {right} are numbers:
  - Return the multiplication of {left} and {right}.
- Return {null}.
```

---

TITLE: Implementing delta::changedAny Function in GROQ
DESCRIPTION: A variant of diff::changedAny that works on before/after objects in delta mode. Takes a selector as an argument and compares the before and after states.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/11-functions.md#2025-04-12_snippet_4

LANGUAGE: pseudocode
CODE:

```
delta_changedAny(args, scope):

- Let {before} and {after} be the before/after objects of the query context to {scope}.
- Let {selector} by the first element of {args}.
- Let {result} be the result of {diff_changedAny(before, after, selector)}.
- Return {result}.

delta_changedAny_validate(args, scope):

- If the mode of the query context of {scope} is not "delta":
  - Report an error.
- If the first element is not a {Selector}:
  - Report an error.
```

---

TITLE: Implementing string::split() Function in GROQ
DESCRIPTION: Splits a string into multiple strings given a separator string. Takes two arguments: the input string and the separator string.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/11-functions.md#2025-04-12_snippet_11

LANGUAGE: pseudocode
CODE:

```
string_split(args, scope):

- Let {strNode} be the first element of {args}.
- Let {sepNode} be the second element of {args}.
- Let {str} be the result of {Evaluate(strNode, scope)}.
- If {str} is not a string, return {null}.
- Let {sep} be the result of {Evaluate(sepNode, scope)}.
- If {sep} is not a string, return {null}.
- Let {output} be an empty array.
- If {sep} is an empty string:
  - Let {output} be each character of {str}, according to Unicode character splitting rules.
- Otherwise:
  - Let {output} be each substring of {str} as separated by {sep}. An empty string is considered a substring, and will be included when {sep} is present at the beginning, the end, or consecutively of {str}. For example, the string `,a,b,` when split by `,` will result in four substrings `['', 'a', 'b', '']`.
- Return {output}.

string_split_validate(args):

- If the length of {args} is not 2:
  - Report an error.
```

---

TITLE: Implementing delta::changedOnly Function in GROQ
DESCRIPTION: A variant of diff::changedOnly that works on before/after objects in delta mode. Takes a selector as an argument and compares the before and after states.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/11-functions.md#2025-04-12_snippet_5

LANGUAGE: pseudocode
CODE:

```
delta_changedOnly(args, scope):

- Let {before} and {after} be the before/after objects of the query context to {scope}.
- Let {selector} by the first element of {args}.
- Let {result} be the result of {diff_changedOnly(before, after, selector)}.
- Return {result}.

delta_changedOnly_validate(args, scope):

- If the mode of the query context of {scope} is not "delta":
  - Report an error.
- If the first element is not a {Selector}:
  - Report an error.
```

---

TITLE: Implementing geo::latLng() Function for Creating Geo Points
DESCRIPTION: This function creates a GeoJSON Point from latitude and longitude coordinates. It validates that the coordinates are within valid ranges (-90 to 90 for latitude, -180 to 180 for longitude).
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/14-extensions.md#2025-04-12_snippet_6

LANGUAGE: pseudocode
CODE:

```
geo_latLng(args, scope):

- Let {latNode} be the first element of {args}.
- Let {lngNode} be the second element of {args}.
- Let {lat} be the result of {Evaluate(latNode, scope)}.
- Let {lng} be the result of {Evaluate(lngNode, scope)}.
- If {lat} or {lng} is not a number:
  - Return {null}.
- If {lat} is not in the range of -90 to 90:
  - Return {null}.
- If {lng} is not in the range of -180 to 180:
  - Return {null}.
- Otherwise:
  - Return a GeoJSON Point with {lat} and {lng} as coordinates, in lng, lat order.
```

---

TITLE: Traversal Join Evaluation Function in GROQ
DESCRIPTION: Algorithm for evaluating joined traversals in GROQ, which applies traversals sequentially. This is used for operations like '.user.name' where traversals are chained directly.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/03-execution.md#2025-04-12_snippet_4

LANGUAGE: pseudocode
CODE:

```
EvaluateTraversalJoin(base, scope):

- Let {traverse} be the traverse function of the first node.
- Let {nextTraverse} be the traverse function of the last node.
- Let {result} to be the result of {traverse(base, scope)}.
- Set {result} to be the result of {nextTraverse(result, scope)}.
- Return {result}.
```

---

TITLE: Implementing geo::distance() Function for Geographic Distance Calculation
DESCRIPTION: This function calculates the distance in meters between two geo points. It uses an implementation-defined algorithm (such as Haversine formula) to approximate Earth distance as accurately as possible.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/14-extensions.md#2025-04-12_snippet_12

LANGUAGE: pseudocode
CODE:

```
geo_distance(args, scope):

- Let {firstNode} be the first element of {args}.
- Let {secondNode} be the second element of {args}.
- Let {first} be the result of {Evaluate(firstNode, scope)}.
- Let {second} be the result of {Evaluate(secondNode, scope)}.
- If {first} or {second} is a not a geo value:
  - Return {null}.
- If {first} or {second} is a not a Geo Point or GeoJSON Point:
  - Return {null}.
- Let {distance} be the geographic distance between {first} and {second}:
  - Return {distance}.
- Otherwise:
  - Return {null}.
```

---

TITLE: Traversal Map Evaluation Function in GROQ
DESCRIPTION: Algorithm for evaluating mapped traversals in GROQ, which applies a traversal to each element of an array. This is used for operations like '[_type == "user"].id' where the second traversal is applied to each result of the first.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/03-execution.md#2025-04-12_snippet_5

LANGUAGE: pseudocode
CODE:

```
EvaluateTraversalMap(base, scope):

- Let {traverse} be the traverse function of the first node.
- Let {nextTraverse} be the traverse function of the last node.
- Set {base} to be the result of {traverse(base, scope)}.
- If {base} is not an array:
  - Return {null}.
- Let {result} be an empty array.
- For each {value} in {base}:
  - Let {elem} be the result of {nextTraverse(value, scope)}.
  - Append {elem} to {result}.
- Return {result}.
```

---

TITLE: Evaluating Binary Percent Operator in GROQ
DESCRIPTION: Defines the evaluation process for the binary percent (%) operator in GROQ. It calculates the remainder of division for numeric operands.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/09-operators.md#2025-04-12_snippet_13

LANGUAGE: GROQ
CODE:

```
EvaluatePercent(scope):

- Let {leftNode} be the first {Expression}.
- Let {left} be the result of {Evaluate(leftNode, scope)}.
- Let {rightNode} be the last {Expression}.
- Let {right} be the result of {Evaluate(rightNode, scope)}.
- If both {left} and {right} are numbers:
  - Return the remainder of {left} after division by {right}.
- Return {null}.
```

---

TITLE: Traversal FlatMap Evaluation Function in GROQ
DESCRIPTION: Algorithm for evaluating flat-mapped traversals in GROQ, which applies a traversal to each element of an array and flattens the result. Used for operations like '[_type == "user"].names[]' which return flattened arrays.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/03-execution.md#2025-04-12_snippet_6

LANGUAGE: pseudocode
CODE:

```
EvaluateTraversalFlatMap(base, scope):

- Let {traverse} be the traverse function of the first node.
- Let {nextTraverse} be the traverse function of the last node.
- Set {base} to be the result of {traverse(base, scope)}.
- If {base} is not an array:
  - Return {null}.
- Let {result} be an empty array.
- For each {value} in {base}:
  - Let {elem} be the result of {nextTraverse(value, scope)}.
  - If {elem} is an array:
    - Concatenate {elem} to {result}.
- Return {result}.
```

---

TITLE: Implementing pt::text() Function for Portable Text Conversion
DESCRIPTION: This function extracts plain text from Portable Text blocks. When processing multiple blocks, it joins them with double newlines in the output string.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/14-extensions.md#2025-04-12_snippet_2

LANGUAGE: pseudocode
CODE:

```
pt_text(args, scope):

- Let {baseNode} be the first element of {args}.
- Let {base} be the result of {Evaluate(baseNode, scope)}.
- If {base} is an object:
  - Try to parse it as Portable Text Block:
  - If {base }is a valid Portable Text Block:
    - Return string version of text in {base}.
- If {base} is an array of objects:
  - Try to parse it as an array of Portable Text blocks:
  - If all elements in {base} array are valid Portable Text blocks:
    - Return string version of text in {base}.
- Otherwise:
  - Return {null}.
```

---

TITLE: Evaluating Object in GROQ
DESCRIPTION: This function evaluates an object expression in GROQ, handling spread operators, nested expressions, and attribute naming.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/04-data-types.md#2025-04-12_snippet_1

LANGUAGE: groq
CODE:

```
EvaluateObject(scope):

- Let {result} be a new empty object.
- For each {ObjectAttribute}:
  - If the {ObjectAttribute} contains `...`:
    - If the {ObjectAttribute} contains an {Expression}:
      - Let {baseNode} be the {Expression}.
    - Let {base} be the result of {Evaluate(baseNode, scope)}.
    - Otherwise:
      - Let {base} be the this value of {scope}.
    - For each {name} and {value} of {base}:
      - Set the attribute {name} to {value} in {result}.
  - Otherwise:
    - Let {valueNode} be the {Expression} of the {ObjectAttribute}.
    - Let {value} be the result of {Evaluate(valueNode, scope)}.
    - If the {ObjectAttribute} contains a {String}:
      - Let {name} be the string value of the {String}.
    - Otherwise:
      - Let {name} be the result of {DetermineName(valueNode)}.
    - Set the attribute {name} to {value} in {result}.
- Return {result}.
```

---

TITLE: Evaluating Array in GROQ
DESCRIPTION: This function evaluates an array expression in GROQ, handling spread operators and nested expressions.
SOURCE: https://github.com/sanity-io/GROQ/blob/main/spec/04-data-types.md#2025-04-12_snippet_0

LANGUAGE: groq
CODE:

```
EvaluateArray(scope):

1. Let {result} be a new empty array.
2. For each {ArrayElement}:
3. Let {elementNode} be the {Expression} of the {ArrayElement}.
4. Let {element} be the result of {Evaluate(elementNode, scope)}.
5. If the {ArrayElement} contains {...}:
   1. If {element} is an array:
      1. Concatenate {element} to {result}.
6. Otherwise:
   1. Append {element} to {result}.
7. Return {result}.
```
