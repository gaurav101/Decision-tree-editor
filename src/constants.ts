export interface NodeAttributes {
  [key: string]: string;
}

export interface NodeData {
  label: string;
  icon: string;
  color: string;
  colorSoft: string;
  attributes: NodeAttributes;
  children?: TreeNode[];
}

export interface TreeNode extends NodeData {
  id: string;
}

export const C = {
  bg: "#0d0f14",
  panel: "#13161e",
  panelBorder: "#1f2535",
  card: "#1a1e2a",
  cardHover: "#202536",
  accent: "#4f8ef7",
  accentSoft: "#1e3461",
  green: "#3ecf8e",
  greenSoft: "#0e3325",
  amber: "#f5a623",
  amberSoft: "#3d2a09",
  red: "#f75f5f",
  text: "#e2e8f4",
  muted: "#6b7694",
  border: "#252b3b",
};

export const TREES: Record<string, TreeNode> = {
  "Customer Support": {
    id: "root-cs",
    label: "Customer Support",
    icon: "🎧",
    color: C.accent,
    colorSoft: C.accentSoft,
    attributes: { priority: "High", owner: "Support Team", version: "2.1" },
    children: [
      {
        id: "cs-billing",
        label: "Billing Issue",
        icon: "💳",
        color: C.amber,
        colorSoft: C.amberSoft,
        attributes: { category: "Finance", sla: "4h" },
        children: [
          {
            id: "cs-billing-refund",
            label: "Request Refund",
            icon: "↩️",
            color: C.green,
            colorSoft: C.greenSoft,
            attributes: { action: "Refund", timeframe: "5-7 days" },
            children: [],
          },
          {
            id: "cs-billing-dispute",
            label: "Dispute Charge",
            icon: "⚖️",
            color: C.green,
            colorSoft: C.greenSoft,
            attributes: { action: "Dispute", timeframe: "10 days" },
            children: [],
          },
        ],
      },
      {
        id: "cs-tech",
        label: "Technical Issue",
        icon: "🔧",
        color: C.amber,
        colorSoft: C.amberSoft,
        attributes: { category: "Engineering", sla: "2h" },
        children: [
          {
            id: "cs-tech-bug",
            label: "Report Bug",
            icon: "🐛",
            color: C.green,
            colorSoft: C.greenSoft,
            attributes: { action: "Log ticket", severity: "Variable" },
            children: [],
          },
        ],
      },
    ],
  },
  "Product Onboarding": {
    id: "root-po",
    label: "Product Onboarding",
    icon: "🚀",
    color: C.green,
    colorSoft: C.greenSoft,
    attributes: { priority: "Medium", owner: "Growth Team", version: "1.4" },
    children: [
      {
        id: "po-signup",
        label: "Sign Up Flow",
        icon: "✍️",
        color: C.accent,
        colorSoft: C.accentSoft,
        attributes: { step: "1", required: "Yes" },
        children: [
          {
            id: "po-signup-email",
            label: "Email Verification",
            icon: "📧",
            color: C.amber,
            colorSoft: C.amberSoft,
            attributes: { method: "Email", expiry: "24h" },
            children: [],
          },
        ],
      },
      {
        id: "po-setup",
        label: "Initial Setup",
        icon: "⚙️",
        color: C.accent,
        colorSoft: C.accentSoft,
        attributes: { step: "2", required: "Yes" },
        children: [],
      },
    ],
  },
  "Sales Pipeline": {
    id: "root-sp",
    label: "Sales Pipeline",
    icon: "📈",
    color: C.amber,
    colorSoft: C.amberSoft,
    attributes: { priority: "Critical", owner: "Sales Team", version: "3.0" },
    children: [
      {
        id: "sp-lead",
        label: "Lead Qualification",
        icon: "🔍",
        color: C.accent,
        colorSoft: C.accentSoft,
        attributes: { stage: "1", conversion: "~30%" },
        children: [
          {
            id: "sp-lead-hot",
            label: "Hot Lead",
            icon: "🔥",
            color: C.red,
            colorSoft: "#3d1212",
            attributes: { score: ">80", action: "Call same day" },
            children: [],
          },
          {
            id: "sp-lead-warm",
            label: "Warm Lead",
            icon: "🌤️",
            color: C.green,
            colorSoft: C.greenSoft,
            attributes: { score: "50–80", action: "Email sequence" },
            children: [],
          },
        ],
      },
    ],
  },
};
