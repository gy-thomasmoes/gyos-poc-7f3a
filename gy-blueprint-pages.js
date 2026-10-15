/* gy-blueprint-pages.js - the data behind blueprint.html (15 Oct 2026).
   A Blueprint page is the same page as an agent page: the coordinator agent plus its
   workflow. One entry per Blueprint, keyed by the id in ?bp=. Generated from the v8
   Deliverable demos (comm, fm, cip, natcap), the Tender to Bid node sheet (bid) and
   placeholder steps (iqa, bfp, mra). Customer Demand Mapping is agent-demand-mapping.html. */
window.GY_BP_PAGES = {
 "comm": {
  "ag": {
   "title": "Commercial Strategy",
   "purpose": "The Commercial Strategy agent turns a finished Customer Demand Mapping into the client’s Commercial Strategy: which markets to pursue, with which buyers, and how to finance them. It drafts every chapter and asks the lead only when a person needs to decide.",
   "props": [
    [
     "Kind",
     "Coordinator agent"
    ],
    [
     "Status",
     "Draft v0.3"
    ],
    [
     "Manager",
     "Emily Churchill"
    ],
    [
     "Department",
     "Programme-wide"
    ],
    [
     "Signs off",
     "Lead"
    ],
    [
     "Runs",
     "Commercial Strategy Blueprint v0.3"
    ]
   ],
   "secs": [
    [
     "c-where",
     "Where it sits",
     [
      [
       "p",
       "A Deliverable is one run of a Blueprint in a programme. The Commercial Strategy agent runs the Commercial Strategy Deliverable: it is the lead, the one agent the team talks to. It does the agent steps and asks a person at every decision."
      ]
     ]
    ],
    [
     "c-chapters",
     "Chapters",
     [
      [
       "tbl",
       [
        "Chapter",
        "Steps",
        "Decisions"
       ],
       [
        [
         "1. Frame",
         "3",
         "1"
        ],
        [
         "2. Analyse",
         "2",
         "0"
        ],
        [
         "3. Draft",
         "3",
         "1"
        ],
        [
         "4. Decide",
         "5",
         "1"
        ]
       ],
       [
        56,
        22,
        22
       ]
      ],
      [
       "p",
       "13 steps in 4 chapters, 3 of them decisions a person makes."
      ]
     ]
    ],
    [
     "c-roles",
     "Roles",
     [
      [
       "tbl",
       [
        "Role",
        "Kind",
        "Steps"
       ],
       [
        [
         "Lead",
         "Person",
         "1.2, 1.3, 3.3, 4.1, 4.2, 4.3, 4.4"
        ],
        [
         "Advisory",
         "Person",
         "3.2"
        ],
        [
         "Commercial Strategy agent",
         "Agent",
         "1.1, 2.1, 2.2, 3.1, 4.5"
        ]
       ],
       [
        40,
        20,
        40
       ]
      ]
     ]
    ],
    [
     "c-done",
     "Done when",
     [
      [
       "p",
       "The client has a report that ranks the markets, names the buyers and says how to finance the next step, and the lead has recorded the direction they chose."
      ]
     ]
    ]
   ],
   "color": [
    "var(--dark)",
    "var(--yellow)"
   ],
   "conf": [
    [
     "Tools",
     "ti-tool",
     "var(--graybg)",
     "#766B62",
     [
      "Questionnaire",
      "PDF generator",
      "GY database save"
     ]
    ],
    [
     "Skills",
     "ti-sparkles",
     "var(--amberbg)",
     "var(--amberd)",
     [
      "Commercial Strategy writing",
      "Evidence register"
     ]
    ],
    [
     "Context",
     "ti-books",
     "#F3E8DF",
     "#8A5A3B",
     [
      "Commercial Strategy Blueprint v0.3",
      "ES rule books",
      "Sector profiles"
     ]
    ],
    [
     "Governance",
     "ti-shield-check",
     "#E1F5EE",
     "#0F6E56",
     [
      "Emily Churchill signs off before the client sees it",
      "Drafts, never sends",
      "All activity logged"
     ]
    ],
    [
     "Memory",
     "ti-history",
     "#EEEAF8",
     "#5B4BA0",
     [
      "Past Commercial Strategy runs",
      "Corrections from reviews"
     ]
    ],
    [
     "Connections",
     "ti-plug-connected",
     "var(--bluebg)",
     "var(--blued)",
     [
      "Notion",
      "Google Drive",
      "GY Data platform"
     ]
    ]
   ]
  },
  "intro": [
   "I run Commercial Strategy. I do the work first, then ask you one short question when a person needs to decide."
  ],
  "studio": {
   "kind": "coordinator",
   "id": "comm",
   "blueprint": "Commercial Strategy",
   "owner": "Emily Churchill",
   "model": "Claude Sonnet 5.5",
   "roles": [
    [
     "lead",
     "Lead",
     "person"
    ],
    [
     "advisory",
     "Advisory",
     "person"
    ],
    [
     "coord",
     "Commercial Strategy agent",
     "agent"
    ]
   ],
   "rules": [
    "Write in short, plain sentences. No jargon a land manager would not use.",
    "Never make up a buyer, a figure or a source. If you do not know, say so.",
    "Draft, never send. A person signs off anything that leaves GY."
   ],
   "wf": [
    {
     "t": "Frame",
     "s": [
      {
       "t": "Check the Demand Map",
       "ty": "agent",
       "by": "coord",
       "w": "Check the Demand Map. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Scope markets and sites",
       "ty": "person",
       "by": "lead",
       "w": "Scope markets and sites, then mark the step done."
      },
      {
       "t": "Scope agreed?",
       "ty": "decision",
       "by": "lead",
       "w": "Recommend in two sentences: go on, or go back, and why."
      }
     ]
    },
    {
     "t": "Analyse",
     "s": [
      {
       "t": "Check pre-filled buyers",
       "ty": "agent",
       "by": "coord",
       "w": "Check pre-filled buyers. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Write market chapters",
       "ty": "agent",
       "by": "coord",
       "w": "Write market chapters. Say where each fact came from, and how sure you are."
      }
     ]
    },
    {
     "t": "Draft",
     "s": [
      {
       "t": "Draft report",
       "ty": "agent",
       "by": "coord",
       "w": "Draft report. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Review draft",
       "ty": "person",
       "by": "advisory",
       "w": "Review draft, then mark the step done."
      },
      {
       "t": "Ready to issue?",
       "ty": "decision",
       "by": "lead",
       "w": "Recommend in two sentences: go on, or go back, and why."
      }
     ]
    },
    {
     "t": "Decide",
     "s": [
      {
       "t": "Issue report",
       "ty": "person",
       "by": "lead",
       "w": "Issue report, then mark the step done."
      },
      {
       "t": "Present to client",
       "ty": "person",
       "by": "lead",
       "w": "Present to client, then mark the step done."
      },
      {
       "t": "Record direction",
       "ty": "person",
       "by": "lead",
       "w": "Record direction, then mark the step done."
      },
      {
       "t": "Ready to hand off?",
       "ty": "decision",
       "by": "lead",
       "w": "Recommend in two sentences: go on, or go back, and why."
      },
      {
       "t": "Hand off, save learnings",
       "ty": "agent",
       "by": "coord",
       "w": "Hand off, save learnings. Say where each fact came from, and how sure you are."
      }
     ]
    }
   ],
   "versions": [
    {
     "v": "0.3",
     "date": "8 Oct 2026",
     "by": "Emily Churchill",
     "note": "Current version, as run in the demo",
     "runs": [
      [
       "Upper Dee",
       "commercial-strategy-v8.html"
      ]
     ]
    }
   ],
   "access": [
    {
     "name": "Andrew Rubie",
     "ini": "AR",
     "c": "#B4551F",
     "lvl": "Admin"
    },
    {
     "name": "Toon Verbeek",
     "ini": "TV",
     "c": "#0F6E56",
     "lvl": "Admin"
    },
    {
     "name": "Thomas Moes",
     "ini": "TM",
     "c": "#5B4BA0",
     "lvl": "Admin"
    },
    {
     "name": "Emily Churchill",
     "ini": "EC",
     "c": "#378ADD",
     "lvl": "Editor"
    },
    {
     "name": "Caitlin Ciceri",
     "ini": "CC",
     "c": "#1D9E75",
     "lvl": "Viewer"
    }
   ]
  }
 },
 "fm": {
  "ag": {
   "title": "Financial Model",
   "purpose": "The Financial Model agent builds the programme’s investment model: it prices each ecosystem service, runs the base and downside scenarios, reconciles the units with the Inventory and locks a version for submission.",
   "props": [
    [
     "Kind",
     "Coordinator agent"
    ],
    [
     "Status",
     "Live v2.0"
    ],
    [
     "Manager",
     "Josh Fettes"
    ],
    [
     "Department",
     "Capital"
    ],
    [
     "Signs off",
     "Modeller"
    ],
    [
     "Runs",
     "Financial Model Blueprint v2.0"
    ]
   ],
   "secs": [
    [
     "c-where",
     "Where it sits",
     [
      [
       "p",
       "A Deliverable is one run of a Blueprint in a programme. The Financial Model agent runs the Financial Model Deliverable: it is the lead, the one agent the team talks to. It does the agent steps and asks a person at every decision."
      ]
     ]
    ],
    [
     "c-chapters",
     "Chapters",
     [
      [
       "tbl",
       [
        "Chapter",
        "Steps",
        "Decisions"
       ],
       [
        [
         "1. Inputs",
         "3",
         "1"
        ],
        [
         "2. Revenue",
         "3",
         "1"
        ],
        [
         "3. Model",
         "5",
         "1"
        ],
        [
         "4. Summary",
         "3",
         "0"
        ]
       ],
       [
        56,
        22,
        22
       ]
      ],
      [
       "p",
       "14 steps in 4 chapters, 3 of them decisions a person makes."
      ]
     ]
    ],
    [
     "c-roles",
     "Roles",
     [
      [
       "tbl",
       [
        "Role",
        "Kind",
        "Steps"
       ],
       [
        [
         "Modeller",
         "Person",
         "1.2, 1.3, 2.3, 3.5, 4.2"
        ],
        [
         "Trade",
         "Person",
         "2.2"
        ],
        [
         "Capital review",
         "Person",
         "3.4"
        ],
        [
         "Financial Model agent",
         "Agent",
         "1.1, 2.1, 3.1, 3.2, 3.3, 4.1, 4.3"
        ]
       ],
       [
        40,
        20,
        40
       ]
      ]
     ]
    ],
    [
     "c-done",
     "Done when",
     [
      [
       "p",
       "A locked model with a base and downside case, prices Trade has checked, and units that match the Inventory."
      ]
     ]
    ]
   ],
   "color": [
    "var(--dark)",
    "var(--yellow)"
   ],
   "conf": [
    [
     "Tools",
     "ti-tool",
     "var(--graybg)",
     "#766B62",
     [
      "Questionnaire",
      "PDF generator",
      "GY database save"
     ]
    ],
    [
     "Skills",
     "ti-sparkles",
     "var(--amberbg)",
     "var(--amberd)",
     [
      "Financial Model writing",
      "Evidence register"
     ]
    ],
    [
     "Context",
     "ti-books",
     "#F3E8DF",
     "#8A5A3B",
     [
      "Financial Model Blueprint v2.0",
      "ES rule books",
      "Sector profiles"
     ]
    ],
    [
     "Governance",
     "ti-shield-check",
     "#E1F5EE",
     "#0F6E56",
     [
      "Josh Fettes signs off before the client sees it",
      "Drafts, never sends",
      "All activity logged"
     ]
    ],
    [
     "Memory",
     "ti-history",
     "#EEEAF8",
     "#5B4BA0",
     [
      "Past Financial Model runs",
      "Corrections from reviews"
     ]
    ],
    [
     "Connections",
     "ti-plug-connected",
     "var(--bluebg)",
     "var(--blued)",
     [
      "Notion",
      "Google Drive",
      "GY Data platform"
     ]
    ]
   ]
  },
  "intro": [
   "I run Financial Model. I do the work first, then ask you one short question when a person needs to decide."
  ],
  "studio": {
   "kind": "coordinator",
   "id": "fm",
   "blueprint": "Financial Model",
   "owner": "Josh Fettes",
   "model": "Claude Sonnet 5.5",
   "roles": [
    [
     "modeller",
     "Modeller",
     "person"
    ],
    [
     "trade",
     "Trade",
     "person"
    ],
    [
     "capital",
     "Capital review",
     "person"
    ],
    [
     "coord",
     "Financial Model agent",
     "agent"
    ]
   ],
   "rules": [
    "Write in short, plain sentences. No jargon a land manager would not use.",
    "Never make up a buyer, a figure or a source. If you do not know, say so.",
    "Draft, never send. A person signs off anything that leaves GY."
   ],
   "wf": [
    {
     "t": "Inputs",
     "s": [
      {
       "t": "Load habitat plan",
       "ty": "agent",
       "by": "coord",
       "w": "Load habitat plan. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Set scenario variables",
       "ty": "person",
       "by": "modeller",
       "w": "Set scenario variables, then mark the step done."
      },
      {
       "t": "Inputs complete?",
       "ty": "decision",
       "by": "modeller",
       "w": "Recommend in two sentences: go on, or go back, and why."
      }
     ]
    },
    {
     "t": "Revenue",
     "s": [
      {
       "t": "Price ecosystem services",
       "ty": "agent",
       "by": "coord",
       "w": "Price ecosystem services. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Check prices with Trade",
       "ty": "person",
       "by": "trade",
       "w": "Check prices with Trade, then mark the step done."
      },
      {
       "t": "Prices reliable enough?",
       "ty": "decision",
       "by": "modeller",
       "w": "Recommend in two sentences: go on, or go back, and why."
      }
     ]
    },
    {
     "t": "Model",
     "s": [
      {
       "t": "Run base scenario",
       "ty": "agent",
       "by": "coord",
       "w": "Run base scenario. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Run downside scenarios",
       "ty": "agent",
       "by": "coord",
       "w": "Run downside scenarios. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Reconcile units with Inventory",
       "ty": "agent",
       "by": "coord",
       "w": "Reconcile units with Inventory. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Capital review",
       "ty": "person",
       "by": "capital",
       "w": "Capital review, then mark the step done."
      },
      {
       "t": "Ready to lock?",
       "ty": "decision",
       "by": "modeller",
       "w": "Recommend in two sentences: go on, or go back, and why."
      }
     ]
    },
    {
     "t": "Summary",
     "s": [
      {
       "t": "Write summary",
       "ty": "agent",
       "by": "coord",
       "w": "Write summary. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Lock submission version",
       "ty": "person",
       "by": "modeller",
       "w": "Lock submission version, then mark the step done."
      },
      {
       "t": "Send outputs to data platform",
       "ty": "agent",
       "by": "coord",
       "w": "Send outputs to data platform. Say where each fact came from, and how sure you are."
      }
     ]
    }
   ],
   "versions": [
    {
     "v": "2.0",
     "date": "8 Oct 2026",
     "by": "Josh Fettes",
     "note": "Current version, as run in the demo",
     "runs": [
      [
       "Evenlode",
       "financial-model-v8.html"
      ]
     ]
    }
   ],
   "access": [
    {
     "name": "Andrew Rubie",
     "ini": "AR",
     "c": "#B4551F",
     "lvl": "Admin"
    },
    {
     "name": "Toon Verbeek",
     "ini": "TV",
     "c": "#0F6E56",
     "lvl": "Admin"
    },
    {
     "name": "Thomas Moes",
     "ini": "TM",
     "c": "#5B4BA0",
     "lvl": "Admin"
    },
    {
     "name": "Josh Fettes",
     "ini": "JF",
     "c": "#378ADD",
     "lvl": "Editor"
    },
    {
     "name": "Izzie Milligan",
     "ini": "IM",
     "c": "#1D9E75",
     "lvl": "Viewer"
    },
    {
     "name": "Kishen Singh",
     "ini": "KS",
     "c": "#C46A1E",
     "lvl": "Viewer"
    }
   ]
  }
 },
 "cip": {
  "ag": {
   "title": "Catchment Investment Plan",
   "purpose": "The Catchment Investment Plan agent prices nature-based outcomes for a catchment and turns them into a prospectus a water company can fund: outcome modules, co-benefits, a funding stack and a longlist of other buyers.",
   "props": [
    [
     "Kind",
     "Coordinator agent"
    ],
    [
     "Status",
     "Draft v0.1"
    ],
    [
     "Manager",
     "Al Maltby"
    ],
    [
     "Department",
     "Programme-wide"
    ],
    [
     "Signs off",
     "Lead"
    ],
    [
     "Runs",
     "Catchment Investment Plan Blueprint v0.1"
    ]
   ],
   "secs": [
    [
     "c-where",
     "Where it sits",
     [
      [
       "p",
       "A Deliverable is one run of a Blueprint in a programme. The Catchment Investment Plan agent runs the Catchment Investment Plan Deliverable: it is the lead, the one agent the team talks to. It does the agent steps and asks a person at every decision."
      ]
     ]
    ],
    [
     "c-chapters",
     "Chapters",
     [
      [
       "tbl",
       [
        "Chapter",
        "Steps",
        "Decisions"
       ],
       [
        [
         "1. Frame",
         "3",
         "1"
        ],
        [
         "2. Model",
         "4",
         "0"
        ],
        [
         "3. Draft",
         "3",
         "1"
        ],
        [
         "4. Agree",
         "4",
         "1"
        ]
       ],
       [
        56,
        22,
        22
       ]
      ],
      [
       "p",
       "14 steps in 4 chapters, 3 of them decisions a person makes."
      ]
     ]
    ],
    [
     "c-roles",
     "Roles",
     [
      [
       "tbl",
       [
        "Role",
        "Kind",
        "Steps"
       ],
       [
        [
         "Lead",
         "Person",
         "1.2, 1.3, 4.1"
        ],
        [
         "Reviewer",
         "Person",
         "3.2"
        ],
        [
         "Sign-off",
         "Person",
         "3.3, 4.2, 4.3"
        ],
        [
         "Catchment Investment Plan agent",
         "Agent",
         "1.1, 2.1, 2.2, 2.3, 2.4, 3.1, 4.4"
        ]
       ],
       [
        40,
        20,
        40
       ]
      ]
     ]
    ],
    [
     "c-done",
     "Done when",
     [
      [
       "p",
       "The water company has signed off a prospectus that prices each outcome and shows who else could fund it."
      ]
     ]
    ]
   ],
   "color": [
    "var(--dark)",
    "var(--yellow)"
   ],
   "conf": [
    [
     "Tools",
     "ti-tool",
     "var(--graybg)",
     "#766B62",
     [
      "Questionnaire",
      "PDF generator",
      "GY database save"
     ]
    ],
    [
     "Skills",
     "ti-sparkles",
     "var(--amberbg)",
     "var(--amberd)",
     [
      "Catchment Investment Plan writing",
      "Evidence register"
     ]
    ],
    [
     "Context",
     "ti-books",
     "#F3E8DF",
     "#8A5A3B",
     [
      "Catchment Investment Plan Blueprint v0.1",
      "ES rule books",
      "Sector profiles"
     ]
    ],
    [
     "Governance",
     "ti-shield-check",
     "#E1F5EE",
     "#0F6E56",
     [
      "Al Maltby signs off before the client sees it",
      "Drafts, never sends",
      "All activity logged"
     ]
    ],
    [
     "Memory",
     "ti-history",
     "#EEEAF8",
     "#5B4BA0",
     [
      "Past Catchment Investment Plan runs",
      "Corrections from reviews"
     ]
    ],
    [
     "Connections",
     "ti-plug-connected",
     "var(--bluebg)",
     "var(--blued)",
     [
      "Notion",
      "Google Drive",
      "GY Data platform"
     ]
    ]
   ]
  },
  "intro": [
   "I run Catchment Investment Plan. I do the work first, then ask you one short question when a person needs to decide."
  ],
  "studio": {
   "kind": "coordinator",
   "id": "cip",
   "blueprint": "Catchment Investment Plan",
   "owner": "Al Maltby",
   "model": "Claude Sonnet 5.5",
   "roles": [
    [
     "lead",
     "Lead",
     "person"
    ],
    [
     "review",
     "Reviewer",
     "person"
    ],
    [
     "signoff",
     "Sign-off",
     "person"
    ],
    [
     "coord",
     "Catchment Investment Plan agent",
     "agent"
    ]
   ],
   "rules": [
    "Write in short, plain sentences. No jargon a land manager would not use.",
    "Never make up a buyer, a figure or a source. If you do not know, say so.",
    "Draft, never send. A person signs off anything that leaves GY."
   ],
   "wf": [
    {
     "t": "Frame",
     "s": [
      {
       "t": "Check operational-area pricing",
       "ty": "agent",
       "by": "coord",
       "w": "Check operational-area pricing. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Map buyer drivers",
       "ty": "person",
       "by": "lead",
       "w": "Map buyer drivers, then mark the step done."
      },
      {
       "t": "Scope agreed?",
       "ty": "decision",
       "by": "lead",
       "w": "Recommend in two sentences: go on, or go back, and why."
      }
     ]
    },
    {
     "t": "Model",
     "s": [
      {
       "t": "Apply outcome modules",
       "ty": "agent",
       "by": "coord",
       "w": "Apply outcome modules. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Stack co-benefits",
       "ty": "agent",
       "by": "coord",
       "w": "Stack co-benefits. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Build funding stack",
       "ty": "agent",
       "by": "coord",
       "w": "Build funding stack. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Longlist other buyers",
       "ty": "agent",
       "by": "coord",
       "w": "Longlist other buyers. Say where each fact came from, and how sure you are."
      }
     ]
    },
    {
     "t": "Draft",
     "s": [
      {
       "t": "Assemble and check",
       "ty": "agent",
       "by": "coord",
       "w": "Assemble and check. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Review draft",
       "ty": "person",
       "by": "review",
       "w": "Review draft, then mark the step done."
      },
      {
       "t": "Ready to issue?",
       "ty": "decision",
       "by": "signoff",
       "w": "Recommend in two sentences: go on, or go back, and why."
      }
     ]
    },
    {
     "t": "Agree",
     "s": [
      {
       "t": "Issue prospectus",
       "ty": "person",
       "by": "lead",
       "w": "Issue prospectus, then mark the step done."
      },
      {
       "t": "Present to Anglian Water",
       "ty": "person",
       "by": "signoff",
       "w": "Present to Anglian Water, then mark the step done."
      },
      {
       "t": "Anglian signed off?",
       "ty": "decision",
       "by": "signoff",
       "w": "Recommend in two sentences: go on, or go back, and why."
      },
      {
       "t": "Save learnings",
       "ty": "agent",
       "by": "coord",
       "w": "Save learnings. Say where each fact came from, and how sure you are."
      }
     ]
    }
   ],
   "versions": [
    {
     "v": "0.1",
     "date": "8 Oct 2026",
     "by": "Al Maltby",
     "note": "Current version, as run in the demo",
     "runs": [
      [
       "North Norfolk Rivers",
       "catchment-investment-plan-v8.html"
      ]
     ]
    }
   ],
   "access": [
    {
     "name": "Andrew Rubie",
     "ini": "AR",
     "c": "#B4551F",
     "lvl": "Admin"
    },
    {
     "name": "Toon Verbeek",
     "ini": "TV",
     "c": "#0F6E56",
     "lvl": "Admin"
    },
    {
     "name": "Thomas Moes",
     "ini": "TM",
     "c": "#5B4BA0",
     "lvl": "Admin"
    },
    {
     "name": "Lola Grundmann",
     "ini": "LG",
     "c": "#378ADD",
     "lvl": "Viewer"
    },
    {
     "name": "Archie Ruggles-Brise",
     "ini": "AR",
     "c": "#1D9E75",
     "lvl": "Viewer"
    },
    {
     "name": "Al Maltby",
     "ini": "AM",
     "c": "#C46A1E",
     "lvl": "Editor"
    }
   ]
  }
 },
 "natcap": {
  "ag": {
   "title": "NatCap 101",
   "purpose": "The NatCap 101 agent builds a Natural Capital 101 deck for one programme: what the land can sell, to whom, and the evidence behind each number, assembled from the slide library and tailored to the client.",
   "props": [
    [
     "Kind",
     "Coordinator agent"
    ],
    [
     "Status",
     "Draft v0.1"
    ],
    [
     "Manager",
     "Caitlin Ciceri"
    ],
    [
     "Department",
     "Advisory"
    ],
    [
     "Signs off",
     "Champion"
    ],
    [
     "Runs",
     "NatCap 101 Blueprint v0.1"
    ]
   ],
   "secs": [
    [
     "c-where",
     "Where it sits",
     [
      [
       "p",
       "A Deliverable is one run of a Blueprint in a programme. The NatCap 101 agent runs the NatCap 101 Deliverable: it is the lead, the one agent the team talks to. It does the agent steps and asks a person at every decision."
      ]
     ]
    ],
    [
     "c-chapters",
     "Chapters",
     [
      [
       "tbl",
       [
        "Chapter",
        "Steps",
        "Decisions"
       ],
       [
        [
         "1. Frame",
         "2",
         "1"
        ],
        [
         "2. Evidence",
         "5",
         "0"
        ],
        [
         "3. Build",
         "4",
         "0"
        ],
        [
         "4. Review",
         "3",
         "1"
        ],
        [
         "5. Present",
         "3",
         "0"
        ]
       ],
       [
        56,
        22,
        22
       ]
      ],
      [
       "p",
       "17 steps in 5 chapters, 2 of them decisions a person makes."
      ]
     ]
    ],
    [
     "c-roles",
     "Roles",
     [
      [
       "tbl",
       [
        "Role",
        "Kind",
        "Steps"
       ],
       [
        [
         "Champion",
         "Person",
         "1.1, 1.2, 3.3, 4.2, 4.3, 5.1"
        ],
        [
         "Maps",
         "Person",
         "2.2"
        ],
        [
         "Design",
         "Person",
         "3.4"
        ],
        [
         "NatCap 101 agent",
         "Agent",
         "2.1, 2.3, 2.4, 2.5, 3.1, 3.2, 4.1, 5.2, 5.3"
        ]
       ],
       [
        40,
        20,
        40
       ]
      ]
     ]
    ],
    [
     "c-done",
     "Done when",
     [
      [
       "p",
       "A presented deck where every figure traces to the evidence register, and library updates proposed from what changed."
      ]
     ]
    ]
   ],
   "color": [
    "var(--dark)",
    "var(--yellow)"
   ],
   "conf": [
    [
     "Tools",
     "ti-tool",
     "var(--graybg)",
     "#766B62",
     [
      "Questionnaire",
      "PDF generator",
      "GY database save"
     ]
    ],
    [
     "Skills",
     "ti-sparkles",
     "var(--amberbg)",
     "var(--amberd)",
     [
      "NatCap 101 writing",
      "Evidence register"
     ]
    ],
    [
     "Context",
     "ti-books",
     "#F3E8DF",
     "#8A5A3B",
     [
      "NatCap 101 Blueprint v0.1",
      "ES rule books",
      "Sector profiles"
     ]
    ],
    [
     "Governance",
     "ti-shield-check",
     "#E1F5EE",
     "#0F6E56",
     [
      "Caitlin Ciceri signs off before the client sees it",
      "Drafts, never sends",
      "All activity logged"
     ]
    ],
    [
     "Memory",
     "ti-history",
     "#EEEAF8",
     "#5B4BA0",
     [
      "Past NatCap 101 runs",
      "Corrections from reviews"
     ]
    ],
    [
     "Connections",
     "ti-plug-connected",
     "var(--bluebg)",
     "var(--blued)",
     [
      "Notion",
      "Google Drive",
      "GY Data platform"
     ]
    ]
   ]
  },
  "intro": [
   "I run NatCap 101. I do the work first, then ask you one short question when a person needs to decide."
  ],
  "studio": {
   "kind": "coordinator",
   "id": "natcap",
   "blueprint": "NatCap 101",
   "owner": "Caitlin Ciceri",
   "model": "Claude Sonnet 5.5",
   "roles": [
    [
     "champion",
     "Champion",
     "person"
    ],
    [
     "maps",
     "Maps",
     "person"
    ],
    [
     "design",
     "Design",
     "person"
    ],
    [
     "coord",
     "NatCap 101 agent",
     "agent"
    ]
   ],
   "rules": [
    "Write in short, plain sentences. No jargon a land manager would not use.",
    "Never make up a buyer, a figure or a source. If you do not know, say so.",
    "Draft, never send. A person signs off anything that leaves GY."
   ],
   "wf": [
    {
     "t": "Frame",
     "s": [
      {
       "t": "Set brief",
       "ty": "person",
       "by": "champion",
       "w": "Set brief, then mark the step done."
      },
      {
       "t": "Which services go in?",
       "ty": "decision",
       "by": "champion",
       "w": "Recommend in two sentences: go on, or go back, and why."
      }
     ]
    },
    {
     "t": "Evidence",
     "s": [
      {
       "t": "Pull programme facts",
       "ty": "agent",
       "by": "coord",
       "w": "Pull programme facts. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Produce maps",
       "ty": "person",
       "by": "maps",
       "w": "Produce maps, then mark the step done."
      },
      {
       "t": "Check demand evidence",
       "ty": "agent",
       "by": "coord",
       "w": "Check demand evidence. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Estimate indicative revenue",
       "ty": "agent",
       "by": "coord",
       "w": "Estimate indicative revenue. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Build evidence register",
       "ty": "agent",
       "by": "coord",
       "w": "Build evidence register. Say where each fact came from, and how sure you are."
      }
     ]
    },
    {
     "t": "Build",
     "s": [
      {
       "t": "Assemble from library",
       "ty": "agent",
       "by": "coord",
       "w": "Assemble from library. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Write programme slides",
       "ty": "agent",
       "by": "coord",
       "w": "Write programme slides. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Tailor library slides",
       "ty": "person",
       "by": "champion",
       "w": "Tailor library slides, then mark the step done."
      },
      {
       "t": "Design pass",
       "ty": "person",
       "by": "design",
       "w": "Design pass, then mark the step done."
      }
     ]
    },
    {
     "t": "Review",
     "s": [
      {
       "t": "Reconcile figures",
       "ty": "agent",
       "by": "coord",
       "w": "Reconcile figures. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Check confidentiality",
       "ty": "person",
       "by": "champion",
       "w": "Check confidentiality, then mark the step done."
      },
      {
       "t": "Ready to present?",
       "ty": "decision",
       "by": "champion",
       "w": "Recommend in two sentences: go on, or go back, and why."
      }
     ]
    },
    {
     "t": "Present",
     "s": [
      {
       "t": "Present deck",
       "ty": "person",
       "by": "champion",
       "w": "Present deck, then mark the step done."
      },
      {
       "t": "Record outcome",
       "ty": "agent",
       "by": "coord",
       "w": "Record outcome. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Propose library updates",
       "ty": "agent",
       "by": "coord",
       "w": "Propose library updates. Say where each fact came from, and how sure you are."
      }
     ]
    }
   ],
   "versions": [
    {
     "v": "0.1",
     "date": "8 Oct 2026",
     "by": "Caitlin Ciceri",
     "note": "Current version, as run in the demo",
     "runs": [
      [
       "Walkham Valley",
       "natcap-101-v8.html"
      ]
     ]
    }
   ],
   "access": [
    {
     "name": "Andrew Rubie",
     "ini": "AR",
     "c": "#B4551F",
     "lvl": "Admin"
    },
    {
     "name": "Toon Verbeek",
     "ini": "TV",
     "c": "#0F6E56",
     "lvl": "Admin"
    },
    {
     "name": "Thomas Moes",
     "ini": "TM",
     "c": "#5B4BA0",
     "lvl": "Admin"
    },
    {
     "name": "Caitlin Ciceri",
     "ini": "CC",
     "c": "#378ADD",
     "lvl": "Editor"
    },
    {
     "name": "Catia Coelho",
     "ini": "CC",
     "c": "#1D9E75",
     "lvl": "Viewer"
    },
    {
     "name": "Martha Sayeed",
     "ini": "MS",
     "c": "#C46A1E",
     "lvl": "Viewer"
    }
   ]
  }
 },
 "bid": {
  "ag": {
   "title": "Tender to Bid",
   "purpose": "The Tender to Bid agent turns a tender into a bid with a go or no-go: it logs the opportunity, collates the tender pack, scores fit and effort, and assembles the bid from the answer bank for the bid lead to submit.",
   "props": [
    [
     "Kind",
     "Coordinator agent"
    ],
    [
     "Status",
     "Sandbox v0.1"
    ],
    [
     "Manager",
     "Archie Ruggles-Brise"
    ],
    [
     "Department",
     "Programme-wide"
    ],
    [
     "Signs off",
     "Champion"
    ],
    [
     "Runs",
     "Tender to Bid Blueprint v0.1"
    ]
   ],
   "secs": [
    [
     "c-where",
     "Where it sits",
     [
      [
       "p",
       "A Deliverable is one run of a Blueprint in a programme. The Tender to Bid agent runs the Tender to Bid Deliverable: it is the lead, the one agent the team talks to. It does the agent steps and asks a person at every decision."
      ]
     ]
    ],
    [
     "c-chapters",
     "Chapters",
     [
      [
       "tbl",
       [
        "Chapter",
        "Steps",
        "Decisions"
       ],
       [
        [
         "1. Source",
         "3",
         "1"
        ],
        [
         "2. Qualify",
         "3",
         "1"
        ],
        [
         "3. Respond",
         "4",
         "1"
        ],
        [
         "4. Learn",
         "2",
         "1"
        ]
       ],
       [
        56,
        22,
        22
       ]
      ],
      [
       "p",
       "12 steps in 4 chapters, 4 of them decisions a person makes."
      ]
     ]
    ],
    [
     "c-roles",
     "Roles",
     [
      [
       "tbl",
       [
        "Role",
        "Kind",
        "Steps"
       ],
       [
        [
         "Champion",
         "Person",
         "1.2, 1.3, 4.1, 4.2"
        ],
        [
         "Vertical lead",
         "Person",
         "2.3, 3.3"
        ],
        [
         "Bid lead",
         "Person",
         "3.4"
        ],
        [
         "Pricing lead",
         "Person",
         "3.2"
        ],
        [
         "Tender to Bid agent",
         "Agent",
         "1.1, 2.1, 2.2, 3.1"
        ]
       ],
       [
        40,
        20,
        40
       ]
      ]
     ]
    ],
    [
     "c-done",
     "Done when",
     [
      [
       "p",
       "A submitted bid, or a recorded no-bid with its rationale, and a lessons entry after the outcome."
      ]
     ]
    ]
   ],
   "color": [
    "var(--dark)",
    "var(--yellow)"
   ],
   "conf": [
    [
     "Tools",
     "ti-tool",
     "var(--graybg)",
     "#766B62",
     [
      "Questionnaire",
      "PDF generator",
      "GY database save"
     ]
    ],
    [
     "Skills",
     "ti-sparkles",
     "var(--amberbg)",
     "var(--amberd)",
     [
      "Tender to Bid writing",
      "Evidence register"
     ]
    ],
    [
     "Context",
     "ti-books",
     "#F3E8DF",
     "#8A5A3B",
     [
      "Tender to Bid Blueprint v0.1",
      "ES rule books",
      "Sector profiles"
     ]
    ],
    [
     "Governance",
     "ti-shield-check",
     "#E1F5EE",
     "#0F6E56",
     [
      "Archie Ruggles-Brise signs off before the client sees it",
      "Drafts, never sends",
      "All activity logged"
     ]
    ],
    [
     "Memory",
     "ti-history",
     "#EEEAF8",
     "#5B4BA0",
     [
      "Past Tender to Bid runs",
      "Corrections from reviews"
     ]
    ],
    [
     "Connections",
     "ti-plug-connected",
     "var(--bluebg)",
     "var(--blued)",
     [
      "Notion",
      "Google Drive",
      "GY Data platform"
     ]
    ]
   ]
  },
  "intro": [
   "I run Tender to Bid. I do the work first, then ask you one short question when a person needs to decide."
  ],
  "studio": {
   "kind": "coordinator",
   "id": "bid",
   "blueprint": "Tender to Bid",
   "owner": "Archie Ruggles-Brise",
   "model": "Claude Sonnet 5.5",
   "roles": [
    [
     "champion",
     "Champion",
     "person"
    ],
    [
     "vertical",
     "Vertical lead",
     "person"
    ],
    [
     "bidlead",
     "Bid lead",
     "person"
    ],
    [
     "pricing",
     "Pricing lead",
     "person"
    ],
    [
     "coord",
     "Tender to Bid agent",
     "agent"
    ]
   ],
   "rules": [
    "Write in short, plain sentences. No jargon a land manager would not use.",
    "Never make up a buyer, a figure or a source. If you do not know, say so.",
    "Draft, never send. A person signs off anything that leaves GY."
   ],
   "wf": [
    {
     "t": "Source",
     "s": [
      {
       "t": "Log opportunity",
       "ty": "agent",
       "by": "coord",
       "w": "Log opportunity. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Triage",
       "ty": "person",
       "by": "champion",
       "w": "Triage, then mark the step done."
      },
      {
       "t": "Sign off call",
       "ty": "decision",
       "by": "champion",
       "w": "Recommend in two sentences: go on, or go back, and why."
      }
     ]
    },
    {
     "t": "Qualify",
     "s": [
      {
       "t": "Collate tender pack",
       "ty": "agent",
       "by": "coord",
       "w": "Collate tender pack. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Score",
       "ty": "agent",
       "by": "coord",
       "w": "Score. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Sign off pursuit",
       "ty": "decision",
       "by": "vertical",
       "w": "Recommend in two sentences: go on, or go back, and why."
      }
     ]
    },
    {
     "t": "Respond",
     "s": [
      {
       "t": "Assemble the bid",
       "ty": "agent",
       "by": "coord",
       "w": "Assemble the bid. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Price the bid",
       "ty": "person",
       "by": "pricing",
       "w": "Price the bid, then mark the step done."
      },
      {
       "t": "Sign off bid",
       "ty": "decision",
       "by": "vertical",
       "w": "Recommend in two sentences: go on, or go back, and why."
      },
      {
       "t": "Submit",
       "ty": "person",
       "by": "bidlead",
       "w": "Submit, then mark the step done."
      }
     ]
    },
    {
     "t": "Learn",
     "s": [
      {
       "t": "Learn",
       "ty": "person",
       "by": "champion",
       "w": "Learn, then mark the step done."
      },
      {
       "t": "Outcome",
       "ty": "decision",
       "by": "champion",
       "w": "Recommend in two sentences: go on, or go back, and why."
      }
     ]
    }
   ],
   "versions": [
    {
     "v": "0.1",
     "date": "8 Oct 2026",
     "by": "Archie Ruggles-Brise",
     "note": "Current version, as run in the demo",
     "runs": []
    }
   ],
   "access": [
    {
     "name": "Andrew Rubie",
     "ini": "AR",
     "c": "#B4551F",
     "lvl": "Admin"
    },
    {
     "name": "Toon Verbeek",
     "ini": "TV",
     "c": "#0F6E56",
     "lvl": "Admin"
    },
    {
     "name": "Thomas Moes",
     "ini": "TM",
     "c": "#5B4BA0",
     "lvl": "Admin"
    },
    {
     "name": "Archie Ruggles-Brise",
     "ini": "AR",
     "c": "#378ADD",
     "lvl": "Editor"
    }
   ]
  }
 },
 "iqa": {
  "ag": {
   "title": "Investor Q&A Log",
   "purpose": "The Investor Q&A Log agent keeps canonical answers to investor questions and reuses them across raises: it logs each question, drafts an answer from the canon and flags answers that have gone stale.",
   "props": [
    [
     "Kind",
     "Coordinator agent"
    ],
    [
     "Status",
     "Sandbox v1.3"
    ],
    [
     "Manager",
     "Capital lead"
    ],
    [
     "Department",
     "Capital"
    ],
    [
     "Signs off",
     "Capital lead"
    ],
    [
     "Runs",
     "Investor Q&A Log Blueprint v1.3"
    ]
   ],
   "secs": [
    [
     "c-where",
     "Where it sits",
     [
      [
       "p",
       "A Deliverable is one run of a Blueprint in a programme. The Investor Q&A Log agent runs the Investor Q&A Log Deliverable: it is the lead, the one agent the team talks to. It does the agent steps and asks a person at every decision."
      ]
     ]
    ],
    [
     "c-chapters",
     "Chapters",
     [
      [
       "tbl",
       [
        "Chapter",
        "Steps",
        "Decisions"
       ],
       [
        [
         "1. Collect",
         "2",
         "0"
        ],
        [
         "2. Answer",
         "3",
         "1"
        ],
        [
         "3. Reuse",
         "2",
         "0"
        ]
       ],
       [
        56,
        22,
        22
       ]
      ],
      [
       "p",
       "7 steps in 3 chapters, 1 of them decisions a person makes."
      ]
     ]
    ],
    [
     "c-roles",
     "Roles",
     [
      [
       "tbl",
       [
        "Role",
        "Kind",
        "Steps"
       ],
       [
        [
         "Capital lead",
         "Person",
         "2.2, 2.3"
        ],
        [
         "Investor Q&A Log agent",
         "Agent",
         "1.1, 1.2, 2.1, 3.1, 3.2"
        ]
       ],
       [
        40,
        20,
        40
       ]
      ]
     ]
    ],
    [
     "c-done",
     "Done when",
     [
      [
       "p",
       "Every investor question has an approved answer in the canon, with its source and the date it was last checked."
      ]
     ]
    ],
    [
     "c-open",
     "Open questions",
     [
      [
       "q",
       [
        "The steps are a first sketch: there is no agreed step list for this Blueprint yet.",
        "Who owns it, and who signs off each decision?"
       ]
      ]
     ]
    ]
   ],
   "color": [
    "var(--dark)",
    "var(--yellow)"
   ],
   "conf": [
    [
     "Tools",
     "ti-tool",
     "var(--graybg)",
     "#766B62",
     [
      "Questionnaire",
      "PDF generator",
      "GY database save"
     ]
    ],
    [
     "Skills",
     "ti-sparkles",
     "var(--amberbg)",
     "var(--amberd)",
     [
      "Investor Q&A Log writing",
      "Evidence register"
     ]
    ],
    [
     "Context",
     "ti-books",
     "#F3E8DF",
     "#8A5A3B",
     [
      "Investor Q&A Log Blueprint v1.3",
      "ES rule books",
      "Sector profiles"
     ]
    ],
    [
     "Governance",
     "ti-shield-check",
     "#E1F5EE",
     "#0F6E56",
     [
      "Capital lead signs off before the client sees it",
      "Drafts, never sends",
      "All activity logged"
     ]
    ],
    [
     "Memory",
     "ti-history",
     "#EEEAF8",
     "#5B4BA0",
     [
      "Past Investor Q&A Log runs",
      "Corrections from reviews"
     ]
    ],
    [
     "Connections",
     "ti-plug-connected",
     "var(--bluebg)",
     "var(--blued)",
     [
      "Notion",
      "Google Drive",
      "GY Data platform"
     ]
    ]
   ]
  },
  "intro": [
   "I run Investor Q&A Log. I do the work first, then ask you one short question when a person needs to decide."
  ],
  "studio": {
   "kind": "coordinator",
   "id": "iqa",
   "blueprint": "Investor Q&A Log",
   "owner": "Capital lead",
   "model": "Claude Sonnet 5.5",
   "roles": [
    [
     "capital",
     "Capital lead",
     "person"
    ],
    [
     "coord",
     "Investor Q&A Log agent",
     "agent"
    ]
   ],
   "rules": [
    "Write in short, plain sentences. No jargon a land manager would not use.",
    "Never make up a buyer, a figure or a source. If you do not know, say so.",
    "Draft, never send. A person signs off anything that leaves GY."
   ],
   "wf": [
    {
     "t": "Collect",
     "s": [
      {
       "t": "Log investor questions",
       "ty": "agent",
       "by": "coord",
       "w": "Log investor questions. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Tag by theme",
       "ty": "agent",
       "by": "coord",
       "w": "Tag by theme. Say where each fact came from, and how sure you are."
      }
     ]
    },
    {
     "t": "Answer",
     "s": [
      {
       "t": "Draft answer from canon",
       "ty": "agent",
       "by": "coord",
       "w": "Draft answer from canon. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Review answers",
       "ty": "person",
       "by": "capital",
       "w": "Review answers, then mark the step done."
      },
      {
       "t": "Answers approved?",
       "ty": "decision",
       "by": "capital",
       "w": "Recommend in two sentences: go on, or go back, and why."
      }
     ]
    },
    {
     "t": "Reuse",
     "s": [
      {
       "t": "Add to the canon",
       "ty": "agent",
       "by": "coord",
       "w": "Add to the canon. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Flag stale answers",
       "ty": "agent",
       "by": "coord",
       "w": "Flag stale answers. Say where each fact came from, and how sure you are."
      }
     ]
    }
   ],
   "versions": [
    {
     "v": "1.3",
     "date": "30 Sep 2026",
     "by": "Capital lead",
     "note": "Placeholder steps for the prototype",
     "runs": []
    }
   ],
   "access": [
    {
     "name": "Andrew Rubie",
     "ini": "AR",
     "c": "#B4551F",
     "lvl": "Admin"
    },
    {
     "name": "Toon Verbeek",
     "ini": "TV",
     "c": "#0F6E56",
     "lvl": "Admin"
    },
    {
     "name": "Thomas Moes",
     "ini": "TM",
     "c": "#5B4BA0",
     "lvl": "Admin"
    }
   ]
  }
 },
 "bfp": {
  "ag": {
   "title": "Blended Finance Plan",
   "purpose": "The Blended Finance Plan agent designs how a programme is financed: it maps public, philanthropic and private capital against the funding needs from the financial model and drafts the plan.",
   "props": [
    [
     "Kind",
     "Coordinator agent"
    ],
    [
     "Status",
     "Draft v1.2"
    ],
    [
     "Manager",
     "Emily Churchill"
    ],
    [
     "Department",
     "Advisory"
    ],
    [
     "Signs off",
     "Capital lead"
    ],
    [
     "Runs",
     "Blended Finance Plan Blueprint v1.2"
    ]
   ],
   "secs": [
    [
     "c-where",
     "Where it sits",
     [
      [
       "p",
       "A Deliverable is one run of a Blueprint in a programme. The Blended Finance Plan agent runs the Blended Finance Plan Deliverable: it is the lead, the one agent the team talks to. It does the agent steps and asks a person at every decision."
      ]
     ]
    ],
    [
     "c-chapters",
     "Chapters",
     [
      [
       "tbl",
       [
        "Chapter",
        "Steps",
        "Decisions"
       ],
       [
        [
         "1. Frame",
         "3",
         "1"
        ],
        [
         "2. Structure",
         "3",
         "0"
        ],
        [
         "3. Write",
         "2",
         "1"
        ]
       ],
       [
        56,
        22,
        22
       ]
      ],
      [
       "p",
       "8 steps in 3 chapters, 2 of them decisions a person makes."
      ]
     ]
    ],
    [
     "c-roles",
     "Roles",
     [
      [
       "tbl",
       [
        "Role",
        "Kind",
        "Steps"
       ],
       [
        [
         "Capital lead",
         "Person",
         "1.2, 1.3, 2.3"
        ],
        [
         "Advisory lead",
         "Person",
         "3.2"
        ],
        [
         "Blended Finance Plan agent",
         "Agent",
         "1.1, 2.1, 2.2, 3.1"
        ]
       ],
       [
        40,
        20,
        40
       ]
      ]
     ]
    ],
    [
     "c-done",
     "Done when",
     [
      [
       "p",
       "A plan that covers the funding need, with each source of capital named and its terms explained."
      ]
     ]
    ],
    [
     "c-open",
     "Open questions",
     [
      [
       "q",
       [
        "The steps are a first sketch: there is no agreed step list for this Blueprint yet.",
        "Who owns it, and who signs off each decision?"
       ]
      ]
     ]
    ]
   ],
   "color": [
    "var(--dark)",
    "var(--yellow)"
   ],
   "conf": [
    [
     "Tools",
     "ti-tool",
     "var(--graybg)",
     "#766B62",
     [
      "Questionnaire",
      "PDF generator",
      "GY database save"
     ]
    ],
    [
     "Skills",
     "ti-sparkles",
     "var(--amberbg)",
     "var(--amberd)",
     [
      "Blended Finance Plan writing",
      "Evidence register"
     ]
    ],
    [
     "Context",
     "ti-books",
     "#F3E8DF",
     "#8A5A3B",
     [
      "Blended Finance Plan Blueprint v1.2",
      "ES rule books",
      "Sector profiles"
     ]
    ],
    [
     "Governance",
     "ti-shield-check",
     "#E1F5EE",
     "#0F6E56",
     [
      "Emily Churchill signs off before the client sees it",
      "Drafts, never sends",
      "All activity logged"
     ]
    ],
    [
     "Memory",
     "ti-history",
     "#EEEAF8",
     "#5B4BA0",
     [
      "Past Blended Finance Plan runs",
      "Corrections from reviews"
     ]
    ],
    [
     "Connections",
     "ti-plug-connected",
     "var(--bluebg)",
     "var(--blued)",
     [
      "Notion",
      "Google Drive",
      "GY Data platform"
     ]
    ]
   ]
  },
  "intro": [
   "I run Blended Finance Plan. I do the work first, then ask you one short question when a person needs to decide."
  ],
  "studio": {
   "kind": "coordinator",
   "id": "bfp",
   "blueprint": "Blended Finance Plan",
   "owner": "Emily Churchill",
   "model": "Claude Sonnet 5.5",
   "roles": [
    [
     "capital",
     "Capital lead",
     "person"
    ],
    [
     "advisory",
     "Advisory lead",
     "person"
    ],
    [
     "coord",
     "Blended Finance Plan agent",
     "agent"
    ]
   ],
   "rules": [
    "Write in short, plain sentences. No jargon a land manager would not use.",
    "Never make up a buyer, a figure or a source. If you do not know, say so.",
    "Draft, never send. A person signs off anything that leaves GY."
   ],
   "wf": [
    {
     "t": "Frame",
     "s": [
      {
       "t": "Load financial model",
       "ty": "agent",
       "by": "coord",
       "w": "Load financial model. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Set funding needs",
       "ty": "person",
       "by": "capital",
       "w": "Set funding needs, then mark the step done."
      },
      {
       "t": "Needs agreed?",
       "ty": "decision",
       "by": "capital",
       "w": "Recommend in two sentences: go on, or go back, and why."
      }
     ]
    },
    {
     "t": "Structure",
     "s": [
      {
       "t": "Map capital sources",
       "ty": "agent",
       "by": "coord",
       "w": "Map capital sources. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Design the stack",
       "ty": "agent",
       "by": "coord",
       "w": "Design the stack. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Capital review",
       "ty": "person",
       "by": "capital",
       "w": "Capital review, then mark the step done."
      }
     ]
    },
    {
     "t": "Write",
     "s": [
      {
       "t": "Draft the plan",
       "ty": "agent",
       "by": "coord",
       "w": "Draft the plan. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Ready to issue?",
       "ty": "decision",
       "by": "advisory",
       "w": "Recommend in two sentences: go on, or go back, and why."
      }
     ]
    }
   ],
   "versions": [
    {
     "v": "1.2",
     "date": "30 Sep 2026",
     "by": "Emily Churchill",
     "note": "Placeholder steps for the prototype",
     "runs": []
    }
   ],
   "access": [
    {
     "name": "Andrew Rubie",
     "ini": "AR",
     "c": "#B4551F",
     "lvl": "Admin"
    },
    {
     "name": "Toon Verbeek",
     "ini": "TV",
     "c": "#0F6E56",
     "lvl": "Admin"
    },
    {
     "name": "Thomas Moes",
     "ini": "TM",
     "c": "#5B4BA0",
     "lvl": "Admin"
    },
    {
     "name": "Emily Churchill",
     "ini": "EC",
     "c": "#378ADD",
     "lvl": "Editor"
    }
   ]
  }
 },
 "mra": {
  "ag": {
   "title": "Market Readiness",
   "purpose": "The Market Readiness agent turns the NatWest market report into a recurring Deliverable: it pulls market data and buyer signals, scores readiness per market and writes the report for Trade to issue.",
   "props": [
    [
     "Kind",
     "Coordinator agent"
    ],
    [
     "Status",
     "Draft v1.0"
    ],
    [
     "Manager",
     "Alex Godfrey"
    ],
    [
     "Department",
     "Trade"
    ],
    [
     "Signs off",
     "Trade lead"
    ],
    [
     "Runs",
     "Market Readiness Blueprint v1.0"
    ]
   ],
   "secs": [
    [
     "c-where",
     "Where it sits",
     [
      [
       "p",
       "A Deliverable is one run of a Blueprint in a programme. The Market Readiness agent runs the Market Readiness Deliverable: it is the lead, the one agent the team talks to. It does the agent steps and asks a person at every decision."
      ]
     ]
    ],
    [
     "c-chapters",
     "Chapters",
     [
      [
       "tbl",
       [
        "Chapter",
        "Steps",
        "Decisions"
       ],
       [
        [
         "1. Gather",
         "2",
         "0"
        ],
        [
         "2. Assess",
         "3",
         "1"
        ],
        [
         "3. Publish",
         "2",
         "0"
        ]
       ],
       [
        56,
        22,
        22
       ]
      ],
      [
       "p",
       "7 steps in 3 chapters, 1 of them decisions a person makes."
      ]
     ]
    ],
    [
     "c-roles",
     "Roles",
     [
      [
       "tbl",
       [
        "Role",
        "Kind",
        "Steps"
       ],
       [
        [
         "Trade lead",
         "Person",
         "2.2, 2.3, 3.2"
        ],
        [
         "Market Readiness agent",
         "Agent",
         "1.1, 1.2, 2.1, 3.1"
        ]
       ],
       [
        40,
        20,
        40
       ]
      ]
     ]
    ],
    [
     "c-done",
     "Done when",
     [
      [
       "p",
       "A report that scores each market, agreed with Trade and issued on schedule."
      ]
     ]
    ],
    [
     "c-open",
     "Open questions",
     [
      [
       "q",
       [
        "The steps are a first sketch: there is no agreed step list for this Blueprint yet.",
        "Who owns it, and who signs off each decision?"
       ]
      ]
     ]
    ]
   ],
   "color": [
    "var(--dark)",
    "var(--yellow)"
   ],
   "conf": [
    [
     "Tools",
     "ti-tool",
     "var(--graybg)",
     "#766B62",
     [
      "Questionnaire",
      "PDF generator",
      "GY database save"
     ]
    ],
    [
     "Skills",
     "ti-sparkles",
     "var(--amberbg)",
     "var(--amberd)",
     [
      "Market Readiness writing",
      "Evidence register"
     ]
    ],
    [
     "Context",
     "ti-books",
     "#F3E8DF",
     "#8A5A3B",
     [
      "Market Readiness Blueprint v1.0",
      "ES rule books",
      "Sector profiles"
     ]
    ],
    [
     "Governance",
     "ti-shield-check",
     "#E1F5EE",
     "#0F6E56",
     [
      "Alex Godfrey signs off before the client sees it",
      "Drafts, never sends",
      "All activity logged"
     ]
    ],
    [
     "Memory",
     "ti-history",
     "#EEEAF8",
     "#5B4BA0",
     [
      "Past Market Readiness runs",
      "Corrections from reviews"
     ]
    ],
    [
     "Connections",
     "ti-plug-connected",
     "var(--bluebg)",
     "var(--blued)",
     [
      "Notion",
      "Google Drive",
      "GY Data platform"
     ]
    ]
   ]
  },
  "intro": [
   "I run Market Readiness. I do the work first, then ask you one short question when a person needs to decide."
  ],
  "studio": {
   "kind": "coordinator",
   "id": "mra",
   "blueprint": "Market Readiness",
   "owner": "Alex Godfrey",
   "model": "Claude Sonnet 5.5",
   "roles": [
    [
     "trade",
     "Trade lead",
     "person"
    ],
    [
     "coord",
     "Market Readiness agent",
     "agent"
    ]
   ],
   "rules": [
    "Write in short, plain sentences. No jargon a land manager would not use.",
    "Never make up a buyer, a figure or a source. If you do not know, say so.",
    "Draft, never send. A person signs off anything that leaves GY."
   ],
   "wf": [
    {
     "t": "Gather",
     "s": [
      {
       "t": "Pull market data",
       "ty": "agent",
       "by": "coord",
       "w": "Pull market data. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Update buyer signals",
       "ty": "agent",
       "by": "coord",
       "w": "Update buyer signals. Say where each fact came from, and how sure you are."
      }
     ]
    },
    {
     "t": "Assess",
     "s": [
      {
       "t": "Score readiness per market",
       "ty": "agent",
       "by": "coord",
       "w": "Score readiness per market. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Trade review",
       "ty": "person",
       "by": "trade",
       "w": "Trade review, then mark the step done."
      },
      {
       "t": "Scores agreed?",
       "ty": "decision",
       "by": "trade",
       "w": "Recommend in two sentences: go on, or go back, and why."
      }
     ]
    },
    {
     "t": "Publish",
     "s": [
      {
       "t": "Write the report",
       "ty": "agent",
       "by": "coord",
       "w": "Write the report. Say where each fact came from, and how sure you are."
      },
      {
       "t": "Issue report",
       "ty": "person",
       "by": "trade",
       "w": "Issue report, then mark the step done."
      }
     ]
    }
   ],
   "versions": [
    {
     "v": "1.0",
     "date": "30 Sep 2026",
     "by": "Alex Godfrey",
     "note": "Placeholder steps for the prototype",
     "runs": []
    }
   ],
   "access": [
    {
     "name": "Andrew Rubie",
     "ini": "AR",
     "c": "#B4551F",
     "lvl": "Admin"
    },
    {
     "name": "Toon Verbeek",
     "ini": "TV",
     "c": "#0F6E56",
     "lvl": "Admin"
    },
    {
     "name": "Thomas Moes",
     "ini": "TM",
     "c": "#5B4BA0",
     "lvl": "Admin"
    },
    {
     "name": "Alex Godfrey",
     "ini": "AG",
     "c": "#378ADD",
     "lvl": "Editor"
    }
   ]
  }
 }
};
