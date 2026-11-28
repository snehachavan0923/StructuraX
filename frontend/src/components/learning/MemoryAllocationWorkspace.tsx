import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { useStudio } from "../../context/StudioContext";
import type { StudioStage } from "../../context/StudioContext";
import {
  BookOpen,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  HelpCircle,
  Bug,
  FileQuestion,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Database,
  Cpu,
  Layers,
  Sparkles,
  Eye,
  Sliders,
  ShieldAlert,
} from "lucide-react";

// Types
interface HeapBlock {
  id: string;
  address: string;
  name: string;
  sizeBytes: number;
  elements: (number | "?")[];
  isAllocated: boolean;
  isLeaked?: boolean;
  isDangling?: boolean;
  type: "malloc" | "calloc" | "realloc";
}

interface StackVariable {
  name: string;
  type: string;
  value: string;
  pointsTo?: string;
}

interface StackFrame {
  id: string;
  name: string;
  variables: StackVariable[];
}

interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  simpleDefinition: string;
  whyNeeded: string;
  analogy: string;
  visualSummary: string;
  stepByStep: string[];
  cExample: string;
  remember: string[];
  quickQuestion: {
    question: string;
    options: { id: string; text: string }[];
    correctId: string;
    explanation: string;
  };
}

const LESSONS: Lesson[] = [
  {
    id: 1,
    title: "Lesson 1: What is Memory?",
    subtitle: "The Foundation of Every Computer Program",
    simpleDefinition:
      "Computer memory is like a massive grid of numbered storage boxes. Each box has a unique number called an 'address' and stores a piece of information that your program needs to work with.",
    whyNeeded:
      "When a program runs, it needs a place to keep track of numbers, text, user inputs, and calculations. Without memory, a program would have no way to remember anything from one second to the next.",
    analogy:
      "Think of a wall of postal mailboxes in an apartment building. Every mailbox has an address number painted on the front (e.g., Mailbox #1024). Inside the mailbox is a letter containing data. The address tells the mail carrier where to find it.",
    visualSummary:
      "[ Address: 0x10A0 ] -> Stores Value [ 42 ] | [ Address: 0x10A4 ] -> Stores Value [ 99 ]",
    stepByStep: [
      "1. The operating system provides a pool of numbered memory addresses to your program.",
      "2. When you declare a variable (e.g., int age = 21), the computer reserves a storage box.",
      "3. The variable name 'age' is just a human-friendly label for that specific memory address.",
      "4. When your program reads 'age', it visits the address and reads what is inside the box.",
    ],
    cExample:
      "int score = 100;       // Reserves memory for an integer and stores 100\nprintf(\"%p\", &score);  // &score shows the memory address where 100 lives!",
    remember: [
      "Memory consists of sequentially numbered storage locations.",
      "An address is the unique number identifying where data lives.",
      "Variables are human-readable nicknames for memory addresses.",
    ],
    quickQuestion: {
      question: "What is a memory address?",
      options: [
        { id: "a", text: "The name of a software application on your hard drive" },
        { id: "b", text: "A unique number identifying a specific storage location in RAM" },
        { id: "c", text: "The speed at which the CPU processor runs" },
      ],
      correctId: "b",
      explanation:
        "Exactly right! An address is a numerical coordinate identifying where a variable or block of data is stored in memory.",
    },
  },
  {
    id: 2,
    title: "Lesson 2: Static and Dynamic Allocation",
    subtitle: "Language Storage Durations vs. Memory Regions",
    simpleDefinition:
      "Static allocation happens when the compiler determines the exact size and lifetime of variables beforehand. Dynamic allocation happens while the program is actively running, allowing you to ask for more or less memory on demand.",
    whyNeeded:
      "Sometimes you don't know how much data a user will enter until they actually run the program. If you ask a user 'How many students are in your class?', you need dynamic allocation to size the list at runtime.",
    analogy:
      "Static allocation is like buying a fixed 5-passenger car before you know how many friends are coming. Dynamic allocation is like ordering a flexible bus that expands or shrinks based on how many passengers show up at the bus stop.",
    visualSummary:
      "Stack (Automatic Local Variables) vs Static Segment (Global/Static Vars) vs Heap (Dynamic Runtime Allocation)",
    stepByStep: [
      "1. Automatic variables: Local variables declared inside functions. Stored in stack frames, automatically created on entry and destroyed on return.",
      "2. Static storage duration: Global variables and variables marked 'static'. Live for the entire duration of the program in the Data/BSS segment (not the stack!).",
      "3. Allocated storage duration: Dynamic memory requested manually on the Heap. Lives until explicitly freed by your code.",
    ],
    cExample:
      "// Local automatic variable (lives on stack, disappears on return):\nvoid example() {\n    int temp = 5;\n}\n\n// Static storage duration (lives for entire program):\nstatic int global_counter = 0;\n\n// Dynamic allocated storage (lives on heap until freed):\nint* list = malloc(10 * sizeof(int));",
    remember: [
      "CRITICAL: Do not confuse 'static storage duration' with the stack! Local automatic variables live on the stack; static and global variables live in static data segments.",
      "Stack memory is automatic, ultra-fast, but fixed in scope.",
      "Heap memory is flexible and dynamic, but requires manual cleanup.",
    ],
    quickQuestion: {
      question: "Where are local variables declared inside a regular function commonly stored?",
      options: [
        { id: "a", text: "In stack frames with automatic storage duration" },
        { id: "b", text: "In static storage duration on the hard drive" },
        { id: "c", text: "In permanent read-only program text" },
      ],
      correctId: "a",
      explanation:
        "Correct! Local variables within a function have automatic storage duration and are placed inside that function's activation record (stack frame).",
    },
  },
  {
    id: 3,
    title: "Lesson 3: Stack Memory & Stack Frames",
    subtitle: "LIFO Organization and Function Calls",
    simpleDefinition:
      "The Stack is a structured, neat pile of memory. Every time a function is called, a new 'stack frame' is placed on top of the pile containing its local variables. When the function returns, its frame is removed.",
    whyNeeded:
      "Functions frequently call other functions. The stack ensures that when a helper function finishes, the computer smoothly returns to the caller with all of its original local variables intact.",
    analogy:
      "Think of a spring-loaded cafeteria plate dispenser. You push plates onto the top (Last In). When you need a plate, you take the top one off (First Out — LIFO). You cannot reach the bottom plate without removing the ones on top.",
    visualSummary:
      "[ Top: helper() frame ] -> [ Middle: calculate() frame ] -> [ Bottom: main() frame ]",
    stepByStep: [
      "1. Your program begins at main(); a stack frame for main() is created at the base.",
      "2. main() calls helper(); a new stack frame is pushed on top with helper's local variables.",
      "3. helper() does its work. While running, it can only directly see its own frame.",
      "4. helper() returns; its stack frame is popped off and discarded.",
      "5. Execution resumes in main() right where it left off.",
    ],
    cExample:
      "void helper() {\n    int x = 42; // Allocated on helper's stack frame\n} // x is automatically destroyed here when frame pops!\n\nint main() {\n    helper();\n    return 0;\n}",
    remember: [
      "Stack frames operate on Last-In, First-Out (LIFO) discipline.",
      "Stack memory allocation is virtually instantaneous (just moving the Stack Pointer register).",
      "Calling functions indefinitely without returning causes a Stack Overflow crash.",
    ],
    quickQuestion: {
      question: "What happens to a local variable on the stack when its function returns?",
      options: [
        { id: "a", text: "It stays alive in memory forever until the computer turns off" },
        { id: "b", text: "Its stack frame is popped off, and its memory is automatically reclaimed" },
        { id: "c", text: "It moves automatically to the Heap segment" },
      ],
      correctId: "b",
      explanation:
        "Spot on! The stack frame is popped when the function returns, automatically reclaiming that storage space.",
    },
  },
  {
    id: 4,
    title: "Lesson 4: Heap Memory & Pointers",
    subtitle: "Flexible, Long-Lived Storage",
    simpleDefinition:
      "The Heap is a large, open area of memory where you can request blocks of any size at any time. Unlike the stack, memory on the heap stays alive until you explicitly tell the computer to let it go.",
    whyNeeded:
      "If you create data inside a function that needs to survive after that function returns (like a linked-list node or a loaded image), stack memory cannot help because it vanishes on return. The heap keeps it alive.",
    analogy:
      "If the stack is a neat stack of plates, the heap is a giant warehouse with rental storage lockers. You can rent a locker for as long as you want, hand the locker key (pointer) to different people, and return the key when done.",
    visualSummary:
      "Stack Frame [ ptr: 0x2050 ] =====(points to)=====> Heap Block [ 0x2050: Data ]",
    stepByStep: [
      "1. Your function needs a block of memory that outlives its return.",
      "2. It asks the heap manager for a specific number of bytes.",
      "3. The heap finds an open spot and returns its memory address.",
      "4. You store that address in a pointer variable on your stack frame.",
      "5. You access the heap memory through the pointer (*ptr).",
    ],
    cExample:
      "struct Node* create_node(int val) {\n    struct Node* n = malloc(sizeof(struct Node)); // Heap allocation!\n    n->data = val;\n    return n; // Safe to return! The heap block outlives this function.\n}",
    remember: [
      "Heap memory outlives the function that allocated it.",
      "You access heap memory through pointer variables.",
      "Because the compiler does not automatically clean up the heap, YOU must free it.",
    ],
    quickQuestion: {
      question: "Why would a programmer choose heap allocation over stack allocation?",
      options: [
        { id: "a", text: "To allocate memory whose size is determined at runtime and outlives the function" },
        { id: "b", text: "Because heap memory is faster to access than CPU registers" },
        { id: "c", text: "Because the compiler automatically frees heap memory on return" },
      ],
      correctId: "a",
      explanation:
        "Precisely! Heap allocation gives dynamic sizing and persistent lifetime across function boundaries.",
    },
  },
  {
    id: 5,
    title: "Lesson 5: malloc() — Requesting Heap Memory",
    subtitle: "Allocation, sizeof(), and Indeterminate Values",
    simpleDefinition:
      "malloc() stands for 'memory allocate'. You tell it how many bytes you need, and it finds a contiguous block on the heap and hands you a pointer to the very first byte.",
    whyNeeded:
      "Different data types have different sizes. An int is typically 4 bytes; a double is 8 bytes. Using malloc(3 * sizeof(int)) guarantees you get exactly enough space for 3 integers regardless of computer architecture.",
    analogy:
      "Ordering 3 blank notebook pages from a stationer. You tell the clerk 'I need 3 pages of college-ruled paper'. The clerk hands you the paper, but whatever scribbles were left on the paper from the factory are still there!",
    visualSummary:
      "malloc(3 * sizeof(int)) -> [ Cell 0: ? ] [ Cell 1: ? ] [ Cell 2: ? ] (Indeterminate bytes!)",
    stepByStep: [
      "1. sizeof(int) determines how many bytes one integer takes on this machine (usually 4).",
      "2. 3 * sizeof(int) computes the total bytes needed (12 bytes).",
      "3. malloc(12) requests 12 bytes from the operating system heap manager.",
      "4. IMPORTANT: malloc does NOT zero out memory. The memory contains whatever garbage bits were previously there (indeterminate '?').",
      "5. Always check if (ptr == NULL) to verify the system had enough memory!",
    ],
    cExample:
      "int *ptr = malloc(3 * sizeof(int)); // 12 bytes requested\nif (ptr == NULL) {\n    printf(\"Out of memory!\\n\");\n    exit(1);\n}\n// Assign real values before reading!\nptr[0] = 10; ptr[1] = 20; ptr[2] = 30;",
    remember: [
      "malloc memory is uninitialized (indeterminate '?') — never assume it starts at zero!",
      "Always check if the returned pointer is NULL before using it.",
      "Always use sizeof() rather than hardcoding byte numbers like 4 or 8.",
    ],
    quickQuestion: {
      question: "What values does malloc() guarantee are stored inside newly allocated memory?",
      options: [
        { id: "a", text: "All zeroes (0)" },
        { id: "b", text: "No guaranteed value; the memory is uninitialized (indeterminate)" },
        { id: "c", text: "Sequential integers starting from 1" },
      ],
      correctId: "b",
      explanation:
        "Crucial point! malloc leaves memory uninitialized. Reading it before assigning values leads to undefined behavior.",
    },
  },
  {
    id: 6,
    title: "Lesson 6: calloc() — Zero-Initialized Allocation",
    subtitle: "Clean Slates and Element Counts",
    simpleDefinition:
      "calloc() stands for 'clear allocate'. It takes two arguments: the number of elements and the size of each element. It allocates the memory AND clears every single byte to zero.",
    whyNeeded:
      "When creating counters, statistical tables, or matrices where you want to start from clean zeroes without running a manual for-loop, calloc does it cleanly and safely.",
    analogy:
      "Buying brand new, pristine whiteboards that have been thoroughly wiped clean with eraser fluid. Every square inch starts completely clean (all zeroes).",
    visualSummary:
      "calloc(3, sizeof(int)) -> [ Cell 0: 0 ] [ Cell 1: 0 ] [ Cell 2: 0 ] (Guaranteed zero-initialized!)",
    stepByStep: [
      "1. You supply two parameters: count of elements, and size per element.",
      "2. calloc checks for arithmetic overflow in (count * size).",
      "3. The heap manager reserves the block and zeroes out every byte.",
      "4. It returns a pointer to the zeroed block.",
      "5. Like malloc, it returns NULL if the system is out of memory.",
    ],
    cExample:
      "// Allocates 4 integers and initializes every byte to 0:\nint *scores = calloc(4, sizeof(int));\nif (scores != NULL) {\n    // scores[0], scores[1], scores[2], scores[3] are all 0!\n}",
    remember: [
      "calloc(n, size) initializes all allocated bytes to zero.",
      "malloc(n * size) is slightly faster because it skips zeroing, but contains garbage data.",
      "Use calloc when you need guaranteed initial zeroes.",
    ],
    quickQuestion: {
      question: "What is the primary operational difference between malloc and calloc?",
      options: [
        { id: "a", text: "calloc zeroes all allocated bytes; malloc leaves memory uninitialized" },
        { id: "b", text: "malloc works on the heap, but calloc works on the stack" },
        { id: "c", text: "calloc cannot fail even when out of RAM" },
      ],
      correctId: "a",
      explanation:
        "Exactly! calloc sets all bits to zero, whereas malloc leaves whatever indeterminate values were already in memory.",
    },
  },
  {
    id: 7,
    title: "Lesson 7: realloc() — Resizing Allocated Memory",
    subtitle: "Growing, Shrinking, and Safe Temporary Pointers",
    simpleDefinition:
      "realloc() changes the size of an existing heap block. It can expand or shrink the allocation while preserving your existing data.",
    whyNeeded:
      "Imagine reading lines from a file: you don't know if there are 10 lines or 1,000 lines. You start with 10 slots, and whenever you fill up, realloc doubles your capacity.",
    analogy:
      "You rent a 2-room apartment. When your family grows, you ask the landlord for more space. If the apartment next door is vacant, the landlord knocks down the wall (same address!). If not, the landlord moves you to a bigger building across town, moves your furniture for you, and releases your old apartment.",
    visualSummary:
      "Outcome A: In-Place Expansion (0x10A0) | Outcome B: Relocation (copies data to 0x3020, frees 0x10A0)",
    stepByStep: [
      "1. You pass your current pointer and the new desired total size.",
      "2. Outcome 1 (In-place): If contiguous space is free immediately after the block, it extends it in-place at the SAME address.",
      "3. Outcome 2 (Relocation): If adjacent space is blocked, it allocates a NEW block elsewhere, COPIES existing data, FREES the old block, and returns the NEW address.",
      "4. Outcome 3 (Failure): If no memory is available, it returns NULL. CRITICAL: The old memory remains untouched and valid!",
      "5. ALWAYS assign to a temporary pointer first (int *temp = realloc(...)) so you don't lose the original pointer on failure!",
    ],
    cExample:
      "int *ptr = malloc(2 * sizeof(int));\nptr[0] = 10; ptr[1] = 20;\n\n// Safe realloc pattern:\nint *temp = realloc(ptr, 4 * sizeof(int));\nif (temp != NULL) {\n    ptr = temp; // ptr now points to resized block!\n} else {\n    // Original ptr is still valid and not leaked!\n}",
    remember: [
      "realloc may return the same address OR a completely new address.",
      "Existing data up to the minimum of old and new sizes is preserved.",
      "NEVER write ptr = realloc(ptr, ...); if it fails, you leak your only pointer!",
    ],
    quickQuestion: {
      question: "Why must you use a temporary pointer like 'int *temp = realloc(ptr, size)'?",
      options: [
        { id: "a", text: "Because if realloc fails and returns NULL, assigning directly to ptr would leak the original memory" },
        { id: "b", text: "Because C compilers do not allow reassigning the same pointer name" },
        { id: "c", text: "Because temporary pointers run on faster CPU caches" },
      ],
      correctId: "a",
      explanation:
        "Critical safety rule! If realloc fails, it returns NULL while leaving the original block intact. Overwriting ptr with NULL destroys your only handle to that block, leaking it permanently.",
    },
  },
  {
    id: 8,
    title: "Lesson 8: free() — Releasing Heap Memory",
    subtitle: "Recycling Memory and Neutralizing Dangling Pointers",
    simpleDefinition:
      "free() tells the heap manager: 'I am finished using this block of memory. You may recycle it for future allocations.'",
    whyNeeded:
      "Computers have finite RAM. If a long-running program (like a web browser or database) continuously requests memory without freeing it, the computer eventually runs completely out of memory and crashes.",
    analogy:
      "Returning a rented library book. When you return the book to the front desk, the librarian puts it back on the shelf so another student can check it out. If you keep the book forever, nobody else can read it.",
    visualSummary:
      "free(ptr) -> Block marked recyclable | ptr = NULL -> Pointer safely cleared to 0x0",
    stepByStep: [
      "1. You call free(ptr) passing the exact address returned by malloc/calloc/realloc.",
      "2. The heap manager marks the block as recyclable in its internal free-list.",
      "3. NOTE: Freeing memory does NOT necessarily mean the OS physically shrinks the program's virtual memory immediately.",
      "4. CRITICAL: The pointer variable 'ptr' still contains the old address! This is a 'Dangling Pointer'.",
      "5. Immediately assign ptr = NULL; so you don't accidentally use or free it again.",
    ],
    cExample:
      "int *ptr = malloc(10 * sizeof(int));\n// ... use the memory ...\n\nfree(ptr);     // Heap block is now recyclable\nptr = NULL;    // Neutralizes the dangling pointer! Safe practice.",
    remember: [
      "Every malloc/calloc/realloc should have a corresponding free().",
      "Freeing memory does not erase the address stored inside the pointer variable.",
      "Always set ptr = NULL after free() to prevent dangerous accidental reuse.",
    ],
    quickQuestion: {
      question: "What value does a pointer variable contain immediately after calling free(ptr)?",
      options: [
        { id: "a", text: "It is automatically set to NULL by the hardware" },
        { id: "b", text: "It still contains the old memory address, making it a dangling pointer" },
        { id: "c", text: "It becomes 0xFFFFFFFF" },
      ],
      correctId: "b",
      explanation:
        "Crucial insight! free() tells the heap manager the block is done, but it does NOT alter the value of your stack pointer variable. You must explicitly write ptr = NULL.",
    },
  },
];

