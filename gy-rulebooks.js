/* gy-rulebooks.js - the ecosystem service rule books, one object per service.
   Structure follows the ES explainer skeleton:
     1 Supply (science)  identity / source / quantity
     2 Bridge            what makes it real and sellable
     3 Demand            who buys it, how we sell it, what it costs
     4 Market            readiness, dynamics, signals, risks
   Colours and icons come from the GY_ES product tokens where the service is
   also an inventory product, so a service looks the same everywhere. */
window.GY_RULEBOOKS = [

{id:'carbon', name:'Carbon', col:'#C67F16', ic:'ti-trees', type:'Compliance + voluntary', status:'g',
 vol:'£6.43B', volsub:'global VCM 2024', product:'wcc',
 identity:{
  what:'One credit equals one tonne of CO2 either sequestered or avoided. The only natural capital market with a genuinely fungible physical unit, which is why it is the most investable of the seven.',
  expressed:'tCO2e, issued as Pending Issuance Units on planting and converted to verified units at each verification point. Woodland Carbon Code and Peatland Carbon Code dominate domestically.',
  sits:'Regulating service. Splits into compliance markets (UK and EU ETS) and the voluntary carbon market, with very different buyers and price points.'},
 source:{
  generates:'A land use change that stores carbon: woodland creation, peatland restoration, hedgerow planting, or soil management that raises organic carbon.',
  recorded:'Parcel boundary and area, baseline land use, species mix and stocking density, planting year, and the modelled sequestration curve over the project life.',
  stacking:'Carbon stacks readily with biodiversity and water benefits on the same parcel. Selling the carbon does not preclude selling the biodiversity uplift, provided the claims are separated.'},
 quantity:{
  calc:'Modelled sequestration over the project period using the code lookup tables, driven by species, yield class, spacing and management regime.',
  adjust:'A permanence buffer, typically 20% under the Woodland Carbon Code, is withheld from sale. Leakage and baseline emissions are deducted where relevant.',
  offer:'Gross sequestration is not sellable inventory. Deduct the buffer, split by vintage, and phase against the verification schedule. Only verified units carry a clean corporate claim.'},
 bridge:{
  scheme:'Woodland Carbon Code, Peatland Carbon Code and Wilder Carbon domestically. Verra and Gold Standard internationally, though UK projects rarely list there.',
  registry:'The UK Woodland Carbon Registry and the IHS Markit environmental registry give a public record of issuance, transfer and retirement. This is what makes carbon bankable.',
  mrv:'Validated at the start, then verified at year 5 and every ten years thereafter by an independent, UKAS-accredited body. Publicly documented methodology.',
  legal:'Thirty to one hundred year management obligations, secured by the scheme agreement and typically a conservation covenant or Section 106.',
  why:'A registry plus independent verification is the difference between a credit and a promise. UK high-quality credits sell at £75 to £125 per tonne; unverified claims sell for nothing.'},
 demand:{
  what:'Companies offset unavoidable emissions against science based targets. Compliance buyers are obligated; voluntary buyers are driven by net zero commitments and, increasingly, by CSRD reporting.',
  how:'Sell verified credits under the Woodland Carbon Code, Peatland Carbon Code, Wilder Carbon or international codes. Buyers currently prefer removals credits over avoidance.',
  cost:'UK VCM sized from verified credits multiplied by price: 11.34M WCC credits (Forest Research and WCC registry) at £35 average = £396.9M, projected up 26.7% to about £487.5M by end 2025. Global uses the World Bank average price of £29. Combined WCC and PCC 2024 transactions = £12.14M.',
  caveat:'Sources: World Bank Carbon Pricing Dashboard, Berkeley Voluntary Registry Offset Database, Forest Research, WCC, PCC.'},
 ready:{Operational:'g',Governance:'g',MRV:'g',Supply:'g',Demand:'o',Regulatory:'g','Key challenges':'g','Policy outlook':'g'},
 dyn:['Global VCM about £6.43B in 2024. Retirements up 9% in H1 2025; issuances down 15% as developers wait for buyers','Buyers pay premiums for high-quality credits with co-benefits; ICVCM-compliant credits command higher prices and broader access','UK high-quality credits sell at £75 to £125 per tonne; WCC typically £25 to £50 below Wilder Carbon','CDR offtakes surged about 200% year on year to roughly 20Mt by June 2025'],
 uk:['About 2,500 live domestic projects under WCC, PCC or Wilder Carbon, against only 9 on international registries','WCC: 11.34M credits issued; estimated market £396.9M, rising to about £487.5M by end 2025','Domestic buyers: law firms, SMEs and large corporates'],
 risks:['International buyers may not pay UK premium prices; comparable credits are cheaper in the Global South','Lingering reputational caution from the 2022 and 2023 critiques']},

{id:'bng', name:'Biodiversity Net Gain', col:'#1E8A63', ic:'ti-butterfly', type:'Compliance · England only', status:'g',
 vol:'£33.8M', volsub:'since inception', product:'bng',
 identity:{
  what:'Measurable improvement in the extent and condition of habitat, over and above what the land would have delivered anyway. There is no fungible natural unit, so biodiversity is expressed through a proxy metric.',
  expressed:'The Statutory Biodiversity Metric gives three separate unit types: area habitat units, hedgerow units and watercourse units. They are not interchangeable.',
  sits:'Regulating service. Compliance market under the Environment Act 2021, England only. One of the only biodiversity compliance markets in the world.'},
 source:{
  generates:'A habitat transition on a defined land parcel, driven by creation, restoration, enhancement, or retention of existing high-value habitat.',
  recorded:'Parcel boundary and area (hectares for area habitats, kilometres for hedgerow and watercourse), baseline habitat classified to UKHab, target habitat, intervention type and start year.',
  stacking:'Statutory BNG stacks less freely than voluntary biodiversity. Units committed to a statutory obligation cannot be sold twice, and the additionality test is enforced through the register.'},
 quantity:{
  calc:'Post-intervention habitat score minus baseline habitat score. Each score is distinctiveness multiplied by condition multiplied by area, adjusted for strategic significance.',
  adjust:'Time-to-target-condition, difficulty of creation or enhancement, and spatial risk. These reduce the headline figure substantially, and the reduction is larger for high-distinctiveness habitats.',
  offer:'Gross uplift is not sellable inventory. Deduct the risk buffer, deduct anything already committed, and phase the remainder across the delivery timeline to get what can actually be offered.'},
 bridge:{
  scheme:'Statutory. Developments approved by English planning authorities must show a 10% measurable biodiversity uplift, delivered on site or by buying off-site units.',
  registry:'The DEFRA Biodiversity Gain Site Register is the authoritative record of allocation. Gaia, BNGx and Biodiversity Units UK act as listing venues on top of it.',
  mrv:'Condition assessment at years 2, 5, 10, 20 and 30, against the habitat management and monitoring plan agreed at registration.',
  legal:'A conservation covenant or Section 106 agreement securing 30 years of management. This durability is what a buyer is actually paying for.',
  why:'The register plus a 30-year legal wrapper is why a statutory unit averages £37,967 while the same ecological uplift sold voluntarily carries a far lower and less certain value.'},
 demand:{
  what:'Developers with a planning obligation. Demand is created by legislation rather than by sentiment, which is why this is the most reliable biodiversity market.',
  how:'Sell BNG units from habitat creation or enhancement, via direct deals or platforms such as BNGx, Gaia and Biodiversity Units UK. England only; outside England route to voluntary biodiversity.',
  cost:'Average unit price £37,967.48 from the Gaia dataset (251 projects, 107 priced). Market size = 126 register projects multiplied by 188.5 average units multiplied by £37,967.48, roughly £901.75M. Annual demand about 526.76 units per year, roughly £22.39M. Transacted to date: 891.62 allocated units, about £33.8M.',
  caveat:'Sources: DEFRA BNG register, Gaia; soft data from Swallowtail and Oxford. FOI to DEFRA outstanding for 2025 figures.'},
 ready:{Operational:'g',Governance:'g',MRV:'g',Supply:'g',Demand:'o',Regulatory:'o','Key challenges':'o','Policy outlook':'o'},
 dyn:['£33.8M transacted since inception; about 4% of supply allocated','Gain Site Register lags 6 to 12 months; 50 to 80% of market activity may be unreported','NSIP compliance expected to formalise in 2026 and accelerate demand: large tenders already out from National Grid and National Highways'],
 uk:['Statutory credit sales 2024: about £206k','Spains Hall reports £1M or more in live quotes and a completed six-figure pre-mandatory deal','Quotes can sit in progress for up to 2 years'],
 risks:['Policy uncertainty: NSIP and small-sites consultations may delay or dampen demand','Oversupply signals against slow reported demand']},

{id:'volbio', name:'Voluntary Biodiversity', col:'#7C9861', ic:'ti-paw', type:'Voluntary', status:'o',
 vol:'£0.2-1.4M', volsub:'global credit sales', product:null,
 identity:{
  what:'Measurable improvement in the extent and condition of habitat, over and above what the land would have delivered anyway. Unlike carbon there is no single fungible natural unit, so biodiversity is expressed through a proxy metric rather than a physical quantity.',
  expressed:'The Statutory Biodiversity Metric is the de facto standard, giving three separate unit types: area habitat units, hedgerow units and watercourse units. Voluntary projects borrow this metric because no competing standard has reached scale.',
  sits:'Regulating service. Biodiversity, voluntary scope. Runs parallel to statutory BNG on the same quantification tooling but under an entirely different commercial and legal regime.'},
 source:{
  generates:'A habitat transition on a defined land parcel, driven by an intervention: creation, restoration, enhancement, or retention of existing high-value habitat.',
  recorded:'Parcel boundary and area (hectares for area habitats, kilometres for hedgerow and watercourse), baseline habitat classified to UKHab, target habitat, intervention type, and start year.',
  stacking:'Biodiversity uplift almost always co-occurs with carbon, water quality and NFM on the same parcel. Because voluntary biodiversity sits outside any statutory claim it stacks more freely than statutory BNG, which is the core of its commercial appeal.'},
 quantity:{
  calc:'Post-intervention habitat score minus baseline habitat score. Each score is distinctiveness multiplied by condition multiplied by area, adjusted for strategic significance.',
  adjust:'Time-to-target-condition, difficulty of creation or enhancement, and spatial risk. These reduce the headline figure substantially, and the reduction is larger for high-distinctiveness habitats.',
  offer:'Gross uplift is not sellable inventory. Deduct the risk buffer, deduct anything already committed to a statutory BNG obligation, and phase the remainder across the delivery timeline to get what can actually be offered to a buyer.'},
 bridge:{
  scheme:'No statutory scheme. Voluntary frameworks include Credit Nature and Replan.it, with most transactions still falling outside any framework entirely. Quantification usually borrows the statutory BNG metric without the statutory apparatus around it.',
  registry:'No public registry. Gaia functions as a listing venue, not a ledger, so there is no authoritative record of issuance, transfer or retirement. This is the single largest structural gap in the market.',
  mrv:'No standard. Monitoring frequency, verifier and reporting route are set deal by deal. Where projects mirror statutory BNG they tend to follow the years 2, 5, 10, 20, 30 condition assessment schedule.',
  legal:'Bespoke bilateral agreement, terms varying by provider or by deal. No conservation covenant or Section 106 equivalent, therefore no automatic 30-year durability, which buyers increasingly price in.',
  why:'The same ecological uplift priced at £37,967.48 under statutory BNG carries a materially lower and far less certain value voluntarily. The delta is credibility infrastructure, not ecology.'},
 demand:{
  what:'Voluntary funding of biodiversity uplift, driven by corporate nature-positive pledges, TNFD, ESG and CSR commitments. Takes two forms: bespoke financing deals, or the purchase of voluntary biodiversity credits.',
  how:'Bespoke corporate deals, or voluntary biodiversity credits via platforms such as Gaia and Earthly. Often bundled with carbon and water co-benefits, increasingly quantified with BNG metrics.',
  cost:'Uses the BNG unit price of £37,967.48. Domestic: 125 unlisted voluntary projects on Gaia multiplied by 147.2 average units multiplied by £37,967.48, roughly £684.74M (18,035 units). Global credit sales only £0.2M to £1.4M across 26k to 125k ha.',
  caveat:'Sources: Gaia registry, TNFD adopters list, Earthly. Caveat: biodiversity has no single fungible unit like tCO2e, so unit-based sizing is indicative.'},
 ready:{Operational:'o',Governance:'o',MRV:'o',Supply:'o',Demand:'o',Regulatory:'r','Key challenges':'o','Policy outlook':'o'},
 dyn:['Global credit sales to date only £0.2M to £1.4M across 26k to 125k ha; market fragmented','TNFD adopters rising: UK 2025 adopters passed the 2024 total by October','Corporates such as Lidl, AstraZeneca and Nestlé interested in bundles that also serve supply chain resilience'],
 uk:['About 125 projects for sale on Gaia; transactions minimal and rarely disclosed','Voluntary projects now sold alongside compliance BNG using the same quantification tools'],
 risks:['No standard unit or MRV; all deals bespoke','TNFD demand signals not yet converting into credit purchases at scale']},

{id:'nn', name:'Nutrient Neutrality', col:'#1F6FB2', ic:'ti-droplet', type:'Compliance · designated zones', status:'o',
 vol:'£102M', volsub:'traded to date', product:'nut',
 identity:{
  what:'A quantity of nutrient load removed from a catchment, so that new development can proceed without adding to it. The unit is a pollutant not delivered rather than a habitat created.',
  expressed:'Kilogrammes of nitrogen or phosphorus per year, converted into credits. Nitrogen and phosphorus are separate markets with separate prices, and neither travels outside its catchment.',
  sits:'Regulating service. Compliance mechanism triggered by the Habitats Regulations in designated catchments, currently about 73 across England.'},
 source:{
  generates:'Land use change that cuts nutrient runoff: arable reversion to grassland, wetland creation, woodland planting, or septic tank repair and replacement inside the catchment.',
  recorded:'Catchment, parcel boundary and area, previous and proposed land use, modelled nutrient export before and after, and the Natural England calculator version used.',
  stacking:'Stacks well with biodiversity and carbon on the same parcel, but the nutrient claim itself cannot be sold twice and is tied to one catchment.'},
 quantity:{
  calc:'Baseline nutrient export minus post-intervention export, using the Natural England nutrient budget calculator for that catchment.',
  adjust:'A precautionary buffer is applied, and the figure is fixed to the catchment. Credits are worthless outside the zone that generated them.',
  offer:'Sellable credits are the net annual load reduction, secured in perpetuity or for the life of the development, whichever the local authority requires.'},
 bridge:{
  scheme:'No single national scheme. Natural England methodology plus local planning authority acceptance. The Nutrient Mitigation Scheme operates in some catchments.',
  registry:'No national registry. Local authorities hold their own records of allocated mitigation, which makes market-wide visibility poor.',
  mrv:'Modelled rather than measured. Verification is largely a check that the land use change happened and is being maintained.',
  legal:'Section 106 or a planning condition tying the mitigation to the development in perpetuity. Durability requirements are longer than in most markets.',
  why:'Demand exceeds supply here, which is rare. The constraint is not buyers, it is finding land inside the right catchment with a credible nutrient budget.'},
 demand:{
  what:'Developers blocked from building in designated catchments. The obligation is absolute: without mitigation, permission is not granted.',
  how:'Generate credits through wetland creation, land reversion, septic tank repair or woodland planting inside nutrient neutrality catchments.',
  cost:'About 1.5 credits per dwelling (PUSH data) at £3,250 per credit (Natural England quote, up from £2,750 in 2022). Norfolk: 2,100 homes at 1.5 credits at £3,250 = £10.24M, roughly 10% of market, implying about £102M in 2025. Backlog of 50,000 homes is about £243M; 1.5M future homes about £7.3B.',
  caveat:'Sources: PUSH, Natural England, Norfolk Council. Caveat: the Planning and Infrastructure Bill may replace deals with a central Nature Restoration Fund.'},
 ready:{Operational:'o',Governance:'g',MRV:'g',Supply:'o',Demand:'g',Regulatory:'o','Key challenges':'o','Policy outlook':'o'},
 dyn:['About £102M traded; the only natural capital market where demand exceeds supply','Pricing highly variable: phosphate credits above £100k in some areas, bundled nitrogen and phosphorus around £6k elsewhere','More than £400M of government funding in the landscape; the 1.5M homes target drives growth'],
 uk:['Proposed Planning and Infrastructure Bill and Nature Restoration Fund could replace direct buyer-seller deals with a levy model'],
 risks:['High borrowing costs, geographic constraints, limited lender expertise','The Planning and Infrastructure Bill could restructure the market entirely']},

{id:'nfm', name:'Natural Flood Management', col:'#B5628F', ic:'ti-ripple', type:'Voluntary · site specific', status:'r',
 vol:'Not sized', volsub:'bespoke deals only', product:'nfm',
 identity:{
  what:'Reduced flood risk to a specific downstream asset, achieved by slowing and storing water upstream. The benefit is a risk reduction, not a commodity.',
  expressed:'No unit exists. Deals are expressed as peak flow reduction, storage volume created, or simply as a contribution to a named scheme.',
  sits:'Regulating service. Voluntary, and strictly geographically specific: the benefit only counts to assets in the same catchment, downstream of the intervention.'},
 source:{
  generates:'Leaky woody dams, floodplain reconnection, wetland and pond creation, upstream tree planting, soil structure improvement, and river re-meandering.',
  recorded:'Catchment and sub-catchment, intervention type and location, storage volume created, and the assets downstream that benefit.',
  stacking:'Almost always bundled. NFM interventions generate biodiversity and carbon on the same parcel, and the bundle is usually what makes the deal viable.'},
 quantity:{
  calc:'Hydrological modelling of peak flow attenuation, run per catchment. There is no standard model, so figures are not comparable between deals.',
  adjust:'Confidence intervals are wide and rarely stated. Benefit degrades quickly with distance from the asset.',
  offer:'There is nothing to issue. What is sold is a funded intervention with an agreed monitoring commitment, priced against the avoided cost of grey infrastructure.'},
 bridge:{
  scheme:'None. No code, no standard, no unit. The Environment Agency NFM programme sets practice but does not create a tradable instrument.',
  registry:'None.',
  mrv:'No standard. Where monitoring happens it is gauge data agreed deal by deal, usually funded by the buyer.',
  legal:'Bespoke bilateral agreement or grant. Land access beyond an asset owner boundary is the recurring obstacle.',
  why:'Without a unit or a registry this cannot be traded, only funded. That caps the market at the number of asset owners willing to write bespoke agreements.'},
 demand:{
  what:'Public and private entities that own assets at flood risk: infrastructure owners, utilities, local authorities and, increasingly, insurers. Flooding is the UK most significant climate risk.',
  how:'Bespoke deals with infrastructure owners and utilities, typically bundled with biodiversity and carbon co-benefits. Strictly geographically specific.',
  cost:'Soft data only. From the £2.65B Grant in Aid flood budget for 2024 to 2026: assume the Environment Agency invests about 1% (£13M) scaling to about 10% (£130M) over 5 years, plus RFCC levies of about £3M a year and £10M growing to £100M from the water sector £104B AMP8. Current market about £28M scaling to about £250M in 5 years.',
  caveat:'No transacted volume, rated no-data. Sources: EA Grant in Aid budget, RFCC, Ofwat AMP8.'},
 ready:{Operational:'r',Governance:'r',MRV:'r',Supply:'o',Demand:'o',Regulatory:'r','Key challenges':'o','Policy outlook':'o'},
 dyn:['UK flood costs about £1.6B a year, forecast £3.6B by 2050; Government spending £2.65B on defences over 2024 to 2026','Network Rail, Thames Water, Anglian Water, United Utilities and South West Water exploring NFM financing','DEFRA floods funding reform consultation may unlock NFM and sustainable drainage investment'],
 uk:[],
 risks:['No MRV or credit system; deals bespoke and fragmented','Rigid budget cycles, land access beyond asset boundaries, and grey-infrastructure inertia']},

{id:'wq', name:'Water Quality', col:'#3D7FA8', ic:'ti-glass-full', type:'Voluntary · site specific', status:'r',
 vol:'£22.1B', volsub:'PR24 WINEP envelope', product:null,
 identity:{
  what:'A reduction in the contaminant load reaching a water company abstraction point, achieved in the catchment rather than at the treatment works.',
  expressed:'No unit. Expressed as concentration reduction for a named contaminant, or simply as an avoided treatment cost.',
  sits:'Regulating service. Voluntary and strictly geographically specific, tied to a single abstraction catchment.'},
 source:{
  generates:'Wetland restoration, buffer strips, cover cropping, soil management, changed application timing, and reduced or substituted inputs on farms in the catchment.',
  recorded:'Catchment and abstraction point, farm and field boundaries, baseline application rates, the practice change agreed, and the monitoring point.',
  stacking:'Stacks naturally with biodiversity, carbon and NFM. Water companies increasingly prefer bundles because they justify the spend against more than one obligation.'},
 quantity:{
  calc:'Modelled load reduction per hectare for the named contaminant, scaled across enrolled area, validated against raw water monitoring where available.',
  adjust:'Attribution is the hard part: rainfall, upstream activity and lag times all confound the signal. Confidence is usually low and rarely quantified.',
  offer:'Sold as a catchment management contract with a payment per hectare per year, not as an issued credit.'},
 bridge:{
  scheme:'None. Delivered through water company catchment management programmes funded under WINEP and the AMP cycle.',
  registry:'None. Contracts sit on the water company balance sheet.',
  mrv:'Raw water quality monitoring at the abstraction point, plus practice audits on farm. No independent verifier and no published methodology.',
  legal:'Bilateral catchment management agreement, usually 5 years to match the AMP period, which is far shorter than the underlying land use change needs.',
  why:'The money is real and large, but without a unit it cannot be aggregated or resold. Every deal is negotiated from scratch with one buyer.'},
 demand:{
  what:'Water companies deploying WINEP and AMP8 funding, where nature based solutions are cheaper than engineered treatment and carry co-benefits they can also report.',
  how:'Deals with water companies deploying WINEP and AMP8 funding; bespoke buyer-seller agreements. Strictly geographically specific.',
  cost:'Scaled from per-farm payments, for example £50k for metaldehyde control, across catchment area (Anglian Water about 28,000 km2), giving £380M or more per contaminant. From Ofwat £104B for 2025 to 2030, the top 7 utilities have board-approved £50.67B; remaining market about £40B over 5 years assuming about 30% additional private placement.',
  caveat:'No transacted volume, rated no-data. Sources: Ofwat, WINEP and PR24, utility business plans.'},
 ready:{Operational:'o',Governance:'r',MRV:'r',Supply:'o',Demand:'o',Regulatory:'r','Key challenges':'o','Policy outlook':'o'},
 dyn:['PR24 WINEP: more than 24,000 environmental actions from 2025 to 2030, backed by a record £22.1B','GY in live conversation with Anglian, Thames and South West Water on WINEP deployment','Nature based solutions typically cheaper than engineered treatment, with co-benefits to bundle'],
 uk:[],
 risks:['No MRV or agreed market standards; every deal bespoke','Locally focused benefits limit scale']},

{id:'rm', name:'Replenish', col:'#5595BC', ic:'ti-droplet-half-2', type:'Voluntary · site specific', status:'r',
 vol:'Not sized', volsub:'bespoke deals only', product:null,
 identity:{
  what:'Water returned to a stressed catchment, or water retained in it, offsetting a corporate water footprint elsewhere in the same basin.',
  expressed:'Cubic metres replenished per year. The volumetric water benefit approach is the closest thing to a method, and it is not a traded unit.',
  sits:'Regulating service. Voluntary, basin specific, and driven entirely by corporate water stewardship targets.'},
 source:{
  generates:'Tree and hedgerow planting, beaver reintroduction, regenerative agriculture, leaky dams, river and catchment restoration, and aquifer recharge.',
  recorded:'Basin, intervention type and location, modelled volumetric benefit, and the corporate operation or supply chain whose footprint it offsets.',
  stacking:'Almost always bundled with carbon and biodiversity. The replenish claim is usually the reason the buyer is at the table, not the whole of what they pay for.'},
 quantity:{
  calc:'Volumetric water benefit modelling, per intervention, per basin. No standard model and no agreed boundary conditions.',
  adjust:'Attribution is weak and contested. Benefits are counted only within the same basin as the footprint being offset.',
  offer:'Funded projects with an agreed monitoring commitment. Nothing is issued and nothing can be resold.'},
 bridge:{
  scheme:'None. The Alliance for Water Stewardship standard and the Water Resilience Coalition set expectations but neither creates an instrument.',
  registry:'None.',
  mrv:'No standard. Modelled benefit with occasional gauge validation, reported inside the buyer own sustainability disclosure.',
  legal:'Bespoke corporate agreement, often multi-year and framed as sponsorship or partnership rather than purchase.',
  why:'The most underdeveloped of the seven. Real money is moving, but with no unit, no registry and no verification body, every pound is negotiated individually.'},
 demand:{
  what:'Corporates with water-intensive operations or supply chains, working to public replenishment targets. Coca Cola, Nestlé and AstraZeneca are the recurring names.',
  how:'Bespoke corporate deals, often bundled with carbon and biodiversity, in the buyer supply chain regions.',
  cost:'No formal sizing: the market lacks MRV, a registry and a unit, so it is sized only by identifying demand and the corporates active in it. Bespoke deals only.',
  caveat:'Sources: corporate water stewardship disclosures, The Rivers Trust, Water Resilience Coalition.'},
 ready:null,
 dyn:['Most underdeveloped natural capital market: no MRV, registry or supporting legislation','Coca Cola, Nestlé and AstraZeneca actively exploring replenishment investment','Coca Cola GB and The Rivers Trust have restored chalk streams and aquifers in the South East since 2012'],
 uk:[],
 risks:['Site-specific hydrology limits scale and aggregation','No unit or verification body; complex attribution modelling raises due diligence costs']},

{id:'scr', name:'Supply Chain Resilience', col:'#B75A40', ic:'ti-truck', type:'Bespoke · seventh stream', status:'r',
 vol:'Per buyer', volsub:'no formal market', product:null,
 identity:{
  what:'Reduced risk to a corporate sourcing area: soil, water and climate resilience in the places a buyer actually grows or buys from. The benefit accrues to the buyer own operations, not to a third party.',
  expressed:'No unit and no common expression. Framed per buyer as yield stability, input cost, water security or continuity of supply.',
  sits:'Not a market. The seventh stream, identified buyer by buyer, usually as the commercial reason underneath a bundled deal.'},
 source:{
  generates:'Regenerative practice change in sourcing regions: cover cropping, reduced tillage, hedgerow and shelterbelt planting, water retention, and pollinator habitat.',
  recorded:'Buyer, sourcing region, the commodity at risk, the practice change, and the risk it addresses.',
  stacking:'This is the stack. Supply chain resilience is rarely sold alone; it is the argument that unlocks a carbon, biodiversity or water deal at a better price.'},
 quantity:{
  calc:'Quantified per buyer against their own risk model. There is no external method and no comparability between deals.',
  adjust:'Benefits are internal and hard to separate from ordinary agronomy, so buyers discount heavily.',
  offer:'A funded programme with reporting, priced against the buyer avoided risk rather than against any market.'},
 bridge:{
  scheme:'None. Sits outside every code and framework.',
  registry:'None.',
  mrv:'Buyer defined. Usually the buyer own agronomy and sustainability reporting, occasionally third party audited under a sourcing standard.',
  legal:'Commercial supply agreement or sponsorship, not an environmental instrument.',
  why:'No rule book exists yet. It is logged here because it repeatedly turns out to be the real reason a corporate buyer engages, even when the deal is papered as carbon or biodiversity.'},
 demand:{
  what:'Corporates with exposed agricultural supply chains. The purchase is risk management dressed as sustainability, which is why it prices differently from offsetting.',
  how:'Identified buyer by buyer, usually as the resilience angle inside a bundled carbon, biodiversity or water deal.',
  cost:'No formal market or sizing. Opportunities are quantified per buyer, usually as the resilience value inside a bundled deal.',
  caveat:'Sources: direct buyer conversations. Logged here as signals accumulate.'},
 ready:null,
 dyn:['Emerging through bundled conversations with corporates such as Lidl, AstraZeneca and Nestlé'],
 uk:[],
 risks:['No rule book yet: built per buyer, logged here as signals accumulate']}

];

