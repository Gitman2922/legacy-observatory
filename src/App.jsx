import { useState, useMemo } from "react";

const C = {
  gold:"#FFD700",goldDim:"#b8960c",bg:"#0a0a0a",card:"#111111",
  border:"rgba(255,215,0,0.18)",borderHi:"rgba(255,215,0,0.32)",
  green:"#4caf88",purple:"#c084fc",blue:"#60a5fa",orange:"#f97316",
  red:"#f87171",teal:"#2dd4bf",pink:"#f472b6",
};

const CUTOFF = new Date("2025-09-05");

const DRAKE_RAW = [
  // ── Pre-streaming mixtapes (legacy context only — no reliable stream data) ──
  {id:"rfi",    title:"Room for Improvement",  release:"2006-02-14",fw:0,total:0,collab:null,meta:null,tracks:22,preStream:true,era:"young-money",surprise:false,beefContext:null,type:"mixtape",legacy:true},
  {id:"cs",     title:"Comeback Season",        release:"2007-09-18",fw:0,total:0,collab:null,meta:null,tracks:21,preStream:true,era:"young-money",surprise:false,beefContext:null,type:"mixtape",legacy:true},
  {id:"sfg",    title:"So Far Gone",            release:"2009-02-13",fw:0,total:0,collab:null,meta:null,tracks:18,preStream:true,era:"young-money",surprise:false,beefContext:null,type:"mixtape",legacy:true},
  // ── Studio albums ──
  {id:"tml",    title:"Thank Me Later",           release:"2010-06-15",fw:447000, total:6050000, collab:null,            meta:75, tracks:14,preStream:true, era:"young-money",surprise:false,beefContext:null,           type:"studio"},
  {id:"tc",     title:"Take Care",                release:"2011-11-15",fw:631000, total:11400000,collab:null,            meta:78, tracks:16,preStream:true, era:"young-money",surprise:false,beefContext:null,           type:"studio"},
  {id:"nwts",   title:"Nothing Was the Same",     release:"2013-09-24",fw:658000, total:8080000, collab:null,            meta:79, tracks:13,preStream:true, era:"young-money",surprise:false,beefContext:null,           type:"studio"},
  {id:"iyrtitl",title:"If You're Reading This",   release:"2015-02-13",fw:535000, total:5390000, collab:null,            meta:78, tracks:17,preStream:false,era:"peak",       surprise:true, beefContext:null,           type:"mixtape",commercialMixtape:true},
  {id:"wattba", title:"What a Time to Be Alive",  release:"2015-09-20",fw:375000, total:3260000, collab:"Future",        meta:70, tracks:11,preStream:false,era:"peak",       surprise:false,beefContext:"post-meek",    type:"mixtape",commercialMixtape:true},
  {id:"views",  title:"Views",                    release:"2016-04-29",fw:1040000,total:10450000,collab:null,            meta:69, tracks:20,preStream:false,era:"peak",       surprise:false,beefContext:null,           type:"studio"},
  {id:"ml",     title:"More Life",                release:"2017-03-18",fw:505000, total:6330000, collab:null,            meta:79, tracks:22,preStream:false,era:"peak",       surprise:false,beefContext:null,           type:"playlist"},
  {id:"sc",     title:"Scorpion",                 release:"2018-06-29",fw:732000, total:11090000,collab:null,            meta:67, tracks:25,preStream:false,era:"peak",       surprise:false,beefContext:"during-pusha", type:"studio"},
  {id:"cp",     title:"Care Package",             release:"2019-08-02",fw:165000, total:2000000, collab:null,            meta:null,tracks:17,preStream:false,era:"post2020",  surprise:false,beefContext:null,           type:"compilation"},
  {id:"dldt",   title:"Dark Lane Demo Tapes",     release:"2020-05-01",fw:226000, total:2800000, collab:null,            meta:61, tracks:14,preStream:false,era:"post2020",  surprise:true, beefContext:null,           type:"mixtape",commercialMixtape:true},
  {id:"clb",    title:"Certified Lover Boy",      release:"2021-09-03",fw:613000, total:5400000, collab:null,            meta:60, tracks:21,preStream:false,era:"post2020",  surprise:false,beefContext:null,           type:"studio"},
  {id:"hn",     title:"Honestly, Nevermind",      release:"2022-06-17",fw:204000, total:1690000, collab:null,            meta:73, tracks:14,preStream:false,era:"post2020",  surprise:true, beefContext:null,           type:"studio"},
  {id:"hl",     title:"Her Loss",                 release:"2022-11-04",fw:404000, total:3340000, collab:"21 Savage",     meta:62, tracks:16,preStream:false,era:"post2020",  surprise:false,beefContext:null,           type:"studio"},
  {id:"fatd",   title:"For All the Dogs",         release:"2023-10-06",fw:402000, total:3310000, collab:null,            meta:52, tracks:23,preStream:false,era:"post2020",  surprise:false,beefContext:"pre-kendrick", type:"studio"},
  {id:"sss4u",  title:"Some Sexy Songs 4 U",      release:"2025-02-14",fw:246000, total:1420000, collab:"PARTYNEXTDOOR",meta:54, tracks:21,preStream:false,era:"post2020",  surprise:true, beefContext:"post-kendrick",type:"studio"},
];

const HN_HL_COMBINED = {
  id:"hn_hl",title:"Honestly, Nevermind / Her Loss",release:"2022-06-17",
  fw:608000,total:5030000,collab:"21 Savage (Her Loss)",meta:67,tracks:30,
  preStream:false,era:"post2020",surprise:false,beefContext:null,type:"studio",combined:true,
};

const PEERS = {
  kendrick:{name:"Kendrick Lamar",short:"Kendrick",color:C.purple,tier:"big3",albums:[
    {id:"k1",title:"good kid, m.A.A.d city",release:"2012-10-22",fw:242000, total:10000000,conf:"confirmed",meta:91,tracks:12},
    {id:"k2",title:"To Pimp a Butterfly",   release:"2015-03-16",fw:324000, total:5500000, conf:"estimated",meta:96,tracks:16},
    {id:"k3",title:"DAMN.",                 release:"2017-04-14",fw:603000, total:7500000, conf:"estimated",meta:95,tracks:14},
    {id:"k4",title:"Mr. Morale & TBS",      release:"2022-05-13",fw:295500, total:3500000, conf:"estimated",meta:94,tracks:18},
    {id:"k5",title:"GNX",                   release:"2024-11-22",fw:319000, total:2800000, conf:"estimated",meta:89,tracks:12},
  ]},
  cole:{name:"J. Cole",short:"Cole",color:"#10b981",tier:"big3",albums:[
    {id:"c1",title:"Cole World",              release:"2011-10-31",fw:218000,total:3200000, conf:"estimated",meta:61,tracks:16,preStream:true},
    {id:"c2",title:"Born Sinner",             release:"2013-06-18",fw:297000,total:3800000, conf:"estimated",meta:74,tracks:18,preStream:true},
    {id:"c3",title:"2014 Forest Hills Drive", release:"2014-12-09",fw:200000,total:6500000, conf:"estimated",meta:83,tracks:14,preStream:true},
    {id:"c4",title:"KOD",                     release:"2018-04-20",fw:397000,total:4200000, conf:"estimated",meta:78,tracks:12},
    {id:"c5",title:"The Off-Season",          release:"2021-05-14",fw:282000,total:2800000, conf:"estimated",meta:82,tracks:12},
  ]},
  kanye:{name:"Kanye West",short:"Kanye",color:C.teal,tier:"godfather",albums:[
    {id:"ye1",title:"MBDTF",               release:"2010-11-22",fw:496000,total:6500000,conf:"estimated",meta:94,tracks:13,preStream:true},
    {id:"ye2",title:"Yeezus",              release:"2013-06-18",fw:327000,total:3200000,conf:"estimated",meta:84,tracks:10},
    {id:"ye3",title:"The Life of Pablo",   release:"2016-02-14",fw:247000,total:4200000,conf:"estimated",meta:75,tracks:18},
    {id:"ye4",title:"ye",                  release:"2018-06-01",fw:208000,total:2500000,conf:"estimated",meta:67,tracks:8},
    {id:"ye5",title:"Donda",               release:"2021-08-29",fw:309000,total:3000000,conf:"estimated",meta:53,tracks:27},
    {id:"ye6",title:"Vultures 1",          release:"2024-02-10",fw:182000,total:1500000,conf:"estimated",meta:60,tracks:16},
  ]},
  jayz:{name:"Jay-Z",short:"Jay-Z",color:"#818cf8",tier:"legends",albums:[
    {id:"jz1",title:"The Blueprint",   release:"2001-09-11",fw:427000, total:3200000,conf:"estimated",meta:95,tracks:13,preStream:true},
    {id:"jz2",title:"The Black Album", release:"2003-11-14",fw:463000, total:2800000,conf:"estimated",meta:91,tracks:14,preStream:true},
    {id:"jz3",title:"4:44",            release:"2017-06-30",fw:136000, total:1800000,conf:"estimated",meta:86,tracks:10},
  ]},
  wayne:{name:"Lil Wayne",short:"Wayne",color:"#ef4444",tier:"legends",albums:[
    {id:"lw1",title:"Tha Carter III",release:"2008-06-10",fw:1020000,total:5500000,conf:"estimated",meta:78,tracks:15,preStream:true},
    {id:"lw2",title:"Tha Carter V",  release:"2018-09-28",fw:471000, total:3500000,conf:"estimated",meta:82,tracks:23},
  ]},
  eminem:{name:"Eminem",short:"Em",color:"#6b7280",tier:"legends",albums:[
    {id:"em1",title:"Marshall Mathers LP", release:"2000-05-23",fw:1760000,total:7000000,conf:"estimated",meta:90,tracks:18,preStream:true},
    {id:"em2",title:"Recovery",            release:"2010-06-22",fw:741000, total:4500000,conf:"estimated",meta:73,tracks:17,preStream:true},
    {id:"em3",title:"MMLP2",               release:"2013-11-05",fw:792000, total:4000000,conf:"estimated",meta:79,tracks:16,preStream:true},
  ]},
  travis:{name:"Travis Scott",short:"Travis",color:"#f59e0b",tier:"modern",albums:[
    {id:"ts1",title:"Astroworld",release:"2018-08-03",fw:537000,total:7000000,conf:"floor",    meta:90,tracks:17},
    {id:"ts2",title:"Utopia",   release:"2023-07-28",fw:496000,total:2500000,conf:"estimated",meta:87,tracks:19},
  ]},
  weeknd:{name:"The Weeknd",short:"Weeknd",color:"#e879f9",tier:"modern",albums:[
    {id:"tw1",title:"After Hours",release:"2020-03-20",fw:164000,total:6000000,conf:"estimated",meta:80,tracks:14},
    {id:"tw2",title:"Dawn FM",    release:"2022-01-07",fw:85000, total:2500000,conf:"estimated",meta:87,tracks:16},
  ]},
  juice:{name:"Juice WRLD",short:"Juice",color:"#e2e8f0",tier:"modern",albums:[
    {id:"jw1",title:"Death Race for Love",release:"2019-03-08",fw:165000,total:3500000,conf:"estimated",meta:76,tracks:22},
    {id:"jw2",title:"Legends Never Die", release:"2020-07-10",fw:497000,total:4500000,conf:"estimated",meta:61,tracks:21},
  ]},
  popsmoke:{name:"Pop Smoke",short:"Pop",color:"#94a3b8",tier:"modern",albums:[
    {id:"ps1",title:"Shoot for the Stars",release:"2020-07-03",fw:251000,total:4500000,conf:"estimated",meta:66,tracks:19},
  ]},
  carti:{name:"Playboi Carti",short:"Carti",color:"#ec4899",tier:"modern",albums:[
    {id:"pc1",title:"Die Lit",        release:"2018-05-11",fw:91000, total:3000000,conf:"estimated",meta:78,tracks:25},
    {id:"pc2",title:"Whole Lotta Red",release:"2020-12-25",fw:100000,total:2200000,conf:"estimated",meta:55,tracks:24},
  ]},
  future:{name:"Future",short:"Future",color:"#38bdf8",tier:"modern",albums:[
    {id:"fu1",title:"DS2",                    release:"2015-07-17",fw:150000,total:2500000,conf:"estimated",meta:79,tracks:17,preStream:false},
    {id:"fu2",title:"Future (self-titled)",   release:"2017-02-17",fw:135000,total:2200000,conf:"estimated",meta:73,tracks:17},
    {id:"fu3",title:"HNDRXX",                 release:"2017-02-24",fw:82000, total:1800000,conf:"estimated",meta:76,tracks:17},
    {id:"fu4",title:"The WIZRD",              release:"2019-01-18",fw:130000,total:2000000,conf:"estimated",meta:72,tracks:20},
    {id:"fu5",title:"High Off Life",          release:"2020-05-15",fw:150000,total:2200000,conf:"estimated",meta:67,tracks:21},
    {id:"fu6",title:"I Never Liked You",      release:"2022-04-29",fw:176000,total:1800000,conf:"estimated",meta:71,tracks:22},
    {id:"fu7",title:"We Don't Trust You",     release:"2024-03-22",fw:194000,total:1500000,conf:"estimated",meta:79,tracks:25},
  ]},
};

const PEER_GROUPS = {
  big3:     {label:"The Big 3",    desc:"The generational conversation — Drake, Kendrick, Cole",           keys:["kendrick","cole"],color:C.gold},
  godfather:{label:"The Godfather",desc:"Kanye as his own tier — shaped all three of them",                keys:["kanye"],          color:C.teal},
  legends:  {label:"Legends",      desc:"Jay-Z, Wayne, Eminem — pre-streaming catalogs still streaming",   keys:["jayz","wayne","eminem"],color:"#818cf8"},
  modern:   {label:"Modern Era",   desc:"Travis, Weeknd, Future, Juice WRLD, Pop Smoke, Carti",            keys:["travis","weeknd","future","juice","popsmoke","carti"],color:"#f59e0b"},
  all:      {label:"All Artists",  desc:"Full cross-era comparison",                                       keys:["kendrick","cole","kanye","jayz","wayne","eminem","travis","weeknd","future","juice","popsmoke","carti"],color:"#888"},
};

const BEEF_SONGS = [
  {id:"b1",title:"Back to Back",    artist:"Drake",   year:2015,fw:8000000, total:750000000, context:"vs Meek Mill",     won:true},
  {id:"b2",title:"Not Like Us",     artist:"Kendrick",year:2024,fw:71000000,total:600000000, context:"vs Drake",         won:true},
  {id:"b3",title:"Family Matters",  artist:"Drake",   year:2024,fw:35000000,total:180000000, context:"vs Kendrick",      won:false},
  {id:"b4",title:"Euphoria",        artist:"Kendrick",year:2024,fw:35000000,total:250000000, context:"vs Drake",         won:true},
  {id:"b5",title:"Story of Adidon", artist:"Pusha T", year:2018,fw:12000000,total:200000000, context:"vs Drake",         won:true},
  {id:"b6",title:"God's Plan",      artist:"Drake",   year:2018,fw:61000000,total:2800000000,context:"non-beef baseline",won:null},
  {id:"b7",title:"Hotline Bling",   artist:"Drake",   year:2015,fw:25000000,total:1800000000,context:"non-beef baseline",won:null},
  {id:"b8",title:"HUMBLE.",         artist:"Kendrick",year:2017,fw:38000000,total:2200000000,context:"non-beef baseline",won:null},
  {id:"b9",title:"Push Ups",        artist:"Drake",   year:2024,fw:18000000,total:120000000, context:"vs Kendrick",      won:false},
];

const ERAS = {
  "young-money":{label:"Young Money",short:"YM",  color:C.blue},
  "peak":        {label:"Peak Drake", short:"Peak",color:C.gold},
  "post2020":    {label:"Post-2020",  short:"Post",color:C.purple},
};
const BEEF_CTX = {
  "during-pusha":  {label:"Pusha T",      color:"#f87171"},
  "post-meek":     {label:"Post-Meek",    color:"#fb923c"},
  "pre-kendrick":  {label:"Pre-Kendrick", color:"#fbbf24"},
  "post-kendrick": {label:"Post-Kendrick",color:"#9ca3af"},
};
const MEDALS = ["🥇","🥈","🥉"];

// ── NEW TAB DATA ──────────────────────────────────────────────────

const BEEF_TIMELINE = [
  {date:"Nov 2023",     event:"FATD Scary Hours Edition — Scary Hours 3",actor:"Drake",type:"event",verdict:"cultural",desc:"Four months before 'Like That' publicly launched the beef, Drake released the FATD Scary Hours deluxe. The energy across that tape was conspicuously combative — not generic. Drake's lawsuit alleges UMG had knowledge of the deteriorating contract situation during this period. Four months later, Like That dropped. See Preparation Pattern section below."},
  {date:"Mar 22, 2024", event:"Like That",             actor:"Kendrick",type:"shot",   verdict:"opening",desc:"Verse on Future/Metro Boomin track. 'Fuck the Big 3' — public shot. J. Cole initially responds, then apologizes and exits. Drake silent."},
  {date:"Mar 29, 2024", event:"Push Ups",              actor:"Drake",   type:"response",verdict:"neutral",desc:"Drake's first response. Mocks height, fashion label, OVO signings. Dropped quietly, no media rollout. Generally seen as mid-tier by press."},
  {date:"Apr 5, 2024",  event:"Taylor Made Freestyle", actor:"Drake",   type:"response",verdict:"loss",   desc:"Used AI-generated Tupac and Snoop vocals. Tupac estate sent cease & desist; Drake removed it. Widely mocked. Media framing: 'Drake can't win without a dead man's voice.'"},
  {date:"~Apr 19, 2024",event:"The Deal (alleged)",    actor:"Industry",type:"flag",   verdict:"disputed",desc:"Drake alleges Kendrick/pgLang signed a ~1-year promotional/distribution deal approximately 3 days before Euphoria dropped. If accurate: the campaign infrastructure was in place before the 'organic' response launched. This allegation forms the spine of Drake's conspiracy claim."},
  {date:"Apr 22, 2024", event:"Euphoria",              actor:"Kendrick",type:"shot",   verdict:"win",     desc:"6+ minute diss. Ghostwriting, height, family, 'not a rap god.' Media reception: unanimous immediate praise from Complex, Rolling Stone, Pitchfork, XXL — within hours of drop, before any serious analysis could occur."},
  {date:"Apr 26, 2024", event:"6:16 in LA",            actor:"Kendrick",type:"shot",   verdict:"win",     desc:"Alleges Drake has an informant inside Kendrick's circle. Short and pressuring. Media: another win."},
  {date:"Apr 30, 2024", event:"Family Matters",        actor:"Drake",   type:"response",verdict:"buried",  desc:"Drake's 12-minute major response. Allegations about Dave Free, Kendrick's relationship, paternity. Released at night — Kendrick had two tracks ready to drop simultaneously, burying the news cycle."},
  {date:"Apr 30, 2024", event:"Meet the Grahams",      actor:"Kendrick",type:"shot",   verdict:"win",     desc:"Addressed to Drake's parents. Secret daughter allegations. Tactical timing: dropped same night as Family Matters. Media covered MtG and NLU; Family Matters was an afterthought within 24 hours."},
  {date:"Apr 30, 2024", event:"Not Like Us",           actor:"Kendrick",type:"shot",   verdict:"cultural",desc:"'Certified pedophile' hook. 71M first-week streams. Became the anthem of 2024. Later: the subject of Drake's core legal/philosophical argument."},
  {date:"May 25, 2024", event:"The Pop Out — Kia Forum",        actor:"Kendrick",type:"event",  verdict:"cultural",desc:"Live Compton performance headlined by Kendrick, billed as the Pop Out. NLU performed multiple times. Photographed imagery of OVO owl. Simultaneous stream event. J. Cole made a surprise appearance. Second major cultural wave — framed as a celebration of the W."},
  {date:"Jun 22, 2024", event:"NLU Music Video",       actor:"Kendrick",type:"event",  verdict:"cultural",desc:"Official video. Aerial Compton shots, OVO imagery, owl targets. Third wave of coverage. Grammy campaign begins in earnest."},
  {date:"Oct 2024",     event:"Drake Sues UMG",        actor:"Drake",   type:"legal",  verdict:"filed",   desc:"Drake files lawsuit: UMG and Spotify artificially inflated NLU by hundreds of millions of streams via bots and coordinated playlist placement, while suppressing Drake's response tracks."},
  {date:"Nov 2024",     event:"Drake Sues Spotify",    actor:"Drake",   type:"legal",  verdict:"filed",   desc:"Separate action against Spotify. Claims coordinated 'hitman' campaign using NLU as the weapon. Alleges data would prove manipulation if discovery were permitted."},
  {date:"Jan 2025",     event:"Suits Dismissed — Appeal Filed",actor:"Legal",   type:"legal",  verdict:"dismissed",desc:"Claims dismissed at pleading stage. Standard: 'certified pedophile' constitutes hyperbolic opinion — no reasonable person would interpret it as literal fact. Drake: the institutions that amplified it as truth now hide behind the ruling that no one was supposed to believe it. Appeal ongoing as of March 2026. No discovery has ever occurred — streaming data, UMG communications, and media payment records remain unexamined."},
  {date:"Feb 2, 2025",  event:"NLU Wins 5 Grammys",    actor:"Industry",type:"awards", verdict:"awarded", desc:"Record of the Year · Song of the Year · Best Rap Song · Best Rap Performance · Best Music Video. Grammys award all five top categories to a song that courts ruled contained no literally credible factual claims."},
  {date:"Feb 9, 2025",  event:"Super Bowl LIX Halftime — 133M Viewers",actor:"Industry",type:"event",  verdict:"cultural",desc:"Kendrick performs the Super Bowl LIX halftime show — 133.5M viewers, the most-watched halftime show in history. He performs NLU, references the lawsuit mid-show ('I wanna play their favorite song, but you know they love to sue'). Seven days after Drake's defamation claims were dismissed as legally non-factual hyperbole, the largest entertainment platform available broadcast those same allegations. Trump attended — first sitting president at a Super Bowl. Full analysis in the Super Bowl section and Drake's Theory below."},
  {date:"Nov 22, 2024", event:"GNX (surprise drop)",    actor:"Kendrick",type:"event",  verdict:"cultural",desc:"Surprise album drop. Strategically timed: after Grammy submission window closed for 2025 ceremony (so existing NLU campaign stays clean), before year-end lists. 'Luther' ft. SZA becomes a crossover smash. GNX consolidates Kendrick's position as the dominant critical and commercial voice of 2024 without reopening the beef directly. It is the musical victory lap."},
  {date:"~Jan 2025",    event:"Podcast/Media Pay Claims",actor:"Drake",  type:"flag",   verdict:"disputed",desc:"Drake and his team have alleged — without yet being able to prove through discovery — that hip-hop media figures and podcast hosts received coordinated compensation or inducements to amplify the Kendrick narrative and decline to engage seriously with Drake's side. No formal legal action specifically targeting media figures has yet produced discovery."},
];

