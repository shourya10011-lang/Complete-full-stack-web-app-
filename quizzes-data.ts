export interface QuizQuestion {
  id: number;
  question: string;
  category: string;
  options: string[];
  correct: number;
  explanation: string;
  source: string;
  source_url: string;
}

export interface CourseQuiz {
  course_id: number;
  lesson_id: number;
  title: string;
  category: string;
  duration_minutes: number;
  timer_seconds: number;
  pass_percentage: number;
  subtitle: string;
  instructions: string;
  questions: QuizQuestion[];
}

export const quizzesData: CourseQuiz[] = [
  // Course 1: Full-Stack Web Development
  {
    course_id: 1,
    lesson_id: 7,
    title: "Full-Stack Web Development Architecture Examination",
    category: "Web Development",
    duration_minutes: 20,
    timer_seconds: 1200,
    pass_percentage: 70,
    subtitle: "Standardized 20-Minute Technical Assessment covering HTML5, CSS Grid, ES2024, React & REST APIs",
    instructions: "You have exactly 20 minutes to complete this 7-question certification assessment. Questions are sourced from official W3C, MDN Web Docs, and RFC HTTP specifications. A passing score of 70% or higher is required.",
    questions: [
      {
        id: 101,
        category: "HTTP Protocols & REST",
        question: "In the HTTP/1.1 and HTTP/2 protocol specifications (RFC 7231 & RFC 9110), what is the key semantic difference between the PUT and PATCH request methods?",
        options: [
          "PUT replaces the entire target resource representation; PATCH applies partial modifications to an existing resource.",
          "PUT is non-idempotent; PATCH is strictly guaranteed to be idempotent.",
          "PUT can only transmit JSON payloads, whereas PATCH exclusively handles form-urlencoded data.",
          "PUT creates resources only if they don't exist; PATCH deletes and recreates the resource."
        ],
        correct: 0,
        explanation: "RFC 7231 §4.3.4 explicitly defines PUT as creating or replacing the state of the target resource with the request payload. In contrast, RFC 5789 specifies PATCH for applying delta/partial modifications. PUT is strictly idempotent (multiple identical requests yield the same state), whereas PATCH is not required to be idempotent.",
        source: "MDN Web Docs - HTTP Request Methods & RFC 9110 / RFC 5789 Standards",
        source_url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods"
      },
      {
        id: 102,
        category: "Semantic HTML5 Architecture",
        question: "According to the W3C HTML5 Specification, which landmark element is intended to encapsulate content that is tangentially related to the content around it (such as sidebars, pull quotes, or related reference links)?",
        options: [
          "<section>",
          "<aside>",
          "<article>",
          "<figure>"
        ],
        correct: 1,
        explanation: "The W3C HTML5 specification defines <aside> as representing a portion of a document whose content is only tangentially related to the content surrounding the aside element. Screen readers and assistive tools expose <aside> as a complementary landmark region.",
        source: "W3C HTML 5.3 Recommendation §4.4.5 & MDN HTML Elements Reference",
        source_url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside"
      },
      {
        id: 103,
        category: "CSS Grid & Flexbox",
        question: "In the W3C CSS Grid Layout Module Level 1, which characteristic fundamentally distinguishes CSS Grid from Flexbox?",
        options: [
          "Flexbox is two-dimensional (handling columns and rows simultaneously), while CSS Grid is strictly one-dimensional.",
          "CSS Grid is two-dimensional (handling columns and rows simultaneously), while Flexbox is one-dimensional (content-out flow along an axis).",
          "CSS Grid does not support fractional (fr) units.",
          "Flexbox requires container queries; Grid only works with media queries."
        ],
        correct: 1,
        explanation: "CSS Grid is a two-dimensional layout system designed for grid-template-columns and grid-template-rows simultaneously. Flexbox is fundamentally a one-dimensional layout system optimized for distributing items along a single axis (row or column).",
        source: "W3C CSS Grid Layout Module Level 1 & MDN Relationship of Grid to Other Layout Methods",
        source_url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout"
      },
      {
        id: 104,
        category: "JavaScript Runtime & Event Loop",
        question: "In modern ECMAScript engines (V8 / SpiderMonkey), when both a Microtask (e.g., Promise.then callback) and a Macrotask (e.g., setTimeout callback) are queued, how does the Event Loop prioritize execution?",
        options: [
          "The Macrotask queue is drained first before any Microtask is evaluated.",
          "The Microtask queue is completely drained immediately after the current synchronous script execution, before any pending Macrotask is picked up.",
          "Microtasks and Macrotasks alternate execution on an interleaved 1-to-1 basis.",
          "Tasks are executed randomly based on CPU scheduler threads."
        ],
        correct: 1,
        explanation: "The WHATWG HTML Event Loop specification §8.1.6 dictates that upon finishing the current task, the microtask checkpoint runs, draining the entire microtask queue before the event loop advances to the next task in the task (macrotask) queue.",
        source: "WHATWG HTML Standard §8.1.6 Event Loops & MDN Microtasks Guide",
        source_url: "https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide"
      },
      {
        id: 105,
        category: "Web Security & CORS",
        question: "When sending an HTTP request via the Fetch API across origins, what condition triggers the browser to automatically dispatch an HTTP OPTIONS preflight request?",
        options: [
          "Any standard GET request containing query parameters.",
          "Sending custom request headers (such as 'Authorization: Bearer ...') or using a Content-Type other than application/x-www-form-urlencoded, multipart/form-data, or text/plain.",
          "Any request whose response body exceeds 64 kilobytes.",
          "Only requests made over unencrypted HTTP connections."
        ],
        correct: 1,
        explanation: "Under the W3C / WHATWG Fetch CORS specification, a request triggers a preflight OPTIONS check if it uses HTTP methods other than GET, HEAD, or POST, or if it includes non-CORS-safelisted request headers (e.g. Authorization) or non-simple Content-Types like application/json.",
        source: "MDN Web Docs - Cross-Origin Resource Sharing (CORS) Preflight",
        source_url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS"
      },
      {
        id: 106,
        category: "React 18 Architecture",
        question: "In React 18, why is direct in-place mutation of state (e.g., state.items.push(item)) considered a critical anti-pattern?",
        options: [
          "It triggers a JavaScript runtime syntax error.",
          "React relies on shallow reference equality checks (Object.is) between previous and next state to trigger reconciliation and DOM re-renders.",
          "Direct mutation disables the React synthetic event system.",
          "Direct mutation converts all component state into session storage cookies."
        ],
        correct: 1,
        explanation: "React compares the next state with the current state via Object.is. Mutating an array or object in place retains the identical memory address reference, causing React to treat the state as unchanged and skip scheduled re-renders.",
        source: "React 18 Official Documentation - Updating Objects and Arrays in State",
        source_url: "https://react.dev/learn/updating-objects-in-state"
      },
      {
        id: 107,
        category: "Node.js & Express Middleware",
        question: "In an Express.js backend pipeline, what happens if a custom middleware function neither calls res.send() / res.json() nor invokes the next() callback?",
        options: [
          "Express automatically falls back to a 200 OK status code after 50 milliseconds.",
          "The client HTTP connection hangs indefinitely until a client, reverse proxy, or browser socket timeout occurs.",
          "Node.js throws an unhandled Promise rejection and restarts the process.",
          "The next route handler in the application runs immediately."
        ],
        correct: 1,
        explanation: "Express middleware functions execute sequentially. If a middleware does not terminate the request-response cycle or pass control to subsequent handlers via next(), the socket connection stays open and the client request hangs.",
        source: "Express.js Official Guide - Using and Writing Middleware",
        source_url: "https://expressjs.com/en/guide/writing-middleware.html"
      }
    ]
  },

  // Course 2: Python Data Science & ML
  {
    course_id: 2,
    lesson_id: 13,
    title: "Python Data Science & Applied Machine Learning Examination",
    category: "Data Science",
    duration_minutes: 20,
    timer_seconds: 1200,
    pass_percentage: 70,
    subtitle: "Standardized 20-Minute Technical Assessment covering NumPy, Pandas, Scikit-Learn & Statistical Modeling",
    instructions: "You have 20 minutes to solve these 6 data science problems. Sourced from official NumPy, Pandas, and Scikit-Learn documentation. Passing threshold: 70%.",
    questions: [
      {
        id: 201,
        category: "NumPy Vectorization",
        question: "According to official NumPy broadcasting rules, when can two arrays with shapes (5, 1, 4) and (3, 4) be operated on together without copying data in memory?",
        options: [
          "They cannot broadcast because they have different dimensionalities.",
          "They can broadcast because starting from the trailing dimensions, each dimension pair is either equal or one of them is 1.",
          "Broadcasting is only permitted if both arrays are 2-dimensional.",
          "Broadcasting requires an explicit .reshape() call before any arithmetic."
        ],
        correct: 1,
        explanation: "NumPy broadcasting compares trailing dimensions backwards. Dimension 0 matches: 4 == 4. Dimension 1: 1 and 3 (compatible since one is 1). Dimension 2: 5 and prepended 1 (compatible). The resulting broadcast shape is (5, 3, 4).",
        source: "NumPy Official Documentation - Array Broadcasting Rules",
        source_url: "https://numpy.org/doc/stable/user/basics.broadcasting.html"
      },
      {
        id: 202,
        category: "Pandas Data Wrangling",
        question: "In Pandas, what is the precise semantic distinction between DataFrame.loc and DataFrame.iloc?",
        options: [
          "loc is label-based and includes the endpoint; iloc is integer position-based (0 to length-1) and excludes the stop endpoint.",
          "loc operates on columns only, while iloc operates on rows only.",
          "loc is strictly for string columns, while iloc is for numeric data.",
          "There is no difference; iloc is a deprecated alias for loc."
        ],
        correct: 0,
        explanation: "Pandas loc indexes primarily by index and column labels (inclusive of both boundaries in slices). iloc indexes strictly by 0-based integer positions, matching standard Python slicing rules where the stop index is excluded.",
        source: "Pandas API Reference - pandas.DataFrame.loc vs iloc",
        source_url: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.loc.html"
      },
      {
        id: 203,
        category: "Machine Learning Foundations",
        question: "In statistical learning and Scikit-Learn model evaluation, how is the 'Bias-Variance Tradeoff' formulated?",
        options: [
          "Bias corresponds to GPU memory usage; variance corresponds to CPU thread contention.",
          "High bias causes underfitting due to oversimplified assumptions; high variance causes overfitting by modeling noise in the training set.",
          "High bias only occurs in unsupervised clustering algorithms.",
          "Variance measures the class imbalance ratio in target labels."
        ],
        correct: 1,
        explanation: "Bias error measures how far the average model predictions deviate from ground truth (underfitting). Variance error measures how sensitive predictions are to training data fluctuations (overfitting). Optimal model tuning minimizes total expected generalization error.",
        source: "Scikit-Learn Documentation - Model Evaluation & Generalization Error",
        source_url: "https://scikit-learn.org/stable/modules/learning_curve.html"
      },
      {
        id: 204,
        category: "Model Evaluation Metrics",
        question: "When evaluating a binary fraud detection model where only 0.5% of transactions are fraudulent, why is classification accuracy an unreliable metric?",
        options: [
          "Accuracy cannot be calculated when datasets have less than 1,000 samples.",
          "A naive dummy classifier that always predicts 'not fraud' achieves 99.5% accuracy while failing to detect a single actual fraud instance.",
          "Scikit-learn raises an exception if accuracy is applied to binary classification.",
          "Accuracy is only mathematical for continuous regression problems."
        ],
        correct: 1,
        explanation: "On heavily skewed classes, the accuracy paradox means high accuracy masks complete failure on the minority class. Precision, Recall, F1-score, and Precision-Recall AUC must be used instead.",
        source: "Google Machine Learning Crash Course - Classification: Accuracy & Imbalanced Data",
        source_url: "https://developers.google.com/machine-learning/crash-course/classification/accuracy"
      },
      {
        id: 205,
        category: "Python Language Foundations",
        question: "In Python function design (PEP 484 & Data Model), what do *args and **kwargs parameter signatures accomplish?",
        options: [
          "They enable asynchronous threading across multiple CPU cores.",
          "*args collects an arbitrary sequence of positional arguments into a tuple; **kwargs collects arbitrary keyword arguments into a dictionary.",
          "They restrict the function to accept only string and integer primitive types.",
          "They define C-style memory pointers."
        ],
        correct: 1,
        explanation: "The single asterisk * operator packs surplus positional arguments into a tuple named args, while the double asterisk ** operator packs surplus keyword arguments into a dictionary named kwargs.",
        source: "Python Software Foundation Docs - The Python Tutorial §4.8 Function Arguments",
        source_url: "https://docs.python.org/3/tutorial/controlflow.html#more-on-defining-functions"
      },
      {
        id: 206,
        category: "Scikit-Learn Preprocessing",
        question: "Which Scikit-Learn transformer standardizes numeric features by removing the mean and scaling to unit variance (z-score normalization)?",
        options: [
          "OneHotEncoder",
          "StandardScaler",
          "LabelEncoder",
          "Normalizer"
        ],
        correct: 1,
        explanation: "StandardScaler computes the sample mean and standard deviation on training data during fit(), and computes z = (x - u) / s during transform(). This ensures zero mean and variance of 1.",
        source: "Scikit-Learn Documentation - sklearn.preprocessing.StandardScaler",
        source_url: "https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html"
      }
    ]
  },

  // Course 3: UI/UX Design Systems
  {
    course_id: 3,
    lesson_id: 19,
    title: "UI/UX Design Systems & Accessibility Examination",
    category: "UI/UX Design",
    duration_minutes: 20,
    timer_seconds: 1200,
    pass_percentage: 70,
    subtitle: "Standardized 20-Minute Professional Assessment covering WCAG 2.1 AA, Design Tokens, Fitts's Law & Interaction Design",
    instructions: "You have 20 minutes to complete this 6-question design and accessibility examination. Sourced from W3C WCAG 2.1, Apple HIG, Google Material Design 3, and Nielsen Norman Group standards.",
    questions: [
      {
        id: 301,
        category: "Accessibility & WCAG 2.1",
        question: "According to the W3C Web Content Accessibility Guidelines (WCAG) 2.1 Success Criterion 1.4.3 (Level AA), what is the minimum contrast ratio required for regular body text (< 18pt or < 14pt bold)?",
        options: [
          "3.0 : 1",
          "4.5 : 1",
          "7.0 : 1",
          "10.0 : 1"
        ],
        correct: 1,
        explanation: "WCAG 2.1 Level AA Criterion 1.4.3 mandates a minimum contrast ratio of 4.5:1 for standard text. For large text (at least 18pt or 14pt bold), the minimum ratio is 3.0:1.",
        source: "W3C WCAG 2.1 Guideline 1.4.3 Contrast (Minimum)",
        source_url: "https://www.w3.org/WAI/WCAG21/quickref/#contrast-minimum"
      },
      {
        id: 302,
        category: "Interaction Design & HCI",
        question: "What does Fitts's Law state regarding user interaction with screen targets (such as buttons and menu items)?",
        options: [
          "Users scan web pages in an F-shaped eye-tracking pattern.",
          "The time required to rapidly move to a target is a function of the distance to the target divided by the width of the target.",
          "Interface complexity should be reduced by hiding 80% of features behind dropdowns.",
          "Short-term working memory can hold only 7 plus or minus 2 items."
        ],
        correct: 1,
        explanation: "Fitts's Law is an established human-computer interaction model: larger targets positioned closer to the user's cursor or thumb reach zone are acquired significantly faster and with fewer pointing errors.",
        source: "Nielsen Norman Group (NN/g) - Fitts's Law in UI/UX Design",
        source_url: "https://www.nngroup.com/articles/fittss-law/"
      },
      {
        id: 303,
        category: "Design Token Architecture",
        question: "In modern tokenized design systems (W3C Design Tokens Community Group), what is the primary purpose of 'Semantic / Alias Tokens'?",
        options: [
          "To hardcode arbitrary RGB colors directly inside individual CSS component rules.",
          "To map primitive values (e.g. blue-600) to contextual design roles (e.g. color-action-primary, surface-card-background), enabling seamless theme switches.",
          "To replace vector SVG icons with bitmap PNG images.",
          "To minify JavaScript bundles during production compilation."
        ],
        correct: 1,
        explanation: "Semantic tokens create an abstraction layer between raw palettes (blue-600) and functional roles (color-action-primary). This enables dark mode, high-contrast themes, and multi-brand design systems to swap palettes without modifying component code.",
        source: "W3C Design Tokens Community Group Specification",
        source_url: "https://design-tokens.github.io/community-group/format/"
      },
      {
        id: 304,
        category: "Visual Hierarchy & Radius Math",
        question: "When styling nested rounded containers (e.g., a card with padding containing a rounded inner element), what mathematical optical rule prevents visual distortion?",
        options: [
          "Inner Corner Radius = Outer Corner Radius + Container Padding",
          "Inner Corner Radius = Outer Corner Radius - Container Padding (if greater than zero)",
          "Both inner and outer elements must always use 50% border radius.",
          "Inner radius must equal exactly twice the outer radius."
        ],
        correct: 1,
        explanation: "To preserve concentric circular curves and eliminate awkward gaps, the inner radius must mathematically equal the outer radius minus the distance (padding) between them.",
        source: "Refactoring UI (Wathan & Schoger) & Modern CSS Geometry",
        source_url: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius"
      },
      {
        id: 305,
        category: "Touch Target Usability",
        question: "What are the minimum recommended touch target dimensions for mobile interface controls according to Apple Human Interface Guidelines and Google Material Design?",
        options: [
          "24 x 24 points/dp",
          "44 x 44 points (Apple) / 48 x 48 dp (Google Material)",
          "80 x 80 points/dp",
          "16 x 16 points/dp"
        ],
        correct: 1,
        explanation: "Apple HIG specifies a minimum touch target size of 44x44 pt, and Google Material Design 3 specifies 48x48 dp. This accounts for human finger pad variance and prevents accidental mis-taps.",
        source: "Apple Human Interface Guidelines & Google Material Design 3 Accessibility Standards",
        source_url: "https://developer.apple.com/design/human-interface-guidelines/"
      },
      {
        id: 306,
        category: "Usability Heuristics",
        question: "According to Jakob Nielsen's 'Visibility of System Status' heuristic, how should a well-designed application respond to user actions?",
        options: [
          "Always keep users informed about what is going on through appropriate feedback within reasonable time (e.g., loading spinners, progress bars, active states).",
          "Hide all background operations so the user is never aware of network communication.",
          "Only report errors; never display confirmations for successful operations.",
          "Prompt the user with confirmation dialogs before every single mouse click."
        ],
        correct: 0,
        explanation: "Nielsen's 1st Usability Heuristic emphasizes immediate, clear feedback. When users know current system status, they learn outcomes of their interactions and feel in control.",
        source: "Nielsen Norman Group (NN/g) - 10 Usability Heuristics for User Interface Design",
        source_url: "https://www.nngroup.com/articles/ten-usability-heuristics/"
      }
    ]
  },

  // Course 4: Advanced SQL & Database Architecture
  {
    course_id: 4,
    lesson_id: 25,
    title: "Advanced SQL & Database Architecture Examination",
    category: "Database Architecture",
    duration_minutes: 20,
    timer_seconds: 1200,
    pass_percentage: 70,
    subtitle: "Standardized 20-Minute Technical Assessment covering B-Trees, ACID Isolation, Joins, Indexing & EXPLAIN Plans",
    instructions: "You have 20 minutes to solve these 6 database engineering questions. Sourced from PostgreSQL 16 documentation, MySQL InnoDB internals, and ANSI SQL standards.",
    questions: [
      {
        id: 401,
        category: "ACID Isolation Levels",
        question: "Under ANSI/ISO SQL-92 transaction isolation levels, what is the precise definition of a 'Dirty Read'?",
        options: [
          "A transaction re-reading rows and discovering that another committed transaction updated those rows.",
          "A transaction reading data modifications written by another concurrent transaction that has NOT yet been committed.",
          "A query reading data from a damaged hard drive sector.",
          "A transaction reading rows that match a search condition, then re-reading to discover new phantom rows inserted by a committed transaction."
        ],
        correct: 1,
        explanation: "A Dirty Read occurs when Transaction A modifies a row without committing, and Transaction B reads that uncommitted row. If Transaction A subsequently rolls back, Transaction B has operated on invalid data that never technically existed.",
        source: "PostgreSQL 16 Documentation §13.2 - Transaction Isolation & ANSI SQL-92",
        source_url: "https://www.postgresql.org/docs/current/transaction-iso.html"
      },
      {
        id: 402,
        category: "B-Tree Index Internals",
        question: "How does a B-Tree index accelerate single-row lookups and range scans compared to a sequential table scan?",
        options: [
          "By caching the entire dataset in CPU L1 register memory.",
          "By maintaining a self-balancing tree of sorted keys across pages, enabling logarithmic O(log N) branch traversals to leaf pointers.",
          "By computing a single MD5 cryptographic checksum on every column.",
          "By rewriting SQL queries into procedural stored procedures."
        ],
        correct: 1,
        explanation: "B-Trees keep keys sorted across balanced root, branch, and leaf nodes. Searching for a key requires traversing down the tree depth (typically 3-4 page reads for millions of records), cutting disk I/O from O(N) to O(log N).",
        source: "MySQL 8.0 Reference Manual - How InnoDB B-Tree Indexes Work & Use The Index Luke",
        source_url: "https://dev.mysql.com/doc/refman/8.0/en/innodb-index-types.html"
      },
      {
        id: 403,
        category: "SQL Logical Processing",
        question: "In the logical execution order of an ANSI SQL SELECT query, what is the key difference between WHERE and HAVING clauses?",
        options: [
          "WHERE filters individual rows before GROUP BY aggregation; HAVING filters aggregated groups after GROUP BY.",
          "WHERE can use aggregate functions like COUNT(), but HAVING cannot.",
          "HAVING executes before FROM, while WHERE executes at the very end.",
          "There is no difference; HAVING is an alias for WHERE."
        ],
        correct: 0,
        explanation: "Logical query processing executes in the order: FROM -> JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY -> LIMIT. WHERE filters rows before aggregation; HAVING filters groups after aggregation.",
        source: "PostgreSQL Documentation - Logical Query Processing & Microsoft SQL Server Docs",
        source_url: "https://www.postgresql.org/docs/current/queries-table-expressions.html"
      },
      {
        id: 404,
        category: "Index Optimization",
        question: "What is a 'Covering Index' (Index-Only Scan) in database query optimization?",
        options: [
          "An index that automatically indexes all tables in the entire database schema.",
          "An index that contains every column requested by a query (in SELECT, WHERE, JOIN), allowing the storage engine to fulfill the query exclusively from the index tree without accessing table heap pages.",
          "An encrypted index backup file stored in cold storage.",
          "An index that only applies to Primary Key UUID columns."
        ],
        correct: 1,
        explanation: "When an index contains all referenced columns, the database performs an Index-Only Scan. This completely bypasses table heap data blocks, eliminating random disk I/O and boosting throughput significantly.",
        source: "Use The Index, Luke! - Index-Only Scan & Covering Indexes",
        source_url: "https://use-the-index-luke.com/sql/clustering/index-only-scan"
      },
      {
        id: 405,
        category: "Database Normalization",
        question: "In relational schema design, what condition must be met for a relation to be in Third Normal Form (3NF)?",
        options: [
          "The table must be in 2NF, and no non-prime attribute may be transitively dependent on any candidate key.",
          "The table must have exactly three foreign keys.",
          "Every column must store unstructured JSON blobs.",
          "The table must not contain any numerical values."
        ],
        correct: 0,
        explanation: "3NF builds on 2NF by removing transitive functional dependencies (where non-key attribute A determines non-key attribute B, which determines non-key attribute C). 'Every non-key attribute must depend on the key, the whole key, and nothing but the key.'",
        source: "Database System Concepts (Silberschatz, Korth, Sudarshan) & Codd's Relational Model",
        source_url: "https://en.wikipedia.org/wiki/Third_normal_form"
      },
      {
        id: 406,
        category: "OLTP Write Overhead",
        question: "Why is over-indexing a heavily written OLTP table considered detrimental to database performance?",
        options: [
          "Indexes delete data if tables exceed 100,000 rows.",
          "Every INSERT, UPDATE, and DELETE statement must synchronously update and rebalance all associated index trees, multiplying disk write I/O and write-ahead log (WAL) overhead.",
          "Over-indexing prevents SQL connections from using connection pooling.",
          "It forces the database to switch to single-threaded CPU processing."
        ],
        correct: 1,
        explanation: "While indexes accelerate reads, every write operation must modify the heap table AND every corresponding index tree (plus generate WAL records). High-write tables suffer severe write amplification when burdened with unnecessary indexes.",
        source: "High Performance MySQL (O'Reilly) & PostgreSQL Performance Tuning Guide",
        source_url: "https://www.postgresql.org/docs/current/performance-tips.html"
      }
    ]
  },

  // Course 5: Modern JavaScript & TypeScript Architecture
  {
    course_id: 5,
    lesson_id: 30,
    title: "Modern JavaScript & TypeScript Architecture Examination",
    category: "TypeScript Architecture",
    duration_minutes: 20,
    timer_seconds: 1200,
    pass_percentage: 70,
    subtitle: "Standardized 20-Minute Technical Assessment covering Generics, Closures, Event Loop & Type Systems",
    instructions: "You have 20 minutes to answer these 6 advanced JavaScript and TypeScript architectural questions. Sourced from the official TypeScript Handbook and MDN Web Docs.",
    questions: [
      {
        id: 501,
        category: "TypeScript Interface vs Type",
        question: "In TypeScript, what is the behavior of 'Declaration Merging' when multiple declarations share the same identifier?",
        options: [
          "Interfaces with identical names in the same scope automatically merge their properties into a single interface definition; type aliases will produce a duplicate identifier compiler error.",
          "Type aliases support declaration merging, while interfaces throw an error.",
          "Neither interfaces nor type aliases support declaration merging.",
          "Declaration merging only occurs when compiling in non-strict mode."
        ],
        correct: 0,
        explanation: "TypeScript interfaces are 'open' and automatically merge declarations with identical names. Type aliases are 'closed' and cannot be re-opened or declared multiple times within the same lexical scope.",
        source: "TypeScript Handbook - Declaration Merging & Types vs Interfaces",
        source_url: "https://www.typescriptlang.org/docs/handbook/declaration-merging.html"
      },
      {
        id: 502,
        category: "JavaScript Closures & Lexical Scope",
        question: "What is logged to the console when executing:\nfor (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); }?",
        options: [
          "0, 1, 2",
          "3, 3, 3",
          "undefined, undefined, undefined",
          "An uncaught TypeError: i is not defined"
        ],
        correct: 1,
        explanation: "Variables declared with var are function-scoped, not block-scoped. All three setTimeout callbacks share the exact same variable i. By the time the event loop executes the callbacks from the macrotask queue, the synchronous loop has finished with i = 3. Using let would create a new lexical binding for each iteration, outputting 0, 1, 2.",
        source: "MDN Web Docs - Closures & JavaScript Scoping",
        source_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures"
      },
      {
        id: 503,
        category: "TypeScript Utility Types",
        question: "How does the built-in TypeScript utility type Readonly<T> handle nested object properties?",
        options: [
          "It recursively traverses all nested objects and arrays, freezing the entire object tree.",
          "It only marks the top-level properties of T as readonly; nested object properties remain mutable unless DeepReadonly is explicitly implemented.",
          "It converts all properties into getter functions at runtime.",
          "It deletes any property that is not a primitive string or number."
        ],
        correct: 1,
        explanation: "Readonly<T> is a shallow mapped type: { readonly [P in keyof T]: T[P] }. It does not recurse into nested object properties. Modifying nested properties (e.g. user.address.street = 'New St') is permitted by TypeScript unless deep recursion is applied.",
        source: "TypeScript Handbook - Utility Types: Readonly<Type>",
        source_url: "https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype"
      },
      {
        id: 504,
        category: "Asynchronous Error Handling",
        question: "In modern Node.js and browser runtimes, what happens when a Promise rejects and has no .catch() handler or awaiting try/catch block?",
        options: [
          "The rejection is silently swallowed without any notification or logging.",
          "An unhandledrejection event is dispatched on the global object, and modern Node.js terminates the process with a non-zero exit status code.",
          "The Promise automatically retries 3 times before failing.",
          "The JavaScript engine switches from V8 to asm.js."
        ],
        correct: 1,
        explanation: "Node.js (since v15+) treats unhandled promise rejections by raising an unhandledrejection event and immediately terminating the process with a non-zero code to prevent running with corrupt state.",
        source: "Node.js Documentation - Process: unhandledRejection & MDN Window: unhandledrejection event",
        source_url: "https://nodejs.org/api/process.html#event-unhandledrejection"
      },
      {
        id: 505,
        category: "TypeScript Keyof & Generics",
        question: "In TypeScript generics, what does the keyof operator produce when applied to a type?",
        options: [
          "A runtime JavaScript array of strings containing the keys.",
          "A compile-time union type of all known public property names (string, number, or symbol) of that type.",
          "A boolean value indicating whether the object has enumerable properties.",
          "An instance of the JavaScript Object.keys() method."
        ],
        correct: 1,
        explanation: "The keyof operator takes an object type and produces a string or numeric literal union of its keys. For example, for type Point = { x: number; y: number }, keyof Point is 'x' | 'y'.",
        source: "TypeScript Handbook - The keyof Type Operator",
        source_url: "https://www.typescriptlang.org/docs/handbook/2/keyof-types.html"
      },
      {
        id: 506,
        category: "Prototype Chain & Inheritance",
        question: "When JavaScript attempts to read a property on an object (obj.property), how does the engine resolve the property value?",
        options: [
          "It searches the object's own properties; if not found, it checks obj.[[Prototype]], continuing up the prototype chain until found or until reaching null.",
          "It queries global window properties first before checking the object itself.",
          "It recompiles the object into a binary Hash Map.",
          "It returns undefined immediately if the property is not directly defined on the instance."
        ],
        correct: 0,
        explanation: "JavaScript inheritance is prototypal. When property lookup fails on the instance itself, the engine traverses the hidden [[Prototype]] chain (accessible via Object.getPrototypeOf) until the property is located or the chain terminates at Object.prototype.[[Prototype]] === null.",
        source: "MDN Web Docs - Inheritance and the prototype chain",
        source_url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain"
      }
    ]
  },

  // Course 6: Product Growth, Analytics & Venture Strategy
  {
    course_id: 6,
    lesson_id: 35,
    title: "Product Growth & Venture Strategy Examination",
    category: "Product Growth",
    duration_minutes: 20,
    timer_seconds: 1200,
    pass_percentage: 70,
    subtitle: "Standardized 20-Minute Professional Assessment covering SaaS Unit Economics, Cohort Retention, LTV:CAC & Viral Loops",
    instructions: "You have 20 minutes to complete this 5-question growth strategy examination. Sourced from Bessemer Venture Partners, Reforge, and Andreessen Horowitz SaaS benchmarks.",
    questions: [
      {
        id: 601,
        category: "SaaS Unit Economics",
        question: "In B2B and consumer SaaS economics, what does a Customer Lifetime Value to Customer Acquisition Cost (LTV:CAC) ratio of 3:1 indicate?",
        options: [
          "The company is losing money on every customer and is on the verge of bankruptcy.",
          "A healthy, capital-efficient, venture-scalable business where gross profit generated comfortably exceeds acquisition expense with room for growth reinvestment.",
          "Customer acquisition costs are 3x higher than lifetime gross margin.",
          "Customers churn within 3 months of initial signup."
        ],
        correct: 1,
        explanation: "A 3:1 to 4:1 LTV:CAC ratio is the established venture gold standard for SaaS. Less than 1:1 indicates an unsustainable business; greater than 5:1 frequently indicates the company is under-investing in customer acquisition.",
        source: "Bessemer Venture Partners (BVP) - SaaS Metrics Benchmarks & Lenny's Newsletter",
        source_url: "https://www.bvp.com/atlas/scaling-to-100-million/"
      },
      {
        id: 602,
        category: "Cohort Retention Analysis",
        question: "When plotting monthly active user retention curves across successive user cohorts, what visual characteristic proves that Product-Market Fit (PMF) exists?",
        options: [
          "The curve continues to decay downward until it touches the x-axis at 0%.",
          "The curve flattens horizontally and stays parallel to the x-axis for cohorts over time, indicating a predictable baseline of retained users.",
          "The retention line spikes vertically into infinity.",
          "The retention curve forms an inverted U-shape."
        ],
        correct: 1,
        explanation: "As documented by Brian Balfour and Casey Winters (Reforge), a retention curve that flattens asymptotically demonstrates that a core group of users consistently derive continuous value, proving Product-Market Fit.",
        source: "Reforge Growth Series - Retention Is The King of Growth Metrics",
        source_url: "https://www.reforge.com/blog/retention-engagement"
      },
      {
        id: 603,
        category: "Viral Loops & K-Factor",
        question: "What is the formula for the Viral Coefficient (K-factor), and what threshold represents self-sustaining viral growth?",
        options: [
          "K = (Invites sent per user) × (Conversion rate of invite), and K > 1 represents exponential self-sustaining viral expansion.",
          "K = Revenue / Marketing Budget, and K > 0 represents viral growth.",
          "K = Churn Rate × 100, and K < 5 represents virality.",
          "K = Total Monthly Website Visitors / Bounce Rate, and K > 10 represents virality."
        ],
        correct: 0,
        explanation: "K = i * c, where i is number of invites sent per user and c is conversion rate. When K > 1, each cohort generates a subsequent cohort larger than itself, fueling organic viral growth without paid ad spending.",
        source: "Andrew Chen (Andreessen Horowitz) - What's your viral loop? & The K-Factor Formula",
        source_url: "https://andrewchen.com/what-is-your-viral-loop-understanding-the-viral-coefficient/"
      },
      {
        id: 604,
        category: "Net Revenue Retention",
        question: "What is Net Revenue Retention (NRR) and why do enterprise SaaS investors prize an NRR greater than 120%?",
        options: [
          "NRR measures the percentage of taxes paid to federal governments.",
          "NRR measures recurring revenue retained from existing customers over a year (including account expansion/upsells minus churn); >120% means revenue grows 20%+ annually even without acquiring any new customers.",
          "NRR calculates employee retention across sales and marketing teams.",
          "NRR counts customer support ticket resolution rates."
        ],
        correct: 1,
        explanation: "NRR = (Beginning ARR + Expansions - Contractions - Churn) / Beginning ARR. An NRR of 120%+ proves strong expansion revenue from existing customers that overcompensates for churn, creating a compounding growth engine.",
        source: "Bessemer Cloud Index & Harvard Business School SaaS Case Studies",
        source_url: "https://www.bvp.com/bvp-nasdaq-emerging-cloud-index"
      },
      {
        id: 605,
        category: "Payback Period",
        question: "How is the Customer Acquisition Cost (CAC) Payback Period calculated in SaaS unit economics?",
        options: [
          "Payback Period (Months) = CAC / (Monthly Average Revenue Per User × Gross Margin %)",
          "Payback Period = Total Employees / Total Customers",
          "Payback Period = Annual Revenue × 12",
          "Payback Period = Cash in Bank / Server Hosting Costs"
        ],
        correct: 0,
        explanation: "CAC Payback Period measures the months of gross margin required to recoup the upfront sales and marketing costs spent acquiring a customer. Target payback for healthy venture-backed SaaS is typically under 12 to 14 months.",
        source: "David Skok (Matrix Partners) - SaaS Metrics 2.0 (For Entrepreneurs)",
        source_url: "https://www.forentrepreneurs.com/saas-metrics-2/"
      }
    ]
  },

  // Course 7: English Fluency & Spoken Communication
  {
    course_id: 7,
    lesson_id: 41,
    title: "English Grammar, Fluency & Cambridge B2/C1 Assessment",
    category: "English Communication",
    duration_minutes: 20,
    timer_seconds: 1200,
    pass_percentage: 70,
    subtitle: "Standardized 20-Minute Examination covering Cambridge B2 First & C1 Advanced Grammar, Idioms, Phrasal Verbs & Professional English",
    instructions: "You have exactly 20 minutes to complete this 6-question English assessment. Sourced from Cambridge English B2 First / C1 Advanced standards and Oxford Business English. Passing score: 70%.",
    questions: [
      {
        id: 701,
        category: "Conditionals (Cambridge B2/C1)",
        question: "Which sentence correctly uses the Third Conditional to express a hypothetical situation in the past and its unrealized outcome?",
        options: [
          "If I knew about the meeting yesterday, I would attend.",
          "If I had known about the meeting yesterday, I would have attended.",
          "If I would know about the meeting yesterday, I had attended.",
          "If I know about the meeting yesterday, I will have attended."
        ],
        correct: 1,
        explanation: "The Third Conditional is formed with 'If + past perfect (had known), would have + past participle (would have attended)'. It describes hypothetical conditions in the past that did not occur.",
        source: "Cambridge English Grammar in Use (Raymond Murphy) & British Council LearnEnglish",
        source_url: "https://learnenglish.britishcouncil.org/grammar/b1-b2-grammar/third-conditional"
      },
      {
        id: 702,
        category: "Workplace Diplomatic Language",
        question: "In professional workplace English, which phrasing represents the most diplomatic and constructive way to disagree with a proposal in a team meeting?",
        options: [
          "\"You are completely wrong about this plan.\"",
          "\"I see where you're coming from, but I have a few concerns regarding the timeline and deliverables.\"",
          "\"This proposal makes no sense at all.\"",
          "\"Never suggest this idea again.\""
        ],
        correct: 1,
        explanation: "Diplomatic English employs softening phrases ('I see where you're coming from...') and modal hedges to acknowledge the speaker's perspective while courteously expressing constructive critique without causing offense.",
        source: "Oxford Business English & BBC Learning English - English at Work",
        source_url: "https://www.bbc.co.uk/learningenglish/english/features/english-at-work"
      },
      {
        id: 703,
        category: "High-Frequency Phrasal Verbs",
        question: "Select the correct phrasal verb: \"The software team worked late into the night to ____ the root cause of the database timeout.\"",
        options: [
          "figure out",
          "look over into",
          "break with off",
          "put down from"
        ],
        correct: 0,
        explanation: "\"Figure out\" means to solve, understand, or discover the cause of a problem through reasoning and investigation.",
        source: "Cambridge Advanced Learner's Dictionary - Phrasal Verbs",
        source_url: "https://dictionary.cambridge.org/grammar/british-grammar/phrasal-verbs_2"
      },
      {
        id: 704,
        category: "Prepositions of Time",
        question: "Choose the correct preposition: \"Sarah Jenkins has been mentoring engineering graduates at the academy ____ October 2023.\"",
        options: [
          "for",
          "since",
          "during",
          "in at"
        ],
        correct: 1,
        explanation: "\"Since\" is used with a specific point in time (a month, year, or landmark event) with present perfect tenses. \"For\" is used with a duration (e.g., 'for two years').",
        source: "British Council LearnEnglish - Prepositions of Time (since, for, during)",
        source_url: "https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/for-since"
      },
      {
        id: 705,
        category: "Connected Speech & Phonetics",
        question: "In natural English connected speech, what phonological process occurs when a word ending in a consonant sound is followed immediately by a word beginning with a vowel sound (e.g., 'hold on' -> /həʊld ɒn/)?",
        options: [
          "Glottal stop replacement",
          "Catenation (consonant-to-vowel linking)",
          "Complete vowel deletion",
          "Nasalization"
        ],
        correct: 1,
        explanation: "Catenation links the final consonant sound of a word smoothly to the initial vowel sound of the next word, producing fluid, connected spoken rhythm without awkward pauses.",
        source: "BBC Learning English - Pronunciation & Connected Speech Masterclass",
        source_url: "https://www.bbc.co.uk/learningenglish/features/pronunciation"
      },
      {
        id: 706,
        category: "Modals of Deduction",
        question: "Which modal verb construction correctly expresses high logical deduction based on current evidence: \"All the office lights are off and the building is locked; they ____ left for the evening.\"",
        options: [
          "must have",
          "can't have",
          "should to",
          "ought"
        ],
        correct: 0,
        explanation: "\"Must have + past participle\" expresses strong logical certainty that something took place based on concrete present evidence.",
        source: "Cambridge English C1 Advanced - Modals of Deduction & Speculation",
        source_url: "https://dictionary.cambridge.org/grammar/british-grammar/modals-deduction-speculation"
      }
    ]
  },

  // Course 8: BBC 6-Minute English: Vocabulary & Idioms
  {
    course_id: 8,
    lesson_id: 47,
    title: "BBC English Vocabulary, Idioms & Listening Comprehension Examination",
    category: "British English & Idioms",
    duration_minutes: 20,
    timer_seconds: 1200,
    pass_percentage: 70,
    subtitle: "Standardized 20-Minute Examination covering BBC 6-Minute English Idioms, Colloquial Expressions & Contextual Vocabulary",
    instructions: "You have 20 minutes to solve these 6 British English idiomatic and vocabulary questions. Sourced from the BBC Learning English 6 Minute English archive and Oxford English Dictionary.",
    questions: [
      {
        id: 801,
        category: "British Idiomatic Expressions",
        question: "In conversational English, what does the idiom \"to bite the bullet\" mean?",
        options: [
          "To eat something hard and chewy.",
          "To force oneself to face a painful, difficult, or unavoidable situation with courage and resolution.",
          "To act recklessly without considering consequences.",
          "To interrupt someone while they are speaking."
        ],
        correct: 1,
        explanation: "Historically derived from biting on a lead bullet to endure pain during battlefield surgery without anesthesia, \"to bite the bullet\" means accepting an unpleasant situation bravely.",
        source: "BBC Learning English - 6 Minute English: Idioms and Expressions",
        source_url: "https://www.bbc.co.uk/learningenglish/english/features/6-minute-english"
      },
      {
        id: 802,
        category: "Colloquial Decision Idioms",
        question: "If someone is described as \"sitting on the fence\" regarding an upcoming team vote, what does it mean?",
        options: [
          "They have fallen asleep outdoors.",
          "They are undecided, delaying, or refusing to take a firm stance between two opposing sides.",
          "They have won the election decisively.",
          "They are building physical boundary fences."
        ],
        correct: 1,
        explanation: "\"Sitting on the fence\" means staying neutral or postponing a decision between two choices.",
        source: "Cambridge English Idioms in Use & BBC The English We Speak",
        source_url: "https://www.bbc.co.uk/learningenglish/english/features/the-english-we-speak"
      },
      {
        id: 803,
        category: "British Conversational Vocabulary",
        question: "In colloquial British English, what does the adjective \"chuffed\" express?",
        options: [
          "Extremely irritated and angry.",
          "Very pleased, delighted, and proud of an achievement.",
          "Exhausted after physical exercise.",
          "Confused by complex instructions."
        ],
        correct: 1,
        explanation: "\"Chuffed\" is an informal British English term meaning delighted, pleased, or proud (e.g., 'I was chuffed to bits with my exam results').",
        source: "Oxford English Dictionary & BBC World Service Learning English",
        source_url: "https://www.oed.com/"
      },
      {
        id: 804,
        category: "Idiomatic Context Usage",
        question: "Which sentence correctly demonstrates the idiom \"a blessing in disguise\"?",
        options: [
          "\"Missing my intended morning flight felt disastrous at first, but it was a blessing in disguise because I met my future venture partner on the later flight.\"",
          "\"He put on a coat to look like a blessing in disguise.\"",
          "\"The cake was baked with a blessing in disguise of sugar.\"",
          "\"She spoke in a blessing in disguise tone.\""
        ],
        correct: 0,
        explanation: "\"A blessing in disguise\" refers to an unfortunate event or apparent misfortune that ultimately leads to an unexpected positive result.",
        source: "BBC Learning English - Idioms in Context",
        source_url: "https://www.bbc.co.uk/learningenglish/features/english-at-work"
      },
      {
        id: 805,
        category: "Nuanced Academic Vocabulary",
        question: "In technical and cultural journalism, what does the formal adjective \"ubiquitous\" mean?",
        options: [
          "Extremely rare, endangered, and difficult to locate.",
          "Present, appearing, or found everywhere simultaneously.",
          "Dangerous to public human health.",
          "Completely obsolete and out of date."
        ],
        correct: 1,
        explanation: "\"Ubiquitous\" comes from the Latin 'ubique' (everywhere) and describes something pervasive that can be found everywhere (e.g., 'Smartphones and cloud internet access are now ubiquitous').",
        source: "Oxford Advanced Learner's Dictionary & BBC 6-Minute English Vocabulary Archive",
        source_url: "https://www.oxfordlearnersdictionaries.com/"
      },
      {
        id: 806,
        category: "Discussion & Debate Idioms",
        question: "In strategic and academic discussions, what does it mean \"to play devil's advocate\"?",
        options: [
          "To act maliciously and sabotage a meeting.",
          "To argue against an idea or present an opposing viewpoint purely for the sake of rigorous debate and testing assumptions.",
          "To sign a business contract without reviewing terms.",
          "To refuse to participate in conversation."
        ],
        correct: 1,
        explanation: "\"Playing devil's advocate\" means taking an contrary position not out of genuine disagreement, but to thoroughly challenge an argument and uncover any hidden flaws.",
        source: "BBC Learning English & Cambridge English Language Assessment",
        source_url: "https://www.bbc.co.uk/learningenglish/english/features/6-minute-english"
      }
    ]
  }
];
