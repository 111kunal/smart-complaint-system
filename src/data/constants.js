export const INITIAL_COMPLAINTS = [
  {
    id: "CMP-001",
    title: "Payment deducted, order not placed",
    description: "I paid ₹1,499 but my order was never confirmed. The amount was deducted from my account but no order ID was generated.",
    category: "Billing",
    priority: "High",
    status: "Open",
    submitter: "Riya Sharma",
    email: "riya@example.com",
    date: "2026-04-13",
    agent: "Priya Sharma",
  },
  {
    id: "CMP-002",
    title: "App crashes on checkout page",
    description: "Every time I click 'Place Order', the app crashes and I lose my cart items.",
    category: "Technical",
    priority: "High",
    status: "In Progress",
    submitter: "Aditya Mehra",
    email: "aditya@example.com",
    date: "2026-04-12",
    agent: "Priya Sharma",
  },
  {
    id: "CMP-003",
    title: "Refund not credited after 7 days",
    description: "My return was approved on April 5th but the refund hasn't arrived yet.",
    category: "Refund",
    priority: "Medium",
    status: "Pending",
    submitter: "Pooja Nair",
    email: "pooja@example.com",
    date: "2026-04-11",
    agent: "Rahul Verma",
  },
  {
    id: "CMP-004",
    title: "Package delayed by 5 days",
    description: "Estimated delivery was April 8th, still not received. No update from delivery partner.",
    category: "Delivery",
    priority: "Medium",
    status: "In Progress",
    submitter: "Karan Bose",
    email: "karan@example.com",
    date: "2026-04-10",
    agent: "Rahul Verma",
  },
  {
    id: "CMP-005",
    title: "Incorrect item received in order",
    description: "I ordered a blue shirt (size L) but received a red one in size M.",
    category: "Service",
    priority: "Low",
    status: "Resolved",
    submitter: "Sneha Gupta",
    email: "sneha@example.com",
    date: "2026-04-09",
    agent: "Aisha Khan",
  },
];

export const INITIAL_AGENTS = [
  {
    id: "AGT-001",
    name: "Priya Sharma",
    email: "priya.sharma@resolveiq.com",
    password: "priya123",
    status: "Active",
  },
  {
    id: "AGT-002",
    name: "Rahul Verma",
    email: "rahul.verma@resolveiq.com",
    password: "rahul123",
    status: "Active",
  },
  {
    id: "AGT-003",
    name: "Aisha Khan",
    email: "aisha.khan@resolveiq.com",
    password: "aisha123",
    status: "Active",
  },
];

export const CATEGORIES = ["Billing", "Technical", "Refund", "Delivery", "Service", "Other"];
export const PRIORITIES = ["High", "Medium", "Low"];
export const STATUSES = ["Open", "In Progress", "Pending", "Resolved"];

export const STATUS_STYLES = {
  Open:        "bg-red-100 text-red-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  Pending:     "bg-blue-100 text-blue-700",
  Resolved:    "bg-green-100 text-green-700",
};

export const PRIORITY_DOT = {
  High:   "bg-red-500",
  Medium: "bg-yellow-400",
  Low:    "bg-green-500",
};

export const CATEGORY_STYLES = {
  Billing:   "bg-yellow-100 text-yellow-800",
  Technical: "bg-blue-100 text-blue-800",
  Refund:    "bg-pink-100 text-pink-800",
  Delivery:  "bg-purple-100 text-purple-800",
  Service:   "bg-green-100 text-green-800",
  Other:     "bg-gray-100 text-gray-700",
};