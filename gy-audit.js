/* gy-audit.js , the audit log's events. Owns the data; audit-log.html renders it.
   An audit entry is deliberately not an activity item. Activity says what the team
   did. This says what changed on a record, who changed it, what it was before, and
   which system the change came through. Append only: nothing here is ever edited.

   Fields
     id    immutable entry reference, never reused
     day   grouping label, newest first
     time  24h, Europe/London
     who   the actor's name, or the integration's name
     src   person | sync | agent | system   the channel the change arrived through
     cat   Inventory | Deals | Projects | Sites | Rules | Access | Data
     act   the verb, short
     obj   what it acted on, as a person would name it
     from  value before, or '' where the event is a creation
     to    value after, or '' where the event is a deletion
     scope optional count label when one action touched many rows
     rows  optional the individual rows behind that count
     ref   optional page to open the affected record
     note  optional one line of context that is not a before or after
*/
window.GY_AUDIT = [

/* ── Wednesday 11 September ── */
{id:'AE-4821', day:'Wednesday 11 September', time:'16:42', who:'Hubspot', src:'sync', cat:'Deals',
 act:'Stage changed', obj:'Bicester Gateway Developments', from:'Negotiation', to:'Closed Won',
 note:'Inbound from Hubspot, no GY edit in flight', ref:'deal.html'},

{id:'AE-4820', day:'Wednesday 11 September', time:'16:42', who:'Great Yellow', src:'system', cat:'Inventory',
 act:'Units sold', obj:'BNG, Evenlode and Spains Hall', from:'Reserved', to:'Sold',
 scope:'86 units', note:'Triggered by Bicester Gateway Developments reaching Closed Won',
 rows:['EVN-BNG-101 to EVN-BNG-148, 48 units','SPH-BNG-012 to SPH-BNG-049, 38 units'],
 ref:'inventory-bng-portfolio.html'},

{id:'AE-4819', day:'Wednesday 11 September', time:'14:08', who:'Millie Gray', src:'person', cat:'Deals',
 act:'Reservation released', obj:'Halcyon Asset Management', from:'Reserved', to:'Unreserved',
 scope:'24 units', note:'Buyer paused pending board approval', ref:'deal.html'},

{id:'AE-4818', day:'Wednesday 11 September', time:'11:20', who:'Caitlin Reeve', src:'person', cat:'Rules',
 act:'Price set', obj:'BNG, Evenlode', from:'£24,500 per unit', to:'£26,000 per unit',
 scope:'12 lines', note:'Effective 1 October 2025',
 rows:['EVN-BNG-201 to EVN-BNG-212, 12 lines, area habitat units'],
 ref:'inventory-bng-portfolio.html'},

{id:'AE-4817', day:'Wednesday 11 September', time:'10:34', who:'Caitlin Reeve', src:'person', cat:'Projects',
 act:'Unit stage progressed', obj:'Wychwood Meadows', from:'Projected', to:'Registered',
 scope:'180 units', note:'Natural England register updated the same morning',
 rows:['WYM-BNG-001 to WYM-BNG-180, 180 units'], ref:'projects.html'},

{id:'AE-4816', day:'Wednesday 11 September', time:'10:02', who:'Tom Ashby', src:'person', cat:'Sites',
 act:'Parcels allocated', obj:'Charlbury Soils', from:'Unallocated', to:'Charlbury Soils',
 scope:'3 parcels', rows:['CHA-02, 14.2 ha','CHA-03, 9.8 ha','CHA-04, 11.1 ha'], ref:'sites.html'},

{id:'AE-4815', day:'Wednesday 11 September', time:'09:41', who:'Registry sync', src:'system', cat:'Inventory',
 act:'Units verified', obj:'BNG, Evenlode', from:'Projected', to:'Verified', scope:'40 units',
 ref:'inventory-bng-portfolio.html'},

{id:'AE-4814', day:'Wednesday 11 September', time:'08:15', who:'Harry Fox', src:'person', cat:'Data',
 act:'Register exported', obj:'Deal register', from:'', to:'CSV, 34 rows',
 note:'Downloaded to a local machine'},

/* ── Tuesday 10 September ── */
{id:'AE-4813', day:'Tuesday 10 September', time:'17:55', who:'Great Yellow', src:'system', cat:'Inventory',
 act:'Reservation expired', obj:'Fairhaven Group', from:'Reserved', to:'Available', scope:'18 units',
 note:'14 day hold reached its end with no deal movement', ref:'deal.html'},

{id:'AE-4812', day:'Tuesday 10 September', time:'15:30', who:'Caitlin Reeve', src:'person', cat:'Rules',
 act:'Sales restriction added', obj:'Woodland carbon, Boothby', from:'None', to:'No sales before verification',
 note:'Applies to every line in the programme until the year 5 verification clears',
 ref:'inventory-wcc-portfolio.html'},

{id:'AE-4811', day:'Tuesday 10 September', time:'13:12', who:'Kwame', src:'agent', cat:'Deals',
 act:'Deal flagged for review', obj:'Barnwell Regeneration', from:'Clear', to:'Needs review',
 note:'Rule: reserved units exceed the verified pool for the named programme', ref:'deal.html'},

{id:'AE-4810', day:'Tuesday 10 September', time:'11:48', who:'Hubspot', src:'sync', cat:'Deals',
 act:'Owner changed', obj:'Cotswold Homes', from:'Harry Fox', to:'Izzie Bell', ref:'deal.html'},

{id:'AE-4809', day:'Tuesday 10 September', time:'11:48', who:'Hubspot', src:'sync', cat:'Deals',
 act:'Sync conflict resolved', obj:'Cotswold Homes', from:'Hubspot: Proposal sent', to:'Great Yellow: Negotiation',
 note:'Great Yellow held, its record was edited more recently', ref:'deal.html'},

{id:'AE-4808', day:'Tuesday 10 September', time:'09:26', who:'Izzie Bell', src:'person', cat:'Inventory',
 act:'Units reserved', obj:'BNG, Evenlode', from:'Available', to:'Reserved', scope:'24 units',
 note:'Against Cotswold Homes, hold expires 24 September',
 rows:['EVN-BNG-213 to EVN-BNG-236, 24 units'], ref:'inventory-bng-portfolio.html'},

{id:'AE-4807', day:'Tuesday 10 September', time:'06:00', who:'Registry sync', src:'system', cat:'Inventory',
 act:'Registry checked', obj:'Natural England register', from:'', to:'No changes',
 note:'Scheduled daily check'},

/* ── Monday 9 September ── */
{id:'AE-4806', day:'Monday 9 September', time:'16:05', who:'Tom Ashby', src:'person', cat:'Access',
 act:'Permission granted', obj:'Jane Amory', from:'Viewer', to:'Editor',
 note:'Scope: Deals and Inventory, Portfolio altitude'},

{id:'AE-4805', day:'Monday 9 September', time:'14:31', who:'Caitlin Reeve', src:'person', cat:'Rules',
 act:'Price set', obj:'Woodland carbon, Evenlode', from:'£32.00 per tonne', to:'£35.50 per tonne',
 scope:'6 lines', rows:['EVN-WCC-014 to EVN-WCC-019, 6 lines, pending issuance units'],
 ref:'inventory-wcc-portfolio.html'},

{id:'AE-4804', day:'Monday 9 September', time:'12:19', who:'Millie Gray', src:'person', cat:'Deals',
 act:'Deal logged', obj:'Ardent Insurance Group', from:'', to:'Due diligence',
 note:'Carbon, Evenlode', ref:'deal.html'},

{id:'AE-4803', day:'Monday 9 September', time:'10:44', who:'Tom Ashby', src:'person', cat:'Sites',
 act:'Land schedule imported', obj:'Evenlode', from:'15 parcels', to:'18 parcels',
 scope:'3 parcels added', rows:['BRU-01, 21.4 ha','BRU-02, 18.9 ha','BRU-03, 16.2 ha'], ref:'sites.html'},

{id:'AE-4802', day:'Monday 9 September', time:'08:37', who:'Hubspot', src:'sync', cat:'Deals',
 act:'Stage changed', obj:'Chipping Norton Homes', from:'Negotiation', to:'Closed Won', ref:'deal.html'},

/* ── Friday 6 September ── */
{id:'AE-4801', day:'Friday 6 September', time:'16:50', who:'Caitlin Reeve', src:'person', cat:'Rules',
 act:'Sales restriction removed', obj:'BNG, Spains Hall', from:'Local planning authority only', to:'None',
 note:'Removed after the authority confirmed off site sales are permitted',
 ref:'inventory-bng-portfolio.html'},

{id:'AE-4800', day:'Friday 6 September', time:'15:22', who:'Izzie Bell', src:'person', cat:'Data',
 act:'Register exported', obj:'Inventory register', from:'', to:'CSV, 412 rows',
 note:'Shared with the NatWest Markets analyst team'},

{id:'AE-4799', day:'Friday 6 September', time:'11:03', who:'Kwame', src:'agent', cat:'Inventory',
 act:'Line matched to metric', obj:'BNG, Evenlode', from:'Unmatched', to:'Matched',
 scope:'54 lines', note:'Rule: statutory biodiversity metric, area habitat units, condition B',
 ref:'inventory-bng-portfolio.html'},

{id:'AE-4798', day:'Friday 6 September', time:'09:14', who:'Tom Ashby', src:'person', cat:'Projects',
 act:'Project created', obj:'Charlbury Soils', from:'', to:'Discover',
 note:'Soil carbon, Evenlode', ref:'projects.html'}

];

