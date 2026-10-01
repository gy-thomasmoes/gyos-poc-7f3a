/* gy-personas.js, the buyer personas, one object per segment.
   A copy of the validated Carbon and BNG segmentation (Millie Davey, Marketing),
   walked through with the team on 7 Sep 2026. Carbon segments come from the
   "Carbon & BNG Buyer segmentation - validated" page (revised July 2026, slide
   updated August 2026). BNG personas come from "Personas: decision drivers,
   messaging & key words" under the BNG Strategy (last edited 28 Sep 2026).
   Every persona wears the same dark blue, GY Capital blue #215274, on
   Thomas's instruction (29 Sep 2026); the outcome is named on the cover and
   carried by the es field, not by the colour.
   Water (W1 to W7) is not in yet: Steve's draft mirrors this method but has
   not been validated. */
window.GY_PERSONAS = [

{id:'c1', code:'C1', outcome:'carbon', es:'carbon', col:'#215274',
 name:'Mature carbon buyers with integrity pain', short:'Mature buyers',
 role:'Direct buyer', priority:'Priority 1', track:'Track A, direct',
 who:"UK-exposed corporates, financial institutions in high-pressure sectors (finance, tech, pharma, aviation, utilities) and other mature market participants (traders, investors with offtake agreements) who are already active in the voluntary carbon market and care strongly about integrity. Some have ambitious SBTi 1.5°C near-term targets and net-zero commitments; others are driven by investment mandates and reputational or financial risk rather than formal targets. Includes mature buyers in big tech, AI and data centres or advanced manufacturing who already buy but want high-tech MRV and standards.",
 solving:"They already buy credits but are increasingly worried about integrity, scrutiny and future-proofing. They need to move away from commodity offsets to credits that can withstand future scrutiny, while still fitting their portfolio returns and price constraints. A practical discriminator is whether they operate in the £70+ per tonne integrity price band or the £20 to £25 commodity band.",
 quote:"They've been burnt too many times, they just need to know it's safe, ready, and going to deliver.",
 why:"The fastest-moving, highest-fit buyers for Landscape Recovery Carbon, if we lean into claims-safety, delivery risk and portfolio construction rather than price alone. Price-band fit, the willingness to pay for high-integrity removals, is the critical filter inside this segment; it separates GY-fit buyers from mature players still shopping at commodity price points.",
 examples:"With SBTi targets: AstraZeneca, Vodafone Group, Aviva, Rathbones. Trading and investor offtakers: Vertis, Freepoint.",
 note:"Steve Kellett challenged the assumption that every C1 buyer has been burnt before (7 Sep 2026). Logged as an assumption to keep refining.",
 source:{label:'Carbon & BNG Buyer segmentation, validated', url:'https://app.notion.com/p/3598a14ed56a807daa23e90d7399a245'},
 refreshed:'August 2026'},

{id:'c2a', code:'C2a', outcome:'carbon', es:'carbon', col:'#215274',
 name:'Banks', short:'Banks',
 role:'Partner channel', priority:'Priority 2', track:'Track B, partner channel',
 who:"Corporate and investment banks that structure and finance climate and nature deals for their clients. Part of C2, buyers via advisers: situations where the buyer contracts an external adviser to design the carbon strategy and claims framework.",
 solving:"Find credible, scalable supply they can rely on repeatedly for different clients without rebuilding due diligence every time, while protecting their own reputation and balance-sheet risk by avoiding credits that could backfire on the bank and the borrower.",
 why:"Each bank relationship is a distribution channel to multiple end buyers rather than a single account, and can unlock larger structured deals, bundled with financing or multi-year offtake, than many individual buyers would sign alone. The key question is depth, not just breadth: can each bank partner generate multiple transactions over time rather than a single flagship deal?",
 examples:"Deutsche Bank, Lloyds, NatWest.",
 source:{label:'Carbon & BNG Buyer segmentation, validated', url:'https://app.notion.com/p/3598a14ed56a807daa23e90d7399a245'},
 refreshed:'August 2026'},

{id:'c2b', code:'C2b', outcome:'carbon', es:'carbon', col:'#215274',
 name:'Brokers', short:'Brokers',
 role:'Partner channel', priority:'Priority 3', track:'Track B, partner channel',
 who:"Nature brokers and project developers with brokerage arms, who aggregate demand from multiple corporates and match it with supply. They often run their own due diligence process, and CORSIA compliance is a major decision factor for many of their buyers.",
 solving:"Assemble a menu of credible options across geographies, standards and price points to present to clients, and reduce their own due diligence burden by partnering with suppliers whose projects already meet or exceed their internal quality thresholds. For aviation and similar sectors they must ensure credits are CORSIA compliant, so they look for suppliers whose standards unlock that route.",
 why:"They already sit on buy orders and pipelines GY could plug into, can provide a repeat flow of opportunities, and look for integrity credits to differentiate themselves, which GY can provide. For aviation-focused brokers, Isometric's conditional CORSIA compliance gives GY a strong wedge into airline-driven demand.",
 examples:"Patch, Nature Broking, Forest Carbon, Chooose (CORSIA focused).",
 source:{label:'Carbon & BNG Buyer segmentation, validated', url:'https://app.notion.com/p/3598a14ed56a807daa23e90d7399a245'},
 refreshed:'August 2026'},

{id:'c2c', code:'C2c', outcome:'carbon', es:'carbon', col:'#215274',
 name:'Other advisers', short:'Advisers',
 role:'Partner channel', priority:'Priority 4', track:'Track B, partner channel',
 who:"Consultancies, law firms, authorities and buying groups who design their clients' climate strategies and frameworks, or bring together buyers for a specific area.",
 solving:"Define what good looks like for their clients' strategies, meaning acceptable claims, standards and governance, while protecting their own professional reputation. They aim to simplify a fragmented market for clients who lack internal capacity, and often work with C3.",
 why:"They are gatekeepers to high-value buyers: if they do not understand it or see the value, their clients never will. If the adviser adopts GY as part of their model answer it can scale across multiple clients and sectors, and their endorsement de-risks board-level decisions.",
 quote:"Our advisor says this is best practice.",
 quoteby:"The argument that unlocks board-level sign-off",
 examples:"WSP.",
 source:{label:'Carbon & BNG Buyer segmentation, validated', url:'https://app.notion.com/p/3598a14ed56a807daa23e90d7399a245'},
 refreshed:'August 2026'},

{id:'c3', code:'C3', outcome:'carbon', es:'carbon', col:'#215274',
 name:'Committed but inexperienced net-zero leaders', short:'Net-zero leaders',
 role:'Direct buyer', priority:'Priority 5', track:'Track A, direct',
 who:"Organisations with strong climate ambition on paper (SBTi and net-zero commitments) but no voluntary carbon market track record; they are still designing their removals policies and internal rules, and they are running out of time. Includes tech-heavy or innovation-oriented companies where wanting something as tech-forward as they are is part of the internal story.",
 solving:"They want to define what good looks like, meaning how much they need, at what price and how to navigate changing policy, before buying in volume, and are nervous about making the wrong first move in a critical space. Like all segments they need strong reassurance on integrity, but for C3 that concern is entangled with general uncertainty about policy, price and volume, so the handholding job is broader.",
 quote:"This is the bulk of the market right now. They know 2050 is coming and they're going to have to do something. Carbon is only going to get more expensive, but nobody actually wants to be the first one to move.",
 why:"Likely to move more slowly, but potentially high-lifetime-value buyers if GY helps shape their framework early and becomes a trusted architect of their carbon portfolio. Isometric's high-tech standard, more technology-focused than Verra, helps GY enter here.",
 examples:"Darktrace, GSK, Virgin Media, BT Group, Schroders.",
 note:"Future ETS-exposed sectors (construction, transport in ETS Phase 2) are an emerging pool of C3-type buyers: no strong SBTi targets or market history yet, but they know regulation is coming and need education on how carbon and ETS interact. Tag them in the target list and CRM rather than treating them as a separate segment.",
 source:{label:'Carbon & BNG Buyer segmentation, validated', url:'https://app.notion.com/p/3598a14ed56a807daa23e90d7399a245'},
 refreshed:'August 2026'},

{id:'c4', code:'C4', outcome:'carbon', es:'carbon', col:'#215274',
 name:'Buyers with farmer and land dependencies', short:'Land-dependent buyers',
 role:'Direct buyer', priority:'Priority 6, to be confirmed', track:'Track A, direct',
 who:"Buyers whose climate strategy is closely tied to farmers and land in their value chain (FLAG targets, Scope 3 agricultural emissions, insetting) and who need credible ways to work with landscapes and suppliers: food and drink, retail, universities and councils procuring from local farmers.",
 solving:"They need routes to work with farmers and landscapes, and to show measurable progress against supply-chain and land-use goals, not just offset residuals elsewhere. Often they love the idea but are cash-constrained or slow-moving, especially in low-margin sectors.",
 why:"GY's value here is as a bridge between landscape-scale projects and existing supply chains; the story is about land, farmers and FLAG rather than generic carbon integrity. Their business case is vulnerable to alternative insetting routes, such as forthcoming Scope 3 standards that allow discounted credits, which may make GY's high-integrity pricing harder to justify in low-margin sectors.",
 examples:"M&S, Harrogate Spring Water, Exeter University.",
 note:"Strategically important but a lower commercial priority until the economics of insetting versus removals are clearer. This is the same buyer motive the Supply Chain Resilience rule book calls the seventh stream.",
 source:{label:'Carbon & BNG Buyer segmentation, validated', url:'https://app.notion.com/p/3598a14ed56a807daa23e90d7399a245'},
 refreshed:'August 2026'},

{id:'b1', code:'B1', outcome:'bng', es:'bng', col:'#215274',
 name:'Ecology firms', short:'Ecology firms',
 role:'Gatekeeper', priority:'First on the critical path', track:'Sales enablement and market awareness',
 who:"Ecologists diagnose the on-site deficit, run the metric, and are often the first to state that off-site units will be required. Their recommendation shapes whether Great Yellow is brought in as the trusted off-site option.",
 drivers:["Habitat match to their metric outputs: the right UKHab and metric codes, distinctiveness, and rough unit volumes in the right geography.",
  "Confidence that habitats will perform over 30 years: resilience, a coherent ecological landscape, robust management and monitoring.",
  "Stewardship credibility and professional risk: they want to avoid recommending a scheme that later fails compliance or LPA scrutiny."],
 messaging:["Habitats delivered within coherent ecological landscapes.",
  "Strong connectivity and surrounding stewardship reduce failure risk.",
  "Condition baselines and management regimes aligned to metric requirements.",
  "Landscape-embedded delivery supports long-term ecological performance."],
 keywords:["Statutory Biodiversity Metric","UKHab codes","distinctiveness bands","off-site BNG units","habitat banks","habitat connectivity","landscape-scale restoration","interconnectivity","bigger, better, more joined up landscapes","increased resilience","condition baselines","management prescriptions","monitoring and reporting","LPA confidence","ecological masterplan","failure risk","long-term performance"],
 cta:"Share 1 to 3 live schemes where off-site is likely or already needed and we will propose viable off-site options aligned to your metric outputs.",
 source:{label:'Personas: decision drivers, messaging and key words', url:'https://app.notion.com/p/3288a14ed56a800cac9cd27a987547e7'},
 refreshed:'September 2026'},

{id:'b2', code:'B2', outcome:'bng', es:'bng', col:'#215274',
 name:'Planning and EIA firms', short:'Planning firms',
 role:'Introducer', priority:'Second on the critical path', track:'Sales enablement and market awareness',
 who:"Planners interpret policy, draft the BNG strategy and gain plan, negotiate with LPAs or Examining Authorities, and decide whether and how to bring in off-site partners.",
 drivers:["Geography and policy fit: LPAs and NCAs covered, LNRS alignment, and gain sites that fit local policy expectations.",
  "Planning certainty: registration status, evidence that similar gain plans have been accepted, and documentation that looks like planning and ES annex material.",
  "Availability and process simplicity: units actually available in the right time window, with a clear route from enquiry to reservation and contract."],
 messaging:["Off-site BNG aligned to your LPA geography.",
  "Registered gain sites with available units now.",
  "Planning-ready documentation supporting compliance.",
  "Secure long-term delivery within stewarded estates."],
 keywords:["BNG strategy","Biodiversity Gain Plan","condition discharge","planning consent","LPA coverage","National Character Areas (NCAs)","Local Nature Recovery Strategy (LNRS)","registered Biodiversity Gain Site","gain site ID","planning-ready documentation","programme risk","evidence pack","Examining Authority expectations","DCO documentation"],
 cta:"Send us 1 or 2 schemes where BNG is a planning risk and we will provide a fast BNG risk review and outline off-site options.",
 source:{label:'Personas: decision drivers, messaging and key words', url:'https://app.notion.com/p/3288a14ed56a800cac9cd27a987547e7'},
 refreshed:'September 2026'},

{id:'b3', code:'B3', outcome:'bng', es:'bng', col:'#215274',
 name:'NSIP promoters, house builders and strategic land promoters', short:'Promoters and housebuilders',
 role:'Decision maker', priority:'Holds risk and budget', track:'Sales enablement and market awareness',
 who:"Promoters and developers ultimately carry scheme risk, budget for units, and decide whether to institutionalise Great Yellow as a preferred off-site partner across a portfolio. Key for portfolio-wide deals.",
 drivers:["Price and cost certainty at scheme and portfolio level, including options versus spot purchases.",
  "Programme protection: confidence that units will be available in time to avoid delays to consent, condition discharge and start on site.",
  "Long-term risk and governance: assurance that habitats will remain compliant for 30 years without unexpected future liabilities."],
 messaging:["Cost-certain BNG supply available within your planning geography.",
  "Units available to protect programme timelines.",
  "Landscape-embedded habitats reduce long-term compliance risk.",
  "Trusted estate stewardship supports delivery certainty."],
 keywords:[],
 cta:"",
 note:"Keywords and a call to action have not been written for this persona yet.",
 source:{label:'Personas: decision drivers, messaging and key words', url:'https://app.notion.com/p/3288a14ed56a800cac9cd27a987547e7'},
 refreshed:'September 2026'}
];

