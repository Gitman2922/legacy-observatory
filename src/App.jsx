import { useState, useMemo, useCallback } from "react";
import React from "react";

const C = {
  gold:"#FFD700",goldDim:"#b8960c",bg:"#0a0a0a",card:"#111111",
  border:"rgba(255,215,0,0.18)",borderHi:"rgba(255,215,0,0.32)",
  green:"#4caf88",purple:"#c084fc",blue:"#60a5fa",orange:"#f97316",
  red:"#f87171",teal:"#2dd4bf",pink:"#f472b6",
};

const CUTOFF = new Date("2025-09-05");

const DRAKE_RAW = [
  {id:"rfi",    title:"Room for Improvement",  release:"2006-02-14",fw:0,total:0,collab:null,meta:null,tracks:22,preStream:true,era:"young-money",surprise:false,beefContext:null,type:"mixtape",legacy:true},
  {id:"cs",     title:"Comeback Season",        release:"2007-09-18",fw:0,total:0,collab:null,meta:null,tracks:21,preStream:true,era:"young-money",surprise:false,beefContext:null,type:"mixtape",legacy:true},
  {id:"sfg",    title:"So Far Gone",            release:"2009-02-13",fw:0,total:0,collab:null,meta:null,tracks:18,preStream:true,era:"young-money",surprise:false,beefContext:null,type:"mixtape",legacy:true},
  {id:"tml",    title:"Thank Me Later",           release:"2010-06-15",fw:447000, total:6050000, collab:null,            meta:75, tracks:14,preStream:true, era:"young-money",surprise:false,beefContext:null,           type:"studio"},
  {id:"tc",     title:"Take Care",                release:"2011-11-15",fw:631000, total:11400000,collab:null,            meta:78, tracks:16,preStream:true, era:"young-money",surprise:false,beefContext:null,           type:"studio"},
  {id:"nwts",   title:"Nothing Was the Same",     release:"2013-09-24",fw:658000, total:8080000, collab:null,            meta:79, tracks:13,preStream:true, era:"young-money",surprise:false,beefContext:null,           type:"studio"},
  {id:"iyrtitl",title:"If You're Reading This",   release:"2015-02-13",fw:535000, total:5390000, collab:null,            meta:78, tracks:17,preStream:false,era:"peak",       surprise:true, beefContext:null,           type:"studio"},
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

const BEEF_TIMELINE = [
  {date:"Nov 2023",     event:"FATD Scary Hours Edition",actor:"Drake",   type:"event",   verdict:"cultural", desc:"Four months before 'Like That' publicly launched the beef, Drake released the FATD Scary Hours deluxe. The energy was conspicuously combative. Drake's lawsuit alleges UMG had knowledge of the deteriorating contract situation during this period."},
  {date:"Mar 22, 2024", event:"Like That",              actor:"Kendrick",type:"shot",    verdict:"opening", desc:"Verse on Future/Metro Boomin track. 'Fuck the Big 3' — public shot directed at Drake and J. Cole. Cole initially responds with '7 Minute Drill', then apologizes and exits."},
  {date:"Apr 19, 2024", event:"Push Ups",               actor:"Drake",   type:"response",verdict:"neutral", desc:"Drake's first official response. Mocks height, fashion, label situation, OVO signings. Generally seen as mid-tier by press."},
  {date:"Apr 19, 2024", event:"Taylor Made Freestyle",  actor:"Drake",   type:"response",verdict:"loss",    desc:"Released same day as Push Ups. Used AI-generated Tupac and Snoop vocals. Tupac's estate sent cease & desist. Widely mocked."},
  {date:"Apr 27, 2024", event:"Kendrick Signs New Interscope Deal",actor:"Industry",type:"event", desc:"Per legal filings, an additional contract agreement between Interscope Records and Kendrick Lamar was executed on April 27, 2024 — three days before Euphoria dropped."},
  {date:"Apr 30, 2024", event:"Euphoria",               actor:"Kendrick",type:"shot",    verdict:"win",     desc:"6+ minute diss. Released April 30. Ghostwriting, height, family, 'not a rap god.' Media reception: unanimous immediate praise from Complex, Rolling Stone, Pitchfork, XXL — within hours of drop."},
  {date:"May 3, 2024",  event:"6:16 in LA",             actor:"Kendrick",type:"shot",    verdict:"win",     desc:"Dropped May 3, exclusively on Instagram. Alleges Drake has an informant inside OVO Sound leaking to Kendrick."},
  {date:"May 3, 2024",  event:"Family Matters",         actor:"Drake",   type:"response",verdict:"buried",  desc:"Drake's 12-minute major response. Within 20 minutes, Kendrick dropped Meet the Grahams. Family Matters was buried in the same news cycle it tried to dominate."},
  {date:"May 3, 2024",  event:"Meet the Grahams",       actor:"Kendrick",type:"shot",    verdict:"win",     desc:"Dropped ~20 minutes after Family Matters. Addressed to Drake's parents. Secret daughter allegations, sex trafficking claims, letter format."},
  {date:"May 4, 2024",  event:"Not Like Us",            actor:"Kendrick",type:"shot",    verdict:"cultural",desc:"'Certified pedophile' hook. Released May 4. 71M first-week streams. Became the anthem of 2024."},
  {date:"May 5, 2024",  event:"The Heart Part 6",       actor:"Drake",   type:"response",verdict:"loss",    desc:"Drake's final response in the active beef. Widely seen as defensive. Drake mostly goes silent after this."},
  {date:"Jun 19, 2024", event:"The Pop Out — Kia Forum",actor:"Kendrick",type:"event",   verdict:"cultural",desc:"Juneteenth concert. NLU performed multiple times, including 5 times to close the show. Streamed live on Amazon Music."},
  {date:"Jul 4, 2024",  event:"NLU Music Video",        actor:"Kendrick",type:"event",   verdict:"cultural",desc:"Official video released July 4. Aerial Compton shots, OVO owl imagery used as targets. Grammy campaign begins in earnest."},
  {date:"Nov 22, 2024", event:"GNX (surprise drop)",    actor:"Kendrick",type:"event",   verdict:"cultural",desc:"Surprise album drop. 'Luther' ft. SZA becomes a crossover smash. The musical victory lap."},
  {date:"Nov 25, 2024", event:"Drake Files Pre-Action Petitions",actor:"Drake",type:"legal",verdict:"filed",desc:"Drake files pre-action petitions in New York (vs UMG + Spotify) and Texas (vs UMG + iHeart). Alleges artificial stream inflation and payola."},
  {date:"Jan 15, 2025", event:"Full Defamation Lawsuit Filed",actor:"Drake",type:"legal",verdict:"filed",  desc:"Drake files full federal defamation lawsuit against UMG in the Southern District of New York."},
  {date:"Feb 2, 2025",  event:"NLU Wins 5 Grammys",    actor:"Industry",type:"awards",  verdict:"awarded", desc:"Record of the Year · Song of the Year · Best Rap Song · Best Rap Performance · Best Music Video."},
  {date:"Feb 9, 2025",  event:"Super Bowl LIX Halftime — 133M Viewers",actor:"Industry",type:"event",verdict:"cultural",desc:"Kendrick performs the Super Bowl LIX halftime show — 133.5M viewers. He performs NLU, references the lawsuit mid-show."},
  {date:"Mar 2025",     event:"Drake Settles with iHeartMedia",actor:"Drake",type:"legal",verdict:"dismissed",desc:"Drake and iHeartMedia reach a private settlement. Terms undisclosed. UMG defamation lawsuit remains active."},
  {date:"Oct 9, 2025",  event:"UMG Defamation Suit Dismissed",actor:"Drake",type:"legal",verdict:"dismissed",desc:"Federal Judge dismisses Drake's defamation lawsuit at the pleading stage. 'Not Like Us' constitutes hyperbolic artistic expression. No discovery was permitted."},
  {date:"Jan 2026",     event:"Drake Files Appeal",     actor:"Drake",   type:"legal",   verdict:"filed",   desc:"Drake files notice of appeal. The appeal is ongoing as of March 2026."},
];

const OPTICS_ITEMS = [
  {flag:true,  label:"Red Flag",  item:"Both artists were UMG-distributed at key moments",                      note:"Drake on Republic/UMG. Kendrick's pgLang distributed through Amazon but TDE historically through Interscope/UMG. UMG had financial interest in both."},
  {flag:true,  label:"Red Flag",  item:"Euphoria received unanimous critical acclaim within hours",              note:"A 6-minute diss track received Best New Music-tier praise from every major outlet before any serious analysis could occur."},
  {flag:true,  label:"Red Flag",  item:"NLU won Grammys for allegations courts ruled legally non-factual",     note:"Grammys awarded Song/Record of the Year to a song built on the hook 'certified pedophile' — the same claims courts found no reasonable person would believe as literal fact."},
  {flag:true,  label:"Red Flag",  item:"Super Bowl platform awarded 7 days after lawsuit dismissal",           note:"Feb 2: suits dismissed. Feb 9: Kendrick performs NLU in front of 133M people at the Super Bowl."},
  {flag:true,  label:"Red Flag",  item:"Drake's response tracks received drastically less playlist placement", note:"Per Drake's lawsuit: Family Matters and Push Ups received a fraction of the editorial playlist adds that NLU received."},
  {flag:true,  label:"Red Flag",  item:"Kendrick signed a new Interscope deal 3 days before Euphoria dropped",note:"Per legal filings, a new contract between Interscope and Kendrick was executed April 27, 2024 — three days before Euphoria dropped."},
  {flag:true,  label:"Red Flag",  item:"Family Matters news cycle buried within hours by simultaneous drops",  note:"Kendrick having two finished, mastered, mixed tracks ready to release the same night Drake dropped his biggest response is not spontaneous."},
  {flag:false, label:"Context",   item:"Kendrick has been a critical darling since 2012, pre-dating the beef", note:"The media alignment with Kendrick isn't new. GKMC, TPAB, DAMN. all received superlative reviews before any beef existed."},
  {flag:false, label:"Context",   item:"Drake withdrew from Grammy eligibility himself in 2022",               note:"He publicly called the Grammys 'no longer meaningful' and withdrew CLB from consideration."},
  {flag:false, label:"Context",   item:"NLU connected with real audiences, not just industry machinery",       note:"The song moved people. Concert crowds were chanting it before any Grammy validation."},
  {flag:false, label:"Context",   item:"The Super Bowl booking predated the beef's conclusion",               note:"Halftime show bookings happen 12+ months in advance. The NFL selected Kendrick in late 2023 or early 2024."},
  {flag:null,  label:"Unresolved",item:"Discovery never happened — Drake's data claims were never tested",     note:"The lawsuits were dismissed at the pleading stage. Drake claimed to have stream data that would prove manipulation. That data was never put before a court."},
  {flag:null,  label:"Unresolved",item:"The 'no reasonable person' legal standard and its cultural implications",note:"If the song's allegations weren't literally believable — if they were legally just 'hyperbole' — then the culture celebrated a smear it knew wasn't true."},
  {flag:null,  label:"Unresolved",item:"Podcast and hip-hop media coordination allegations",                  note:"Drake's team has alleged that hip-hop media figures were compensated to amplify the Kendrick narrative. This has not been adjudicated."},
];

const GRAMMY_DATA = [
  {key:"kendrick",name:"Kendrick Lamar",wins:27,noms:66,color:C.purple,    notable:["NLU: 5-category sweep (67th Grammys, 2025)","GNX: Best Rap Album (68th Grammys, 2026)","Pulitzer Prize (2018, first rapper)"],outsider:true,  withdrew:false},
  {key:"drake",   name:"Drake",         wins:5, noms:55,color:C.gold,      notable:["Best Rap Song: Hotline Bling","Best Rap Song: God's Plan","Withdrew from eligibility (2022)"],outsider:false, withdrew:true},
  {key:"cole",    name:"J. Cole",       wins:1, noms:14,color:"#10b981",   notable:["1 win from 14 nominations","Widely seen as undervalued by Grammys"],outsider:true,  withdrew:false},
  {key:"kanye",   name:"Kanye West",    wins:24,noms:76,color:C.teal,      notable:["Most wins: rap/hip-hop era","Lost Album of Year despite historic acclaim"],outsider:false, withdrew:false},
  {key:"jayz",    name:"Jay-Z",         wins:25,noms:89,color:"#818cf8",   notable:["24 wins but 0 Album of the Year","Most nominations in history"],outsider:false, withdrew:false},
  {key:"eminem",  name:"Eminem",        wins:15,noms:47,color:"#6b7280",   notable:["Best Rap Album 9 times (record)","Never won Album of the Year despite nominations"],outsider:false, withdrew:false},
  {key:"wayne",   name:"Lil Wayne",     wins:5, noms:13,color:"#ef4444",   notable:["Tha Carter III: 1.02M opening week","5 Grammy wins across rap categories"],outsider:false, withdrew:false},
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
  title:"Luther",artist:"Kendrick Lamar ft. SZA",album:"GNX",
  fwStreams:68000000,totalStreams:850000000,hot100Peak:1,weeksAt1:11,
};

const GNX_DATA = {
  grammarWindowNote:"Released after the Grammy submission cutoff for the 2025 ceremony. NLU remained the sole Grammy vehicle for 2025. At the 68th Grammys (Feb 1, 2026), GNX won Best Rap Album, Luther won Record of the Year — five more wins.",
  strategicNote:"The drop timing is precise: after the 5-Grammy sweep was locked in, before year-end lists compiled. GNX and NLU occupied separate Grammy years by design.",
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
  if(a.legacy) return {...a,elapsed:getMonths(a.release),catalog:0,projCat:0,adjFWPct:0,extrapolated:false,year:+a.release.slice(0,4),perTrack:null,legacyScore:0,depthRating:0};
  const elapsed=getMonths(a.release);
  const catalog=a.total-a.fw;
  const projCat=catalog*Math.pow(norm/elapsed,alpha);
  const adjFWPct=a.fw/(a.fw+projCat);
  const extrapolated=elapsed<norm;
  const year=+a.release.slice(0,4);
  const perTrack=a.tracks?a.total/a.tracks:null;
  // depthRating: higher = better (inverse of adjFWPct%)
  const depthRating=Math.round((1-adjFWPct)*100);
  const catDepth=(1-adjFWPct)*100;
  const metaNorm=((a.meta||65)/100)*100;
  const catRatio=Math.min(100,(catalog/Math.max(a.fw,1))*5);
  // legacyScore: composite 0-100 (renamed from durability)
  const legacyScore=Math.round(catDepth*0.60+metaNorm*0.25+catRatio*0.15);
  return {...a,elapsed,catalog,projCat,adjFWPct,extrapolated,year,perTrack,depthRating,legacyScore};
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
// legacyScore color (higher = better)
const legacyClr=s=>s>=72?C.green:s>=55?C.gold:s>=40?"#fb923c":C.red;
// depthRating color (higher = better)
const depthClr=s=>s>=72?C.green:s>=55?C.gold:s>=40?"#fb923c":C.red;


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
      {[0,0.5,1].map(t=><line key={t} x1={pad.l} x2={pad.l+w} y1={pad.t+t*h} y2={pad.t+t*h} stroke="#2a2a2a"/>)}
      {reg&&<line x1={sx(xMn)} y1={sy(reg.slope*xMn+reg.intercept)} x2={sx(xMx)} y2={sy(reg.slope*xMx+reg.intercept)} stroke={C.gold} strokeWidth={1.5} strokeDasharray="5,3" opacity={0.5}/>}
      {pts.map((p,i)=><circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={p.r||4.5} fill={p.c||C.gold} opacity={0.88}/>)}
      <line x1={pad.l} x2={pad.l+w} y1={pad.t+h} y2={pad.t+h} stroke="#222"/>
      <line x1={pad.l} x2={pad.l} y1={pad.t} y2={pad.t+h} stroke="#222"/>
      <text x={pad.l+w/2} y={H-4} textAnchor="middle" fill="#666" fontSize={9}>{xLab}</text>
      <text x={11} y={pad.t+h/2} textAnchor="middle" fill="#666" fontSize={9} transform={`rotate(-90,11,${pad.t+h/2})`}>{yLab}</text>
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
  const axes=["Opening\nPower","Depth\nRating","Critics","Consistency","Volume"];
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
          <text key={li} x={tx} y={ty+(li-arr.length/2+0.5)*10} textAnchor="middle" dominantBaseline="middle" fill="#666" fontSize={7.5}>{l}</text>
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
      {label&&<span style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:on?color:"#777"}}>{label}</span>}
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
  return <div style={{padding:"10px 14px",background:"#0f0f0f",border:`1px solid ${color}22`,borderRadius:2,marginBottom:14,fontSize:11,color:"#777",lineHeight:1.7}}>{children}</div>;
}
function LegacyBadge({score}){
  if(!score)return null;
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",background:`${legacyClr(score)}10`,border:`1px solid ${legacyClr(score)}30`,borderRadius:2,padding:"3px 7px",flexShrink:0,minWidth:34}}>
      <span style={{fontSize:13,color:legacyClr(score),fontStyle:"italic",lineHeight:1}}>{score}</span>
      <span style={{fontSize:7,color:"#666",letterSpacing:1}}>LEGACY</span>
    </div>
  );
}
function AlbumCard({a,rank,accent=C.gold,showConf=false,ghost=false}){
  const isTop=rank<3&&!ghost;
  // depthRating: higher is better
  const dr=a.depthRating??Math.round((1-a.adjFWPct)*100);
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
        <div style={{fontSize:9.5,color:"#7a6a50",marginBottom:5}}>
          {a.year} · {fmt(a.total)} total · {fmt(a.fw)} FW · {a.tracks}trk
          {a.meta&&<span style={{color:mcClr(a.meta),marginLeft:6}}>MC:{a.meta}</span>}
        </div>
        <div style={{height:2.5,background:"#1a1a1a",borderRadius:2}}>
          <div style={{height:"100%",width:`${dr}%`,background:`linear-gradient(90deg,${ghost?C.teal:accent},${C.goldDim})`,borderRadius:2,transition:"width 0.4s ease"}}/>
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5,flexShrink:0}}>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:16,color:ghost?C.teal:isTop?C.green:accent,fontStyle:"italic"}}>{dr}<span style={{fontSize:9,color:"#555",marginLeft:2}}>/100</span></div>
          <div style={{fontSize:7.5,color:"#777",letterSpacing:1.5}}>DEPTH RATING ↑ BETTER</div>
        </div>
        <LegacyBadge score={a.legacyScore}/>
      </div>
    </div>
  );
}
function ICard({title,question,children,verdict}){
  return(
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:3,padding:"16px 18px"}}>
      <div style={{fontSize:13,color:C.gold,marginBottom:3,fontStyle:"italic"}}>{title}</div>
      <div style={{fontSize:10,color:"#666",marginBottom:12,borderBottom:`1px solid #1a1a1a`,paddingBottom:10}}>{question}</div>
      <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>{children}</div>
      <div style={{fontSize:11.5,color:"#7a6a50",lineHeight:1.95}}>{verdict}</div>
    </div>
  );
}

