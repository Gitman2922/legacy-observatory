import { useState, useMemo, useCallback, useEffect } from "react";
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
    {id:"legacy",     label:"Legacy ◆",        desc:"The evolved quadrant and career arc visualizations, plus the Drake legacy verdict — nine-axis analysis grounded in listener data. Comparisons against peers coming in Phase 2."},
    {id:"beef",       label:"Beef Lens",       desc:"Depth Rating applied to the diss tracks themselves, plus a comparison of how conflict-adjacent albums perform vs quiet-period releases."},
    {id:"iceman",     label:"Iceman ◇",        desc:"Scenario modeler for Drake's next unreleased studio album. Adjust opening week, Metacritic prediction, and track count to see where it would rank."},
    {id:"canon",      label:"Canon ✦",         desc:"The Demographic Canon Model — a five-section structural analysis of cycle, leverage, and the Iceman moment. Why his discourse decayed while his commercial floor held, mapped event-by-event across 15 years."},
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
        <div style={{fontSize:9,letterSpacing:5,color:C.goldDim,textTransform:"uppercase",marginBottom:14}}>The Question</div>
        <p style={{fontSize:14,color:"#d4c080",lineHeight:2,margin:"0 0 16px",fontStyle:"italic"}}>
          Is Drake the greatest rapper of his generation — and what does the evidence actually say?
        </p>
        <p style={{fontSize:12.5,color:"#7a6a50",lineHeight:2,margin:"0 0 16px"}}>
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