/* Shared notes per outcome: how the segmentation was cut, the internal roles
   every deal has to satisfy, and the dynamics that run across segments. */
window.GY_PERSONA_NOTES = {
 carbon:{
  method:"Industry alone is insufficient; readiness varies greatly within sectors. The indicators used are SBTi target-setting and voluntary carbon market activity, read from the SBTi dashboard and the Verra, Gold Standard and Isometric registries. Track A is direct buyers (C1, C3, C4); Track B is the partner channel (C2).",
  roles:{title:'Internal roles and gatekeepers',
   intro:"For any significant carbon deal, four internal groups must be satisfied.",
   list:["Sustainability and ESG: the champion; standards, SBTi and FLAG alignment, wider nature impact.",
    "Legal, claims and reporting: controls what can be said; cares about evidence and claims-safe language.",
    "Finance, procurement and treasury: controls spend and structures; cares about cost, risk and accounting treatment.",
    "Board and shareholders: the ultimate yes or no, particularly with new concepts such as water."],
   seq:"Typically Sustainability opens the door, Legal and Claims validate the claims and documentation, Finance and Procurement sign off money and structure, and the Board gives final sign-off."},
  dynamics:[
   {t:'Value-maximising versus minimum-compliance buyers',
    a:"At one end, buyers whose goal is to tick the cheapest possible box: often global, avoidance-heavy, minimal diligence. At the other, buyers who want climate-robust, reputation-safe, multi-benefit outcomes and will pay more and think harder to get there. C1 and C2 contain both flavours, and the difference is usually price band and scheme type rather than sector; C3 and C4 are mostly value-maximising in intent but may not yet know how to operationalise it.",
    s:"We are deliberately not the right partner for minimum-compliance, price-only buyers. Our best fit is value-maximising buyers who care about landscape-scale impact, co-benefits and reputational resilience, in practice the high-integrity removals band of about £70 per tonne and up."},
   {t:'Integrity reassurance',
    a:"Regardless of maturity, everyone is spooked by integrity risk: bad press, greenwashing accusations, stranded claims, changing standards. C1 says we have been burnt before and need proof this is safe. C2 advisers worry about recommending something that ages badly. C3 worries are bound up with not yet knowing what good looks like. C4 fears paying for something a low-margin business cannot justify if it is later discredited.",
    s:"Integrity reassurance is a universal requirement, not a niche need. Our differentiation is making high-integrity and defensible the easy choice, through Isometric-grade evidence, portfolio construction and clear claims guidance, rather than a research project for each buyer."},
   {t:'Ease of credible activation versus speed',
    a:"For carbon, being the easiest to activate with confidence beats being first. Buyers often come to GY after something has gone wrong elsewhere. C1 needs a credible place to move next; C2 needs something drop-in ready for their frameworks and products; C3 needs a partner to build the internal business case and claims architecture; C4 needs simple stories and structures they can explain to stakeholders.",
    s:"We aim to be the easiest high-integrity option to turn on now: not necessarily the first phone call, but the one that turns a messy, risky market into a clear, usable solution."},
   {t:'Portfolio mindset versus one-off purchases',
    a:"Some buyers think in portfolios and long-term frameworks; others treat carbon as one-off, opportunistic purchases. Many C1 buyers are already portfolio thinkers; banks and brokers are inherently portfolio and product driven; C3 needs help becoming portfolio thinkers; C4 is often project-specific but can be nudged towards integrated landscape programmes.",
    s:"We are architects and portfolio partners, not one-off project sellers. Our best fit is buyers, or their advisers, willing to design a coherent architecture, even if they start small."}
  ],
  messages:["Premium, not cheapest: not for commodity buyers; holistic benefits justify the premium.",
   "Integrity assurance: every segment needs reassurance, so provide clear evidence.",
   "Activation ease over speed: carbon buyers value ease and confidence over being first to reach.",
   "Portfolio architect, not broker: a long-term partner building portfolios, including cross-outcome upsells."]
 },
 bng:{
  method:"Industry targeting was ruled out. BNG demand is geographically constrained and driven by the ecosystem of people involved in a development, not the sector doing the building, so the personas are the three roles on the critical path: the ecologist who diagnoses the deficit, the planner who introduces the off-site option, and the promoter who holds the risk and the budget.",
  tracks:"Sales enablement for buyers who need BNG now: HubSpot outreach to each segment from scraped contact lists, with GPAP supporting copy and contact upload. Market awareness for buyers who will need BNG in future: a steady LinkedIn content stream to build trust, with media such as Estates Gazette being explored.",
  materials:["An overall technical BNG portfolio covering compliance, coverage and fit across all segments, with segment-specific versions to follow in ecologist and planner language.",
   "A Buying BNG Units with GY flowchart, Johnny Campbell's idea.",
   "Project prospectuses and storytelling pieces as complements."]
 }
};