/* filter helpers, so the page never re-implements them */
window.GY_AUDIT_API = {
  actors: function(){
    var seen = {}, out = [];
    (window.GY_AUDIT||[]).forEach(function(e){ if(!seen[e.who]){ seen[e.who]=1; out.push(e.who); } });
    return out.sort();
  },
  cats: function(){
    var seen = {}, out = [];
    (window.GY_AUDIT||[]).forEach(function(e){ if(!seen[e.cat]){ seen[e.cat]=1; out.push(e.cat); } });
    return out.sort();
  },
  days: function(){
    var seen = {}, out = [];
    (window.GY_AUDIT||[]).forEach(function(e){ if(!seen[e.day]){ seen[e.day]=1; out.push(e.day); } });
    return out;
  }
};

/* source labels, shared so the badge always reads the same way */
window.GY_AUDIT_SRC = {
  person: {label:'Person',  icon:'ti-user',       bg:'var(--graybg)', fg:'var(--grayd)'},
  sync:   {label:'Hubspot', icon:'ti-refresh',    bg:'var(--bluebg)', fg:'var(--blued)'},
  agent:  {label:'Agent',   icon:'ti-sparkles',   bg:'var(--tealbg)', fg:'var(--teald)'},
  system: {label:'System',  icon:'ti-settings-automation', bg:'var(--amberbg)', fg:'var(--amberd)'}
};