// ── DRAKE STATIC VERDICT ─────────────────────────────────────────
// Static verdict content — curated and baked in. Phase 2 will add Drake-vs-peer comparison verdicts.
const DRAKE_VERDICT = {
  verdict: `The institutional gap tells you everything, and the direction of the gap is the story. As critical scores fell, Depth Ratings climbed — an audience that grew more attached as institutional support collapsed. Fourteen points separate what critics heard from what listeners did — not on one album, but across thirteen projects spanning a decade and a half. That gap widened as Drake's commercial dominance increased, reaching its nadir on Certified Lover Boy and Her Loss, where Metacritic scores cratered into the low 60s while Depth Ratings held at 86-87. This is not a critic-audience split. This is evidence that critics and listeners were measuring entirely different things.

The loyalty data contradicts the prevailing narrative about Drake's catalog. Care Package — a collection of leaked loosies and SoundCloud cuts — posted an 88 Depth Rating from a 165K opening week. Dark Lane Demo Tapes, explicitly marketed as throwaway material, hit 89 from 226K. These are not event-driven numbers. These are listeners returning to material the artist himself framed as secondary, finding utility there that the public discourse missed entirely. The catalog-to-peak ratio stays compressed across the entire discography: Take Care's 11.4M total moved off an 88 Depth Rating, Scorpion's 11.1M off an 89, More Life's 6.3M off an 86. The audience does not treat Take Care as different in kind from a demo tape released nine years later. The floor is high because the listener base is stable.

The pressure resilience data dismantles the accepted story about narrative damage. Drake released two projects during documented beef periods: What a Time to Be Alive — his Future collaboration released six weeks after the Meek Mill exchange — at 79 Depth Rating, his lowest, and Scorpion at 89, tied for his highest. The beef albums average 84. The quiet albums average 86. Two points. Scorpion dropped in the immediate aftermath of the Pusha T confrontation — the moment critics and the broader culture declared Drake's credibility destroyed — and it posted the highest listener engagement of his career. Not in first-week terms, but in sustained depth of catalog interaction. The audience did not hear what the institutions heard. The pressure resilience question matters most here because Drake is the only artist in the dataset who has released music through sustained, multi-year institutional attack — first the Meek Mill / Quentin Miller allegations in 2015, then Pusha T's biographical strike in 2018, then the Kendrick sequence in 2024. His loyalty held under conditions no peer has been forced to test.

What cannot be measured yet: whether the Kendrick battle — the most totalized narrative defeat in modern rap history — functions differently than previous conflicts. The 2018 Pusha moment was surgical and biographical. The 2024 Kendrick campaign was different in scope and saturation, attempting to rewrite not just Drake's image but the legitimacy of his entire catalog. If the pattern holds, the next album's Depth Rating will stay in the mid-80s regardless of critical reception or cultural consensus. If it breaks below 80, that would represent the first time institutional narrative successfully penetrated the listener relationship. The flattened Depth Rating curve is either total artistic failure or the most complete audience capture in the dataset. The data does not yet exist to adjudicate which.`,
  replacement: `If Drake is removed, the specific hole is the catalog that served simultaneously as status signaling and 2AM emotional utility for a generation that grew up rating their feelings in real time on the internet — music that serves identical emotional utility to a 16-year-old in 2011 and a 16-year-old in 2024 without requiring the listener to claim they are experiencing art. The Weeknd could do darkness without aspiration. Kanye could do vulnerability with status but not consistently. J. Cole could do relatability but not luxury. Drake's emotional range — not just sadness but the exact recursive self-awareness of someone performing sadness while knowing they are performing it — is the thing that does not exist anywhere else. The catalog that soundtracked oversharing dies with him. The combination of vocal tone, melodic structure, and thematic range created a use case no single artist has replicated: music for people living in the gap between what they project and what they feel.`,
  open_question: `Whether Drake's loyalty can survive a loss in the one arena that has historically mattered to legacy assessment — peer-to-peer symbolic combat at the level Kendrick operates — remains the only unresolved variable in the data.`,
  dominant_axes: ["institutional_gap","listener_loyalty","emotional_utility"],
  dominant_axes_reasoning: `Drake's legacy hinges on the stability of his listener base under maximum institutional skepticism. The institutional gap and loyalty metrics measure whether critical dismissal penetrated actual use patterns. Emotional utility explains what critics could not see: the functional role the catalog played in listeners' lives independent of prestige or narrative.`,
  axis_breakdown: {
    cultural_footprint: {score:9, data_anchored:true, summary:`Peak commercial dominance from 2013-2018 unmatched in streaming era: Views opened with 1.0M equivalent units, Scorpion with 732K. Total catalog reach of 86.5M equivalent units across thirteen projects. The longevity is real: albums from 2011 (Take Care, 11.4M) still outpace recent releases in total movement. Opening week power and sustained catalog performance both measure in top percentile.`},
    listener_loyalty: {score:9, data_anchored:true, summary:`The Demo Tapes and Care Package data is definitive: 89 and 88 Depth Ratings on material explicitly framed as scraps. Catalog-to-peak ratio stays compressed across all eras — Take Care, Scorpion, and More Life all convert 85+ Depth Ratings into multimillion totals. No meaningful drop in engagement from surprise releases (If You're Reading This: 82, Honestly Nevermind: 87). The audience returns unprompted.`},
    institutional_gap: {score:10, data_anchored:true, summary:`Fourteen-point average gap between Depth Rating (85) and Metacritic (71) sustained across full discography. The gap widens on commercial peaks: Scorpion (89 Depth vs 67 Metacritic), Certified Lover Boy (86 vs 60). This is not fluctuation. This is structural disagreement about what constitutes value. Critics heard empty calories. Listeners heard utility.`},
    pressure_resilience: {score:8, data_anchored:true, summary:`Beef albums average 84 Depth Rating, quiet albums 86 — a two-point difference across maximum narrative pressure. Drake is the only artist in the dataset who has released music through sustained, multi-year institutional attack across three documented career inflection points (2015, 2018, 2024). Scorpion, released during the Pusha T aftermath when critical consensus declared Drake finished, posted an 89 Depth Rating. The listener bond held under every documented attack through 2022. The 2024 Kendrick variable remains unresolved.`},
    genre_architecture: {score:8, data_anchored:false, summary:`Drake normalized the structural use of singing rappers not as novelty but as baseline vocabulary (general knowledge). The shift was not stylistic borrowing but framework: verses and hooks no longer required functional separation, emotional registers could flip mid-song without genre code-switching. This became infrastructure. Every melodic rap project since 2011 operates inside the grammar Drake made standard.`},
    emotional_utility: {score:10, data_anchored:false, summary:`The catalog serves a specific emotional state: the gap between public performance and private doubt (general knowledge). A listener reaches for Drake at 2AM not for catharsis but for company in ambivalence — the music that holds space for success and loneliness simultaneously without resolving the tension. The specific emotional move is the recursive self-awareness of someone performing sadness while knowing they are performing it. Critics cannot measure this because it is not about artistic merit. It is about functional use.`},
    cultural_transmission: {score:9, data_anchored:false, summary:`Entire phrases became ambient language: "YOLO," "started from the bottom," "6 God," "more life" as general philosophy (general knowledge). The vocal cadence — the specific way Drake shapes syllables, the talk-sung melody that sits between rap and R&B — became the default template for a generation of artists who never explicitly cited him as influence. The transmission happened structurally, not just lyrically.`},
    generational_reach: {score:8, data_anchored:false, summary:`The catalog is claimed by listeners who were teenagers in 2011 and listeners born after Take Care released (general knowledge). Discovery patterns stayed consistent: new listeners enter through recent hits, migrate backward through catalog, stay for the emotional utility regardless of release era. The fanbase did not age out. It compounded. Multi-generational reach is confirmed but primarily concentrated in millennial and Gen Z cohorts.`},
    legacy_resilience: {score:7, data_anchored:"synthesis", summary:`All metrics held through 2022. The Kendrick battle in 2024 represents the first attack with cultural saturation sufficient to test whether institutional narrative can break the listener bond. If the next album's Depth Rating drops below 80, it would be the first time narrative penetrated behavior. If it holds mid-80s, the resilience thesis is confirmed. The variable is live and unresolved.`},
  },
};

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

  const [axisExpanded,setAxisExpanded]=useState(false);
  const primary="drake";
  const activeKeys=useMemo(()=>["drake"],[]);
  const verdict=DRAKE_VERDICT;
  const primaryArtist=ARTISTS[primary];

  const getAlbums=useCallback(k=>k==="drake"
    ?drake.filter(a=>!a.extrapolated&&a.total>0)
    :(peerComputed[k]||[]).filter(a=>!a.extrapolated&&a.total>0)
  ,[drake,peerComputed]);

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
      {/* ── DRAKE ANCHOR ── */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:4,padding:"18px 18px 14px",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:54,height:54,borderRadius:"50%",background:`${C.gold}18`,border:`2px solid ${C.gold}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:C.gold,fontFamily:"Georgia,serif",fontWeight:"bold",boxShadow:`0 0 0 3px ${C.gold}33,0 0 12px ${C.gold}22`,flexShrink:0}}>D</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:9,letterSpacing:4,color:C.goldDim,textTransform:"uppercase",marginBottom:4}}>Primary Artist</div>
            <div style={{fontSize:16,color:C.gold,fontFamily:"Georgia,serif",letterSpacing:1}}>Drake</div>
            <div style={{fontSize:9.5,color:"#666",fontStyle:"italic",marginTop:4,lineHeight:1.5}}>The canonical analysis. Drake-vs-peer comparison verdicts pre-generated in Phase 2.</div>
          </div>
        </div>
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

      {/* ── STATIC VERDICT ── */}
      <div style={{background:"linear-gradient(135deg,#1a1200,#0d0d0d)",border:`1px solid ${C.border}`,borderRadius:4,padding:"18px",marginBottom:16}}>
        <div style={{fontSize:9,letterSpacing:4,color:C.goldDim,textTransform:"uppercase",marginBottom:6}}>Legacy Verdict</div>
        <div style={{fontSize:11,color:"#7a6a50",lineHeight:1.7}}>Analysis across nine axes — four grounded in the data above, four drawn from broader knowledge (flagged), one synthesis.</div>
      </div>

      <div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:3,padding:"24px 24px 20px",marginBottom:12}}>
          {verdict.verdict.split("\n\n").map((para,i)=>(
            <p key={i} style={{fontSize:13,color:"#c0aa70",lineHeight:2.0,margin:i===0?"0 0 16px":"16px 0",fontStyle:"italic"}}>{para}</p>
          ))}
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:16,marginTop:4}}>
            <div style={{fontSize:8,letterSpacing:3,color:C.goldDim,textTransform:"uppercase",marginBottom:8}}>The Replacement Question</div>
            <p style={{fontSize:12,color:"#8a7a60",lineHeight:1.9,margin:0,fontStyle:"italic"}}>{verdict.replacement}</p>
          </div>
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:12,marginTop:12}}>
            <div style={{fontSize:8,letterSpacing:3,color:"#555",textTransform:"uppercase",marginBottom:6}}>Open Question</div>
            <p style={{fontSize:11,color:"#666",lineHeight:1.7,margin:0,fontStyle:"italic"}}>{verdict.open_question}</p>
          </div>
        </div>

        {/* AXIS BREAKDOWN */}
        <div style={{marginBottom:12}}>
          <button onClick={()=>setAxisExpanded(v=>!v)} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",cursor:"pointer",fontFamily:"Georgia,serif",padding:"8px 0",outline:"none"}}>
            <span style={{fontSize:9,letterSpacing:2,color:C.goldDim,textTransform:"uppercase"}}>{axisExpanded?"▲ Hide":"▼ View"} Axis Breakdown</span>
            {!axisExpanded&&verdict.dominant_axes.slice(0,3).map(k=>(
              <span key={k} style={{fontSize:8,color:"#555",background:"#1a1a1a",padding:"2px 8px",borderRadius:10}}>{AXIS_LABELS[k]||k}</span>
            ))}
          </button>
          {axisExpanded&&(
            <div style={{marginTop:10,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:8}}>
              {Object.entries(verdict.axis_breakdown).map(([key,ax])=>{
                const score=ax.score||0;
                const color=score>=8?C.green:score>=6?C.gold:"#fb923c";
                const isDominant=verdict.dominant_axes.includes(key);
                return(
                  <div key={key} style={{background:isDominant?"#141200":C.card,border:`1px solid ${isDominant?C.gold+"44":C.border}`,borderLeft:`3px solid ${color}`,borderRadius:3,padding:"10px 13px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <div style={{fontSize:8.5,color,letterSpacing:1,textTransform:"uppercase"}}>{AXIS_LABELS[key]||key}</div>
                      <div style={{display:"flex",alignItems:"center",gap:5}}>
                        {ax.data_anchored===false&&<span style={{fontSize:7,color:"#555",background:"#1a1a1a",padding:"1px 5px",borderRadius:8}}>general</span>}
                        {ax.data_anchored===true&&<span style={{fontSize:7,color:C.green+"88",background:"#0d1a0d",padding:"1px 5px",borderRadius:8}}>data</span>}
                        {ax.data_anchored==="synthesis"&&<span style={{fontSize:7,color:C.gold+"88",background:"#1a1500",padding:"1px 5px",borderRadius:8}}>synthesis</span>}
                        {isDominant&&<span style={{fontSize:7,color:C.gold+"99",background:`${C.gold}11`,padding:"1px 5px",borderRadius:8}}>key</span>}
                        <span style={{fontSize:13,color,fontStyle:"italic"}}>{score}<span style={{fontSize:8,color:"#444"}}>/10</span></span>
                      </div>
                    </div>
                    <div style={{height:2,background:"#1a1a1a",borderRadius:1,marginBottom:7}}><div style={{height:"100%",width:`${score*10}%`,background:color,borderRadius:1,transition:"width 0.5s"}}/></div>
                    <div style={{fontSize:10.5,color:"#7a6a50",lineHeight:1.7}}>{ax.summary}</div>
                  </div>
                );
              })}
              <div style={{gridColumn:"1/-1",background:"#0d0d0d",border:`1px solid ${C.border}`,borderRadius:3,padding:"10px 13px"}}>
                <div style={{fontSize:8,color:C.gold,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Why These Axes</div>
                <div style={{fontSize:10.5,color:"#7a6a50",lineHeight:1.7}}>{verdict.dominant_axes_reasoning}</div>
              </div>
            </div>
          )}
        </div>

        {/* PHASE 2 PANEL */}
        <div style={{background:"#0a0a0a",border:`1px dashed ${C.border}`,borderRadius:3,padding:"14px 18px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,flexWrap:"wrap"}}>
            <span style={{fontSize:8,color:C.gold+"cc",letterSpacing:2,background:`${C.gold}15`,border:`1px solid ${C.gold}44`,padding:"2px 8px",borderRadius:10,textTransform:"uppercase"}}>Phase 2</span>
            <span style={{fontSize:10.5,color:"#888",letterSpacing:1,textTransform:"uppercase"}}>Drake vs Peer Comparisons</span>
          </div>
          <div style={{fontSize:10.5,color:"#5a4a30",lineHeight:1.75}}>Pre-generated verdict comparisons against Kendrick, Cole, Kanye, Jay-Z, and the rest of the modern field roll out in waves following Iceman. Live conversation mode opens for paid subscribers in Phase 3.</div>
        </div>
      </div>
    </div>
  );
}

// ── CANON: DEMOGRAPHIC CANON MODEL ───────────────────────────────
const CANON_SCRIPTS = {
  intro: "Welcome to the Drake Demographic Canon Model, from the Legacy Observatory. A structural analysis of cycle, leverage, and the Iceman moment. The argument: Drake has been trapped in a structural cycle for fifteen years. Demographic cohort cycling decays his discourse. But his commercial dominance continues. At every leverage moment, a rival has been positioned to discipline his trajectory. He has survived three near-death events — Meek Mill and Quentin Miller, Pusha T, Kendrick. But he has never fully escaped the cycle. This is an analysis of how that cycle works. Why his early masters have become structurally more valuable than at any point in his career. And what the Iceman release, combined with a projected UMG re-sign, is engineered to accomplish. Not just personal escape. Breaking the wheel for every artist who follows. The argument unfolds across five sections. Section one establishes the structural mechanism. Section two tests it against real-world data. Section three synthesizes the theory and confirms it with Drake's own words. Section four examines what Iceman needs to be and what the deal looks like. Section five projects what changes after the wheel breaks. Roughly twelve minutes of audio total.",
  1: "Section one. The mechanism. How musical taste forms, why cohorts cycle through the demo window, and what the math predicts for Drake's catalog. The foundation of everything that follows. Drake has been making music professionally since 2009. In that time, his discourse has steadily decayed. But his commercial dominance has continued. This isn't a coincidence. It's a structural consequence of how musical taste forms. Reminiscence-bump research shows that musical preferences crystallize between ages fourteen and twenty-four. People fall in love with music during a roughly ten-year window of their lives. They keep loving that music as they age out of the window. Two listeners the same age can have completely different Drake canons, depending on when they passed through the demo window. A thirty-year-old today was in their teens for Thank Me Later. A thirty-year-old in 2020 was already in their thirties. They never had the chance to crystallize on it. Scale this across all cohorts and all releases. Average reception across cohorts for each release, holding quality flat. You get a steadily declining curve. The decline is entirely artifactual. Every release in the model is the same quality. The decline emerges purely from retro-blessing accumulation over time. Here's the dollar implication. Drake's early masters become structurally more valuable over time, not less. Thank Me Later, Take Care, and Nothing Was the Same keep absorbing endorsements from every new cohort entering the demo. That's the math behind why Tier-1 masters reversion is the centerpiece of the projected UMG re-sign.",
  2: "Section two. The pattern in real data. Does the model's prediction show up in Drake's actual reception data? The divergence chart resolves it. And reveals three specific moments where commercial spikes upward across critical, each correlating with a major industry-discipline event. Here's the chart. Metacritic plotted against first-week commercial performance, across his catalog. Critical drifts down gradually. That's the structural floor from cohort cycling. But commercial doesn't track critical. At three specific moments, commercial spikes upward through critical. Views in 2016. Scorpion in 2018. For All The Dogs into 2024. These aren't coincidences. Each upward crossing corresponds to a major industry-discipline event. At Views: Meek Mill's ghostwriting allegations. The Quentin Miller reference tracks leaked in July 2015. At Scorpion: Pusha T's Story of Adidon. The son revelation. At For All The Dogs: Kendrick Lamar's multi-front attack with Not Like Us. Two of these three rivals were on UMG-affiliated labels. Pusha T on G.O.O.D. and Def Jam, both UMG. Kendrick on Interscope, also UMG. Drake himself is on Republic, also UMG. Intra-UMG strikes. Not cross-label rivalry. When you place these three events against Drake's complete beef history, the pattern resolves to four categories. The three industry-discipline events are the cycle's stress moments. The label disputes are the structural backdrop. Industry-power confrontations and platform alignment are the cultural infrastructure shifting. Everything else, the peer rivalries with Common, Joe Budden, Chris Brown, Megan, the brief Kanye flare-up, those are cycle noise.",
  3: "Section three. Synthesis and evidence. With the pattern documented across his career, we now organize the observations into a single theory. We look at Drake's own description of the mechanism from inside the apparatus. And we audit the fifteen-year survival pattern that makes Iceman credible. The layered model has three layers. Layer one is the structural foundation. Demographic cohort cycling produces the base divergence by mathematical necessity. Roughly fifty to sixty percent of the observed effect. Layer two is bidirectional amplification. Uncoordinated industry actors push commercial up and critical down. Roughly thirty to forty percent. Layer three is stress. When the amplifiers align in unusual configurations, typically through rival deployment at leverage-accumulation moments, the structural floor breaks. The three observed stress events: Meek 2015. Pusha 2018. Kendrick 2024. This isn't Drake-unique. The same dynamics have shaped other artists' careers. Taylor Swift's masters re-recording project. Lil Wayne's fifty-one million dollar Cash Money suit. Prince's slave-era Warner confrontation. What makes Drake's case the test is the convergence at this moment. Drake himself has described the amplification mechanism from inside. On Bobbi Althoff's podcast in September 2025, he detailed coordinated media phone calls during album release windows. Deciding what stance each commentator would take. In what order. To avoid overlap. Staggered first-responder takes. Top-comment placement. Timing windows. The mechanism described from inside. Across fifteen years, the cycle has tried to end Drake three separate times through industry discipline. He survived each one without breaking free. That fifteen-year survival track record is what makes Iceman credible as the move that finally breaks the pattern. This isn't a Hail Mary. It's the culmination of a long pattern of surviving the system while accumulating leverage against it.",
  4: "Section four. The Iceman moment. Given the cycle is real and consistently survived, what does Iceman need to be to break it? What strategic options exist? And what does the projected deal actually look like at the magnitudes that would template the move for the entire industry? A merely bad or mid album confirms the cycle. The deal closes smaller. Five to seven hundred million range. A good album holds the baseline but doesn't break out. A great album hits the More Life or Honestly Nevermind tier. The deal closes near the projected midpoint of one-point-one-five billion. But the wheel doesn't break. Only a classic does it. What Drake's been signaling with the Cla$$$ic wordplay. Classic plus dollar signs. Generation-defining music combined with the leverage moment that prints the deal. The dollar signs are the structural delivery system. They're not separate goals. What are the escape routes? Music quality alone won't work. Without the structural deal beneath it, even a classic just becomes another bounce within the cycle. Genre pivot won't work. Honestly Nevermind tested that. Full independence is the Kanye move. The build-out path. That trades one structural problem for another. And it's never been Drake's identity. The live escape is leveraged re-sign plus classic. Convert from artist-as-asset to artist-as-business-partner. Template the move for the entire industry. Here's what the deal structure looks like. Projected total nine hundred million to one-point-four billion dollars. Cash advance. Tier-one masters reversion of Thank Me Later through Nothing Was the Same. Partial Tier-two reversion. OVO Sound equity. Distribution rights. Sync licensing autonomy. Publishing. Term: roughly three albums over five years. Re-negotiates again in 2031. Most likely public disclosure window: October 2026 through May 2027.",
  5: "Section five. After the wheel breaks. If a classic-tier Iceman lands, and the deal closes at projected magnitudes, what changes? For Drake personally, and for the entire major-label artist economic model behind him? For Drake personally, breaking the cycle isn't just business. It's the climax of a fifteen-year career strategy. Every brand partnership. Every label friction. Every survival of a near-death event. All of it has been compounding leverage for this moment. The two-year strategic quiet was negotiation positioning. Not surrender. For the industry, the effects propagate outward. Masters reversion and equity participation become the new floor of what's negotiable. Other tier-one artists get a precedent and benchmark. Kendrick. Bad Bunny. Beyoncé. Taylor at her next UMG window. Smaller acts benefit too. The standard floor rises across rosters. Artist lawsuits against streaming-fraud and label-coordination become more credible. For creation: less pressure to release on label timelines. More autonomy in catalog management. For listeners: less label-engineered discourse around release cycles. More direct artist-fan relationships. The wheel exists because artists individually cannot outleverage the apparatus. Drake has uniquely converged the conditions to outleverage it. If the move closes, the wheel doesn't just break for him. It breaks for everyone capable of following the template.",
};

const CANON_ALBUMS = [
  { year:2010, title:"Thank Me Later",         short:"TML",      commercial:447,  metacritic:75 },
  { year:2011, title:"Take Care",              short:"Take Care",commercial:631,  metacritic:78 },
  { year:2013, title:"Nothing Was the Same",   short:"NWTS",     commercial:658,  metacritic:79 },
  { year:2015, title:"If You're Reading This", short:"IYRTITL",  commercial:535,  metacritic:78 },
  { year:2016, title:"Views",                  short:"Views",    commercial:1040, metacritic:69 },
  { year:2017, title:"More Life",              short:"More Life",commercial:505,  metacritic:79 },
  { year:2018, title:"Scorpion",               short:"Scorpion", commercial:732,  metacritic:67 },
  { year:2021, title:"Certified Lover Boy",    short:"CLB",      commercial:613,  metacritic:60 },
  { year:2022, title:"Honestly, Nevermind",    short:"HNM",      commercial:204,  metacritic:73 },
  { year:2022, title:"Her Loss (w/ 21)",       short:"Her Loss", commercial:404,  metacritic:62 },
  { year:2023, title:"For All the Dogs",       short:"FATD",     commercial:514,  metacritic:52 },
];

const CANON_CY = 2026;

function CanonTab(){
  // STATE
  const [softMode,setSoftMode]=useState(true);
  const [demoMin,setDemoMin]=useState(18);
  const [demoMax,setDemoMax]=useState(28);
  const [birthA,setBirthA]=useState(1996);
  const [birthB,setBirthB]=useState(1991);
  const [mode,setMode]=useState("walkthrough");
  const [currentSection,setCurrentSection]=useState(0);
  const [playingSection,setPlayingSection]=useState(null);
  const [voices,setVoices]=useState([]);
  const [selectedVoice,setSelectedVoice]=useState("");
  const [voiceRate,setVoiceRate]=useState(0.95);

  // MATH
  const inDemoSoft=useCallback((age)=>{
    if(!softMode) return (age>=demoMin&&age<=demoMax)?1:0;
    const k=0.7;
    return (1/(1+Math.exp(-k*(age-demoMin))))*(1/(1+Math.exp(k*(age-demoMax))));
  },[softMode,demoMin,demoMax]);

  const classifyAlbum=useCallback((birthYear,album)=>{
    const ageAtRelease=album.year-birthYear;
    const currentAge=CANON_CY-birthYear;
    if(ageAtRelease<0) return {...album,ageAtRelease,status:"unborn",canon:false,score:0};
    const inDemoAtRelease=ageAtRelease>=demoMin&&ageAtRelease<=demoMax;
    const couldRetroBless=ageAtRelease<demoMin&&currentAge>=demoMin;
    let status,canon,score;
    if(inDemoAtRelease){status="live";canon=true;score=100;}
    else if(couldRetroBless){status="retro";canon=true;score=75;}
    else{
      status="out";canon=false;
      const peak=(demoMin+demoMax)/2,sigma=(demoMax-demoMin)/2;
      score=100*Math.exp(-Math.pow(ageAtRelease-peak,2)/(2*sigma*sigma));
    }
    return {...album,ageAtRelease,status,canon,score};
  },[demoMin,demoMax]);

  // VOICE
  useEffect(()=>{
    if(typeof window==="undefined"||!window.speechSynthesis) return;
    const load=()=>{
      const all=window.speechSynthesis.getVoices().filter(v=>v.lang.startsWith("en"));
      const scoreVoice=v=>{
        const n=(v.name+" "+(v.voiceURI||"")).toLowerCase();
        let s=0;
        if(/natural|neural|wavenet/.test(n))s+=100;
        if(/online/.test(n))s+=30;
        if(/enhanced|premium/.test(n))s+=40;
        if(/google/.test(n))s+=20;
        if(/microsoft/.test(n)&&/aria|jenny|guy|davis|jane|tony/.test(n))s+=50;
        if(/samantha|daniel|karen|moira|alex/.test(n))s+=15;
        if(v.lang==="en-US")s+=10; else if(v.lang.startsWith("en"))s+=5;
        if(v.localService===false)s+=10;
        return s;
      };
      const sorted=all.slice().sort((a,b)=>scoreVoice(b)-scoreVoice(a));
      setVoices(sorted);
      setSelectedVoice(prev=>prev||(sorted[0]?.name||""));
    };
    load();
    window.speechSynthesis.onvoiceschanged=load;
    return ()=>{
      if(typeof window!=="undefined"&&window.speechSynthesis){
        window.speechSynthesis.onvoiceschanged=null;
        window.speechSynthesis.cancel();
      }
    };
  },[]);

  const stopVoice=useCallback(()=>{
    if(typeof window!=="undefined"&&window.speechSynthesis) window.speechSynthesis.cancel();
    setPlayingSection(null);
  },[]);

  const playSection=useCallback((key)=>{
    if(typeof window==="undefined"||!window.speechSynthesis) return;
    if(playingSection===key){stopVoice();return;}
    window.speechSynthesis.cancel();
    const text=CANON_SCRIPTS[key];
    if(!text) return;
    const utter=new SpeechSynthesisUtterance(text);
    const v=window.speechSynthesis.getVoices().find(x=>x.name===selectedVoice);
    if(v) utter.voice=v;
    utter.rate=voiceRate;
    utter.pitch=0.95;
    utter.onend=()=>setPlayingSection(p=>p===key?null:p);
    window.speechSynthesis.speak(utter);
    setPlayingSection(key);
  },[playingSection,selectedVoice,voiceRate,stopVoice]);

  // WALKTHROUGH
  const revealSection=useCallback((n)=>{
    setCurrentSection(prev=>Math.max(prev,n));
    setTimeout(()=>{
      const el=document.getElementById(`canon-section-${n}`);
      if(el) el.scrollIntoView({behavior:"smooth",block:"start"});
    },120);
  },[]);

  const jumpTo=useCallback((n)=>{
    if(mode==="walkthrough"&&n>currentSection) return;
    const el=document.getElementById(`canon-section-${n}`);
    if(el) el.scrollIntoView({behavior:"smooth",block:"start"});
  },[mode,currentSection]);

  const switchMode=useCallback((m)=>{
    if(m==="showall"){setMode("showall");setCurrentSection(5);}
    else setMode("walkthrough");
  },[]);

  const restart=useCallback(()=>{
    stopVoice();
    setCurrentSection(0);
    setMode("walkthrough");
    window.scrollTo({top:0,behavior:"smooth"});
  },[stopVoice]);

  const isVisible=(n)=>mode==="showall"||n<=currentSection;

  // STYLES — OVO aesthetic
  const styles={
    panel:{background:C.card,border:`1px solid ${C.border}`,borderRadius:3,padding:"18px 20px",marginBottom:14},
    panelKey:{background:"linear-gradient(135deg,#1a1200,#0d0d0d)",border:`1px solid ${C.gold}55`,borderRadius:3,padding:"18px 20px",marginBottom:14},
    panelTitle:{fontSize:13,letterSpacing:1,color:C.gold,fontStyle:"italic",marginBottom:4,fontFamily:"Georgia,serif"},
    panelSub:{fontSize:10.5,color:"#7a6a50",lineHeight:1.7,marginBottom:14,fontStyle:"italic"},
    keyCallout:{background:"#0a0700",border:`1px solid ${C.gold}33`,borderLeft:`3px solid ${C.gold}`,borderRadius:2,padding:"12px 14px",marginTop:10,fontSize:11,color:"#a09070",lineHeight:1.85},
    footnote:{background:"#0a0a0a",border:`1px solid ${C.border}`,borderRadius:2,padding:"10px 12px",marginTop:10,fontSize:10,color:"#5a4a30",lineHeight:1.75,fontStyle:"italic"},
    bridge:{textAlign:"center",padding:"24px 18px",margin:"24px 0",borderTop:`1px dashed ${C.border}`,borderBottom:`1px dashed ${C.border}`,fontSize:11.5,color:"#8a7a60",fontStyle:"italic",lineHeight:1.9},
    sectionHeader:{borderBottom:`1px solid ${C.border}`,paddingBottom:14,marginBottom:18},
    sectionNum:{fontSize:8,letterSpacing:5,color:C.goldDim,textTransform:"uppercase",marginBottom:4},
    sectionName:{fontSize:20,color:C.gold,fontFamily:"Georgia,serif",letterSpacing:1,marginBottom:8,fontWeight:"normal"},
    sectionIntro:{fontSize:11,color:"#7a6a50",lineHeight:1.8,fontStyle:"italic"},
    label:{fontSize:8.5,letterSpacing:2,color:C.goldDim,textTransform:"uppercase",marginBottom:4},
    th:{fontSize:8,letterSpacing:2,color:C.goldDim,textTransform:"uppercase",textAlign:"left",padding:"8px 10px",borderBottom:`1px solid ${C.border}`,fontFamily:"Georgia,serif",fontWeight:"normal"},
    td:{fontSize:10.5,color:"#8a7a60",padding:"9px 10px",borderBottom:"1px solid #161616",lineHeight:1.6,fontFamily:"Georgia,serif"},
  };

  // HELPER COMPONENT
  const VoiceBtn=({sectionKey,label})=>{
    const playing=playingSection===sectionKey;
    return(
      <button onClick={()=>playSection(sectionKey)} style={{padding:"6px 14px",background:playing?`${C.gold}22`:`${C.gold}10`,border:`1px solid ${C.gold}${playing?"":"55"}`,color:C.gold,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:9,letterSpacing:2,borderRadius:2,outline:"none",textTransform:"uppercase",transition:"all 0.15s"}}>
        {playing?"⏸ Stop":"▶ Play"} {label||"Section"}
      </button>
    );
  };

  // AGGREGATE — per-release average reception across cohorts (1985–2008)
  const HEATMAP_BMIN=1985,HEATMAP_BMAX=2008;
  const aggregateData=useMemo(()=>{
    return CANON_ALBUMS.map(album=>{
      let total=0,count=0;
      for(let by=HEATMAP_BMIN;by<=HEATMAP_BMAX;by++){
        const c=classifyAlbum(by,album);
        total+=c.score;count++;
      }
      return {...album,avg:total/count};
    });
  },[classifyAlbum]);

  // PARADOX STATS HELPER
  const statsFor=(birthYear)=>{
    const classified=CANON_ALBUMS.map(a=>classifyAlbum(birthYear,a));
    return {
      canon:classified.filter(c=>c.canon).length,
      live:classified.filter(c=>c.status==="live").length,
      retro:classified.filter(c=>c.status==="retro").length,
    };
  };

  // ── SVG: RECEPTION CURVE ──
  const ReceptionCurve=()=>{
    const W=600,H=180,m={t:20,r:20,b:32,l:40};
    const ageMin=8,ageMax=50;
    const xS=a=>m.l+((a-ageMin)/(ageMax-ageMin))*(W-m.l-m.r);
    const yS=v=>H-m.b-(v/100)*(H-m.t-m.b);
    let path="";
    for(let a=ageMin;a<=ageMax;a+=0.5){
      let v;
      if(softMode) v=100*inDemoSoft(a);
      else{
        const peak=(demoMin+demoMax)/2,sigma=(demoMax-demoMin)/2;
        v=100*Math.exp(-Math.pow(a-peak,2)/(2*sigma*sigma));
      }
      path+=`${a===ageMin?"M":"L"}${xS(a).toFixed(1)},${yS(v).toFixed(1)} `;
    }
    return(
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"auto",display:"block"}}>
        <rect x={xS(demoMin)} y={m.t} width={xS(demoMax)-xS(demoMin)} height={H-m.t-m.b} fill={`${C.gold}1f`} stroke={`${C.gold}66`} strokeDasharray="3,3"/>
        <text x={(xS(demoMin)+xS(demoMax))/2} y={m.t+14} fill={C.gold} fontSize={11} textAnchor="middle" fontWeight="600">DEMO WINDOW</text>
        <path d={path} fill="none" stroke={C.gold} strokeWidth={2.5}/>
        {[8,13,18,23,28,33,38,43,48].map(a=>(
          <g key={a}>
            <text x={xS(a)} y={H-14} fill="#888" fontSize={10} textAnchor="middle">{a}</text>
            <line x1={xS(a)} y1={H-m.b} x2={xS(a)} y2={H-m.b+4} stroke="#666"/>
          </g>
        ))}
        <text x={W/2} y={H-2} fill="#aaa" fontSize={11} textAnchor="middle" fontWeight="600">Age at release</text>
        <text transform={`translate(13,${H/2+10}) rotate(-90)`} fill="#aaa" fontSize={11} textAnchor="middle">Appreciation</text>
      </svg>
    );
  };

  // ── SVG: PARADOX TIMELINE ──
  const ParadoxTimeline=({birthYear,color})=>{
    const W=600,H=110,m={t:22,r:15,b:25,l:15};
    const X0=2009.5,X1=2024;
    const xS=y=>m.l+((y-X0)/(X1-X0))*(W-m.l-m.r);
    const demoStart=birthYear+demoMin,demoEnd=birthYear+demoMax;
    const dx1=Math.max(xS(demoStart),m.l),dx2=Math.min(xS(demoEnd),W-m.r);
    const yearGroups={};
    CANON_ALBUMS.forEach(a=>{(yearGroups[a.year]=yearGroups[a.year]||[]).push(a);});
    return(
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"auto",display:"block"}}>
        <line x1={m.l} y1={H/2} x2={W-m.r} y2={H/2} stroke="#2a2a2a" strokeWidth={2}/>
        {dx2>m.l&&dx1<W-m.r&&(
          <g>
            <rect x={dx1} y={m.t} width={dx2-dx1} height={H-m.t-m.b} fill={`${color}22`} stroke={`${color}66`} strokeDasharray="2,2"/>
            <text x={(dx1+dx2)/2} y={m.t+12} fill={color} fontSize={9} textAnchor="middle" fontWeight="600">IN DEMO ({Math.round(demoStart)}–{Math.round(demoEnd)})</text>
          </g>
        )}
        {[2010,2014,2018,2022].map(y=>(
          <g key={y}>
            <text x={xS(y)} y={H-8} fill="#666" fontSize={10} textAnchor="middle">{y}</text>
            <line x1={xS(y)} y1={H/2+4} x2={xS(y)} y2={H/2+8} stroke="#444"/>
          </g>
        ))}
        {Object.entries(yearGroups).flatMap(([year,list])=>list.map((album,idx)=>{
          const c=classifyAlbum(birthYear,album);
          const baseX=xS(album.year);
          const offset=list.length>1?(idx===0?-7:7):0;
          const x=baseX+offset;
          let fill,stroke,dash=false;
          if(c.status==="live"){fill=C.gold;stroke="#fff";}
          else if(c.status==="retro"){fill="#b478dc";stroke="#b478dc";dash=true;}
          else if(c.status==="unborn"){fill="#1a1a1a";stroke="#333";}
          else{fill="#444";stroke="#444";}
          const labelY=(parseInt(album.year)+idx)%2===0?H/2-12:H/2+18;
          return(
            <g key={`${album.year}-${idx}`}>
              <circle cx={x} cy={H/2} r={5} fill={fill} stroke={stroke} strokeWidth={1.5} strokeDasharray={dash?"2,2":undefined}/>
              <text x={x} y={labelY} fill={c.canon?fill:"#555"} fontSize={9} textAnchor="middle" fontWeight={c.canon?"600":"400"}>{c.ageAtRelease>=0?c.ageAtRelease:"–"}</text>
            </g>
          );
        }))}
      </svg>
    );
  };

  // ── SVG: HEATMAP ──
  const Heatmap=()=>{
    const W=700,H=480,m={t:60,r:20,b:30,l:70};
    const yearCount=HEATMAP_BMAX-HEATMAP_BMIN+1;
    const cellW=(W-m.l-m.r)/CANON_ALBUMS.length;
    const cellH=(H-m.t-m.b)/yearCount;
    return(
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"auto",display:"block"}}>
        {CANON_ALBUMS.map((album,i)=>{
          const x=m.l+i*cellW+cellW/2;
          return(
            <g key={i}>
              <text x={x} y={m.t-28} fill="#aaa" fontSize={9} textAnchor="middle" transform={`rotate(-35 ${x} ${m.t-28})`} fontWeight="600">{album.short}</text>
              <text x={x} y={m.t-12} fill="#666" fontSize={9} textAnchor="middle">{album.year}</text>
            </g>
          );
        })}
        {Array.from({length:yearCount},(_,i)=>HEATMAP_BMIN+i).map(y=>{
          const yPos=m.t+(y-HEATMAP_BMIN)*cellH+cellH/2;
          if(y%3===0||y===HEATMAP_BMIN||y===HEATMAP_BMAX){
            const currentAge=CANON_CY-y;
            return <text key={y} x={m.l-10} y={yPos+3} fill="#888" fontSize={10} textAnchor="end">{`'${String(y).slice(2)} (${currentAge})`}</text>;
          }
          return null;
        })}
        <text x={m.l-50} y={m.t-35} fill="#aaa" fontSize={10} fontWeight="600">BIRTH</text>
        {Array.from({length:yearCount},(_,i)=>HEATMAP_BMIN+i).flatMap(by=>CANON_ALBUMS.map((album,i)=>{
          const x=m.l+i*cellW;
          const y=m.t+(by-HEATMAP_BMIN)*cellH;
          const c=classifyAlbum(by,album);
          let fill;
          if(c.status==="live") fill=C.gold;
          else if(c.status==="retro") fill="#b478dc";
          else if(c.status==="unborn") fill="#1a1a1a";
          else fill=`rgba(80,80,80,${Math.max(0.15,c.score/100)})`;
          return <rect key={`${by}-${i}`} x={x} y={y} width={cellW} height={cellH} fill={fill}/>;
        }))}
      </svg>
    );
  };

  // ── SVG: AGGREGATE BARS ──
  const Aggregate=()=>{
    const W=600,H=220,m={t:20,r:20,b:50,l:40};
    const barWidth=(W-m.l-m.r)/aggregateData.length-4;
    const yP=v=>H-m.b-(v/100)*(H-m.t-m.b);
    let trendPath="";
    aggregateData.forEach((d,i)=>{
      const x=m.l+i*((W-m.l-m.r)/aggregateData.length)+barWidth/2+2;
      trendPath+=`${i===0?"M":"L"}${x.toFixed(1)},${yP(d.avg).toFixed(1)} `;
    });
    return(
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"auto",display:"block"}}>
        {[0,25,50,75,100].map(v=>(
          <g key={v}>
            <line x1={m.l} y1={yP(v)} x2={W-m.r} y2={yP(v)} stroke="#1f1f1f"/>
            <text x={m.l-6} y={yP(v)+3} fill="#666" fontSize={10} textAnchor="end">{v}</text>
          </g>
        ))}
        {aggregateData.map((d,i)=>{
          const x=m.l+i*((W-m.l-m.r)/aggregateData.length)+2;
          const barH=(d.avg/100)*(H-m.t-m.b);
          const y=H-m.b-barH;
          const t=d.avg/100;
          return(
            <g key={i}>
              <rect x={x} y={y} width={barWidth} height={barH} fill={`hsl(45, ${30+t*40}%, ${30+t*25}%)`} rx={2}/>
              <text x={x+barWidth/2} y={y-4} fill="#ddd" fontSize={9} textAnchor="middle" fontWeight="600">{Math.round(d.avg)}</text>
              <text x={x+barWidth/2} y={H-m.b+14} fill="#888" fontSize={8} textAnchor="middle">{d.short}</text>
              <text x={x+barWidth/2} y={H-m.b+26} fill="#555" fontSize={8} textAnchor="middle">{d.year}</text>
            </g>
          );
        })}
        <path d={trendPath} fill="none" stroke={`${C.gold}8c`} strokeWidth={1.5} strokeDasharray="4,3"/>
      </svg>
    );
  };

  // ── SVG: DIVERGENCE ──
  const Divergence=()=>{
    const data=CANON_ALBUMS.filter(a=>a.short!=="Her Loss");
    const W=600,H=320,m={t:50,r:60,b:60,l:55};
    const COMM_SCALE=1000;
    const xS=i=>m.l+(i/(data.length-1))*(W-m.l-m.r);
    const yL=v=>H-m.b-(v/100)*(H-m.t-m.b);
    const yR=v=>H-m.b-(Math.min(v,COMM_SCALE)/COMM_SCALE)*(H-m.t-m.b);
    let critPath="",commPath="";
    data.forEach((d,i)=>{
      critPath+=`${i===0?"M":"L"}${xS(i).toFixed(1)},${yL(d.metacritic).toFixed(1)} `;
      commPath+=`${i===0?"M":"L"}${xS(i).toFixed(1)},${yR(d.commercial).toFixed(1)} `;
    });
    return(
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"auto",display:"block"}}>
        <text x={m.l-8} y={20} fill={C.gold} fontSize={12} fontWeight="700" textAnchor="start">CRITICAL</text>
        <text x={m.l-8} y={34} fill="#777" fontSize={9} textAnchor="start">(Metacritic, 0–100)</text>
        <text x={W-m.r+8} y={20} fill="#78b4ff" fontSize={12} fontWeight="700" textAnchor="end">COMMERCIAL</text>
        <text x={W-m.r+8} y={34} fill="#777" fontSize={9} textAnchor="end">(1st wk SPS, ~k)</text>
        {[0,25,50,75,100].map(v=>(
          <g key={v}>
            <line x1={m.l} y1={yL(v)} x2={W-m.r} y2={yL(v)} stroke="#1f1f1f"/>
            <text x={m.l-8} y={yL(v)+3} fill={C.gold} fontSize={10} textAnchor="end">{v}</text>
          </g>
        ))}
        {[0,250,500,750,1000].map(v=>(
          <text key={v} x={W-m.r+8} y={yR(v)+3} fill="#78b4ff" fontSize={10} textAnchor="start">{v}k</text>
        ))}
        <path d={critPath} fill="none" stroke={C.gold} strokeWidth={2.5}/>
        <path d={commPath} fill="none" stroke="#78b4ff" strokeWidth={2.5}/>
        {data.map((d,i)=>{
          const x=xS(i);
          return(
            <g key={i}>
              <circle cx={x} cy={yL(d.metacritic)} r={4} fill={C.gold} stroke="#0a0a0a" strokeWidth={1.5}/>
              <circle cx={x} cy={yR(d.commercial)} r={4} fill="#78b4ff" stroke="#0a0a0a" strokeWidth={1.5}/>
              <text x={x} y={H-m.b+16} fill="#aaa" fontSize={10} textAnchor="middle" fontWeight="600">{d.short}</text>
              <text x={x} y={H-m.b+30} fill="#666" fontSize={9} textAnchor="middle">{d.year}</text>
            </g>
          );
        })}
      </svg>
    );
  };

  // RENDER
  return(
    <div>
      {/* PLAQUE */}
      <div style={{background:"linear-gradient(135deg,#140a00,#0a0a0a)",border:`1px solid ${C.gold}55`,borderRadius:4,padding:"30px 26px 26px",marginBottom:18,textAlign:"center"}}>
        <div style={{fontSize:9,letterSpacing:5,color:C.goldDim,textTransform:"uppercase",marginBottom:8}}>The Legacy Observatory</div>
        <div style={{fontSize:12,color:C.gold,letterSpacing:6,marginBottom:14,opacity:0.6}}>━ ✦ ━</div>
        <h2 style={{fontSize:"clamp(20px,4vw,28px)",color:C.gold,fontFamily:"Georgia,serif",fontWeight:"normal",margin:"0 0 6px",letterSpacing:1}}>The Drake Demographic Canon Model</h2>
        <div style={{fontSize:11,color:"#8a7a60",fontStyle:"italic",marginBottom:16,letterSpacing:1}}>A structural analysis of cycle, leverage, and the Iceman moment</div>
        <p style={{fontSize:12,color:"#7a6a50",lineHeight:1.85,maxWidth:680,margin:"0 auto 16px",textAlign:"left"}}>
          For 15 years, Drake has been trapped in a structural cycle: demographic cohort-cycling decays his discourse while commercial dominance continues, and at every leverage moment a rival has been positioned to discipline his trajectory. He has survived three near-death events — Meek Mill / Quentin Miller, Pusha T, Kendrick — without ever fully escaping the cycle. This is an analysis of how that cycle works, why his early masters have become structurally more valuable than at any point in his career, and what the Iceman release combined with a projected UMG re-sign is engineered to accomplish: not just personal escape, but breaking the wheel for every artist who follows.
        </p>
        <div style={{fontSize:9,letterSpacing:3,color:"#555",textTransform:"uppercase",marginBottom:16}}>5 sections · ~12 min audio walkthrough</div>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <VoiceBtn sectionKey="intro" label="Intro Overview"/>
          {currentSection===0&&mode==="walkthrough"&&(
            <button onClick={()=>revealSection(1)} style={{padding:"6px 18px",background:`${C.gold}22`,border:`1px solid ${C.gold}`,color:C.gold,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:9,letterSpacing:2,borderRadius:2,outline:"none",textTransform:"uppercase"}}>Begin Walkthrough →</button>
          )}
        </div>
      </div>

      {/* CONTROLS BAR */}
      <div style={{background:"#0d0d0d",border:`1px solid ${C.border}`,borderRadius:3,padding:"10px 14px",marginBottom:18,display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
          <div style={{display:"flex",gap:4}}>
            <button onClick={()=>switchMode("walkthrough")} style={{padding:"5px 12px",background:mode==="walkthrough"?`${C.gold}22`:"transparent",border:`1px solid ${mode==="walkthrough"?C.gold:"#2a2a2a"}`,color:mode==="walkthrough"?C.gold:"#666",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:8.5,letterSpacing:2,borderRadius:2,outline:"none",textTransform:"uppercase"}}>Walkthrough</button>
            <button onClick={()=>switchMode("showall")} style={{padding:"5px 12px",background:mode==="showall"?`${C.gold}22`:"transparent",border:`1px solid ${mode==="showall"?C.gold:"#2a2a2a"}`,color:mode==="showall"?C.gold:"#666",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:8.5,letterSpacing:2,borderRadius:2,outline:"none",textTransform:"uppercase"}}>Show All</button>
          </div>
          <div style={{display:"flex",gap:4}}>
            {["I","II","III","IV","V"].map((roman,i)=>{
              const n=i+1;
              const reachable=mode==="showall"||n<=currentSection;
              const isCurrent=n===currentSection;
              return <button key={n} onClick={()=>jumpTo(n)} disabled={!reachable} style={{width:32,height:26,background:isCurrent?`${C.gold}22`:"transparent",border:`1px solid ${isCurrent?C.gold:"#2a2a2a"}`,color:reachable?(isCurrent?C.gold:"#888"):"#333",cursor:reachable?"pointer":"not-allowed",fontFamily:"Georgia,serif",fontSize:9,letterSpacing:1,borderRadius:2,outline:"none",opacity:reachable?1:0.3}}>{roman}</button>;
            })}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <span style={{fontSize:8.5,color:"#666",letterSpacing:1,textTransform:"uppercase"}}>Voice:</span>
          <select value={selectedVoice} onChange={e=>setSelectedVoice(e.target.value)} disabled={!voices.length} style={{background:"#0a0a0a",border:`1px solid #2a2a2a`,color:"#8a7a60",fontSize:9,padding:"3px 6px",fontFamily:"Georgia,serif",borderRadius:2,maxWidth:160,outline:"none"}}>
            {voices.length===0&&<option>No voices</option>}
            {voices.map(v=>{
              const cleanName=v.name.replace(/Microsoft |Google |Apple /i,"");
              return <option key={v.name} value={v.name}>{cleanName}{v.lang!=="en-US"?` (${v.lang})`:""}</option>;
            })}
          </select>
          <span style={{fontSize:8.5,color:"#666",letterSpacing:1,textTransform:"uppercase",marginLeft:6}}>Speed:</span>
          <input type="range" min={0.7} max={1.5} step={0.05} value={voiceRate} onChange={e=>setVoiceRate(parseFloat(e.target.value))} style={{accentColor:C.gold,width:80,cursor:"pointer"}}/>
          <span style={{fontSize:9,color:C.gold,fontFamily:"Georgia,serif",minWidth:36}}>{voiceRate.toFixed(2)}x</span>
        </div>
      </div>

      {/* ===== SECTION I — THE MECHANISM ===== */}
      <div id="canon-section-1" style={{opacity:isVisible(1)?1:0.18,pointerEvents:isVisible(1)?"auto":"none",transition:"opacity 0.5s",marginBottom:22}}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionNum}>Section I</div>
          <div style={styles.sectionName}>The mechanism</div>
          <div style={styles.sectionIntro}>How musical taste forms, why cohorts cycle through the demo window, and what the math predicts for Drake's catalog. <strong style={{color:"#a09070"}}>The foundation of everything that follows.</strong></div>
          <div style={{marginTop:12}}><VoiceBtn sectionKey={1}/></div>
        </div>

        {/* RECEPTION CURVE */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>The reception curve</div>
          <div style={styles.panelSub}>How much someone likes a Drake album, based on age at release. Soft boundaries align with reminiscence-bump research — musical preferences crystallize between ages 14 and 24.</div>
          <div style={{marginBottom:14}}>
            <label style={{display:"inline-flex",alignItems:"center",gap:8,cursor:"pointer",padding:"5px 12px",border:`1px solid ${softMode?C.gold:"#2a2a2a"}`,background:softMode?`${C.gold}11`:"transparent",borderRadius:2,fontSize:9.5,color:softMode?C.gold:"#666",letterSpacing:1}}>
              <input type="checkbox" checked={softMode} onChange={e=>setSoftMode(e.target.checked)} style={{accentColor:C.gold}}/>
              Soft boundaries (probabilistic demo)
            </label>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"minmax(0,2.3fr) minmax(180px,1fr)",gap:18,alignItems:"center"}}>
            <ReceptionCurve/>
            <div>
              <div style={styles.label}>Demo Min Age</div>
              <input type="range" min={14} max={22} value={demoMin} onChange={e=>setDemoMin(+e.target.value)} style={{accentColor:C.gold,width:"100%",cursor:"pointer"}}/>
              <div style={{fontSize:14,color:C.gold,marginBottom:14,fontFamily:"Georgia,serif"}}>{demoMin}</div>
              <div style={styles.label}>Demo Max Age</div>
              <input type="range" min={24} max={34} value={demoMax} onChange={e=>setDemoMax(+e.target.value)} style={{accentColor:C.gold,width:"100%",cursor:"pointer"}}/>
              <div style={{fontSize:14,color:C.gold,fontFamily:"Georgia,serif"}}>{demoMax}</div>
            </div>
          </div>
        </div>

        {/* SAME-AGE PARADOX */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>The same-age paradox</div>
          <div style={styles.panelSub}>Two listeners. Set their birth years. The number above each album dot is the listener's age when that release dropped.</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>
            {[
              {label:"Listener A",color:C.gold,birth:birthA,setBirth:setBirthA,age:CANON_CY-birthA,stats:statsFor(birthA)},
              {label:"Listener B",color:"#b8d4ff",birth:birthB,setBirth:setBirthB,age:CANON_CY-birthB,stats:statsFor(birthB)},
            ].map(p=>(
              <div key={p.label} style={{background:"#0a0a0a",border:`1px solid ${C.border}`,borderRadius:2,padding:"12px 12px 10px"}}>
                <div style={{fontSize:9,color:p.color,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>{p.label}</div>
                <div style={{fontSize:11,color:"#888",marginBottom:8}}>Born <strong style={{color:"#d4c080"}}>{p.birth}</strong> · Currently <strong style={{color:"#d4c080"}}>{p.age}</strong></div>
                <input type="range" min={1980} max={2008} value={p.birth} onChange={e=>p.setBirth(+e.target.value)} style={{accentColor:p.color,width:"100%",cursor:"pointer"}}/>
                <div style={{display:"flex",gap:14,fontSize:9,color:"#888",marginTop:8,marginBottom:10}}>
                  <div><strong style={{color:"#d4c080"}}>{p.stats.canon}</strong> in canon</div>
                  <div><strong style={{color:C.gold}}>{p.stats.live}</strong> live in-demo</div>
                  <div><strong style={{color:"#b478dc"}}>{p.stats.retro}</strong> retro-blessed</div>
                </div>
                <ParadoxTimeline birthYear={p.birth} color={p.color}/>
              </div>
            ))}
          </div>
          <div style={styles.footnote}>Two listeners can be the same age right now and have completely different Drake canons — the cohort that crystallized on Take Care has a different relationship to the catalog than the cohort that crystallized on Scorpion. Same person, different timing. Different canon.</div>
        </div>

        {/* HEATMAP */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>The full demographic landscape</div>
          <div style={styles.panelSub}>Every birth year × every release. Read horizontally for one cohort's journey. Read vertically to see how a release lands across all cohorts simultaneously.</div>
          <Heatmap/>
          <div style={{display:"flex",gap:14,flexWrap:"wrap",marginTop:10,fontSize:9.5,color:"#888"}}>
            <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:10,height:10,background:C.gold,borderRadius:2}}/>Live in demo</div>
            <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:10,height:10,background:"#b478dc",borderRadius:2}}/>Retro-blessed (caught up to demo)</div>
            <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:10,height:10,background:"#444",borderRadius:2}}/>Aged out</div>
            <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:10,height:10,background:"#1a1a1a",border:"1px solid #333",borderRadius:2}}/>Unborn at release</div>
          </div>
        </div>

        {/* AGGREGATE */}
        <div style={styles.panelKey}>
          <div style={styles.panelTitle}>Structural bias compounds across releases</div>
          <div style={styles.panelSub}>Average reception across all cohorts (1985–2008), per release. Quality is identical across all 11 albums in this model. The decline is entirely artifactual — pure cohort cycling, no quality variation.</div>
          <Aggregate/>
          <div style={styles.keyCallout}>
            <strong style={{color:C.gold,fontStyle:"normal"}}>Dollar implication:</strong> Drake's early masters become structurally more valuable over time, not less. Thank Me Later, Take Care, and Nothing Was the Same keep absorbing endorsements from every new cohort entering the demo window. That's the math behind why Tier-1 masters reversion is the centerpiece of the projected UMG re-sign.
          </div>
          <div style={styles.footnote}>
            The downward slope is <em>entirely artifactual</em>. Every release in the model is equal quality. The decline is just retro-blessing accumulation: TML released 2010 has had 16 years of new cohorts entering demo and blessing it. FATD released 2023 has had three. <strong style={{color:"#7a6a50"}}>Holding flat reads as decline.</strong>
          </div>
        </div>

        <div style={styles.bridge}>
          That's the <strong style={{color:"#a09070"}}>prediction</strong> the model gives — apparent decline even with flat quality, and rising value for the oldest masters. The question now is whether the prediction shows up in Drake's <strong style={{color:"#a09070"}}>real-world data</strong>, and if so, where it concentrates.
        </div>

        {isVisible(1)&&mode==="walkthrough"&&currentSection===1&&(
          <div style={{textAlign:"center",marginTop:14}}>
            <button onClick={()=>revealSection(2)} style={{padding:"8px 22px",background:`${C.gold}15`,border:`1px solid ${C.gold}`,color:C.gold,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:10,letterSpacing:2,borderRadius:2,outline:"none",textTransform:"uppercase"}}>Continue to Section II →</button>
          </div>
        )}
      </div>

      {/* ===== SECTION II — THE PATTERN IN REAL DATA ===== */}
      <div id="canon-section-2" style={{opacity:isVisible(2)?1:0.18,pointerEvents:isVisible(2)?"auto":"none",transition:"opacity 0.5s",marginBottom:22}}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionNum}>Section II</div>
          <div style={styles.sectionName}>The pattern in real data</div>
          <div style={styles.sectionIntro}>Does the model's prediction show up in Drake's actual reception data? The divergence chart resolves it — and reveals three specific moments where commercial spikes upward across critical, each correlating with a major industry-discipline event.</div>
          <div style={{marginTop:12}}><VoiceBtn sectionKey={2}/></div>
        </div>

        {/* DIVERGENCE */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>Critical vs commercial — where they diverge</div>
          <div style={styles.panelSub}>Metacritic plotted against first-week commercial performance across the catalog. Critical drifts down gradually — that's the structural floor from cohort cycling. But commercial doesn't track critical.</div>
          <Divergence/>
          <div style={styles.keyCallout}>
            <strong style={{color:C.gold,fontStyle:"normal"}}>The diagnostic — direction matters:</strong> Critical's gradual decline is the structural floor sinking slowly from cohort cycling. The diagnostic signal isn't critical falling — it's commercial spiking <em>upward</em> across critical. Three moments in the chart show this signature, and each correlates with a major drama event. <strong style={{color:C.gold}}>Views (2016):</strong> commercial leaps to ~1.04M while critical sits at 69 — the Meek Mill / Quentin Miller ghostwriting leverage moment, July 2015, carrying into the Views cycle. <strong style={{color:C.gold}}>Scorpion (2018):</strong> commercial rises to 732K crossing critical 67 — Pusha T's "Story of Adidon" with the son revelation. <strong style={{color:C.gold}}>FATD (2023):</strong> commercial pulls near critical at parity — drama amplifiers build through the Kendrick beef era that follows. These are moments when Drake's natural musical trajectory accumulated enough leverage to threaten the apparatus, and a rival was positioned to flip the divergence signature from music-carrying to drama-carrying.
          </div>
          <div style={styles.footnote}>
            <strong style={{color:"#a09070",fontStyle:"normal"}}>HNM as the inverse signature:</strong> Critical sits far above commercial. The music was carrying the result — the genre experiment got critical respect at Metacritic 73 — while commercial dipped because the in-demo cohort wasn't ready for house. That's "music Drake without commercial juice" — the opposite of the drama-juice pattern. <strong style={{color:"#7a6a50"}}>Note on the data:</strong> Metacritic scores via HipHopDX's October 2023 catalog audit. More Life at 79 and HNM at 73 are bounces that prove quality variation is real and structurally meaningful — great albums can punch through the demographic drag.
          </div>
        </div>

        {/* RIVAL DEPLOYMENT TABLE */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>Industry discipline: the rival-deployment pattern</div>
          <div style={styles.panelSub}>When Drake's natural trajectory threatens to cross the line where his leverage exceeds what the apparatus can comfortably extract from, a rival is positioned to discipline that trajectory. <strong style={{color:"#a09070"}}>Beef as labor management.</strong></div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:560}}>
              <thead>
                <tr>
                  <th style={styles.th}>Era</th>
                  <th style={styles.th}>Drake's Pre-Event Trajectory</th>
                  <th style={styles.th}>Rival Deployed</th>
                  <th style={styles.th}>Rival's Label</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{...styles.td,color:C.gold,whiteSpace:"nowrap"}}>2015–16<br/><span style={{fontSize:9,color:"#666"}}>(into Views)</span></td>
                  <td style={styles.td}>Coming off IYRTITL — last release where critical and commercial converged cleanly. Building creative momentum.</td>
                  <td style={styles.td}>Meek Mill ghostwriting allegations (July 2015) + Quentin Miller leaks carrying into Views cycle</td>
                  <td style={styles.td}>MMG / Atlantic<br/><span style={{fontSize:9,color:"#666"}}>(Warner — non-UMG)</span></td>
                </tr>
                <tr>
                  <td style={{...styles.td,color:C.gold,whiteSpace:"nowrap"}}>2018<br/><span style={{fontSize:9,color:"#666"}}>(Scorpion era)</span></td>
                  <td style={styles.td}>Coming off More Life (Metacritic 79 — bounce). Critical recovery, commercial dominance intact.</td>
                  <td style={styles.td}>Pusha T → "The Story of Adidon" (son revelation)</td>
                  <td style={styles.td}>G.O.O.D. Music / Def Jam<br/><span style={{fontSize:9,color:C.gold}}>(UMG)</span></td>
                </tr>
                <tr>
                  <td style={{...styles.td,color:C.gold,whiteSpace:"nowrap"}}>2024<br/><span style={{fontSize:9,color:"#666"}}>(post-FATD)</span></td>
                  <td style={styles.td}>Her Loss had restored rap credibility. Re-stabilizing into a position of leverage during contract review window.</td>
                  <td style={styles.td}>Kendrick Lamar → multi-track sequence</td>
                  <td style={styles.td}>TDE / Interscope<br/><span style={{fontSize:9,color:C.gold}}>(UMG)</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={styles.keyCallout}>
            <strong style={{color:C.gold,fontStyle:"normal"}}>The pattern:</strong> Two of the three career-defining beef events came from artists on UMG-affiliated labels — the same parent company that owns Drake's contract. <em>That's not cross-label rivalry. That's intra-UMG strikes.</em> When an artist accumulates leverage that threatens label economics, a rival within the same corporate structure becomes the discipline mechanism. Pure organic rivalry would not produce this concentration. The amplifiers don't have to manufacture beefs — but the structural incentive to tolerate, enable, or fail-to-prevent them is real, and the timing is consistent across three career inflection points.
          </div>
        </div>

        {/* BEEF HISTORY GRID */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>Drake's beef history mapped to the cycle</div>
          <div style={styles.panelSub}>Every major beef in Drake's career — rap, business, label, personal — placed against the demographic canon and industry-discipline analysis. The pattern resolves to four categories: three structural cycle events (the L3 moments mapping directly to the divergence chart's line-crossings), label disputes as the structural backdrop, industry-power and platform shifts as cultural infrastructure moving in relation to him, and most peer rivalries as cycle noise.</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:10}}>
            <div style={{background:"#0a0700",border:`1px solid ${C.gold}55`,borderLeft:`3px solid ${C.gold}`,borderRadius:2,padding:"14px 16px"}}>
              <div style={{fontSize:9,color:C.gold,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Industry-Discipline Events — the L3 moments</div>
              <div style={{fontSize:9,color:"#5a4a30",fontStyle:"italic",marginBottom:10}}>Map directly to divergence chart crossings</div>
              <div style={{fontSize:10.5,color:"#a09070",lineHeight:1.85}}>
                <p style={{margin:"0 0 10px"}}><strong style={{color:C.gold}}>Meek Mill / Quentin Miller (July 2015):</strong> Ghostwriting allegations + Funkmaster Flex playing reference tracks. Drake responded with "Charged Up" (July 25) and "Back to Back" (July 29). → <strong>L3 #1 — first commercial-above-critical crossing (Views era).</strong></p>
                <p style={{margin:"0 0 10px"}}><strong style={{color:C.gold}}>Pusha T "Story of Adidon" (May 29, 2018):</strong> Son revelation, blackface cover art, released about a month before Scorpion. Drake conceded the loss in 2019. → <strong>L3 #2 — second crossing (Scorpion era).</strong></p>
                <p style={{margin:0}}><strong style={{color:C.gold}}>Kendrick + multi-front UMG attack (Mar–May 2024):</strong> Kendrick "Like That" (Mar 22), Rick Ross "Champagne Moments" (Apr 15), Kendrick "Euphoria" (Apr 30), "Meet the Grahams" + "Not Like Us" (May 3–4), Metro Boomin "BBL Drizzy" (May 5). → <strong>L3 #3 — third convergence (FATD era into 2024).</strong></p>
              </div>
            </div>
            <div style={{background:"#0a0a0a",border:`1px solid ${C.border}`,borderLeft:`3px solid #6b7280`,borderRadius:2,padding:"14px 16px"}}>
              <div style={{fontSize:9,color:"#a8a8a8",letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Label / Contractual — structural backdrop</div>
              <div style={{fontSize:9,color:"#555",fontStyle:"italic",marginBottom:10}}>Day one through current</div>
              <div style={{fontSize:10.5,color:"#888",lineHeight:1.85}}>
                <p style={{margin:"0 0 8px"}}><strong style={{color:"#a8a8a8"}}>June 2009:</strong> signed to Aspire / Young Money / Cash Money under Republic / UMG distribution.</p>
                <p style={{margin:"0 0 8px"}}><strong style={{color:"#a8a8a8"}}>2012–2016:</strong> Aspire (Drake's first label) sued Cash Money over unpaid royalties on his catalog; ~$11M settlement.</p>
                <p style={{margin:"0 0 8px"}}><strong style={{color:"#a8a8a8"}}>January 2015:</strong> Lil Wayne's $51M lawsuit against Cash Money over withheld <em>Tha Carter V</em> entangled Drake by proxy.</p>
                <p style={{margin:"0 0 8px"}}><strong style={{color:"#a8a8a8"}}>June 2018:</strong> Scorpion's "Is There More" line marked completion of original 8-album obligation; restructured Republic / UMG deal followed.</p>
                <p style={{margin:0}}><strong style={{color:"#a8a8a8"}}>January 2025:</strong> federal lawsuit against UMG (paid bot streams, pay-for-play radio, Super Bowl LIX promotion approval, defamation); dismissed October 2025 on "nonactionable opinion" grounds; appealed Second Circuit January 2026.</p>
              </div>
              <div style={{fontSize:9,color:"#555",fontStyle:"italic",marginTop:10,lineHeight:1.6}}><strong>Label-versus-artist tension has been a constant since day one.</strong></div>
            </div>
            <div style={{background:"#0a0a0a",border:`1px solid ${C.border}`,borderLeft:`3px solid #78b4ff`,borderRadius:2,padding:"14px 16px"}}>
              <div style={{fontSize:9,color:"#78b4ff",letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Industry-Power & Platform Alignment</div>
              <div style={{fontSize:9,color:"#445566",fontStyle:"italic",marginBottom:10}}>Cultural infrastructure shifting</div>
              <div style={{fontSize:10.5,color:"#8a9aac",lineHeight:1.85}}>
                <p style={{margin:"0 0 8px"}}><strong style={{color:"#78b4ff"}}>December 8, 2014:</strong> Diddy confronted Drake at LIV Miami over the Boi-1da "0 to 100" beat; Drake hospitalized with aggravated shoulder injury — industry-power figure asserting hierarchy.</p>
                <p style={{margin:"0 0 8px"}}><strong style={{color:"#78b4ff"}}>September 2024:</strong> Diddy's federal RICO indictment re-contextualized earlier references.</p>
                <p style={{margin:"0 0 8px"}}><strong style={{color:"#78b4ff"}}>2016:</strong> Jay-Z's "Pop Style" verse cut to one line in the final mix — early friction signal after years of collaborations and Drake calling Jay an "incredible mentor."</p>
                <p style={{margin:"0 0 8px"}}><strong style={{color:"#78b4ff"}}>2019:</strong> Roc Nation began NFL halftime partnership with Jay personally selecting headliners.</p>
                <p style={{margin:0}}><strong style={{color:"#78b4ff"}}>February 9, 2025:</strong> Super Bowl LIX headlined by Kendrick at peak of the 2024 rivalry — the most-watched halftime show in history aligned away from Drake.</p>
              </div>
            </div>
            <div style={{background:"#0a0a0a",border:`1px solid ${C.border}`,borderLeft:`3px solid #555`,borderRadius:2,padding:"14px 16px"}}>
              <div style={{fontSize:9,color:"#888",letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Peer Rivalries — cycle noise</div>
              <div style={{fontSize:9,color:"#444",fontStyle:"italic",marginBottom:10}}>Discourse without leverage impact</div>
              <div style={{fontSize:10.5,color:"#777",lineHeight:1.85}}>
                <p style={{margin:"0 0 6px"}}><strong style={{color:"#888"}}>Common (2011):</strong> "Sweet" diss exchange.</p>
                <p style={{margin:"0 0 6px"}}><strong style={{color:"#888"}}>Chris Brown (June 2012):</strong> Nightclub brawl at WIP NYC over Rihanna.</p>
                <p style={{margin:"0 0 6px"}}><strong style={{color:"#888"}}>Joe Budden (2016):</strong> Multi-track beef following negative album reviews.</p>
                <p style={{margin:"0 0 6px"}}><strong style={{color:"#888"}}>Kanye West (2021):</strong> Brief flare-up around CLB / Donda timing; publicly reconciled.</p>
                <p style={{margin:0}}><strong style={{color:"#888"}}>Megan Thee Stallion (2022):</strong> "Circo Loco" line interpretation.</p>
              </div>
              <div style={{fontSize:9,color:"#555",fontStyle:"italic",marginTop:10,lineHeight:1.6}}>Peer-to-peer or personal disputes that generated discourse and tabloid coverage but didn't move the structural cycle. <strong>Naming what's outside the cycle is what makes the events inside it meaningful.</strong></div>
            </div>
          </div>
          <div style={styles.footnote}>
            <strong style={{color:"#a09070",fontStyle:"normal"}}>The arc:</strong> The cycle isn't theoretical — it's documented event-by-event across Drake's career. Three industry-discipline events were structural near-death moments that flipped the divergence signature. Label / contract disputes provided the structural backdrop he's been operating under since 2009. Industry-power confrontations and platform alignment traced the cultural infrastructure shifting in relation to him over fifteen years. Most peer rivalries were noise. <em>Iceman is positioned to break this pattern, not just survive another iteration of it.</em>
          </div>
        </div>

        <div style={styles.bridge}>
          The full beef arc separates what's <strong style={{color:"#a09070"}}>structural</strong> from what's <strong style={{color:"#a09070"}}>noise</strong>. The three industry-discipline events map directly to the three line-crossings on the divergence chart. The label disputes are the backdrop. The platform shifts traced cultural infrastructure moving. Now we organize these observations into a single theory of how the cycle operates.
        </div>

        {isVisible(2)&&mode==="walkthrough"&&currentSection===2&&(
          <div style={{textAlign:"center",marginTop:14}}>
            <button onClick={()=>revealSection(3)} style={{padding:"8px 22px",background:`${C.gold}15`,border:`1px solid ${C.gold}`,color:C.gold,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:10,letterSpacing:2,borderRadius:2,outline:"none",textTransform:"uppercase"}}>Continue to Section III →</button>
          </div>
        )}
      </div>

      {/* ===== SECTION III — SYNTHESIS AND EVIDENCE ===== */}
      <div id="canon-section-3" style={{opacity:isVisible(3)?1:0.18,pointerEvents:isVisible(3)?"auto":"none",transition:"opacity 0.5s",marginBottom:22}}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionNum}>Section III</div>
          <div style={styles.sectionName}>Synthesis and evidence</div>
          <div style={styles.sectionIntro}>With the pattern documented across his career, we organize the observations into a single theory, look at Drake's own description of the mechanism from inside the apparatus, and audit the fifteen-year survival pattern that makes Iceman credible.</div>
          <div style={{marginTop:12}}><VoiceBtn sectionKey={3}/></div>
        </div>

        {/* LAYERED MODEL */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>The layered model</div>
          <div style={styles.panelSub}>Three layers, working simultaneously. None of them alone explain the pattern. Together they produce the cycle.</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:10}}>
            <div style={{background:"#0a0a0a",border:`1px solid ${C.border}`,borderLeft:`3px solid ${C.gold}`,borderRadius:2,padding:"12px 14px"}}>
              <div style={{fontSize:8.5,color:C.goldDim,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Layer 1 · ~50–60%</div>
              <div style={{fontSize:11.5,color:C.gold,fontStyle:"italic",marginBottom:8,fontFamily:"Georgia,serif"}}>Structural foundation</div>
              <div style={{fontSize:10.5,color:"#8a7a60",lineHeight:1.8}}>Demographic cohort cycling produces the base divergence by mathematical necessity. Operates with zero coordination required. Cannot be opted out of. The floor underneath everything else.</div>
            </div>
            <div style={{background:"#0a0a0a",border:`1px solid ${C.border}`,borderLeft:`3px solid #78b4ff`,borderRadius:2,padding:"12px 14px"}}>
              <div style={{fontSize:8.5,color:"#78b4ff",letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Layer 2 · ~30–40%</div>
              <div style={{fontSize:11.5,color:"#78b4ff",fontStyle:"italic",marginBottom:8,fontFamily:"Georgia,serif"}}>Bidirectional amplification</div>
              <div style={{fontSize:10.5,color:"#8a9aac",lineHeight:1.8}}>Uncoordinated industry actors push commercial up and critical down — playlist editors, media houses, label A&R timing, streaming-fraud actors. Not conspiracy. Aligned incentives.</div>
            </div>
            <div style={{background:"#0a0700",border:`1px solid ${C.gold}55`,borderLeft:`3px solid ${C.gold}`,borderRadius:2,padding:"12px 14px"}}>
              <div style={{fontSize:8.5,color:C.gold,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Layer 3 · Stress</div>
              <div style={{fontSize:11.5,color:C.gold,fontStyle:"italic",marginBottom:8,fontFamily:"Georgia,serif"}}>Discipline events</div>
              <div style={{fontSize:10.5,color:"#a09070",lineHeight:1.8}}>When amplifiers align in unusual configurations — rival deployment at leverage-accumulation moments — the structural floor breaks. Three observed: Meek 2015, Pusha 2018, Kendrick 2024.</div>
            </div>
          </div>
          <div style={styles.footnote}>The dynamics aren't Drake-unique. Taylor Swift's masters re-recording project, Lil Wayne's $51M Cash Money suit, Prince's "slave"-era Warner confrontation — same structural conditions, different artists. What makes Drake's case the test is the convergence at this moment.</div>
        </div>

        {/* DRAKE FROM INSIDE */}
        <div style={styles.panelKey}>
          <div style={styles.panelTitle}>The mechanism, described from inside</div>
          <div style={styles.panelSub}>Drake described the amplification layer himself — on Bobbi Althoff's podcast, September 2025.</div>
          <div style={{background:"#000",border:`1px solid ${C.gold}33`,borderRadius:2,padding:"22px 26px",marginTop:6,position:"relative"}}>
            <div style={{position:"absolute",top:8,left:14,fontSize:36,color:`${C.gold}33`,fontFamily:"Georgia,serif",lineHeight:1}}>"</div>
            <p style={{fontSize:12.5,color:"#c0aa70",lineHeight:1.95,margin:"0 0 14px 18px",fontStyle:"italic",fontFamily:"Georgia,serif"}}>
              When I'm dropping an album, they have phone calls — media phone calls — deciding what stance so-and-so is going to take within the first hour, or within the first three hours, or within the first twelve hours. So that this person doesn't overlap with that person... We're talking about first responders in media and in comments. The fastest comments — and the ones that are meant to sit at the top with the most replies — that's a purposeful action. It is not the genuine reaction to how people feel about you.
            </p>
            <div style={{fontSize:9,color:"#666",lineHeight:1.7,marginLeft:18,fontStyle:"normal"}}>— Attributed to Drake on Bobbi Althoff's <em>Not This Again</em> podcast (reported recorded August 2025 in Switzerland, released September 2025). Sourced via Eric Jackson, EventHorizonIQ Substack (May 2026); not independently verified against the original recording.</div>
          </div>
          <div style={styles.keyCallout}>
            <strong style={{color:C.gold,fontStyle:"normal"}}>Why this matters:</strong> Layer 2 isn't theoretical. The artist describes coordinated discourse engineering during release cycles — staggered "first responder" takes, top-comment placement, timing windows. The amplification mechanism described from inside the apparatus.
          </div>
        </div>

        {/* 15-YEAR SURVIVAL AUDIT */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>The cycle and how Drake has survived it</div>
          <div style={styles.panelSub}>Every Drake release audited against the cycle's signature: strong commercial plus active "fell off" discourse. The pattern has been continuous since Thank Me Later. Three of these moments were near-death industry-discipline events — Meek/Quentin Miller, Pusha, Kendrick — and Drake came back from each without ever fully escaping the cycle.</div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:620}}>
              <thead>
                <tr>
                  <th style={styles.th}>Year</th>
                  <th style={styles.th}>Release</th>
                  <th style={{...styles.th,textAlign:"right"}}>Metacritic</th>
                  <th style={{...styles.th,textAlign:"right"}}>Commercial (1st wk)</th>
                  <th style={styles.th}>"Fell Off" Discourse?</th>
                  <th style={styles.th}>Pattern</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {y:2010,r:"Thank Me Later",mc:75,c:"~447K",f:"Yes",p:"Match",fT:"yes",pT:"match"},
                  {y:2011,r:"Take Care",mc:78,c:"~631K",f:"Yes",p:"Match",fT:"yes",pT:"match"},
                  {y:2013,r:"Nothing Was the Same",mc:79,c:"~658K",f:"Yes",p:"Match",fT:"yes",pT:"match"},
                  {y:2015,r:"If You're Reading This…",mc:78,c:"~535K",f:"Mostly no",p:"Partial",fT:"no",pT:"match"},
                  {y:2016,r:"Views",mc:69,c:"~1.04M",f:"Yes",p:"Match",fT:"yes",pT:"match"},
                  {y:2017,r:"More Life",mc:79,c:"~505K",f:"Yes",p:"Match",fT:"yes",pT:"match"},
                  {y:2018,r:"Scorpion",mc:67,c:"~732K",f:"Yes",p:"Match",fT:"yes",pT:"match"},
                  {y:2021,r:"Certified Lover Boy",mc:60,c:"~613K",f:"Yes",p:"Match",fT:"yes",pT:"match"},
                  {y:2022,r:"Honestly, Nevermind",mc:73,c:"~204K",f:"Yes",p:"Match",fT:"yes",pT:"match"},
                  {y:2022,r:"Her Loss (w/ 21 Savage)",mc:62,c:"~404K",f:"Better received",p:"Partial",fT:"no",pT:"match"},
                  {y:2023,r:"For All the Dogs",mc:52,c:"~514K",f:"Yes",p:"Match",fT:"yes",pT:"match"},
                  {y:2024,r:"Kendrick beef diss tracks",mc:"—",c:"Underperformed",f:"Yes (lost beef)",p:"CYCLE BROKEN",fT:"yes",pT:"broken"},
                  {y:2025,r:"$$$4U (w/ PND)",mc:"—",c:"Modest",f:"Yes",p:"Match",fT:"yes",pT:"match"},
                ].map((row,i)=>{
                  const isBroken=row.pT==="broken";
                  const pillF=row.fT==="yes"?{bg:"#2a1a0d",fg:"#f59e0b"}:{bg:"#0d2a1a",fg:"#4acf88"};
                  const pillP=row.pT==="match"?{bg:"#0d1a2a",fg:"#78b4ff"}:row.pT==="broken"?{bg:"#3a0a0a",fg:"#ef4444"}:{bg:"#1a1a1a",fg:"#888"};
                  return(
                    <tr key={i} style={isBroken?{background:`linear-gradient(90deg,#1a0505,transparent)`}:undefined}>
                      <td style={{...styles.td,color:isBroken?"#ef4444":C.gold,whiteSpace:"nowrap"}}>{row.y}</td>
                      <td style={{...styles.td,color:isBroken?"#ef4444":"#c0aa70",fontStyle:isBroken?"italic":"normal"}}>{row.r}</td>
                      <td style={{...styles.td,textAlign:"right",color:"#888"}}>{row.mc}</td>
                      <td style={{...styles.td,textAlign:"right",color:"#888"}}>{row.c}</td>
                      <td style={styles.td}><span style={{fontSize:9,letterSpacing:1,padding:"2px 8px",borderRadius:10,background:pillF.bg,color:pillF.fg,textTransform:"uppercase"}}>{row.f}</span></td>
                      <td style={styles.td}><span style={{fontSize:9,letterSpacing:1,padding:"2px 8px",borderRadius:10,background:pillP.bg,color:pillP.fg,textTransform:"uppercase",fontWeight:isBroken?"bold":"normal"}}>{row.p}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={styles.keyCallout}>
            <strong style={{color:C.gold,fontStyle:"normal"}}>The pattern that makes Iceman credible:</strong> Three career-defining beefs were industry-discipline near-death events. He survived each without breaking the cycle. The <strong style={{color:"#ef4444"}}>2024 row is the first time the cycle actually broke</strong> — the Kendrick diss tracks underperformed and the narrative defeat landed. That 15-year survival track record, including the one structural break, is what makes the Iceman + leveraged re-sign hypothesis credible. This isn't a Hail Mary. It's the culmination of a long pattern of surviving the system while accumulating leverage against it — and now answering the one moment the cycle penetrated.
          </div>
        </div>

        <div style={styles.bridge}>
          The cycle is <strong style={{color:"#a09070"}}>real, documented, and consistently survived</strong>. Drake has come back from three near-death industry-discipline events without ever breaking free. That fifteen-year track record is what makes Iceman credible as the move that finally breaks the pattern — so what does it actually need to be?
        </div>

        {isVisible(3)&&mode==="walkthrough"&&currentSection===3&&(
          <div style={{textAlign:"center",marginTop:14}}>
            <button onClick={()=>revealSection(4)} style={{padding:"8px 22px",background:`${C.gold}15`,border:`1px solid ${C.gold}`,color:C.gold,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:10,letterSpacing:2,borderRadius:2,outline:"none",textTransform:"uppercase"}}>Continue to Section IV →</button>
          </div>
        )}
      </div>

      {/* ===== SECTION IV — THE ICEMAN MOMENT ===== */}
      <div id="canon-section-4" style={{opacity:isVisible(4)?1:0.18,pointerEvents:isVisible(4)?"auto":"none",transition:"opacity 0.5s",marginBottom:22}}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionNum}>Section IV</div>
          <div style={styles.sectionName}>The Iceman moment</div>
          <div style={styles.sectionIntro}>Given the cycle is real and consistently survived — what does Iceman need to be to break it, what strategic options exist, and what does the projected deal actually look like at the magnitudes that would template the move for the entire industry?</div>
          <div style={{marginTop:12}}><VoiceBtn sectionKey={4}/></div>
        </div>

        {/* QUALITY TIERS */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>What Iceman needs to be</div>
          <div style={styles.panelSub}>Quality tier of the album maps directly to the structural outcome of the deal. Only one tier breaks the wheel.</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10}}>
            <div style={{background:"#0a0a0a",border:"1px solid #4a1f1f",borderLeft:"3px solid #ef4444",borderRadius:2,padding:"12px 14px"}}>
              <div style={{fontSize:8.5,color:"#ef4444",letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Bad / Mid</div>
              <div style={{fontSize:11,color:"#a06060",fontStyle:"italic",marginBottom:8,fontFamily:"Georgia,serif"}}>Depth Rating ≤ 80</div>
              <div style={{fontSize:10.5,color:"#8a7a60",lineHeight:1.75,marginBottom:8}}>Confirms the cycle. Discourse pivots to "Drake is finished" with data behind it for the first time.</div>
              <div style={{fontSize:9,color:"#666",letterSpacing:1,textTransform:"uppercase"}}>Deal: <span style={{color:"#a06060"}}>$500–700M</span> · wheel survives</div>
            </div>
            <div style={{background:"#0a0a0a",border:"1px solid #3a2f1a",borderLeft:"3px solid #f59e0b",borderRadius:2,padding:"12px 14px"}}>
              <div style={{fontSize:8.5,color:"#f59e0b",letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Good</div>
              <div style={{fontSize:11,color:"#b08040",fontStyle:"italic",marginBottom:8,fontFamily:"Georgia,serif"}}>Depth Rating 80–85</div>
              <div style={{fontSize:10.5,color:"#8a7a60",lineHeight:1.75,marginBottom:8}}>Holds the baseline. Confirms resilience without breakout. Cycle continues, but the floor remains structurally stable.</div>
              <div style={{fontSize:9,color:"#666",letterSpacing:1,textTransform:"uppercase"}}>Deal: <span style={{color:"#b08040"}}>$800M–1.0B</span> · wheel survives</div>
            </div>
            <div style={{background:"#0a0a0a",border:"1px solid #1f3a2f",borderLeft:"3px solid #4acf88",borderRadius:2,padding:"12px 14px"}}>
              <div style={{fontSize:8.5,color:"#4acf88",letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Great</div>
              <div style={{fontSize:11,color:"#7ab09a",fontStyle:"italic",marginBottom:8,fontFamily:"Georgia,serif"}}>More Life / HNM tier</div>
              <div style={{fontSize:10.5,color:"#8a7a60",lineHeight:1.75,marginBottom:8}}>Hits the midpoint. The deal prints near projection. Resilience converts to leverage, but the wheel doesn't break.</div>
              <div style={{fontSize:9,color:"#666",letterSpacing:1,textTransform:"uppercase"}}>Deal: <span style={{color:"#7ab09a"}}>~$1.15B</span> · cycle still operates</div>
            </div>
            <div style={{background:"#0a0700",border:`1px solid ${C.gold}88`,borderLeft:`3px solid ${C.gold}`,borderRadius:2,padding:"12px 14px",boxShadow:`0 0 16px ${C.gold}22`}}>
              <div style={{fontSize:8.5,color:C.gold,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Classic · Cla$$$ic</div>
              <div style={{fontSize:11,color:C.gold,fontStyle:"italic",marginBottom:8,fontFamily:"Georgia,serif"}}>Take Care / Scorpion tier</div>
              <div style={{fontSize:10.5,color:"#a09070",lineHeight:1.75,marginBottom:8}}>Generation-defining. The Cla$$$ic wordplay made explicit: classic music plus the leverage moment that prints the deal. Dollar signs as delivery system.</div>
              <div style={{fontSize:9,color:C.gold,letterSpacing:1,textTransform:"uppercase"}}>Deal: <strong>$1.4B+</strong> · <strong>wheel breaks</strong></div>
            </div>
          </div>
          <div style={styles.keyCallout}>
            <strong style={{color:C.gold,fontStyle:"normal"}}>The wordplay isn't accidental.</strong> Cla$$$ic = classic + $$$. The album has to be both — generation-defining music AND the leverage moment that prints the deal. They aren't separate goals. The dollar signs are the structural delivery system that makes the music's cultural force land at industry-restructuring magnitudes. A good album or worse is failure relative to the ambition. A great album is steady course but doesn't break the cycle. A classic combined with the deal is what changes music history.
          </div>
        </div>

        {/* ESCAPE ROUTES */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>Escape routes</div>
          <div style={styles.panelSub}>Three paths fail by structural analysis. One has the conditions to work — and only at this exact moment in his career.</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:10}}>
            <div style={{background:"#0a0a0a",border:`1px solid ${C.border}`,borderRadius:2,padding:"12px 14px",opacity:0.65}}>
              <div style={{fontSize:8.5,color:"#888",letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Route 1 · Won't work</div>
              <div style={{fontSize:11.5,color:"#888",fontStyle:"italic",marginBottom:8,fontFamily:"Georgia,serif"}}>Music quality alone</div>
              <div style={{fontSize:10.5,color:"#666",lineHeight:1.75}}>Without the structural deal beneath it, even a classic just becomes another bounce within the cycle. Returns to the floor. The pattern absorbs everything quality-driven.</div>
            </div>
            <div style={{background:"#0a0a0a",border:`1px solid ${C.border}`,borderRadius:2,padding:"12px 14px",opacity:0.65}}>
              <div style={{fontSize:8.5,color:"#888",letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Route 2 · Tested · failed</div>
              <div style={{fontSize:11.5,color:"#888",fontStyle:"italic",marginBottom:8,fontFamily:"Georgia,serif"}}>Genre pivot</div>
              <div style={{fontSize:10.5,color:"#666",lineHeight:1.75}}>Honestly, Nevermind ran the experiment. The dance/house turn moved the format but did not break the discourse pattern. The amplification layer adapted within one news cycle.</div>
            </div>
            <div style={{background:"#0a0a0a",border:`1px solid ${C.border}`,borderRadius:2,padding:"12px 14px",opacity:0.7}}>
              <div style={{fontSize:8.5,color:"#888",letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Route 3 · Wrong identity</div>
              <div style={{fontSize:11.5,color:"#888",fontStyle:"italic",marginBottom:8,fontFamily:"Georgia,serif"}}>Full independence (Kanye path)</div>
              <div style={{fontSize:10.5,color:"#888",lineHeight:1.75}}>Cut UMG out entirely. Pure independent label, build distribution from scratch. Solves the label problem but loses the distribution machine that protects the commercial floor — trades one structural problem for another. The "build out" move, Kanye-style. Never been Drake's strategic identity. His brand pattern is partnership over infrastructure-building: <strong style={{color:"#a09070"}}>Nike, Apple, Stake, Santa Anna for OVO.</strong></div>
            </div>
            <div style={{background:"#0a0700",border:`1px solid ${C.gold}88`,borderLeft:`3px solid ${C.gold}`,borderRadius:2,padding:"12px 14px",boxShadow:`0 0 16px ${C.gold}22`}}>
              <div style={{fontSize:8.5,color:C.gold,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Route 4 · The live escape</div>
              <div style={{fontSize:11.5,color:C.gold,fontStyle:"italic",marginBottom:8,fontFamily:"Georgia,serif"}}>Cla$$$ic + leveraged re-sign</div>
              <div style={{fontSize:10.5,color:"#a09070",lineHeight:1.75}}>A classic-tier Iceman validates demand at the high-end magnitudes. The deal closes at <strong style={{color:C.gold}}>$1.4B+</strong> with full Tier-1 masters reversion, OVO co-equity, sync autonomy. Pershing's $64.4B activist bid creates the urgency premium. Drake announces it as the largest artist deal in recorded music history. Templates the move for the industry — other major artists follow. <strong style={{color:C.gold}}>Not stop the wheel. Break the wheel.</strong></div>
            </div>
          </div>
          <div style={styles.keyCallout}>
            <strong style={{color:C.gold,fontStyle:"normal"}}>The triangulation:</strong> The lawsuit gives him negotiating leverage. The 2-year strategic quiet (FATD October 2023 → Iceman May 2026) compounded demand pressure. The Pershing bid created board-level retention urgency at the right moment. Iceman is the music — but it has to be classic to validate the deal at the magnitude required. If it lands as classic, the deal closes at the ceiling and the major-label artist economic model gets restructured behind him. If it lands as merely great, he gets a record-setting deal but the cycle survives. <em>Quality of the music determines whether this is a personal escape or a structural revolution.</em>
          </div>
        </div>

        {/* DEAL STRUCTURE */}
        <div style={styles.panelKey}>
          <div style={styles.panelTitle}>The deal structure (projected per EventHorizonIQ analysis)</div>
          <div style={styles.panelSub}>Component-level breakdown of what a leveraged re-sign would look like, derived from <strong style={{color:"#a09070"}}>Eric Jackson's Wall Street structural model</strong> and <strong style={{color:"#a09070"}}>BlueSav's hip-hop fan-tier prediction</strong> — which converged on similar magnitudes from different analytical frames. All figures below are projections, not disclosed terms.</div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:520}}>
              <thead>
                <tr>
                  <th style={styles.th}>Component</th>
                  <th style={{...styles.th,textAlign:"right"}}>Projected Range</th>
                  <th style={{...styles.th,textAlign:"right"}}>Midpoint</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={styles.td}>Cash advance (incl. Pershing-pressure premium)</td><td style={{...styles.td,textAlign:"right",color:"#a09070"}}>$700M – $1B</td><td style={{...styles.td,textAlign:"right",color:C.gold}}>$850M</td></tr>
                <tr><td style={styles.td}>Tier-1 masters reversion (TML / Take Care / NWTS)</td><td style={{...styles.td,textAlign:"right",color:"#a09070"}}>$80M – $150M</td><td style={{...styles.td,textAlign:"right",color:C.gold}}>$115M</td></tr>
                <tr><td style={styles.td}>Tier-2 partial reversion (IYRTITL / Views / More Life)</td><td style={{...styles.td,textAlign:"right",color:"#a09070"}}>$20M – $60M</td><td style={{...styles.td,textAlign:"right",color:C.gold}}>$40M</td></tr>
                <tr><td style={styles.td}>OVO Sound equity (5–10%)</td><td style={{...styles.td,textAlign:"right",color:"#a09070"}}>$15M – $75M</td><td style={{...styles.td,textAlign:"right",color:C.gold}}>$45M</td></tr>
                <tr><td style={styles.td}>Distribution rights for OVO roster</td><td style={{...styles.td,textAlign:"right",color:"#a09070"}}>$25M – $100M</td><td style={{...styles.td,textAlign:"right",color:C.gold}}>$50M</td></tr>
                <tr><td style={styles.td}>Sync licensing autonomy on Tier-1</td><td style={{...styles.td,textAlign:"right",color:"#a09070"}}>$15M – $50M</td><td style={{...styles.td,textAlign:"right",color:C.gold}}>$30M</td></tr>
                <tr><td style={styles.td}>Publishing / visual / merch</td><td style={{...styles.td,textAlign:"right",color:"#a09070"}}>$50M – $100M</td><td style={{...styles.td,textAlign:"right",color:C.gold}}>$75M</td></tr>
                <tr style={{borderTop:`2px solid ${C.gold}55`}}>
                  <td style={{...styles.td,color:C.gold,fontFamily:"Georgia,serif",fontStyle:"italic"}}><strong>Projected total deal value</strong></td>
                  <td style={{...styles.td,textAlign:"right",color:C.gold,fontSize:12,fontFamily:"Georgia,serif"}}><strong>$900M – $1.4B</strong></td>
                  <td style={{...styles.td,textAlign:"right",color:C.gold,fontSize:13,fontFamily:"Georgia,serif"}}><strong>~$1.15B</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={styles.footnote}>
            <strong style={{color:"#a09070",fontStyle:"normal"}}>Projected term:</strong> roughly 3 albums over 5 years. Re-negotiates again 2031. <strong style={{color:"#a09070",fontStyle:"normal"}}>Resolution paths:</strong> UMG SEC / Euronext filing (4-day disclosure rule under EU rules), Variety / Billboard press leak (typical 2–12 month lag), Drake-side announcement, or Pershing bid resolution. <strong style={{color:"#a09070"}}>Most likely public disclosure window: October 2026 – May 2027.</strong>
          </div>
        </div>

        <div style={styles.bridge}>
          That's the move: <strong style={{color:"#a09070"}}>classic-tier Iceman + leveraged re-sign</strong>, the structural conversion from artist-as-asset to artist-as-business-partner. If it closes at the projected magnitudes — what changes, for him and for the industry behind him?
        </div>

        {isVisible(4)&&mode==="walkthrough"&&currentSection===4&&(
          <div style={{textAlign:"center",marginTop:14}}>
            <button onClick={()=>revealSection(5)} style={{padding:"8px 22px",background:`${C.gold}15`,border:`1px solid ${C.gold}`,color:C.gold,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:10,letterSpacing:2,borderRadius:2,outline:"none",textTransform:"uppercase"}}>Continue to Section V →</button>
          </div>
        )}
      </div>

      {/* ===== SECTION V — AFTER THE WHEEL BREAKS ===== */}
      <div id="canon-section-5" style={{opacity:isVisible(5)?1:0.18,pointerEvents:isVisible(5)?"auto":"none",transition:"opacity 0.5s",marginBottom:22}}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionNum}>Section V</div>
          <div style={styles.sectionName}>After the wheel breaks</div>
          <div style={styles.sectionIntro}>If a classic-tier Iceman lands and the deal closes at projected magnitudes — what changes, for Drake personally and for the entire major-label artist economic model behind him?</div>
          <div style={{marginTop:12}}><VoiceBtn sectionKey={5}/></div>
        </div>

        {/* IMPLICATIONS GRID */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>What propagates outward</div>
          <div style={styles.panelSub}>The effects of a classic-tier Iceman + projected UMG re-sign are not contained at the artist level. They restructure what's negotiable across the entire major-label artist economic model.</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:10}}>
            <div style={{background:"#0a0700",border:`1px solid ${C.gold}55`,borderLeft:`3px solid ${C.gold}`,borderRadius:2,padding:"14px 16px"}}>
              <div style={{fontSize:9,color:C.gold,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>For Drake</div>
              <div style={{fontSize:11.5,color:C.gold,fontStyle:"italic",marginBottom:10,fontFamily:"Georgia,serif"}}>The climax, not just a win</div>
              <div style={{fontSize:10.5,color:"#a09070",lineHeight:1.85}}>Breaking the cycle isn't business — it's the climax of a 15-year career strategy. Every brand partnership, every label friction, every survival of a near-death event has been compounding leverage for this exact moment. The two-year strategic quiet was negotiation positioning. Not surrender.</div>
            </div>
            <div style={{background:"#0a0a0a",border:`1px solid ${C.border}`,borderLeft:`3px solid #78b4ff`,borderRadius:2,padding:"14px 16px"}}>
              <div style={{fontSize:9,color:"#78b4ff",letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>For Tier-1 peers</div>
              <div style={{fontSize:11.5,color:"#78b4ff",fontStyle:"italic",marginBottom:10,fontFamily:"Georgia,serif"}}>The new precedent</div>
              <div style={{fontSize:10.5,color:"#8a9aac",lineHeight:1.85}}>Masters reversion and equity participation become the new floor of what's negotiable. Kendrick. Bad Bunny. Beyoncé. Taylor at her next UMG window. The benchmark resets — what was unthinkable becomes the opening ask.</div>
            </div>
            <div style={{background:"#0a0a0a",border:`1px solid ${C.border}`,borderLeft:`3px solid #4acf88`,borderRadius:2,padding:"14px 16px"}}>
              <div style={{fontSize:9,color:"#4acf88",letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>For smaller acts</div>
              <div style={{fontSize:11.5,color:"#4acf88",fontStyle:"italic",marginBottom:10,fontFamily:"Georgia,serif"}}>The floor rises</div>
              <div style={{fontSize:10.5,color:"#7ab09a",lineHeight:1.85}}>Even artists who can't extract Drake's specific terms benefit. Standard floors rise across rosters. Renegotiation cycles become moments to ask for what's been proven possible. The compression of label leverage propagates downward.</div>
            </div>
            <div style={{background:"#0a0a0a",border:`1px solid ${C.border}`,borderLeft:`3px solid #b478dc`,borderRadius:2,padding:"14px 16px"}}>
              <div style={{fontSize:9,color:"#b478dc",letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>For the industry</div>
              <div style={{fontSize:11.5,color:"#b478dc",fontStyle:"italic",marginBottom:10,fontFamily:"Georgia,serif"}}>Label-as-distributor</div>
              <div style={{fontSize:10.5,color:"#9889a0",lineHeight:1.85}}>Power shifts from label-as-owner to label-as-distributor. The major-label economic model — extract maximum value from artist on a rigged demographic-cycling playing field — becomes harder to sustain when the marquee artists have restructured. Streaming dynamics rebalance because artists with sync autonomy and platform leverage can negotiate directly. The industry gets less extractive by structural compulsion, not goodwill.</div>
            </div>
            <div style={{background:"#0a0a0a",border:`1px solid ${C.border}`,borderLeft:`3px solid #f59e0b`,borderRadius:2,padding:"14px 16px"}}>
              <div style={{fontSize:9,color:"#f59e0b",letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>For creation</div>
              <div style={{fontSize:11.5,color:"#f59e0b",fontStyle:"italic",marginBottom:10,fontFamily:"Georgia,serif"}}>Less label-timeline pressure</div>
              <div style={{fontSize:10.5,color:"#a89060",lineHeight:1.85}}>Artists who own their masters can re-release, re-sequence, strategically withhold. Sync placement decisions stop being label-driven. Catalog management moves from external coordination to internal strategy. More autonomy, less timeline coercion.</div>
            </div>
            <div style={{background:"#0a0a0a",border:`1px solid ${C.border}`,borderLeft:`3px solid #e879f9`,borderRadius:2,padding:"14px 16px"}}>
              <div style={{fontSize:9,color:"#e879f9",letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>For listeners</div>
              <div style={{fontSize:11.5,color:"#e879f9",fontStyle:"italic",marginBottom:10,fontFamily:"Georgia,serif"}}>Less mediated discourse</div>
              <div style={{fontSize:10.5,color:"#a890b0",lineHeight:1.85}}>The first-responders-in-media mechanism gets harder to deploy when artists own equity and have legal precedent to point at. More direct artist-fan relationships. The relationship between hearing an album and forming an opinion becomes less mediated.</div>
            </div>
          </div>
        </div>

        {/* CLOSING THESIS */}
        <div style={{...styles.panelKey,padding:"26px 24px 22px",textAlign:"center"}}>
          <div style={{fontSize:9,letterSpacing:5,color:C.goldDim,textTransform:"uppercase",marginBottom:14}}>The Thesis</div>
          <p style={{fontSize:13,color:"#d4c080",lineHeight:2.05,margin:"0 auto",maxWidth:680,fontStyle:"italic",fontFamily:"Georgia,serif"}}>
            The wheel exists because artists individually cannot outleverage the apparatus. Drake has uniquely converged the conditions to outleverage it — scale, lawsuit, strategic quiet, Pershing-bid timing, and a potentially classic-tier album. If the move closes, the wheel doesn't just break for him. It breaks for everyone capable of following the template. <strong style={{color:C.gold,fontStyle:"normal"}}>That's the difference between a personal escape and a structural revolution.</strong>
          </p>
        </div>

        <div style={styles.footnote}>
          <strong style={{color:"#a09070",fontStyle:"normal"}}>The cost side:</strong> Major labels lose dynastic control of catalogs they've historically retained as assets. Margin compression at the top of the artist roster propagates downward. Streaming platforms face renegotiated rates as artists with masters and equity demand better splits. The industry becomes more competitive, less extractive, and less concentrated in label hands. <strong style={{color:"#7a6a50",fontStyle:"normal"}}>Whether that reads as good or bad depends on which side of the table.</strong>
        </div>

        {isVisible(5)&&(
          <div style={{textAlign:"center",marginTop:18}}>
            <button onClick={restart} style={{padding:"8px 22px",background:"transparent",border:`1px solid #2a2a2a`,color:"#666",cursor:"pointer",fontFamily:"Georgia,serif",fontSize:10,letterSpacing:2,borderRadius:2,outline:"none",textTransform:"uppercase"}}>↺ Restart walkthrough</button>
          </div>
        )}
      </div>

      {/* CANON FOOTER */}
      <div style={{textAlign:"center",padding:"24px 18px 6px",borderTop:`1px solid ${C.border}`,marginTop:24}}>
        <div style={{fontSize:8,letterSpacing:4,color:"#555",textTransform:"uppercase",marginBottom:6}}>━ End of Canon ━</div>
        <div style={{fontSize:10,color:"#444",fontStyle:"italic",lineHeight:1.75,maxWidth:540,margin:"0 auto"}}>Demographic model: reminiscence-bump research (musical preference crystallization, ages 14–24). Album reception data: Luminate (first-week units) and Metacritic. Deal projections are analytical, derived from comparable transactions — Taylor / UMG, Wayne / Cash Money, Prince / Warner. Not insider information.</div>
      </div>
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
    ["beef","Beef Lens"],["iceman","Iceman ◇"],["canon","Canon ✦"],
    ["peers","Peers"],["legitimacy","NLU ◆ Conspiracy"],["awards","Awards Gap"],
    ["media","Media Lens"],["conclusions","Conclusions"],["data","Data"],
  ];

  return(
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"Georgia,'Times New Roman',serif",color:"#e8d9a0",paddingBottom:80}}>
      <div style={{background:"linear-gradient(180deg,#1c1400 0%,#0a0a0a 100%)",borderBottom:`1px solid ${C.border}`,padding:"22px 20px 16px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(255,215,0,0.025) 1px,transparent 1px)",backgroundSize:"30px 30px",pointerEvents:"none"}}/>
        <div style={{position:"relative"}}>
          <div style={{fontSize:10,letterSpacing:7,color:C.goldDim,textTransform:"uppercase",marginBottom:6}}>◆ A Fan Archive ◆</div>
          <h1 style={{fontSize:"clamp(17px,4vw,28px)",fontWeight:"normal",color:C.gold,margin:"0 0 4px",letterSpacing:2}}>The Legacy Observatory</h1>
          <div style={{fontSize:9,color:"#666",letterSpacing:3,textTransform:"uppercase",marginBottom:6}}>A data-driven analysis of Drake's catalog · Data as of Sept 5, 2025</div>
          <div style={{fontSize:10,color:C.goldDim,fontStyle:"italic",opacity:0.6}}>"The data doesn't lie, even when the narrative does."</div>
          <div style={{fontSize:8,color:"#555",letterSpacing:2,textTransform:"uppercase",marginTop:10,opacity:0.7}}>Independent fan project · Not affiliated with Drake, OVO Sound, or Republic Records</div>
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
        {tab==="canon"      &&<CanonTab/>}
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