const OPTICS_ITEMS = [
  {flag:true,  label:"Red Flag",  item:"Both artists were UMG-distributed at key moments",                      note:"Drake on Republic/UMG. Kendrick's pgLang distributed through Amazon but TDE historically through Interscope/UMG. UMG had financial interest in both — choosing to amplify one over its own signed artist is an explicit business decision, not passive."},
  {flag:true,  label:"Red Flag",  item:"Euphoria received unanimous critical acclaim within hours",              note:"A 6-minute diss track received Best New Music-tier praise from every major outlet before any serious analysis could occur. The speed suggests either pre-briefed press relationships or a critical establishment already primed to receive it as a masterpiece."},
  {flag:true,  label:"Red Flag",  item:"NLU won Grammys for allegations courts ruled legally non-factual",     note:"Grammys awarded Song/Record of the Year to a song built on the hook 'certified pedophile' — the same claims courts found no reasonable person would believe as literal fact. The industry institutionalized the narrative it simultaneously declared legally indefensible."},
  {flag:true,  label:"Red Flag",  item:"Super Bowl platform awarded 7 days after lawsuit dismissal",           note:"Feb 2: suits dismissed. Feb 9: Kendrick performs NLU in front of 133M people at the Super Bowl. The NFL's decision to book Kendrick was made months earlier, but the institutional optics are stark: the same allegations a court ruled legally non-factual were then broadcast on the largest platform in American entertainment with zero counterpoint available to Drake."},
  {flag:true,  label:"Red Flag",  item:"Drake's response tracks received drastically less playlist placement", note:"Per Drake's lawsuit (dismissed before discovery): Family Matters and Push Ups received a fraction of the editorial playlist adds that NLU received. If accurate, this is measurable industry thumb on the scale — not a reflection of organic audience preference."},
  {flag:true,  label:"Red Flag",  item:"The alleged deal timing (3 days before Euphoria)",                     note:"If a promotional infrastructure deal was signed 3 days before the first major volley, the 'spontaneous response' framing is structurally false. The campaign was pre-built. This doesn't mean the music was bad — it means the 'organic uprising' narrative was manufactured."},
  {flag:true,  label:"Red Flag",  item:"Family Matters news cycle buried within hours by simultaneous drops",  note:"Kendrick having two finished, mastered, mixed tracks ready to release the same night Drake dropped his biggest response is not something that happens spontaneously. The tactical ambush required advance preparation and, arguably, advance knowledge of Drake's timeline."},
  {flag:false, label:"Context",   item:"Kendrick has been a critical darling since 2012, pre-dating the beef", note:"The media alignment with Kendrick isn't new. GKMC (2012), TPAB (2015), DAMN. (2017) all received superlative reviews before any beef existed. The institutional preference is longstanding, not manufactured for this moment."},
  {flag:false, label:"Context",   item:"Drake withdrew from Grammy eligibility himself in 2022",               note:"He publicly called the Grammys 'no longer meaningful' and withdrew CLB from consideration. He cannot fully claim the institution is rigged when he spent a year telling his audience it didn't matter."},
  {flag:false, label:"Context",   item:"NLU connected with real audiences, not just industry machinery",       note:"The song moved people. Concert crowds were chanting it before any Grammy validation. Industry amplification may have accelerated it, but the grassroots adoption was real. The conspiracy argument struggles to explain why millions of people chose to like it."},
  {flag:false, label:"Context",   item:"The Super Bowl booking predated the beef's conclusion",               note:"Halftime show bookings happen 12+ months in advance. The NFL selected Kendrick in late 2023 or early 2024, before the beef exploded publicly. The timing of the dismissal and the performance being 7 days apart is coincidental from the NFL's scheduling perspective."},
  {flag:null,  label:"Unresolved",item:"Discovery never happened — Drake's data claims were never tested",     note:"The lawsuits were dismissed at the pleading stage, not after discovery. Drake claimed to have stream data that would prove manipulation. That data was never put before a court. Dismissal means the claims didn't clear a legal threshold — it does not mean they were empirically false."},
  {flag:null,  label:"Unresolved",item:"The 'no reasonable person' legal standard and its cultural implications",note:"This is Drake's sharpest philosophical point. If the song's allegations (predator, pedophile) weren't literally believable by reasonable people — if they were legally just 'hyperbole' — then the culture celebrated a smear it knew wasn't true. What does that say about the moment, and who benefited from manufacturing it?"},
  {flag:null,  label:"Unresolved",item:"Podcast and hip-hop media coordination allegations",                  note:"Drake's team has alleged that hip-hop media figures were compensated or induced to amplify the Kendrick narrative and decline serious engagement with Drake's side. This has not been adjudicated. The observable pattern — near-uniform media coverage framing, same-day editorial alignment across competing outlets — is consistent with coordination but not proof of it."},
];

const GRAMMY_DATA = [
  {key:"kendrick",name:"Kendrick Lamar",wins:27,noms:66,color:C.purple,    notable:["NLU: 5-category sweep (67th Grammys, 2025)","GNX: Best Rap Album (68th Grammys, 2026)","Luther: Record of Year (68th Grammys, 2026)","Pulitzer Prize (2018, first rapper)","Most-awarded hip-hop artist in Grammy history"],outsider:true,  withdrew:false},
  {key:"drake",   name:"Drake",         wins:4, noms:51,color:C.gold,      notable:["Best Rap Song: Hotline Bling","Best Rap Song: God's Plan","Withdrew from eligibility (2022)"],outsider:false, withdrew:true},
  {key:"cole",    name:"J. Cole",       wins:1, noms:14,color:"#10b981",   notable:["1 win from 14 nominations","Widely seen as undervalued by Grammys"],outsider:true,  withdrew:false},
  {key:"kanye",   name:"Kanye West",    wins:24,noms:75,color:C.teal,      notable:["Most wins: rap/hip-hop era","Lost Album of Year despite historic acclaim"],outsider:false, withdrew:false},
  {key:"jayz",    name:"Jay-Z",         wins:24,noms:88,color:"#818cf8",   notable:["24 wins but 0 Album of the Year","Most nominations in history"],outsider:false, withdrew:false},
  {key:"eminem",  name:"Eminem",        wins:15,noms:47,color:"#6b7280",   notable:["Best Rap Album 9 times","Won Album of Year with The Eminem Show"],outsider:false, withdrew:false},
  {key:"wayne",   name:"Lil Wayne",     wins:5, noms:13,color:"#ef4444",   notable:["Tha Carter III: 1.02M opening week","5 Grammy wins across rap categories","Considered the greatest rapper alive circa 2008–2010"],outsider:false, withdrew:false},
  {key:"travis",  name:"Travis Scott",  wins:0, noms:12,color:"#f59e0b",   notable:["0 wins from 12 nominations","Astroworld — zero Grammy wins"],outsider:true,  withdrew:false},
  {key:"weeknd",  name:"The Weeknd",    wins:4, noms:23,color:"#e879f9",   notable:["Boycotted Grammys 2021 after 0 noms","Called process 'corrupt'"],outsider:true,  withdrew:true},
];

const NLU_GRAMMYS = [
  {cat:"Record of the Year",    won:true,  note:"First rap diss track to win this category"},
  {cat:"Song of the Year",      won:true,  note:"Central lyric ('certified pedophile') ruled legally non-factual"},
  {cat:"Best Rap Song",         won:true,  note:"5th time Kendrick has won this category"},
  {cat:"Best Rap Performance",  won:true,  note:""},
  {cat:"Best Music Video",      won:true,  note:"Shot in Compton with Drake's address OVO imagery"},
  {cat:"Album of the Year (GNX)",won:false,note:"Nominated but did not win"},
];

const LUTHER_DATA = {
  title:"Luther",
  artist:"Kendrick Lamar ft. SZA",
  album:"GNX",
  albumDrop:"Nov 22, 2024",
  fwStreams:68000000,
  totalStreams:850000000,
  hot100Peak:1,
  weeksAt1:11,
  context:"post-beef victory lap",
  note:"Largest streaming week for any Kendrick song. Debuted #1 Hot 100, spent 11 consecutive weeks at #1. Crossover success — SZA's fanbase added a non-rap audience layer. The song's commercial dominance arrived after the beef, after the Grammys, after the Super Bowl. It is the clearest evidence that Kendrick's streaming ceiling expanded as a direct result of the 2024 moment. Whether that expansion was organic or amplified is the question Drake's lawsuit tried to ask.",
};

const GNX_DATA = {
  title:"GNX",
  release:"Nov 22, 2024",
  fw:319000,
  totalAlbum:2800000,
  meta:89,
  tracks:12,
  type:"surprise",
  grammarWindowNote:"Released after the Grammy submission cutoff for the 2025 ceremony (covering releases through ~Sept 30, 2024). NLU remained the sole Grammy vehicle for 2025. At the 68th Grammys (Feb 1, 2026), GNX won Best Rap Album, Luther won Record of the Year and Best Melodic Rap Performance, and tv off won Best Rap Song — five more wins. GNX did not win Album of the Year, which went to Bad Bunny's DeBÍ TiRAR MáS FOToS.",
  strategicNote:"The drop timing is precise: after the 5-Grammy sweep was locked in, after NLU had already done its institutional work, before year-end lists compiled. GNX and NLU occupied separate Grammy years by design — two distinct award cycles from one 8-month period. Both cycles delivered.",
};

const PITCHFORK_SCORES = [
  {artist:"Drake",   album:"Take Care",    year:2011,score:9.2,bnm:true},
  {artist:"Drake",   album:"NWTS",         year:2013,score:8.7,bnm:true},
  {artist:"Drake",   album:"IYRTITL",      year:2015,score:8.0,bnm:true},
  {artist:"Drake",   album:"Views",        year:2016,score:7.2,bnm:false},
  {artist:"Drake",   album:"More Life",    year:2017,score:8.0,bnm:false},
  {artist:"Drake",   album:"Scorpion",     year:2018,score:6.5,bnm:false},
  {artist:"Drake",   album:"CLB",          year:2021,score:6.6,bnm:false},
  {artist:"Drake",   album:"HN",           year:2022,score:6.5,bnm:false},
  {artist:"Drake",   album:"Her Loss",     year:2022,score:6.5,bnm:false},
  {artist:"Drake",   album:"FATD",         year:2023,score:6.8,bnm:false},
  {artist:"Kendrick",album:"GKMC",         year:2012,score:9.5,bnm:true},
  {artist:"Kendrick",album:"TPAB",         year:2015,score:9.8,bnm:true},
  {artist:"Kendrick",album:"DAMN.",        year:2017,score:9.6,bnm:true},
  {artist:"Kendrick",album:"Mr. Morale",   year:2022,score:9.0,bnm:true},
  {artist:"Kendrick",album:"GNX",          year:2024,score:8.7,bnm:true},
];

// ── MODEL ────────────────────────────────────────────────────────
function getMonths(rel,cutoff=CUTOFF){
  const d=new Date(rel);
  let m=(cutoff.getFullYear()-d.getFullYear())*12+(cutoff.getMonth()-d.getMonth());
  if(cutoff.getDate()<d.getDate()) m--;
  return Math.max(m,0.5);
}
function compute(a,norm,alpha){
  if(a.legacy) return {...a,elapsed:getMonths(a.release),catalog:0,projCat:0,adjFWPct:0,extrapolated:false,year:+a.release.slice(0,4),perTrack:null,durability:0};
  const elapsed=getMonths(a.release);
  const catalog=a.total-a.fw;
  const projCat=catalog*Math.pow(norm/elapsed,alpha);
  const adjFWPct=a.fw/(a.fw+projCat);
  const extrapolated=elapsed<norm;
  const year=+a.release.slice(0,4);
  const perTrack=a.tracks?a.total/a.tracks:null;
  const catDepth=(1-adjFWPct)*100;
  const metaNorm=((a.meta||65)/100)*100;
  const catRatio=Math.min(100,(catalog/Math.max(a.fw,1))*5);
  const durability=Math.round(catDepth*0.60+metaNorm*0.25+catRatio*0.15);
  return {...a,elapsed,catalog,projCat,adjFWPct,extrapolated,year,perTrack,durability};
}
function ols(pts){
  const n=pts.length;if(n<2)return{slope:0,intercept:0,r2:0};
  const sx=pts.reduce((s,p)=>s+p[0],0),sy=pts.reduce((s,p)=>s+p[1],0);
  const sxy=pts.reduce((s,p)=>s+p[0]*p[1],0),sxx=pts.reduce((s,p)=>s+p[0]*p[0],0);
  const slope=(n*sxy-sx*sy)/(n*sxx-sx*sx);
  const intercept=(sy-slope*sx)/n;
  const yMean=sy/n;
  const ssTot=pts.reduce((s,p)=>s+(p[1]-yMean)**2,0);
  const ssRes=pts.reduce((s,p)=>s+(p[1]-(slope*p[0]+intercept))**2,0);
  return{slope,intercept,r2:ssTot?1-ssRes/ssTot:0};
}
const mean=arr=>arr.length?arr.reduce((s,v)=>s+v,0)/arr.length:0;
const stdev=arr=>{if(!arr.length)return 0;const m=mean(arr);return Math.sqrt(arr.reduce((s,v)=>s+(v-m)**2,0)/arr.length);};
function fmt(n){if(n>=1e9)return(n/1e9).toFixed(2)+"B";if(n>=1e6)return(n/1e6).toFixed(2)+"M";if(n>=1e3)return(n/1e3).toFixed(0)+"K";return String(Math.round(n));}
const pct=n=>(n*100).toFixed(1)+"%";
const mcClr=s=>!s?"#444":s>=90?C.green:s>=80?"#86efac":s>=70?"#facc15":s>=60?"#fb923c":C.red;
const durClr=s=>s>=72?C.green:s>=55?C.gold:s>=40?"#fb923c":C.red;
const scClr=s=>s>=9?C.green:s>=8?"#86efac":s>=7?"#facc15":s>=6?"#fb923c":C.red;

// ── SVG PRIMITIVES ───────────────────────────────────────────────
function Scatter({pts,reg,xLab,yLab,W=290,H=160}){
  const pad={t:12,r:14,b:28,l:38};const w=W-pad.l-pad.r,h=H-pad.t-pad.b;
  if(!pts.length)return null;
  const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y);
  const xMn=Math.min(...xs),xMx=Math.max(...xs)||1;
  const yMn=Math.min(...ys)*0.85,yMx=Math.max(...ys)*1.15;
  const sx=x=>pad.l+((x-xMn)/(xMx-xMn||1))*w;
  const sy=y=>pad.t+(1-(y-yMn)/(yMx-yMn||1))*h;
  return(
    <svg width={W} height={H}>
      {[0,0.5,1].map(t=><line key={t} x1={pad.l} x2={pad.l+w} y1={pad.t+t*h} y2={pad.t+t*h} stroke="#181818"/>)}
      {reg&&<line x1={sx(xMn)} y1={sy(reg.slope*xMn+reg.intercept)} x2={sx(xMx)} y2={sy(reg.slope*xMx+reg.intercept)} stroke={C.gold} strokeWidth={1.5} strokeDasharray="5,3" opacity={0.5}/>}
      {pts.map((p,i)=><circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={p.r||4.5} fill={p.c||C.gold} opacity={0.88}/>)}
      <line x1={pad.l} x2={pad.l+w} y1={pad.t+h} y2={pad.t+h} stroke="#222"/>
      <line x1={pad.l} x2={pad.l} y1={pad.t} y2={pad.t+h} stroke="#222"/>
      <text x={pad.l+w/2} y={H-4} textAnchor="middle" fill="#3a3a3a" fontSize={9}>{xLab}</text>
      <text x={11} y={pad.t+h/2} textAnchor="middle" fill="#3a3a3a" fontSize={9} transform={`rotate(-90,11,${pad.t+h/2})`}>{yLab}</text>
    </svg>
  );
}
function Bars({items,W=290,H=130}){
  if(!items.length)return null;
  const maxV=Math.max(...items.map(b=>b.v))*1.2||1;
  const bw=Math.min(54,W/(items.length+1)*0.65);
  const gap=W/(items.length+1);const baseY=H-26;
  return(
    <svg width={W} height={H}>
      <line x1={22} x2={W-10} y1={baseY} y2={baseY} stroke="#222"/>
      {items.map((b,i)=>{
        const x=gap*(i+1)-bw/2,bh=Math.max(2,(b.v/maxV)*(baseY-16));
        return(<g key={b.label}>
          <rect x={x} y={baseY-bh} width={bw} height={bh} fill={b.c||C.gold} opacity={0.8} rx={1}/>
          <text x={x+bw/2} y={baseY+13} textAnchor="middle" fill="#555" fontSize={8}>{b.label}</text>
          <text x={x+bw/2} y={baseY-bh-4} textAnchor="middle" fill={b.c||C.gold} fontSize={9.5}>{b.v<2?pct(b.v):fmt(b.v)}</text>
        </g>);
      })}
    </svg>
  );
}
function Radar({artists,size=200}){
  const cx=size/2,cy=size/2,r=size*0.35;
  const axes=["Opening\nPower","Catalog\nDepth","Critics","Consistency","Volume"];
  const n=axes.length,ang=i=>(Math.PI*2*i/n)-Math.PI/2;
  const pt=(s,i)=>[cx+(s/100)*r*Math.cos(ang(i)),cy+(s/100)*r*Math.sin(ang(i))];
  return(
    <svg width={size} height={size}>
      {[0.25,0.5,0.75,1].map(t=>(
        <polygon key={t} fill="none" stroke="#1c1c1c" strokeWidth={1}
          points={axes.map((_,i)=>`${cx+t*r*Math.cos(ang(i))},${cy+t*r*Math.sin(ang(i))}`).join(" ")}/>
      ))}
      {axes.map((ax,i)=>{
        const tx=cx+(r+24)*Math.cos(ang(i)),ty=cy+(r+24)*Math.sin(ang(i));
        return ax.split("\n").map((l,li,arr)=>(
          <text key={li} x={tx} y={ty+(li-arr.length/2+0.5)*10} textAnchor="middle" dominantBaseline="middle" fill="#3a3a3a" fontSize={7.5}>{l}</text>
        ));
      })}
      {artists.map(({scores,color},ai)=>(
        <g key={ai}>
          <polygon points={scores.map((s,i)=>pt(s,i).join(",")).join(" ")} fill={color} fillOpacity={0.12} stroke={color} strokeWidth={1.5}/>
          {scores.map((s,i)=><circle key={i} cx={pt(s,i)[0]} cy={pt(s,i)[1]} r={3} fill={color}/>)}
        </g>
      ))}
    </svg>
  );
}

// ── UI ATOMS ─────────────────────────────────────────────────────
function Pill({active,color=C.gold,onClick,children,small}){
  return(
    <button onClick={onClick} style={{padding:small?"2px 8px":"5px 13px",border:`1px solid ${active?color:"#2a2a2a"}`,background:active?`${color}18`:"transparent",color:active?color:"#555",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:small?9:11,borderRadius:2,transition:"all 0.15s",letterSpacing:1,outline:"none"}}>{children}</button>
  );
}
function Toggle({on,set,label,color=C.gold}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      {label&&<span style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:on?color:"#3a3a3a"}}>{label}</span>}
      <div onClick={()=>set(v=>!v)} style={{width:34,height:18,borderRadius:9,background:on?color:"#222",cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}>
        <div style={{position:"absolute",top:2,left:on?16:2,width:14,height:14,borderRadius:7,background:on?"#000":"#555",transition:"left 0.2s"}}/>
      </div>
    </div>
  );
}
function SLabel({children}){
  return <div style={{fontSize:9,letterSpacing:4,color:C.goldDim,textTransform:"uppercase",marginBottom:14,paddingBottom:6,borderBottom:`1px solid ${C.border}`}}>{children}</div>;
}
function InfoBox({color=C.blue,children}){
  return <div style={{padding:"10px 14px",background:"#0f0f0f",border:`1px solid ${color}22`,borderRadius:2,marginBottom:14,fontSize:11,color:"#555",lineHeight:1.7}}>{children}</div>;
}
function DurBadge({score}){
  if(!score)return null;
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",background:`${durClr(score)}10`,border:`1px solid ${durClr(score)}30`,borderRadius:2,padding:"3px 7px",flexShrink:0,minWidth:34}}>
      <span style={{fontSize:13,color:durClr(score),fontStyle:"italic",lineHeight:1}}>{score}</span>
      <span style={{fontSize:7,color:"#3a3a3a",letterSpacing:1}}>DUR</span>
    </div>
  );
}
function AlbumCard({a,rank,accent=C.gold,showConf=false,ghost=false}){
  const isTop=rank<3&&!ghost;
  return(
    <div style={{background:ghost?"transparent":isTop?"linear-gradient(135deg,#141200,#0d0d0d)":C.card,border:`1px solid ${ghost?"rgba(45,212,191,0.3)":isTop?C.borderHi:C.border}`,borderLeft:`3px solid ${ghost?C.teal:accent}`,borderStyle:ghost?"dashed solid":"solid",borderRadius:3,padding:"12px 15px",marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
      <div style={{fontSize:isTop?22:13,minWidth:32,textAlign:"center",color:ghost?C.teal:isTop?C.gold:"#444",fontStyle:"italic",flexShrink:0}}>
        {ghost?"◇":rank<3?MEDALS[rank]:`#${rank+1}`}
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:3}}>
          <span style={{fontSize:13.5,color:ghost?"#7af0e0":"#e8d9a0",fontStyle:"italic"}}>{a.title}</span>
          {a.collab&&<span style={{fontSize:9,color:"#555"}}>w/ {a.collab}</span>}
          {a.era&&ERAS[a.era]&&<Pill active small color={ERAS[a.era].color}>{ERAS[a.era].short}</Pill>}
          {a.beefContext&&BEEF_CTX[a.beefContext]&&<Pill active small color={BEEF_CTX[a.beefContext].color}>🥊</Pill>}
          {a.preStream&&<Pill active small color={C.blue}>pre-stream</Pill>}
          {a.surprise&&<Pill active small color="#9ca3af">surprise</Pill>}
          {a.type==="mixtape"&&!a.commercialMixtape&&!a.legacy&&<Pill active small color={C.orange}>mixtape</Pill>}
          {a.type==="mixtape"&&a.commercialMixtape&&<Pill active small color={C.orange}>commercial mixtape</Pill>}
          {a.type==="playlist"&&<Pill active small color="#22d3ee">playlist</Pill>}
          {a.type==="compilation"&&<Pill active small color="#8b5cf6">comp.</Pill>}
          {a.combined&&<Pill active small color={C.pink}>double</Pill>}
          {ghost&&<Pill active small color={C.teal}>projected</Pill>}
          {showConf&&a.conf&&<span style={{fontSize:8,color:a.conf==="confirmed"?C.green:a.conf==="floor"?C.blue:"#fbbf24"}}>{a.conf==="confirmed"?"✓":a.conf==="floor"?"~":"⚠"}</span>}
          {a.artistName&&a.artistName!=="Drake"&&<Pill active small color={a.artistColor||C.purple}>{a.artistName.split(" ")[0]}</Pill>}
        </div>
        <div style={{fontSize:9.5,color:"#4a4030",marginBottom:5}}>
          {a.year} · {fmt(a.total)} total · {fmt(a.fw)} FW · {a.tracks}trk
          {a.meta&&<span style={{color:mcClr(a.meta),marginLeft:6}}>MC:{a.meta}</span>}
        </div>
        <div style={{height:2.5,background:"#1a1a1a",borderRadius:2}}>
          <div style={{height:"100%",width:`${(a.adjFWPct*100).toFixed(1)}%`,background:`linear-gradient(90deg,${ghost?C.teal:accent},${C.goldDim})`,borderRadius:2,transition:"width 0.4s ease"}}/>
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5,flexShrink:0}}>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:16,color:ghost?C.teal:isTop?C.green:accent,fontStyle:"italic"}}>{pct(a.adjFWPct)}</div>
          <div style={{fontSize:7,color:"#555",letterSpacing:1.5}}>CATALOG SCORE ↓ better</div>
        </div>
        <DurBadge score={a.durability}/>
      </div>
    </div>
  );
}
function ICard({title,question,children,verdict}){
  return(
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:3,padding:"16px 18px"}}>
      <div style={{fontSize:13,color:C.gold,marginBottom:3,fontStyle:"italic"}}>{title}</div>
      <div style={{fontSize:10,color:"#3a3a3a",marginBottom:12,borderBottom:`1px solid #1a1a1a`,paddingBottom:10}}>{question}</div>
      <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>{children}</div>
      <div style={{fontSize:11.5,color:"#7a6a50",lineHeight:1.95}}>{verdict}</div>
    </div>
  );
}