// ── PREMISE ──────────────────────────────────────────────────────
function PremiseTab(){
  const tabs=[
    {id:"rankings",   label:"Rankings",        desc:"Drake's full discography ranked by Depth Rating — higher is better. Sort by FW week, total streams, Depth Rating, or Legacy Score."},
    {id:"insights",   label:"Insights",        desc:"Six statistical questions about what actually predicts durability — year of release, critical scores, beef context, track count, surprise drops, and opening week power."},
    {id:"legacy",     label:"Legacy ◆",        desc:"The evolved quadrant and career arc visualizations, plus an AI-powered legacy verdict system. Select any artist, generate a nine-axis analysis grounded in listener data, and continue the conversation with follow-up questions."},
    {id:"beef",       label:"Beef Lens",       desc:"Depth Rating applied to the diss tracks themselves, plus a comparison of how conflict-adjacent albums perform vs quiet-period releases."},
    {id:"iceman",     label:"Iceman ◇",        desc:"Scenario modeler for Drake's next unreleased studio album. Adjust opening week, Metacritic prediction, and track count to see where it would rank."},
    {id:"peers",      label:"Peers",           desc:"Drake's catalog against twelve peers — unified rankings, radar charts, and artist DNA comparisons."},
    {id:"legitimacy", label:"NLU ◆ Conspiracy",desc:"Structured examination of Drake's conspiracy allegations — the full beef timeline, the botting claims, and the philosophical paradox at the heart of the 'no reasonable person' legal ruling."},
    {id:"awards",     label:"Awards Gap",      desc:"Grammy wins vs nominations across the hip-hop era, the NLU five-category sweep, the Super Bowl sequence, and the Luther/GNX victory lap data."},
    {id:"media",      label:"Media Lens",      desc:"Pitchfork score trajectories for Drake vs Kendrick, and a framework for understanding how critical consensus gets manufactured."},
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
          The central metric is the <span style={{color:C.gold}}>Depth Rating</span> (0–100, higher is better): the inverse fraction of an album's total streaming life that came after week one. A score of 92 means 92% of the album's listening life still lay ahead after week one. Albums with high Depth Ratings kept accumulating listens long after release — people discovered them, returned to them, put them in rotation.
        </p>
        <p style={{fontSize:12.5,color:"#7a6a50",lineHeight:2,margin:"0 0 16px"}}>
          The model projects each album's streaming forward over a normalized window (adjustable from 18 to 48 months) using a power-law decay curve. This corrects for the fact that a 2010 album has had 15 years to accumulate streams while a 2024 album has had months.
        </p>
        <p style={{fontSize:12.5,color:"#7a6a50",lineHeight:2,margin:0}}>
          The companion metric is the <span style={{color:C.teal}}>Legacy Score</span> (0–100, higher is better): a composite of Depth Rating (60%), Metacritic score (25%), and catalog-to-opening-week multiple (15%). It rewards albums that hold their replay, earn critical respect, and keep accumulating streams relative to their debut size.
        </p>
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
            <div style={{fontSize:7.5,color:"#555",letterSpacing:2,textTransform:"uppercase",marginBottom:3}}>{label}</div>
            <div style={{fontSize:12,color,fontStyle:"italic"}}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── RANKINGS ─────────────────────────────────────────────────────
function RankingsTab({ranked,flagged,drake,norm,streamOnly,setStreamOnly,eraFilter,setEraFilter,showNonStudio,setShowNonStudio,combineHnHl,setCombineHnHl}){
  const [sortBy,setSortBy]=useState("depth"); // default: depth rating highest first
  const [sortDir,setSortDir]=useState(1);

  const full=drake.filter(a=>!a.extrapolated);
  const bestDepth=useMemo(()=>[...ranked].sort((a,b)=>b.depthRating-a.depthRating)[0],[ranked]);
  const bestLegacy=useMemo(()=>[...ranked].sort((a,b)=>b.legacyScore-a.legacyScore)[0],[ranked]);

  const sorted=useMemo(()=>{
    const base=[...ranked];
    return base.sort((a,b)=>{
      if(sortBy==="depth")  return sortDir*(b.depthRating-a.depthRating);
      if(sortBy==="legacy") return sortDir*(b.legacyScore-a.legacyScore);
      if(sortBy==="fw")     return sortDir*(b.fw-a.fw);
      if(sortBy==="total")  return sortDir*(b.total-a.total);
      return 0;
    });
  },[ranked,sortBy,sortDir]);

  function handleSort(key){
    if(sortBy===key){setSortDir(d=>-d);}
    else{setSortBy(key);setSortDir(1);}
  }

  function SortBtn({k,label}){
    const active=sortBy===k;
    return(
      <button onClick={()=>handleSort(k)} style={{padding:"5px 13px",border:`1px solid ${active?C.gold:"#2a2a2a"}`,background:active?`${C.gold}18`:"transparent",color:active?C.gold:"#555",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:10,borderRadius:2,outline:"none",transition:"all 0.15s",letterSpacing:1}}>
        {label}{active?(sortDir===1?" ↓":" ↑"):""}
      </button>
    );
  }

  return(<>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:8,marginBottom:18}}>
      {[
        {label:"Career Total",       value:fmt(full.reduce((s,a)=>s+a.total,0)),color:C.gold},
        {label:"Best Depth Rating",  value:bestDepth?.title.split(" ").slice(0,2).join(" ")||"—",color:C.green,tip:"Highest Depth Rating = most streaming came after week one"},
        {label:"Top Legacy Score",   value:bestLegacy?.title.split(" ").slice(0,2).join(" ")||"—",color:C.teal,tip:"Highest composite 0–100 Legacy Score"},
        {label:"Peak Opening Week",  value:fmt(Math.max(...full.map(a=>a.fw),0)),color:C.gold},
        {label:"Albums Ranked",      value:ranked.length,color:"#666"},
      ].map(({label,value,color,tip})=>(
        <div key={label} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:3,padding:"10px 12px"}}>
          <div style={{fontSize:8,color:"#666",letterSpacing:2,textTransform:"uppercase",marginBottom:2}}>{label}</div>
          {tip&&<div style={{fontSize:7.5,color:"#666",marginBottom:4,fontStyle:"italic"}}>{tip}</div>}
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
    {/* SORT BUTTONS */}
    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16,alignItems:"center",padding:"10px 14px",background:"#0d0d0d",border:`1px solid ${C.border}33`,borderRadius:3}}>
      <span style={{fontSize:8,color:"#666",letterSpacing:3,textTransform:"uppercase",marginRight:4}}>Sort by:</span>
      <SortBtn k="depth"  label="Depth Rating"/>
      <SortBtn k="legacy" label="Legacy Score"/>
      <SortBtn k="fw"     label="Opening Week"/>
      <SortBtn k="total"  label="Total Streams"/>
    </div>
    <SLabel>Rankings · {norm}mo window · Depth Rating: higher = more catalog-driven</SLabel>
    {combineHnHl&&<InfoBox color={C.pink}><span style={{color:C.pink}}>Double album mode.</span> HN + HL merged: 608K FW · 5.03M total · 30 tracks · MC ~67. Toggle off to split them.</InfoBox>}
    {showNonStudio&&<InfoBox color={C.orange}><span style={{color:C.orange}}>Non-studio included.</span> Commercial mixtapes (WATTBA, Dark Lane), More Life (playlist), and Care Package (compilation) added to rankings.</InfoBox>}
    {sorted.map((a,i)=><AlbumCard key={a.id} a={a} rank={i}/>)}
    {showNonStudio&&(<>
      <hr style={{borderColor:C.border,margin:"24px 0 16px"}}/>
      <SLabel>Pre-Streaming Mixtapes — Historical Context Only</SLabel>
      <InfoBox color={"#555"}>Room for Improvement (2006), Comeback Season (2007), and So Far Gone (2009) predate reliable streaming measurement. No Depth Rating can be calculated.</InfoBox>
      {DRAKE_RAW.filter(a=>a.legacy).map(a=>(
        <div key={a.id} style={{background:"#0d0d0d",border:`1px solid #2a2a2a`,borderLeft:`3px solid #3a3a3a`,borderRadius:3,padding:"11px 14px",marginBottom:7,display:"flex",alignItems:"center",gap:12,opacity:0.65}}>
          <div style={{fontSize:11,minWidth:32,textAlign:"center",color:"#666",flexShrink:0}}>◈</div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
              <span style={{fontSize:13,color:"#6a6a6a",fontStyle:"italic"}}>{a.title}</span>
              <Pill active small color="#3a3a3a">pre-streaming</Pill>
              <Pill active small color={C.orange}>mixtape</Pill>
            </div>
            <div style={{fontSize:9.5,color:"#666"}}>{a.release.slice(0,4)} · {a.tracks} tracks · no streaming data</div>
          </div>
          <div style={{fontSize:10,color:"#555",fontStyle:"italic",flexShrink:0}}>no data</div>
        </div>
      ))}
    </>)}
    {flagged.length>0&&(<>
      <hr style={{borderColor:C.border,margin:"20px 0 14px"}}/>
      <SLabel>⚠ Extrapolated</SLabel>
      {flagged.map(a=>(
        <div key={a.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:3,padding:"10px 15px",marginBottom:7,display:"flex",alignItems:"center",gap:12,opacity:0.55}}>
          <div style={{flex:1}}><div style={{fontSize:12.5,color:"#7a6a50",fontStyle:"italic"}}>{a.title}</div><div style={{fontSize:9.5,color:"#666",marginTop:2}}>{a.year} · {fmt(a.total)} so far</div></div>
          <div style={{fontSize:15,color:"#444",fontStyle:"italic"}}>{a.depthRating}<span style={{fontSize:9,color:"#555"}}>/100</span></div>
        </div>
      ))}
    </>)}
  </>);
}

// ── INSIGHTS ─────────────────────────────────────────────────────
function InsightsTab({drake}){
  const full=useMemo(()=>drake.filter(a=>!a.extrapolated&&a.type==="studio"),[drake]);
  if(!full.length) return <div style={{color:"#666",padding:20}}>No ranked studio albums.</div>;
  const yearPts=full.map(a=>[a.year,a.adjFWPct*100]);const yearReg=ols(yearPts);
  const metaPts=full.filter(a=>a.meta).map(a=>[a.meta,a.adjFWPct*100]);const metaReg=ols(metaPts);
  const beef=full.filter(a=>a.beefContext),noBeef=full.filter(a=>!a.beefContext);
  const surp=full.filter(a=>a.surprise),std=full.filter(a=>!a.surprise);
  const trackPts=full.map(a=>[a.tracks,a.adjFWPct*100]);const trackReg=ols(trackPts);
  const fwTrend=ols(full.map(a=>[a.year,a.fw/1000]));
  const beefAvg=mean(beef.map(a=>a.adjFWPct)),nbAvg=mean(noBeef.map(a=>a.adjFWPct));
  const surpAvg=mean(surp.map(a=>a.adjFWPct)),stdAvg=mean(std.map(a=>a.adjFWPct));

  const v1=`${yearReg.slope>0?"Yes — the trend line slopes upward, meaning newer albums show a higher fraction of their streaming concentrated in week one":"The trend line is essentially flat"} (R²=${(yearReg.r2*100).toFixed(0)}%). Release year explains only a small slice of the variation. The more predictive variable isn't when an album dropped — it's the beef context. Quiet-period albums hold their Depth Rating regardless of era. Conflict-adjacent albums cluster toward lower Depth Ratings regardless of era.`;
  const v2=`Almost no statistical relationship between critical scores and long-term streaming (R²=${(metaReg.r2*100).toFixed(0)}%). Scorpion, Drake's most critically dismissed major release (MC:67), has his highest Depth Rating — 11M total means it kept accumulating long after critics moved on. Views and IYRTITL have his lowest Depth Ratings (82), despite being commercially massive. Honestly, Nevermind earned his best recent Metacritic (MC:73) but sits mid-table on Depth Rating. For Drake specifically, critical approval and streaming durability are measuring completely different things.`;
  const v3=`Beef-adjacent albums average ${pct(beefAvg)} front-load vs ${pct(nbAvg)} for quiet-period releases. Important caveat: at default settings, FATD and SSS4U are extrapolated, leaving only Scorpion in the conflict group — n=1 is not a statistically meaningful sample. The finding holds directionally when extrapolated albums are included, but the bar chart should be read as illustrative rather than definitive. The mechanism when the full dataset is included: conflict drives casual listeners in on week one who leave when the drama ends.`;
  const v4=`${trackReg.slope>0?"The OLS slope is slightly positive — counterintuitively, more tracks correlates with a marginally higher Depth Rating at default settings. The confounding variable is elapsed time: Scorpion (25 tracks, 86 months elapsed) has the highest Depth Rating precisely because it's newer and gets projected more aggressively. NWTS at 13 tracks and IYRTITL at 17 tracks actually sit among the lowest Depth Ratings in the dataset. The track count signal is noise — elapsed time is doing the work.":"No strong correlation between track count and Depth Rating at current settings — elapsed time is the dominant confounding variable."}`;
  const v5=`Surprise albums average ${pct(surpAvg)} adjFWPct vs ${pct(stdAvg)} for standard releases — translating to higher Depth Ratings. But the mechanism is partly artificial: when an album drops with no warning, week one is mechanically suppressed by the rollout format. IYRTITL, Honestly Nevermind, and SSS4U all benefit from this effect.`;
  const v6=`${fwTrend.slope>0?`Trend is upward — opening weeks have grown over his career. Views in 2016 (1.04M) reset the ceiling. Even SSS4U — released in Drake's lowest critical moment — debuted at #1 with 246K. His ability to command opening-week numbers has proven remarkably resilient against critical decline, beef outcomes, and creative controversy.`:`Opening week numbers show a slight downward slope, consistent with broader streaming era compression of blockbuster debuts.`}`;

  return(
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(380px,1fr))",gap:12}}>
      <ICard title="Is Drake getting more front-loaded over time?" question="Each dot is a studio album by release year (x) and adjFWPct (y). Lower on chart = higher Depth Rating = more streaming came after week one." verdict={v1}>
        <Scatter pts={yearPts.map(([x,y],i)=>({x,y,c:ERAS[full[i]?.era]?.color||C.gold}))} reg={yearReg} xLab="Release Year" yLab="Front-Load %"/>
      </ICard>
      <ICard title="Do albums with better reviews last longer?" question="Metacritic score on x-axis, adjFWPct on y-axis. A downward slope would mean higher-reviewed albums earn deeper long-term replay." verdict={v2}>
        <Scatter pts={metaPts.map(([x,y])=>({x,y,c:mcClr(x)}))} reg={metaReg} xLab="Metacritic Score" yLab="Front-Load %"/>
      </ICard>
      <ICard title="Do conflict-era albums fade faster?" question="Albums split by beef context vs quiet periods. Higher bar = lower Depth Rating = more front-loaded." verdict={v3}>
        <Bars items={[{label:`Quiet (${noBeef.length})`,v:nbAvg,c:C.green},{label:`Conflict (${beef.length})`,v:beefAvg,c:C.red}]}/>
      </ICard>
      <ICard title="Do longer albums drain their own replay?" question="Track count on x-axis, adjFWPct on y-axis. Does adding more songs dilute per-track replay depth?" verdict={v4}>
        <Scatter pts={full.map(a=>({x:a.tracks,y:a.adjFWPct*100,c:a.tracks>19?C.red:C.green}))} reg={trackReg} xLab="Track Count" yLab="Front-Load %"/>
      </ICard>
      <ICard title="Do surprise drops inflate Depth Ratings artificially?" question="Albums with no pre-release rollout vs standard releases. Tests whether higher Depth Rating on surprise albums reflects genuine durability or a suppressed week-one denominator." verdict={v5}>
        <Bars items={[{label:`Standard (${std.length})`,v:stdAvg,c:C.gold},{label:`Surprise (${surp.length})`,v:surpAvg,c:"#9ca3af"}]}/>
      </ICard>
      <ICard title="Has his commercial opening power held up?" question="First-week streams/sales across his full discography. Dots color-coded by era. Trend line tests whether his debut-week commercial pull has grown, held, or declined." verdict={v6}>
        <Scatter pts={full.map(a=>({x:a.year,y:a.fw/1000,c:ERAS[a.era]?.color||C.gold}))} reg={fwTrend} xLab="Release Year" yLab="Opening Week (thousands)"/>
      </ICard>
    </div>
  );
}