type MemoryTab = "lessons" | "sandbox" | "bugs" | "predict" | "debug" | "quiz" | "progress";

const STAGE_TO_TAB: Record<StudioStage, MemoryTab> = {
  concept: "lessons",
  animation: "sandbox",
  try: "sandbox",
  predict: "predict",
  debug: "debug",
  quiz: "quiz",
  ai: "bugs",
  progress: "progress",
};

const TAB_TO_STAGE: Record<MemoryTab, StudioStage> = {
  lessons: "concept",
  sandbox: "animation",
  bugs: "ai",
  predict: "predict",
  debug: "debug",
  quiz: "quiz",
  progress: "progress",
};

export function MemoryAllocationWorkspace() {
  const { activeStage, setActiveStage } = useStudio();
  const [activeTab, setActiveTab] = useState<MemoryTab>("lessons");

  useEffect(() => {
    setActiveTab(STAGE_TO_TAB[activeStage]);
  }, [activeStage]);

  useEffect(() => {
    setActiveStage(TAB_TO_STAGE[activeTab]);
  }, [activeTab, setActiveStage]);

  // View Mode: Beginner vs Technical
  const [viewMode, setViewMode] = useState<"beginner" | "technical">("beginner");

  // Lesson State
  const [currentLessonId, setCurrentLessonId] = useState<number>(1);
  const currentLesson = LESSONS.find((l) => l.id === currentLessonId) || LESSONS[0];
  const [lessonAnswer, setLessonAnswer] = useState<string | null>(null);
  const [lessonFeedback, setLessonFeedback] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([1]);

  // Stack & Heap State
  const [stackFrames, setStackFrames] = useState<StackFrame[]>([
    {
      id: "frame_main",
      name: "main()",
      variables: [
        { name: "static_arr[4]", type: "int[4]", value: "[10, 20, 30, 40]" },
        { name: "node_ptr", type: "struct Node*", value: "0x10A0", pointsTo: "0x10A0" },
      ],
    },
  ]);

  const [heapBlocks, setHeapBlocks] = useState<HeapBlock[]>([
    {
      id: "block_1",
      address: "0x10A0",
      name: "node_ptr block",
      sizeBytes: 12,
      elements: [14, "?", "?"],
      isAllocated: true,
      type: "malloc",
    },
  ]);

  const [logMessages, setLogMessages] = useState<string[]>([
    "Initialized environment with stack frame main() and 1 heap allocation at 0x10A0.",
  ]);

  const [memoryWarning, setMemoryWarning] = useState<string | null>(null);

  // Animation Step Controller
  const [animPlaying, setAnimPlaying] = useState(false);
  const [animSpeed, setAnimSpeed] = useState<number>(1);
  const [animStep, setAnimStep] = useState<number>(1);

  // Bug Labs Mode
  const [bugLabMode, setBugLabMode] = useState<
    "leak" | "dangling" | "use_after_free" | "double_free"
  >("leak");

  // Prediction State
  const [predictionAnswer, setPredictionAnswer] = useState<string | null>(null);
  const [predictionFeedback, setPredictionFeedback] = useState<{
    correct: boolean;
    explanation: string;
  } | null>(null);

  // Debug State
  const [debugChoice, setDebugChoice] = useState<string | null>(null);
  const [debugSolved, setDebugSolved] = useState<boolean>(false);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Progress Metrics
  const [progress, setProgress] = useState({
    sandboxActions: 1,
    predictSolved: false,
    debugSolved: false,
    quizScore: 0,
  });

  const addLog = (msg: string) => {
    setLogMessages((prev) => [msg, ...prev.slice(0, 7)]);
  };

  // Playback timer
  useEffect(() => {
    let timer: any;
    if (animPlaying) {
      timer = setInterval(() => {
        setAnimStep((prev) => {
          if (prev >= 4) {
            setAnimPlaying(false);
            return 4;
          }
          return prev + 1;
        });
      }, 2000 / animSpeed);
    }
    return () => clearInterval(timer);
  }, [animPlaying, animSpeed]);

  // Lesson question submit
  const handleLessonAnswerSubmit = (optionId: string) => {
    setLessonAnswer(optionId);
    if (optionId === currentLesson.quickQuestion.correctId) {
      setLessonFeedback(currentLesson.quickQuestion.explanation);
      if (!completedLessons.includes(currentLessonId)) {
        setCompletedLessons((prev) => [...prev, currentLessonId]);
      }
    } else {
      setLessonFeedback("Not quite. Review the analogy and steps above, then try again!");
    }
  };

  // Sandbox Actions with Correct C Semantics
  const handleMalloc = () => {
    const nextHex = "0x" + (0x10A0 + heapBlocks.length * 0x30).toString(16).toUpperCase();
    const varName = `buf_${heapBlocks.length + 1}`;
    const newBlock: HeapBlock = {
      id: `block_${Date.now()}`,
      address: nextHex,
      name: varName,
      sizeBytes: 12,
      elements: ["?", "?", "?"], // Indeterminate values!
      isAllocated: true,
      type: "malloc",
    };
    setHeapBlocks((prev) => [...prev, newBlock]);
    setStackFrames((prev) => {
      const copy = [...prev];
      copy[0].variables.push({
        name: varName,
        type: "int*",
        value: nextHex,
        pointsTo: nextHex,
      });
      return copy;
    });
    setMemoryWarning(null);
    addLog(`malloc(3 * sizeof(int)) -> allocated 12 uninitialized bytes at ${nextHex}`);
    setProgress((p) => ({ ...p, sandboxActions: p.sandboxActions + 1 }));
  };

  const handleCalloc = () => {
    const nextHex = "0x" + (0x10A0 + heapBlocks.length * 0x30).toString(16).toUpperCase();
    const varName = `zero_buf_${heapBlocks.length + 1}`;
    const newBlock: HeapBlock = {
      id: `block_${Date.now()}`,
      address: nextHex,
      name: varName,
      sizeBytes: 16,
      elements: [0, 0, 0, 0], // Guaranteed zero-initialized!
      isAllocated: true,
      type: "calloc",
    };
    setHeapBlocks((prev) => [...prev, newBlock]);
    setStackFrames((prev) => {
      const copy = [...prev];
      copy[0].variables.push({
        name: varName,
        type: "int*",
        value: nextHex,
        pointsTo: nextHex,
      });
      return copy;
    });
    setMemoryWarning(null);
    addLog(`calloc(4, sizeof(int)) -> allocated 16 zero-initialized bytes at ${nextHex}`);
    setProgress((p) => ({ ...p, sandboxActions: p.sandboxActions + 1 }));
  };

  const handleAssignValue = (blockId: string, index: number, val: number) => {
    setHeapBlocks((prev) =>
      prev.map((b) => {
        if (b.id === blockId && b.isAllocated) {
          const newEl = [...b.elements];
          newEl[index] = val;
          return { ...b, elements: newEl };
        }
        return b;
      }),
    );
    addLog(`*(${blockId}[${index}]) = ${val}; -> assigned real value to heap memory.`);
  };

  const handleReallocInPlace = () => {
    const allocated = heapBlocks.filter((b) => b.isAllocated && !b.isLeaked);
    if (allocated.length === 0) {
      setMemoryWarning("No active heap block to realloc()! Allocate memory first.");
      return;
    }
    const target = allocated[0];
    const newSize = target.sizeBytes + 8;
    const newElements: (number | "?")[] = [...target.elements, "?", "?"];
    setHeapBlocks((prev) =>
      prev.map((b) =>
        b.id === target.id
          ? { ...b, sizeBytes: newSize, elements: newElements, type: "realloc" }
          : b,
      ),
    );
    setMemoryWarning(null);
    addLog(`realloc(${target.address}, ${newSize}) -> Case 1: In-place expansion at same address!`);
    setProgress((p) => ({ ...p, sandboxActions: p.sandboxActions + 1 }));
  };

  const handleReallocRelocate = () => {
    const allocated = heapBlocks.filter((b) => b.isAllocated && !b.isLeaked);
    if (allocated.length === 0) {
      setMemoryWarning("No active heap block to realloc()! Allocate memory first.");
      return;
    }
    const target = allocated[0];
    const newAddress = "0x" + (0x2400 + Math.floor(Math.random() * 0x500)).toString(16).toUpperCase();
    const newSize = target.sizeBytes + 8;
    const newElements: (number | "?")[] = [...target.elements, "?", "?"];

    // Relocate: update heap block address, update stack pointer
    setHeapBlocks((prev) =>
      prev.map((b) =>
        b.id === target.id
          ? { ...b, address: newAddress, sizeBytes: newSize, elements: newElements, type: "realloc" }
          : b,
      ),
    );
    setStackFrames((prev) => {
      const copy = [...prev];
      copy[0].variables = copy[0].variables.map((v) =>
        v.pointsTo === target.address
          ? { ...v, value: newAddress, pointsTo: newAddress }
          : v,
      );
      return copy;
    });

    setMemoryWarning(null);
    addLog(
      `realloc(${target.address}, ${newSize}) -> Case 2: Relocated to ${newAddress}! Copied data and released old address.`,
    );
    setProgress((p) => ({ ...p, sandboxActions: p.sandboxActions + 1 }));
  };

  const handleFree = () => {
    const allocated = heapBlocks.filter((b) => b.isAllocated && !b.isLeaked);
    if (allocated.length === 0) {
      setMemoryWarning("No allocated blocks to free()! Allocations already freed.");
      return;
    }
    const target = allocated[allocated.length - 1];
    setHeapBlocks((prev) =>
      prev.map((b) => (b.id === target.id ? { ...b, isAllocated: false } : b)),
    );
    // Nullify pointer on stack
    setStackFrames((prev) => {
      const copy = [...prev];
      copy[0].variables = copy[0].variables.map((v) =>
        v.pointsTo === target.address ? { ...v, value: "NULL", pointsTo: undefined } : v,
      );
      return copy;
    });
    setMemoryWarning(null);
    addLog(`free(${target.address}) -> memory released back to heap; pointer set to NULL.`);
    setProgress((p) => ({ ...p, sandboxActions: p.sandboxActions + 1 }));
  };

  const handleSimulateLeak = () => {
    const allocated = heapBlocks.filter((b) => b.isAllocated && !b.isLeaked);
    if (allocated.length === 0) {
      setMemoryWarning("No active allocated blocks available to simulate a memory leak.");
      return;
    }
    const target = allocated[0];
    setStackFrames((prev) => {
      const copy = [...prev];
      copy[0].variables = copy[0].variables.map((v) =>
        v.pointsTo === target.address
          ? { ...v, value: "NULL (lost reference)", pointsTo: undefined }
          : v,
      );
      return copy;
    });
    setHeapBlocks((prev) =>
      prev.map((b) => (b.id === target.id ? { ...b, isLeaked: true } : b)),
    );
    setMemoryWarning(
      `MEMORY LEAK DETECTED: Pointer reference to ${target.address} was overwritten without calling free()! The OS cannot reclaim this memory until program termination.`,
    );
    addLog(`MEMORY LEAK: ptr = NULL; -> lost reference to ${target.address} (${target.sizeBytes} bytes lost)`);
  };

  const handleSimulateDangling = () => {
    const allocated = heapBlocks.filter((b) => b.isAllocated);
    if (allocated.length === 0) {
      setMemoryWarning("Allocate memory first before simulating dangling pointer.");
      return;
    }
    const target = allocated[0];
    setHeapBlocks((prev) =>
      prev.map((b) => (b.id === target.id ? { ...b, isAllocated: false, isDangling: true } : b)),
    );
    setMemoryWarning(
      `DANGLING POINTER WARNING: Memory at ${target.address} was freed, but the stack variable still holds its address! Dereferencing this pointer causes Undefined Behavior or Segmentation Fault.`,
    );
    addLog(`free(${target.address}); -> pointer NOT reset to NULL; dangling pointer created!`);
  };

  const handleSimulateUseAfterFree = () => {
    setMemoryWarning(
      "USE-AFTER-FREE ERROR: Attempted to dereference *dangling_ptr! Reading or writing to released memory causes Undefined Behavior, silent memory corruption, or security exploits.",
    );
    addLog("CRITICAL: Dereferenced pointer to already freed memory! [Undefined Behavior]");
  };

  const handleSimulateDoubleFree = () => {
    setMemoryWarning(
      "DOUBLE-FREE ABORT: free(ptr) was invoked a second time on the same address! In real C runtimes, this corrupts heap allocator metadata and aborts the process immediately (SIGABRT).",
    );
    addLog("CRITICAL: free() called twice on the same pointer! [Heap Corruption]");
  };

  const handleReset = () => {
    setHeapBlocks([
      {
        id: "block_1",
        address: "0x10A0",
        name: "node_ptr block",
        sizeBytes: 12,
        elements: [14, "?", "?"],
        isAllocated: true,
        type: "malloc",
      },
    ]);
    setStackFrames([
      {
        id: "frame_main",
        name: "main()",
        variables: [
          { name: "static_arr[4]", type: "int[4]", value: "[10, 20, 30, 40]" },
          { name: "node_ptr", type: "struct Node*", value: "0x10A0", pointsTo: "0x10A0" },
        ],
      },
    ]);
    setMemoryWarning(null);
    setLogMessages(["Reset sandbox to default initial state."]);
  };

  // Prediction Submit
  const handlePredictSubmit = (choice: string) => {
    setPredictionAnswer(choice);
    if (choice === "c") {
      setPredictionFeedback({
        correct: true,
        explanation:
          "Correct! When malloc() is unable to satisfy a request (e.g., out of RAM or virtual address space), it returns a NULL pointer. Robust C programs must always check 'if (ptr == NULL)' before dereferencing.",
      });
      setProgress((p) => ({ ...p, predictSolved: true }));
    } else {
      setPredictionFeedback({
        correct: false,
        explanation:
          "Incorrect. In standard C, malloc does not throw an exception or return a negative error code; it returns a NULL pointer.",
      });
    }
  };

  // Debug Submit
  const handleDebugSubmit = (choice: string) => {
    setDebugChoice(choice);
    if (choice === "option_b") {
      setDebugSolved(true);
      setProgress((p) => ({ ...p, debugSolved: true }));
    } else {
      setDebugSolved(false);
    }
  };

  // Quiz Submit
  const handleQuizSubmit = () => {
    let score = 0;
    if (quizAnswers["q1"] === "heap") score++;
    if (quizAnswers["q2"] === "zeros") score++;
    if (quizAnswers["q3"] === "leak") score++;
    if (quizAnswers["q4"] === "dangling") score++;
    if (quizAnswers["q5"] === "indeterminate") score++;
    setQuizSubmitted(true);
    setProgress((p) => ({ ...p, quizScore: score }));
  };

  // Real Progress Calculation
  const progressPercent = Math.min(
    100,
    Math.round(
      (completedLessons.length / 8) * 40 +
        (Math.min(progress.sandboxActions, 5) / 5) * 20 +
        (progress.predictSolved ? 1 : 0) * 15 +
        (progress.debugSolved ? 1 : 0) * 15 +
        (progress.quizScore / 5) * 10,
    ),
  );

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--primary)] font-semibold">
              Unit I &bull; Topics 1 & 2
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-secondary)]">
              Beginner-Friendly &amp; Rigorous C
            </span>
          </div>
          <h1 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
            Static &amp; Dynamic Memory Allocation
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Master computer memory from first principles: the Stack vs Heap boundary, malloc/calloc/realloc/free mechanics, and pointer safety.
          </p>
        </div>

        {/* Global Progress Pill & View Mode Switch */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Progressive Disclosure Toggle */}
          <div className="flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1">
            <button
              onClick={() => setViewMode("beginner")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === "beginner"
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Eye size={13} />
              <span>Beginner View</span>
            </button>
            <button
              onClick={() => setViewMode("technical")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === "technical"
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Sliders size={13} />
              <span>Technical C View</span>
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2">
            <Database size={16} className="text-[var(--primary)]" />
            <div className="text-xs">
              <span className="text-[var(--text-secondary)]">Mastery: </span>
              <span className="font-bold text-[var(--text-primary)] font-mono">
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-[var(--border)] pb-2 scrollbar-none">
        {[
          { id: "lessons", label: "1. Interactive Lessons (1-8)", icon: BookOpen },
          { id: "sandbox", label: "2. Stack & Heap Sandbox", icon: Play },
          { id: "bugs", label: "3. Memory Bug Labs", icon: ShieldAlert },
          { id: "predict", label: "4. Predict Behavior", icon: HelpCircle },
          { id: "debug", label: "5. Debug Memory Bugs", icon: Bug },
          { id: "quiz", label: "6. Knowledge Quiz", icon: FileQuestion },
          { id: "progress", label: "7. Progress Breakdown", icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[var(--primary)] text-white font-semibold shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: INTERACTIVE LESSONS (1 - 8) */}
      {activeTab === "lessons" && (
        <div className="space-y-6">
          {/* Lesson Selector Bar */}
          <div className="flex items-center gap-2 overflow-x-auto p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] scrollbar-none">
            {LESSONS.map((l) => {
              const isCurrent = l.id === currentLessonId;
              const isDone = completedLessons.includes(l.id);
              return (
                <button
                  key={l.id}
                  onClick={() => {
                    setCurrentLessonId(l.id);
                    setLessonAnswer(null);
                    setLessonFeedback(null);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isCurrent
                      ? "bg-[var(--primary)] text-white font-semibold shadow-sm"
                      : isDone
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {isDone ? <CheckCircle2 size={13} /> : <span className="font-mono text-[10px]">#{l.id}</span>}
                  <span>{l.title.split(":")[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Active Lesson Content Card */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--primary)] font-bold">
                  {currentLesson.title}
                </span>
                <h2 className="font-['Space_Grotesk'] text-xl font-bold text-[var(--text-primary)] mt-0.5">
                  {currentLesson.subtitle}
                </h2>
              </div>
              <div className="text-xs font-mono text-[var(--text-secondary)]">
                Step {currentLessonId} of 8
              </div>
            </div>

            {/* 1. Simple Definition & 2. Why Needed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] space-y-2">
                <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[var(--primary)]" />
                  1. Plain-English Definition
                </span>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {currentLesson.simpleDefinition}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] space-y-2">
                <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Layers size={14} className="text-blue-400" />
                  2. Why Do We Need This?
                </span>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {currentLesson.whyNeeded}
                </p>
              </div>
            </div>

            {/* 3. Real-World Analogy */}
            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                💡 3. Real-World Analogy
              </span>
              <p className="text-xs text-amber-200/90 leading-relaxed font-sans">
                {currentLesson.analogy}
              </p>
            </div>

            {/* 4. Visual Summary Diagram */}
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] space-y-2">
              <span className="text-xs font-bold text-[var(--text-primary)]">
                4. Visual Schematic Diagram
              </span>
              <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] font-mono text-xs text-[var(--primary)] text-center">
                {currentLesson.visualSummary}
              </div>
            </div>

            {/* 5. Step-by-Step Execution Sequence */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-[var(--text-primary)]">
                5. Step-by-Step Execution Sequence
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentLesson.stepByStep.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--text-secondary)] leading-relaxed"
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Actual C Example (with Beginner vs Technical view) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  6. Practical C Code Example
                </span>
                <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                  {viewMode === "beginner" ? "Simplified Educational Syntax" : "Exact C Standard Syntax"}
                </span>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-zinc-950 p-4 font-mono text-xs text-zinc-100 overflow-x-auto">
                <pre>{currentLesson.cExample}</pre>
              </div>
            </div>

            {/* 8. Key Takeaways to Remember */}
            <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-2">
              <span className="text-xs font-bold text-blue-400">
                8. What Should You Remember?
              </span>
              <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                {currentLesson.remember.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 9. Quick Check Question */}
            <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle size={16} className="text-[var(--primary)]" />
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  9. Quick Knowledge Check
                </span>
              </div>

              <p className="text-xs text-[var(--text-secondary)] font-medium">
                {currentLesson.quickQuestion.question}
              </p>

              <div className="space-y-2">
                {currentLesson.quickQuestion.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleLessonAnswerSubmit(opt.id)}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                      lessonAnswer === opt.id
                        ? opt.id === currentLesson.quickQuestion.correctId
                          ? "border-emerald-500 bg-emerald-500/10 text-[var(--text-primary)]"
                          : "border-red-500 bg-red-500/10 text-[var(--text-primary)]"
                        : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/50 text-[var(--text-secondary)]"
                    }`}
                  >
                    <span className="font-mono font-bold mr-2 uppercase">{opt.id})</span>
                    {opt.text}
                  </button>
                ))}
              </div>

              {lessonFeedback && (
                <div
                  className={`p-3 rounded-lg border text-xs leading-relaxed flex items-start gap-2 ${
                    lessonAnswer === currentLesson.quickQuestion.correctId
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-red-500/30 bg-red-500/10 text-red-400"
                  }`}
                >
                  {lessonAnswer === currentLesson.quickQuestion.correctId ? (
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={16} className="shrink-0 mt-0.5" />
                  )}
                  <span>{lessonFeedback}</span>
                </div>
              )}
            </div>

            {/* Next / Prev Navigation Buttons */}
            <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={currentLessonId === 1}
                onClick={() => {
                  setCurrentLessonId((prev) => Math.max(prev - 1, 1));
                  setLessonAnswer(null);
                  setLessonFeedback(null);
                }}
              >
                &larr; Previous Lesson
              </Button>

              <Button
                size="sm"
                disabled={currentLessonId === LESSONS.length}
                onClick={() => {
                  setCurrentLessonId((prev) => Math.min(prev + 1, LESSONS.length));
                  setLessonAnswer(null);
                  setLessonFeedback(null);
                }}
              >
                Next Lesson ({currentLessonId + 1}) &rarr;
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STACK & HEAP SANDBOX */}
      {activeTab === "sandbox" && (
        <div className="space-y-6">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <span className="text-xs font-mono font-semibold text-[var(--text-secondary)] mr-2">
              Memory Operations:
            </span>
            <Button variant="outline" size="sm" onClick={handleMalloc}>
              + malloc(12B)
            </Button>
            <Button variant="outline" size="sm" onClick={handleCalloc}>
              + calloc(16B)
            </Button>
            <Button variant="outline" size="sm" onClick={handleReallocInPlace}>
              realloc(+8B) [In-Place]
            </Button>
            <Button variant="outline" size="sm" onClick={handleReallocRelocate}>
              realloc(+8B) [Relocate]
            </Button>
            <Button variant="outline" size="sm" onClick={handleFree}>
              free()
            </Button>
            <div className="h-4 w-px bg-[var(--border)] mx-1" />
            <Button
              variant="outline"
              size="sm"
              onClick={handleSimulateLeak}
              className="text-amber-400 hover:text-amber-300 border-amber-500/30"
            >
              Simulate Leak
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSimulateDangling}
              className="text-red-400 hover:text-red-300 border-red-500/30"
            >
              Simulate Dangling
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset} className="ml-auto">
              <RotateCcw size={14} className="mr-1" /> Reset
            </Button>
          </div>

          {/* Interactive Playback Controller */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAnimStep((s) => Math.max(1, s - 1))}
                disabled={animStep <= 1}
              >
                <SkipBack size={13} />
              </Button>
              <Button
                size="sm"
                onClick={() => setAnimPlaying(!animPlaying)}
                className="w-24"
              >
                {animPlaying ? (
                  <>
                    <Pause size={13} className="mr-1" /> Pause
                  </>
                ) : (
                  <>
                    <Play size={13} className="mr-1" /> Play
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAnimStep((s) => Math.min(4, s + 1))}
                disabled={animStep >= 4}
              >
                <SkipForward size={13} />
              </Button>
              <span className="text-xs font-mono text-[var(--text-secondary)] ml-2">
                Step {animStep} of 4:{" "}
                <strong className="text-[var(--text-primary)]">
                  {animStep === 1
                    ? "Declare Stack Pointer"
                    : animStep === 2
                    ? "Request Heap Allocation"
                    : animStep === 3
                    ? "Store Returned Address in Pointer"
                    : "Access / Assign Heap Memory"}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[var(--text-secondary)]">Speed:</span>
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setAnimSpeed(s)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
                    animSpeed === s
                      ? "bg-[var(--primary)] text-white font-bold"
                      : "bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Warning Banner */}
          {memoryWarning && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
              <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-300 mb-1">Memory Allocation Alert</p>
                <p className="leading-relaxed">{memoryWarning}</p>
              </div>
            </div>
          )}

          {/* Dual Segment Architecture View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Call Stack Panel (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <div className="flex items-center gap-2">
                  <Cpu size={16} className="text-blue-400" />
                  <h3 className="font-['Space_Grotesk'] text-sm font-bold text-[var(--text-primary)]">
                    Call Stack (Fixed / Automatic)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                  {viewMode === "beginner" ? "Function Local Trays" : "LIFO SP: 0x7FFF0040"}
                </span>
              </div>

              {stackFrames.map((frame) => (
                <div
                  key={frame.id}
                  className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-400">
                      Frame: {frame.name}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                      {viewMode === "beginner" ? "Active Function" : "Frame Size: 32B"}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {frame.variables.map((v, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs font-mono"
                      >
                        <div>
                          <span className="text-[var(--text-secondary)]">{v.type} </span>
                          <span className="text-[var(--text-primary)] font-bold">{v.name}</span>
                        </div>
                        <div className="text-right">
                          <span
                            className={
                              v.pointsTo
                                ? "text-purple-400 font-bold"
                                : "text-emerald-400 font-semibold"
                            }
                          >
                            {v.value}
                          </span>
                          {v.pointsTo && (
                            <span className="block text-[10px] text-[var(--text-secondary)]">
                              &rarr; {viewMode === "beginner" ? "points to Heap Box" : "Heap Address"}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] text-xs text-[var(--text-secondary)] leading-relaxed">
                💡 <strong>Stack Rule:</strong> When a function returns, its frame is immediately popped off. Automatic variables inside do not survive return.
              </div>
            </div>

            {/* Heap Space Panel (7 cols) */}
            <div className="lg:col-span-7 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <div className="flex items-center gap-2">
                  <Database size={16} className="text-purple-400" />
                  <h3 className="font-['Space_Grotesk'] text-sm font-bold text-[var(--text-primary)]">
                    Heap Memory Space (Dynamic)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                  {viewMode === "beginner" ? "Shared Rental Lockers" : "Managed Free-List Heap"}
                </span>
              </div>

              <div className="space-y-3">
                {heapBlocks.map((block) => {
                  let statusBg = "bg-purple-500/10 border-purple-500/30 text-purple-300";
                  let statusLabel = "ALLOCATED";

                  if (block.isLeaked) {
                    statusBg = "bg-amber-500/10 border-amber-500/40 text-amber-300";
                    statusLabel = "LEAKED (UNREACHABLE)";
                  } else if (block.isDangling) {
                    statusBg = "bg-red-500/10 border-red-500/40 text-red-300";
                    statusLabel = "FREED (DANGLING POINTER)";
                  } else if (!block.isAllocated) {
                    statusBg = "bg-zinc-500/10 border-zinc-500/30 text-zinc-400";
                    statusLabel = "FREED (RECYCLABLE)";
                  }

                  return (
                    <div
                      key={block.id}
                      className={`rounded-xl border p-4 transition-all ${statusBg}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                            {viewMode === "beginner" ? `Locker ${block.name}` : block.address}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                            ({block.name})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)]">
                            {block.sizeBytes} Bytes &bull; {block.type}()
                          </span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--surface-elevated)]">
                            {statusLabel}
                          </span>
                        </div>
                      </div>

                      {/* Elements / Byte Cells */}
                      <div className="space-y-2 pt-1">
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                          {block.elements.map((el, i) => (
                            <div
                              key={i}
                              className={`p-2 rounded border text-center font-mono text-xs transition-all ${
                                el === "?"
                                  ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                                  : block.isAllocated
                                  ? "border-[var(--border)] bg-[var(--surface)] text-emerald-400 font-bold"
                                  : "border-[var(--border)] bg-[var(--surface)] text-zinc-500"
                              }`}
                            >
                              <span className="block text-[9px] text-[var(--text-secondary)]">
                                {viewMode === "beginner" ? `Item ${i}` : `+${i * 4}B`}
                              </span>
                              <span>{block.isAllocated ? el : 0}</span>
                            </div>
                          ))}
                        </div>

                        {/* Assign value button if uninitialized */}
                        {block.isAllocated && block.elements.some((el) => el === "?") && (
                          <div className="flex items-center gap-2 pt-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[11px] h-7"
                              onClick={() => handleAssignValue(block.id, 1, 42)}
                            >
                              Assign 42 to {block.name}[1]
                            </Button>
                            <span className="text-[10px] text-amber-300">
                              Notice: Replaces indeterminate '?' with a safe real value.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Execution Log */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3">
                <span className="text-[10px] font-mono font-bold text-[var(--text-secondary)] uppercase block mb-1.5">
                  Allocator Event Log:
                </span>
                <div className="space-y-1 font-mono text-[11px] text-[var(--text-secondary)]">
                  {logMessages.map((log, i) => (
                    <p key={i} className={i === 0 ? "text-[var(--primary)] font-semibold" : ""}>
                      &gt; {log}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SEPARATE MEMORY BUG LABS */}
      {activeTab === "bugs" && (
        <div className="space-y-6">
          {/* Bug Lab Selector */}
          <div className="flex items-center gap-2 p-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] w-fit">
            {[
              { id: "leak", label: "1. Memory Leak" },
              { id: "dangling", label: "2. Dangling Pointer" },
              { id: "use_after_free", label: "3. Use After Free" },
              { id: "double_free", label: "4. Double Free" },
            ].map((lab) => (
              <button
                key={lab.id}
                onClick={() => setBugLabMode(lab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  bugLabMode === lab.id
                    ? "bg-red-500 text-white font-semibold shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {lab.label}
              </button>
            ))}
          </div>

          {/* Active Bug Lab Canvas */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5">
            {bugLabMode === "leak" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-400">
                  <AlertTriangle size={18} />
                  <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[var(--text-primary)]">
                    Bug Lab 1: The Memory Leak
                  </h3>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  A memory leak occurs when a program allocates memory on the heap and subsequently loses its only pointer reference without calling <code>free()</code>. That memory remains reserved and unusable until the entire process terminates.
                </p>
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 font-mono text-xs text-amber-200 space-y-1">
                  <p>int *ptr = malloc(100 * sizeof(int)); // 400 bytes allocated</p>
                  <p className="text-red-400">ptr = NULL; // OOPS! The 400 bytes are now orphaned and unreachable!</p>
                </div>
                <Button size="sm" onClick={handleSimulateLeak}>
                  Demonstrate Memory Leak
                </Button>
              </div>
            )}

            {bugLabMode === "dangling" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-rose-400">
                  <ShieldAlert size={18} />
                  <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[var(--text-primary)]">
                    Bug Lab 2: The Dangling Pointer
                  </h3>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Calling <code>free(ptr)</code> tells the operating system allocator that the block may be recycled. However, it does <em>not</em> erase the address stored inside the pointer variable <code>ptr</code>. The pointer continues to store the old address, pointing to dead memory.
                </p>
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 font-mono text-xs text-rose-200 space-y-1">
                  <p>free(ptr); // Heap block is deallocated</p>
                  <p className="text-rose-400">// ptr still contains 0x10A0! It is now a Dangling Pointer.</p>
                  <p className="text-emerald-400">ptr = NULL; // Safe cure: immediately set pointer to NULL!</p>
                </div>
                <Button size="sm" onClick={handleSimulateDangling}>
                  Demonstrate Dangling Pointer
                </Button>
              </div>
            )}

            {bugLabMode === "use_after_free" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-rose-500">
                  <Bug size={18} />
                  <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[var(--text-primary)]">
                    Bug Lab 3: Use After Free (Undefined Behavior)
                  </h3>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  When a program attempts to read or write through a dangling pointer, it accesses memory that may have already been reassigned to another variable or returned to the allocator. This is classified as <strong>Undefined Behavior</strong> and is one of the leading causes of security vulnerabilities in C software.
                </p>
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 font-mono text-xs text-red-200 space-y-1">
                  <p>free(ptr);</p>
                  <p className="text-red-400">*ptr = 99; // CRITICAL BUG: Writing to freed memory!</p>
                  <p className="text-[var(--text-secondary)]">// The memory might now belong to another part of your application.</p>
                </div>
                <Button size="sm" onClick={handleSimulateUseAfterFree}>
                  Simulate Safe Use-After-Free Alert
                </Button>
              </div>
            )}

            {bugLabMode === "double_free" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-red-500">
                  <ShieldAlert size={18} />
                  <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[var(--text-primary)]">
                    Bug Lab 4: Double Free Abort
                  </h3>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Calling <code>free(ptr)</code> twice on the exact same allocation corrupts the heap allocator's internal free list. Modern C runtime libraries detect this corruption and immediately abort the process with a <code>SIGABRT</code> signal to prevent security exploits.
                </p>
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 font-mono text-xs text-red-200 space-y-1">
                  <p>free(ptr); // Successfully freed</p>
                  <p className="text-red-400">free(ptr); // CRITICAL BUG: Double free triggers immediate abort!</p>
                </div>
                <Button size="sm" onClick={handleSimulateDoubleFree}>
                  Simulate Safe Double-Free Alert
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: PREDICT */}
      {activeTab === "predict" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5">
          <div className="flex items-center gap-2">
            <HelpCircle size={18} className="text-[var(--primary)]" />
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[var(--text-primary)]">
              Prediction Challenge: Heap Allocation Failure
            </h3>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Examine this typical C allocation statement. What does the C standard guarantee happens when the host system runs out of physical or virtual memory during <code>malloc()</code>?
          </p>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 font-mono text-xs text-[var(--text-primary)]">
            <p className="text-purple-400">int* buffer = (int*)malloc(1000000000 * sizeof(int));</p>
            <p className="text-[var(--text-secondary)]">// System cannot fulfill the 4GB request</p>
          </div>

          <div className="space-y-3">
            {[
              { id: "a", text: "The program throws an OutOfMemoryException that can be caught in a try/catch block." },
              { id: "b", text: "The operating system forcibly kills the process immediately with SIGABRT." },
              { id: "c", text: "malloc() returns a NULL pointer (0x0). If dereferenced without checking, it triggers a Segmentation Fault." },
              { id: "d", text: "malloc() automatically allocates whatever memory is available and adjusts sizeof(int)." },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => handlePredictSubmit(opt.id)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all ${
                  predictionAnswer === opt.id
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 font-medium text-[var(--text-primary)]"
                    : "border-[var(--border)] bg-[var(--surface-elevated)] hover:border-[var(--primary)]/50 text-[var(--text-secondary)]"
                }`}
              >
                <span className="font-mono font-bold mr-2 uppercase">{opt.id})</span>
                {opt.text}
              </button>
            ))}
          </div>

          {predictionFeedback && (
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
                predictionFeedback.correct
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-red-500/30 bg-red-500/10 text-red-300"
              }`}
            >
              {predictionFeedback.correct ? (
                <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              ) : (
                <XCircle size={18} className="shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold mb-1">{predictionFeedback.correct ? "Spot on!" : "Not quite."}</p>
                <p>{predictionFeedback.explanation}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: DEBUG */}
      {activeTab === "debug" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Bug size={18} className="text-amber-400" />
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[var(--text-primary)]">
              Debugging Challenge: The Invisible Memory Leak
            </h3>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            The function below creates a new linked-list node. However, an analysis report shows memory consumption continuously increasing over time. Identify and apply the fix:
          </p>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 font-mono text-xs text-[var(--text-primary)] space-y-1">
            <p className="text-blue-400">void create_temp_node(int val) &#123;</p>
            <p className="pl-4 text-purple-400">struct Node* n = (struct Node*)malloc(sizeof(struct Node));</p>
            <p className="pl-4 text-emerald-400">n-&gt;data = val;</p>
            <p className="pl-4 text-emerald-400">n-&gt;next = NULL;</p>
            <p className="pl-4 text-[var(--text-secondary)]">// n goes out of scope here without being linked to the head or freed!</p>
            <p className="text-blue-400">&#125;</p>
          </div>

          <div className="space-y-3">
            {[
              {
                id: "option_a",
                text: "Change malloc to calloc so the compiler automatically frees it when returning.",
              },
              {
                id: "option_b",
                text: "Either return the pointer to the caller, link it into the active list, or call free(n) before function exit.",
              },
              {
                id: "option_c",
                text: "Set n = NULL right before the closing brace to clear the memory.",
              },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleDebugSubmit(opt.id)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all ${
                  debugChoice === opt.id
                    ? "border-emerald-500 bg-emerald-500/10 font-medium text-[var(--text-primary)]"
                    : "border-[var(--border)] bg-[var(--surface-elevated)] hover:border-[var(--primary)]/50 text-[var(--text-secondary)]"
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          {debugChoice && (
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
                debugSolved
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-red-500/30 bg-red-500/10 text-red-300"
              }`}
            >
              {debugSolved ? (
                <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              ) : (
                <XCircle size={18} className="shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold mb-1">{debugSolved ? "Bug Resolved!" : "Fix Ineffective."}</p>
                <p>
                  {debugSolved
                    ? "Setting n = NULL merely deletes the stack variable pointing to the memory, leaving the block orphaned forever. Returning it or invoking free(n) properly resolves the leak."
                    : "That action does not release the heap block. Remember that setting local pointers to NULL does not deallocate heap memory."}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: QUIZ */}
      {activeTab === "quiz" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <div className="flex items-center gap-2">
              <FileQuestion size={18} className="text-[var(--primary)]" />
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[var(--text-primary)]">
                Memory Management Assessment
              </h3>
            </div>
            {quizSubmitted && (
              <span className="text-xs font-mono font-bold text-[var(--primary)]">
                Score: {progress.quizScore} / 5
              </span>
            )}
          </div>

          {/* Q1 */}
          <div className="space-y-2 text-xs">
            <p className="font-semibold text-[var(--text-primary)]">
              1. Which memory segment is managed dynamically during runtime by malloc() and free()?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {["Stack", "Heap", "Text Segment", "Data Segment"].map((choice) => (
                <button
                  key={choice}
                  onClick={() => setQuizAnswers((p) => ({ ...p, q1: choice.toLowerCase() }))}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    quizAnswers["q1"] === choice.toLowerCase()
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--text-primary)]"
                      : "border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)]"
                  }`}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>

          {/* Q2 */}
          <div className="space-y-2 text-xs">
            <p className="font-semibold text-[var(--text-primary)]">
              2. What is the fundamental difference between malloc() and calloc()?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: "zeros", label: "calloc initializes all allocated bytes to zero" },
                { id: "stack", label: "calloc allocates memory on the stack" },
                { id: "realloc", label: "malloc can only allocate arrays" },
                { id: "speed", label: "malloc is thread-safe while calloc is not" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setQuizAnswers((p) => ({ ...p, q2: c.id }))}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    quizAnswers["q2"] === c.id
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--text-primary)]"
                      : "border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)]"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Q3 */}
          <div className="space-y-2 text-xs">
            <p className="font-semibold text-[var(--text-primary)]">
              3. Overwriting a pointer to dynamically allocated memory without calling free() causes:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: "leak", label: "A Memory Leak" },
                { id: "dangle", label: "A Dangling Pointer" },
                { id: "overflow", label: "A Stack Overflow" },
                { id: "deadlock", label: "A Thread Deadlock" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setQuizAnswers((p) => ({ ...p, q3: c.id }))}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    quizAnswers["q3"] === c.id
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--text-primary)]"
                      : "border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)]"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Q4 */}
          <div className="space-y-2 text-xs">
            <p className="font-semibold text-[var(--text-primary)]">
              4. A pointer that continues to store an address after that memory was released with free() is called:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: "dangling", label: "A Dangling Pointer" },
                { id: "wild", label: "A Wild Pointer" },
                { id: "null", label: "A NULL Pointer" },
                { id: "void", label: "A Void Pointer" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setQuizAnswers((p) => ({ ...p, q4: c.id }))}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    quizAnswers["q4"] === c.id
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--text-primary)]"
                      : "border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)]"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Q5 */}
          <div className="space-y-2 text-xs">
            <p className="font-semibold text-[var(--text-primary)]">
              5. What is the guaranteed initial state of bytes returned by malloc()?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: "indeterminate", label: "Indeterminate (uninitialized garbage values)" },
                { id: "all_zero", label: "Guaranteed all zero bytes" },
                { id: "null_ptrs", label: "All NULL pointers" },
                { id: "ascending", label: "Sequential numbers 1, 2, 3..." },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setQuizAnswers((p) => ({ ...p, q5: c.id }))}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    quizAnswers["q5"] === c.id
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--text-primary)]"
                      : "border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)]"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleQuizSubmit} className="w-full">
            Submit Assessment
          </Button>
        </div>
      )}

      {/* TAB 7: PROGRESS */}
      {activeTab === "progress" && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-6">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-[var(--primary)]" />
            <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[var(--text-primary)]">
              Topic Mastery Summary
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 text-center">
              <span className="text-[10px] uppercase font-mono text-[var(--text-secondary)]">Lessons Completed</span>
              <p className="font-['Space_Grotesk'] text-2xl font-bold text-[var(--primary)] mt-1">
                {completedLessons.length} / 8
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 text-center">
              <span className="text-[10px] uppercase font-mono text-[var(--text-secondary)]">Sandbox Operations</span>
              <p className="font-['Space_Grotesk'] text-2xl font-bold text-[var(--text-primary)] mt-1">
                {progress.sandboxActions}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 text-center">
              <span className="text-[10px] uppercase font-mono text-[var(--text-secondary)]">Predict &amp; Debug</span>
              <p className="font-['Space_Grotesk'] text-2xl font-bold text-emerald-400 mt-1">
                {(progress.predictSolved ? 1 : 0) + (progress.debugSolved ? 1 : 0)} / 2
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 text-center">
              <span className="text-[10px] uppercase font-mono text-[var(--text-secondary)]">Quiz Score</span>
              <p className="font-['Space_Grotesk'] text-2xl font-bold text-purple-400 mt-1">
                {progress.quizScore} / 5
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