// ── PREMISE ──────────────────────────────────────────────────────
function PremiseTab(){
  const tabs=[
    {id:"rankings",   label:"Rankings",        desc:"Drake's full discography ranked by catalog score with adjustable normalization window, era filters, and toggles for non-studio releases."},
    {id:"insights",   label:"Insights",        desc:"Six statistical questions about what actually predicts durability — year of release, critical scores, beef context, track count, surprise drops, and opening week power."},
    {id:"quadrant",   label:"Quadrant",        desc:"Every album mapped by opening-week power vs long-term durability score. The quadrant labels — Cultural Monument, Commercial Event, Slow Burn, Under the Radar — tell you which albums were events vs institutions."},
    {id:"beef",       label:"Beef Lens",       desc:"Catalog score applied to the diss tracks themselves, plus a comparison of how conflict-adjacent albums perform vs quiet-period releases."},
    {id:"iceman",     label:"Iceman ◇",        desc:"Scenario modeler for Drake's next unreleased studio album. Adjust opening week, Metacritic prediction, and track count to see where it would rank."},
    {id:"arc",        label:"Career Arc",      desc:"Visual timeline of every album's catalog score across Drake's full career — era bands, beef markers, and the overall trend line."},
    {id:"peers",      label:"Peers",           desc:"Drake's catalog against twelve peers from Kendrick and Cole to Kanye, Jay-Z, Future, Travis Scott, and more — unified rankings, radar charts, and artist DNA comparisons."},
    {id:"legitimacy", label:"NLU ◆ Conspiracy",desc:"Structured examination of Drake's conspiracy allegations — the full beef timeline, the botting claims and what was never tested, the podcast payola allegation, and the philosophical paradox at the heart of the 'no reasonable person' legal ruling."},
    {id:"awards",     label:"Awards Gap",      desc:"Grammy wins vs nominations across the hip-hop era, the NLU five-category sweep, the Super Bowl sequence, and the Luther/GNX victory lap data."},
    {id:"media",      label:"Media Lens",      desc:"Pitchfork score trajectories for Drake vs Kendrick, and a framework for understanding how critical consensus gets manufactured — pre-selection, confirmation bias, suppression, and institutionalization via awards."},
    {id:"conclusions",label:"Conclusions",     desc:"The four definitive verdicts the data supports, the six most interesting non-obvious takeaways, the limits of what the model can actually prove, and a final statement."},
    {id:"data",       label:"Data",            desc:"Full sortable discography table with every metric, plus complete methodology documentation."},
  ];
  return(
    <div>
      <div style={{background:"linear-gradient(135deg,#1a1200,#0d0d0d)",border:`1px solid ${C.border}`,borderRadius:4,padding:"28px 28px 24px",marginBottom:20}}>
        <div style={{fontSize:9,letterSpacing:5,color:C.goldDim,textTransform:"uppercase",marginBottom:14}}>What This Is</div>
        <p style={{fontSize:14,color:"#d4c080",lineHeight:2,margin:"0 0 16px",fontStyle:"italic"}}>
          A data dashboard that ranks Drake's discography — and his generation of peers — by streaming durability rather than opening-week numbers, critical scores, or cultural narrative.
        </p>
        <p style={{fontSize:12.5,color:"#7a6a50",lineHeight:2,margin:"0 0 16px"}}>
          The central metric is the <span style={{color:C.gold}}>Catalog Score</span>: the fraction of an album's total streaming life that happened in week one. A low score means the album kept accumulating listens long after release — people discovered it, returned to it, put it in rotation. A high score means the streaming was front-loaded: the event drove the numbers, and when the event ended, so did the listening. A score of 8% means 92% of the album's listening life still lay ahead after week one.
        </p>
        <p style={{fontSize:12.5,color:"#7a6a50",lineHeight:2,margin:"0 0 16px"}}>
          The model projects each album's streaming forward over a normalized window (adjustable from 18 to 48 months) using a power-law decay curve, then calculates the first-week fraction against that projected total. This corrects for the fact that a 2010 album has had 15 years to accumulate streams while a 2024 album has had months — without the correction, every old album would look durable and every new one would look front-loaded regardless of their actual character. Four presets in the controls bar set both parameters together: Default (balanced baseline), Legacy Test (strictest long-window measure), Recent Pulse (short window, weighted toward current behavior), and Deep Catalog (most aggressive penalty for event albums).
        </p>
        <p style={{fontSize:12.5,color:"#7a6a50",lineHeight:2,margin:0}}>
          The companion metric is the <span style={{color:C.teal}}>Durability Score</span> (0–100): a composite of catalog depth (60%), Metacritic score (25%), and catalog-to-opening-week multiple (15%). It rewards albums that hold their replay, earn critical respect, and keep accumulating streams relative to their debut size. The two scores aren't the same — an album can have excellent catalog ratio but middling critical reception and rank lower on durability, or vice versa. When they diverge, that divergence is usually the most interesting thing to look at.
        </p>
      </div>

      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:3,padding:"18px 20px",marginBottom:20}}>
        <div style={{fontSize:9,letterSpacing:5,color:C.goldDim,textTransform:"uppercase",marginBottom:14}}>The Thesis</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
          {[
            {color:C.gold,   head:"Opening week is what the industry measures.",   body:"Charts, press cycles, Grammy eligibility, label deal negotiations — all of it runs on first-week numbers. An artist who debuts at #1 with 400K is treated as more successful than one who slowly accumulates 8M over three years. That's a useful measure for business. It's a terrible measure for legacy."},
            {color:C.green,  head:"Catalog durability is what legacy actually looks like.", body:"The albums people are still putting on playlists in 2030 are not necessarily the ones that hit hardest in week one. Take Care is Drake's most durable album. It also happened to open huge. That combination — not just the opening — is why it's the closest thing he has to a definitive record."},
            {color:C.purple, head:"The narrative and the data are often grading different things.", body:"Critical consensus, Grammy outcomes, and cultural moment-making all reward things the streaming model doesn't — thematic ambition, cultural timing, beef leverage. Understanding what each metric is actually measuring is the only way to compare artists across different theories of what success means."},
            {color:C.red,    head:"Context explains more than era.", body:"Drake's catalog score is more predicted by whether he was in a beef than by what year he released. Quiet-period albums hold regardless of era. Conflict-adjacent albums fade regardless of how good they were. That's the finding the data keeps returning to — and it has implications that extend well beyond Drake."},
            {color:"#f59e0b",head:"The beef is a lens, not just a context.", body:"The beef/quiet split predicts catalog performance more reliably than release year, Metacritic score, or track count combined. That's the model's strongest finding — and it means the 2024 Kendrick/Drake conflict wasn't just a cultural moment. It was a controlled experiment. The albums released around it are the data."},
            {color:C.blue,   head:"Institutional validation and organic durability are different scorecards.", body:"NLU won five Grammys and was ruled legally non-factual. Take Care has the deepest catalog ratio in the dataset and earned four Grammy wins from 51 nominations at a 7.8% clip. The institutions and the streams are measuring entirely different things. This project exists to show both at once."},
          ].map(({color,head,body})=>(
            <div key={head} style={{borderLeft:`2px solid ${color}`,paddingLeft:14}}>
              <div style={{fontSize:11.5,color:"#c0aa70",marginBottom:6,fontStyle:"italic"}}>{head}</div>
              <div style={{fontSize:11,color:"#5a4a30",lineHeight:1.85}}>{body}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:3,padding:"18px 20px",marginBottom:20}}>
        <div style={{fontSize:9,letterSpacing:5,color:C.goldDim,textTransform:"uppercase",marginBottom:14}}>Tab Guide</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:8}}>
          {tabs.map(t=>(
            <div key={t.id} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:`1px solid #161616`}}>
              <div style={{fontSize:9,color:C.gold,letterSpacing:1,minWidth:100,flexShrink:0,paddingTop:1,textTransform:"uppercase"}}>{t.label}</div>
              <div style={{fontSize:10.5,color:"#5a4a30",lineHeight:1.7}}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8}}>
        {[
          {label:"Data cutoff",         value:"September 5, 2025",  color:"#666"},
          {label:"Drake totals",         value:"Luminate confirmed", color:C.green},
          {label:"Peer totals",          value:"RIAA + estimated",   color:"#fbbf24"},
          {label:"Model",                value:"Power-law decay",    color:C.gold},
          {label:"Default window",       value:"30 months",          color:C.gold},
          {label:"Artists covered",      value:"13",                 color:C.purple},
        ].map(({label,value,color})=>(
          <div key={label} style={{background:"#0d0d0d",border:`1px solid #1a1a1a`,borderRadius:3,padding:"9px 12px"}}>
            <div style={{fontSize:7.5,color:"#333",letterSpacing:2,textTransform:"uppercase",marginBottom:3}}>{label}</div>
            <div style={{fontSize:12,color,fontStyle:"italic"}}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── RANKINGS ─────────────────────────────────────────────────────
function RankingsTab({ranked,flagged,drake,norm,streamOnly,setStreamOnly,eraFilter,setEraFilter,showNonStudio,setShowNonStudio,combineHnHl,setCombineHnHl}){
  const full=drake.filter(a=>!a.extrapolated);
  const best=ranked[0];
  const bestDur=useMemo(()=>[...full].sort((a,b)=>b.durability-a.durability)[0],[full]);
  return(<>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:8,marginBottom:18}}>
      {[
        {label:"Career Total",       value:fmt(full.reduce((s,a)=>s+a.total,0)),color:C.gold},
        {label:"Best Catalog Ratio", value:best?.title.split(" ").slice(0,2).join(" ")||"—",color:C.green,tip:"Lowest adj. FW% = most streaming came after week one"},
        {label:"Top Durability",     value:bestDur?.title.split(" ").slice(0,2).join(" ")||"—",color:C.teal,tip:"Highest composite 0–100 score"},
        {label:"Peak Opening Week",  value:fmt(Math.max(...full.map(a=>a.fw),0)),color:C.gold},
        {label:"Albums Ranked",      value:ranked.length,color:"#666"},
      ].map(({label,value,color,tip})=>(
        <div key={label} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:3,padding:"10px 12px"}}>
          <div style={{fontSize:8,color:"#333",letterSpacing:2,textTransform:"uppercase",marginBottom:2}}>{label}</div>
          {tip&&<div style={{fontSize:7.5,color:"#2a2a2a",marginBottom:4,fontStyle:"italic"}}>{tip}</div>}
          <div style={{fontSize:13,color,fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{value}</div>
        </div>
      ))}
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:16,alignItems:"center",background:"#0d0d0d",border:`1px solid ${C.border}33`,borderRadius:3,padding:"12px 14px"}}>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {[["all","All"],["young-money","Young Money"],["peak","Peak"],["post2020","Post-2020"]].map(([id,lbl])=>(
          <Pill key={id} active={eraFilter===id} color={id==="all"?C.gold:ERAS[id]?.color} onClick={()=>setEraFilter(id)}>{lbl}</Pill>
        ))}
      </div>
      <div style={{display:"flex",gap:14,flexWrap:"wrap",marginLeft:"auto"}}>
        <Toggle on={combineHnHl} set={setCombineHnHl} label="HN + HL" color={C.pink}/>
        <Toggle on={showNonStudio} set={setShowNonStudio} label="Mixtapes / Playlists / Comps" color={C.orange}/>
        <Toggle on={streamOnly} set={setStreamOnly} label="Streaming Era Only" color={C.blue}/>
      </div>
    </div>
    <SLabel>Rankings · {norm}mo window · lower catalog score = more durable</SLabel>
    {combineHnHl&&<InfoBox color={C.pink}><span style={{color:C.pink}}>Double album mode.</span> HN + HL merged: 608K FW · 5.03M total · 30 tracks · MC ~67. Toggle off to split them.</InfoBox>}
    {showNonStudio&&<InfoBox color={C.orange}><span style={{color:C.orange}}>Non-studio included.</span> Commercial mixtapes (IYRTITL, WATTBA, Dark Lane), More Life (playlist), and Care Package (compilation) added to rankings.</InfoBox>}
    {showNonStudio&&<InfoBox color={"#22d3ee"}><span style={{color:"#22d3ee"}}>More Life classified as playlist</span> — Drake's own framing at release ("not an album, it's a playlist"). Excluded from default studio ranking and Insights analysis. Toggle off to remove.</InfoBox>}
    {ranked.map((a,i)=><AlbumCard key={a.id} a={a} rank={i}/>)}
    {showNonStudio&&(<>
      <hr style={{borderColor:C.border,margin:"24px 0 16px"}}/>
      <SLabel>Pre-Streaming Mixtapes — Historical Context Only</SLabel>
      <InfoBox color={"#555"}>Room for Improvement (2006), Comeback Season (2007), and So Far Gone (2009) predate reliable streaming measurement. No catalog score can be calculated. Included here as historical record only.</InfoBox>
      {DRAKE_RAW.filter(a=>a.legacy).map(a=>(
        <div key={a.id} style={{background:"#0d0d0d",border:`1px solid #2a2a2a`,borderLeft:`3px solid #3a3a3a`,borderRadius:3,padding:"11px 14px",marginBottom:7,display:"flex",alignItems:"center",gap:12,opacity:0.65}}>
          <div style={{fontSize:11,minWidth:32,textAlign:"center",color:"#444",flexShrink:0}}>◈</div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
              <span style={{fontSize:13,color:"#6a6a6a",fontStyle:"italic"}}>{a.title}</span>
              <Pill active small color="#3a3a3a">pre-streaming</Pill>
              <Pill active small color={C.orange}>mixtape</Pill>
            </div>
            <div style={{fontSize:9.5,color:"#3a3a3a"}}>{a.release.slice(0,4)} · {a.tracks} tracks · free release · no streaming data</div>
          </div>
          <div style={{fontSize:10,color:"#3a3a3a",fontStyle:"italic",flexShrink:0}}>no data</div>
        </div>
      ))}
    </>)}
    {flagged.length>0&&(<>
      <hr style={{borderColor:C.border,margin:"20px 0 14px"}}/>
      <SLabel>⚠ Extrapolated</SLabel>
      {flagged.map(a=>(
        <div key={a.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:3,padding:"10px 15px",marginBottom:7,display:"flex",alignItems:"center",gap:12,opacity:0.55}}>
          <div style={{flex:1}}><div style={{fontSize:12.5,color:"#7a6a50",fontStyle:"italic"}}>{a.title}</div><div style={{fontSize:9.5,color:"#333",marginTop:2}}>{a.year} · {fmt(a.total)} so far</div></div>
          <div style={{fontSize:15,color:"#444",fontStyle:"italic"}}>{pct(a.adjFWPct)}</div>
        </div>
      ))}
    </>)}
  </>);
}

// ── INSIGHTS ─────────────────────────────────────────────────────
function InsightsTab({drake}){
  const full=useMemo(()=>drake.filter(a=>!a.extrapolated&&a.type==="studio"),[drake]);
  if(!full.length) return <div style={{color:"#333",padding:20}}>No ranked studio albums.</div>;
  const yearPts=full.map(a=>[a.year,a.adjFWPct*100]);const yearReg=ols(yearPts);
  const metaPts=full.filter(a=>a.meta).map(a=>[a.meta,a.adjFWPct*100]);const metaReg=ols(metaPts);
  const beef=full.filter(a=>a.beefContext),noBeef=full.filter(a=>!a.beefContext);
  const surp=full.filter(a=>a.surprise),std=full.filter(a=>!a.surprise);
  const trackPts=full.map(a=>[a.tracks,a.adjFWPct*100]);const trackReg=ols(trackPts);
  const fwTrend=ols(full.map(a=>[a.year,a.fw/1000]));
  const beefAvg=mean(beef.map(a=>a.adjFWPct)),nbAvg=mean(noBeef.map(a=>a.adjFWPct));
  const surpAvg=mean(surp.map(a=>a.adjFWPct)),stdAvg=mean(std.map(a=>a.adjFWPct));

  const v1=`${yearReg.slope>0?"Yes — the trend line slopes upward, meaning newer albums show a higher fraction of their streaming concentrated in week one":"The trend line is essentially flat — catalog ratios have stayed relatively stable across his career"} (R²=${(yearReg.r2*100).toFixed(0)}%). But R² this low means release year explains only a small slice of the variation. The more predictive variable isn't when an album dropped — it's the context around it. Quiet-period albums (Take Care, NWTS, More Life) hold their catalog ratio regardless of era. Beef-adjacent albums (Scorpion, FATD, SSS4U) cluster toward front-loaded regardless of era. The year axis is the wrong lens. The beef axis is the right one.`;

  const v2=`Almost no statistical relationship between critical scores and long-term streaming (R²=${(metaReg.r2*100).toFixed(0)}%). Scorpion, Drake's most critically dismissed major release (MC:67), is one of his most durable albums by catalog ratio — 11M total streams means it kept moving long after critics moved on. Honestly, Nevermind earned his best recent Metacritic score (MC:73) and has his worst catalog ratio. Critics rewarded the genre experiment; repeat listeners didn't show up for it. The scatter plot shows near-zero slope — for Drake specifically, critical approval and streaming durability are measuring completely different things.`;

  const v3=`Beef-adjacent albums average ${pct(beefAvg)} vs ${pct(nbAvg)} for quiet-period releases — a ${((beefAvg-nbAvg)*100).toFixed(1)}-point gap. That gap is consistent across all three major conflicts: the Meek Mill era (WATTBA, IYRTITL — though IYRTITL's surprise drop partially masks it), the Pusha T era (Scorpion), and the Kendrick era (FATD, SSS4U). The mechanism: conflict drives casual listeners in on week one who would never have streamed the album otherwise. When the controversy ends, they leave. The core audience was always there — but the beef inflates the denominator, making the first-week number look huge relative to the catalog that follows.`;

  const v4=`${trackReg.slope>0?"Positive correlation — more tracks correlates with a higher (worse) catalog score":"No strong correlation at current settings"}. The albums that punch above their weight on durability tend to be lean: Nothing Was the Same at 13 tracks, IYRTITL at 17. The bloated ones — Scorpion (25 tracks), CLB (21), More Life (22), FATD (23) — cluster toward higher catalog scores, meaning proportionally more of their streaming happened at release. When no single song is forced to carry the album on repeat, none of them do. The listener samples the album, leaves, and doesn't come back. Tight sequencing forces deeper per-track investment.`;

  const v5=`Surprise albums average ${pct(surpAvg)} vs ${pct(stdAvg)} for standard releases. Lower looks more catalog-driven — but the mechanism is partly artificial. When an album drops with no warning, fans who would normally stream heavily on day one discover it gradually across days and weeks. Week one is mechanically suppressed by the rollout format, not because the music earns deeper replay. IYRTITL (2015), Honestly Nevermind (2022), and SSS4U (2025) all benefit from this effect. The catalog score counts real streams in all windows — but the ratio looks better because the denominator (week one) is smaller by design. Adjust the normalization window upward and some of this effect compresses.`;

  const v6=`${fwTrend.slope>0?`Trend is upward — opening weeks have grown over his career at roughly ${Math.round(Math.abs(fwTrend.slope))}K units per year on average. Views in 2016 (1.04M) reset the ceiling; CLB in 2021 (613K) showed the floor. Even SSS4U — released in Drake's lowest critical moment, seven months after the Kendrick loss, with minimal rollout — debuted at #1 with 246K. His ability to command opening-week numbers has proven remarkably resilient against critical decline, beef outcomes, and creative controversy. That durability of commercial pull, separate from any narrative about his legacy, is itself a data point worth sitting with.`:`Opening week numbers show a slight downward slope, consistent with the broader streaming era compression of blockbuster debuts. Views (1.04M, 2016) remains his career high by a wide margin.`}`;

  return(
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(380px,1fr))",gap:12}}>
      <ICard
        title="Is Drake getting more front-loaded over time?"
        question="Each dot is a studio album placed by release year (x) and catalog score (y). Lower on the chart = more of the album's total streaming came after week one. The dashed line is the OLS trend across his career."
        verdict={v1}
      >
        <Scatter pts={yearPts.map(([x,y],i)=>({x,y,c:ERAS[full[i]?.era]?.color||C.gold}))} reg={yearReg} xLab="Release Year" yLab="Catalog Score % (lower = better)"/>
      </ICard>
      <ICard
        title="Do albums with better reviews last longer?"
        question="Metacritic score on the x-axis, catalog score on the y-axis. A downward slope would mean higher-reviewed albums earn deeper long-term replay. Each dot is color-coded by review tier."
        verdict={v2}
      >
        <Scatter pts={metaPts.map(([x,y])=>({x,y,c:mcClr(x)}))} reg={metaReg} xLab="Metacritic Score" yLab="Catalog Score %"/>
      </ICard>
      <ICard
        title="Do conflict-era albums fade faster?"
        question="Albums split by whether they were released during or directly after a major beef vs. quiet periods. Lower bar = more durable (more streaming came after week one)."
        verdict={v3}
      >
        <Bars items={[{label:`Quiet (${noBeef.length})`,v:nbAvg,c:C.green},{label:`Conflict (${beef.length})`,v:beefAvg,c:C.red}]}/>
      </ICard>
      <ICard
        title="Do longer albums drain their own replay?"
        question="Track count on the x-axis, catalog score on the y-axis. The question: does adding more songs dilute how deeply any single track anchors in listener rotation?"
        verdict={v4}
      >
        <Scatter pts={full.map(a=>({x:a.tracks,y:a.adjFWPct*100,c:a.tracks>19?C.red:C.green}))} reg={trackReg} xLab="Track Count" yLab="Catalog Score %"/>
      </ICard>
      <ICard
        title="Do surprise drops inflate catalog scores artificially?"
        question="Albums with no pre-release rollout vs. standard releases. The comparison tests whether the lower catalog score on surprise albums reflects genuine durability or a suppressed week-one denominator."
        verdict={v5}
      >
        <Bars items={[{label:`Standard (${std.length})`,v:stdAvg,c:C.gold},{label:`Surprise (${surp.length})`,v:surpAvg,c:"#9ca3af"}]}/>
      </ICard>
      <ICard
        title="Has his commercial opening power held up?"
        question="First-week streams/sales across his full discography. Dots are color-coded by era. The trend line tests whether his debut-week commercial pull has grown, held, or declined over time."
        verdict={v6}
      >
        <Scatter pts={full.map(a=>({x:a.year,y:a.fw/1000,c:ERAS[a.era]?.color||C.gold}))} reg={fwTrend} xLab="Release Year" yLab="Opening Week (thousands)"/>
      </ICard>
    </div>
  );
}

// ── QUADRANT ─────────────────────────────────────────────────────
function QuadrantTab({drake,peerComputed,peerKeys}){
  const [showPeers,setShowPeers]=useState(true);
  const allAlbums=useMemo(()=>{
    const d=drake.filter(a=>!a.extrapolated&&a.type==="studio").map(a=>({...a,artistName:"Drake",artistColor:C.gold}));
    const p=[];
    if(showPeers) peerKeys.forEach(k=>(peerComputed[k]||[]).filter(a=>!a.extrapolated).forEach(a=>p.push({...a,artistName:PEERS[k].name,artistColor:PEERS[k].color})));
    return [...d,...p];
  },[drake,peerComputed,peerKeys,showPeers]);
  const W=820,H=510,pad={t:36,r:120,b:46,l:52};
  const w=W-pad.l-pad.r,h=H-pad.t-pad.b;
  const midX=50,midY=55;
  const sx=x=>pad.l+(x/100)*w,sy=y=>pad.t+(1-(y/100))*h;
  const allFW=allAlbums.map(a=>a.fw);
  const minLFW=Math.log(Math.min(...allFW)||1),maxLFW=Math.log(Math.max(...allFW)||2);
  const normFW=fw=>((Math.log(fw)-minLFW)/(maxLFW-minLFW||1))*100;
  const quads=[
    {x:0,y:midY,w:midX,h:100-midY,label:"Slow Burn",sub:"Quiet opening, deep replay",color:"rgba(96,165,250,0.03)"},
    {x:midX,y:midY,w:100-midX,h:100-midY,label:"Cultural Monument",sub:"Big opening + lasting replay",color:"rgba(74,207,136,0.03)"},
    {x:0,y:0,w:midX,h:midY,label:"Under the Radar",sub:"Modest, didn't sustain",color:"rgba(80,80,80,0.025)"},
    {x:midX,y:0,w:100-midX,h:midY,label:"Commercial Event",sub:"Big opening, faded quickly",color:"rgba(248,113,113,0.03)"},
  ];
  return(<>
    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14,flexWrap:"wrap"}}>
      <div style={{fontSize:11,color:"#555",fontStyle:"italic",flex:1}}>Every album mapped by opening week power vs long-term durability. Beef-adjacent = red ring.</div>
      <Toggle on={showPeers} set={setShowPeers} label="Show selected peers" color={C.purple}/>
    </div>
    <div style={{overflowX:"auto"}}>
      <svg width={W} height={H} style={{minWidth:W,background:C.card,borderRadius:4,border:`1px solid ${C.border}`}}>
        {quads.map(q=>(
          <g key={q.label}>
            <rect x={sx(q.x)} y={sy(q.y+q.h)} width={(q.w/100)*w} height={(q.h/100)*h} fill={q.color}/>
            <text x={sx(q.x+q.w*0.5)} y={sy(q.y+q.h-3)} textAnchor="middle" fill="#252525" fontSize={11} fontStyle="italic">{q.label}</text>
            <text x={sx(q.x+q.w*0.5)} y={sy(q.y+q.h-3)+14} textAnchor="middle" fill="#1e1e1e" fontSize={7.5}>{q.sub}</text>
          </g>
        ))}
        <line x1={sx(midX)} x2={sx(midX)} y1={pad.t} y2={pad.t+h} stroke="#1c1c1c" strokeDasharray="4,4"/>
        <line x1={pad.l} x2={pad.l+w} y1={sy(midY)} y2={sy(midY)} stroke="#1c1c1c" strokeDasharray="4,4"/>
        <line x1={pad.l} x2={pad.l+w} y1={pad.t+h} y2={pad.t+h} stroke="#2a2a2a"/>
        <line x1={pad.l} x2={pad.l} y1={pad.t} y2={pad.t+h} stroke="#2a2a2a"/>
        <text x={pad.l+w/2} y={H-8} textAnchor="middle" fill="#555" fontSize={10}>Opening Week Power →</text>
        <text x={14} y={pad.t+h/2} textAnchor="middle" fill="#555" fontSize={10} transform={`rotate(-90,14,${pad.t+h/2})`}>↑ Durability Score</text>
        {allAlbums.map(a=>{
          const x=normFW(a.fw),y=a.durability,cx2=sx(x),cy2=sy(y),isDrake=a.artistName==="Drake";
          return(<g key={a.id}>
            {a.beefContext&&<circle cx={cx2} cy={cy2} r={14} fill="none" stroke={C.red} strokeWidth={1} opacity={0.35}/>}
            <circle cx={cx2} cy={cy2} r={isDrake?9:7} fill={a.artistColor} opacity={0.88} stroke={a.preStream?C.blue:"none"} strokeWidth={1.5}/>
            <text x={cx2} y={cy2-13} textAnchor="middle" fill={isDrake?"#e8d9a0":"#7a7a7a"} fontSize={isDrake?8:7.5}>{a.title.split(" ").slice(0,2).join(" ")}</text>
          </g>);
        })}
      </svg>
    </div>
  </>);
}