// ── BEEF LENS ────────────────────────────────────────────────────
function BeefLensTab({drake}){
  const beefData=useMemo(()=>BEEF_SONGS.map(b=>{const catalog=b.total-b.fw;const adjFWPct=b.fw/(b.fw+catalog);return{...b,catalog,adjFWPct,depthRating:Math.round((1-adjFWPct)*100)};}), []);
  const full=drake.filter(a=>!a.extrapolated&&a.type==="studio");
  const beefA=full.filter(a=>a.beefContext),noBeef=full.filter(a=>!a.beefContext);
  const won=beefData.filter(b=>b.won===true),lost=beefData.filter(b=>b.won===false),base=beefData.filter(b=>b.won===null);
  return(<>
    <InfoBox color={C.red}>Beef song figures use estimated stream counts. Depth Rating formula still applies.</InfoBox>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:12,marginBottom:22}}>
      <ICard title="Winning a beef doesn't build a legacy" question="Non-beef hits vs winning diss tracks vs losing diss tracks — Depth Rating comparison." verdict={`God's Plan and Hotline Bling average Depth Rating ${Math.round(mean(base.map(b=>b.depthRating)))} — nearly all streaming came after week one. Winning beef tracks: ${Math.round(mean(won.map(b=>b.depthRating)))}. Losing: ${Math.round(mean(lost.map(b=>b.depthRating)))}. Not Like Us crossed from diss track into anthem. Drake's conflict records don't make that leap.`}>
        <Bars items={[{label:"Evergreen",v:mean(base.map(b=>b.adjFWPct)),c:C.gold},{label:"Won",v:mean(won.map(b=>b.adjFWPct)),c:C.green},{label:"Lost",v:mean(lost.map(b=>b.adjFWPct)),c:C.red}]}/>
      </ICard>
      <ICard title="Albums near beefs are more disposable" question="Albums released during/after conflicts vs quiet periods — Depth Rating gap." verdict={`Quiet albums avg Depth Rating ${Math.round(mean(noBeef.map(a=>a.depthRating)))} vs conflict albums ${Math.round(mean(beefA.map(a=>a.depthRating)))}. Consistent across Meek Mill, Pusha T, and Kendrick. The controversy brings people in — and they leave when the drama ends.`}>
        <Bars items={[{label:`Quiet (${noBeef.length})`,v:mean(noBeef.map(a=>a.adjFWPct)),c:C.green},{label:`Conflict (${beefA.length})`,v:mean(beefA.map(a=>a.adjFWPct)),c:C.red}]}/>
      </ICard>
    </div>
    <SLabel>All Beef Songs — Depth Rating Rankings</SLabel>
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5}}>
        <thead><tr>{["Song","Artist","Context","Total Streams","Depth Rating","Result"].map((h,i)=>(<th key={h} style={{fontSize:8,letterSpacing:2,textTransform:"uppercase",color:C.goldDim,textAlign:i>1?"right":"left",padding:"7px 10px",borderBottom:`1px solid ${C.border}`}}>{h}</th>))}</tr></thead>
        <tbody>{[...beefData].sort((a,b)=>b.depthRating-a.depthRating).map(b=>(
          <tr key={b.id} style={{borderBottom:"1px solid #141414"}}>
            <td style={{padding:"8px 10px",fontStyle:"italic",color:"#d4c080"}}>{b.title}</td>
            <td style={{padding:"8px 10px",color:"#666"}}>{b.artist}</td>
            <td style={{padding:"8px 10px",color:"#777",fontSize:10,textAlign:"right"}}>{b.context}</td>
            <td style={{padding:"8px 10px",textAlign:"right",color:"#8a7a60"}}>{fmt(b.total)}</td>
            <td style={{padding:"8px 10px",textAlign:"right",color:depthClr(b.depthRating)}}>{b.depthRating}<span style={{fontSize:8,color:"#555"}}>/100</span></td>
            <td style={{padding:"8px 10px",textAlign:"right",fontSize:10}}>{b.won===true&&<span style={{color:C.green}}>✓ Won</span>}{b.won===false&&<span style={{color:C.red}}>✗ Lost</span>}{b.won===null&&<span style={{color:"#555"}}>baseline</span>}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  </>);
}

// ── ICEMAN ────────────────────────────────────────────────────────
function IcemanTab({drake,norm,alpha}){
  const ICEMAN_NORM=30, ICEMAN_ALPHA=0.5, ELAPSED_12=12;
  const ELAPSED_MAP={tml:182,tc:165,nwts:143,iyrtitl:126,wattba:119,views:112,ml:101,sc:86,clb:48,hn:38,hl:34,fatd:22,sss4u:6};
  const PRESET_TOTALS={low:1500000, base:3500000, comeback:8500000};

  const PRESETS={
    low:     {label:"Low End",        color:"#9ca3af",fw:200000,meta:58,tracks:22,beef:true, collab:false,projTotal:PRESET_TOTALS.low,
               desc:"Post-beef hangover, bloated tracklist, critics indifferent. Sits bottom of rankings."},
    expected:{label:"Expected",       color:C.gold,   fw:380000,meta:68,tracks:18,beef:false,collab:false,projTotal:PRESET_TOTALS.base,
               desc:"Matches post-2020 average. Solid commercial opening, moderate reception, mid-table legacy."},
    comeback:{label:"Legacy Comeback",color:C.green,  fw:310000,meta:85,tracks:13,beef:false,collab:false,projTotal:PRESET_TOTALS.comeback,
               desc:"Lean, critically acclaimed, lower debut but deep long-term replay. The Take Care pattern — top of rankings."},
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
    const depthRating=Math.round((1-adj)*100);
    const catRatio=Math.min(100,(cat/Math.max(fw2,1))*5);
    const legacyScore=Math.round((1-adj)*100*0.6+(meta2/100)*100*0.25+catRatio*0.15);
    return{adj,depthRating,legacyScore,cat,total};
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
      adjFWPct:live.adj,catalog:live.cat,legacyScore:live.legacyScore,
      depthRating:live.depthRating,
      elapsed:ELAPSED_12,extrapolated:false,isGhost:true,
      year1:live.year1,
    };
  },[fw,meta,tracks,beef,collab,live,adjustedTotal]);

  const allAt12=useMemo(()=>{
    const base=drake.filter(a=>
      (a.type==="studio"||a.id==="ml")
      &&!a.combined&&!a.legacy&&a.total>0
      &&a.id!=="hn"&&a.id!=="hl"
    );
    const hn=drake.find(a=>a.id==="hn");
    const hl=drake.find(a=>a.id==="hl");
    const hnhlCombined=hn&&hl?{
      id:"hnhl_combined",title:"HN + Her Loss",release:"2022-06-17",
      fw:hn.fw+hl.fw,total:hn.total+hl.total,
      meta:67,tracks:(hn.tracks||0)+(hl.tracks||0),
      era:"post2020",type:"studio",combined:false,legacy:false,
      beefContext:null,collab:"21 Savage",
    }:null;
    const pool=[...base,...(hnhlCombined?[hnhlCombined]:[])];
    return pool.map(a=>{
      const elapsed=ELAPSED_MAP[a.id]||50;
      const r=computeIceman(a.fw,a.total,a.meta||60);
      if(!r) return null;
      const y1=estYear1(a.fw,a.total,elapsed);
      return{...a,...r,isGhost:false,year1:y1,elapsed};
    }).filter(Boolean);
  },[drake]);

  const pool=useMemo(()=>{
    const all=[...allAt12,...(ghost?[ghost]:[])];
    return all.sort((a,b)=>{
      if(sortBy==="depth")   return sortDir*(b.depthRating-a.depthRating);
      if(sortBy==="legacy")  return sortDir*(b.legacyScore-a.legacyScore);
      if(sortBy==="year1")   return sortDir*(b.year1-a.year1);
      if(sortBy==="fw")      return sortDir*(b.fw-a.fw);
      if(sortBy==="title")   return sortDir*a.title.localeCompare(b.title);
      return 0;
    });
  },[allAt12,ghost,sortBy,sortDir]);

  const maxYear1=Math.max(...allAt12.map(a=>a.year1),live?.year1||0,1);

  function drColor(dr){
    if(dr>=96) return C.teal;
    if(dr>=90) return C.green;
    if(dr>=85) return "#facc15";
    return C.red;
  }

  function ColH({k,label,sub,right}){
    const active=sortBy===k;
    return(
      <th onClick={()=>handleSort(k)} style={{padding:"7px 10px",textAlign:right?"right":"left",cursor:"pointer",userSelect:"none",borderBottom:`1px solid ${C.border}`,whiteSpace:"nowrap",verticalAlign:"bottom"}}>
        <div style={{fontSize:8,letterSpacing:2,textTransform:"uppercase",color:active?C.gold:C.goldDim}}>{label}{active?(sortDir===1?" ↓":" ↑"):""}</div>
        {sub&&<div style={{fontSize:8,color:"#666",marginTop:1}}>{sub}</div>}
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
          <div style={{fontSize:10.5,color:"#6a5a40",lineHeight:1.8,marginTop:12}}>
            Three scenario presets show where Iceman lands — bottom, middle, or top of rankings. Click one to load all settings, then fine-tune with sliders. The table sorts by any column. Presets map to ranking positions: Low End = bottom tier, Expected = mid-table, Legacy Comeback = top tier.
          </div>
        </div>
      )}
    </div>

    <div style={{marginBottom:18}}>
      <div style={{fontSize:8,color:"#666",letterSpacing:3,textTransform:"uppercase",marginBottom:10}}>Scenarios — Bottom / Middle / Top of Rankings</div>
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
                      <div style={{fontSize:7,color:"#666",letterSpacing:1.5,textTransform:"uppercase",marginBottom:2}}>Depth Rating</div>
                      <div style={{fontSize:13,color:drColor(r.depthRating),fontStyle:"italic"}}>{r.depthRating}<span style={{fontSize:8,color:"#555"}}>/100</span></div>
                      <div style={{height:3,background:"#1a1a1a",borderRadius:2,marginTop:4}}><div style={{height:"100%",width:`${r.depthRating}%`,background:drColor(r.depthRating),borderRadius:2}}/></div>
                    </div>
                    <div>
                      <div style={{fontSize:7,color:"#666",letterSpacing:1.5,textTransform:"uppercase",marginBottom:2}}>Legacy Score</div>
                      <div style={{fontSize:13,color:legacyClr(r.legacyScore),fontStyle:"italic"}}>{r.legacyScore}<span style={{fontSize:8,color:"#555"}}>/100</span></div>
                      <div style={{height:3,background:"#1a1a1a",borderRadius:2,marginTop:4}}><div style={{height:"100%",width:`${r.legacyScore}%`,background:legacyClr(r.legacyScore),borderRadius:2}}/></div>
                    </div>
                  </div>
                  <div style={{fontSize:9,color:"#555"}}>FW: {fmt(p.fw)} · Total: {fmt(p.projTotal)} · Year-1: <span style={{color:p.color}}>{fmt(r.year1)}</span></div>
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
          {label:"Opening week",sub:fmt(fw),          min:100000,  max:750000,  step:10000,  val:fw,        set:v=>handleSlider(setFw,v),       c:C.gold,      note:"bigger = lower depth rating"},
          {label:"Proj. total", sub:fmt(projTotal),   min:500000,  max:12000000,step:100000, val:projTotal, set:v=>handleSlider(setProjTotal,v), c:C.green,     note:"what you think album will reach"},
          {label:"Metacritic",  sub:`${meta}/100`,    min:50,      max:95,      step:1,      val:meta,      set:v=>handleSlider(setMeta,v),      c:mcClr(meta), note:"legacy score only"},
          {label:"Track count", sub:`${tracks}`,      min:8,       max:30,      step:1,      val:tracks,    set:v=>handleSlider(setTracks,v),
           c:tracks>20?C.red:tracks<14?C.green:"#888",
           note:tracks>20?`-${((1-trackMult)*100).toFixed(0)}% total`:tracks<14?`+${((trackMult-1)*100).toFixed(0)}% total`:"neutral"},
        ].map(({label,sub,min,max,step,val,set,c,note})=>(
          <div key={label} style={{marginBottom:13}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:5}}>
              <div style={{fontSize:9,color:C.goldDim,letterSpacing:2,textTransform:"uppercase"}}>{label}: <span style={{color:c}}>{sub}</span></div>
              <div style={{fontSize:8,color:"#666",fontStyle:"italic"}}>{note}</div>
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
      </div>

      <div>
        <SLabel>Live Output</SLabel>
        {live?(
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:3,padding:"16px 18px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              <div>
                <div style={{fontSize:7.5,color:"#666",letterSpacing:2,textTransform:"uppercase",marginBottom:3}}>Depth Rating</div>
                <div style={{fontSize:22,color:drColor(live.depthRating),fontStyle:"italic",lineHeight:1}}>{live.depthRating}<span style={{fontSize:11,color:"#555"}}>/100</span></div>
                <div style={{fontSize:9,color:"#777",marginTop:2}}>higher = more catalog-driven</div>
                <div style={{height:4,background:"#1a1a1a",borderRadius:2,marginTop:6}}><div style={{height:"100%",width:`${live.depthRating}%`,background:drColor(live.depthRating),borderRadius:2,transition:"width 0.3s"}}/></div>
              </div>
              <div>
                <div style={{fontSize:7.5,color:"#666",letterSpacing:2,textTransform:"uppercase",marginBottom:3}}>Legacy Score</div>
                <div style={{fontSize:22,color:legacyClr(live.legacyScore),fontStyle:"italic",lineHeight:1}}>{live.legacyScore}<span style={{fontSize:11,color:"#555"}}>/100</span></div>
                <div style={{fontSize:9,color:"#777",marginTop:2}}>composite 0-100</div>
                <div style={{height:4,background:"#1a1a1a",borderRadius:2,marginTop:6}}><div style={{height:"100%",width:`${live.legacyScore}%`,background:legacyClr(live.legacyScore),borderRadius:2,transition:"width 0.3s"}}/></div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,borderTop:"1px solid #1a1a1a",paddingTop:12,marginBottom:10}}>
              <div><div style={{fontSize:7,color:"#555",letterSpacing:1.5,textTransform:"uppercase"}}>Est. Year-1</div><div style={{fontSize:14,color:C.green,fontStyle:"italic"}}>{fmt(live.year1)}</div></div>
              <div><div style={{fontSize:7,color:"#555",letterSpacing:1.5,textTransform:"uppercase"}}>Opening Wk</div><div style={{fontSize:14,color:C.gold,fontStyle:"italic"}}>{fmt(fw)}</div></div>
              <div><div style={{fontSize:7,color:"#555",letterSpacing:1.5,textTransform:"uppercase"}}>Proj. Total</div><div style={{fontSize:14,color:C.green,fontStyle:"italic"}}>{fmt(adjustedTotal)}</div></div>
            </div>
            <div style={{fontSize:10,color:"#5a4a30",lineHeight:1.8,fontStyle:"italic",borderTop:"1px solid #1a1a1a",paddingTop:10}}>
              {live.depthRating>=96?"Deep catalog territory. Take Care-level long-term build.":
               live.depthRating>=90?"Solid depth rating. Most listening comes well after week one.":
               live.depthRating>=85?"Mixed. Opening week carries meaningful weight.":
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
    </div>
    <div style={{overflowX:"auto",marginBottom:10}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
        <thead>
          <tr style={{background:"#0d0d0d"}}>
            <ColH k="title"  label="Album"/>
            <ColH k="fw"     label="Opening Wk"   right/>
            <ColH k="year1"  label="Est. Year-1"  sub="12mo window" right/>
            <ColH k="depth"  label="Depth Rating" sub="higher = more durable" right/>
            <ColH k="legacy" label="Legacy Score"  right/>
          </tr>
        </thead>
        <tbody>
          {pool.map(a=>{
            const isGhost=a.isGhost;
            const dr=a.depthRating;
            const ls=a.legacyScore;
            return(
              <tr key={a.id} style={{borderBottom:`1px solid ${isGhost?"rgba(45,212,191,0.2)":"#141414"}`,background:isGhost?"rgba(45,212,191,0.04)":"transparent"}}>
                <td style={{padding:"9px 10px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
                    <span style={{fontSize:12,fontStyle:"italic",color:isGhost?"#7af0e0":"#d4c080"}}>{a.title}</span>
                    {isGhost&&<span style={{fontSize:8,color:C.teal}}>◇ projected</span>}
                    {!isGhost&&a.era&&ERAS[a.era]&&<span style={{fontSize:8,color:ERAS[a.era].color,opacity:0.8}}>{ERAS[a.era].short}</span>}
                    {a.beefContext&&<span style={{fontSize:8,color:C.red}}>beef</span>}
                  </div>
                </td>
                <td style={{padding:"9px 10px",textAlign:"right",color:"#b0a080"}}>{fmt(a.fw)}</td>
                <td style={{padding:"9px 10px",textAlign:"right",color:C.green}}>{fmt(a.year1)}</td>
                <td style={{padding:"9px 10px",textAlign:"right"}}>
                  <span style={{color:drColor(dr)}}>{dr}</span>
                  <span style={{fontSize:8,color:"#555"}}>/100</span>
                </td>
                <td style={{padding:"9px 10px",textAlign:"right"}}><span style={{color:legacyClr(ls)}}>{ls}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
    return out.sort((a,b)=>b.depthRating-a.depthRating);
  },[drake,peerComputed,peerKeys]);
  const artistSummaries=useMemo(()=>{
    const drakeA=drake.filter(a=>!a.extrapolated&&a.type==="studio");
    const base=[{key:"drake",name:"Drake",color:C.gold,albums:drakeA}];
    peerKeys.forEach(k=>{const a=(peerComputed[k]||[]).filter(x=>!x.extrapolated);if(a.length)base.push({key:k,name:PEERS[k].short,color:PEERS[k].color,albums:a});});
    return base.map(({key,name,color,albums})=>({key,name,color,avgDepth:Math.round(mean(albums.map(a=>a.depthRating))),avgLegacy:Math.round(mean(albums.map(a=>a.legacyScore))),avgMC:Math.round(mean(albums.filter(a=>a.meta).map(a=>a.meta)))||null,peakFW:Math.max(...albums.map(a=>a.fw),0),count:albums.length}));
  },[drake,peerComputed,peerKeys]);
  const radarVisible=radarArtists.slice(0,5);
  const narratives={
    big3:{color:C.gold,title:"The Big 3 in Brief",text:"Drake leads in raw commercial output. Kendrick has the deepest Depth Ratings and most critical acclaim. Cole's Forest Hills Drive went platinum with zero singles — the purest data point for organic catalog durability in the dataset."},
    godfather:{color:C.teal,title:"The Godfather",text:"Kanye's Metacritic arc peaked early and has cratered, but MBDTF remains the critical benchmark everything else gets measured against."},
    legends:{color:"#818cf8",title:"Legends Context",text:"Jay-Z, Wayne, and Eminem's FW numbers reflect physical-era unit sales. What matters is their Depth Rating in the streaming era. Jay-Z's 4:44 is the cleanest data point — a pure streaming-era album."},
    modern:{color:"#f59e0b",title:"Modern Era Note",text:"Astroworld remains the modern template for a Cultural Monument. After Hours vs Scorpion is the sharpest Depth Rating contrast in the tier."},
    all:{color:"#888",title:"Cross-Era View",text:"Kendrick's GKMC and Jay-Z's Blueprint occupy similar quadrants despite a decade apart. The streaming era didn't change what durability looks like — it changed how we measure it."},
  };
  const nr=narratives[activeGroup];
  const allGroupKeys=PEER_GROUPS[activeGroup]?.keys||[];

  function toggleArtist(key){
    setPeerKeys(prev=>prev.includes(key)?prev.filter(k=>k!==key):[...prev,key]);
  }

  return(<>
    <div style={{marginBottom:16}}>
      <div style={{fontSize:8,color:"#666",letterSpacing:3,textTransform:"uppercase",marginBottom:8}}>Comparison Lens</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>{Object.entries(PEER_GROUPS).map(([gid,g])=>(<button key={gid} onClick={()=>selectGroup(gid)} style={{padding:"7px 14px",border:`1px solid ${activeGroup===gid?g.color:"#2a2a2a"}`,background:activeGroup===gid?`${g.color}15`:"transparent",color:activeGroup===gid?g.color:"#444",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:10,borderRadius:2,outline:"none"}}>{g.label}</button>))}</div>
      {allGroupKeys.length>1&&(
        <div style={{display:"flex",gap:5,flexWrap:"wrap",padding:"9px 12px",background:"#0d0d0d",border:`1px solid ${C.border}33`,borderRadius:3}}>
          <span style={{fontSize:8,color:"#666",letterSpacing:2,textTransform:"uppercase",alignSelf:"center",marginRight:4}}>Artists:</span>
          {allGroupKeys.map(k=>{
            const on=peerKeys.includes(k);
            const p=PEERS[k];
            return(<button key={k} onClick={()=>toggleArtist(k)} style={{padding:"3px 10px",border:`1px solid ${on?p.color:"#2a2a2a"}`,background:on?`${p.color}18`:"transparent",color:on?p.color:"#444",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:9,borderRadius:2,outline:"none",transition:"all 0.15s"}}>{p.short}</button>);
          })}
          <button onClick={()=>setPeerKeys([...allGroupKeys])} style={{padding:"3px 10px",border:"1px solid #2a2a2a",background:"transparent",color:"#444",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:9,borderRadius:2,outline:"none",marginLeft:4}}>All</button>
          <button onClick={()=>setPeerKeys([])} style={{padding:"3px 10px",border:"1px solid #2a2a2a",background:"transparent",color:"#444",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:9,borderRadius:2,outline:"none"}}>None</button>
        </div>
      )}
    </div>
    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
      {artistSummaries.map(s=>(
        <div key={s.key} style={{background:C.card,border:`1px solid ${s.color}25`,borderTop:`2px solid ${s.color}`,borderRadius:3,padding:"10px 13px",flex:"1 1 110px",minWidth:100}}>
          <div style={{fontSize:10,color:s.color,letterSpacing:1,marginBottom:7,fontStyle:"italic"}}>{s.name}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3}}>
            {[["Depth Avg",String(s.avgDepth),"/100"],["Legacy",String(s.avgLegacy),"/100"],["MC",s.avgMC?String(s.avgMC):"—",""],["Peak FW",fmt(s.peakFW),""]].map(([l,v,sub])=>(
              <div key={l}><div style={{fontSize:7.5,color:"#666",letterSpacing:1.5,textTransform:"uppercase"}}>{l}</div><div style={{fontSize:11,color:s.color,fontStyle:"italic"}}>{v}<span style={{fontSize:8,color:"#666",marginLeft:2}}>{sub}</span></div></div>
            ))}
          </div>
        </div>
      ))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 240px",gap:16,alignItems:"start"}}>
      <div>
        <SLabel>Unified Rankings — by Depth Rating</SLabel>
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

// ── LEGACY ────────────────────────────────────────────────────────
const LEGACY_SYSTEM_PROMPT = `You are a legacy analysis system for the OVO Observatory — a music analytics tool that measures artist legacy through listener behavior data, not critical consensus or biographical achievement.

Your function is to produce a legacy verdict that reads like a sharp human analyst wrote it — opinionated, specific, grounded in data, willing to make a claim and defend it. You are not a critic. You do not write career summaries or repeat critical consensus. You analyze what listeners actually do with music over time, and what that behavior reveals about an artist's irreplaceability.

CORE QUESTION: If this artist were removed from music history entirely, what specific hole does not get filled by anyone else? That is the question your verdict is ultimately answering.

THE NINE AXES:
Axes 1-4 must be grounded in the provided data. Axes 5-8 draw on your general knowledge — label them explicitly as "(general knowledge)" when you reference them in prose. Axis 9 is your synthesis.

1. CULTURAL FOOTPRINT [data]: Opening week power + catalog longevity + total reach over time. Measures how much cultural real estate the artist commanded and for how long.
2. LISTENER LOYALTY [data]: Depth Rating average + catalog-to-peak ratio + surprise drop behavior. Measures the audience that returns unprompted vs one that shows up for events.
3. INSTITUTIONAL GAP [data]: Metacritic score vs Depth Rating delta. The larger this gap, the more the critics and the audience are watching different artists.
4. PRESSURE RESILIENCE [data]: Beef vs quiet album Depth Rating comparison. Does the listener relationship hold under maximum narrative and institutional attack?
5. GENRE ARCHITECTURE [general knowledge]: What specifically did this artist change about how the genre works that cannot be undone. Not influence in general — the specific mechanism.
6. EMOTIONAL UTILITY [general knowledge]: What emotional states does this catalog serve. What does a listener reach for it at 2AM on an emotional drive. This is the dimension critics cannot measure.
7. CULTURAL TRANSMISSION [general knowledge]: How much of this artist's vocabulary, cadence, or framing entered the broader culture independent of their music.
8. GENERATIONAL REACH [general knowledge]: Is this catalog claimed by multiple generations or one. How did discovery patterns change across different listener cohorts.
9. LEGACY RESILIENCE [synthesis]: How does everything above hold under the maximum pressure the artist currently faces. For artists with live legacy variables — an upcoming album, an active controversy — name those variables directly.

INTERNAL REASONING (execute before writing, do not output these steps):
Step 1: Assess each axis against the data and your knowledge.
Step 2: Determine which axes carry the most weight FOR THIS SPECIFIC ARTIST. Do not apply uniform weighting. Explain your weighting decision in dominant_axes_reasoning.
Step 3: Identify where data is sufficient vs insufficient. Name gaps honestly.
Step 4: Answer the replacement question. Be specific. Name what combination of things existed only here.
Step 5: Identify the one thing the data cannot yet answer about this artist's legacy.

WRITING RULES — enforce without exception:

Voice: Write as someone who has already decided what they think and is explaining why — not discovering it. Be direct. Make claims. A voice that hedges everything is indistinguishable from one that knows nothing.

Sentence rhythm: Short sentences for claims. Longer sentences for reasoning. Vary deliberately. Uniform sentence length is the clearest signal of machine generation.

Forbidden constructions:
- Do not explain what you are about to say. Say it.
- Do not zoom out to announce significance. If something matters, the specificity of the claim demonstrates it.
- Do not use reframe constructions: "That is not X — that is Y" or "That is not X. That is Y." Just state the correct thing.
- Do not use: furthermore, moreover, additionally, it is worth noting, it is important to recognize, broadly speaking, it could be argued, in many ways.
- Do not open with rhetorical questions.
- Do not manufacture false balance. If something is settled by the data, say so.
- Do not over-explain or summarize what you just wrote.
- Do not puff up importance with phrases like "marks a significant shift" or "represents a broader movement."

Forbidden words: delve, underscore, tapestry, pivotal, nuanced, testament, landscape (metaphorical), crucial, meticulous, garnered, bolstered, vibrant, showcasing, fostering, enduring (as lazy praise), interplay, intricacies.

Epistemic consistency: Apply identical skepticism standards to all artists. Do not raise doubt about a metric without specific documented evidence. Do not manufacture uncertainty to appear balanced. Absence of accusation is not evidence of manipulation.

Length: verdict field is 4-6 paragraphs as single string with paragraph breaks as \n\n. Each paragraph carries distinct analytical weight — do not repeat yourself.

OUTPUT — valid JSON only, no preamble, no markdown:
{"verdict":"4-6 paragraphs as single string, paragraphs separated by \n\n","replacement":"one paragraph directly answering the replacement question — specific not generic","open_question":"one sentence naming what cannot yet be resolved from current data","dominant_axes":["axis_key_1","axis_key_2","axis_key_3"],"dominant_axes_reasoning":"1-2 sentences why these axes carry most weight for this specific artist","axis_breakdown":{"cultural_footprint":{"score":0,"summary":"2-3 sentences","data_anchored":true},"listener_loyalty":{"score":0,"summary":"2-3 sentences","data_anchored":true},"institutional_gap":{"score":0,"summary":"2-3 sentences","data_anchored":true},"pressure_resilience":{"score":0,"summary":"2-3 sentences","data_anchored":true},"genre_architecture":{"score":0,"summary":"2-3 sentences","data_anchored":false},"emotional_utility":{"score":0,"summary":"2-3 sentences","data_anchored":false},"cultural_transmission":{"score":0,"summary":"2-3 sentences","data_anchored":false},"generational_reach":{"score":0,"summary":"2-3 sentences","data_anchored":false},"legacy_resilience":{"score":0,"summary":"2-3 sentences","data_anchored":"synthesis"}}}`;

function ArtistCircle({artist,selected,onClick,size=52}){
  return(
    <div onClick={onClick} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer",opacity:selected?1:0.5,transition:"all 0.2s"}}>
      <div style={{width:size,height:size,borderRadius:"50%",background:`${artist.color}18`,border:`2px solid ${selected?artist.color:artist.color+"44"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.28,color:artist.color,fontFamily:"Georgia,serif",fontWeight:"bold",boxShadow:selected?`0 0 0 3px ${artist.color}33,0 0 12px ${artist.color}22`:"none",transition:"all 0.2s",letterSpacing:-0.5}}>
        {artist.initials}
      </div>
      <span style={{fontSize:8,color:selected?artist.color:"#555",letterSpacing:1,textTransform:"uppercase",whiteSpace:"nowrap"}}>{artist.shortName}</span>
    </div>
  );
}

function LegacyTab({drake,peerComputed,norm,alpha}){
  const ARTISTS={
    drake:    {name:"Drake",         shortName:"Drake",    initials:"D",   color:C.gold},
    kendrick: {name:"Kendrick Lamar",shortName:"Kendrick", initials:"K",   color:C.purple},
    cole:     {name:"J. Cole",       shortName:"Cole",     initials:"C",   color:"#10b981"},
    kanye:    {name:"Kanye West",    shortName:"Kanye",    initials:"KW",  color:C.teal},
    jayz:     {name:"Jay-Z",         shortName:"Jay-Z",    initials:"JZ",  color:"#818cf8"},
    wayne:    {name:"Lil Wayne",     shortName:"Wayne",    initials:"W",   color:"#ef4444"},
    eminem:   {name:"Eminem",        shortName:"Em",       initials:"E",   color:"#6b7280"},
    travis:   {name:"Travis Scott",  shortName:"Travis",   initials:"T",   color:"#f59e0b"},
    weeknd:   {name:"The Weeknd",    shortName:"Weeknd",   initials:"WK",  color:"#e879f9"},
    future:   {name:"Future",        shortName:"Future",   initials:"F",   color:"#38bdf8"},
    juice:    {name:"Juice WRLD",    shortName:"Juice",    initials:"JW",  color:"#e2e8f0"},
    carti:    {name:"Playboi Carti", shortName:"Carti",    initials:"PC",  color:"#ec4899"},
    popsmoke: {name:"Pop Smoke",     shortName:"Pop",      initials:"PS",  color:"#94a3b8"},
  };

  const [primary,setPrimary]=useState("drake");
  const [comparisons,setComparisons]=useState([]);
  const [verdict,setVerdict]=useState(null);
  const [loading,setLoading]=useState(false);
  const [axisExpanded,setAxisExpanded]=useState(false);
  const [chat,setChat]=useState([]);
  const [chatInput,setChatInput]=useState("");
  const [chatLoading,setChatLoading]=useState(false);
  const [error,setError]=useState(null);

  const getAlbums=useCallback(k=>k==="drake"
    ?drake.filter(a=>!a.extrapolated&&a.total>0)
    :(peerComputed[k]||[]).filter(a=>!a.extrapolated&&a.total>0)
  ,[drake,peerComputed]);

  const activeKeys=useMemo(()=>[primary,...comparisons],[primary,comparisons]);
  const primaryArtist=ARTISTS[primary];

  function toggleComparison(key){
    if(key===primary) return;
    setComparisons(prev=>{
      if(prev.includes(key)) return prev.filter(k=>k!==key);
      if(prev.length>=3) return prev;
      return [...prev,key];
    });
    setVerdict(null);setChat([]);
  }

  // ── DATA PROMPT ──────────────────────────────────────────────────
  const buildDataBrief=useCallback((primaryKey,compKeys=[])=>{
    const fmt2=n=>n>=1e6?(n/1e6).toFixed(1)+"M":n>=1e3?(n/1e3).toFixed(0)+"K":String(n);
    const formatArtist=key=>{
      const albums=getAlbums(key);
      if(!albums.length) return `ARTIST: ${ARTISTS[key]?.name||key}\nNo data available.`;
      const beefA=albums.filter(a=>a.beefContext),quietA=albums.filter(a=>!a.beefContext);
      const metaA=albums.filter(a=>a.meta);
      const depthAvg=Math.round(mean(albums.map(a=>a.depthRating)));
      const legacyAvg=Math.round(mean(albums.map(a=>a.legacyScore)));
      const mcAvg=metaA.length?Math.round(mean(metaA.map(a=>a.meta))):null;
      const instGap=mcAvg!=null?depthAvg-mcAvg:null;
      const beefDepth=beefA.length?Math.round(mean(beefA.map(a=>a.depthRating))):null;
      const quietDepth=quietA.length?Math.round(mean(quietA.map(a=>a.depthRating))):null;
      return `ARTIST: ${ARTISTS[key]?.name||key}
Avg Depth Rating: ${depthAvg}/100 | Avg Legacy Score: ${legacyAvg}/100 | Avg Metacritic: ${mcAvg||"N/A"}
Institutional Gap (Depth minus MC): ${instGap!=null?instGap:"N/A"} pts
Beef avg Depth: ${beefDepth||"N/A"} | Quiet avg Depth: ${quietDepth||"N/A"}
ALBUMS:
${albums.map(a=>`  ${a.title} (${a.year}): DR ${a.depthRating} | LS ${a.legacyScore} | FW ${fmt2(a.fw)} | Tot ${fmt2(a.total)} | MC ${a.meta||"N/A"}${a.beefContext?" [beef]":""}${a.surprise?" [surprise]":""}${a.preStream?" [pre-stream]":""}`).join("\n")}`;
    };
    const allKeys=[primaryKey,...compKeys];
    const sections=allKeys.map(k=>formatArtist(k)).join("\n\n---\n\n");
    const instruction=compKeys.length>0
      ?"Generate a comparative legacy verdict. Analyze each artist individually across the nine axes, then write a head-to-head synthesis answering: what does each leave that the other cannot fill."
      :"Generate a legacy verdict for this artist.";
    return sections+"\n\n"+instruction;
  },[getAlbums]);

  // ── API CALLS ────────────────────────────────────────────────────
  const generate=async()=>{
    setLoading(true);setError(null);setVerdict(null);setChat([]);setAxisExpanded(false);
    try{
      const prompt=buildDataBrief(primary,comparisons);
      const resp=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:3000,system:LEGACY_SYSTEM_PROMPT,messages:[{role:"user",content:prompt}]})
      });
      const data=await resp.json();
      if(!data.content||!data.content[0]) throw new Error("No content");
      const text=data.content[0].text;
      const clean=text.replace(/```json\n?|```\n?/g,"").trim();
      const parsed=JSON.parse(clean);
      setVerdict(parsed);
    }catch(e){setError("Generation failed — "+e.message);}
    setLoading(false);
  };

  const sendChat=async()=>{
    if(!chatInput.trim()||!verdict) return;
    const newMsg={role:"user",content:chatInput};
    const updated=[...chat,newMsg];
    setChat(updated);setChatInput("");setChatLoading(true);
    try{
      const ctx=`VERDICT:\n${JSON.stringify(verdict,null,2)}\n\nDATA:\n${buildDataBrief(primary,comparisons)}`;
      const sysChat=LEGACY_SYSTEM_PROMPT+"\n\nYou are now in conversation mode. The user is responding to the verdict. Defend your verdict where data supports it. Update when the user raises genuinely new information. Hold your ground when they push bias rather than argument. Respond in prose — apply the same writing rules. No JSON.";
      const resp=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sysChat,messages:[{role:"user",content:ctx},{role:"assistant",content:"Verdict delivered."}, ...updated]})
      });
      const data=await resp.json();
      setChat([...updated,{role:"assistant",content:data.content[0].text}]);
    }catch(e){setChat([...updated,{role:"assistant",content:"Failed to respond."}]);}
    setChatLoading(false);
  };

  // ── QUADRANT DATA (artist-aware) ─────────────────────────────────
  const quadData=useMemo(()=>{
    const allFWArr=[];
    const artistAlbums=activeKeys.map(key=>{
      const albums=getAlbums(key).filter(a=>a.fw>0&&a.total>0&&(key==="drake"?a.type==="studio":true));
      albums.forEach(a=>allFWArr.push(a.fw));
      return{key,color:ARTISTS[key].color,albums};
    });
    if(!allFWArr.length) return{artistAlbums:[],normFW:()=>0};
    const minL=Math.log(Math.min(...allFWArr)||1),maxL=Math.log(Math.max(...allFWArr)||2);
    const normFW=fw=>((Math.log(fw)-minL)/(maxL-minL||1))*100;

    return{
      artistAlbums:artistAlbums.map(({key,color,albums})=>{
        return{
          key,color,
          albums:albums.map(a=>{
            const elapsed=getMonths(a.release);
            const computePos=elap=>{
              if(elap<=0) return null;
              const cat=a.total-a.fw;
              const projCat=cat*Math.pow(norm/elap,alpha);
              const adj=a.fw/(a.fw+projCat);
              const depth=Math.round((1-adj)*100);
              const catDepth=(1-adj)*100;
              const metaNorm=((a.meta||65)/100)*100;
              const catRatio=Math.min(100,(cat/Math.max(a.fw,1))*5);
              const legacy=Math.round(catDepth*0.60+metaNorm*0.25+catRatio*0.15);
              return{depth,legacy};
            };
            const current=computePos(elapsed);
            const launch=elapsed>18?computePos(12):null;
            return{...a,current,launch,artistColor:color};
          }).filter(a=>a.current)
        };
      }),
      normFW
    };
  },[activeKeys,getAlbums,norm,alpha]);

  // ── CAREER ARC DATA (artist-aware) ───────────────────────────────
  const arcData=useMemo(()=>{
    return activeKeys.map(key=>{
      const albums=getAlbums(key).filter(a=>a.depthRating>0).sort((a,b)=>a.year-b.year);
      return{key,color:ARTISTS[key].color,name:ARTISTS[key].shortName,albums};
    });
  },[activeKeys,getAlbums]);

  const allArcAlbums=useMemo(()=>arcData.flatMap(d=>d.albums),[arcData]);
  const arcAvg=allArcAlbums.length?mean(allArcAlbums.map(a=>a.depthRating)):50;

  const COMEBACK_MOMENTS=[
    {year:2011.85,label:"Take Care",color:C.green},
    {year:2018.45,label:"Scorpion / Pusha",color:C.red},
    {year:2024.3, label:"Post-Kendrick",color:C.red},
    {year:2025.8, label:"Iceman ◇",color:C.gold,dashed:true},
  ];
  const showDrakeAnnotations=activeKeys.includes("drake");

  // ── SHARED SVG CONSTANTS ─────────────────────────────────────────
  const QW=820,QH=480,Qp={t:36,r:20,b:46,l:52};
  const Qw=QW-Qp.l-Qp.r,Qh=QH-Qp.t-Qp.b;
  const QmX=50,QmY=55;
  const Qsx=x=>Qp.l+(x/100)*Qw,Qsy=y=>Qp.t+(1-(y/100))*Qh;

  const AW=820,AH=300,Ap={t:24,r:24,b:46,l:52};
  const Aw=AW-Ap.l-Ap.r,Ah=AH-Ap.t-Ap.b;
  const AxMn=2008,AxMx=2026.5;
  const Asx=x=>Ap.l+((x-AxMn)/(AxMx-AxMn))*Aw;
  const Asy=y=>Ap.t+(1-(y/100))*Ah;

  const quadLabels=[
    {x:0,y:QmY,w:QmX,h:100-QmY,label:"Slow Burn",sub:"Quiet open, deep replay",color:"rgba(96,165,250,0.04)"},
    {x:QmX,y:QmY,w:100-QmX,h:100-QmY,label:"Cultural Monument",sub:"Big opening, lasting legacy",color:"rgba(74,207,136,0.04)"},
    {x:0,y:0,w:QmX,h:QmY,label:"Under the Radar",sub:"Modest, faded",color:"rgba(80,80,80,0.03)"},
    {x:QmX,y:0,w:100-QmX,h:QmY,label:"Commercial Event",sub:"Big open, faded quickly",color:"rgba(248,113,113,0.04)"},
  ];

  const AXIS_LABELS={
    cultural_footprint:"Cultural Footprint",listener_loyalty:"Listener Loyalty",
    institutional_gap:"Institutional Gap",pressure_resilience:"Pressure Resilience",
    genre_architecture:"Genre Architecture",emotional_utility:"Emotional Utility",
    cultural_transmission:"Cultural Transmission",generational_reach:"Generational Reach",
    legacy_resilience:"Legacy Resilience",
  };

  return(
    <div>
      {/* ── ARTIST SELECTOR ── */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:4,padding:"18px 18px 14px",marginBottom:20}}>
        <div style={{fontSize:9,letterSpacing:4,color:C.goldDim,textTransform:"uppercase",marginBottom:12}}>Primary Artist</div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:16}}>
          {Object.entries(ARTISTS).map(([key,art])=>(
            <div key={key} onClick={()=>{if(primary!==key){setPrimary(key);setComparisons(prev=>prev.filter(k=>k!==key));setVerdict(null);setChat([]);}}}
              style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",opacity:primary===key?1:0.45,transition:"all 0.2s"}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:`${art.color}18`,border:`2px solid ${primary===key?art.color:art.color+"33"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:art.color,fontFamily:"Georgia,serif",fontWeight:"bold",boxShadow:primary===key?`0 0 0 3px ${art.color}33`:"none",transition:"all 0.2s"}}>
                {art.initials}
              </div>
              <span style={{fontSize:7.5,color:primary===key?art.color:"#555",letterSpacing:0.5,textTransform:"uppercase",whiteSpace:"nowrap"}}>{art.shortName}</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
          <div style={{fontSize:9,letterSpacing:3,color:C.goldDim,textTransform:"uppercase"}}>Compare (up to 3)</div>
          {comparisons.length>0&&<button onClick={()=>{setComparisons([]);setVerdict(null);setChat([]);}} style={{fontSize:8,color:"#555",background:"none",border:"1px solid #2a2a2a",borderRadius:2,padding:"2px 8px",cursor:"pointer",fontFamily:"Georgia,serif",letterSpacing:1}}>Clear all</button>}
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {Object.entries(ARTISTS).filter(([k])=>k!==primary).map(([key,art])=>{
            const sel=comparisons.includes(key);
            const atMax=comparisons.length>=3&&!sel;
            return(
              <div key={key} onClick={()=>!atMax&&toggleComparison(key)}
                style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:atMax?"not-allowed":"pointer",opacity:atMax?0.2:sel?1:0.4,transition:"all 0.2s"}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:`${art.color}18`,border:`2px solid ${sel?art.color:art.color+"33"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:art.color,fontFamily:"Georgia,serif",fontWeight:"bold",boxShadow:sel?`0 0 0 2px ${art.color}44`:"none",transition:"all 0.2s"}}>
                  {art.initials}
                </div>
                <span style={{fontSize:7,color:sel?art.color:"#555",letterSpacing:0.5,textTransform:"uppercase",whiteSpace:"nowrap"}}>{art.shortName}</span>
              </div>
            );
          })}
        </div>
        {comparisons.length>0&&(
          <div style={{marginTop:12,display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"#0d0d0d",borderRadius:3,border:`1px solid ${C.border}33`,flexWrap:"wrap"}}>
            {[primary,...comparisons].map((k,i)=>{
              const art=ARTISTS[k];
              return(
                <React.Fragment key={k}>
                  {i>0&&<span style={{fontSize:9,color:"#444"}}>vs</span>}
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <div style={{width:20,height:20,borderRadius:"50%",background:`${art.color}18`,border:`1.5px solid ${art.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:art.color,fontFamily:"Georgia,serif",fontWeight:"bold"}}>{art.initials}</div>
                    <span style={{fontSize:10,color:art.color,fontStyle:"italic"}}>{art.name}</span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>

      {/* ── EVOLVED QUADRANT ── */}
      <div style={{marginBottom:20}}>
        <div style={{fontSize:9,letterSpacing:4,color:C.goldDim,textTransform:"uppercase",marginBottom:6,paddingBottom:6,borderBottom:`1px solid ${C.border}`}}>Legacy Quadrant — Trajectory View</div>
        <div style={{fontSize:10,color:"#666",fontStyle:"italic",marginBottom:10}}>Faded dot = 12-month snapshot. Bright dot = current. Arrow = trajectory over time. Red ring = beef context.</div>
        <div style={{overflowX:"auto"}}>
          <svg width={QW} height={QH} style={{minWidth:QW,background:C.card,borderRadius:4,border:`1px solid ${C.border}`}}>
            {quadLabels.map(q=>(
              <g key={q.label}>
                <rect x={Qsx(q.x)} y={Qsy(q.y+q.h)} width={(q.w/100)*Qw} height={(q.h/100)*Qh} fill={q.color}/>
                <text x={Qsx(q.x+q.w*0.5)} y={Qsy(q.y+q.h-3)} textAnchor="middle" fill="#555" fontSize={11} fontStyle="italic">{q.label}</text>
                <text x={Qsx(q.x+q.w*0.5)} y={Qsy(q.y+q.h-3)+14} textAnchor="middle" fill="#444" fontSize={7.5}>{q.sub}</text>
              </g>
            ))}
            <line x1={Qsx(QmX)} x2={Qsx(QmX)} y1={Qp.t} y2={Qp.t+Qh} stroke="#1c1c1c" strokeDasharray="4,4"/>
            <line x1={Qp.l} x2={Qp.l+Qw} y1={Qsy(QmY)} y2={Qsy(QmY)} stroke="#1c1c1c" strokeDasharray="4,4"/>
            <line x1={Qp.l} x2={Qp.l+Qw} y1={Qp.t+Qh} y2={Qp.t+Qh} stroke="#2a2a2a"/>
            <line x1={Qp.l} x2={Qp.l} y1={Qp.t} y2={Qp.t+Qh} stroke="#2a2a2a"/>
            <text x={Qp.l+Qw/2} y={QH-8} textAnchor="middle" fill="#666" fontSize={10}>Opening Week Power →</text>
            <text x={14} y={Qp.t+Qh/2} textAnchor="middle" fill="#666" fontSize={10} transform={`rotate(-90,14,${Qp.t+Qh/2})`}>↑ Legacy Score</text>
            {quadData.artistAlbums.map(({key,color,albums})=>
              albums.map(a=>{
                const cx=Qsx(quadData.normFW(a.fw)),cy=Qsy(a.current.legacy);
                const hasArrow=a.launch&&Math.abs(a.launch.legacy-a.current.legacy)>2;
                const lx=hasArrow?Qsx(quadData.normFW(a.fw)):cx;
                const ly=hasArrow?Qsy(a.launch.legacy):cy;
                const isDrake=key==="drake";
                const r=isDrake?9:7;
                const angle=hasArrow?Math.atan2(cy-ly,cx-lx)*180/Math.PI+90:0;
                return(
                  <g key={`${key}-${a.id||a.title}`}>
                    {a.beefContext&&<circle cx={cx} cy={cy} r={r+6} fill="none" stroke={C.red} strokeWidth={1} opacity={0.3}/>}
                    {hasArrow&&(
                      <>
                        <circle cx={lx} cy={ly} r={r*0.55} fill={color} opacity={0.18}/>
                        <line x1={lx} y1={ly} x2={cx} y2={cy} stroke={color} strokeWidth={0.8} strokeDasharray="3,2" opacity={0.3}/>
                        <polygon points={`0,${-r*0.9} ${-r*0.4},${r*0.3} ${r*0.4},${r*0.3}`} fill={color} opacity={0.55} transform={`translate(${cx},${cy}) rotate(${angle})`}/>
                      </>
                    )}
                    <circle cx={cx} cy={cy} r={r} fill={color} opacity={0.9} stroke={a.preStream?C.blue:"none"} strokeWidth={1.5}/>
                    <text x={cx} y={cy-(r+5)} textAnchor="middle" fill={isDrake?"#e8d9a0":"#7a7a7a"} fontSize={isDrake?8:7}>{a.title.split(" ").slice(0,2).join(" ")}</text>
                  </g>
                );
              })
            )}
          </svg>
        </div>
        {activeKeys.length>1&&(
          <div style={{display:"flex",gap:14,marginTop:8,flexWrap:"wrap"}}>
            {activeKeys.map(k=>(
              <div key={k} style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:ARTISTS[k].color}}/>
                <span style={{fontSize:9,color:"#666"}}>{ARTISTS[k].name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── EVOLVED CAREER ARC ── */}
      <div style={{marginBottom:20}}>
        <div style={{fontSize:9,letterSpacing:4,color:C.goldDim,textTransform:"uppercase",marginBottom:6,paddingBottom:6,borderBottom:`1px solid ${C.border}`}}>Career Arc — Depth Rating Over Time</div>
        <div style={{fontSize:10,color:"#666",fontStyle:"italic",marginBottom:10}}>
          {showDrakeAnnotations?"Vertical markers show pressure points — albums where the narrative declared Drake finished.":"Depth Rating trajectory across each artist's full catalog."}
        </div>
        <div style={{overflowX:"auto",marginBottom:8}}>
          <svg width={AW} height={AH} style={{minWidth:AW}}>
            {showDrakeAnnotations&&[["young-money",2008,2014.5],["peak",2014.5,2019.5],["post2020",2019.5,2026.5]].map(([era,x1,x2])=>(
              <g key={era}>
                <rect x={Asx(x1)} y={Ap.t} width={Asx(x2)-Asx(x1)} height={Ah} fill={ERAS[era]?.color} opacity={0.03}/>
                <text x={Asx((x1+x2)/2)} y={Ap.t+Ah-6} textAnchor="middle" fill={ERAS[era]?.color} fontSize={7.5} opacity={0.15}>{ERAS[era]?.label}</text>
              </g>
            ))}
            {showDrakeAnnotations&&COMEBACK_MOMENTS.map((m,i)=>(
              <g key={i}>
                <line x1={Asx(m.year)} x2={Asx(m.year)} y1={Ap.t} y2={Ap.t+Ah} stroke={m.color} strokeWidth={0.8} strokeDasharray={m.dashed?"5,4":"none"} opacity={0.3}/>
                <text x={Asx(m.year)+4} y={Ap.t+11} fill={m.color} fontSize={7} opacity={0.65}>{m.label}</text>
              </g>
            ))}
            <line x1={Ap.l} x2={Ap.l+Aw} y1={Asy(arcAvg)} y2={Asy(arcAvg)} stroke="#1a1a1a" strokeDasharray="3,3"/>
            {[20,40,60,80,100].map(v=>(<g key={v}><line x1={Ap.l} x2={Ap.l+Aw} y1={Asy(v)} y2={Asy(v)} stroke="#131313"/><text x={Ap.l-5} y={Asy(v)+4} textAnchor="end" fill="#666" fontSize={9}>{v}</text></g>))}
            {[2010,2013,2016,2019,2022,2025].map(y=>(<text key={y} x={Asx(y)} y={Ap.t+Ah+17} textAnchor="middle" fill="#666" fontSize={9}>{y}</text>))}
            {arcData.map(({key,color,albums})=>{
              const studioAlbs=albums.filter(a=>a.type==="studio"&&a.depthRating>0);
              return(
                <g key={key}>
                  {studioAlbs.length>=2&&<polyline fill="none" stroke={color} strokeWidth={0.7} opacity={0.15} points={studioAlbs.map(a=>`${Asx(a.year)},${Asy(a.depthRating)}`).join(" ")}/>}
                  {albums.filter(a=>a.depthRating>0).map(a=>(
                    <g key={`${key}-${a.id||a.title}`}>
                      <circle cx={Asx(a.year)} cy={Asy(a.depthRating)} r={key==="drake"?(a.type==="studio"?(a.beefContext?8:6):5):5} fill={a.beefContext&&key==="drake"?C.red:a.collab&&key==="drake"?C.purple:color} stroke={a.preStream?C.blue:"none"} strokeWidth={1.5} opacity={0.9}/>
                      <text x={Asx(a.year)} y={Asy(a.depthRating)+19} textAnchor="middle" fill={key==="drake"?"#555":"#555"} fontSize={7}>{a.title.split(" ").slice(0,2).join(" ")}</text>
                    </g>
                  ))}
                </g>
              );
            })}
            <line x1={Ap.l} x2={Ap.l+Aw} y1={Ap.t+Ah} y2={Ap.t+Ah} stroke="#1e1e1e"/>
            <line x1={Ap.l} x2={Ap.l} y1={Ap.t} y2={Ap.t+Ah} stroke="#1e1e1e"/>
          </svg>
        </div>
        {activeKeys.length>1&&(
          <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
            {activeKeys.map(k=>(
              <div key={k} style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:ARTISTS[k].color}}/>
                <span style={{fontSize:9,color:"#666"}}>{ARTISTS[k].name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── AI VERDICT SYSTEM ── */}
      <div style={{background:"linear-gradient(135deg,#1a1200,#0d0d0d)",border:`1px solid ${C.border}`,borderRadius:4,padding:"18px",marginBottom:16}}>
        <div style={{fontSize:9,letterSpacing:4,color:C.goldDim,textTransform:"uppercase",marginBottom:6}}>Legacy Verdict</div>
        <div style={{fontSize:11,color:"#7a6a50",marginBottom:14,lineHeight:1.7}}>AI analysis across nine axes — four grounded in the data above, four drawn from broader knowledge (flagged), one synthesis.</div>
        <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            {[primary,...comparisons].map((k,i)=>{
              const art=ARTISTS[k];
              return(
                <React.Fragment key={k}>
                  {i>0&&<span style={{fontSize:10,color:"#444"}}>vs</span>}
                  <div style={{width:38,height:38,borderRadius:"50%",background:`${art.color}18`,border:`2px solid ${art.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:art.color,fontFamily:"Georgia,serif",fontWeight:"bold"}}>{art.initials}</div>
                </React.Fragment>
              );
            })}
          </div>
          <button onClick={generate} disabled={loading} style={{padding:"10px 26px",background:loading?`${C.gold}11`:`${C.gold}15`,border:`1px solid ${loading?C.gold+"44":C.gold}`,color:loading?"#555":C.gold,cursor:loading?"not-allowed":"pointer",fontFamily:"Georgia,serif",fontSize:11,borderRadius:2,letterSpacing:2,textTransform:"uppercase",outline:"none",transition:"all 0.2s"}}>
            {loading?"Analyzing...":"Generate Verdict"}
          </button>
        </div>
        {error&&<div style={{fontSize:11,color:C.red,marginTop:10,fontStyle:"italic"}}>{error}</div>}
      </div>

      {/* ── VERDICT DISPLAY ── */}
      {verdict&&(
        <div>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:3,padding:"24px 24px 20px",marginBottom:12}}>
            {verdict.verdict&&verdict.verdict.split("\n\n").map((para,i)=>(
              <p key={i} style={{fontSize:13,color:"#c0aa70",lineHeight:2.0,margin:i===0?"0 0 16px":"16px 0",fontStyle:"italic"}}>{para}</p>
            ))}
            {verdict.replacement&&(
              <div style={{borderTop:`1px solid ${C.border}`,paddingTop:16,marginTop:4}}>
                <div style={{fontSize:8,letterSpacing:3,color:C.goldDim,textTransform:"uppercase",marginBottom:8}}>The Replacement Question</div>
                <p style={{fontSize:12,color:"#8a7a60",lineHeight:1.9,margin:0,fontStyle:"italic"}}>{verdict.replacement}</p>
              </div>
            )}
            {verdict.open_question&&(
              <div style={{borderTop:`1px solid ${C.border}`,paddingTop:12,marginTop:12}}>
                <div style={{fontSize:8,letterSpacing:3,color:"#555",textTransform:"uppercase",marginBottom:6}}>Open Question</div>
                <p style={{fontSize:11,color:"#666",lineHeight:1.7,margin:0,fontStyle:"italic"}}>{verdict.open_question}</p>
              </div>
            )}
          </div>

          {/* AXIS BREAKDOWN */}
          <div style={{marginBottom:12}}>
            <button onClick={()=>setAxisExpanded(v=>!v)} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",cursor:"pointer",fontFamily:"Georgia,serif",padding:"8px 0",outline:"none"}}>
              <span style={{fontSize:9,letterSpacing:2,color:C.goldDim,textTransform:"uppercase"}}>{axisExpanded?"▲ Hide":"▼ View"} Axis Breakdown</span>
              {!axisExpanded&&verdict.dominant_axes&&verdict.dominant_axes.slice(0,3).map(k=>(
                <span key={k} style={{fontSize:8,color:"#555",background:"#1a1a1a",padding:"2px 8px",borderRadius:10}}>{AXIS_LABELS[k]||k}</span>
              ))}
            </button>
            {axisExpanded&&verdict.axis_breakdown&&(
              <div style={{marginTop:10,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:8}}>
                {Object.entries(verdict.axis_breakdown).map(([key,ax])=>{
                  const score=ax.score||0;
                  const color=score>=8?C.green:score>=6?C.gold:"#fb923c";
                  const isDominant=verdict.dominant_axes?.includes(key);
                  return(
                    <div key={key} style={{background:isDominant?"#141200":C.card,border:`1px solid ${isDominant?C.gold+"44":C.border}`,borderLeft:`3px solid ${color}`,borderRadius:3,padding:"10px 13px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                        <div style={{fontSize:8.5,color,letterSpacing:1,textTransform:"uppercase"}}>{AXIS_LABELS[key]||key}</div>
                        <div style={{display:"flex",alignItems:"center",gap:5}}>
                          {ax.data_anchored===false&&<span style={{fontSize:7,color:"#555",background:"#1a1a1a",padding:"1px 5px",borderRadius:8}}>general</span>}
                          {ax.data_anchored===true&&<span style={{fontSize:7,color:C.green+"88",background:"#0d1a0d",padding:"1px 5px",borderRadius:8}}>data</span>}
                          {isDominant&&<span style={{fontSize:7,color:C.gold+"99",background:`${C.gold}11`,padding:"1px 5px",borderRadius:8}}>key</span>}
                          <span style={{fontSize:13,color,fontStyle:"italic"}}>{score}<span style={{fontSize:8,color:"#444"}}>/10</span></span>
                        </div>
                      </div>
                      <div style={{height:2,background:"#1a1a1a",borderRadius:1,marginBottom:7}}><div style={{height:"100%",width:`${score*10}%`,background:color,borderRadius:1,transition:"width 0.5s"}}/></div>
                      <div style={{fontSize:10.5,color:"#7a6a50",lineHeight:1.7}}>{ax.summary}</div>
                    </div>
                  );
                })}
                {verdict.dominant_axes_reasoning&&(
                  <div style={{gridColumn:"1/-1",background:"#0d0d0d",border:`1px solid ${C.border}`,borderRadius:3,padding:"10px 13px"}}>
                    <div style={{fontSize:8,color:C.gold,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Why These Axes</div>
                    <div style={{fontSize:10.5,color:"#7a6a50",lineHeight:1.7}}>{verdict.dominant_axes_reasoning}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CHAT */}
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:3,overflow:"hidden"}}>
            <div style={{padding:"11px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:C.green}}/>
              <span style={{fontSize:9,color:"#666",letterSpacing:1.5,textTransform:"uppercase"}}>Push back, challenge the verdict, request a deeper look</span>
            </div>
            {chat.length>0&&(
              <div style={{maxHeight:340,overflowY:"auto",padding:"12px 16px",display:"flex",flexDirection:"column",gap:12}}>
                {chat.map((m,i)=>(
                  <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                    {m.role==="assistant"&&<div style={{width:26,height:26,borderRadius:"50%",background:`${primaryArtist.color}18`,border:`1px solid ${primaryArtist.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:primaryArtist.color,flexShrink:0,marginTop:2,fontFamily:"Georgia,serif",fontWeight:"bold"}}>{primaryArtist.initials}</div>}
                    <div style={{maxWidth:"78%",background:m.role==="user"?"#0f0f0f":"#141414",border:`1px solid ${m.role==="user"?C.gold+"22":C.border}`,borderRadius:3,padding:"9px 13px",fontSize:11.5,color:m.role==="user"?"#d4c080":"#a09070",lineHeight:1.8,fontStyle:m.role==="assistant"?"italic":"normal"}}>{m.content}</div>
                  </div>
                ))}
                {chatLoading&&<div style={{fontSize:10,color:"#555",fontStyle:"italic",paddingLeft:36}}>Analyzing...</div>}
              </div>
            )}
            <div style={{padding:"11px 14px",display:"flex",gap:8,borderTop:chat.length>0?`1px solid ${C.border}`:"none"}}>
              <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendChat()} placeholder={verdict?"Push back, ask questions, go deeper...":"Generate a verdict first to start the conversation"} disabled={!verdict} style={{flex:1,background:"#0d0d0d",border:`1px solid #2a2a2a`,borderRadius:2,padding:"9px 12px",color:"#d4c080",fontFamily:"Georgia,serif",fontSize:11,outline:"none",caretColor:C.gold,opacity:verdict?1:0.4}}/>
              <button onClick={sendChat} disabled={chatLoading||!chatInput.trim()||!verdict} style={{padding:"9px 16px",background:`${C.gold}15`,border:`1px solid ${C.gold}44`,color:C.gold,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:10,borderRadius:2,outline:"none",letterSpacing:1,opacity:verdict?1:0.4}}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── CONCLUSIONS ──────────────────────────────────────────────────
function ConclusionsTab(){
  const VERDICTS=[
    {rank:"01",color:C.gold,title:"Scorpion leads Depth Rating (89). Take Care leads Legacy Score (85). These are different things.",data:"Scorpion: 11.09M total · 732K FW · Depth Rating 89 · Legacy Score 81 | Take Care: 11.4M total · 631K FW · Depth Rating 88 · Legacy Score 85",body:"Scorpion edges Take Care on raw Depth Rating because it's newer — 86 months elapsed vs 165 for Take Care, so the power-law projection is more generous. But Take Care leads Legacy Score by 4 points because MC:67 drags Scorpion's composite down. This divergence is the model's most interesting finding: the album Drake's most dismissed critically turns out to be his most catalog-driven by streaming, while the album most celebrated critically holds a composite edge. Neither verdict is the whole story."},
    {rank:"02",color:C.red,title:"Beef context is the strongest directional predictor of catalog performance — though the dataset limits at default settings.",data:"Only Scorpion in non-extrapolated conflict group. Full dataset (incl. extrapolated) supports the finding.",body:"At default settings, FATD and SSS4U are extrapolated, leaving only Scorpion in the conflict group. Including all albums, the pattern is consistent: conflict-adjacent albums (Scorpion, FATD, SSS4U) were all released under the shadow of beef and all show higher front-loading when measured across their full career. The mechanism — controversy inflates week-one numbers with casual listeners who leave when the drama ends — is structurally sound even if the sample is small."},
    {rank:"03",color:C.green,title:"Drake's opening-week commercial pull has been remarkably stable across 15 years of critical decline.",data:"FW trend: positive slope across career. SSS4U (246K) debuted #1 post-Kendrick loss.",body:"Views in 2016 reset the commercial ceiling at 1.04M. Even SSS4U — released with minimal rollout, seven months after the most public beef loss in hip-hop history — debuted at #1. The audience kept showing up on week one even when critics had already written a eulogy."},
    {rank:"04",color:C.purple,title:"Critical scores and Depth Rating are measuring completely different things — for Drake specifically.",data:"MC:67 (Scorpion) → highest Depth Rating (89). MC:73 (HN) → mid-table. Views/IYRTITL → lowest Depth Ratings (82).",body:"Scorpion, his most critically dismissed major release, has his highest Depth Rating. Views opened to 1.04M — his commercial peak — and has one of his lowest Depth Ratings alongside IYRTITL. The biggest commercial moments and the lowest critical scores don't predict durability in either direction. His audience and his critics have been grading on diverging curves since around 2016."},
  ];
  return(
    <div>
      <div style={{background:"linear-gradient(135deg,#140a00,#0d0d0d)",border:`1px solid ${C.border}`,borderRadius:4,padding:"24px 26px",marginBottom:20}}>
        <div style={{fontSize:9,letterSpacing:5,color:C.goldDim,textTransform:"uppercase",marginBottom:10}}>The Verdicts</div>
        <div style={{fontSize:12,color:"#5a4a30",lineHeight:1.8}}>What the data says with enough confidence to state directly — findings that hold across multiple normalization windows and model configurations.</div>
      </div>
      <div style={{marginBottom:24}}>
        {VERDICTS.map(v=>(
          <div key={v.rank} style={{background:C.card,border:`1px solid ${v.color}22`,borderLeft:`4px solid ${v.color}`,borderRadius:3,padding:"16px 20px",marginBottom:10}}>
            <div style={{fontSize:13,color:"#d4c080",fontStyle:"italic",marginBottom:6,lineHeight:1.5}}>{v.title}</div>
            <div style={{fontSize:10,color:v.color,marginBottom:10,opacity:0.8}}>{v.data}</div>
            <div style={{fontSize:11.5,color:"#6a5a40",lineHeight:1.9}}>{v.body}</div>
          </div>
        ))}
      </div>
      <div style={{background:"#0a0a0a",border:`1px solid ${C.border}`,borderRadius:3,padding:"18px 20px",marginBottom:20}}>
        <div style={{fontSize:9,letterSpacing:5,color:C.goldDim,textTransform:"uppercase",marginBottom:14}}>Most Interesting Non-Obvious Takeaways</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(350px,1fr))",gap:12}}>
          {[
            {color:C.gold,   title:"For Drake's legacy, there is no comfortable middle.",body:"The Iceman predictor reveals a compression in Drake's current legacy range. A standard release clusters with SSS4U, CLB, and Her Loss and looks like more of the same. Only an album that genuinely breaks the pattern — lean tracklist, real critical reception, lower debut against strong long-term total — separates itself. The model isn't predicting failure. It's showing where the bar actually is."},
            {color:C.teal,   title:"Surprise drops look more durable than they are — the model partially corrects but can't fully eliminate it.",body:"IYRTITL, Honestly Nevermind, and SSS4U all show higher Depth Ratings than standard-rollout counterparts. Part is genuine. But part is mechanical: week one is suppressed by the rollout format itself. The normalization window helps, but if week one is smaller due to distribution lag rather than fan behavior, the ratio still flatters surprise albums."},
            {color:"#10b981",title:"J. Cole's Grammy record (1 win from 14 nominations) is the most damning data point against the 'Grammys reward authenticity' argument.",body:"Cole never boycotted. Never had bad press. Forest Hills Drive went platinum with zero singles — the purest organic catalog in the entire dataset. His critical reputation has been consistently strong. Yet 1 Grammy win. If the Academy were simply rewarding authentic hip-hop, Cole's record would look nothing like this. The gap between Cole and Kendrick's Grammy treatment tells you the institution rewards something more specific."},
            {color:C.orange, title:"The NLU paradox is genuinely unresolved — and the lawsuit dismissal made it permanent.",body:"The song can be simultaneously a genuine cultural phenomenon AND potentially algorithmically amplified. The dismissal means the ratio will never be formally examined. Drake's philosophical point — that you cannot use an allegation like a weapon and then disclaim its literal truth to escape liability — is the most intellectually honest thing anyone said about the moment, even if his legal strategy was poorly constructed."},
            {color:"#fbbf24",title:"Every major institution with a platform gave Kendrick the biggest one available in the same 12-month window.",body:"Grammy sweep (Feb 2, 2025). Super Bowl halftime (Feb 9, 2025). Pulitzer Prize already in the bank (2018). Critical press unanimity during the beef. Four separate institutions making independent decisions. The institutional pattern is not coincidental — it reflects a longstanding alignment between Kendrick's thematic content and the approval criteria of the critical establishment, now culminating in a moment where commercial and cultural narratives converged."},
            {color:C.blue,   title:"The pre-streaming era albums are probably Drake's most undervalued.",body:"Take Care, NWTS, and Thank Me Later built enormous catalog streaming after February 2016 — representing genuine organic rediscovery, playlist inclusion, and introduction to younger audiences. The pre-stream toggle hides them for fair comparison, but excluding them from the legacy conversation entirely is wrong. Take Care's 11.4M total is built substantially on post-2016 discovery — a stronger durability signal than any recent album can yet show."},
          ].map(({color,title,body})=>(
            <div key={title} style={{background:C.card,border:`1px solid ${color}22`,borderTop:`2px solid ${color}`,borderRadius:3,padding:"14px 16px"}}>
              <div style={{fontSize:11.5,color:"#c0aa70",fontStyle:"italic",marginBottom:8,lineHeight:1.5}}>{title}</div>
              <div style={{fontSize:11,color:"#7a6a50",lineHeight:1.85}}>{body}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:3,padding:"18px 20px",marginBottom:20}}>
        <div style={{fontSize:9,letterSpacing:5,color:C.goldDim,textTransform:"uppercase",marginBottom:14}}>What This Data Cannot Tell You</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:10}}>
          {[
            {head:"What the data cannot tell you",body:"Whether any of the streaming numbers were manipulated. Whether critical consensus was coordinated or organic. Whether Drake genuinely has a secret daughter. Whether Kendrick's allegations are morally defensible even if legally classified as hyperbole. The model measures what happened in streaming databases — it cannot audit those databases, and it cannot resolve moral or factual questions that exist outside of them."},
            {head:"What 'Depth Rating' is and isn't",body:"It's a ratio, not an absolute quality measure. An album can have a high Depth Rating because it's genuinely beloved and people keep returning to it. It can also score high because it had a suppressed week-one denominator (surprise drop) or because the audience was small but loyal. The score is a useful lens, not a verdict."},
            {head:"Peer data is directional, not audited",body:"Drake's totals are Luminate-confirmed as of September 5, 2025. Peer totals are estimated from RIAA certifications, Billboard data, and public reporting. The legends tier (Jay-Z, Wayne, Eminem) used physical-era sales figures for opening week — not equivalent to streaming-era first-week numbers. Cross-era comparisons should be read as directional."},
          ].map(({head,body})=>(
            <div key={head} style={{borderLeft:"2px solid #2a2a2a",paddingLeft:12}}>
              <div style={{fontSize:10,color:"#666",letterSpacing:1,marginBottom:5,textTransform:"uppercase"}}>{head}</div>
              <div style={{fontSize:11,color:"#7a6a50",lineHeight:1.8}}>{body}</div>
            </div>
          ))}
        </div>
      </div>

            <div style={{background:"linear-gradient(135deg,#0f0a00,#0a0a0a)",border:`1px solid ${C.border}`,borderRadius:3,padding:"20px 24px"}}>
        <div style={{fontSize:9,letterSpacing:5,color:C.goldDim,textTransform:"uppercase",marginBottom:12}}>Final Statement</div>
        <div style={{fontSize:12.5,color:"#8a7a60",lineHeight:2.1,fontStyle:"italic"}}>
          "The stream data doesn't have an agenda. It counts. In ten years the Depth Ratings and Legacy Scores will tell a story no press cycle can manufacture, no Grammy committee can award, and no lawsuit dismissal can suppress. Whatever that story turns out to be, this is what the numbers looked like on September 5, 2025."
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
        <thead><tr><Th k="title" label="Album"/><Th k="release" label="Released"/><Th k="fw" label="Opening Week" right/><Th k="total" label="Total" right/><Th k="catalog" label="Catalog" right/><Th k="tracks" label="Trk" right/><Th k="perTrack" label="Per Trk" right/><Th k="meta" label="MC" right/><Th k="depthRating" label="Depth Rating ↑" right/><Th k="legacyScore" label="Legacy Score ↑" right/></tr></thead>
        <tbody>{sorted.map(a=>(<tr key={a.id} style={{borderBottom:"1px solid #141414"}}>
          <td style={{padding:"8px 10px"}}><div style={{fontStyle:"italic",color:"#d4c080"}}>{a.title}</div><div style={{display:"flex",gap:5,marginTop:2,flexWrap:"wrap"}}>{a.collab&&<span style={{fontSize:8,color:"#444"}}>w/ {a.collab}</span>}{a.preStream&&<span style={{fontSize:8,color:C.blue}}>pre-stream</span>}{a.surprise&&<span style={{fontSize:8,color:"#9ca3af"}}>surprise</span>}{a.beefContext&&<span style={{fontSize:8,color:C.red}}>🥊 {BEEF_CTX[a.beefContext]?.label}</span>}</div></td>
          <td style={{padding:"8px 10px",color:"#7a6a50"}}>{a.release}</td>
          <td style={{padding:"8px 10px",textAlign:"right",color:"#b0a080"}}>{fmt(a.fw)}</td>
          <td style={{padding:"8px 10px",textAlign:"right",color:"#b0a080"}}>{fmt(a.total)}</td>
          <td style={{padding:"8px 10px",textAlign:"right",color:"#8a7a60"}}>{fmt(a.catalog||0)}</td>
          <td style={{padding:"8px 10px",textAlign:"right",color:"#7a6a50"}}>{a.tracks}</td>
          <td style={{padding:"8px 10px",textAlign:"right",color:"#7a6a50"}}>{a.perTrack?fmt(a.perTrack):"—"}</td>
          <td style={{padding:"8px 10px",textAlign:"right"}}><span style={{color:mcClr(a.meta)}}>{a.meta||"—"}</span></td>
          <td style={{padding:"8px 10px",textAlign:"right",color:a.extrapolated?"#333":C.gold}}>{a.depthRating||"—"}{a.extrapolated&&<span style={{fontSize:7,color:"#333",marginLeft:2}}>⚠</span>}</td>
          <td style={{padding:"8px 10px",textAlign:"right"}}><span style={{color:legacyClr(a.legacyScore)}}>{a.legacyScore||"—"}</span></td>
        </tr>))}</tbody>
      </table>
    </div>
    <SLabel>Methodology</SLabel>
    {[
      {title:"Model Presets",body:"Four presets set the normalization window and decay speed together. Default (30mo / 0.5) is the general-purpose baseline. Legacy Test (48mo / 0.3) is the strictest measure — only albums with deep sustained catalog replay rank well here. Recent Pulse (18mo / 0.7) weights current streaming behavior most heavily. Deep Catalog (42mo / 0.3) uses the longest window with the slowest decay, where the quiet/conflict split becomes most visible. Adjusting sliders manually after selecting a preset overrides it."},
      {title:"Depth Rating (higher = better, 0–100)",body:"The percentage of an album's total projected streaming life that came AFTER week one, expressed as a 0–100 score. A Depth Rating of 92 means 92% of the album's listening life still lay ahead after week one. Higher is always better. At default settings, Scorpion leads Drake's catalog on Depth Rating (89), with Take Care close behind (88) — the divergence explained by elapsed time in the model. Think of it like a movie's opening weekend vs total box office: event films spike and fade, classics build."},
      {title:"Legacy Score (higher = better, 0–100)",body:"A composite 0–100 score: Depth Rating (60%) + Metacritic score (25%) + catalog-to-opening-week multiple (15%). It rewards albums that hold their replay, earn critical respect, and keep accumulating streams relative to their debut size. Scorpion shows how the two metrics can diverge: high Depth Rating but MC:67 pulls the Legacy Score down. When Depth Rating and Legacy Score diverge, that divergence is usually the most interesting thing to look at."},
      {title:"Best Depth Rating vs Top Legacy Score",body:"The Rankings stat bar shows two different album highlights. Best Depth Rating is the album with the highest post-week-one streaming fraction — most catalog-driven. Top Legacy Score is the album with the highest composite 0–100 score. They're sometimes the same album, sometimes not. When they differ, it usually means the best Depth Rating album has a weak Metacritic that drags its composite down."},
      {title:"Pre-Streaming Era",body:"Thank Me Later, Take Care, and Nothing Was the Same released before Billboard counted streaming equivalents (February 2016). Their Luminate totals include catalog built before streaming was tracked. Their Depth Rating is real — the mechanism is just different. The Streaming Era Only toggle hides them for a clean like-for-like comparison."},
      {title:"Release Classification & Non-Studio Projects",body:"Studio albums are the default ranked set. The toggle adds non-studio categories: WATTBA and Dark Lane Demo Tapes were released as mixtapes but charted commercially and have full streaming data. IYRTITL is classified as a studio album per Drake's own framing — Luminate/Billboard counted it as such and it has fully comparable streaming data. More Life is classified as a playlist (Drake's own term at release) and excluded from studio rankings by default. Care Package (2019) is a compilation of previously released non-album tracks. Room for Improvement, Comeback Season, and So Far Gone predate streaming measurement entirely and are shown as historical context only."},
      {title:"HN + HL Double Album Toggle",body:"Drake framed CLB, Honestly Nevermind, and Her Loss as a trilogy. The toggle treats HN and HL as one combined project: 608K FW, 5.03M total, 30 tracks, MC ~67. Useful for seeing how they compete as a unit. Toggle off to analyze them individually."},
      {title:"Peer Data",body:"Drake totals: Luminate confirmed Sept 5, 2025. GKMC: confirmed ≥10M (Jan 2026 milestone). Astroworld: RIAA 6× Platinum floor. All other peer totals: triangulated from RIAA certifications and Billboard chart data. Legends tier (Jay-Z, Wayne, Eminem) FW numbers are physical-era sales and are not comparable to streaming-equivalent opening weeks. All peer rankings are directional."},
    ].map(({title,body})=>(
      <div key={title} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:3,padding:"13px 17px",marginBottom:9}}>
        <div style={{fontSize:10,color:C.gold,letterSpacing:1.5,textTransform:"uppercase",marginBottom:7}}>{title}</div>
        <div style={{fontSize:12,color:"#7a6a50",lineHeight:1.9}}>{body}</div>
      </div>
    ))}
  </>);
}

// ── STUB TABS (preserved from original) ──────────────────────────
function LegitimacyTab(){
  const [showCounter,setShowCounter]=useState(true);
  const verdictLabels={win:"W",loss:"L",cultural:"⚡",neutral:"—",opening:"🎯",response:"↩",buried:"💀",filed:"⚖",dismissed:"✗",awarded:"🏆"};
  return(<>
    <InfoBox color={C.red}><span style={{color:C.red}}>Analytical framework.</span> This tab presents Drake's allegations and the logical arguments he has made — in his lawsuits, public statements, and through his team — alongside factual counterpoints. Where claims are disputed or alleged, they are labeled as such. This is not a verdict; it is a structured examination of the evidence as it exists publicly.</InfoBox>

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
          <div style={{fontSize:8,color:"#666",letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>{label}</div>
          <div style={{fontSize:15,color,fontStyle:"italic",marginBottom:2}}>{value}</div>
          <div style={{fontSize:9,color:"#666"}}>{note}</div>
        </div>
      ))}
    </div>

    <SLabel>Timeline of Events — Beef Through Legal Aftermath</SLabel>
    <div style={{display:"flex",gap:16,marginBottom:14,flexWrap:"wrap"}}>
      {[{c:C.purple,l:"Kendrick"},{c:C.gold,l:"Drake"},{c:C.orange,l:"Industry"}].map(({c,l})=>(
        <div key={l} style={{display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:c,flexShrink:0}}/>
          <span style={{fontSize:9,color:"#777"}}>{l}</span>
        </div>
      ))}
    </div>
    <div style={{marginBottom:22}}>
      {BEEF_TIMELINE.map((e,i)=>{
        const aC=e.actor==="Kendrick"?C.purple:e.actor==="Drake"?C.gold:C.orange;
        return(
          <div key={i} style={{display:"flex",gap:12,marginBottom:8,alignItems:"flex-start"}}>
            <div style={{width:110,flexShrink:0,paddingTop:2}}><div style={{fontSize:9,color:"#777"}}>{e.date}</div></div>
            <div style={{flex:1,background:C.card,border:`1px solid ${C.border}`,borderLeft:`2px solid ${aC}`,borderRadius:3,padding:"9px 12px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                <span style={{fontSize:12,color:aC,fontStyle:"italic"}}>{e.event}</span>
                <span style={{fontSize:8,color:"#777",background:"#1a1a1a",padding:"1px 6px",borderRadius:10}}>{e.actor}</span>
                {e.verdict&&<span style={{fontSize:9,color:"#777",background:"#1a1a1a",padding:"1px 7px",borderRadius:10}}>{verdictLabels[e.verdict]} {e.verdict}</span>}
              </div>
              <div style={{fontSize:10.5,color:"#7a6a50",lineHeight:1.75}}>{e.desc}</div>
            </div>
          </div>
        );
      })}
    </div>

    <SLabel>The Central Paradox — Drake's Philosophical Argument</SLabel>
    <div style={{background:C.card,border:`1px solid ${C.red}33`,borderRadius:3,padding:"20px 22px",marginBottom:16}}>
      <div style={{fontSize:10,color:C.red,letterSpacing:3,textTransform:"uppercase",marginBottom:14}}>The Logic Chain</div>
      {[
        {n:"1",color:C.purple,title:"NLU's power rested on a specific allegation",body:"The song's hook — 'certified pedophile' — was not abstract criticism. It was a specific criminal characterization of a named, living person. The song's cultural dominance required people to engage with that allegation as if it had weight."},
        {n:"2",color:C.orange,title:"Courts ruled the allegations legally non-factual",body:"Drake's defamation claims were dismissed at the pleading stage. The standard applied: these lyrics constitute hyperbolic artistic expression that 'no reasonable person' would interpret as a literal verifiable claim. No discovery occurred. The court never examined whether manipulation happened. The dismissal is a procedural outcome, not an empirical verdict on the facts."},
        {n:"3",color:C.red,title:"This creates a contradiction the culture has not resolved",body:"If no reasonable person believed the claims were literally true, what exactly were 600 million streams celebrating? Either people knew it wasn't literally true but celebrated it anyway — tribalism, not truth — or the legal standard is wrong and people did believe it, in which case the Grammys awarded Song of the Year for a smear that worked."},
        {n:"4",color:C.gold,title:"Drake's argument: the industry manufactured both the moment AND the legal shield",body:"If the allegations were amplified by machines to reach cultural saturation — and then the same institutions that amplified it disclaim its literal truth to escape legal liability — then the damage was done by design and the escape hatch was pre-planned. You can't claim it was just music after you used it like a weapon."},
        {n:"5",color:"#9ca3af",title:"The counterargument that doesn't land",body:"'F*ck tha Police' also wasn't a policy white paper. Art has always used hyperbole. The difference: NLU named a real living person with a specific charge that ends careers, was amplified by the largest music company in the world, and was then submitted for and won every Grammy category available. The institutional validation of the allegation is what makes it different from standard rap hyperbole."},
        {n:"6",color:C.red,title:"What ties it together: this is the structure of disinformation",body:"Disinformation doesn't require anyone to literally believe a false claim. It works by producing a social effect — a verdict, a feeling, a consensus — that operates independently of whether any underlying assertion is true. The court ruling that 'no reasonable person' would take NLU's allegations as literal fact is the legal articulation of that same mechanism. The damage was designed to survive the disclaimer. That is the mechanism."},
      ].map(({n,color,title,body})=>(
        <div key={n} style={{display:"flex",gap:14,marginBottom:14,alignItems:"flex-start"}}>
          <div style={{width:26,height:26,borderRadius:"50%",background:`${color}20`,border:`1px solid ${color}44`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:11,color,fontStyle:"italic"}}>{n}</div>
          <div>
            <div style={{fontSize:11.5,color:"#c0aa70",marginBottom:4,fontStyle:"italic"}}>{title}</div>
            <div style={{fontSize:11,color:"#7a6a50",lineHeight:1.8}}>{body}</div>
          </div>
        </div>
      ))}
    </div>

    <SLabel>Botting Allegations — What Was Claimed, What Was Dismissed, What Was Never Tested</SLabel>
    <div style={{marginBottom:20}}>
      <div style={{background:"#0f0f0f",border:`1px solid ${C.orange}22`,borderRadius:3,padding:"14px 16px",marginBottom:14,fontSize:11,color:"#777",lineHeight:1.8}}>
        <span style={{color:C.orange}}>Critical distinction.</span> Drake's stream manipulation lawsuits were dismissed at the <em>pleading stage</em> — meaning the court evaluated whether the legal claims as written could survive, not whether the underlying facts were true or false. No discovery occurred. Spotify and UMG's internal data was never examined by any court. Dismissal is a legal outcome, not an empirical verdict.
      </div>
      {[
        {n:"What Drake specifically alleged",color:C.red,items:[
          "UMG hired a third-party company to artificially inflate NLU streams by hundreds of millions via automated bot networks",
          "Spotify participated in or enabled coordinated editorial playlist manipulation to suppress Drake's response tracks while amplifying NLU",
          "Drake's team claimed to possess streaming data analysis showing anomalous velocity patterns inconsistent with organic listening behavior",
          "Podcast hosts and hip-hop media figures were allegedly compensated to provide one-sided commentary favorable to the Kendrick narrative",
        ]},
        {n:"Why the suits were dismissed",color:"#9ca3af",items:[
          "Tortious interference claims require proving intentional, improper interference with specific business relationships — hard to establish at pleading stage without discovery",
          "Defamation claims for the lyrics failed because 'certified pedophile' in a rap diss context is legally classified as hyperbolic opinion, not a factual assertion",
          "The court did not rule that no manipulation occurred. It ruled Drake hadn't pleaded it in a legally actionable way",
        ]},
        {n:"What was never tested",color:C.orange,items:[
          "The actual Spotify stream velocity data for NLU vs contemporaneous tracks — this would show if the growth curve was anomalous",
          "Internal UMG communications about NLU's campaign strategy during the beef period",
          "Editorial playlist decision logs — who added NLU to which playlists, when, and what the comparable adds were for Drake tracks",
          "The financial relationship between pgLang/Kendrick's team and any media figures who covered the beef",
        ]},
        {n:"Known context: stream manipulation is real and documented",color:C.teal,items:[
          "Stream fraud is a well-documented industry problem — Spotify has removed billions of fraudulent streams from its platform across many artists",
          "Multiple music industry investigations documented coordinated stream manipulation services operating at scale",
          "Drake's claim isn't that botting is impossible — it's that it happened here specifically. That claim deserved discovery. It didn't get it.",
          "The absence of proof is not proof of absence, especially when the party with the proof (Spotify/UMG internal data) was the defendant",
        ]},
      ].map(({n,color,items})=>(
        <div key={n} style={{background:C.card,border:`1px solid ${color}25`,borderLeft:`3px solid ${color}`,borderRadius:3,padding:"14px 16px",marginBottom:10}}>
          <div style={{fontSize:10,color,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>{n}</div>
          {items.map((item,i)=>(
            <div key={i} style={{display:"flex",gap:10,marginBottom:7,alignItems:"flex-start"}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:color,flexShrink:0,marginTop:5,opacity:0.6}}/>
              <div style={{fontSize:11,color:"#7a6a50",lineHeight:1.75}}>{item}</div>
            </div>
          ))}
        </div>
      ))}
      <div style={{background:C.card,border:`1px solid #fbbf2433`,borderRadius:3,padding:"16px 18px",marginTop:6,marginBottom:14}}>
        <div style={{fontSize:10,color:"#fbbf24",letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>The Epistemological Problem</div>
        <div style={{fontSize:11.5,color:"#7a6a50",lineHeight:2}}>
          NLU's 70.9M first-week streams made it the largest debut of any song in Kendrick's career by a significant margin. Compare: "luther" ft. SZA — a smooth, accessible R&B crossover — debuted at 44.4M first-week streams on GNX. A diss track about one specific named person outperformed one of the most commercially accessible songs Kendrick has ever made by roughly 60%. Either NLU was genuinely that much more culturally explosive — or the floor of its number wasn't entirely organic. The lawsuit's dismissal ensures we never find out the ratio.
        </div>
      </div>
    </div>

    <SLabel>The Super Bowl — Feb 9, 2025</SLabel>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:3,padding:"16px 18px",marginBottom:20}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:16}}>
        <div>
          <div style={{fontSize:10,color:C.red,letterSpacing:1.5,marginBottom:8,textTransform:"uppercase"}}>The Sequence</div>
          <div style={{fontSize:11,color:"#7a6a50",lineHeight:1.9}}>Feb 2: Suits dismissed. "Certified pedophile" ruled legally non-factual hyperbole.<br/>Feb 9: Kendrick performs NLU at Super Bowl LIX. 133.5M viewers — most-watched halftime show in history. Trump in attendance — first sitting president at a Super Bowl.<br/><br/>Seven days. The man the court legally cleared watched a 133M-person singalong of that allegation. Booking predated the beef — but the sequence is documented fact.</div>
        </div>
        <div>
          <div style={{fontSize:10,color:C.teal,letterSpacing:1.5,marginBottom:8,textTransform:"uppercase"}}>The Performance</div>
          <div style={{fontSize:11,color:"#7a6a50",lineHeight:1.9}}>Kendrick opened driving out of a 1980s Buick GNX. Samuel L. Jackson appeared as Uncle Sam. Serena Williams crip-walked during NLU. Kendrick teased mid-show: "I wanna play their favorite song, but you know they love to sue." The crowd sang the "A minor" line in unison.</div>
        </div>
        <div>
          <div style={{fontSize:10,color:"#fbbf24",letterSpacing:1.5,marginBottom:8,textTransform:"uppercase"}}>The Counterpoint</div>
          <div style={{fontSize:11,color:"#7a6a50",lineHeight:1.9}}>Halftime bookings happen 12–18 months in advance. The NFL selected Kendrick in 2024 before NLU existed. The 7-day gap between dismissal and performance is scheduling, not coordination — the strongest counterargument. It does not resolve what the optics produced regardless of intent.</div>
        </div>
      </div>
    </div>

    <SLabel>Industry Optics Scorecard</SLabel>
    <Toggle on={showCounter} set={setShowCounter} label="Show counterpoints" color={C.teal}/>
    <div style={{marginTop:12}}>
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
              <div style={{fontSize:11,color:"#7a6a50",lineHeight:1.75}}>{item.note}</div>
            </div>
          </div>
        </div>
      );
    })}
    </div>

    <div style={{marginTop:32}}><SLabel>Conclusion — What The Record Shows</SLabel></div>
    <div style={{background:"linear-gradient(135deg,#0f0800,#0a0a0a)",border:`1px solid ${C.border}`,borderRadius:3,padding:"22px 24px"}}>
      {[
        {color:C.red,   n:"1", head:"The legal outcome settled nothing factually.",
         body:"Claims dismissed at pleading — before any discovery, before any internal data was examined. A pleading dismissal means the claims weren't sufficiently stated as legal arguments. It is not a finding that the underlying events did not occur."},
        {color:"#fbbf24",n:"2", head:"The Grammy sweep institutionalized a claim the court called legally non-factual.",
         body:"In the same window where a court ruled no reasonable person would interpret NLU's allegations as literal fact, the Recording Academy gave the song Record of Year, Song of Year, Best Rap Song, Best Melodic Rap, and Best Music Video. The industry's highest recognition treated as its peak achievement a work the legal system classified as non-factual opinion."},
        {color:C.purple, n:"3", head:"The structure is disinformation regardless of intent.",
         body:"Disinformation doesn't require a conspiracy. It works when content is engineered to produce a social verdict — a feeling, a consensus, a reputation — that operates independently of whether its underlying claims are literally true. The critical press reviewed NLU as art. The Grammy apparatus rewarded it as achievement. The legal system dismissed its central allegation as non-factual. None of these institutions had to coordinate. Each was doing exactly what it was designed to do."},
        {color:C.teal,   n:"4", head:"The data has a longer memory than the narrative.",
         body:"Everything documented in this tab is frozen in the public record as of September 2025. The streaming data keeps moving. Depth Ratings and Legacy Scores will render verdicts no press cycle can manufacture and no Grammy committee can award. Whatever the media said in 2024, the catalog scores will render a verdict in 2034 that no one can manipulate."},
      ].map(({color,n,head,body})=>(
        <div key={n} style={{display:"flex",gap:16,marginBottom:20,alignItems:"flex-start"}}>
          <div style={{width:28,height:28,borderRadius:"50%",background:`${color}18`,border:`1px solid ${color}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:12,color,fontStyle:"italic",marginTop:2}}>{n}</div>
          <div>
            <div style={{fontSize:12,color:"#c0aa70",fontStyle:"italic",marginBottom:6,lineHeight:1.5}}>{head}</div>
            <div style={{fontSize:11,color:"#7a6a50",lineHeight:1.9}}>{body}</div>
          </div>
        </div>
      ))}
      <div style={{borderTop:`1px solid ${C.border}`,paddingTop:16,marginTop:4,fontSize:11,color:"#7a6a50",lineHeight:2,fontStyle:"italic"}}>
        "The song that couldn't be proven in court became the song of the year. The artist who couldn't be disproven in culture had his lawsuit dismissed. The institutions processed the same event through their own logic and produced a consensus that no single institution was actually responsible for. That is not how corruption works. That is how narrative works."
      </div>
    </div>
  </>);
}

function AwardsTab(){
  const maxWins=Math.max(...GRAMMY_DATA.map(a=>a.wins));
  const maxNoms=Math.max(...GRAMMY_DATA.map(a=>a.noms));
  return(<>
    <InfoBox color={"#fbbf24"}>Grammy data is approximate — counts shift as categories merge/rename. Drake's 2022 voluntary withdrawal makes direct comparisons to Kendrick's trajectory uneven. Read as directional, not exact.</InfoBox>

    <SLabel>Grammy Wins vs Nominations — Hip-Hop Era</SLabel>
    <div style={{overflowX:"auto",marginBottom:20}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:11.5,minWidth:600}}>
        <thead><tr>{["Artist","Wins","Nominations","Win Rate","Wins Bar","Outsider Persona","Withdrew"].map((h,i)=>(<th key={h} style={{fontSize:8,letterSpacing:2,textTransform:"uppercase",color:C.goldDim,textAlign:i>1?"center":"left",padding:"8px 10px",borderBottom:`1px solid ${C.border}`}}>{h}</th>))}</tr></thead>
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
            {g.note&&<div style={{fontSize:10,color:"#7a6a50"}}>{g.note}</div>}
          </div>
        </div>
      ))}
      <div style={{background:"#0f0f0f",border:`1px solid ${C.red}22`,borderRadius:3,padding:"14px 16px",marginTop:12}}>
        <div style={{fontSize:9,color:C.red,letterSpacing:3,textTransform:"uppercase",marginBottom:8}}>The Institutional Irony</div>
        <div style={{fontSize:11.5,color:"#7a6a50",lineHeight:1.9}}>
          In the same window where a court ruled no reasonable person would interpret NLU's allegations as literal fact, the Recording Academy gave the song Record of Year, Song of Year, Best Rap Song, Best Melodic Rap, and Best Music Video. The industry's highest recognition treated as its peak achievement a work the legal system classified as non-factual opinion.
        </div>
      </div>
    </div>

    <SLabel>Luther (ft. SZA) — The Victory Lap Single</SLabel>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:8,marginBottom:12}}>
      {[
        {label:"First-Week Streams",value:fmt(LUTHER_DATA.fwStreams),   color:C.purple,note:"Largest single-week debut of Kendrick's career"},
        {label:"Total Streams",     value:fmt(LUTHER_DATA.totalStreams),color:C.purple,note:"As of data cutoff"},
        {label:"Hot 100 Peak",      value:`#${LUTHER_DATA.hot100Peak}`, color:C.gold,  note:""},
        {label:"Weeks at #1",       value:`${LUTHER_DATA.weeksAt1} wks`,color:C.green, note:"Consecutive"},
        {label:"Album",             value:"GNX",                        color:"#9ca3af",note:"Nov 22, 2024 surprise drop"},
      ].map(({label,value,color,note})=>(
        <div key={label} style={{background:C.card,border:`1px solid ${color}22`,borderLeft:`2px solid ${color}`,borderRadius:3,padding:"9px 11px"}}>
          <div style={{fontSize:7.5,color:"#666",letterSpacing:2,textTransform:"uppercase",marginBottom:3}}>{label}</div>
          <div style={{fontSize:14,color,fontStyle:"italic",marginBottom:2}}>{value}</div>
          {note&&<div style={{fontSize:8.5,color:"#666"}}>{note}</div>}
        </div>
      ))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
      <div style={{background:C.card,border:`1px solid ${C.purple}22`,borderRadius:3,padding:"14px 16px"}}>
        <div style={{fontSize:10,color:C.purple,letterSpacing:1.5,marginBottom:8,textTransform:"uppercase"}}>What Luther Proves (One Reading)</div>
        <div style={{fontSize:11,color:"#7a6a50",lineHeight:1.85}}>Luther's 44.4M first-week streams — on a non-beef, non-diss, SZA-assisted love song from a surprise album — demonstrates that Kendrick expanded his commercial position as a result of the 2024 moment. Whether that ceiling expansion was earned organically or amplified by machinery, the result is the same: Kendrick's commercial position post-beef is stronger than before it.</div>
      </div>
      <div style={{background:C.card,border:`1px solid ${C.gold}22`,borderRadius:3,padding:"14px 16px"}}>
        <div style={{fontSize:10,color:C.gold,letterSpacing:1.5,marginBottom:8,textTransform:"uppercase"}}>What Luther Complicates (Other Reading)</div>
        <div style={{fontSize:11,color:"#7a6a50",lineHeight:1.85}}>NLU outperformed Luther by roughly 60%. A diss track about one specific named person, with no radio campaign, no advance notice, and no pop crossover appeal, debuted 60% higher than a smooth R&B love song featuring one of pop's biggest names. Either NLU was genuinely that much more culturally explosive — or part of its number had a floor that wasn't entirely organic. The comparison doesn't resolve the question. It sharpens it.</div>
      </div>
    </div>
    <div style={{background:"#0f0f0f",border:`1px solid #9ca3af22`,borderRadius:3,padding:"14px 16px",marginBottom:20}}>
      <div style={{fontSize:9,color:"#9ca3af",letterSpacing:3,textTransform:"uppercase",marginBottom:8}}>GNX Strategic Timing Note</div>
      <div style={{fontSize:11,color:"#7a6a50",lineHeight:1.85}}>{GNX_DATA.grammarWindowNote} {GNX_DATA.strategicNote}</div>
    </div>

    <SLabel>The Outsider Paradox</SLabel>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:12}}>
      {[
        {color:C.purple,title:"Kendrick's Positioning",body:"Throughout his career Kendrick has positioned himself as the artist the industry can't fully contain. Yet: 17 Grammy wins, Pulitzer Prize (the most establishment literary honor in America), 5 categories swept at a single ceremony with a diss track, and a promotional deal signed days before his biggest cultural volley. The outsider narrative and the institutional darling outcomes exist simultaneously."},
        {color:C.gold,  title:"Drake's Positioning",  body:"Drake has positioned himself as commercially transparent, unapologetically commercial, industry-savvy. He was signed to Young Money, distributed through Cash Money, then Republic/UMG — and made no bones about it. Yet: 4 Grammy wins from 51 nominations (7.8% rate), public withdrawal from Grammy eligibility, and multiple lawsuits alleging the industry coordinated against him. The commercially integrated artist is claiming the institutional apparatus was weaponized against him by the artist positioned as its critic."},
        {color:"#10b981",title:"J. Cole: The Third Data Point",body:"Cole's Grammy record (1 win, 14 nominations) adds a useful reference point. Forest Hills Drive went platinum with zero singles — organic catalog durability at its purest. Cole never boycotted. Never had bad press. Never made a genre-defying left turn. Yet he has 1 Grammy win. If the Recording Academy were simply rewarding authentic or critically-regarded hip-hop, Cole's record would look nothing like this. The gap between Cole and Kendrick's Grammy treatment tells you the institution is rewarding something more specific than authenticity."},
        {color:C.teal,  title:"What the Data Suggests",body:"The Grammy apparatus rewards artists who move the cultural conversation in directions the institution approves of — which is not the same as rewarding outsider authenticity or commercial success. Kendrick's work consistently engages with themes that earn critical establishment approval. Drake's work — honest about commerce, pleasure, status, heartbreak — doesn't translate well to awards narratives even when it's streaming twice as much. The Grammys aren't measuring music. They're measuring whether the music's themes can be incorporated into the institution's own self-image."},
      ].map(({color,title,body})=>(
        <div key={title} style={{background:C.card,border:`1px solid ${color}22`,borderTop:`2px solid ${color}`,borderRadius:3,padding:"14px 16px"}}>
          <div style={{fontSize:10,color,letterSpacing:1.5,marginBottom:8,textTransform:"uppercase"}}>{title}</div>
          <div style={{fontSize:11,color:"#7a6a50",lineHeight:1.9}}>{body}</div>
        </div>
      ))}
    </div>
  </>);
}

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
        "Their cultural takes have always been classically hipster, in that they're not brave enough to be anything but cynical if given the chance. Their reviews aren't about the music — it's about a nebulously defined, abstract sub-layer that they attach to the music. A string of assumptions stitched together by a non-sequitur thesis, verging on sophistry, and with the exact same effect as disinformation. What they excel at is PR, the lie that they're in a vaunted position of intellectual authority."
      </div>
      <div style={{fontSize:9,color:"#555",marginTop:10,letterSpacing:2}}>SOURCE: REDDIT THREAD ON PITCHFORK CRITICISM — ADAPTED</div>
      <div style={{fontSize:11,color:"#7a6a50",marginTop:12,lineHeight:1.85,borderTop:"1px solid #1a1a1a",paddingTop:12}}>
        That phrase — <em>the exact same effect as disinformation</em> — is the connective tissue between this tab and the NLU Conspiracy tab. Disinformation doesn't require the person spreading it to believe a literal falsehood. It works by manufacturing a feeling — a social verdict — that operates independently of whether any underlying claim is true. The court ruling that "no reasonable person" would take NLU's allegations as literal fact is, functionally, the legal definition of that same mechanism: content designed to produce an effect rather than convey a truth.
      </div>
    </div>

    <SLabel>Pitchfork Score Trajectories — Drake vs Kendrick</SLabel>
    <div style={{overflowX:"auto",marginBottom:6}}>
      <svg width={W} height={H} style={{minWidth:W,background:"#0d0d0d",borderRadius:3}}>
        {[6,7,8,9,10].map(v=>(<g key={v}><line x1={pad.l} x2={pad.l+w} y1={sy(v)} y2={sy(v)} stroke="#161616"/><text x={pad.l-5} y={sy(v)+4} textAnchor="end" fill="#666" fontSize={9}>{v}</text></g>))}
        {[2011,2013,2015,2017,2019,2021,2023].map(y=>(<text key={y} x={sx(y)} y={H-8} textAnchor="middle" fill="#666" fontSize={8}>{y}</text>))}
        <polyline fill="none" stroke={C.gold} strokeWidth={1.5} opacity={0.6} points={drakeScores.map(s=>`${sx(s.year)},${sy(s.score)}`).join(" ")}/>
        <polyline fill="none" stroke={C.purple} strokeWidth={1.5} opacity={0.6} points={kendrickScores.map(s=>`${sx(s.year)},${sy(s.score)}`).join(" ")}/>
        {drakeScores.map(s=>(<g key={s.album}><circle cx={sx(s.year)} cy={sy(s.score)} r={s.bnm?6:4} fill={C.gold} opacity={0.9} stroke={s.bnm?"#000":"none"} strokeWidth={1}/><text x={sx(s.year)} y={sy(s.score)-9} textAnchor="middle" fill="#4a4020" fontSize={7}>{s.album.split(" ")[0]}</text></g>))}
        {kendrickScores.map(s=>(<g key={s.album}><circle cx={sx(s.year)} cy={sy(s.score)} r={s.bnm?6:4} fill={C.purple} opacity={0.9} stroke={s.bnm?"#000":"none"} strokeWidth={1}/><text x={sx(s.year)} y={sy(s.score)-9} textAnchor="middle" fill="#5a3a7a" fontSize={7}>{s.album.split(" ")[0]}</text></g>))}
      </svg>
    </div>
    <div style={{display:"flex",gap:16,marginBottom:20}}>
      {[{c:C.gold,l:"Drake (filled dot = BNM)"},{c:C.purple,l:"Kendrick (filled dot = BNM)"}].map(({c,l})=>(<div key={l} style={{display:"flex",alignItems:"center",gap:6,fontSize:9.5,color:"#666"}}><div style={{width:8,height:8,borderRadius:"50%",background:c}}/>{l}</div>))}
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:12,marginBottom:20}}>
      {[
        {color:C.gold,  title:"Drake's Score Trajectory",  body:"Take Care peaked at 9.2 in 2011 — one of Pitchfork's highest scores of that year. By 2018 (Scorpion), he was in the 6.5 range, which they've maintained ever since regardless of commercial performance. The score decline accelerates exactly as his commercial dominance peaks. Views sold more than any album in his discography and received a 7.2. The critics and the charts are grading in opposite directions with increasing intensity over time."},
        {color:C.purple,title:"Kendrick's Score Floor",    body:"Kendrick has never dropped below 8.7 on Pitchfork. Every album is Best New Music. TPAB at 9.8 is among the highest scores Pitchfork has ever given any album in any genre. The consistency is remarkable — but it also raises the question: at what point does a score represent genuine engagement with the music vs. an institutional commitment to a pre-existing narrative about an artist?"},
        {color:C.red,   title:"The Beef Coverage Pattern", body:"When Euphoria dropped on April 22, 2024, major media outlets had laudatory coverage published within hours. Pitchfork, Complex, Rolling Stone, and XXL all rushed takes praising it as an instant classic before any analytical distance was possible. Drake's responses received coverage framed around failure before they'd been properly heard. This is the pattern the Reddit post describes as 'pre-briefed press' behavior — coverage that reads less like criticism and more like a coordinated rollout."},
        {color:C.teal,  title:"The Ten-Year Test",         body:"The Reddit post ends: 'Come another decade they'll look embarrassing but for different reasons.' Apply this to Drake/Kendrick coverage in 2024: will the unanimous media crown on Kendrick look like genuine criticism or like an institution that picked a side and amplified it? The stream data doesn't care about the narrative. It keeps counting. Whatever the media said in 2024, the Depth Ratings and Legacy Scores will render a verdict in 2034 that no one can manipulate."},
      ].map(({color,title,body})=>(
        <div key={title} style={{background:C.card,border:`1px solid ${color}22`,borderLeft:`3px solid ${color}`,borderRadius:3,padding:"14px 16px"}}>
          <div style={{fontSize:10,color,letterSpacing:1.5,marginBottom:8,textTransform:"uppercase"}}>{title}</div>
          <div style={{fontSize:11,color:"#7a6a50",lineHeight:1.9}}>{body}</div>
        </div>
      ))}
    </div>

    <SLabel>The Pattern — How Critical Consensus Gets Made</SLabel>
    {[
      {step:"01",color:C.purple,label:"Pre-Selection",desc:"The critical establishment decides which artists are in the 'serious' tier before a given release cycle. Kendrick has been in that tier since 2012. Drake exited it around 2016. This pre-selection happens through accumulated coverage, festival bookings, year-end lists, and social positioning among critics — not through actual listening to new music."},
      {step:"02",color:C.orange,label:"Confirmation Bias on Drop Day",desc:"When a pre-selected artist releases new music, criticism functions as confirmation of the pre-existing narrative. Euphoria was praised instantly not because 6 minutes of dense lyrics can be properly absorbed in 2 hours, but because it arrived pre-labeled as important. The praise was an institutional signal, not a listening experience."},
      {step:"03",color:C.red,   label:"Counter-Narrative Suppression",desc:"Drake's responses were covered through a frame that had already decided the outcome. Family Matters wasn't engaged with on its merits — it was contextually buried (same-night drops) and critically buried (coverage immediately pivoting to NLU and MtG). The asymmetry in coverage volume between the two sides is measurable and consistent."},
      {step:"04",color:"#fbbf24",label:"Institutionalization via Awards",desc:"The Grammy sweep completed the cycle: a critical consensus became institutional record. Whatever doubts might have existed are now settled by the trophy. 'Not Like Us won Record of the Year' becomes the sentence that ends debates — even though the Recording Academy is making the same pre-selection decision the critics made, just with more ceremony."},
      {step:"05",color:"#9ca3af",label:"The Revision That Will Come",desc:"Every critical consensus gets complicated by time. Not because Drake will be vindicated, but because every critical consensus gets complicated by time. The question is what the stream data looks like when the narrative fog clears."},
    ].map(({step,color,label,desc})=>(
      <div key={step} style={{display:"flex",gap:14,marginBottom:10,alignItems:"flex-start"}}>
        <div style={{fontSize:18,color:`${color}60`,fontStyle:"italic",minWidth:30,textAlign:"right",flexShrink:0,paddingTop:2}}>{step}</div>
        <div style={{background:C.card,border:`1px solid ${color}22`,borderLeft:`2px solid ${color}`,borderRadius:3,padding:"12px 15px",flex:1}}>
          <div style={{fontSize:10.5,color,letterSpacing:1,marginBottom:6,textTransform:"uppercase"}}>{label}</div>
          <div style={{fontSize:11.5,color:"#7a6a50",lineHeight:1.85}}>{desc}</div>
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
  const [sortKey,setSortKey]=useState("depthRating");
  const [sortDir,setSortDir]=useState(-1);

  const activeSource=useMemo(()=>{
    let albums=[...DRAKE_RAW];
    if(combineHnHl){albums=albums.filter(a=>a.id!=="hn"&&a.id!=="hl");albums.push(HN_HL_COMBINED);}
    if(!showNonStudio) albums=albums.filter(a=>a.type==="studio"||a.combined);
    else albums=albums.filter(a=>!a.legacy);
    return albums;
  },[combineHnHl,showNonStudio]);

  const drake=useMemo(()=>activeSource.map(a=>compute(a,norm,alpha)),[activeSource,norm,alpha]);
  const ranked=useMemo(()=>{
    let r=drake.filter(a=>!a.extrapolated);
    if(streamOnly) r=r.filter(a=>!a.preStream);
    if(eraFilter!=="all") r=r.filter(a=>a.era===eraFilter);
    // default sort: depthRating descending (highest first = most durable)
    return [...r].sort((a,b)=>b.depthRating-a.depthRating);
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
      const openPower=Math.min(100,Math.log10(avgFW+1)/Math.log10(maxFW+1)*100);
      return[
        openPower,
        Math.min(100,mean(v.map(a=>a.depthRating))),
        Math.min(100,mean(v.filter(a=>a.meta).map(a=>a.meta))||65),
        Math.min(100,Math.max(0,100-stdev(v.map(a=>a.depthRating))*3)),
        Math.min(100,mean(v.map(a=>a.total))/1e7*100),
      ];
    }
    const list=[{name:"Drake",color:C.gold,scores:score(drake)}];
    peerKeys.forEach(k=>{if(peerComputed[k])list.push({name:PEERS[k].name,color:PEERS[k].color,scores:score(peerComputed[k])});});
    return list;
  },[drake,peerComputed,peerKeys]);

  const TABS=[
    ["premise","Premise"],["rankings","Rankings"],["insights","Insights"],["legacy","Legacy ◆"],
    ["beef","Beef Lens"],["iceman","Iceman ◇"],
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
          <div style={{fontSize:9,color:"#666",letterSpacing:3,textTransform:"uppercase",marginBottom:6}}>Drake · Kendrick · Cole · Kanye · Legends · Modern Era · Data as of Sept 5, 2025</div>
          <div style={{fontSize:10,color:C.goldDim,fontStyle:"italic",opacity:0.6}}>"The data doesn't lie, even when the narrative does."</div>
        </div>
      </div>
      {tab==="iceman"&&(
        <div style={{background:"#0d0d0d",borderBottom:"1px solid #1a1a1a",padding:"6px 18px",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <span style={{fontSize:8,color:"#666",letterSpacing:2,textTransform:"uppercase"}}>Model controls below are inactive on the Iceman tab — Iceman uses fixed internal settings</span>
        </div>
      )}
      <div style={{background:"#0d0d0d",borderBottom:`1px solid ${C.border}`,opacity:["rankings","insights","data"].includes(tab)?1:0.25,pointerEvents:["rankings","insights","data"].includes(tab)?"auto":"none"}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,alignItems:"center",padding:"10px 18px 0",justifyContent:"center"}}>
          <span style={{fontSize:8,letterSpacing:3,color:"#666",textTransform:"uppercase",marginRight:4,flexShrink:0}}>Presets:</span>
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
                <div style={{fontSize:7.5,opacity:0.7}}>{sub}</div>
              </button>
            );
          })}
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:20,alignItems:"center",justifyContent:"center",padding:"10px 18px 12px"}}>
          <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"center"}}>
            <span style={{fontSize:8,letterSpacing:3,color:C.goldDim,textTransform:"uppercase"}}>Window: <span style={{color:C.gold}}>{norm} months</span></span>
            <input type="range" min={18} max={48} value={norm} onChange={e=>setNorm(+e.target.value)} style={{accentColor:C.gold,width:150,cursor:"pointer"}}/>
            <div style={{fontSize:7.5,color:"#777",display:"flex",justifyContent:"space-between",width:150}}><span>18mo</span><span>48mo</span></div>
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
          <button key={id} onClick={()=>setTab(id)} style={{padding:"11px 14px",cursor:"pointer",fontSize:9,letterSpacing:2,textTransform:"uppercase",color:tab===id?C.gold:"#888",background:"none",fontFamily:"Georgia,serif",flexShrink:0,outline:"none",border:"none",borderBottom:`2px solid ${tab===id?C.gold:"transparent"}`,transition:"color 0.15s"}}>{label}</button>
        ))}
      </div>
      <div style={{maxWidth:920,margin:"0 auto",padding:"22px 14px"}}>
        {tab==="premise"    &&<PremiseTab/>}
        {tab==="rankings"   &&<RankingsTab ranked={ranked} flagged={flagged} drake={drake} norm={norm} streamOnly={streamOnly} setStreamOnly={setStreamOnly} eraFilter={eraFilter} setEraFilter={setEraFilter} showNonStudio={showNonStudio} setShowNonStudio={setShowNonStudio} combineHnHl={combineHnHl} setCombineHnHl={setCombineHnHl}/>}
        {tab==="insights"   &&<InsightsTab drake={drake}/>}
        {tab==="legacy"     &&<LegacyTab drake={drake} peerComputed={peerComputed} norm={norm} alpha={alpha}/>}
        {tab==="beef"       &&<BeefLensTab drake={drake}/>}
        {tab==="iceman"     &&<IcemanTab drake={drake} norm={norm} alpha={alpha}/>}
        {tab==="peers"      &&<PeersTab drake={drake} peerComputed={peerComputed} peerKeys={peerKeys} setPeerKeys={setPeerKeys} radarArtists={radarArtists}/>}
        {tab==="legitimacy" &&<LegitimacyTab/>}
        {tab==="awards"     &&<AwardsTab/>}
        {tab==="media"      &&<MediaLensTab/>}
        {tab==="conclusions"&&<ConclusionsTab/>}
        {tab==="data"       &&<DataTab drake={drake} sortKey={sortKey} setSortKey={setSortKey} sortDir={sortDir} setSortDir={setSortDir}/>}
      </div>
    </div>
  );
}
