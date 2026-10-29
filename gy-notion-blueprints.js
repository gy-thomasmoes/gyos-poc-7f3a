/* gy-notion-blueprints.js - the Blueprints database in Notion, as a snapshot.
   Written by Claude on "sync the prototype"; do not edit by hand.
   Source: THE HIVE > The Hive Mind > Blueprint Agent > Blueprints
   (collection://fcc3149c-e3e3-4d32-a4cb-906c76e897dd). Runs are the rows per
   Blueprint in All Deliverables (collection://3b48a14e-d56a-80f8-8616-000b9355d72a).
   o is the owner's initials in the page's PEOPLE table; null when Notion has no owner. */
window.GY_NOTION_BP = {
  synced: '2026-10-29',
  url: 'https://app.notion.com/p/5f914b230158469e801fdd92c8c300e4',
  rows: [
    {n:'Customer Demand Mapping',   stage:'2 What good looks like', v:'v0.4', o:null, runs:4, oq:11, type:'Document',
     notion:'https://app.notion.com/p/4078a14ed56a81bf824fc1873c0c10c5', go:'agent-demand-mapping.html'},
    {n:'Commercial Strategy',       stage:'1 Requirements',         v:'v0.1', o:'FB', runs:0, oq:2,  type:'Document',
     notion:'https://app.notion.com/p/4088a14ed56a81769b44e22f0e33aa76', go:'blueprint.html?bp=comm'},
    {n:'Catchment Investment Plan', stage:'1 Requirements',         v:'v0.1', o:'AM', runs:0, oq:3,  type:'Document',
     notion:'https://app.notion.com/p/4068a14ed56a815abec2e8052b4a3f57', go:'blueprint.html?bp=cip'}
  ]
};