// ── BEEF LENS ────────────────────────────────────────────────────
function BeefLensTab({drake}){
  const beefData=useMemo(()=>BEEF_SONGS.map(b=>{const catalog=b.total-b.fw;return{...b,catalog,adjFWPct:b.fw/(b.fw+catalog)};}), []);
  const full=drake.filter(a=>!a.extrapolated&&a.type==="studio");
  const beefA=full.filter(a=>a.beefContext),noBeef=full.filter(a=>!a.beefContext);
  const won=beefData.filter(b=>b.won===true),lost=beefData.filter(b=>b.won===false),base=beefData.filter(b=>b.won===null);
  return(<>
    <InfoBox color={C.red}>Beef song figures use estimated stream counts, not audited data. The catalog score formula still applies.</InfoBox>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:12,marginBottom:22}}>
      <ICard title="Winning a beef doesn't build a legacy" question="Non-beef hits vs winning diss tracks vs losing diss tracks." verdict={`God's Plan and Hotline Bling average ${pct(mean(base.map(b=>b.adjFWPct)))} — almost all streaming came after week one. Winning beef tracks: ${pct(mean(won.map(b=>b.adjFWPct)))}. Losing: ${pct(mean(lost.map(b=>b.adjFWPct)))}. Not Like Us crossed from diss track into anthem. Drake's conflict records don't make that leap.`}>
        <Bars items={[{label:"Evergreen",v:mean(base.map(b=>b.adjFWPct)),c:C.gold},{label:"Won",v:mean(won.map(b=>b.adjFWPct)),c:C.green},{label:"Lost",v:mean(lost.map(b=>b.adjFWPct)),c:C.red}]}/>
      </ICard>
      <ICard title="Albums near beefs are more disposable" question="Albums released during/after conflicts vs quiet periods." verdict={`Beef-adjacent: ${pct(mean(beefA.map(a=>a.adjFWPct)))} vs quiet: ${pct(mean(noBeef.map(a=>a.adjFWPct)))}. Consistent across Meek Mill, Pusha T, and Kendrick. The controversy brings people in — and they leave when the drama ends.`}>
        <Bars items={[{label:`Quiet (${noBeef.length})`,v:mean(noBeef.map(a=>a.adjFWPct)),c:C.green},{label:`Conflict (${beefA.length})`,v:mean(beefA.map(a=>a.adjFWPct)),c:C.red}]}/>
      </ICard>
    </div>
    <SLabel>All Beef Songs — Catalog Score Rankings</SLabel>
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5}}>
        <thead><tr>{["Song","Artist","Context","Total Streams","Cat. Score","Result"].map((h,i)=>(<th key={h} style={{fontSize:8,letterSpacing:2,textTransform:"uppercase",color:C.goldDim,textAlign:i>1?"right":"left",padding:"7px 10px",borderBottom:`1px solid ${C.border}`}}>{h}</th>))}</tr></thead>
        <tbody>{[...beefData].sort((a,b)=>a.adjFWPct-b.adjFWPct).map(b=>(
          <tr key={b.id} style={{borderBottom:"1px solid #141414"}}>
            <td style={{padding:"8px 10px",fontStyle:"italic",color:"#d4c080"}}>{b.title}</td>
            <td style={{padding:"8px 10px",color:"#666"}}>{b.artist}</td>
            <td style={{padding:"8px 10px",color:"#555",fontSize:10,textAlign:"right"}}>{b.context}</td>
            <td style={{padding:"8px 10px",textAlign:"right",color:"#8a7a60"}}>{fmt(b.total)}</td>
            <td style={{padding:"8px 10px",textAlign:"right",color:b.adjFWPct<0.05?C.green:b.adjFWPct<0.15?"#facc15":C.red}}>{pct(b.adjFWPct)}</td>
            <td style={{padding:"8px 10px",textAlign:"right",fontSize:10}}>{b.won===true&&<span style={{color:C.green}}>✓ Won</span>}{b.won===false&&<span style={{color:C.red}}>✗ Lost</span>}{b.won===null&&<span style={{color:"#555"}}>baseline</span>}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  </>);
}

// ── CAREER ARC ───────────────────────────────────────────────────
function CareerArcTab({drake}){
  const full=drake.filter(a=>!a.extrapolated).sort((a,b)=>a.year-b.year);
  if(!full.length) return <div style={{color:"#333",fontSize:12}}>No ranked albums.</div>;
  const W=840,H=340,pad={t:24,r:24,b:46,l:52};
  const w=W-pad.l-pad.r,h=H-pad.t-pad.b;
  const xMn=2009.5,xMx=2026.5,yMx=26;
  const sx=x=>pad.l+((x-xMn)/(xMx-xMn))*w,sy=y=>pad.t+(1-(y/yMx))*h;
  const reg=ols(full.map(a=>[a.year,a.adjFWPct*100]));
  const cAvg=mean(full.map(a=>a.adjFWPct));
  return(<>
    <SLabel>Career Arc — Every Album in Context</SLabel>
    <div style={{overflowX:"auto",marginBottom:12}}>
      <svg width={W} height={H} style={{minWidth:W}}>
        {[["young-money",2009.5,2014.5],["peak",2014.5,2019.5],["post2020",2019.5,2026.5]].map(([era,x1,x2])=>(
          <g key={era}>
            <rect x={sx(x1)} y={pad.t} width={sx(x2)-sx(x1)} height={h} fill={ERAS[era]?.color} opacity={0.03}/>
            <text x={sx((x1+x2)/2)} y={pad.t+h-6} textAnchor="middle" fill={ERAS[era]?.color} fontSize={7.5} opacity={0.2}>{ERAS[era]?.label}</text>
          </g>
        ))}
        <line x1={pad.l} x2={pad.l+w} y1={sy(cAvg*100)} y2={sy(cAvg*100)} stroke="#1a1a1a" strokeDasharray="3,3"/>
        {[5,10,15,20,25].map(v=>(<g key={v}><line x1={pad.l} x2={pad.l+w} y1={sy(v)} y2={sy(v)} stroke="#131313"/><text x={pad.l-5} y={sy(v)+4} textAnchor="end" fill="#222" fontSize={9}>{v}%</text></g>))}
        {[2010,2013,2016,2019,2022,2025].map(y=>(<text key={y} x={sx(y)} y={pad.t+h+17} textAnchor="middle" fill="#222" fontSize={9}>{y}</text>))}
        <line x1={sx(xMn)} y1={sy(reg.slope*xMn+reg.intercept)} x2={sx(xMx)} y2={sy(reg.slope*xMx+reg.intercept)} stroke={C.gold} strokeWidth={1.5} strokeDasharray="6,4" opacity={0.3}/>
        {full.filter(a=>a.beefContext).map(a=>(<line key={a.id} x1={sx(a.year)} x2={sx(a.year)} y1={pad.t} y2={pad.t+h} stroke={C.red} strokeWidth={0.7} opacity={0.15}/>))}
        <polyline fill="none" stroke={C.gold} strokeWidth={1} opacity={0.1} points={full.filter(a=>a.type==="studio"&&!a.collab).map(a=>`${sx(a.year)},${sy(a.adjFWPct*100)}`).join(" ")}/>
        {full.map(a=>(<g key={a.id}>
          <circle cx={sx(a.year)} cy={sy(a.adjFWPct*100)} r={a.type==="studio"?(a.beefContext?8:6):5} fill={a.type!=="studio"?C.orange:a.beefContext?C.red:a.collab?C.purple:C.gold} stroke={a.preStream?C.blue:"none"} strokeWidth={2} opacity={0.9}/>
          <text x={sx(a.year)} y={sy(a.adjFWPct*100)+21} textAnchor="middle" fill="#2a2a2a" fontSize={7.5}>{a.title.split(" ").slice(0,2).join(" ")}</text>
        </g>))}
        <line x1={pad.l} x2={pad.l+w} y1={pad.t+h} y2={pad.t+h} stroke="#1e1e1e"/>
        <line x1={pad.l} x2={pad.l} y1={pad.t} y2={pad.t+h} stroke="#1e1e1e"/>
      </svg>
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:20,padding:"13px 16px",background:C.card,border:`1px solid ${C.border}`,borderRadius:3}}>
      {[{l:"Overall trend",v:`${reg.slope>0?"+":""}${reg.slope.toFixed(2)}%/yr`,c:reg.slope>0?C.red:C.green},{l:"Career avg",v:pct(cAvg),c:C.gold},{l:"Conflict albums",v:pct(mean(full.filter(a=>a.beefContext).map(a=>a.adjFWPct))),c:C.red},{l:"Quiet albums",v:pct(mean(full.filter(a=>!a.beefContext).map(a=>a.adjFWPct))),c:C.green}].map(({l,v,c})=>(
        <div key={l}><div style={{fontSize:8,color:"#2a2a2a",letterSpacing:2,textTransform:"uppercase",marginBottom:3}}>{l}</div><div style={{fontSize:14,color:c,fontStyle:"italic"}}>{v}</div></div>
      ))}
    </div>
  </>);
}

