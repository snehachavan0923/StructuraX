import {
  BookOpen,
  Brain,
  Boxes,
  CircleDot,
  GitBranch,
  Hash,
  Layers,
  LayoutDashboard,
  Network,
  Share2,
  Sparkles,
  Workflow,
} from "lucide-react";

export type TopicStatus = "live" | "beta" | "planned";

export interface TopicLink {
  id: string;
  label: string;
  path: string;
  status: TopicStatus;
}

export interface TopicGroup {
  id: string;
  label: string;
  icon: typeof BookOpen;
  status: TopicStatus;
  children: TopicLink[];
}

export const APP_NAVIGATION: Array<{ label: string; items: Array<{ label: string; path: string; icon: typeof BookOpen }> }> = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { label: "Curriculum", path: "/curriculum", icon: BookOpen },
      { label: "Design System", path: "/design-system", icon: Sparkles },
    ],
  },
];

export const CURRICULUM_TOPICS: TopicGroup[] = [
  {
    id: "memory",
    label: "Memory Allocation",
    icon: Boxes,
    status: "live",
    children: [
      { id: "static-dynamic-memory", label: "Static & Dynamic Memory", path: "/learn/memory-allocation", status: "live" },
    ],
  },
  {
    id: "linked-lists",
    label: "Linked Lists",
    icon: GitBranch,
    status: "live",
    children: [
      { id: "singly-linked-list", label: "Singly Linked List", path: "/learn/singly-linked-list", status: "live" },
      { id: "doubly-linked-list", label: "Doubly Linked List", path: "/learn/doubly-linked-list", status: "live" },
      { id: "circular-linked-list", label: "Circular Linked List", path: "/learn/circular-linked-list", status: "live" },
      { id: "polynomial", label: "Polynomial Applications", path: "/learn/polynomial", status: "live" },
    ],
  },
  {
    id: "stacks",
    label: "Stacks",
    icon: Layers,
    status: "planned",
    children: [
      { id: "array-stack", label: "Array Stack", path: "/learn/array-stack", status: "planned" },
      { id: "linked-stack", label: "Linked Stack", path: "/learn/linked-stack", status: "planned" },
    ],
  },
  {
    id: "queues",
    label: "Queues",
    icon: Workflow,
    status: "planned",
    children: [
      { id: "circular-queue", label: "Circular Queue", path: "/learn/circular-queue", status: "planned" },
      { id: "deque", label: "Deque", path: "/learn/deque", status: "planned" },
    ],
  },
  {
    id: "trees",
    label: "Trees",
    icon: Network,
    status: "planned",
    children: [
      { id: "binary-tree", label: "Binary Tree", path: "/learn/binary-tree", status: "planned" },
      { id: "bst", label: "Binary Search Tree", path: "/learn/bst", status: "planned" },
    ],
  },
  {
    id: "heaps",
    label: "Heaps",
    icon: Brain,
    status: "planned",
    children: [
      { id: "min-heap", label: "Min Heap", path: "/learn/min-heap", status: "planned" },
      { id: "priority-queue", label: "Priority Queue", path: "/learn/priority-queue", status: "planned" },
    ],
  },
  {
    id: "advanced-trees",
    label: "Advanced Trees",
    icon: Share2,
    status: "planned",
    children: [
      { id: "avl", label: "AVL Tree", path: "/learn/avl", status: "planned" },
      { id: "segment-tree", label: "Segment Tree", path: "/learn/segment-tree", status: "planned" },
    ],
  },
  {
    id: "graphs",
    label: "Graphs",
    icon: CircleDot,
    status: "planned",
    children: [
      { id: "bfs-dfs", label: "BFS & DFS", path: "/learn/bfs-dfs", status: "planned" },
      { id: "dijkstra", label: "Dijkstra", path: "/learn/dijkstra", status: "planned" },
    ],
  },
  {
    id: "hashing",
    label: "Hashing",
    icon: Hash,
    status: "planned",
    children: [
      { id: "chaining", label: "Chaining", path: "/learn/chaining", status: "planned" },
      { id: "open-addressing", label: "Open Addressing", path: "/learn/open-addressing", status: "planned" },
    ],
  },
];