/* shared across every rule book */
window.GY_RB_SOURCES = [
  ['Registries (DEFRA BNG, Gaia, WCC, PCC)','Hard data','Gold'],
  ['NatWest Markets Report (Caitlin and Harry)','Hard data','Gold'],
  ['Trade team and buyer signals','Soft data','Gold'],
  ['Market data (World Bank, ICE, EEX, Forest Research)','Hard data','Silver'],
  ['Intermediary intelligence (Earthly, Patch, Swallowtail)','Soft data','Bronze']
];

window.GY_RB_CATDEF = {
 Operational:'Operational Readiness. How far the market is active, investable and equipped with the infrastructure to support deals: registries, legal frameworks, project pipeline.',
 Governance:'Effective Governance. Whether credible structures oversee unit creation, transaction and consumption, including clarity of roles, oversight and enforcement capacity.',
 MRV:'Established MRV. Availability and credibility of measurement, reporting and verification methodologies. Priority to frameworks that are public, science based and independently verified.',
 Supply:'Supply Scale. Whether there is a sufficient and scalable pipeline of supply to meet projected demand, across land, stakeholders and developers.',
 Demand:'Demand Scale. Current and projected demand from compliance-driven and voluntary actors, including buyer diversity, forward signals and repeat purchasing.',
 Regulatory:'Regulatory Stability. Clarity, maturity and enforceability of existing rules, and whether they are implemented effectively and adapt to market evolution.',
 'Key challenges':'Key Challenges. Barriers currently limiting market development, rated by severity and tractability.',
 'Policy outlook':'Likely Policy Updates. Anticipated regulatory change and whether it is likely to hinder, support or stay neutral to market growth.'
};