// ── ICEMAN ────────────────────────────────────────────────────────
function IcemanTab({drake,norm,alpha}){
  const ICEMAN_NORM=30, ICEMAN_ALPHA=0.5, ELAPSED_12=12;
  const ELAPSED_MAP={tml:183,tc:167,nwts:144,iyrtitl:126,wattba:120,views:112,ml:102,sc:87,clb:48,hn:39,hl:34,fatd:23,sss4u:7};
  const PRESET_TOTALS={low:1500000, base:3500000, comeback:8500000};

  const PRESETS={
    low:     {label:"Low End",        color:"#9ca3af",fw:200000,meta:58,tracks:22,beef:true, collab:false,projTotal:PRESET_TOTALS.low,
               desc:"Post-beef hangover, bloated tracklist, critics indifferent. Event-driven opening with no staying power."},
    expected:{label:"Expected",       color:C.gold,   fw:380000,meta:68,tracks:18,beef:false,collab:false,projTotal:PRESET_TOTALS.base,
               desc:"Matches post-2020 average. Solid commercial opening, moderate reception, mid-table legacy."},
    comeback:{label:"Legacy Comeback",color:C.green,  fw:310000,meta:85,tracks:13,beef:false,collab:false,projTotal:PRESET_TOTALS.comeback,
               desc:"Lean, critically acclaimed, lower debut but deep long-term replay. The Take Care pattern."},
  };

  const [fw,setFw]=useState(380000);
  const [meta,setMeta]=useState(68);
  const [tracks,setTracks]=useState(18);
  const [beef,setBeef]=useState(false);
  const [collab,setCollab]=useState(false);
  const [projTotal,setProjTotal]=useState(PRESET_TOTALS.base);
  const [activePreset,setActivePreset]=useState("expected");
  const [sortBy,setSortBy]=useState("legacy");
  const [sortDir,setSortDir]=useState(1);
  const [showGuide,setShowGuide]=useState(false);

  function applyPreset(key){
    const p=PRESETS[key];
    setFw(p.fw);setMeta(p.meta);setTracks(p.tracks);
    setBeef(p.beef);setCollab(p.collab);
    setProjTotal(p.projTotal);setActivePreset(key);
  }
  function handleSlider(setter,val){setter(val);setActivePreset(null);}
  function handleSort(key){if(sortBy===key){setSortDir(d=>-d);}else{setSortBy(key);setSortDir(1);}}

  const trackMult=useMemo(()=>Math.max(0.85,Math.min(1.18,1-((tracks-16)*0.006))),[tracks]);
  const beefMult=beef?0.65:1.0;
  const collabMult=collab?1.10:1.0;
  const combinedMult=trackMult*beefMult*collabMult;
  const adjustedTotal=Math.round(projTotal*combinedMult);

  function computeIceman(fw2,total,meta2){
    const cat=total-fw2; if(cat<=0) return null;
    const pc=cat*Math.pow(ICEMAN_NORM/ELAPSED_12,ICEMAN_ALPHA);
    const adj=fw2/(fw2+Math.max(pc,1));
    const catRatio=Math.min(100,(cat/Math.max(fw2,1))*5);
    const dur=Math.round((1-adj)*100*0.6+(meta2/100)*100*0.25+catRatio*0.15);
    return{adj,legacyDepth:(1-adj)*100,dur,cat,total};
  }

  function computeReal(fw2,total,meta2,elapsed){
    const cat=total-fw2; if(cat<=0) return null;
    const pc=cat*Math.pow(norm/elapsed,alpha);
    const adj=fw2/(fw2+Math.max(pc,1));
    const catRatio=Math.min(100,(cat/Math.max(fw2,1))*5);
    const dur=Math.round((1-adj)*100*0.6+(meta2/100)*100*0.25+catRatio*0.15);
    return{adj,legacyDepth:(1-adj)*100,dur};
  }

  function estYear1(fw2,total,elapsed){
    const cat=total-fw2; if(cat<=0) return fw2;
    return Math.round(fw2+cat*Math.pow(Math.min(12,elapsed)/elapsed,ICEMAN_ALPHA));
  }
  function icemanYear1(fw2,tot){
    const cat=tot-fw2; if(cat<=0) return fw2;
    return Math.round(fw2+cat*Math.pow(12/ICEMAN_NORM,ICEMAN_ALPHA));
  }

  const presetResults=useMemo(()=>{
    function pc(p){
      const tm=Math.max(0.85,Math.min(1.18,1-((p.tracks-16)*0.006)));
      const bm=p.beef?0.65:1.0,cm=p.collab?1.10:1.0;
      const t=Math.round(p.projTotal*tm*bm*cm);
      const r=computeIceman(p.fw,t,p.meta);
      if(!r) return null;
      return{...r,year1:icemanYear1(p.fw,t),projTotal:t};
    }
    return{low:pc(PRESETS.low),base:pc(PRESETS.expected),comeback:pc(PRESETS.comeback)};
  },[]);

  const live=useMemo(()=>{
    const r=computeIceman(fw,adjustedTotal,meta);
    if(!r) return null;
    return{...r,year1:icemanYear1(fw,adjustedTotal)};
  },[fw,meta,tracks,beef,collab,adjustedTotal]);

  const ghost=useMemo(()=>{
    if(!live) return null;
    return{
      id:"iceman_ghost",title:"Iceman",release:"2025-10-01",
      fw,total:adjustedTotal,collab:collab?"TBD":null,meta,tracks,
      year:2025,preStream:false,surprise:false,era:"post2020",
      beefContext:beef?"post-kendrick":null,type:"studio",
      adjFWPct:live.adj,catalog:live.cat,durability:live.dur,
      elapsed:ELAPSED_12,extrapolated:false,isGhost:true,
      legacyDepth:live.legacyDepth,year1:live.year1,
    };
  },[fw,meta,tracks,beef,collab,live,adjustedTotal]);

  const allAt12=useMemo(()=>{
    const base=drake.filter(a=>
      (a.type==="studio"||a.id==="ml"||a.id==="iyrtitl")
      &&!a.combined&&!a.legacy&&a.total>0
      &&a.id!=="hn"&&a.id!=="hl" // exclude individual — replaced by combined below
    );

      const hn=drake.find(a=>a.id==="hn");
    const hl=drake.find(a=>a.id==="hl");
    const hnhlCombined = hn&&hl ? {
      id:"hnhl_combined",title:"HN + Her Loss",release:"2022-06-17",
      fw:hn.fw+hl.fw, total:hn.total+hl.total,
      meta:67, tracks:(hn.tracks||0)+(hl.tracks||0),
      era:"post2020", type:"studio", combined:false, legacy:false,
      beefContext:null, collab:"21 Savage",
    } : null;

    const pool=[...base,...(hnhlCombined?[hnhlCombined]:[])];

    return pool.map(a=>{
      const elapsed=ELAPSED_MAP[a.id]||50;
      // Use fixed elapsed=12 for fair comparison — everyone on same snapshot window
      // so Iceman's preset positions (bottom/middle/top) are meaningful relative to real albums.
      // Est. Year-1 still uses actual elapsed for honest year-1 stream estimates.
      const r=computeIceman(a.fw,a.total,a.meta||60);
      if(!r) return null;
      const y1=estYear1(a.fw,a.total,elapsed);
      return{...a,...r,isGhost:false,year1:y1,elapsed};
    }).filter(Boolean);
  },[drake,norm,alpha]);

  const pool=useMemo(()=>{
    const all=[...allAt12,...(ghost?[ghost]:[])];
    return all.sort((a,b)=>{
      if(sortBy==="legacy")    {return sortDir*(b.legacyDepth-a.legacyDepth);}
      if(sortBy==="durability"){const av=a.durability??a.dur,bv=b.durability??b.dur;return sortDir*(bv-av);}
      if(sortBy==="year1")     {return sortDir*(b.year1-a.year1);}
      if(sortBy==="fw")        {return sortDir*(b.fw-a.fw);}
      if(sortBy==="title")     {return sortDir*a.title.localeCompare(b.title);}
      return 0;
    });
  },[allAt12,ghost,sortBy,sortDir]);

  const maxYear1=Math.max(...allAt12.map(a=>a.year1),live?.year1||0,1);
  const post2020Avg=mean(drake.filter(a=>a.era==="post2020"&&!a.extrapolated).map(a=>a.fw));

  function ldColor(ld){
    if(ld>=96) return C.teal;
    if(ld>=90) return C.green;
    if(ld>=85) return "#facc15";
    return C.red;
  }

  function ColH({k,label,sub,right}){
    const active=sortBy===k;
    return(
      <th onClick={()=>handleSort(k)} style={{padding:"7px 10px",textAlign:right?"right":"left",cursor:"pointer",userSelect:"none",borderBottom:`1px solid ${C.border}`,whiteSpace:"nowrap",verticalAlign:"bottom"}}>
        <div style={{fontSize:8,letterSpacing:2,textTransform:"uppercase",color:active?C.gold:C.goldDim}}>{label}{active?(sortDir===1?" ↑":" ↓"):""}</div>
        {sub&&<div style={{fontSize:7,color:"#2a2a2a",marginTop:1}}>{sub}</div>}
      </th>
    );
  }

  return(<>
    <div style={{marginBottom:16,background:"#0d0d0d",border:`1px solid ${C.border}33`,borderRadius:3,overflow:"hidden"}}>
      <div onClick={()=>setShowGuide(v=>!v)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",cursor:"pointer"}}>
        <div style={{fontSize:9,letterSpacing:3,color:C.goldDim,textTransform:"uppercase"}}>How This Works</div>
        <div style={{fontSize:11,color:"#555"}}>{showGuide?"▲ hide":"▼ show"}</div>
      </div>
      {showGuide&&(
        <div style={{padding:"0 14px 16px",borderTop:`1px solid ${C.border}33`}}>
          <div style={{fontSize:10.5,color:"#6a5a40",lineHeight:1.8,marginTop:12,marginBottom:12}}>
            Set your prediction for Drake's next album using the controls below. The three scenario buttons are starting points — click one to load its settings, then fine-tune with the sliders. The table updates live and can be sorted by any column. The global model controls above are inactive on this tab — Iceman uses a fixed internal model so the prediction is stable.
          </div>
          <div style={{overflowX:"auto",marginBottom:12}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:10.5,minWidth:480}}>
              <thead><tr>{["Control","Changes Proj. Total","Changes Legacy Depth","Changes Durability"].map(h=>(
                <th key={h} style={{padding:"5px 10px",textAlign:"left",fontSize:8,letterSpacing:1.5,textTransform:"uppercase",color:C.goldDim,borderBottom:`1px solid ${C.border}`,whiteSpace:"nowrap"}}>{h}</th>
              ))}</tr></thead>
              <tbody>
                {[
                  ["Opening Week",  "No",         "Yes — bigger = lower","Slight"],
                  ["Proj. Total",   "Direct",     "Yes",                 "Yes"],
                  ["Metacritic",    "No",         "No",                  "Yes — 25% weight"],
                  ["Track Count",   "Yes ±0.6%",  "Yes",                 "Yes"],
                  ["Beef Shadow",   "Yes −35%",   "Yes",                 "Yes"],
                  ["Collab",        "Yes +10%",   "Yes",                 "Yes"],
                ].map(([ctrl,...cells])=>(
                  <tr key={ctrl} style={{borderBottom:"1px solid #141414"}}>
                    <td style={{padding:"6px 10px",color:"#d4c080",fontStyle:"italic"}}>{ctrl}</td>
                    {cells.map((c,i)=><td key={i} style={{padding:"6px 10px",color:"#5a4a30",fontSize:10}}>{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{fontSize:10,color:"#555",lineHeight:1.7,fontStyle:"italic"}}>
            Real albums use their actual elapsed time — the same calculation as the main Rankings tab. HN and Her Loss are combined as one 2022 project. More Life and IYRTITL are included as commercially released projects with full streaming data.
          </div>
        </div>
      )}
    </div>

    <div style={{marginBottom:18}}>
      <div style={{fontSize:8,color:"#3a3a3a",letterSpacing:3,textTransform:"uppercase",marginBottom:10}}>Scenarios — click to load all settings including projected total</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
        {Object.entries(PRESETS).map(([key,p])=>{
          const rk=key==="low"?"low":key==="expected"?"base":"comeback";
          const r=presetResults[rk];
          const isActive=activePreset===key;
          return(
            <button key={key} onClick={()=>applyPreset(key)} style={{background:isActive?`${p.color}15`:"#0d0d0d",border:`2px solid ${isActive?p.color:"#2a2a2a"}`,borderRadius:4,padding:"14px 16px",cursor:"pointer",textAlign:"left",transition:"all 0.2s",outline:"none",fontFamily:"Georgia,serif"}}>
              <div style={{fontSize:12,color:p.color,fontStyle:"italic",marginBottom:5}}>{p.label}</div>
              <div style={{fontSize:9.5,color:"#666",lineHeight:1.65,marginBottom:10}}>{p.desc}</div>
              {r?(
                <>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:6}}>
                    <div>
                      <div style={{fontSize:7,color:"#3a3a3a",letterSpacing:1.5,textTransform:"uppercase",marginBottom:2}}>Est. Year-1</div>
                      <div style={{fontSize:13,color:C.green,fontStyle:"italic"}}>{fmt(r.year1)}</div>
                      <div style={{height:3,background:"#1a1a1a",borderRadius:2,marginTop:4}}><div style={{height:"100%",width:`${Math.min(100,(r.year1/maxYear1)*100)}%`,background:C.green,borderRadius:2}}/></div>
                    </div>
                    <div>
                      <div style={{fontSize:7,color:"#3a3a3a",letterSpacing:1.5,textTransform:"uppercase",marginBottom:2}}>Legacy Depth</div>
                      <div style={{fontSize:13,color:ldColor(r.legacyDepth),fontStyle:"italic"}}>{Math.round(r.legacyDepth)}<span style={{fontSize:8,color:"#555"}}>/100</span></div>
                      <div style={{height:3,background:"#1a1a1a",borderRadius:2,marginTop:4}}><div style={{height:"100%",width:`${Math.round(r.legacyDepth)}%`,background:ldColor(r.legacyDepth),borderRadius:2}}/></div>
                    </div>
                  </div>
                  <div style={{fontSize:9,color:"#555"}}>FW: {fmt(p.fw)} · Total: {fmt(p.projTotal)} · Dur: <span style={{color:p.color}}>{r.dur}</span></div>
                </>
              ):(
                <div style={{fontSize:9,color:C.red,fontStyle:"italic"}}>FW exceeds projected total</div>
              )}
            </button>
          );
        })}
      </div>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20,alignItems:"start"}}>
      <div>
        <SLabel>Fine-Tune Your Prediction</SLabel>
        {[
          {label:"Opening week",sub:fmt(fw),          min:100000,  max:750000,  step:10000,  val:fw,        set:v=>handleSlider(setFw,v),       c:C.gold,      note:"bigger = lower legacy depth"},
          {label:"Proj. total", sub:fmt(projTotal),   min:500000,  max:12000000,step:100000, val:projTotal, set:v=>handleSlider(setProjTotal,v), c:C.green,     note:"what you think album will reach"},
          {label:"Metacritic",  sub:`${meta}/100`,    min:50,      max:95,      step:1,      val:meta,      set:v=>handleSlider(setMeta,v),      c:mcClr(meta), note:"durability score only"},
          {label:"Track count", sub:`${tracks}`,      min:8,       max:30,      step:1,      val:tracks,    set:v=>handleSlider(setTracks,v),
           c:tracks>20?C.red:tracks<14?C.green:"#888",
           note:tracks>20?`-${((1-trackMult)*100).toFixed(0)}% total`:tracks<14?`+${((trackMult-1)*100).toFixed(0)}% total`:"neutral"},
        ].map(({label,sub,min,max,step,val,set,c,note})=>(
          <div key={label} style={{marginBottom:13}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:5}}>
              <div style={{fontSize:9,color:C.goldDim,letterSpacing:2,textTransform:"uppercase"}}>{label}: <span style={{color:c}}>{sub}</span></div>
              <div style={{fontSize:8,color:"#3a3a3a",fontStyle:"italic"}}>{note}</div>
            </div>
            <input type="range" min={min} max={max} step={step} value={val} onChange={e=>set(+e.target.value)} style={{accentColor:c,width:"100%",cursor:"pointer"}}/>
          </div>
        ))}
        <div style={{display:"flex",gap:14,marginTop:2}}>
          <Toggle on={beef} set={v=>{setBeef(v);setActivePreset(null);}} label="Beef shadow (-35%)" color={C.red}/>
          <Toggle on={collab} set={v=>{setCollab(v);setActivePreset(null);}} label="Collab (+10%)" color={C.purple}/>
        </div>
        {combinedMult!==1&&(
          <div style={{marginTop:8,fontSize:9,color:"#555",fontStyle:"italic"}}>
            Modifier net: <span style={{color:combinedMult<1?C.red:C.green}}>×{combinedMult.toFixed(2)}</span> · adjusted total: <span style={{color:C.green}}>{fmt(adjustedTotal)}</span>
          </div>
        )}
        <div style={{marginTop:6,fontSize:9,fontStyle:"italic",color:activePreset?PRESETS[activePreset].color:"#555"}}>
          {activePreset?`${PRESETS[activePreset].label} preset loaded · adjust any control to customize`:"Custom prediction — click a scenario to reset to a starting point"}
        </div>
      </div>

      <div>
        <SLabel>Live Output</SLabel>
        {live?(
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:3,padding:"16px 18px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              <div>
                <div style={{fontSize:7.5,color:"#3a3a3a",letterSpacing:2,textTransform:"uppercase",marginBottom:3}}>Est. Year-1 Streams</div>
                <div style={{fontSize:22,color:C.green,fontStyle:"italic",lineHeight:1}}>{fmt(live.year1)}</div>
                <div style={{fontSize:8.5,color:"#555",marginTop:2}}>standardized 12-month window</div>
                <div style={{height:4,background:"#1a1a1a",borderRadius:2,marginTop:6}}><div style={{height:"100%",width:`${Math.min(100,(live.year1/maxYear1)*100)}%`,background:C.green,borderRadius:2,transition:"width 0.3s"}}/></div>
              </div>
              <div>
                <div style={{fontSize:7.5,color:"#3a3a3a",letterSpacing:2,textTransform:"uppercase",marginBottom:3}}>Legacy Depth</div>
                <div style={{fontSize:22,color:ldColor(live.legacyDepth),fontStyle:"italic",lineHeight:1}}>{Math.round(live.legacyDepth)}<span style={{fontSize:11,color:"#555"}}>/100</span></div>
                <div style={{fontSize:8.5,color:"#555",marginTop:2}}>% of streaming after week one</div>
                <div style={{height:4,background:"#1a1a1a",borderRadius:2,marginTop:6}}><div style={{height:"100%",width:`${Math.round(live.legacyDepth)}%`,background:ldColor(live.legacyDepth),borderRadius:2,transition:"width 0.3s"}}/></div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,borderTop:"1px solid #1a1a1a",paddingTop:12,marginBottom:10}}>
              <div><div style={{fontSize:7,color:"#3a3a3a",letterSpacing:1.5,textTransform:"uppercase"}}>Durability</div><div style={{fontSize:14,color:durClr(live.dur),fontStyle:"italic"}}>{live.dur}</div></div>
              <div><div style={{fontSize:7,color:"#3a3a3a",letterSpacing:1.5,textTransform:"uppercase"}}>Opening Wk</div><div style={{fontSize:14,color:C.gold,fontStyle:"italic"}}>{fmt(fw)}</div></div>
              <div><div style={{fontSize:7,color:"#3a3a3a",letterSpacing:1.5,textTransform:"uppercase"}}>Proj. Total</div><div style={{fontSize:14,color:C.green,fontStyle:"italic"}}>{fmt(adjustedTotal)}</div></div>
            </div>
            <div style={{fontSize:10,color:"#5a4a30",lineHeight:1.8,fontStyle:"italic",borderTop:"1px solid #1a1a1a",paddingTop:10}}>
              {Math.round(live.legacyDepth)>=96?"Deep catalog territory. Take Care-level long-term build.":
               Math.round(live.legacyDepth)>=90?"Solid durability. Most listening comes well after week one.":
               Math.round(live.legacyDepth)>=85?"Mixed. Opening week carries meaningful weight.":
               "Front-loaded. When the moment fades, so does the streaming."}
            </div>
          </div>
        ):(
          <div style={{background:C.card,border:`1px solid ${C.red}33`,borderRadius:3,padding:"16px",color:C.red,fontSize:11,fontStyle:"italic"}}>
            Opening week ({fmt(fw)}) exceeds adjusted total ({fmt(adjustedTotal)}). Reduce opening week or increase projected total.
          </div>
        )}
      </div>
    </div>

    <div style={{marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
      <div style={{fontSize:9,letterSpacing:4,color:C.goldDim,textTransform:"uppercase"}}>All Studio Albums · Click Any Column to Sort</div>
      <div style={{fontSize:9,color:"#3a3a3a",fontStyle:"italic"}}>Real albums at actual elapsed · Iceman at 12-month projection</div>
    </div>
    {!live&&<InfoBox color={C.red}>Opening week exceeds projected total. Adjust settings above.</InfoBox>}
    <div style={{overflowX:"auto",marginBottom:10}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
        <thead>
          <tr style={{background:"#0d0d0d"}}>
            <ColH k="title"      label="Album"/>
            <ColH k="fw"         label="Opening Wk"   right/>
            <ColH k="year1"      label="Est. Year-1"  sub="12mo, same window" right/>
            <ColH k="legacy"     label="Legacy Depth" sub="higher = more durable" right/>
            <ColH k="durability" label="Durability"   right/>
          </tr>
        </thead>
        <tbody>
          {pool.map(a=>{
            const isGhost=a.isGhost;
            const ld=a.legacyDepth;
            const dur=a.durability??a.dur;
            return(
              <tr key={a.id} style={{borderBottom:`1px solid ${isGhost?"rgba(45,212,191,0.2)":"#141414"}`,background:isGhost?"rgba(45,212,191,0.04)":"transparent"}}>
                <td style={{padding:"9px 10px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
                    <span style={{fontSize:12,fontStyle:"italic",color:isGhost?"#7af0e0":"#d4c080"}}>{a.title}</span>
                    {isGhost&&<span style={{fontSize:8,color:C.teal}}>◇ projected</span>}
                    {!isGhost&&a.era&&ERAS[a.era]&&<span style={{fontSize:8,color:ERAS[a.era].color,opacity:0.8}}>{ERAS[a.era].short}</span>}
                    {a.id==="ml"&&<span style={{fontSize:8,color:"#22d3ee"}}>playlist</span>}
                    {a.id==="iyrtitl"&&<span style={{fontSize:8,color:C.orange}}>mixtape</span>}
                    {a.id==="hnhl_combined"&&<span style={{fontSize:8,color:"#9ca3af"}}>combined</span>}
                    {a.beefContext&&<span style={{fontSize:8,color:C.red}}>beef</span>}
                  </div>
                </td>
                <td style={{padding:"9px 10px",textAlign:"right",color:"#b0a080"}}>{fmt(a.fw)}</td>
                <td style={{padding:"9px 10px",textAlign:"right",color:C.green}}>{fmt(a.year1)}</td>
                <td style={{padding:"9px 10px",textAlign:"right"}}>
                  <span style={{color:ldColor(ld)}}>{Math.round(ld)}</span>
                  <span style={{fontSize:8,color:"#3a3a3a"}}>/100</span>
                </td>
                <td style={{padding:"9px 10px",textAlign:"right"}}><span style={{color:durClr(dur)}}>{dur}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    <div style={{display:"flex",gap:12,flexWrap:"wrap",padding:"10px 12px",background:"#0d0d0d",borderRadius:3,border:`1px solid ${C.border}33`}}>
      {[
        {c:C.teal,   l:"Legacy Depth — % of total streaming that came after week one. Higher = more catalog-driven, more durable."},
        {c:C.green,  l:"Est. Year-1 — standardized 12-month streaming estimate. Real albums use actual elapsed data; Iceman uses the projected total scaled to 12 months."},
        {c:"#fbbf24",l:"Durability — composite score (0–100): 60% catalog depth + 25% Metacritic + 15% catalog-to-opening multiple."},
      ].map(({c,l})=>(<div key={l} style={{display:"flex",alignItems:"flex-start",gap:5,fontSize:9,color:"#444",maxWidth:400}}><div style={{width:6,height:6,borderRadius:"50%",background:c,flexShrink:0,marginTop:2}}/>{l}</div>))}
    </div>
  </>);
}

// ── PEERS ─────────────────────────────────────────────────────────
function PeersTab({drake,peerComputed,peerKeys,setPeerKeys,radarArtists}){
  const [activeGroup,setActiveGroup]=useState("big3");
  function selectGroup(gid){setActiveGroup(gid);setPeerKeys(PEER_GROUPS[gid].keys);}
  const allRanked=useMemo(()=>{
    const out=[...drake.filter(a=>!a.extrapolated).map(a=>({...a,artistColor:C.gold,artistName:"Drake",conf:"confirmed"}))];
    peerKeys.forEach(k=>(peerComputed[k]||[]).filter(a=>!a.extrapolated).forEach(a=>out.push({...a,artistColor:PEERS[k].color,artistName:PEERS[k].name})));
    return out.sort((a,b)=>a.adjFWPct-b.adjFWPct);
  },[drake,peerComputed,peerKeys]);
  const artistSummaries=useMemo(()=>{
    const drakeA=drake.filter(a=>!a.extrapolated&&a.type==="studio");
    const base=[{key:"drake",name:"Drake",color:C.gold,albums:drakeA}];
    peerKeys.forEach(k=>{const a=(peerComputed[k]||[]).filter(x=>!x.extrapolated);if(a.length)base.push({key:k,name:PEERS[k].short,color:PEERS[k].color,albums:a});});
    return base.map(({key,name,color,albums})=>({key,name,color,avgCat:mean(albums.map(a=>a.adjFWPct)),avgDur:Math.round(mean(albums.map(a=>a.durability))),avgMC:Math.round(mean(albums.filter(a=>a.meta).map(a=>a.meta)))||null,peakFW:Math.max(...albums.map(a=>a.fw),0),count:albums.length}));
  },[drake,peerComputed,peerKeys]);
  const radarVisible=radarArtists.slice(0,5);
  const narratives={
    big3:{color:C.gold,title:"The Big 3 in Brief",text:"Drake leads in raw commercial output. Kendrick has the deepest catalog ratios and most critical acclaim. Cole's Forest Hills Drive went platinum with zero singles — the purest data point for organic catalog durability in the dataset. Three different theories of success. Kendrick wins the legacy argument, Drake wins the commercial one, Cole wins the integrity one."},
    godfather:{color:C.teal,title:"The Godfather",text:"Kanye's Metacritic arc peaked early and has cratered, but MBDTF remains the critical benchmark everything else gets measured against. His late-era commercial numbers are modest but catalog depth remains strong — the fingerprint of an artist whose audience stayed even when the culture moved on."},
    legends:{color:"#818cf8",title:"Legends Context",text:"Jay-Z, Wayne, and Eminem's FW numbers reflect physical-era unit sales — MMLP2's 792K is apples-to-oranges vs Drake's streaming peaks. What matters is their catalog score in the streaming era. Jay-Z's 4:44 is the cleanest data point — a pure streaming-era album showing what his current audience looks like."},
    modern:{color:"#f59e0b",title:"Modern Era Note",text:"Future is the most relevant peer for Drake's catalog precisely because of WATTBA — a collab tape that shows what their combined audience looks like, then lets you compare it to what each did alone. Future's solo catalog is defined by volume and consistency rather than blockbuster peaks: no album above 176K first week, but a steady floor across seven projects. Astroworld remains the modern template for a Commercial Monument. After Hours vs Scorpion is the sharpest durability contrast in the tier. Juice WRLD and Pop Smoke's posthumous releases confound the model — grief inflates both opening week and long-term replay in ways the formula can't distinguish from living-artist performance."},
    all:{color:"#888",title:"Cross-Era View",text:"Kendrick's GKMC and Jay-Z's Blueprint occupy similar quadrants despite a decade apart. The streaming era didn't change what durability looks like — it changed how we measure it. Artists whose albums were events cluster bottom-right. Artists whose albums became reference points cluster top-right."},
  };
  const nr=narratives[activeGroup];
  const allGroupKeys=PEER_GROUPS[activeGroup]?.keys||[];

  function toggleArtist(key){
    setPeerKeys(prev=>prev.includes(key)?prev.filter(k=>k!==key):[...prev,key]);
  }

  return(<>
    <div style={{marginBottom:16}}>
      <div style={{fontSize:8,color:"#3a3a3a",letterSpacing:3,textTransform:"uppercase",marginBottom:8}}>Comparison Lens</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>{Object.entries(PEER_GROUPS).map(([gid,g])=>(<button key={gid} onClick={()=>selectGroup(gid)} style={{padding:"7px 14px",border:`1px solid ${activeGroup===gid?g.color:"#2a2a2a"}`,background:activeGroup===gid?`${g.color}15`:"transparent",color:activeGroup===gid?g.color:"#444",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:10,borderRadius:2,outline:"none"}}>{g.label}</button>))}</div>
      {allGroupKeys.length>1&&(
        <div style={{display:"flex",gap:5,flexWrap:"wrap",padding:"9px 12px",background:"#0d0d0d",border:`1px solid ${C.border}33`,borderRadius:3}}>
          <span style={{fontSize:8,color:"#3a3a3a",letterSpacing:2,textTransform:"uppercase",alignSelf:"center",marginRight:4}}>Artists:</span>
          {allGroupKeys.map(k=>{
            const on=peerKeys.includes(k);
            const p=PEERS[k];
            return(<button key={k} onClick={()=>toggleArtist(k)} style={{padding:"3px 10px",border:`1px solid ${on?p.color:"#2a2a2a"}`,background:on?`${p.color}18`:"transparent",color:on?p.color:"#444",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:9,borderRadius:2,outline:"none",transition:"all 0.15s"}}>{p.short}</button>);
          })}
          <button onClick={()=>setPeerKeys([...allGroupKeys])} style={{padding:"3px 10px",border:"1px solid #2a2a2a",background:"transparent",color:"#444",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:9,borderRadius:2,outline:"none",marginLeft:4}}>All</button>
          <button onClick={()=>setPeerKeys([])} style={{padding:"3px 10px",border:"1px solid #2a2a2a",background:"transparent",color:"#444",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:9,borderRadius:2,outline:"none"}}>None</button>
        </div>
      )}
      <div style={{fontSize:10,color:"#3a3a3a",fontStyle:"italic",marginTop:6}}>{PEER_GROUPS[activeGroup].desc}</div>
    </div>
    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
      {artistSummaries.map(s=>(
        <div key={s.key} style={{background:C.card,border:`1px solid ${s.color}25`,borderTop:`2px solid ${s.color}`,borderRadius:3,padding:"10px 13px",flex:"1 1 110px",minWidth:100}}>
          <div style={{fontSize:10,color:s.color,letterSpacing:1,marginBottom:7,fontStyle:"italic"}}>{s.name}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3}}>
            {[["Cat. Avg",pct(s.avgCat),"↓"],["Dur",String(s.avgDur),"/100"],["MC",s.avgMC?String(s.avgMC):"—",""],["Peak FW",fmt(s.peakFW),""]].map(([l,v,sub])=>(
              <div key={l}><div style={{fontSize:7,color:"#2a2a2a",letterSpacing:1.5,textTransform:"uppercase"}}>{l}</div><div style={{fontSize:11,color:s.color,fontStyle:"italic"}}>{v}<span style={{fontSize:7,color:"#2a2a2a",marginLeft:2}}>{sub}</span></div></div>
            ))}
          </div>
        </div>
      ))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 240px",gap:16,alignItems:"start"}}>
      <div>
        <SLabel>Unified Rankings</SLabel>
        {allRanked.map((a,i)=><AlbumCard key={a.id+"_"+i} a={a} rank={i} accent={a.artistColor} showConf/>)}
      </div>
      <div style={{position:"sticky",top:16,display:"flex",flexDirection:"column",gap:12}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:3,padding:"16px",textAlign:"center"}}>
          <div style={{fontSize:9,color:C.gold,letterSpacing:3,marginBottom:12,textTransform:"uppercase"}}>Artist DNA</div>
          <Radar artists={radarVisible} size={200}/>
          <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:5}}>{radarVisible.map(({name,color})=>(<div key={name} style={{display:"flex",alignItems:"center",gap:7,fontSize:9.5,color:"#666"}}><div style={{width:7,height:7,borderRadius:"50%",background:color,flexShrink:0}}/>{name}</div>))}</div>
        </div>
        <div style={{background:C.card,border:`1px solid ${nr.color}22`,borderRadius:3,padding:"14px 16px"}}>
          <div style={{fontSize:9,color:nr.color,letterSpacing:2,marginBottom:8,textTransform:"uppercase"}}>{nr.title}</div>
          <div style={{fontSize:10.5,color:"#5a4a30",lineHeight:1.9}}>{nr.text}</div>
        </div>
      </div>
    </div>
  </>);
}

// ── CONCLUSIONS ──────────────────────────────────────────────────
function ConclusionsTab(){
  const VERDICTS=[
    {
      rank:"01",color:C.gold,
      title:"Take Care is his most durable album. By a clear margin.",
      data:"11.4M total · 631K FW · Durability ~87",
      body:"Regardless of normalization window (18–48mo) or decay parameter, Take Care ranks #1 or #2 on catalog score and #1 on durability in every configuration of the model. It opened huge and kept accumulating. That combination — not just one or the other — is what separates legacy from event. It is the only album in his catalog that belongs in the same quadrant as GKMC and Forest Hills Drive."
    },
    {
      rank:"02",color:C.red,
      title:"Beef context is the strongest predictor of catalog performance. More than year, more than critical score, more than track count.",
      data:"Conflict avg vs quiet avg: consistent ~8–12pt gap across all settings",
      body:"The OLS regressions on year (R²≈0%) and Metacritic (R²≈0–3%) show almost no predictive power for catalog durability. The beef/no-beef split shows a consistent gap at every normalization window. Albums released during or after a major conflict (Scorpion during Pusha T, FATD pre-Kendrick, SSS4U post-Kendrick) systematically underperform albums released in quiet periods regardless of their critical reception. The mechanism: controversy pulls in casual listeners who inflate week one, then leave when the drama ends. The core audience was always there — beef just adds noise to the numerator."
    },
    {
      rank:"03",color:C.green,
      title:"Drake's opening-week commercial pull has been remarkably stable across 15 years of critical decline.",
      data:"FW trend: positive slope across career. SSS4U (246K) debuted #1 post-Kendrick loss.",
      body:"Views in 2016 reset the commercial ceiling at 1.04M. CLB in 2021 (613K) showed the floor. Even SSS4U — released with minimal rollout, seven months after the most public beef loss in hip-hop history, with universally negative critical coverage — debuted at #1. The audience kept showing up on week one even when critics, the Grammy apparatus, and the cultural narrative had already written a eulogy. That's a form of commercial resilience that is genuinely rare and underreported in the discourse around this period."
    },
    {
      rank:"04",color:C.purple,
      title:"Critical scores and streaming durability are measuring completely different things — for Drake specifically.",
      data:"MC:67 (Scorpion) → one of his most durable. MC:73 (HN) → his worst catalog ratio.",
      body:"The metacritic-vs-catalog scatter plot has near-zero slope. Scorpion, his most critically dismissed major release, has one of his deepest long-term catalog ratios. Honestly, Nevermind earned his best recent critical score and has his worst. His audience and his critics have been grading on diverging curves since around 2016 — the gap has widened every year. This isn't a rap-specific phenomenon, but it is unusually pronounced for an artist who dominates streaming while being consistently penalized on critical metrics."
    },
  ];

  const INTERESTING=[
    {
      color:C.gold,
      title:"For Drake's legacy, there is no comfortable middle. It's either defining or indifferent.",
      body:"The Iceman predictor reveals a compression in Drake's current legacy range that the broader data supports. At the 12-month snapshot, the Legacy Depth gap between a bad post-2020 performance and an average one is roughly the same as between average and a genuine comeback — about 7 points in each direction. His post-2020 catalog has narrowed the variance. A standard release clusters with SSS4U, CLB, and Her Loss and looks like more of the same. Only an album that genuinely breaks the pattern — lean tracklist, real critical reception, lower debut against strong long-term total — separates itself. The model isn't predicting failure. It's showing where the bar actually is.",
    },
    {
      color:C.teal,
      title:"Surprise drops look more durable than they are — and the model partially corrects for this but can't fully eliminate it.",
      body:"IYRTITL, Honestly Nevermind, and SSS4U all show better catalog scores than their standard-rollout counterparts. Part of this is genuine — surprise drops signal a different relationship with the audience. But part is mechanical: when week one is suppressed by the rollout format itself, the first-week fraction of total streams is artificially low. The normalization window helps because it projects both albums to the same theoretical window — but if week one is genuinely smaller due to distribution lag rather than fan behavior, the ratio still flatters surprise albums. This is a known limitation of the model."
    },
    {
      color:"#22d3ee",
      title:"Reclassifying More Life as a playlist turns out to be analytically honest, not just terminologically accurate.",
      body:"When More Life is excluded from the studio album pool, the Insights regressions get slightly cleaner. Its 22-track, 505K opening structure sits awkwardly between Drake's traditional album cadence and his mixtape output — it's too polished to be Dark Lane, too sprawling and guest-heavy to be NWTS or Take Care. Drake calling it a playlist wasn't marketing deflection; it was a real description of what the project was. The data agrees."
    },
    {
      color:"#10b981",
      title:"J. Cole's Grammy record (1 win from 14 nominations) is actually the most damning data point against the 'Grammys reward authenticity' argument.",
      body:"Cole never boycotted. Never had bad press. Never made a genre-defying left turn that might alienate voters. Forest Hills Drive went platinum with zero singles — the purest organic catalog in the entire dataset. His critical reputation has been consistently strong. Yet he has 1 Grammy win. Kendrick has 17. If the Recording Academy were simply rewarding authentic or critically-regarded hip-hop, Cole's record would look nothing like this. The gap between them tells you the institution is rewarding something more specific: narrative alignment, cultural moment-making, and thematic content that can be incorporated into the Academy's own self-image."
    },
    {
      color:C.orange,
      title:"The NLU paradox is genuinely unresolved — and the lawsuit dismissal made it permanent.",
      body:"The song can be simultaneously a genuine cultural phenomenon AND potentially algorithmically amplified, and the dismissal of the lawsuit at the pleading stage means the ratio will never be formally examined. Courts ruled that 'certified pedophile' in a rap context is hyperbolic opinion — no reasonable person would treat it as a factual claim. The Grammys then awarded it Record and Song of the Year. Both things happened. The culture has absorbed them without resolving the contradiction. Drake's philosophical point — that you cannot use an allegation like a weapon and then disclaim its literal truth to escape liability — is the most intellectually honest thing anyone said about the moment, even if his legal strategy was poorly constructed."
    },
    {
      color:"#fbbf24",
      title:"Every major institution with a platform gave Kendrick the biggest one available in the same 12-month window.",
      body:"Grammy sweep (Feb 2, 2025). Super Bowl halftime (Feb 9, 2025). Pulitzer Prize already in the bank (2018). Critical press unanimity during the beef. These are four separate institutions making independent decisions — but the institutional pattern is not coincidental. It reflects a longstanding alignment between Kendrick's thematic content and the approval criteria of the critical establishment, now culminating in a moment where the commercial and cultural narratives converged. Whether that convergence was organic or coordinated is the question Drake tried and failed to get answered in court."
    },
    {
      color:C.blue,
      title:"The pre-streaming era albums are probably Drake's most undervalued — their catalog depth is real but the measurement mechanism is different.",
      body:"Take Care, NWTS, and Thank Me Later built enormous catalog streaming after February 2016 — the point when Billboard started tracking streaming equivalents. That post-2016 streaming represents genuine organic rediscovery, playlist inclusion, and introduction to younger audiences. The pre-stream toggle hides them for fair like-for-like comparison, but excluding them from the legacy conversation entirely is wrong. Take Care's 11.4M total is built substantially on post-2016 discovery, which is a stronger durability signal than an album that simply accumulated streams gradually from a 2018 release."
    },
  ];

  const CAVEATS=[
    {head:"What the data cannot tell you",body:"Whether any of the streaming numbers were manipulated. Whether critical consensus was coordinated or organic. Whether Drake genuinely has a secret daughter. Whether Kendrick's allegations are morally defensible even if legally classified as hyperbole. The model measures what happened in streaming databases — it cannot audit those databases, and it cannot resolve moral or factual questions that exist outside of them."},
    {head:"What 'catalog score' is and isn't",body:"It's a ratio, not an absolute quality measure. An album can have an excellent catalog score because it's genuinely beloved and people keep returning to it. It can also have a good catalog score because it had a suppressed week-one denominator (surprise drop), because the audience was small but loyal (niche project), or because catalog streaming was artificially inflated. The score is a useful lens, not a verdict."},
    {head:"Peer data is directional, not audited",body:"Drake's totals are Luminate-confirmed as of September 5, 2025. Peer totals are estimated from RIAA certifications, Billboard data, and public reporting. The legends tier (Jay-Z, Wayne, Eminem) used physical-era sales figures for opening week, which are not equivalent to streaming-era first-week numbers. Cross-era comparisons should be read as directional."},
  ];

  return(
    <div>
      <div style={{background:"linear-gradient(135deg,#140a00,#0d0d0d)",border:`1px solid ${C.border}`,borderRadius:4,padding:"24px 26px",marginBottom:20}}>
        <div style={{fontSize:9,letterSpacing:5,color:C.goldDim,textTransform:"uppercase",marginBottom:10}}>The Verdicts</div>
        <div style={{fontSize:11,color:"#4a3a20",lineHeight:1.7}}>What the data says with enough confidence to state directly — findings that hold across multiple normalization windows and model configurations.</div>
      </div>

      <div style={{marginBottom:24}}>
        {VERDICTS.map(v=>(
          <div key={v.rank} style={{background:C.card,border:`1px solid ${v.color}22`,borderLeft:`4px solid ${v.color}`,borderRadius:3,padding:"16px 20px",marginBottom:10,display:"flex",gap:16,alignItems:"flex-start"}}>
            <div style={{fontSize:26,color:`${v.color}40`,fontStyle:"italic",flexShrink:0,lineHeight:1,paddingTop:2}}>{v.rank}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,color:"#d4c080",fontStyle:"italic",marginBottom:5,lineHeight:1.5}}>{v.title}</div>
              <div style={{fontSize:9,color:v.color,letterSpacing:2,marginBottom:8,background:`${v.color}10`,display:"inline-block",padding:"2px 8px",borderRadius:10}}>{v.data}</div>
              <div style={{fontSize:11.5,color:"#6a5a40",lineHeight:1.9}}>{v.body}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{background:"#0a0a0a",border:`1px solid ${C.border}`,borderRadius:3,padding:"18px 20px",marginBottom:20}}>
        <div style={{fontSize:9,letterSpacing:5,color:C.goldDim,textTransform:"uppercase",marginBottom:14}}>Most Interesting Non-Obvious Takeaways</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(350px,1fr))",gap:12}}>
          {INTERESTING.map(item=>(
            <div key={item.title} style={{background:C.card,border:`1px solid ${item.color}22`,borderTop:`2px solid ${item.color}`,borderRadius:3,padding:"14px 16px"}}>
              <div style={{fontSize:11.5,color:"#c0aa70",fontStyle:"italic",marginBottom:8,lineHeight:1.5}}>{item.title}</div>
              <div style={{fontSize:11,color:"#5a4a30",lineHeight:1.85}}>{item.body}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:3,padding:"18px 20px",marginBottom:20}}>
        <div style={{fontSize:9,letterSpacing:5,color:C.goldDim,textTransform:"uppercase",marginBottom:14}}>What This Data Cannot Tell You</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:10}}>
          {CAVEATS.map(c=>(
            <div key={c.head} style={{borderLeft:`2px solid #2a2a2a`,paddingLeft:12}}>
              <div style={{fontSize:10,color:"#555",letterSpacing:1,marginBottom:5,textTransform:"uppercase"}}>{c.head}</div>
              <div style={{fontSize:11,color:"#4a3a20",lineHeight:1.8}}>{c.body}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:"linear-gradient(135deg,#0f0a00,#0a0a0a)",border:`1px solid ${C.border}`,borderRadius:3,padding:"20px 24px"}}>
        <div style={{fontSize:9,letterSpacing:5,color:C.goldDim,textTransform:"uppercase",marginBottom:12}}>Final Statement</div>
        <div style={{fontSize:12.5,color:"#8a7a60",lineHeight:2.1,fontStyle:"italic"}}>
          "Drake is the most commercially dominant artist of the streaming era by most measurable metrics, and one of the worst-served by the institutional apparatus that's supposed to recognize that. Kendrick is the most critically acclaimed rapper alive and, as of 2024–25, also the most institutionally validated. Those two things being true simultaneously — with Drake's conspiracy allegations unresolved and undiscoverable, with courts disclaiming NLU's central allegation as legally non-factual while the Grammys awarded it everything available — means the official story of who won and what it meant is probably the least reliable version of what actually happened.
          <br/><br/>
          The word for content that produces a social verdict independently of whether its underlying claims are literally true is disinformation. The court said no reasonable person would believe NLU's allegations as fact. The culture treated them as settled. Those two sentences, read together, describe the mechanism. Not a conspiracy theory — a structure. One that the critical press, the Recording Academy, and the streaming apparatus all participated in, each through their own institutional logic, without any of them having to consciously coordinate.
          <br/><br/>
          The stream data doesn't have an agenda. It counts. In ten years the catalog scores will tell a story no press cycle can manufacture, no Grammy committee can award, and no lawsuit dismissal can suppress. Whatever that story turns out to be, this is what the numbers looked like on September 5, 2025."
        </div>
      </div>
    </div>
  );
}

// ── DATA ──────────────────────────────────────────────────────────
function DataTab({drake,sortKey,setSortKey,sortDir,setSortDir}){
  const sorted=useMemo(()=>[...drake].sort((a,b)=>{const av=a[sortKey],bv=b[sortKey];if(av==null&&bv==null)return 0;if(av==null)return 1;if(bv==null)return -1;return typeof av==="string"?sortDir*av.localeCompare(bv):sortDir*(av-bv);}),[drake,sortKey,sortDir]);
  const Th=({k,label,right})=>{const active=sortKey===k;return(<th onClick={()=>{setSortKey(k);setSortDir(active?-sortDir:1);}} style={{fontSize:8,letterSpacing:2,textTransform:"uppercase",color:active?C.gold:C.goldDim,textAlign:right?"right":"left",padding:"7px 10px",borderBottom:`1px solid ${C.border}`,cursor:"pointer",userSelect:"none",whiteSpace:"nowrap"}}>{label}{active?(sortDir===1?" ↑":" ↓"):""}</th>);};
  return(<>
    <SLabel>Drake Discography — Click headers to sort</SLabel>
    <div style={{overflowX:"auto",marginBottom:26}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5}}>
        <thead><tr><Th k="title" label="Album"/><Th k="release" label="Released"/><Th k="fw" label="Opening Week" right/><Th k="total" label="Total" right/><Th k="catalog" label="Catalog" right/><Th k="tracks" label="Trk" right/><Th k="perTrack" label="Per Trk" right/><Th k="meta" label="MC" right/><Th k="adjFWPct" label="Cat. Score ↓" right/><Th k="durability" label="Dur ↑" right/></tr></thead>
        <tbody>{sorted.map(a=>(<tr key={a.id} style={{borderBottom:"1px solid #141414"}}>
          <td style={{padding:"8px 10px"}}><div style={{fontStyle:"italic",color:"#d4c080"}}>{a.title}</div><div style={{display:"flex",gap:5,marginTop:2,flexWrap:"wrap"}}>{a.collab&&<span style={{fontSize:8,color:"#444"}}>w/ {a.collab}</span>}{a.preStream&&<span style={{fontSize:8,color:C.blue}}>pre-stream</span>}{a.surprise&&<span style={{fontSize:8,color:"#9ca3af"}}>surprise</span>}{a.beefContext&&<span style={{fontSize:8,color:C.red}}>🥊 {BEEF_CTX[a.beefContext]?.label}</span>}{a.type==="playlist"&&<span style={{fontSize:8,color:"#22d3ee"}}>playlist</span>}{a.type==="mixtape"&&a.commercialMixtape&&<span style={{fontSize:8,color:C.orange}}>commercial mixtape</span>}{a.type==="mixtape"&&!a.commercialMixtape&&<span style={{fontSize:8,color:C.orange}}>mixtape</span>}{a.type==="compilation"&&<span style={{fontSize:8,color:"#8b5cf6"}}>compilation</span>}{a.combined&&<span style={{fontSize:8,color:C.pink}}>double album</span>}</div></td>
          <td style={{padding:"8px 10px",color:"#3a3020"}}>{a.release}</td>
          <td style={{padding:"8px 10px",textAlign:"right",color:"#b0a080"}}>{fmt(a.fw)}</td>
          <td style={{padding:"8px 10px",textAlign:"right",color:"#b0a080"}}>{fmt(a.total)}</td>
          <td style={{padding:"8px 10px",textAlign:"right",color:"#8a7a60"}}>{fmt(a.catalog||0)}</td>
          <td style={{padding:"8px 10px",textAlign:"right",color:"#3a3020"}}>{a.tracks}</td>
          <td style={{padding:"8px 10px",textAlign:"right",color:"#3a3020"}}>{a.perTrack?fmt(a.perTrack):"—"}</td>
          <td style={{padding:"8px 10px",textAlign:"right"}}><span style={{color:mcClr(a.meta)}}>{a.meta||"—"}</span></td>
          <td style={{padding:"8px 10px",textAlign:"right",color:a.extrapolated?"#333":C.gold}}>{pct(a.adjFWPct)}{a.extrapolated&&<span style={{fontSize:7,color:"#333",marginLeft:2}}>⚠</span>}</td>
          <td style={{padding:"8px 10px",textAlign:"right"}}><span style={{color:durClr(a.durability)}}>{a.durability}</span></td>
        </tr>))}</tbody>
      </table>
    </div>
    <SLabel>Methodology</SLabel>
    {[
      {title:"Model Presets",body:"Four presets set the normalization window and decay speed together. Default (30mo / 0.5) is the general-purpose baseline. Legacy Test (48mo / 0.3) is the strictest measure — only albums with deep sustained catalog replay rank well here; Take Care and NWTS pull furthest ahead. Recent Pulse (18mo / 0.7) weights current streaming behavior most heavily. Deep Catalog (42mo / 0.3) uses the longest window with the slowest decay, where beef-adjacent albums are penalized hardest and the quiet/conflict split becomes most visible. Adjusting sliders manually after selecting a preset overrides it."},
      {title:"Catalog Score (lower = better)",body:"The primary metric. It's the fraction of an album's total streaming consumption that happened in the first week, projected over a normalized window using a power law decay model. A score of 5% means 95% of the album's listening life was still ahead after week one. Think of it like a movie's opening weekend vs total box office: event films spike and fade, classics build."},
      {title:"Durability Score (higher = better)",body:"A 0–100 composite: catalog depth (60%) + Metacritic score (25%) + catalog-to-opening-week multiple (15%). Catalog Score and Durability are related but not the same — an album can have a very low catalog score (deep replay) but low Metacritic and score middling on durability. Scorpion is the best example of this."},
      {title:"Best Catalog Ratio vs Top Durability Score",body:"The Rankings stat bar shows two different album highlights. Best Catalog Ratio is the album ranked #1 by the power law model — the lowest adjFW%, meaning the most streaming came after week one. Top Durability Score is the album with the highest composite 0–100 score. They're sometimes the same album, sometimes not. When they differ, it usually means the best catalog album has a weak Metacritic that drags its composite down."},
      {title:"Pre-Streaming Era",body:"TML, Take Care, and NWTS released before Billboard counted streaming equivalents (February 2016). Their Luminate totals include CD and download catalog built before streaming was tracked. Their catalog depth is real — the mechanism is just different. The Streaming Era Only toggle hides them for a clean like-for-like comparison."},
      {title:"Release Classification & Non-Studio Projects",body:"Studio albums are the default ranked set. The toggle adds five non-studio categories: Commercial Mixtapes — IYRTITL, WATTBA, and Dark Lane Demo Tapes were released and marketed as mixtapes but charted commercially and have full streaming data; Playlist — More Life, Drake's own term at release, excluded from studio rankings by default; Compilation — Care Package (2019), a repackage of previously released non-album tracks; and Pre-Streaming Mixtapes — Room for Improvement (2006), Comeback Season (2007), and So Far Gone (2009) predate streaming measurement entirely and are shown as historical context only with no catalog scores. IYRTITL: Luminate/Billboard counted it as an album — streaming data fully comparable to studio releases."},
      {title:"HN + HL Double Album Toggle",body:"Drake framed CLB, Honestly Nevermind, and Her Loss as a trilogy. The toggle treats HN and HL as one combined project: 608K FW, 5.03M total, 30 tracks, MC ~67. Useful for seeing how they compete as a unit. Toggle off to analyze them individually."},
      {title:"Peer Data",body:"Drake totals: Luminate confirmed Sept 5, 2025. GKMC: confirmed ≥10M (Jan 2026 milestone). Astroworld: RIAA 6× Platinum floor. All other peer totals: triangulated from RIAA certifications and Billboard chart data. Legends tier (Jay-Z, Wayne, Eminem) FW numbers are physical-era sales and are not comparable to streaming-equivalent opening weeks. All peer rankings are directional."},
    ].map(({title,body})=>(
      <div key={title} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:3,padding:"13px 17px",marginBottom:9}}>
        <div style={{fontSize:10,color:C.gold,letterSpacing:1.5,textTransform:"uppercase",marginBottom:7}}>{title}</div>
        <div style={{fontSize:12,color:"#5a4a30",lineHeight:1.9}}>{body}</div>
      </div>
    ))}
  </>);
}

