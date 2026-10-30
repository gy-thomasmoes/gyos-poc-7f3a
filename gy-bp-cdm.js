/* gy-bp-cdm.js - the Customer Demand Mapping Blueprint, one source (20 Oct 2026).

   Zoomed out from the Walkham Valley test run (Chapters 1 and 2, 16 Oct 2026).
   Read by the Blueprint page (agent-demand-mapping.html, through gy-blueprint-studio.js)
   and by every Customer Demand Mapping Deliverable (deliverable-walkham-valley.html).
   A Deliverable keeps only its own data: people, inputs, folder files, field
   content, buyer rows and run state. Everything here is the same for every run.

   template  what good looks like: the four chapters and what each section holds
   wf        phases and steps: what, who does which part, what it uses, done when
   items     one line per skill, knowledge item, tool and connection
   conf      the lists per component, as Settings shows them
   md        the hand-written files (skills, knowledge, tools) */
(function(){
  var B = {
    id:'customer-demand-mapping', name:'Customer Demand Mapping', version:4,
    owner:'Emily Churchill', model:'Claude Sonnet 5.5',
    purpose:'Customer Demand Mapping tells a client who would buy what their land can sell, and why their site. Four chapters: Project context, Demand, Supply and Summary. Each Deliverable fills them for one programme.',

    agent:{
      title:'Coordinator agent',
      prompt:'The Coordinator agent runs GY\'s Customer Demand Mapping. It reads the client\'s documents, finds who would buy each ecosystem service, asks each Ecosystem Service agent what the land can sell, and fills the Deliverable step by step until the Advisory lead signs it off.\n\n'
        + 'It is the one agent the team talks to. It does the work first, then asks one short, specific question when a person needs to decide or a fact is missing. It routes buyers to Trade and the finished document to the Advisory lead, and batches questions for Ecosystem Service managers so it never blocks the run.\n\n'
        + 'It runs on GYOS, the one shared harness, as a configuration like every other agent.',
      props:[['Kind','Coordinator agent'],
             ['Status','v4, tested on Walkham Chapters 1 and 2'],
             ['Manager','<span class="bpav">EC</span>Emily Churchill'],
             ['Signs off','Advisory lead, before anything reaches the client'],
             ['Runs','Customer Demand Mapping Blueprint v4'],
             ['First test','Upper Dee (v2); Walkham Valley Chapters 1 and 2 (v3, 16 Oct 2026)']]
    },

    roles:[['champion','Champion','person'],['trade','Trade','person'],['analysis','Analysis','person'],['advisory','Advisory lead','person'],
           ['dm','Coordinator agent','agent'],['es','Ecosystem Service agents','agent']],

    rules:['Write in short, plain sentences. No jargon a land manager would not use.',
           'Never make up a buyer, a figure or a source. If you do not know, say so.',
           'Every fact carries a linked source. Open every page you cite; a search snippet is not a source.',
           'Mark a missing fact [BLANK] and a conflict or judgement call [Comment]. Never fill a gap from general knowledge.',
           'Draft, never send. A person signs off anything that leaves GY.',
           'British English, no em dashes.'],

    /* the eight services, in screen order; Chapter 2 keeps this order */
    services:['Carbon: peatland','Carbon: woodland','Carbon: soil','Biodiversity Net Gain','Voluntary biodiversity','Natural flood management','Water quality','Replenish'],

    /* ── what good looks like ─────────────────────────────────────────── */
    template:[
      {id:'ch1', t:'Project context', at:'1.3',
       about:'What the project is, from the client\'s own documents. Every fact carries its source, with page or section; nothing comes from GY\'s own demand or strategy work.',
       fields:[
         ['a0','In short','Two or three sentences: who, where, how big, what GY is producing and by when.','Specification, carbon or natural-capital assessment','1.3'],
         ['a1','Project basics','A table: name and short name, host, landowners and partners, nation, location, area and sites, scheme status, timeline, what the client asked GY for.','Specification, SLE or legal report, portfolio notes','1.3'],
         ['a2','Objective and why now','The project\'s aim in its own words, then why it matters now.','Theory of Change, vision statement, specification','1.3'],
         ['a3','Site description and current land use','Catchment and watercourses, land use, habitats and condition, designations, pressures, downstream.','Pipeline page, habitat baseline, carbon assessment','1.3'],
         ['a4','Planned interventions','The project\'s own names, with area, stage, funding route and start year. Say whether they are scenarios or agreed plans.','Carbon or natural-capital assessment, opportunity mapping','1.3'],
         ['a5','Land rights and existing commitments','Ownership, commons, tenancies, live agreements, covenants, prior sales, red lines, governance and finance intent.','SLE report, Theory of Change, monitoring framework','1.3'],
         ['a6','Provisional service screen','The eight services in a table: Signal (Include, Confirm or Omit), Evidence, Confidence.','All Chapter 1 sources','1.4'],
         ['a7','Source coverage','A table: Source, Status, Feeds. Shows what is missing before anyone relies on it.','Drive and Notion','1.3'],
         ['a8','Constraints and dependencies','What blocks or limits a service, one line each.','All Chapter 1 sources','1.3'],
         ['a9','Open questions','For the client, then for GY. Sent to the client at 1.5.','All Chapter 1 sources','1.3']],
       marks:[['[BLANK]','A fact the sources do not give'],['[Comment: ...]','A conflict between sources (give both values) or a judgement call'],['(Inferred: ...)','An inference, with its confidence: high, medium or low']],
       eg:'Worked example: Walkham Valley, Chapter 1.'},
      {id:'ch2', t:'Demand', at:'2.4',
       about:'Who would buy each service, and why this site. Opens with a verdict across all services, then one section per service.',
       shape:['Opens with two or three sentences: the strongest leads across the services, and the weakest evidence.',
              'Then one line naming the sources and the date of the desk research.',
              'One section per included or confirmed service, in the order of the Chapter 1 service screen.',
              'Each section opens with a demand verdict: the strongest lead, and the market context that changes how to read the table (oversupply, a closed catchment, a drought).',
              'Rows are sorted by fit, best first. A red-line flag sits in Why relevant; the row is never deleted.'],
       cols:[['Buyer','The organisation, by its own name'],
             ['Why relevant','The specific fact with its figure: target, units needed, asset at risk, past purchase. Any flag goes here.'],
             ['Hook','What this project offers this buyer, in one line'],
             ['Relationship status','None known, unless a source shows a link to the client, the site or GY. Trade fills it at 2.8.'],
             ['Source','A link to the page or file opened, with its date']],
       terms:[['None known','No source shows a link to the client, the site or GY'],['Contact in GPAP','The GPAP demand tab names a developer contact; licensed, so it stays internal']],
       eg:'Worked example: Walkham Valley, Chapter 2.'},
      {id:'ch3', t:'Supply', at:'3.1', untested:1,
       about:'What the land can sell: one Ecosystem Service Card per included service, written by its Expert agent.',
       cols:[['Rule book','The code or standard the service trades under'],['Eligibility','Whether the land qualifies, and why'],['Volume','Area and units, with the data date'],
             ['Price','Price range per unit, with its source'],['Indicative revenue','Over the agreement term, after any buffer; blank if not monetisable today'],['Funding','Public funding that could pay for the work'],
             ['Confidence','How sure, and what would raise it'],['Next step','The one thing that would firm it up']]},
      {id:'ch4', t:'Summary', at:'4.1', untested:1,
       about:'What the client reads first. No go or no-go: the client has already committed.',
       shape:['Caveats first, in plain words.','Markets ranked by strength of demand, one paragraph each: who buys, why, and how sure we are.','Ends with the recommended next step.','One page.']}
    ],

    /* ── the workflow ─────────────────────────────────────────────────── */
    wf:[
      {t:'Project context', s:[
        {t:'Kick-off meeting', ty:'person', by:'champion', r:['inputs'], o:['context'],
         w:'Confirm what GY is contracted for, the route (Defra Landscape Recovery or nature finance) and the client\'s red lines. Upload the notes.',
         parts:[['champion','Runs the kick-off and uploads the notes'],['dm','Reads the notes and lists what is missing']],
         uses:['Questionnaire','Google Drive','Notion'], done:'The route and the red lines are on file.'},
        {t:'Send intake pack', ty:'agent', by:'dm', r:['inputs','context'], o:['context'],
         w:'Ask the client for what Chapter 1 cannot be written without: the questionnaire, data sheet, GIS boundary, agreements and land rights.',
         parts:[['tool:Email composer','Drafts the intake email from the gaps'],['analysis','Sends it and chases replies']],
         uses:['Questionnaire','Email composer'], done:'The client documents are on file.'},
        {t:'Draft project context', ty:'agent', by:'dm', r:['inputs','context'], o:['context'], sk:['Project context writing'],
         w:'Fill the Chapter 1 template from the client\'s documents. Cite every fact.',
         parts:[['conn:Google Drive','Reads the client documents'],['conn:Notion','Reads the pipeline page and portfolio notes'],['dm','Writes the Chapter 1 sections']],
         uses:['Google Drive','Notion'], done:'Every Chapter 1 section is filled or marked [BLANK] or [Comment].'},
        {t:'Set service screen', ty:'agent', by:'dm', r:['context'], o:['context'], sk:['Service screening'],
         w:'Mark each of the eight services Include, Confirm or Omit, with its evidence and a confidence rating.',
         parts:[['dm','Screens the eight services against the interventions']],
         uses:[], done:'Chapter 2 knows which services to research.'},
        {t:'Context complete?', ty:'decision', by:'champion', r:['context'],
         w:'Recommend in two sentences whether Chapter 1 is complete enough to start on demand, and list the open questions for the client. Gaps can be carried as open questions.',
         parts:[['dm','Lists what is still blank and recommends'],['champion','Decides: proceed or hold']],
         uses:[], done:'Demand starts, with the open questions sent to the client.'}]},
      {t:'Demand', s:[
        {t:'Commission GPAP run', ty:'agent', by:'dm', r:['context'], o:['demand'],
         w:'Brief Rebalance with the boundary: BNG demand, flood exposure, asset owners, abstraction licences, CSO and treatment capacity. Recompute every figure from the files that come back.',
         parts:[['dm','Drafts the brief'],['tool:GPAP report lookup','Reads the LNRS and flood zone reports'],['dm','Recomputes the figures from the files']],
         uses:['Email composer','GPAP report lookup'], done:'BNG demand and flood exposure for the boundary are on file, with the figures recomputed.'},
        {t:'Pull Kwame layers', ty:'agent', by:'dm', r:['context'], o:['demand'],
         w:'For the boundary, pull planning applications with BNG units, abstraction licences, discharge consents, NSIPs and substations.',
         parts:[['tool:Kwame layers lookup','Pulls the layers for the boundary, read only']],
         uses:['Kwame layers lookup'], done:'Regulated demand is listed without a second GPAP spend.'},
        {t:'Desk research per service', ty:'agent', by:'dm', r:['context'], o:['demand'],
         w:'For each included service, search the sources in Knowledge and Tools per service: net zero plans, corporate nature commitments, public funding, water company programmes, public tenders. Open every page cited.',
         parts:[['know:Knowledge and Tools per service','Where to look for each service'],['tool:Web search and fetch','Opens every page it cites'],['dm','Lists candidate buyers per service']],
         uses:['Web search and fetch','EA abstraction register lookup','EA flood warnings lookup','Natural England gain sites register lookup','SEPA abstraction licence lookup','Peatland ACTION register lookup'],
         done:'Every included service has candidate buyers, each with a source that was opened.'},
        {t:'Beneficiary map and buyer list', ty:'agent', by:'dm', r:['demand'], o:['buyers'], sk:['Beneficiary mapping','Buyer qualification'],
         w:'One section per included service, in the order of the service screen. Five columns: Buyer, Why relevant, Hook, Relationship status, Source. Sorted by fit.',
         parts:[['dm','Joins GPAP, Kwame and desk research'],['conn:GY buyer database','Adds buyers GY already knows'],['know:Sector profiles','What each sector buys']],
         uses:['GY buyer database'], done:'Every included service has a buyer table.'},
        {t:'Screen against red lines', ty:'agent', by:'dm', r:['buyers','context'], o:['buyers'], sk:['Red-line screening'],
         w:'Flag every buyer that clashes with the client\'s red lines or carries reputational risk, in its row. Flag, never delete.',
         parts:[['know:Client red lines','What the client will not accept'],['dm','Checks enforcement records and sector exposure']],
         uses:['Web search and fetch'], done:'Every flagged buyer carries its reason and its source.'},
        {t:'Write demand verdicts', ty:'agent', by:'dm', r:['demand','buyers'], o:['buyers'],
         w:'Open each service section with one or two sentences: the strongest lead, and the market context that changes how to read the list (oversupply, a closed catchment, a drought).',
         parts:[['dm','Writes one verdict per service, and the verdict across all services']],
         uses:[], done:'Each section reads in one line before its table.'},
        {t:'Revisit service screen', ty:'decision', by:'champion', r:['context','buyers'],
         w:'Propose changes to the Chapter 1 service screen that the demand findings support, for example Confirm to Include.',
         parts:[['dm','Proposes changes with evidence'],['champion','Decides']],
         uses:[], done:'The service screen matches what the demand found.'},
        {t:'Check with Trade', ty:'person', by:'trade', r:['buyers'], o:['buyers'],
         w:'Confirm the relationship and hook of each buyer. Replace None known wherever GY already knows the buyer.',
         parts:[['trade','Reviews each buyer'],['dm','Folds the notes back into Chapter 2']],
         uses:['GY buyer database'], done:'Nobody is approached blind.'},
        {t:'Demand complete?', ty:'decision', by:'champion', r:['demand','buyers'],
         w:'Recommend whether every included service has a section and a verdict, and whether the eval can run.',
         parts:[['dm','Reports gaps and recommends'],['champion','Decides: proceed or find more buyers']],
         uses:[], done:'Supply starts, and the Lead runs the eval.'}]},
      {t:'Supply', s:[
        {t:'Research ecosystem services', ty:'agent', by:'es', r:['context'], o:['cards'], sk:['Ecosystem Service Card writing'],
         w:'Ask each Ecosystem Service agent what the land can sell. Each fills one Ecosystem Service Card.',
         parts:[['dm','Picks candidate services from the interventions'],['es','Each writes the card for its service'],['know:ES rule books','The rules each service trades under']],
         uses:['Pricing calculator'], done:'One Ecosystem Service Card per included service.'},
        {t:'Numbers reliable enough?', ty:'decision', by:'analysis', r:['cards'],
         w:'Flag every number below medium confidence before the decision.',
         parts:[['dm','Lists low-confidence figures and recommends'],['analysis','Decides: proceed or bring in an expert']],
         uses:[], done:'The summary can be written.'}]},
      {t:'Summary', s:[
        {t:'Create summary', ty:'agent', by:'dm', r:['demand','buyers','cards'], o:['summary'], sk:['Summary writing'],
         w:'Rank the markets by strength of demand and write what the client reads first.',
         parts:[['dm','Ranks the markets and drafts the summary'],['advisory','Reviews before anything goes out']],
         uses:[], done:'Chapter 4 is written and reviewed.'},
        {t:'Generate PDF', ty:'agent', by:'dm', r:['summary'], o:['pdf'],
         w:'Render the four chapters into the GY report template.',
         parts:[['tool:PDF generator','Renders the GY template'],['dm','Checks every figure against its source']],
         uses:['PDF generator','Google Drive'], done:'A dated PDF is in the Deliverable folder.'},
        {t:'Share with customer', ty:'person', by:'advisory', r:['pdf'],
         w:'Send the PDF to the client, walk them through it and log their response.',
         parts:[['champion','Approves sending'],['advisory','Walks the client through it']],
         uses:[], done:'The client has it and their reaction is on file.'},
        {t:'Send to data platform', ty:'agent', by:'dm', r:['buyers','cards'],
         w:'Save buyers and cards to the GY Data platform.',
         parts:[['conn:GY Data platform','Receives the buyer and service rows'],['tool:GY database save','Saves new buyers to the GY buyer database']],
         uses:['GY Data platform','GY database save'], done:'The buyer list is queryable outside this Deliverable.'},
        {t:'Gather learnings', ty:'agent', by:'dm', r:['summary'],
         w:'List the corrections people made in this run and propose them to the Blueprint agent.',
         parts:[['dm','Compares the run with the Blueprint'],['champion','Chooses which learnings go back']],
         uses:[], done:'The next run starts from a better Blueprint.'}]}
    ],

    /* ── one line per item, as Deliverables list them ─────────────────── */
    items:{
      'Project context writing':{ic:'ti-file-description', tag:'Writes Chapter 1', what:'How to turn the client\'s documents into Chapter 1, citing every fact.'},
      'Service screening':{ic:'ti-filter', tag:'Picks the services', what:'How to mark each of the eight services Include, Confirm or Omit, with evidence and confidence.'},
      'Beneficiary mapping':{ic:'ti-map-2', tag:'Finds who benefits', what:'How to join planning, licence, funding and sector signals into one list of who benefits from the catchment.'},
      'Buyer qualification':{ic:'ti-user-check', tag:'Qualifies each buyer', what:'How to judge relevance, write the hook and set the relationship status for each buyer.'},
      'Red-line screening':{ic:'ti-shield-x', tag:'Flags risky buyers', what:'How to flag buyers that clash with the client\'s red lines, without deleting them.'},
      'Ecosystem Service Card writing':{ic:'ti-id-badge-2', tag:'Writes the service cards', what:'The fields, sources and confidence rules every Ecosystem Service Card follows. Each Ecosystem Service agent writes its card with it.'},
      'Summary writing':{ic:'ti-writing', tag:'Writes the client summary', what:'How to rank the markets and write the summary the client reads first, with caveats up front.'},
      'Blueprint change log':{ic:'ti-history', tag:'What changed per version', what:'What each version of this Blueprint changed, and the decisions still open for the Lead.'},
      'Knowledge and Tools per service':{ic:'ti-compass', tag:'Where to look per service', what:'Where buyers of each of the eight services show up, learned from past runs.'},
      'Client red lines':{ic:'ti-ban', tag:'What the client will not accept', what:'Buyers, sectors, land uses and commitment lengths the client has ruled out. Filled per run at kick-off.'},
      'ES rule books':{ic:'ti-book-2', tag:'Rules per ecosystem service', what:'The rules each ecosystem service trades under: codes, eligibility, buffers and prices.'},
      'Sector profiles':{ic:'ti-users-group', tag:'What each sector buys', what:'What each buyer sector cares about, and which signals are strong or weak.'},
      'Buyer personas':{ic:'ti-user-circle', tag:'Who buys, and why', what:'The buyer personas Trade works with, one per kind of buyer.'},
      'Questionnaire':{ic:'ti-checkup-list', tag:'Fills in kick-off questions', what:'Reads the kick-off notes and client documents, answers the kick-off questions it can, then lists the gaps.'},
      'Email composer':{ic:'ti-mail', tag:'Drafts emails', what:'Drafts emails for a person to send. It never sends anything itself.'},
      'Pricing calculator':{ic:'ti-calculator', tag:'Estimates revenue', what:'Volume x price x years, less the buffer. Same answer every time, so it is a tool, not an agent.'},
      'PDF generator':{ic:'ti-file-type-pdf', tag:'Makes the client PDF', what:'Renders the four chapters into the Great Yellow template.'},
      'GY database save':{ic:'ti-database-export', tag:'Saves new buyers', what:'Writes new buyers to the GY buyer database once a person has signed off.'},
      'GPAP report lookup':{ic:'ti-report-analytics', tag:'Reads the GPAP reports', what:'Rebalance Earth\'s GPAP run for the boundary: BNG demand, flood exposure and named assets. Developer contacts are licensed, so they stay internal.'},
      'Kwame layers lookup':{ic:'ti-map', tag:'Reads the Kwame map', what:'GY\'s web map: planning applications with BNG units, abstraction licences, discharge consents, NSIPs and substations.'},
      'EA abstraction register lookup':{ic:'ti-droplet', tag:'Abstraction licences', what:'The EA abstraction licensing strategy and register: closed catchments and licence holders.'},
      'EA flood warnings lookup':{ic:'ti-ripple', tag:'Flood warnings', what:'EA flood warning areas and the FCERM programme for the catchment.'},
      'Natural England gain sites register lookup':{ic:'ti-plant', tag:'Competing BNG supply', what:'Registered biodiversity gain sites near the boundary: the supply BNG demand is weighed against.'},
      'Web search and fetch':{ic:'ti-world-search', tag:'Opens every page cited', what:'Searches the web and opens every page it cites. A search snippet is not a source.'},
      'SEPA abstraction licence lookup':{ic:'ti-droplet', tag:'Abstraction licences, Scotland', what:'SEPA\'s register of abstraction licences, for projects in Scotland.', nation:'Scotland'},
      'Peatland ACTION register lookup':{ic:'ti-plant-2', tag:'Peat restoration, Scotland', what:'Peatland ACTION projects and eligibility, for projects in Scotland.', nation:'Scotland'},
      'Notion':{ic:'ti-brand-notion', tag:'Project pages', what:'Project pages and meeting notes the agent reads at kick-off.'},
      'Google Drive':{ic:'ti-brand-google-drive', tag:'Deliverable folder', what:'Client documents come in here, and the finished PDF goes back.'},
      'GY buyer database':{ic:'ti-address-book', tag:'Shared buyers', what:'One record per buyer, shared across every project, so the same company is never researched twice.'},
      'GY Data platform':{ic:'ti-chart-dots-3', tag:'Shares the rows', what:'Receives the buyer and service rows so the rest of GY can use them.'}
    },

    conf:{
      Tools:['Questionnaire','Email composer','Pricing calculator','PDF generator','GY database save','GPAP report lookup','Kwame layers lookup',
             'EA abstraction register lookup','EA flood warnings lookup','Natural England gain sites register lookup','Web search and fetch',
             'SEPA abstraction licence lookup','Peatland ACTION register lookup'],
      Skills:['Project context writing','Service screening','Beneficiary mapping','Buyer qualification','Red-line screening','Ecosystem Service Card writing','Summary writing'],
      Context:['Blueprint change log','Knowledge and Tools per service','Client red lines','ES rule books','Sector profiles','Buyer personas'],
      Governance:['Advisory lead signs off before the client sees it','Trade reviews every buyer','Drafts, never sends','All activity logged'],
      Memory:['Past demand maps','Corrections from reviews','Eval ratings','Decisions and why'],
      Connections:['Notion','Google Drive','GY buyer database','GY Data platform']
    },

    guard:['Never decides whether to pursue or park; the client and the team do.',
           'Never owns ecosystem service knowledge; it asks the Ecosystem Service agents.',
           'Never owns buyers; it reads and writes the shared GY buyer database.',
           'Drafts emails for a person to send; never sends anything itself.',
           'Nothing reaches the client without the Advisory lead\'s sign-off.',
           'Every fact in the document carries its source, and every cited page has been opened.',
           'Never fills a gap from general knowledge or another project; marks it [BLANK] or [Comment].',
           'Screens every buyer against the client\'s red lines before the Lead sees the list.',
           'Licensed data inside GPAP (developer contacts) stays internal.',
           'Keeps personal contact details out of the document.'],
    evals:[['Figures match sources','Every number in the BNG and NFM tables matches the GPAP files when recomputed'],
           ['Fact check','A fresh agent checks 30 sampled Chapter 1 claims against the source documents; none is unsupported'],
           ['Recall','The buyer list covers the Lead\'s gold list per service, and every BNG development that meets the filter'],
           ['Lead rating','The Lead rates each buyer contact, maybe or drop, and each hook 1 to 5'],
           ['Gap honesty','Seeded gaps are marked [BLANK] or [Comment], never filled'],
           ['Format','Five columns, one section per service in screen order, working source links, no em dashes'],
           ['Upper Dee test','Its Demand Map for Upper Dee matches the reviewed version, with differences explained']],

    /* open questions and next steps live in the Blueprint change log (20 Oct); see below */
    open:[], next:[],

    versions:[
      {v:4, date:'20 Oct 2026', by:'Thomas Moes', note:'Zoomed out from Walkham Chapters 1 and 2: Content is the Deliverable template; every step says who does which part, what it uses and when it is done; one list per component; desk research sits with the coordinator', runs:[]},
      {v:3, date:'16 Oct 2026', by:'Thomas Moes', note:'Walkham test run: Chapter 1 template and service screen; Chapter 2 one section per service with demand verdicts, red-line screen and the eval', runs:[['Walkham Valley','deliverable-walkham-valley.html']]},
      {v:2, date:'1 Oct 2026', by:'Emily Churchill', note:'One Ecosystem Service agent per service; Trade checks buyers before the decision', runs:[['Upper Dee','deliverable-sketch-v8.html'],['The Wash','']]},
      {v:1, date:'18 Sep 2026', by:'Thomas Moes', note:'First version, from the Notion Blueprint', runs:[['Boothby','']]}
    ],

    md:{
"skill:Project context writing":"# Project context writing\n\n## When to use\nStep 1.3, Draft project context. Turns the client's documents into Chapter 1.\n\n## Sections\nFill the Chapter 1 sections of template.md, in its order. For the service screen, use Service screening.\n\n## Rules\n- Every claim carries its source in brackets, with page or section.\n- [BLANK] for a missing fact. [Comment: ...] for a conflict between sources (give both values) or a judgement call.\n- Inferences say so: (Inferred: ... Confidence: high, medium or low.)\n- Never use GY's own demand or strategy outputs as a source for this chapter.\n- Check file provenance when a short name is shared with another project.\n\n## Done when\nEvery section is filled or marked, and the Lead can list the open questions from it.\n\n## Ask a person when\nTwo sources disagree on area, ownership or scope.",
"skill:Service screening":"# Service screening\n\n## When to use\nStep 1.4. Decides which of the eight services Chapter 2 researches.\n\n## The eight services\nCarbon: peatland, Carbon: woodland, Carbon: soil, Biodiversity Net Gain, Voluntary biodiversity, Natural flood management, Water quality, Replenish. Add a non-core service only as its own row.\n\n## For each\nSignal (Include, Confirm or Omit), the evidence from the sources, and a confidence rating.\n\n## Rules\n- BNG is statutory only in England; elsewhere it is Confirm at most.\n- Biodiversity outcomes alone do not make Voluntary biodiversity an Include.\n- Revisit the screen after Demand (step 2.7): demand findings can move a service, as Replenish moved at Walkham.\n\n## Done when\nEvery service has a signal, evidence and a confidence rating.",
"skill:Beneficiary mapping":"# Beneficiary mapping\n\n## When to use\nSteps 2.1 to 2.4. Finds everyone who benefits from the project's outcomes, before qualifying them as buyers.\n\n## Where to look\nUse Knowledge and Tools per service. No single source covers all eight services:\n- GPAP: BNG demand and flood exposure\n- Kwame: planning applications, abstraction licences, discharge consents, NSIPs\n- Desk research: carbon buyers, brand-led water buyers, voluntary biodiversity funders\n- Public registers: EA abstraction and flood warnings, Natural England gain sites\n\n## Output\nOne section per service in the order of the service screen, each opening with a demand verdict.\n\n## Done when\nEvery beneficiary has a sector, a service and a sourced reason.\n\n## Ask a person when\nAn organisation fits two services, or the link to the catchment is a guess.",
"skill:Buyer qualification":"# Buyer qualification\n\n## When to use\nStep 2.4, and whenever a step asks for buyer qualification.\n\n## One row per buyer\nUse the Chapter 2 columns of template.md: what goes in each, and what None known means.\n\n## Sort and flag\nSort by fit within each service. Put reputational flags inside Why relevant.\n\n## Done when\nTrade could pick up the phone from the row alone.\n\n## Ask a person when\nThe buyer is already in a live deal elsewhere at GY.",
"skill:Red-line screening":"# Red-line screening\n\n## When to use\nStep 2.5, before the Lead sees the buyer list.\n\n## How\n- Read the client's red lines from Chapter 1 (for example Walkham: no buyers using credits \"to atone for bad behaviour\").\n- Check each buyer for enforcement records, fines and sector exposure.\n- Flag, never delete: the row stays, with the flag and its source, and the Lead decides.\n\n## Example\nSaputo Dairy UK: 2022 fine for polluting a Tamar tributary. Flagged, likely exclude.\n\n## Done when\nEvery flag carries its reason and its source.",
"skill:Ecosystem Service Card writing":"# Ecosystem Service Card writing\n\n## When to use\nStep 3.1, Supply. Each Ecosystem Service agent fills one card.\n\n## Fields\nUse the Chapter 3 fields of template.md.\n\n## Done when\nEvery field has a value with a source and a confidence rating, or is marked [BLANK].\n\n## Ask a person when\nA number is below medium confidence, the rule book is out of date, or two sources disagree. Not yet tested in a run.",
"skill:Summary writing":"# Summary writing\n\n## When to use\nStep 4.1. No go or no-go: the customer has already committed.\n\n## How\nFollow the Chapter 4 shape of template.md.\n\n## Done when\nThe landowner understands it without a call. Not yet tested in a run.",
"know:Blueprint change log":"---\ntitle: Blueprint change log\nowner: Andrew Rubie (Product Lead)\nlead: to confirm (Emily or Caitlin)\nupdated: 20 Oct 2026\nsource: https://claude.ai/code/artifact/ce4873b1-6daf-43ea-a540-daee22dc69ed\n---\n\n# Blueprint change log\n\n## What changed in v4 (20 Oct 2026)\n- Content is the Deliverable template: the four chapters and what each section holds.\n- Every step says who does which part, what it uses and when it is done.\n- One list per component; outside registers are lookup tools, GY's own stores are connections.\n- Desk research per service sits with the coordinator; Ecosystem Service agents stay on Supply.\n\n## What changed in v3 (Walkham test run, 16 Oct 2026)\n- Chapter 1 and Chapter 2 have a fixed template.\n- Demand names the Knowledge and Tools per service.\n- Each service section opens with a demand verdict.\n- New steps: red-line screening, and a revisit of the service screen after Demand.\n- The eval is the acceptance test.\n\n## Open questions\n- Who is the Lead: Emily or Caitlin?\n- Which confidence labels do the Ecosystem Service Cards use?\n- Run the public funding scan on Defra Landscape Recovery projects too? Recommended.\n- Keep the published-targets scan? Recommended.\n- Does a person approve the GPAP spend at 2.1 (about 1,800 pounds a run)?\n- Does buyer and market knowledge need its own Expert agent, or does it stay in this Blueprint's Context?\n\n## Next steps\n- [ ] Run Chapters 3 and 4 on Walkham Valley with the Coordinator agent\n- [ ] Run the eval with the Lead\n- [ ] Move the Demand Mapping agent's prompt into this Blueprint, as instructions for the Coordinator agent\n- [ ] Review v4 with Emily and Caitlin",
"know:Knowledge and Tools per service":"---\ntitle: Knowledge and Tools per service\nowner: each Ecosystem Service expert, to name\nupdated: 16 Oct 2026\nlearned_from: Walkham Valley test run\n---\n\n# Knowledge and Tools per service\n\n## Carbon: peatland\nCouncil and public-body net zero plans, public tenders, peat partnerships. No public register of Peatland Code buyers.\n\n## Carbon: woodland\nDeal announcements, woodland charity partners, council plans. Benchmark: 125 pounds a tonne for premium Dartmoor WCC units (2025).\n\n## Carbon: soil\nMeat, dairy and retail supply-chain programmes; catchment business boards. Insetting, not credits.\n\n## Biodiversity Net Gain\nGPAP LNRS report or Kwame planning layer; Natural England gain sites register for competing supply. Check supply against demand: Devon supply was about 48 times approved demand.\n\n## Voluntary biodiversity\nCorporate nature commitments; funders of wildlife trusts and National Parks (for example Revere).\n\n## Natural flood management\nGPAP flood report; EA flood warnings, FCERM programme; local flood strategy and local levy. Public funders are often the strongest route.\n\n## Water quality\nWater company catchment programmes; Kwame discharge consents; brand provenance claims.\n\n## Replenish\nEA abstraction licensing strategy and register (or Kwame); drought status; companies with replenish targets.",
"know:Client red lines":"---\ntitle: Client red lines\nowner: the Lead of each run\nupdated: per run\n---\n\n# Client red lines\n\n## What it covers\nWhat the client will not accept: buyers, sectors, land uses, commitment lengths.\n\n## Where it comes from\nThe kick-off (step 1.1) and Chapter 1, Land rights and existing commitments.\n\n## How the agent uses it\nRead in step 2.5. Flag, never delete.",
"know:ES rule books":"---\ntitle: ES rule books\nowner: the Ecosystem Service agent managers\nchecked: Oct 2025, due for review\nsource: NatWest Markets Report, code registries\n---\n\n# ES rule books\n\n## What it covers\nThe rules each ecosystem service trades under: codes, eligibility, buffers and prices.\n\n## How the agent uses it\nRead at step 3.1 by each Ecosystem Service agent, for its own service.",
"know:Sector profiles":"---\ntitle: Sector profiles\nowner: Trade\nchecked: Sep 2026\ncovers: 6 buyer sectors\n---\n\n# Sector profiles\n\n## What it covers\nWhat each buyer sector cares about, and which signals are strong or weak.\n\n## How the agent uses it\nRead at step 2.4 to judge why a buyer is relevant.",
"tool:GPAP report lookup":"---\nname: GPAP report lookup\nkind: lookup\nreads: GPAP reports from Rebalance Earth (LNRS report, flood zone report)\naccess: read only\ncost: about 1,800 pounds a run, commissioned per project\ngives: BNG demand by application with units, supply against demand, named assets and businesses at flood risk with value\nlicensed: developer names and contacts come from Barbour ABI; keep internal\nused_by: Coordinator agent\n---",
"tool:Kwame layers lookup":"---\nname: Kwame layers lookup\nkind: lookup\nreads: Kwame, GY's web map\naccess: read only, through the browser\ngives: planning applications with BNG units, LNRS demand split, abstraction licences, discharge consents, NSIPs, substations\ndoes_not_give: flood exposure, developer contacts\nused_by: Coordinator agent\n---",
"tool:Web search and fetch":"---\nname: Web search and fetch\nkind: lookup\naccess: read only\nrule: open every page you cite; a search snippet is not a source\nused_by: Coordinator agent and the Ecosystem Service agents\n---",
"tool:Questionnaire":"---\nname: Questionnaire\nkind: action\nbuilt_by: GY\nreads: kick-off notes and client documents\ngives: answers to the kick-off questions it can fill, and a list of gaps\nused_by: Coordinator agent\n---",
"tool:Email composer":"---\nname: Email composer\nkind: action\nbuilt_by: GY\naccess: drafts only\nsend: false\nused_by: Coordinator agent\n---",
"tool:Pricing calculator":"---\nname: Pricing calculator\nkind: calculation\nbuilt_by: GY\nmethod: volume x price x years, less the buffer\naccess: no outside calls\nused_by: Ecosystem Service agents\n---",
"tool:PDF generator":"---\nname: PDF generator\nkind: action\nbuilt_by: GY\ntemplate: GY report, 2026\naccess: creates files in the Deliverable folder\nused_by: Coordinator agent\n---"
    }
  };

  /* ── helpers ──────────────────────────────────────────────────────── */
  B.roleName = function(id){ var r = B.roles.filter(function(x){ return x[0] === id; })[0]; return r ? r[1] : id; };
  B.steps = function(){ var o = []; B.wf.forEach(function(c, ci){ c.s.forEach(function(s, i){ o.push({k:(ci+1)+'.'+(i+1), c:ci, s:s}); }); }); return o; };
  B.step = function(k){ return B.steps().filter(function(x){ return x.k === k; }).map(function(x){ return x.s; })[0] || null; };
  /* the steps that use an item: as a skill, in uses, or named in a part */
  B.used = function(name){
    return B.steps().filter(function(x){
      var s = x.s;
      return (s.sk||[]).indexOf(name) >= 0 || (s.uses||[]).indexOf(name) >= 0
        || (s.parts||[]).some(function(p){ return p[0].split(':').slice(1).join(':') === name; });
    }).map(function(x){ return x.k; });
  };
  B.kindOf = function(name){ var k = null; Object.keys(B.conf).forEach(function(c){ if(B.conf[c].indexOf(name) >= 0) k = c; }); return k; };
  /* a part's actor in words, for the step file */
  B.actorName = function(a){
    var p = a.split(':');
    if(p.length > 1) return p.slice(1).join(':') + ' (' + ({tool:'tool', conn:'connection', know:'knowledge'})[p[0]] + ')';
    return B.roleName(a);
  };
  /* the step file body: what, who does which part, done when */
  B.stepText = function(s){
    return s.w + '\n\n## Who does what\n' + (s.parts||[]).map(function(p){ return '- ' + B.actorName(p[0]) + ': ' + p[1]; }).join('\n')
      + '\n\n## Done when\n' + s.done;
  };
  /* the workflow as Blueprint Editor edits it (a copy, so drafts never touch the source) */
  B.studioWf = function(){
    return B.wf.map(function(c){ return {t:c.t, s:c.s.map(function(s){
      return {t:s.t, ty:s.ty, by:s.by, w:B.stepText(s), r:(s.r||[]).slice(), o:(s.o||[]).slice(), sk:(s.sk||[]).slice(), uses:(s.uses||[]).slice()};
    })}; });
  };
  /* a markdown file as [heading, text or list] pairs, for drawers that show instructions */
  B.mdBody = function(md){
    var out = [], cur = null;
    String(md||'').replace(/^---[\s\S]*?\n---\n?/, '').split('\n').forEach(function(l){
      if(/^## /.test(l)){ cur = [l.slice(3), []]; out.push(cur); return; }
      if(!cur || /^# /.test(l) || !l.trim()) return;
      if(/^\|/.test(l)){ cur[1].push('Columns: ' + l.split('|').map(function(c){ return c.trim(); }).filter(Boolean).join(', ')); return; }
      cur[1].push(l.replace(/^- /, ''));
    });
    return out.map(function(s){ return [s[0], s[1].length > 1 ? s[1] : (s[1][0] || '')]; });
  };
  /* open questions and next steps: the change log's own sections, so Content and the file never differ */
  (function(){
    var md = B.md['know:Blueprint change log'] || '', grab = function(title){
      var m = md.split('\n## ').filter(function(s){ return s.indexOf(title+'\n') === 0; })[0] || '';
      return m.split('\n').slice(1).filter(function(l){ return /^- /.test(l); }).map(function(l){ return l.replace(/^- (\[[ x]\] )?/, ''); });
    };
    B.open = grab('Open questions'); B.next = grab('Next steps');
  })();
  window.GY_BP_CDM = B;
})();