// ── NLU LEGITIMACY TAB ───────────────────────────────────────────
function LegitimacyTab(){
  const [showCounter,setShowCounter]=useState(true);
  const typeColors={shot:C.purple,response:C.gold,flag:C.red,event:C.teal,legal:C.orange,awards:"#fbbf24"};
  const verdictColors={win:C.green,loss:C.red,cultural:C.teal,neutral:"#888",opening:C.purple,response:C.gold,buried:C.red,filed:C.orange,dismissed:"#9ca3af",awarded:"#fbbf24",disputed:C.orange};
  const verdictLabels={win:"W",loss:"L",cultural:"⚡",neutral:"—",opening:"🎯",response:"↩",buried:"💀",filed:"⚖",dismissed:"✗",awarded:"🏆",disputed:"?"};

  return(<>
    <InfoBox color={C.red}>
      <span style={{color:C.red}}>Analytical framework.</span> This tab presents Drake's allegations and the logical arguments he has made — in his lawsuits, public statements, and through his team — alongside factual counterpoints. Where claims are disputed or alleged, they are labeled as such. This is not a verdict; it is a structured examination of the evidence as it exists publicly.
    </InfoBox>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8,marginBottom:20}}>
      {[
        {label:"NLU First-Week Streams",  value:"71M",          color:C.purple, note:"2024's biggest single-week debut"},
        {label:"NLU Total Streams (est.)",value:"600M+",        color:C.purple, note:"As of Sept 2025"},
        {label:"Grammy Categories Won",   value:"5 of 6",       color:"#fbbf24",note:"Unprecedented for a diss track"},
        {label:"Drake Lawsuits Filed",    value:"2",            color:C.red,    note:"vs UMG and Spotify"},
        {label:"Suits Outcome",           value:"Dismissed",    color:"#9ca3af",note:"Pre-discovery; data never tested"},
        {label:"Legal Standard Applied",  value:"No Reas. Person",color:C.orange,note:"Lyrics = hyperbole, not facts"},
      ].map(({label,value,color,note})=>(
        <div key={label} style={{background:C.card,border:`1px solid ${color}22`,borderLeft:`2px solid ${color}`,borderRadius:3,padding:"10px 12px"}}>
          <div style={{fontSize:8,color:"#333",letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>{label}</div>
          <div style={{fontSize:15,color,fontStyle:"italic",marginBottom:2}}>{value}</div>
          <div style={{fontSize:9,color:"#3a3030"}}>{note}</div>
        </div>
      ))}
    </div>

    <SLabel>Timeline of Events — Beef Through Legal Aftermath</SLabel>
    <div style={{display:"flex",gap:16,marginBottom:14,flexWrap:"wrap"}}>
      {[{color:C.purple,label:"Kendrick"},{color:C.gold,label:"Drake"},{color:"#fbbf24",label:"Industry / Institutional"}].map(({color,label})=>(
        <div key={label} style={{display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:color,flexShrink:0}}/>
          <span style={{fontSize:9,color:"#555",letterSpacing:1}}>{label}</span>
        </div>
      ))}
    </div>
    <div style={{marginBottom:22}}>
      {BEEF_TIMELINE.map((e,i)=>{
        const actorColor=e.actor==="Kendrick"?C.purple:e.actor==="Drake"?C.gold:e.actor==="Industry"?"#fbbf24":C.orange;
        return(
        <div key={i} style={{display:"flex",gap:12,marginBottom:8,alignItems:"flex-start"}}>
          <div style={{width:110,flexShrink:0,paddingTop:2}}>
            <div style={{fontSize:9,color:"#3a3030",letterSpacing:0.5}}>{e.date}</div>
          </div>
          <div style={{width:3,background:`${actorColor}44`,borderRadius:2,flexShrink:0,minHeight:40,position:"relative"}}>
            <div style={{width:3,height:3,borderRadius:"50%",background:actorColor,position:"absolute",top:8,left:0}}/>
          </div>
          <div style={{flex:1,background:C.card,border:`1px solid ${e.type==="flag"?C.red+"44":C.border}`,borderLeft:`2px solid ${actorColor}`,borderRadius:3,padding:"9px 12px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
              <span style={{fontSize:12,color:actorColor,fontStyle:"italic"}}>{e.event}</span>
              <span style={{fontSize:8,color:"#555",background:"#1a1a1a",padding:"1px 6px",borderRadius:10}}>{e.actor}</span>
              {e.verdict&&<span style={{fontSize:9,color:"#555",background:"#1a1a1a",padding:"1px 7px",borderRadius:10}}>{verdictLabels[e.verdict]} {e.verdict}</span>}
              {e.type==="flag"&&<span style={{fontSize:9,color:C.red}}>⚠ alleged</span>}
            </div>
            <div style={{fontSize:10.5,color:"#5a4a30",lineHeight:1.75}}>{e.desc}</div>
          </div>
        </div>
      })}
    </div>
    <div style={{background:C.card,border:`1px solid ${C.red}33`,borderRadius:3,padding:"20px 22px",marginBottom:16}}>
      <div style={{fontSize:10,color:C.red,letterSpacing:3,textTransform:"uppercase",marginBottom:14}}>The Logic Chain</div>
      {[
        {n:"1",color:C.purple,title:"NLU's power rested on a specific allegation",body:"The song's hook — 'certified pedophile' — was not abstract criticism. It was a specific criminal characterization of a named, living person. The song's cultural dominance required people to engage with that allegation as if it had weight."},
        {n:"2",color:C.orange,title:"Courts ruled the allegations legally non-factual",body:"Drake's defamation claims were dismissed at the pleading stage — meaning the court evaluated whether the legal argument as written could survive, not whether the underlying facts were true or false. The standard applied: these lyrics constitute hyperbolic artistic expression that 'no reasonable person' would interpret as a literal verifiable claim. No discovery occurred. The court never examined whether the manipulation happened. The dismissal is a procedural outcome, not an empirical verdict on the facts."},
        {n:"3",color:C.red,title:"This creates a contradiction the culture has not resolved",body:"If no reasonable person believed the claims were literally true, what exactly were 600 million streams celebrating? Either: (A) people knew it wasn't literally true but celebrated it anyway — in which case the moment was tribalism, not truth — or (B) the legal standard is wrong and people did believe it, in which case the Grammys awarded Song of the Year for a smear that worked."},
        {n:"4",color:C.gold,title:"Drake's argument: the industry manufactured both the moment AND the legal shield",body:"If the allegations were amplified by machines (stream manipulation, playlist coordination, press briefing) to reach cultural saturation — and then the same institutions that amplified it disclaim its literal truth to escape legal liability — then the damage was done by design and the escape hatch was pre-planned. You can't claim it was just music after you used it like a weapon."},
        {n:"5",color:"#9ca3af",title:"The counterargument that doesn't land",body:"'F*ck tha Police' also wasn't a policy white paper. Art has always used hyperbole. The difference: NLU named a real living person with a specific charge that ends careers, was amplified by the largest music company in the world, and was then submitted for (and won) every Grammy category available. The institutional validation of the allegation is what makes it different from standard rap hyperbole."},
        {n:"6",color:C.red,title:"What ties it together: this is the structure of disinformation",body:"Disinformation doesn't require anyone to literally believe a false claim. It works by producing a social effect — a verdict, a feeling, a consensus — that operates independently of whether any underlying assertion is true. The court ruling that 'no reasonable person' would take NLU's allegations as literal fact is the legal articulation of exactly that structure: content engineered to produce an outcome rather than convey a truth. The critical press reviewed NLU as art. The Grammy apparatus rewarded it as achievement. The legal system dismissed it as non-factual. All three processed the same object and none had to reckon with what the song had already done. The damage was designed to survive the disclaimer. That is the mechanism, and it's not unique to rap beef — it's how institutional narrative-making works when the institutions are aligned."},
      ].map(({n,color,title,body})=>(
        <div key={n} style={{display:"flex",gap:14,marginBottom:14,alignItems:"flex-start"}}>
          <div style={{width:26,height:26,borderRadius:"50%",background:`${color}20`,border:`1px solid ${color}44`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:11,color,fontStyle:"italic"}}>{n}</div>
          <div>
            <div style={{fontSize:11.5,color:"#c0aa70",marginBottom:4,fontStyle:"italic"}}>{title}</div>
            <div style={{fontSize:11,color:"#5a4a30",lineHeight:1.8}}>{body}</div>
          </div>
        </div>
      ))}
    </div>

    <SLabel>Botting Allegations — What Was Claimed, What Was Dismissed, What Was Never Tested</SLabel>
    <div style={{marginBottom:20}}>
      <div style={{background:"#0f0f0f",border:`1px solid ${C.orange}22`,borderRadius:3,padding:"14px 16px",marginBottom:14,fontSize:11,color:"#555",lineHeight:1.8}}>
        <span style={{color:C.orange}}>Critical distinction.</span> Drake's stream manipulation lawsuits were dismissed at the <em>pleading stage</em> — meaning the court evaluated whether the legal claims as written could survive, not whether the underlying facts were true or false. No discovery occurred. Spotify and UMG's internal data was never examined by any court. Dismissal is a legal outcome, not an empirical verdict.
      </div>
      {[
        {n:"What Drake specifically alleged",color:C.red,items:[
          "UMG hired a third-party company to artificially inflate NLU streams by hundreds of millions via automated bot networks",
          "Spotify participated in or enabled coordinated editorial playlist manipulation to suppress Drake's response tracks while amplifying NLU",
          "The combined effect: NLU's chart dominance and cultural footprint were at least partially manufactured, not organically earned",
          "Drake's team claimed to possess streaming data analysis showing anomalous velocity patterns inconsistent with organic listening behavior",
          "Podcast hosts and hip-hop media figures were allegedly compensated to provide one-sided commentary favorable to the Kendrick narrative",
        ]},
        {n:"Why the suits were dismissed",color:"#9ca3af",items:[
          "Tortious interference claims require proving intentional, improper interference with specific business relationships — hard to establish at pleading stage without discovery",
          "Defamation claims for the lyrics failed because 'certified pedophile' in a rap diss context is legally classified as hyperbolic opinion, not a factual assertion",
          "The court found Drake did not adequately plead facts sufficient to state a claim — a procedural bar, not a factual finding",
          "Importantly: the court did not rule that no manipulation occurred. It ruled Drake hadn't pleaded it in a legally actionable way",
        ]},
        {n:"What was never tested",color:C.orange,items:[
          "The actual Spotify stream velocity data for NLU vs contemporaneous tracks — this would show if the growth curve was anomalous",
          "Internal UMG communications about NLU's campaign strategy during the beef period",
          "Editorial playlist decision logs — who added NLU to which playlists, when, and what the comparable adds were for Drake tracks",
          "Whether any third-party streaming service vendors received unusual payment instructions tied to specific track promotion",
          "The financial relationship between pgLang/Kendrick's team and any media figures who covered the beef",
        ]},
        {n:"Known context: stream manipulation is real and documented",color:C.teal,items:[
          "Stream fraud is a well-documented industry problem — Spotify has removed billions of fraudulent streams from its platform across many artists",
          "Multiple music industry investigations (2019 Bloomberg, 2021 Rolling Stone) documented coordinated stream manipulation services operating at scale",
          "The practice of bot-inflating opening-week numbers to influence charts, award eligibility, and cultural narrative is known to exist",
          "Drake's claim isn't that botting is impossible — it's that it happened here specifically. That claim deserved discovery. It didn't get it.",
          "The absence of proof is not proof of absence, especially when the party with the proof (Spotify/UMG internal data) was the defendant",
        ]},
      ].map(({n,color,items})=>(
        <div key={n} style={{background:C.card,border:`1px solid ${color}25`,borderLeft:`3px solid ${color}`,borderRadius:3,padding:"14px 16px",marginBottom:10}}>
          <div style={{fontSize:10,color,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>{n}</div>
          {items.map((item,i)=>(
            <div key={i} style={{display:"flex",gap:10,marginBottom:7,alignItems:"flex-start"}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:color,flexShrink:0,marginTop:5,opacity:0.6}}/>
              <div style={{fontSize:11,color:"#5a4a30",lineHeight:1.75}}>{item}</div>
            </div>
          ))}
        </div>
      ))}
      <div style={{background:C.card,border:`1px solid #fbbf2433`,borderRadius:3,padding:"16px 18px",marginTop:6,marginBottom:14}}>
        <div style={{fontSize:10,color:"#fbbf24",letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>The Epistemological Problem</div>
        <div style={{fontSize:11.5,color:"#7a6a50",lineHeight:2}}>
          NLU's 71M first-week streams made it the largest debut week of any song in Kendrick's career by a factor of roughly 2×. Compare: "luther" ft. SZA — a smooth, accessible R&B crossover with one of pop's biggest names — debuted at ~68M first-week streams on GNX. A diss track about a specific person and a love song co-led by SZA performing at the same streaming velocity is either remarkable organic parity or it tells you the NLU number had a floor that wasn't entirely organic.
          <br/><br/>
          The lawsuit's dismissal ensures we never find out the ratio. The cultural narrative hardened around option (a) — purely organic. Drake's position is that (b) or (c) is at minimum worth examining. He was denied the procedural mechanism that would have answered it. That is a factual statement about what happened — not a defense of Drake's legal strategy, which may have been poorly constructed even if the underlying claim had merit.
        </div>
      </div>

      <div style={{background:C.card,border:`1px solid ${C.orange}25`,borderLeft:`3px solid ${C.orange}`,borderRadius:3,padding:"14px 16px",marginBottom:14}}>
        <div style={{fontSize:10,color:C.orange,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Podcast & Hip-Hop Media — The Coordination Allegation</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[
            {head:"What was alleged",body:"Drake's team has claimed — without litigation-level proof — that podcast hosts and hip-hop media figures received financial inducements or coordinated briefings to amplify the Kendrick narrative, decline to engage seriously with Drake's counterarguments, and refuse to platform voices skeptical of the NLU campaign. The specific mechanism alleged: promotional budgets routed through intermediaries, not direct payouts."},
            {head:"What the observable pattern shows",body:"In April–May 2024, near-unanimity existed across hip-hop media: Euphoria was a masterpiece on drop day, Family Matters was addressed primarily through the lens of how Kendrick responded to it, and Drake's legal filings were covered overwhelmingly as paranoid delusion rather than serious allegations. Outlets that had spent years covering the beef suddenly adopted a unified framing within 24 hours. Uniform framing across competing outlets is consistent with coordination — it is not proof of it."},
            {head:"The payola analogy",body:"Radio payola — labels paying for spins — was illegal but endemic before prosecution. The mechanism was deniable and happened through intermediaries. The same structural incentive exists in streaming playlisting without equivalent regulation."},
            {head:"Why this matters for the NLU analysis",body:"If media figures were compensated to frame the story in a particular way, the 'unanimous critical and cultural consensus' that NLU won the beef is itself partially manufactured. Not the streams. Not the Grammy ballots. Not the Super Bowl booking. But the interpretive scaffolding that told the public what those numbers meant — that could be the most consequential manipulation of all, and the one least likely to ever be formally examined."},
          ].map(({head,body})=>(
            <div key={head} style={{borderBottom:"1px solid #1a1a1a",paddingBottom:8}}>
              <div style={{fontSize:9.5,color:C.orange,letterSpacing:1,marginBottom:4}}>{head}</div>
              <div style={{fontSize:11,color:"#5a4030",lineHeight:1.8}}>{body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <SLabel>The Preparation Pattern — What the Record Suggests</SLabel>
    <div style={{marginBottom:20}}>
      <InfoBox color={C.orange}>Thesis: Drake showed foreknowledge inconsistent with being blindsided — whether from inside information, 'wiretapping his enemies' (Heart Part 6), or reading the room. He positioned himself within what was coming rather than reacted. Some is from Drake's lawsuit; some is logical inference. Dismissed at pleading. Not a finding of fact.</InfoBox>
      {[
        {n:"1",color:"#fbbf24",head:"November 2023 — the label relationship already over.",
         body:"Four months before 'Like That' launched the beef, Drake released the FATD Scary Hours deluxe. The energy was conspicuously combative — not generic but someone with a specific fight in mind. Drake's lawsuit alleges UMG had knowledge of the deteriorating contract situation. If accurate, the campaign was being built while both sides were still nominally negotiating."},
        {n:"2",color:C.red,   head:"The preparation pattern that is hard to explain as coincidence.",
         body:"Push Ups was reportedly in the vault for years. Meet the Grahams and Not Like Us dropped within hours of Family Matters — not spontaneous. The ambush required advance preparation and, the argument goes, advance knowledge of Drake's timeline. Drake built a #1 career from an independent unsigned position in 2009 without needing anyone. A person who did that does not accidentally engineer the conditions of his own legal strategy. The preparation level suggests the response wasn't reactive. It was the play."},
        {n:"3",color:C.purple,head:"The appeal — why the dismissal doesn't settle this.",
         body:"Dismissed at pleading — before any discovery. Spotify stream data, UMG communications, and media payment records remain unexamined. Drake's appeal is ongoing as of March 2026. The dismissal is procedural, not empirical. The defendants hold the evidence."},
      ].map(({n,color,head,body})=>(
        <div key={n} style={{display:"flex",gap:14,marginBottom:14,alignItems:"flex-start"}}>
          <div style={{width:26,height:26,borderRadius:"50%",background:`${color}18`,border:`1px solid ${color}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:11,color,fontStyle:"italic",marginTop:2}}>{n}</div>
          <div>
            <div style={{fontSize:11.5,color:"#c0aa70",marginBottom:4,fontStyle:"italic"}}>{head}</div>
            <div style={{fontSize:11,color:"#5a4a30",lineHeight:1.85}}>{body}</div>
          </div>
        </div>
      ))}
    </div>
    <SLabel>The Super Bowl — Feb 9, 2025</SLabel>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:3,padding:"16px 18px",marginBottom:20}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:16}}>
        <div>
          <div style={{fontSize:10,color:C.red,letterSpacing:1.5,marginBottom:8,textTransform:"uppercase"}}>The Sequence</div>
          <div style={{fontSize:11,color:"#5a4a30",lineHeight:1.9}}>Feb 2: Suits dismissed. "Certified pedophile" ruled legally non-factual hyperbole.<br/>Feb 9: Kendrick performs NLU at Super Bowl LIX. 133.5M viewers — the most-watched halftime show in history. Trump in attendance — first sitting president at a Super Bowl.<br/><br/>Seven days. The man the court legally cleared watched a 133M-person singalong of that allegation. Booking predated the beef — but the sequence is documented fact.</div>
        </div>
        <div>
          <div style={{fontSize:10,color:C.teal,letterSpacing:1.5,marginBottom:8,textTransform:"uppercase"}}>The Performance</div>
          <div style={{fontSize:11,color:"#5a4a30",lineHeight:1.9}}>Kendrick opened by driving out of a 1980s Buick GNX. Samuel L. Jackson appeared as Uncle Sam. Serena Williams crip-walked during NLU. Kendrick teased the song mid-show: "I wanna play their favorite song, but you know they love to sue." The crowd sang the "A minor" line in unison. He closed with TV Off alongside DJ Mustard. The show was more political statement than concert — with Trump in the building.</div>
        </div>
        <div>
          <div style={{fontSize:10,color:"#fbbf24",letterSpacing:1.5,marginBottom:8,textTransform:"uppercase"}}>The Counterpoint</div>
          <div style={{fontSize:11,color:"#5a4a30",lineHeight:1.9}}>Halftime bookings happen 12–18 months in advance. The NFL selected Kendrick in 2024 before NLU existed. The 7-day gap between dismissal and performance is scheduling, not coordination — the strongest counterargument. It does not resolve what the optics produced regardless of intent.</div>
        </div>
      </div>
    </div>

    <SLabel>Conclusion — What The Record Shows</SLabel>
    <SLabel>Industry Optics Scorecard</SLabel>
      <Toggle on={showCounter} set={setShowCounter} label="Show counterpoints" color={C.teal}/>
    {OPTICS_ITEMS.map((item,i)=>{
      if(!showCounter&&item.flag===false) return null;
      const borderColor=item.flag===true?C.red:item.flag===false?C.teal:"#fbbf24";
      const icon=item.flag===true?"⚑":item.flag===false?"◎":"?";
      return(
        <div key={i} style={{background:C.card,border:`1px solid ${borderColor}25`,borderLeft:`3px solid ${borderColor}`,borderRadius:3,padding:"12px 15px",marginBottom:8}}>
          <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
            <div style={{fontSize:14,color:borderColor,flexShrink:0,paddingTop:1}}>{icon}</div>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <span style={{fontSize:11.5,color:"#d4c080",fontStyle:"italic"}}>{item.item}</span>
                <span style={{fontSize:8,color:borderColor,background:`${borderColor}15`,padding:"1px 7px",borderRadius:10,letterSpacing:1}}>{item.label}</span>
              </div>
              <div style={{fontSize:11,color:"#5a4a30",lineHeight:1.75}}>{item.note}</div>
            </div>
          </div>
        </div>
      );
    })}

    {/* ── NLU CONCLUSION ─────────────────────────────────────── */}
    <div style={{marginTop:28,background:"linear-gradient(135deg,#0f0800,#0a0a0a)",border:`1px solid ${C.border}`,borderRadius:3,padding:"22px 24px"}}>
      <div style={{marginBottom:16}}>

      {[
        {color:C.red,   n:"1", head:"The legal outcome settled nothing factually.",
         body:"Claims dismissed at pleading — before any discovery, before any internal data was examined. A pleading dismissal means the claims weren't sufficiently stated as legal arguments. It is not a finding that the underlying events did not occur. The court did not rule that no manipulation happened. It ruled Drake hadn't pleaded it in a legally actionable way. Those are different conclusions, and conflating them is how a procedural outcome became a cultural verdict."},
        {color:"#fbbf24",n:"2", head:"The Grammy sweep institutionalized a claim the court called legally non-factual.",
         body:"In the same window where a court ruled no reasonable person would interpret NLU's allegations as literal fact, the Recording Academy gave the song Record of Year, Song of Year, Best Rap Song, Best Melodic Rap, and Best Music Video. The industry's highest recognition treated as its peak achievement a work the legal system classified as non-factual opinion."},
        {color:C.purple, n:"3", head:"The structure is disinformation regardless of intent.",
         body:"Disinformation doesn't require a conspiracy. It doesn't require anyone to consciously lie. It works when content is engineered to produce a social verdict — a feeling, a consensus, a reputation — that operates independently of whether its underlying claims are literally true. The critical press reviewed NLU as art and praised it. The Grammy apparatus rewarded it as achievement. The legal system dismissed its central allegation as non-factual. The streaming platforms amplified it to 600 million plays. None of these institutions had to coordinate. Each was doing exactly what it was designed to do. The result was a claim that could not be proven in court becoming treated as settled cultural fact. That is the mechanism, and it is indistinguishable from what we call disinformation when we see it in other contexts."},
        {color:C.teal,   n:"4", head:"The data has a longer memory than the narrative.",
         body:"Everything documented in this tab is frozen in the public record as of September 2025. The streaming data keeps moving. Catalog scores will render verdicts no press cycle can manufacture and no Grammy committee can award. In ten years the question of what happened in 2024 will be answered by discovery that never came, or it won't. Either way the albums will still be playing or they won't. That's the only scoreboard without a conflicts-of-interest problem."},
      ].map(({color,n,head,body})=>(
        <div key={n} style={{display:"flex",gap:16,marginBottom:20,alignItems:"flex-start"}}>
          <div style={{width:28,height:28,borderRadius:"50%",background:`${color}18`,border:`1px solid ${color}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:12,color,fontStyle:"italic",marginTop:2}}>{n}</div>
          <div>
            <div style={{fontSize:12,color:"#c0aa70",fontStyle:"italic",marginBottom:6,lineHeight:1.5}}>{head}</div>
            <div style={{fontSize:11,color:"#5a4a30",lineHeight:1.9}}>{body}</div>
          </div>
        </div>
      ))}

      <div style={{borderTop:`1px solid ${C.border}`,paddingTop:16,marginTop:4,fontSize:11,color:"#6a5a40",lineHeight:2,fontStyle:"italic"}}>
        "The song that couldn't be proven in court became the song of the year. The artist who couldn't be disproven in culture had his lawsuit dismissed. The institutions processed the same event through their own logic and produced a consensus that no single institution was actually responsible for. That is not how corruption works. That is how narrative works. The difference matters — and understanding it is the only way to think clearly about what 2024 actually was."
      </div>
    </div>
  </>);
}
function AwardsTab(){
  const maxWins=Math.max(...GRAMMY_DATA.map(a=>a.wins));
  const maxNoms=Math.max(...GRAMMY_DATA.map(a=>a.noms));
  return(<>
    <InfoBox color={"#fbbf24"}>
      Grammy data is approximate — counts shift as categories merge/rename. Drake's 2022 voluntary withdrawal makes direct comparisons to Kendrick's trajectory uneven. Read as directional, not exact.
    </InfoBox>

    <SLabel>Grammy Wins vs Nominations — Hip-Hop Era</SLabel>
    <div style={{overflowX:"auto",marginBottom:20}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5,minWidth:600}}>
        <thead><tr>
          {["Artist","Wins","Nominations","Win Rate","Wins Bar","Outsider Persona","Withdrew"].map((h,i)=>(
            <th key={h} style={{fontSize:8,letterSpacing:2,textTransform:"uppercase",color:C.goldDim,textAlign:i>1?"center":"left",padding:"8px 10px",borderBottom:`1px solid ${C.border}`}}>{h}</th>
          ))}
        </tr></thead>
        <tbody>{GRAMMY_DATA.sort((a,b)=>b.wins-a.wins).map(a=>(
          <tr key={a.key} style={{borderBottom:"1px solid #141414"}}>
            <td style={{padding:"9px 10px",fontStyle:"italic",color:a.color}}>{a.name}</td>
            <td style={{padding:"9px 10px",textAlign:"center",fontSize:15,color:a.color,fontStyle:"italic"}}>{a.wins}</td>
            <td style={{padding:"9px 10px",textAlign:"center",color:"#666"}}>{a.noms}</td>
            <td style={{padding:"9px 10px",textAlign:"center",color:a.wins/a.noms>0.25?C.green:a.wins/a.noms>0.12?"#facc15":C.red}}>{(a.wins/a.noms*100).toFixed(0)}%</td>
            <td style={{padding:"9px 14px",minWidth:120}}>
              <div style={{position:"relative",height:8,background:"#1a1a1a",borderRadius:4}}>
                <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${(a.wins/maxWins)*100}%`,background:a.color,borderRadius:4,opacity:0.8}}/>
                <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${(a.noms/maxNoms)*100}%`,background:`${a.color}30`,borderRadius:4}}/>
              </div>
            </td>
            <td style={{padding:"9px 10px",textAlign:"center",fontSize:11,color:a.outsider?C.red:"#555"}}>{a.outsider?"Industry outsider":"—"}</td>
            <td style={{padding:"9px 10px",textAlign:"center",fontSize:11,color:a.withdrew?C.orange:"#555"}}>{a.withdrew?"Yes":"—"}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>

    <SLabel>Not Like Us — 2025 Grammy Sweep</SLabel>
    <div style={{marginBottom:20}}>
      {NLU_GRAMMYS.map((g,i)=>(
        <div key={i} style={{background:C.card,border:`1px solid ${g.won?"#fbbf2444":C.border}`,borderLeft:`3px solid ${g.won?"#fbbf24":"#333"}`,borderRadius:3,padding:"11px 14px",marginBottom:7,display:"flex",alignItems:"center",gap:12}}>
          <div style={{fontSize:18,flexShrink:0}}>{g.won?"🏆":"—"}</div>
          <div>
            <div style={{fontSize:12.5,color:g.won?"#f0d060":"#666",fontStyle:"italic",marginBottom:2}}>{g.cat}</div>
            {g.note&&<div style={{fontSize:10,color:"#4a3a20"}}>{g.note}</div>}
          </div>
        </div>
      ))}
      <div style={{background:"#0f0f0f",border:`1px solid ${C.red}22`,borderRadius:3,padding:"14px 16px",marginTop:12}}>
        <div style={{fontSize:9,color:C.red,letterSpacing:3,textTransform:"uppercase",marginBottom:8}}>The Institutional Irony</div>
        <div style={{fontSize:11.5,color:"#6a5a40",lineHeight:1.9}}>
          The Recording Academy awarded Record of the Year and Song of the Year to a track built around the hook "certified pedophile" — the same allegation Drake's defamation lawsuit was dismissed for being legally non-factual. The courts said no reasonable person would believe it as a statement of fact. The Grammys said it was the best song of 2024. The industry simultaneously disclaimed responsibility for the content and gave it every prize available.
        </div>
      </div>
    </div>

    <SLabel>The Super Bowl — Feb 9, 2025</SLabel>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:3,padding:"16px 18px",marginBottom:20}}>
      <div style={{fontSize:11,color:"#6a5a40",lineHeight:1.9}}>
        The Super Bowl LIX halftime show (133.5M viewers, Feb 9, 2025 — seven days after Drake's lawsuits were dismissed) is covered in full in the <span style={{color:C.gold,fontStyle:"italic"}}>NLU ◆ Conspiracy</span> tab under "The Super Bowl" and "The Preparation Pattern" — Trump attendance, lawsuit on appeal, the 'A minor' singalong, booking timeline all covered there. This tab focuses on Grammy data specifically.
      </div>
    </div>

    <SLabel>Luther (ft. SZA) — The Victory Lap Single</SLabel>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:8,marginBottom:12}}>
      {[
        {label:"First-Week Streams",value:fmt(LUTHER_DATA.fwStreams),color:C.purple,note:"Largest single-week debut of Kendrick's career"},
        {label:"Total Streams",     value:fmt(LUTHER_DATA.totalStreams),color:C.purple,note:"As of data cutoff"},
        {label:"Hot 100 Peak",      value:`#${LUTHER_DATA.hot100Peak}`,color:C.gold,note:""},
        {label:"Weeks at #1",       value:`${LUTHER_DATA.weeksAt1} weeks`,color:C.green,note:"Consecutive"},
        {label:"Album",             value:"GNX",                       color:"#9ca3af",note:"Nov 22, 2024 surprise drop"},
      ].map(({label,value,color,note})=>(
        <div key={label} style={{background:C.card,border:`1px solid ${color}22`,borderLeft:`2px solid ${color}`,borderRadius:3,padding:"9px 11px"}}>
          <div style={{fontSize:7.5,color:"#333",letterSpacing:2,textTransform:"uppercase",marginBottom:3}}>{label}</div>
          <div style={{fontSize:14,color,fontStyle:"italic",marginBottom:2}}>{value}</div>
          {note&&<div style={{fontSize:8.5,color:"#3a3030"}}>{note}</div>}
        </div>
      ))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
      <div style={{background:C.card,border:`1px solid ${C.purple}22`,borderRadius:3,padding:"14px 16px"}}>
        <div style={{fontSize:10,color:C.purple,letterSpacing:1.5,marginBottom:8,textTransform:"uppercase"}}>What Luther Proves (One Reading)</div>
        <div style={{fontSize:11,color:"#5a4a30",lineHeight:1.85}}>Luther's 68M first-week streams — on a non-beef, non-diss, SZA-assisted love song from a surprise album — demonstrates that Kendrick expanded his streaming ceiling as a result of the 2024 moment. Whether that ceiling expansion was earned organically or amplified by machinery, the result is the same: Kendrick's commercial position post-beef is stronger than before it. The beef was good for his numbers in every measurable dimension.</div>
      </div>
      <div style={{background:C.card,border:`1px solid ${C.gold}22`,borderRadius:3,padding:"14px 16px"}}>
        <div style={{fontSize:10,color:C.gold,letterSpacing:1.5,marginBottom:8,textTransform:"uppercase"}}>What Luther Complicates (Other Reading)</div>
        <div style={{fontSize:11,color:"#5a4a30",lineHeight:1.85}}>Luther's streaming numbers are comparable to NLU's first-week figures — but Luther is a smooth crossover R&B-adjacent record with SZA, a proven pop hitmaker. If Luther (with every organic advantage: catchy, accessible, featuring a massive pop star) performs in the same range as a diss track about a specific person, it raises a question: did NLU reach those numbers because of what it was, or because of what was done to amplify it? The comparison isn't dispositive — but it's worth noting.</div>
      </div>
    </div>
    <div style={{background:"#0f0f0f",border:`1px solid #9ca3af22`,borderRadius:3,padding:"14px 16px",marginBottom:20}}>
      <div style={{fontSize:9,color:"#9ca3af",letterSpacing:3,textTransform:"uppercase",marginBottom:8}}>GNX Strategic Timing Note</div>
      <div style={{fontSize:11,color:"#4a3a20",lineHeight:1.85}}>{GNX_DATA.grammarWindowNote} {GNX_DATA.strategicNote}</div>
    </div>

    <SLabel>The Outsider Paradox</SLabel>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:12}}>
      {[
        {color:C.purple,title:"Kendrick's Positioning",body:"Throughout his career — from Section.80's independent spirit to TPAB's institutional critiques — Kendrick has positioned himself as the artist the industry can't fully contain. 'The Heart Part 5' critiques hip-hop's complicity with corporate structures. The narrative is: authentic outsider, resistant to industry machinery.\n\nYet: 17 Grammy wins, Pulitzer Prize (the most establishment literary honor in America), 5 categories swept at a single ceremony with a diss track, and a promotional deal signed days before his biggest cultural volley. The outsider narrative and the institutional darling outcomes exist simultaneously."},
        {color:C.gold,title:"Drake's Positioning",body:"Drake has positioned himself as the opposite: commercially transparent, unapologetically commercial, industry-savvy. He doesn't pretend to be an outsider. He was signed to Young Money, distributed through Cash Money, then Republic/UMG — and he made no bones about it.\n\nYet: 4 Grammy wins from 51 nominations (7.8% rate), public withdrawal from Grammy eligibility, and multiple lawsuits alleging the industry coordinated against him. The commercially integrated artist is claiming the institutional apparatus was weaponized against him by the artist positioned as its critic."},
        {color:"#9ca3af",title:"J. Cole: The Third Data Point",body:"Cole's Grammy record (1 win, 14 nominations) adds a useful reference point. Forest Hills Drive went platinum with zero singles — organic catalog durability at its purest. Cole isn't a Grammy darling. He hasn't boycotted. He simply doesn't get the Grammy treatment Kendrick receives.\n\nIf the Grammy apparatus were simply rewarding 'authentic' or 'critical' hip-hop, Cole — whose critical reputation has always been strong — would have more than 1 win. The distinction between Cole and Kendrick's Grammy treatment suggests the institution is rewarding something more specific than authenticity."},
        {color:C.teal,title:"What the Data Suggests",body:"The Grammy apparatus rewards artists who move the cultural conversation in directions the institution approves of — which is not the same as rewarding outsider authenticity or commercial success. Kendrick's work consistently engages with themes (racial politics, institutional critique, moral complexity) that earn critical establishment approval.\n\nDrake's work — honest about commerce, pleasure, status, heartbreak — doesn't translate well to awards narratives even when it's streaming twice as much. The Grammys aren't measuring music. They're measuring whether the music's themes can be incorporated into the institution's own self-image. The difference isn't about quality — it's about which kind of ambition the institution wants to see itself reflected in."},
      ].map(({color,title,body})=>(
        <div key={title} style={{background:C.card,border:`1px solid ${color}22`,borderTop:`2px solid ${color}`,borderRadius:3,padding:"14px 16px"}}>
          <div style={{fontSize:10,color,letterSpacing:1.5,marginBottom:8,textTransform:"uppercase"}}>{title}</div>
          <div style={{fontSize:11,color:"#5a4a30",lineHeight:1.9,whiteSpace:"pre-line"}}>{body}</div>
        </div>
      ))}
    </div>
  </>);
}

// ── MEDIA LENS TAB ───────────────────────────────────────────────
function MediaLensTab(){
  const drakeScores=PITCHFORK_SCORES.filter(s=>s.artist==="Drake");
  const kendrickScores=PITCHFORK_SCORES.filter(s=>s.artist==="Kendrick");
  const W=560,H=180,pad={t:14,r:14,b:30,l:36};
  const w=W-pad.l-pad.r,h=H-pad.t-pad.b;
  const allYears=PITCHFORK_SCORES.map(s=>s.year);
  const xMn=Math.min(...allYears)-1,xMx=Math.max(...allYears)+1;
  const sx=x=>pad.l+((x-xMn)/(xMx-xMn))*w,sy=y=>pad.t+(1-(y-5)/(10-5))*h;

  return(<>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:3,padding:"18px 20px",marginBottom:20}}>
      <div style={{fontSize:10,color:C.goldDim,letterSpacing:3,textTransform:"uppercase",marginBottom:12}}>On Critical Institutions</div>
      <div style={{fontSize:12,color:"#8a7a60",lineHeight:2,fontStyle:"italic",borderLeft:`3px solid ${C.border}`,paddingLeft:16}}>
        "Their cultural takes have always been classically hipster, in that they're not brave enough to be anything but cynical if given the chance. Their reviews aren't about the music — it's about a nebulously defined, abstract sub-layer that they attach to the music. A string of assumptions stitched together by a non-sequitur thesis, verging on sophistry, and with the exact same effect as disinformation. What they excel at is PR, the lie that they're in a vaunted position of intellectual authority. And all of their assessments of albums are an extension of this PR — not actually attempts to engage with the music on its level, but rather a rating of how any particular album fits in with or against its own mythology as an institution."
      </div>
      <div style={{fontSize:9,color:"#3a3a3a",marginTop:10,letterSpacing:2}}>SOURCE: REDDIT THREAD ON PITCHFORK CRITICISM — ADAPTED</div>
      <div style={{fontSize:11,color:"#5a4030",marginTop:12,lineHeight:1.85,borderTop:"1px solid #1a1a1a",paddingTop:12}}>
        That phrase — <em>the exact same effect as disinformation</em> — is the connective tissue between this tab and the NLU Conspiracy tab. Disinformation doesn't require the person spreading it to believe a literal falsehood. It works by manufacturing a feeling — a social verdict — that operates independently of whether any underlying claim is true. The court ruling that "no reasonable person" would take NLU's allegations as literal fact is, functionally, the legal definition of that same mechanism: content designed to produce an effect rather than convey a truth. The critical apparatus reviewed the song as art. The Grammy apparatus rewarded it as achievement. The legal apparatus dismissed it as non-factual. All three institutions processed the same object and none of them had to reckon with the fact that it had already done its damage.
      </div>
    </div>

    <SLabel>Pitchfork Score Trajectories — Drake vs Kendrick</SLabel>
    <div style={{overflowX:"auto",marginBottom:6}}>
      <svg width={W} height={H} style={{minWidth:W,background:"#0d0d0d",borderRadius:3}}>
        {[6,7,8,9,10].map(v=>(<g key={v}><line x1={pad.l} x2={pad.l+w} y1={sy(v)} y2={sy(v)} stroke="#161616"/><text x={pad.l-5} y={sy(v)+4} textAnchor="end" fill="#222" fontSize={9}>{v}</text></g>))}
        {[2011,2013,2015,2017,2019,2021,2023].map(y=>(<text key={y} x={sx(y)} y={H-8} textAnchor="middle" fill="#222" fontSize={8}>{y}</text>))}
        <polyline fill="none" stroke={C.gold} strokeWidth={1.5} opacity={0.6} points={drakeScores.map(s=>`${sx(s.year)},${sy(s.score)}`).join(" ")}/>
        <polyline fill="none" stroke={C.purple} strokeWidth={1.5} opacity={0.6} points={kendrickScores.map(s=>`${sx(s.year)},${sy(s.score)}`).join(" ")}/>
        {drakeScores.map(s=>(<g key={s.album}><circle cx={sx(s.year)} cy={sy(s.score)} r={s.bnm?6:4} fill={C.gold} opacity={0.9} stroke={s.bnm?"#000":"none"} strokeWidth={1}/><text x={sx(s.year)} y={sy(s.score)-9} textAnchor="middle" fill="#4a4020" fontSize={7}>{s.album.split(" ")[0]}</text></g>))}
        {kendrickScores.map(s=>(<g key={s.album}><circle cx={sx(s.year)} cy={sy(s.score)} r={s.bnm?6:4} fill={C.purple} opacity={0.9} stroke={s.bnm?"#000":"none"} strokeWidth={1}/><text x={sx(s.year)} y={sy(s.score)-9} textAnchor="middle" fill="#5a3a7a" fontSize={7}>{s.album.split(" ")[0]}</text></g>))}
      </svg>
    </div>
    <div style={{display:"flex",gap:16,marginBottom:20}}>
      {[{c:C.gold,l:"Drake (filled dot = BNM)"},{c:C.purple,l:"Kendrick (filled dot = BNM)"},{c:"#888",l:"BNM = Best New Music"}].map(({c,l})=>(<div key={l} style={{display:"flex",alignItems:"center",gap:6,fontSize:9.5,color:"#444"}}><div style={{width:8,height:8,borderRadius:"50%",background:c}}/>{l}</div>))}
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:12,marginBottom:20}}>
      {[
        {color:C.gold,title:"Drake's Score Trajectory",body:`Take Care peaked at 9.2 in 2011 — one of Pitchfork's highest scores of that year. By 2018 (Scorpion), he was in the 6.5 range, which they've maintained ever since regardless of commercial performance. The score decline accelerates exactly as his commercial dominance peaks. Views sold more than any album in his discography and received a 7.2. The critics and the charts are grading in opposite directions with increasing intensity over time.`},
        {color:C.purple,title:"Kendrick's Score Floor",body:`Kendrick has never dropped below 8.7 on Pitchfork. Every album is Best New Music. TPAB at 9.8 is among the highest scores Pitchfork has ever given any album in any genre. The consistency is remarkable — but it also raises the question the Reddit post identifies: at what point does a score represent genuine engagement with the music vs. an institutional commitment to a pre-existing narrative about an artist?`},
        {color:C.red,title:"The Beef Coverage Pattern",body:`When Euphoria dropped on April 22, 2024, major media outlets had laudatory coverage published within hours. Pitchfork, Complex, Rolling Stone, and XXL all rushed takes praising it as an instant classic before any analytical distance was possible. This is the pattern the Reddit post describes as 'pre-briefed press' behavior — coverage that reads less like criticism and more like a coordinated rollout. Drake's responses received coverage framed around failure before they'd been properly heard.`},
        {color:C.teal,title:"The Ten-Year Test",body:`The Reddit post ends: 'Come another decade they'll look embarrassing but for different reasons.' Apply this to Drake/Kendrick coverage in 2024: will the unanimous media crown on Kendrick look like genuine criticism or like an institution that picked a side and amplified it? Will Drake's lawsuit claims look paranoid or prophetic? The stream data doesn't care about the narrative. It keeps counting. Whatever the media said in 2024, the catalog scores will render a verdict in 2034 that no one can manipulate.`},
      ].map(({color,title,body})=>(
        <div key={title} style={{background:C.card,border:`1px solid ${color}22`,borderLeft:`3px solid ${color}`,borderRadius:3,padding:"14px 16px"}}>
          <div style={{fontSize:10,color,letterSpacing:1.5,marginBottom:8,textTransform:"uppercase"}}>{title}</div>
          <div style={{fontSize:11,color:"#5a4a30",lineHeight:1.9}}>{body}</div>
        </div>
      ))}
    </div>

    <SLabel>The Pattern — How Critical Consensus Gets Made</SLabel>
    {[
      {step:"01",color:C.purple,label:"Pre-Selection",desc:"The critical establishment decides which artists are in the 'serious' tier before a given release cycle. Kendrick has been in that tier since 2012. Drake exited it around 2016. This pre-selection happens through accumulated coverage, festival bookings, year-end lists, and social positioning among critics — not through actual listening to new music."},
      {step:"02",color:C.orange,label:"Confirmation Bias on Drop Day",desc:"When a pre-selected artist releases new music, criticism functions as confirmation of the pre-existing narrative. Euphoria was praised instantly not because 6 minutes of dense lyrics can be properly absorbed in 2 hours, but because it arrived pre-labeled as important. The praise was an institutional signal, not a listening experience."},
      {step:"03",color:C.red,label:"Counter-Narrative Suppression",desc:"Drake's responses were covered through a frame that had already decided the outcome. Family Matters wasn't engaged with on its merits — it was contextually buried (same-night drops) and critically buried (coverage immediately pivoting to NLU and MtG). The asymmetry in coverage volume between the two sides is measurable and consistent."},
      {step:"04",color:"#fbbf24",label:"Institutionalization via Awards",desc:"The Grammy sweep completed the cycle: a critical consensus became institutional record. Whatever doubts might have existed are now settled by the trophy. 'Not Like Us won Record of the Year' becomes the sentence that ends debates — even though the Recording Academy is making the same pre-selection decision the critics made, just with more ceremony."},
      {step:"05",color:"#9ca3af",label:"The Revision That Will Come",desc:"The Reddit post identified Pitchfork's pattern of ideological course-correction — scrubbing 'problematic' reviews, switching reviewers, revising stances. The same will happen with this moment. Not because Drake will be vindicated, but because every critical consensus gets complicated by time. The question is what the stream data looks like when the narrative fog clears."},
    ].map(({step,color,label,desc})=>(
      <div key={step} style={{display:"flex",gap:14,marginBottom:10,alignItems:"flex-start"}}>
        <div style={{fontSize:18,color:`${color}60`,fontStyle:"italic",minWidth:30,textAlign:"right",flexShrink:0,paddingTop:2}}>{step}</div>
        <div style={{background:C.card,border:`1px solid ${color}22`,borderLeft:`2px solid ${color}`,borderRadius:3,padding:"12px 15px",flex:1}}>
          <div style={{fontSize:10.5,color,letterSpacing:1,marginBottom:6,textTransform:"uppercase"}}>{label}</div>
          <div style={{fontSize:11.5,color:"#5a4a30",lineHeight:1.85}}>{desc}</div>
        </div>
      </div>
    ))}
  </>);
}

// ── APP ───────────────────────────────────────────────────────────
export default function App(){
  const [tab,setTab]=useState("premise");
  const [norm,setNorm]=useState(30);
  const [alpha,setAlpha]=useState(0.5);
  const [streamOnly,setStreamOnly]=useState(false);
  const [eraFilter,setEraFilter]=useState("all");
  const [peerKeys,setPeerKeys]=useState(["kendrick","cole"]);
  const [showNonStudio,setShowNonStudio]=useState(false);
  const [combineHnHl,setCombineHnHl]=useState(false);
  const [sortKey,setSortKey]=useState("release");
  const [sortDir,setSortDir]=useState(1);

  const activeSource=useMemo(()=>{
    let albums=[...DRAKE_RAW];
    if(combineHnHl){albums=albums.filter(a=>a.id!=="hn"&&a.id!=="hl");albums.push(HN_HL_COMBINED);}
    if(!showNonStudio) albums=albums.filter(a=>a.type==="studio"||a.combined);
    else albums=albums.filter(a=>!a.legacy); // legacy pre-streaming mixtapes handled separately
    return albums;
  },[combineHnHl,showNonStudio]);

  const drake=useMemo(()=>activeSource.map(a=>compute(a,norm,alpha)),[activeSource,norm,alpha]);
  const ranked=useMemo(()=>{
    let r=drake.filter(a=>!a.extrapolated);
    if(streamOnly) r=r.filter(a=>!a.preStream);
    if(eraFilter!=="all") r=r.filter(a=>a.era===eraFilter);
    return [...r].sort((a,b)=>a.adjFWPct-b.adjFWPct);
  },[drake,streamOnly,eraFilter]);
  const flagged=useMemo(()=>drake.filter(a=>a.extrapolated),[drake]);
  const peerComputed=useMemo(()=>{
    const out={};Object.entries(PEERS).forEach(([k,art])=>{out[k]=art.albums.map(a=>compute(a,norm,alpha));});return out;
  },[norm,alpha]);
  const radarArtists=useMemo(()=>{
    function score(albums){
      const v=albums.filter(a=>!a.extrapolated);if(!v.length)return[50,50,50,50,50];
      const allFW=[...drake,...Object.values(peerComputed).flat()].map(a=>a.fw).filter(f=>f>0);
      const maxFW=Math.max(...allFW,1);
      const avgFW=mean(v.map(a=>a.fw));
      // Log-normalize opening power so the 20x range between Carti (91K) and Eminem (1.76M) renders meaningfully
      const openPower=Math.min(100,Math.log10(avgFW+1)/Math.log10(maxFW+1)*100);
      return[
        openPower,
        Math.min(100,(1-mean(v.map(a=>a.adjFWPct)))*100),
        Math.min(100,mean(v.filter(a=>a.meta).map(a=>a.meta))||65),
        Math.min(100,Math.max(0,100-stdev(v.map(a=>a.adjFWPct))*300)),
        Math.min(100,mean(v.map(a=>a.total))/1e7*100),
      ];
    }
    const list=[{name:"Drake",color:C.gold,scores:score(drake)}];
    peerKeys.forEach(k=>{if(peerComputed[k])list.push({name:PEERS[k].name,color:PEERS[k].color,scores:score(peerComputed[k])});});
    return list;
  },[drake,peerComputed,peerKeys]);

  const TABS=[
    ["premise","Premise"],["rankings","Rankings"],["insights","Insights"],["quadrant","Quadrant"],
    ["beef","Beef Lens"],["iceman","Iceman ◇"],["arc","Career Arc"],
    ["peers","Peers"],["legitimacy","NLU ◆ Conspiracy"],["awards","Awards Gap"],
    ["media","Media Lens"],["conclusions","Conclusions"],["data","Data"],
  ];

  return(
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"Georgia,'Times New Roman',serif",color:"#e8d9a0",paddingBottom:80}}>
      <div style={{background:"linear-gradient(180deg,#1c1400 0%,#0a0a0a 100%)",borderBottom:`1px solid ${C.border}`,padding:"22px 20px 16px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(255,215,0,0.025) 1px,transparent 1px)",backgroundSize:"30px 30px",pointerEvents:"none"}}/>
        <div style={{position:"relative"}}>
          <div style={{fontSize:10,letterSpacing:7,color:C.goldDim,textTransform:"uppercase",marginBottom:6}}>◆ OVO Analytics ◆</div>
          <h1 style={{fontSize:"clamp(17px,4vw,28px)",fontWeight:"normal",color:C.gold,margin:"0 0 4px",letterSpacing:2}}>The Legacy Observatory</h1>
          <div style={{fontSize:9,color:"#444",letterSpacing:3,textTransform:"uppercase",marginBottom:6}}>Drake · Kendrick · Cole · Kanye · Legends · Modern Era · Data as of Sept 5, 2025</div>
          <div style={{fontSize:10,color:C.goldDim,fontStyle:"italic",opacity:0.6}}>"The data doesn't lie, even when the narrative does."</div>
        </div>
      </div>
      {tab==="iceman"&&(
        <div style={{background:"#0d0d0d",borderBottom:"1px solid #1a1a1a",padding:"6px 18px",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <div style={{width:5,height:5,borderRadius:"50%",background:"#3a3a3a",flexShrink:0}}/>
          <span style={{fontSize:8,color:"#3a3a3a",letterSpacing:2,textTransform:"uppercase"}}>Model controls below are inactive on the Iceman tab — Iceman uses fixed internal settings independent of window and decay</span>
        </div>
      )}
      <div style={{background:"#0d0d0d",borderBottom:`1px solid ${C.border}`,opacity:tab==="iceman"?0.25:1,pointerEvents:tab==="iceman"?"none":"auto"}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,alignItems:"center",padding:"10px 18px 0",justifyContent:"center"}}>
          <span style={{fontSize:8,letterSpacing:3,color:"#3a3a3a",textTransform:"uppercase",marginRight:4,flexShrink:0}}>Presets:</span>
          {[
            {label:"Default",      sub:"balanced baseline",            n:30,a:0.5,color:C.gold},
            {label:"Legacy Test",  sub:"long window · slow decay",     n:48,a:0.3,color:C.green},
            {label:"Recent Pulse", sub:"short window · steep decay",   n:18,a:0.7,color:C.blue},
            {label:"Deep Catalog", sub:"long window · gentlest decay", n:42,a:0.3,color:C.purple},
          ].map(({label,sub,n,a,color})=>{
            const active=norm===n&&alpha===a;
            return(
              <button key={label} onClick={()=>{setNorm(n);setAlpha(a);}} style={{padding:"5px 13px",border:`1px solid ${active?color:"#2a2a2a"}`,background:active?`${color}15`:"transparent",color:active?color:"#555",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:9,borderRadius:2,outline:"none",transition:"all 0.15s",textAlign:"center",lineHeight:1.4}}>
                <div style={{letterSpacing:1}}>{label}</div>
                <div style={{fontSize:7.5,opacity:0.7,letterSpacing:0.5}}>{sub}</div>
              </button>
            );
          })}
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:20,alignItems:"center",justifyContent:"center",padding:"10px 18px 12px"}}>
          <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"center"}}>
            <span style={{fontSize:8,letterSpacing:3,color:C.goldDim,textTransform:"uppercase"}}>Window: <span style={{color:C.gold}}>{norm} months</span></span>
            <input type="range" min={18} max={48} value={norm} onChange={e=>setNorm(+e.target.value)} style={{accentColor:C.gold,width:150,cursor:"pointer"}}/>
            <div style={{fontSize:7.5,color:"#2a2a2a",display:"flex",justifyContent:"space-between",width:150}}><span>18mo</span><span>48mo</span></div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"center"}}>
            <span style={{fontSize:8,letterSpacing:3,color:C.goldDim,textTransform:"uppercase"}}>Decay (α)</span>
            <div style={{display:"flex",gap:5}}>
              {[[0.3,"gentle"],[0.5,"balanced"],[0.7,"steep"]].map(([a,lbl])=>(<Pill key={a} active={alpha===a} onClick={()=>setAlpha(a)}>{a} — {lbl}</Pill>))}
            </div>
          </div>
        </div>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",borderBottom:`1px solid ${C.border}`,background:C.bg}}>
        {TABS.map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{padding:"11px 14px",cursor:"pointer",fontSize:9,letterSpacing:2,textTransform:"uppercase",color:tab===id?C.gold:"#3a3a3a",background:"none",fontFamily:"Georgia,serif",flexShrink:0,outline:"none",border:"none",borderBottom:`2px solid ${tab===id?C.gold:"transparent"}`,transition:"color 0.15s"}}>{label}</button>
        ))}
      </div>
      <div style={{maxWidth:920,margin:"0 auto",padding:"22px 14px"}}>
        {tab==="premise"    &&<PremiseTab/>}
        {tab==="rankings"   &&<RankingsTab ranked={ranked} flagged={flagged} drake={drake} norm={norm} alpha={alpha} streamOnly={streamOnly} setStreamOnly={setStreamOnly} eraFilter={eraFilter} setEraFilter={setEraFilter} showNonStudio={showNonStudio} setShowNonStudio={setShowNonStudio} combineHnHl={combineHnHl} setCombineHnHl={setCombineHnHl}/>}
        {tab==="insights"   &&<InsightsTab drake={drake}/>}
        {tab==="quadrant"   &&<QuadrantTab drake={drake} peerComputed={peerComputed} peerKeys={peerKeys}/>}
        {tab==="beef"       &&<BeefLensTab drake={drake}/>}
        {tab==="iceman"     &&<IcemanTab drake={drake} norm={norm} alpha={alpha}/>}
        {tab==="arc"        &&<CareerArcTab drake={drake}/>}
        {tab==="peers"      &&<PeersTab drake={drake} peerComputed={peerComputed} peerKeys={peerKeys} setPeerKeys={setPeerKeys} radarArtists={radarArtists}/>}
        {tab==="legitimacy" &&<LegitimacyTab/>}
        {tab==="awards"     &&<AwardsTab/>}
        {tab==="media"      &&<MediaLensTab/>}
        {tab==="conclusions" &&<ConclusionsTab/>}
        {tab==="data"       &&<DataTab drake={drake} sortKey={sortKey} setSortKey={setSortKey} sortDir={sortDir} setSortDir={setSortDir}/>}
      </div>
    </div>
  );
}
