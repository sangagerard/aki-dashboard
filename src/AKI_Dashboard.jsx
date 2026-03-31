import { useState, useEffect, useRef } from "react"
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart
} from "recharts"
import {
  Home, BarChart2, TrendingUp, TrendingDown, DollarSign, Users, Package,
  AlertTriangle, Settings, LogOut, Bell, ChevronRight, Activity,
  ArrowUp, ArrowDown, RefreshCw, Shield, FileText, Target, Clock,
  Globe, Layers, Zap, Award, CheckCircle, XCircle, Eye, Lock, Truck, Box
} from "lucide-react"

// ══════════════════════════════════════════
//  COLORS & THEME
// ══════════════════════════════════════════
const C = {
  gold:      "#FFD700",
  goldMid:   "#DAA520",
  goldDark:  "#B8860B",
  goldDeep:  "#8B6508",
  bg:        "#0B0F1A",
  card:      "#111827",
  cardBorder:"#1F2937",
  cardHover: "#1A2235",
  sidebar:   "#0D1120",
  text:      "#F9FAFB",
  textMuted: "#9CA3AF",
  textDim:   "#6B7280",
  green:     "#10B981",
  red:       "#EF4444",
  blue:      "#3B82F6",
  orange:    "#F59E0B",
  purple:    "#8B5CF6",
}

// ══════════════════════════════════════════
//  MOCK DATA
// ══════════════════════════════════════════

// Gold price (USD/troy oz) — 30 days
const GOLD_30D = [
  {d:"Mar 1", p:2085, v:1240},  {d:"Mar 2", p:2092, v:980},   {d:"Mar 3", p:2078, v:1100},
  {d:"Mar 4", p:2103, v:1350},  {d:"Mar 5", p:2118, v:1580},  {d:"Mar 6", p:2112, v:890},
  {d:"Mar 7", p:2125, v:1420},  {d:"Mar 8", p:2138, v:1680},  {d:"Mar 9", p:2130, v:1200},
  {d:"Mar 10",p:2145, v:1550},  {d:"Mar 11",p:2155, v:1320},  {d:"Mar 12",p:2148, v:1100},
  {d:"Mar 13",p:2162, v:1730},  {d:"Mar 14",p:2170, v:1450},  {d:"Mar 15",p:2165, v:1280},
  {d:"Mar 16",p:2178, v:1600},  {d:"Mar 17",p:2185, v:1390},  {d:"Mar 18",p:2193, v:1720},
  {d:"Mar 19",p:2188, v:1050},  {d:"Mar 20",p:2200, v:1480},  {d:"Mar 21",p:2212, v:1890},
  {d:"Mar 22",p:2205, v:1340},  {d:"Mar 23",p:2220, v:1650},  {d:"Mar 24",p:2235, v:2010},
  {d:"Mar 25",p:2228, v:1560},  {d:"Mar 26",p:2242, v:1780},  {d:"Mar 27",p:2250, v:2100},
  {d:"Mar 28",p:2245, v:1400},  {d:"Mar 29",p:2258, v:1920},  {d:"Mar 30",p:2265, v:2250},
]

// USD / TZS exchange — 30 days
const USDTZS_30D = [
  {d:"Mar 1", r:2518},{d:"Mar 2", r:2522},{d:"Mar 3", r:2515},{d:"Mar 4", r:2530},
  {d:"Mar 5", r:2538},{d:"Mar 6", r:2534},{d:"Mar 7", r:2545},{d:"Mar 8", r:2552},
  {d:"Mar 9", r:2548},{d:"Mar 10",r:2560},{d:"Mar 11",r:2555},{d:"Mar 12",r:2563},
  {d:"Mar 13",r:2570},{d:"Mar 14",r:2568},{d:"Mar 15",r:2575},{d:"Mar 16",r:2582},
  {d:"Mar 17",r:2579},{d:"Mar 18",r:2590},{d:"Mar 19",r:2585},{d:"Mar 20",r:2595},
  {d:"Mar 21",r:2600},{d:"Mar 22",r:2597},{d:"Mar 23",r:2608},{d:"Mar 24",r:2615},
  {d:"Mar 25",r:2611},{d:"Mar 26",r:2620},{d:"Mar 27",r:2628},{d:"Mar 28",r:2625},
  {d:"Mar 29",r:2635},{d:"Mar 30",r:2642},
]

// Monthly financial data
const MONTHLY_FIN = [
  {m:"Aug",rev:285,exp:190,profit:95},  {m:"Sep",rev:310,exp:205,profit:105},
  {m:"Oct",rev:295,exp:198,profit:97},  {m:"Nov",rev:340,exp:215,profit:125},
  {m:"Dec",rev:380,exp:240,profit:140}, {m:"Jan",rev:355,exp:225,profit:130},
  {m:"Feb",rev:410,exp:255,profit:155}, {m:"Mar",rev:445,exp:268,profit:177},
]

// Expenditure breakdown
const EXP_BREAKDOWN = [
  {name:"Labour",    value:32, color:C.gold},
  {name:"Equipment", value:24, color:C.blue},
  {name:"Chemicals", value:18, color:C.orange},
  {name:"Transport", value:12, color:C.purple},
  {name:"Utilities", value:8,  color:C.green},
  {name:"Admin",     value:6,  color:"#EC4899"},
]

// Gold operations monthly
const GOLD_OPS = [
  {m:"Aug",extracted:105,processed:98, sold:90},
  {m:"Sep",extracted:118,processed:112,sold:105},
  {m:"Oct",extracted:110,processed:105,sold:98},
  {m:"Nov",extracted:128,processed:122,sold:115},
  {m:"Dec",extracted:138,processed:132,sold:128},
  {m:"Jan",extracted:132,processed:127,sold:120},
  {m:"Feb",extracted:145,processed:140,sold:135},
  {m:"Mar",extracted:152,processed:147,sold:142},
]

// Risk register
const RISKS = [
  {id:"R01",category:"Market",    name:"Gold Price Volatility",    prob:4,impact:5,status:"Active",   owner:"Director"},
  {id:"R02",category:"Ops",       name:"Equipment Breakdown",       prob:3,impact:4,status:"Mitigated",owner:"Ops Manager"},
  {id:"R03",category:"Regulatory",name:"Mining Permit Compliance",  prob:2,impact:5,status:"Active",   owner:"Legal"},
  {id:"R04",category:"Financial", name:"Currency Fluctuation (TZS)",prob:4,impact:4,status:"Active",   owner:"Finance"},
  {id:"R05",category:"Safety",    name:"Worker Site Accidents",     prob:2,impact:5,status:"Mitigated",owner:"HSE"},
  {id:"R06",category:"Supply",    name:"Chemical Supply Disruption",prob:3,impact:3,status:"Monitored",owner:"Procurement"},
  {id:"R07",category:"Financial", name:"Buyer Default / Non-Payment",prob:2,impact:4,status:"Mitigated",owner:"Finance"},
  {id:"R08",category:"Ops",       name:"Water Supply Shortage",     prob:3,impact:3,status:"Active",   owner:"Ops Manager"},
]

// Team data
const TEAM = [
  {id:1,name:"James Mwangi",   role:"Director",   dept:"Executive",   status:"Active",  perf:98},
  {id:2,name:"Amina Hassan",   role:"Director",   dept:"Finance",     status:"Active",  perf:96},
  {id:3,name:"Peter Kimaro",   role:"Ops Manager",dept:"Operations",  status:"Active",  perf:92},
  {id:4,name:"Rose Makundi",   role:"Accountant", dept:"Finance",     status:"Active",  perf:88},
  {id:5,name:"David Nyanda",   role:"Engineer",   dept:"Operations",  status:"Active",  perf:85},
  {id:6,name:"Fatuma Ally",    role:"HSE Officer",dept:"Safety",      status:"Active",  perf:90},
  {id:7,name:"Charles Banda",  role:"Geologist",  dept:"Operations",  status:"On Leave",perf:87},
  {id:8,name:"Grace Moshi",    role:"Clerk",      dept:"Admin",       status:"Active",  perf:82},
]

// Recent transactions
const TRANSACTIONS = [
  {id:"TXN-0981",type:"Sale",    desc:"Gold Sale — Buyer A",      amount:"+$84,200",  date:"Mar 30",status:"Completed"},
  {id:"TXN-0980",type:"Expense", desc:"Equipment Maintenance",    amount:"-$12,500",  date:"Mar 29",status:"Completed"},
  {id:"TXN-0979",type:"Sale",    desc:"Gold Sale — Export Batch", amount:"+$126,800", date:"Mar 28",status:"Completed"},
  {id:"TXN-0978",type:"Expense", desc:"Labour — March Payroll",   amount:"-$38,000",  date:"Mar 27",status:"Completed"},
  {id:"TXN-0977",type:"Sale",    desc:"Gold Dust — Local Market", amount:"+$22,400",  date:"Mar 26",status:"Pending"},
  {id:"TXN-0976",type:"Expense", desc:"Chemical Supply Order",    amount:"-$9,800",   date:"Mar 25",status:"Completed"},
  {id:"TXN-0975",type:"Sale",    desc:"Gold Bar — International", amount:"+$98,600",  date:"Mar 24",status:"Completed"},
  {id:"TXN-0974",type:"Expense", desc:"Construction Materials",   amount:"-$28,400",  date:"Mar 23",status:"Completed"},
]

// ══════════════════════════════════════════
//  UTILITY COMPONENTS
// ══════════════════════════════════════════

const fmt = (n, prefix="$", suffix="") =>
  `${prefix}${Number(n).toLocaleString()}${suffix}`

const GoldDivider = () => (
  <div style={{
    height:2, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`,
    margin:"4px 0", opacity:0.4
  }}/>
)

const Badge = ({children, color=C.gold, bg}) => (
  <span style={{
    background: bg || color+"22",
    color, border:`1px solid ${color}44`,
    borderRadius:20, padding:"2px 10px",
    fontSize:11, fontWeight:700, letterSpacing:0.5, whiteSpace:"nowrap"
  }}>{children}</span>
)

const ChangeChip = ({value, suffix=""}) => {
  const up = value >= 0
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:3,
      color: up ? C.green : C.red,
      background: (up ? C.green : C.red)+"18",
      borderRadius:20, padding:"2px 8px", fontSize:12, fontWeight:700
    }}>
      {up ? <ArrowUp size={11}/> : <ArrowDown size={11}/>}
      {Math.abs(value)}{suffix}
    </span>
  )
}

const StatCard = ({icon: Icon, label, value, sub, change, color=C.gold, onClick}) => (
  <div onClick={onClick} style={{
    background:C.card, borderRadius:14,
    border:`1px solid ${color}33`,
    padding:"20px 22px", cursor: onClick?"pointer":"default",
    transition:"all .2s", position:"relative", overflow:"hidden"
  }}
  onMouseEnter={e=>{e.currentTarget.style.borderColor=color+"88"; e.currentTarget.style.transform="translateY(-2px)"}}
  onMouseLeave={e=>{e.currentTarget.style.borderColor=color+"33"; e.currentTarget.style.transform="translateY(0)"}}>
    <div style={{
      position:"absolute",top:-20,right:-20,
      width:80,height:80,borderRadius:"50%",
      background:color+"0D"
    }}/>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
      <div>
        <p style={{color:C.textMuted,fontSize:12,fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>{label}</p>
        <p style={{color:C.text,fontSize:26,fontWeight:800,margin:0,lineHeight:1}}>{value}</p>
        {sub && <p style={{color:C.textDim,fontSize:12,marginTop:5}}>{sub}</p>}
        {change !== undefined && <div style={{marginTop:8}}><ChangeChip value={change} suffix="%"/></div>}
      </div>
      <div style={{
        background:color+"22",border:`1px solid ${color}44`,
        borderRadius:12,padding:10,flexShrink:0
      }}>
        <Icon size={22} color={color}/>
      </div>
    </div>
  </div>
)

const SectionCard = ({title, children, action, extra, noPad=false}) => (
  <div style={{
    background:C.card, borderRadius:14,
    border:`1px solid ${C.cardBorder}`,
    overflow:"hidden"
  }}>
    <div style={{
      padding:"16px 22px",
      borderBottom:`1px solid ${C.cardBorder}`,
      display:"flex",justifyContent:"space-between",alignItems:"center"
    }}>
      <h3 style={{color:C.text,fontSize:15,fontWeight:700,margin:0}}>{title}</h3>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        {extra}
        {action && <button onClick={action.fn} style={{
          background:"transparent",border:`1px solid ${C.goldDark}`,
          color:C.goldMid,borderRadius:8,padding:"5px 14px",
          fontSize:12,fontWeight:600,cursor:"pointer"
        }}>{action.label}</button>}
      </div>
    </div>
    <div style={noPad?{}:{padding:"18px 22px"}}>{children}</div>
  </div>
)

const RiskBadge = ({status}) => {
  const cfg = {
    Active:   {c:C.red,   bg:C.red+"22",   label:"Active"},
    Mitigated:{c:C.green, bg:C.green+"22", label:"Mitigated"},
    Monitored:{c:C.orange,bg:C.orange+"22",label:"Monitored"},
  }[status] || {c:C.textMuted, bg:C.cardBorder, label:status}
  return <Badge color={cfg.c} bg={cfg.bg}>{cfg.label}</Badge>
}

const riskColor = (score) => {
  if (score >= 16) return C.red
  if (score >= 9)  return C.orange
  if (score >= 4)  return C.gold
  return C.green
}

const ChartTip = ({active,payload,label,prefix="$",decimals=0}) => {
  if(!active||!payload?.length) return null
  return (
    <div style={{background:"#1E293B",border:`1px solid ${C.gold}44`,
                 borderRadius:10,padding:"10px 14px",fontSize:12}}>
      <p style={{color:C.gold,fontWeight:700,marginBottom:6}}>{label}</p>
      {payload.map((p,i)=>(
        <p key={i} style={{color:p.color||C.text,margin:"3px 0"}}>
          {p.name}: <strong>{prefix}{Number(p.value).toFixed(decimals)}</strong>
        </p>
      ))}
    </div>
  )
}

// ══════════════════════════════════════════
//  SECTION: OVERVIEW
// ══════════════════════════════════════════
const OverviewSection = ({role}) => {
  const latestGold = GOLD_30D[GOLD_30D.length-1].p
  const prevGold   = GOLD_30D[GOLD_30D.length-2].p
  const goldChg    = (((latestGold-prevGold)/prevGold)*100).toFixed(2)
  const latestRate = USDTZS_30D[USDTZS_30D.length-1].r
  return (
    <div style={{display:"flex",flexDirection:"column",gap:22}}>
      {/* KPI Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
        <StatCard icon={DollarSign} label="Revenue (Mar)" value="$445K"   sub="TZS 1.18B"     change={+8.5}  color={C.green}/>
        <StatCard icon={Layers}     label="Gold Stock"     value="12.4 kg" sub="~$27,900"      change={-5.2}  color={C.gold}/>
        <StatCard icon={TrendingDown} label="Expenditure"  value="$268K"   sub="TZS 711M"      change={+5.1}  color={C.red}/>
        <StatCard icon={Activity}   label="Net Profit"     value="$177K"   sub="Margin 39.8%"  change={+12.3} color={C.purple}/>
      </div>

      {role==="director" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
          <StatCard icon={Package} label="Gold Extracted" value="152 kg"   sub="This month"  change={+4.8}  color={C.goldMid}/>
          <StatCard icon={Zap}     label="Processed"      value="147 kg"   sub="96.7% rate"  change={+2.1}  color={C.blue}/>
          <StatCard icon={Truck}   label="Sold"           value="142 kg"   sub="$313,000"    change={+5.2}  color={C.orange}/>
          <StatCard icon={Users}   label="Active Workers" value="38"       sub="2 on leave"  change={0}     color={C.purple}/>
        </div>
      )}

      {/* Charts row */}
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16}}>
        <SectionCard title="Revenue vs Expenditure vs Profit (USD '000)">
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={MONTHLY_FIN}>
              <CartesianGrid stroke={C.cardBorder} strokeDasharray="3 3"/>
              <XAxis dataKey="m" tick={{fill:C.textMuted,fontSize:12}}/>
              <YAxis tick={{fill:C.textMuted,fontSize:12}}/>
              <Tooltip content={<ChartTip prefix="$" decimals={0}/>}/>
              <Legend wrapperStyle={{color:C.textMuted,fontSize:12}}/>
              <Bar dataKey="rev"    name="Revenue"     fill={C.green}    radius={[4,4,0,0]}/>
              <Bar dataKey="exp"    name="Expenditure" fill={C.red}      radius={[4,4,0,0]}/>
              <Line dataKey="profit" name="Profit"     stroke={C.gold}   strokeWidth={3} dot={false}/>
            </ComposedChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Expenditure Breakdown">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={EXP_BREAKDOWN} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                   paddingAngle={3} dataKey="value">
                {EXP_BREAKDOWN.map((e,i)=>(
                  <Cell key={i} fill={e.color} stroke="none"/>
                ))}
              </Pie>
              <Tooltip formatter={(v)=>[`${v}%`]}/>
              <Legend wrapperStyle={{fontSize:11,color:C.textMuted}}/>
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Live metrics + transactions */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1.5fr",gap:16}}>
        {/* Market snapshot */}
        <SectionCard title="Live Market Snapshot">
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {[
              {label:"Gold (XAU/USD)",   value:`$${latestGold.toLocaleString()}/oz`, chg:+Number(goldChg), color:C.gold},
              {label:"USD / TZS",        value:`TZS ${latestRate.toLocaleString()}`,  chg:+0.27, color:C.blue},
              {label:"Gold (TZS/g)",     value:`TZS ${(latestGold*latestRate/31.1035).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g,",")}`, chg:+0.91, color:C.orange},
              {label:"Silver (USD/oz)",  value:"$24.18",   chg:-0.35, color:C.textMuted},
              {label:"Oil (Brent/bbl)",  value:"$82.40",   chg:+0.62, color:"#EC4899"},
            ].map((row,i)=>(
              <div key={i} style={{
                display:"flex",justifyContent:"space-between",alignItems:"center",
                padding:"10px 14px",background:C.bg,borderRadius:10,
                border:`1px solid ${C.cardBorder}`
              }}>
                <span style={{color:C.textMuted,fontSize:13}}>{row.label}</span>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <span style={{color:row.color,fontWeight:700,fontSize:14}}>{row.value}</span>
                  <ChangeChip value={row.chg}/>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Recent transactions */}
        <SectionCard title="Recent Transactions" noPad>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr style={{background:C.bg}}>
                  {["ID","Description","Amount","Date","Status"].map(h=>(
                    <th key={h} style={{padding:"10px 16px",textAlign:"left",
                      color:C.textDim,fontWeight:600,letterSpacing:0.5,
                      borderBottom:`1px solid ${C.cardBorder}`,textTransform:"uppercase",fontSize:11}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TRANSACTIONS.map((t,i)=>(
                  <tr key={i} style={{borderBottom:`1px solid ${C.cardBorder}`,
                    background:i%2===0?C.card:C.bg}}>
                    <td style={{padding:"10px 16px",color:C.gold,fontWeight:700}}>{t.id}</td>
                    <td style={{padding:"10px 16px",color:C.text}}>{t.desc}</td>
                    <td style={{padding:"10px 16px",color:t.amount.startsWith("+")?C.green:C.red,fontWeight:700}}>{t.amount}</td>
                    <td style={{padding:"10px 16px",color:C.textMuted}}>{t.date}</td>
                    <td style={{padding:"10px 16px"}}>
                      <Badge color={t.status==="Completed"?C.green:C.orange}>{t.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════
//  SECTION: OPERATIONS
// ══════════════════════════════════════════
const OperationsSection = () => (
  <div style={{display:"flex",flexDirection:"column",gap:22}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
      <StatCard icon={Package}    label="Extracted (Mar)"  value="152 kg"  sub="Site A+B+C"      change={+4.8}  color={C.gold}/>
      <StatCard icon={Zap}        label="Processing Rate"  value="96.7%"   sub="147 kg processed" change={+1.2}  color={C.blue}/>
      <StatCard icon={Truck}      label="Sold (Mar)"       value="142 kg"  sub="$313,000"         change={+5.2}  color={C.green}/>
      <StatCard icon={Box}        label="Stock On Hand"    value="12.4 kg" sub="~$27,900"         change={-5.2}  color={C.orange}/>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"3fr 1fr",gap:16}}>
      <SectionCard title="Monthly Gold Operations (kg)">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={GOLD_OPS}>
            <CartesianGrid stroke={C.cardBorder} strokeDasharray="3 3"/>
            <XAxis dataKey="m" tick={{fill:C.textMuted,fontSize:12}}/>
            <YAxis tick={{fill:C.textMuted,fontSize:12}} unit=" kg"/>
            <Tooltip content={<ChartTip prefix="" decimals={1}/>}/>
            <Legend wrapperStyle={{color:C.textMuted,fontSize:12}}/>
            <Bar dataKey="extracted"  name="Extracted"  fill={C.gold}    radius={[4,4,0,0]}/>
            <Bar dataKey="processed"  name="Processed"  fill={C.blue}    radius={[4,4,0,0]}/>
            <Bar dataKey="sold"       name="Sold"       fill={C.green}   radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard title="Site Status">
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[
            {site:"Site A – Nyamongo",   status:"Active",   kg:68, cap:100, shift:"Day"},
            {site:"Site B – Buhemba",    status:"Active",   kg:52, cap:80,  shift:"Day/Night"},
            {site:"Site C – Ikoma",      status:"Maintenance",kg:32,cap:70, shift:"Suspended"},
            {site:"Processing Plant 1",  status:"Active",   kg:147,cap:160, shift:"Continuous"},
            {site:"Storage Vault",       status:"Active",   kg:12.4,cap:50, shift:"Secured"},
          ].map((s,i)=>(
            <div key={i} style={{
              background:C.bg,borderRadius:10,padding:"12px 14px",
              border:`1px solid ${C.cardBorder}`
            }}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{color:C.text,fontSize:12,fontWeight:600}}>{s.site}</span>
                <Badge color={s.status==="Active"?C.green:s.status==="Maintenance"?C.orange:C.red}>{s.status}</Badge>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{color:C.textDim,fontSize:11}}>Shift: {s.shift}</span>
                <span style={{color:C.gold,fontSize:11,fontWeight:700}}>{s.kg} kg</span>
              </div>
              <div style={{background:C.cardBorder,borderRadius:4,height:5,overflow:"hidden"}}>
                <div style={{
                  height:"100%",
                  width:`${Math.min((s.kg/s.cap)*100,100)}%`,
                  background:`linear-gradient(90deg,${C.goldDark},${C.gold})`,
                  borderRadius:4,transition:"width .5s"
                }}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                <span style={{color:C.textDim,fontSize:10}}>Capacity</span>
                <span style={{color:C.textDim,fontSize:10}}>{Math.round((s.kg/s.cap)*100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>

    <SectionCard title="Operations Log — March 2025" noPad>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead>
            <tr style={{background:C.bg}}>
              {["Date","Activity","Site","Qty (kg)","Workers","Cost","Status"].map(h=>(
                <th key={h} style={{padding:"11px 16px",textAlign:"left",
                  color:C.textDim,fontWeight:600,letterSpacing:0.5,
                  borderBottom:`1px solid ${C.cardBorder}`,textTransform:"uppercase",fontSize:11}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              {date:"Mar 30",act:"Gold Extraction",   site:"Site A",kg:5.2,  wk:12,cost:"$4,800", st:"Completed"},
              {date:"Mar 30",act:"Processing Batch",  site:"Plant 1",kg:14.8,wk:8, cost:"$2,100", st:"Completed"},
              {date:"Mar 29",act:"Gold Sale — Export",site:"Vault",  kg:18.5,wk:3, cost:"-",      st:"Completed"},
              {date:"Mar 29",act:"Site Inspection",   site:"Site C", kg:0,   wk:4, cost:"$800",   st:"Completed"},
              {date:"Mar 28",act:"Equipment Servicing",site:"Site B",kg:0,   wk:6, cost:"$12,500",st:"Completed"},
              {date:"Mar 28",act:"Gold Extraction",   site:"Site B", kg:4.8, wk:10,cost:"$4,200", st:"Completed"},
              {date:"Mar 27",act:"Chemical Delivery", site:"Plant 1",kg:0,   wk:2, cost:"$9,800", st:"Completed"},
              {date:"Mar 26",act:"Gold Extraction",   site:"Site A", kg:6.1, wk:12,cost:"$5,100", st:"Completed"},
            ].map((r,i)=>(
              <tr key={i} style={{borderBottom:`1px solid ${C.cardBorder}`,
                background:i%2===0?C.card:C.bg}}>
                <td style={{padding:"10px 16px",color:C.textMuted}}>{r.date}</td>
                <td style={{padding:"10px 16px",color:C.text,fontWeight:600}}>{r.act}</td>
                <td style={{padding:"10px 16px",color:C.gold}}>{r.site}</td>
                <td style={{padding:"10px 16px",color:C.text}}>{r.kg>0?`${r.kg} kg`:"—"}</td>
                <td style={{padding:"10px 16px",color:C.textMuted}}>{r.wk}</td>
                <td style={{padding:"10px 16px",color:r.cost==="-"?C.textDim:C.orange}}>{r.cost}</td>
                <td style={{padding:"10px 16px"}}><Badge color={C.green}>{r.st}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  </div>
)

// ══════════════════════════════════════════
//  SECTION: FINANCIAL (Director only)
// ══════════════════════════════════════════
const FinancialSection = () => (
  <div style={{display:"flex",flexDirection:"column",gap:22}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
      <StatCard icon={DollarSign} label="YTD Revenue"     value="$3.28M"  sub="Budget: $3.5M"  change={+18.2} color={C.green}/>
      <StatCard icon={TrendingDown} label="YTD Expenditure" value="$1.99M"  sub="Budget: $2.1M"  change={+12.4} color={C.red}/>
      <StatCard icon={Activity}   label="YTD Net Profit"  value="$1.29M"  sub="Margin: 39.3%"  change={+22.8} color={C.gold}/>
      <StatCard icon={Target}     label="Budget Utilised" value="93.7%"   sub="$110K remaining" change={-2.1}  color={C.blue}/>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16}}>
      <SectionCard title="Monthly Cash Flow (USD '000)">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={MONTHLY_FIN}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={C.green}  stopOpacity={0.3}/>
                <stop offset="95%" stopColor={C.green}  stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={C.gold}   stopOpacity={0.3}/>
                <stop offset="95%" stopColor={C.gold}   stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid stroke={C.cardBorder} strokeDasharray="3 3"/>
            <XAxis dataKey="m" tick={{fill:C.textMuted,fontSize:12}}/>
            <YAxis tick={{fill:C.textMuted,fontSize:12}}/>
            <Tooltip content={<ChartTip prefix="$" decimals={0}/>}/>
            <Legend wrapperStyle={{color:C.textMuted,fontSize:12}}/>
            <Area dataKey="rev"    name="Revenue"     stroke={C.green} fill="url(#revGrad)"  strokeWidth={2}/>
            <Area dataKey="profit" name="Net Profit"  stroke={C.gold}  fill="url(#profGrad)" strokeWidth={2}/>
            <Line dataKey="exp"    name="Expenditure" stroke={C.red}   strokeWidth={2} dot={false} strokeDasharray="5 5"/>
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard title="P&L Summary (Mar 2025)">
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[
            {label:"Gross Revenue",    v:"$445,000", c:C.green,  bold:true},
            {label:"  Gold Sales",     v:"$398,200", c:C.textMuted},
            {label:"  Supplies/Trade", v:"$46,800",  c:C.textMuted},
            {label:"Total Expenditure",v:"-$268,000",c:C.red,    bold:true},
            {label:"  Labour (32%)",   v:"-$85,760", c:C.textMuted},
            {label:"  Equipment (24%)",v:"-$64,320", c:C.textMuted},
            {label:"  Chemicals (18%)",v:"-$48,240", c:C.textMuted},
            {label:"  Other (26%)",    v:"-$69,680", c:C.textMuted},
            {label:"Net Profit",       v:"$177,000", c:C.gold,   bold:true},
            {label:"Profit Margin",    v:"39.8%",    c:C.gold,   bold:true},
          ].map((row,i)=>(
            <div key={i}>
              {i===8&&<GoldDivider/>}
              <div style={{display:"flex",justifyContent:"space-between",
                padding:"6px 0",borderBottom:i<9?`1px solid ${C.cardBorder}44`:"none"}}>
                <span style={{color:row.bold?C.text:C.textMuted,
                  fontSize:row.bold?13:12,fontWeight:row.bold?700:400}}>{row.label}</span>
                <span style={{color:row.c,fontWeight:row.bold?800:600,fontSize:row.bold?14:12}}>{row.v}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <SectionCard title="Budget vs Actual (Mar 2025, USD '000)">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={[
            {cat:"Revenue",   budget:500, actual:445},
            {cat:"Labour",    budget:90,  actual:86},
            {cat:"Equipment", budget:70,  actual:64},
            {cat:"Chemicals", budget:55,  actual:48},
            {cat:"Transport", budget:38,  actual:32},
            {cat:"Admin",     budget:22,  actual:18},
          ]} layout="vertical">
            <CartesianGrid stroke={C.cardBorder} strokeDasharray="3 3" horizontal={false}/>
            <XAxis type="number" tick={{fill:C.textMuted,fontSize:11}}/>
            <YAxis dataKey="cat" type="category" tick={{fill:C.textMuted,fontSize:11}} width={75}/>
            <Tooltip content={<ChartTip prefix="$" decimals={0}/>}/>
            <Legend wrapperStyle={{color:C.textMuted,fontSize:12}}/>
            <Bar dataKey="budget" name="Budget" fill={C.goldDark} radius={[0,4,4,0]}/>
            <Bar dataKey="actual" name="Actual" fill={C.gold}     radius={[0,4,4,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard title="Invoices & Payables">
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[
              {label:"Outstanding Invoices", val:"3", amount:"$284,600", c:C.orange},
              {label:"Overdue Invoices",      val:"1", amount:"$22,400",  c:C.red},
              {label:"Paid This Month",       val:"9", amount:"$410,000", c:C.green},
              {label:"Pending Payables",      val:"4", amount:"$56,300",  c:C.blue},
            ].map((b,i)=>(
              <div key={i} style={{background:C.bg,borderRadius:10,padding:"14px",border:`1px solid ${b.c}33`}}>
                <p style={{color:C.textMuted,fontSize:11,margin:0,marginBottom:4}}>{b.label}</p>
                <p style={{color:b.c,fontSize:22,fontWeight:800,margin:0}}>{b.val}</p>
                <p style={{color:C.textDim,fontSize:12,margin:0}}>{b.amount}</p>
              </div>
            ))}
          </div>
          <div style={{background:C.bg,borderRadius:10,padding:"14px",border:`1px solid ${C.cardBorder}`,marginTop:4}}>
            <p style={{color:C.textMuted,fontSize:11,margin:"0 0 8px"}}>NEXT PAYROLL — April 27, 2025</p>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <span style={{color:C.text,fontWeight:700}}>38 employees</span>
              <span style={{color:C.gold,fontWeight:800,fontSize:18}}>$38,500</span>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  </div>
)

// ══════════════════════════════════════════
//  SECTION: PRICE MONITOR
// ══════════════════════════════════════════
const PriceMonitorSection = ({goldLive, tzLive}) => {
  const gLast = GOLD_30D[GOLD_30D.length-1]
  const gPrev = GOLD_30D[GOLD_30D.length-2]
  const gChg  = gLast.p - gPrev.p
  const gPct  = ((gChg/gPrev.p)*100).toFixed(2)

  const tLast = USDTZS_30D[USDTZS_30D.length-1]
  const tPrev = USDTZS_30D[USDTZS_30D.length-2]
  const tChg  = tLast.r - tPrev.r
  const tPct  = ((tChg/tPrev.r)*100).toFixed(3)

  const goldTzs = ((goldLive || gLast.p) * (tzLive || tLast.r) / 31.1035)

  return (
    <div style={{display:"flex",flexDirection:"column",gap:22}}>
      {/* Live price cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
        {[
          {label:"Gold (XAU/USD)", val:`$${(goldLive||gLast.p).toLocaleString()}/oz`,
           chg:gChg, pct:gPct, sub:"London PM Fix", color:C.gold},
          {label:"USD / TZS Rate", val:`TZS ${(tzLive||tLast.r).toLocaleString()}`,
           chg:tChg, pct:tPct, sub:"Bank of Tanzania", color:C.blue},
          {label:"Gold (TZS / gram)", val:`TZS ${goldTzs.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g,",")}`,
           chg:null, pct:null, sub:"Derived value", color:C.orange},
        ].map((c,i)=>(
          <div key={i} style={{
            background:C.card,borderRadius:14,padding:"22px 24px",
            border:`1px solid ${c.color}44`
          }}>
            <p style={{color:C.textMuted,fontSize:12,fontWeight:600,letterSpacing:1,
              textTransform:"uppercase",margin:0,marginBottom:10}}>{c.label}</p>
            <p style={{color:c.color,fontSize:30,fontWeight:900,margin:0,letterSpacing:-1}}>{c.val}</p>
            {c.chg!==null && (
              <div style={{display:"flex",gap:10,marginTop:10,alignItems:"center"}}>
                <ChangeChip value={Number(c.pct)} suffix="%"/>
                <span style={{color:C.textDim,fontSize:12}}>{c.chg>0?"+":""}{c.chg} today</span>
              </div>
            )}
            <p style={{color:C.textDim,fontSize:11,margin:0,marginTop:8}}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <SectionCard title="Gold Price — Last 30 Days (USD/oz)">
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={GOLD_30D}>
              <defs>
                <linearGradient id="goldGrd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.gold} stopOpacity={0.35}/>
                  <stop offset="95%" stopColor={C.gold} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke={C.cardBorder} strokeDasharray="3 3"/>
              <XAxis dataKey="d" tick={{fill:C.textMuted,fontSize:10}} interval={4}/>
              <YAxis domain={["auto","auto"]} tick={{fill:C.textMuted,fontSize:11}}/>
              <Tooltip content={<ChartTip prefix="$" decimals={0}/>}/>
              <Area dataKey="p" name="Gold Price" stroke={C.gold} fill="url(#goldGrd)" strokeWidth={2.5} dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="USD / TZS Exchange Rate — Last 30 Days">
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={USDTZS_30D}>
              <defs>
                <linearGradient id="tzGrd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.blue} stopOpacity={0.35}/>
                  <stop offset="95%" stopColor={C.blue} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke={C.cardBorder} strokeDasharray="3 3"/>
              <XAxis dataKey="d" tick={{fill:C.textMuted,fontSize:10}} interval={4}/>
              <YAxis domain={["auto","auto"]} tick={{fill:C.textMuted,fontSize:11}}/>
              <Tooltip content={<ChartTip prefix="TZS " decimals={0}/>}/>
              <Area dataKey="r" name="USD/TZS" stroke={C.blue} fill="url(#tzGrd)" strokeWidth={2.5} dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* AKI Revenue impact table */}
      <SectionCard title="AKI Revenue Impact — Gold Price Scenarios">
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr style={{background:C.bg}}>
                {["Gold Price (USD/oz)","kg Sold / Month","Revenue (USD)","TZS Rate","Revenue (TZS)","vs Current"].map(h=>(
                  <th key={h} style={{padding:"11px 16px",textAlign:"left",
                    color:C.textDim,fontWeight:600,letterSpacing:0.5,
                    borderBottom:`1px solid ${C.cardBorder}`,textTransform:"uppercase",fontSize:11}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[2100,2150,2200,2265,2300,2400].map((price,i)=>{
                const usd = (price/31.1035)*142
                const base = (2265/31.1035)*142
                const diff = usd-base
                const tzs = usd * tLast.r
                const isCurrent = price===2265
                return (
                  <tr key={i} style={{
                    borderBottom:`1px solid ${C.cardBorder}`,
                    background: isCurrent ? C.gold+"18" : i%2===0?C.card:C.bg
                  }}>
                    <td style={{padding:"10px 16px",color:isCurrent?C.gold:C.text,fontWeight:isCurrent?800:400}}>
                      ${price.toLocaleString()} {isCurrent&&<Badge color={C.gold}>Current</Badge>}
                    </td>
                    <td style={{padding:"10px 16px",color:C.textMuted}}>142 kg</td>
                    <td style={{padding:"10px 16px",color:C.green,fontWeight:700}}>${Math.round(usd).toLocaleString()}</td>
                    <td style={{padding:"10px 16px",color:C.textMuted}}>{tLast.r}</td>
                    <td style={{padding:"10px 16px",color:C.blue,fontWeight:700}}>TZS {Math.round(tzs).toLocaleString()}</td>
                    <td style={{padding:"10px 16px"}}>
                      {isCurrent ? <Badge color={C.gold}>Baseline</Badge>
                        : <ChangeChip value={(diff/base*100).toFixed(1)} suffix="%"/>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}

// ══════════════════════════════════════════
//  SECTION: RISK ANALYSIS
// ══════════════════════════════════════════
const RiskSection = () => {
  const cells = []
  for(let impact=5;impact>=1;impact--){
    for(let prob=1;prob<=5;prob++){
      const score = impact*prob
      const risksHere = RISKS.filter(r=>r.prob===prob&&r.impact===impact)
      cells.push({impact,prob,score,risks:risksHere})
    }
  }
  return (
    <div style={{display:"flex",flexDirection:"column",gap:22}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
        <StatCard icon={AlertTriangle} label="Active Risks"    value="4"  sub="Require attention"  color={C.red}/>
        <StatCard icon={Shield}        label="Mitigated"       value="3"  sub="Controls in place"  color={C.green}/>
        <StatCard icon={Eye}           label="Under Monitor"   value="1"  sub="Watchlist"          color={C.orange}/>
        <StatCard icon={Award}         label="Risk Score"      value="42" sub="Medium-High band"   color={C.gold}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:22}}>
        {/* Risk Matrix */}
        <SectionCard title="Risk Matrix (Probability × Impact)">
          <div style={{userSelect:"none"}}>
            <div style={{display:"flex",marginBottom:6,paddingLeft:40}}>
              {["1","2","3","4","5"].map(p=>(
                <div key={p} style={{width:70,textAlign:"center",color:C.textDim,fontSize:11,fontWeight:600}}>P={p}</div>
              ))}
            </div>
            {[5,4,3,2,1].map(impact=>(
              <div key={impact} style={{display:"flex",marginBottom:4,alignItems:"center"}}>
                <div style={{width:36,color:C.textDim,fontSize:11,fontWeight:600,textAlign:"right",paddingRight:6}}>I={impact}</div>
                {[1,2,3,4,5].map(prob=>{
                  const score = impact*prob
                  const bg = score>=16?C.red+"44":score>=9?C.orange+"44":score>=4?C.gold+"33":C.green+"33"
                  const border = score>=16?C.red:score>=9?C.orange:score>=4?C.gold:C.green
                  const risksHere = RISKS.filter(r=>r.prob===prob&&r.impact===impact)
                  return (
                    <div key={prob} style={{
                      width:70,height:56,background:bg,
                      border:`1px solid ${border}55`,
                      borderRadius:6,margin:2,
                      display:"flex",flexDirection:"column",
                      alignItems:"center",justifyContent:"center",
                      position:"relative",cursor:risksHere.length?"pointer":"default"
                    }}>
                      <span style={{color:border,fontSize:10,fontWeight:700}}>{score}</span>
                      {risksHere.length>0&&(
                        <div style={{
                          background:border,color:"#000",
                          borderRadius:10,padding:"1px 6px",fontSize:9,fontWeight:800,marginTop:2
                        }}>{risksHere.map(r=>r.id).join(", ")}</div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
            <div style={{display:"flex",gap:12,marginTop:12,flexWrap:"wrap"}}>
              {[{c:C.red,l:"Critical (16-25)"},{c:C.orange,l:"High (9-15)"},{c:C.gold,l:"Medium (4-8)"},{c:C.green,l:"Low (1-3)"}].map((lg,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:12,height:12,background:lg.c+"44",border:`1px solid ${lg.c}`,borderRadius:3}}/>
                  <span style={{color:C.textMuted,fontSize:11}}>{lg.l}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Risk Radar */}
        <SectionCard title="Risk Profile by Category">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={[
              {cat:"Market",    score:18},{cat:"Financial",  score:14},
              {cat:"Operational",score:11},{cat:"Regulatory", score:10},
              {cat:"Safety",    score:8}, {cat:"Supply",     score:9},
            ]}>
              <PolarGrid stroke={C.cardBorder}/>
              <PolarAngleAxis dataKey="cat" tick={{fill:C.textMuted,fontSize:12}}/>
              <PolarRadiusAxis angle={90} domain={[0,25]} tick={{fill:C.textDim,fontSize:10}}/>
              <Radar name="Risk Score" dataKey="score" stroke={C.gold} fill={C.gold} fillOpacity={0.25} strokeWidth={2}/>
              <Tooltip/>
            </RadarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Risk register table */}
      <SectionCard title="Risk Register" noPad>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{background:C.bg}}>
                {["ID","Category","Risk Description","Probability","Impact","Score","Status","Owner"].map(h=>(
                  <th key={h} style={{padding:"11px 14px",textAlign:"left",color:C.textDim,
                    fontWeight:600,letterSpacing:0.5,borderBottom:`1px solid ${C.cardBorder}`,
                    textTransform:"uppercase",fontSize:11}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RISKS.sort((a,b)=>b.prob*b.impact-a.prob*a.impact).map((r,i)=>{
                const score = r.prob*r.impact
                const sc = riskColor(score)
                return (
                  <tr key={i} style={{borderBottom:`1px solid ${C.cardBorder}`,
                    background:i%2===0?C.card:C.bg}}>
                    <td style={{padding:"10px 14px",color:C.gold,fontWeight:700}}>{r.id}</td>
                    <td style={{padding:"10px 14px"}}><Badge color={C.blue}>{r.category}</Badge></td>
                    <td style={{padding:"10px 14px",color:C.text,fontWeight:500}}>{r.name}</td>
                    <td style={{padding:"10px 14px",color:C.textMuted,textAlign:"center"}}>{r.prob}/5</td>
                    <td style={{padding:"10px 14px",color:C.textMuted,textAlign:"center"}}>{r.impact}/5</td>
                    <td style={{padding:"10px 14px"}}>
                      <span style={{background:sc+"22",color:sc,border:`1px solid ${sc}44`,
                        borderRadius:8,padding:"3px 10px",fontWeight:800,fontSize:13}}>{score}</span>
                    </td>
                    <td style={{padding:"10px 14px"}}><RiskBadge status={r.status}/></td>
                    <td style={{padding:"10px 14px",color:C.textMuted}}>{r.owner}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}

// ══════════════════════════════════════════
//  SECTION: TEAM (Director only)
// ══════════════════════════════════════════
const TeamSection = () => (
  <div style={{display:"flex",flexDirection:"column",gap:22}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
      <StatCard icon={Users}    label="Total Staff"      value="40"  sub="Full-time"       change={+5.3}  color={C.blue}/>
      <StatCard icon={Activity} label="Active Today"     value="38"  sub="2 on leave"      change={0}     color={C.green}/>
      <StatCard icon={Clock}    label="Avg Performance"  value="88%" sub="This quarter"    change={+3.2}  color={C.gold}/>
      <StatCard icon={Award}    label="Payroll (Mar)"    value="$38.5K" sub="Due April 27" change={+2.6}  color={C.purple}/>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16}}>
      <SectionCard title="Staff Directory" noPad>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{background:C.bg}}>
                {["#","Name","Role","Department","Status","Performance"].map(h=>(
                  <th key={h} style={{padding:"11px 16px",textAlign:"left",color:C.textDim,
                    fontWeight:600,letterSpacing:0.5,borderBottom:`1px solid ${C.cardBorder}`,
                    textTransform:"uppercase",fontSize:11}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TEAM.map((m,i)=>(
                <tr key={i} style={{borderBottom:`1px solid ${C.cardBorder}`,
                  background:i%2===0?C.card:C.bg}}>
                  <td style={{padding:"12px 16px",color:C.textDim}}>{m.id}</td>
                  <td style={{padding:"12px 16px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{
                        width:30,height:30,borderRadius:"50%",
                        background:`linear-gradient(135deg,${C.goldDark},${C.gold})`,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        color:"#000",fontWeight:800,fontSize:12,flexShrink:0
                      }}>{m.name.split(" ").map(n=>n[0]).join("")}</div>
                      <span style={{color:C.text,fontWeight:600}}>{m.name}</span>
                    </div>
                  </td>
                  <td style={{padding:"12px 16px"}}>
                    <Badge color={m.role==="Director"?C.gold:m.role==="Ops Manager"?C.blue:C.purple}>{m.role}</Badge>
                  </td>
                  <td style={{padding:"12px 16px",color:C.textMuted}}>{m.dept}</td>
                  <td style={{padding:"12px 16px"}}>
                    <Badge color={m.status==="Active"?C.green:C.orange}>{m.status}</Badge>
                  </td>
                  <td style={{padding:"12px 16px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{flex:1,background:C.cardBorder,borderRadius:4,height:6,overflow:"hidden",minWidth:60}}>
                        <div style={{height:"100%",width:`${m.perf}%`,borderRadius:4,
                          background:m.perf>=90?C.green:m.perf>=80?C.gold:C.orange}}/>
                      </div>
                      <span style={{color:C.text,fontWeight:700,fontSize:12,width:32}}>{m.perf}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <SectionCard title="By Department">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={[
                {name:"Operations", value:18, color:C.gold},
                {name:"Finance",    value:6,  color:C.green},
                {name:"Safety",     value:4,  color:C.red},
                {name:"Admin",      value:5,  color:C.blue},
                {name:"Executive",  value:3,  color:C.purple},
                {name:"Logistics",  value:4,  color:C.orange},
              ]} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={3} dataKey="value">
                {[C.gold,C.green,C.red,C.blue,C.purple,C.orange].map((c,i)=>(
                  <Cell key={i} fill={c} stroke="none"/>
                ))}
              </Pie>
              <Tooltip/>
              <Legend wrapperStyle={{fontSize:11,color:C.textMuted}}/>
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Alerts">
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[
              {msg:"Payroll due in 27 days",       icon:"💰", c:C.orange},
              {msg:"Charles Banda — leave ends Apr 8",icon:"📅",c:C.blue},
              {msg:"HSE training renewal (2 staff)",icon:"⚠️", c:C.red},
              {msg:"Performance reviews due Apr 15",icon:"📊", c:C.gold},
            ].map((a,i)=>(
              <div key={i} style={{
                background:C.bg,borderRadius:9,padding:"10px 12px",
                border:`1px solid ${a.c}33`,display:"flex",gap:10,alignItems:"center"
              }}>
                <span style={{fontSize:16}}>{a.icon}</span>
                <span style={{color:C.textMuted,fontSize:12}}>{a.msg}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  </div>
)

// ══════════════════════════════════════════
//  MAIN DASHBOARD APP
// ══════════════════════════════════════════
const NAV = [
  {id:"overview",   label:"Overview",       icon:Home,         roles:["director","worker"]},
  {id:"operations", label:"Operations",     icon:Package,      roles:["director","worker"]},
  {id:"financial",  label:"Financial",      icon:DollarSign,   roles:["director"]},
  {id:"prices",     label:"Price Monitor",  icon:TrendingUp,   roles:["director","worker"]},
  {id:"risk",       label:"Risk Analysis",  icon:AlertTriangle,roles:["director"]},
  {id:"team",       label:"Team",           icon:Users,        roles:["director"]},
]

export default function AKIDashboard() {
  const [role,    setRole]    = useState("director")
  const [tab,     setTab]     = useState("overview")
  const [goldLive,setGoldLive]= useState(2265)
  const [tzLive,  setTzLive]  = useState(2642)
  const [notifs,  setNotifs]  = useState(4)
  const [time,    setTime]    = useState(new Date())
  const [sidebar, setSidebar] = useState(true)

  // Simulate live ticking prices
  useEffect(()=>{
    const t = setInterval(()=>{
      setGoldLive(p=>{
        const d=(Math.random()-0.48)*1.2
        return Math.round((p+d)*100)/100
      })
      setTzLive(p=>{
        const d=(Math.random()-0.48)*0.5
        return Math.round((p+d)*10)/10
      })
      setTime(new Date())
    },3000)
    return ()=>clearInterval(t)
  },[])

  // If current tab not accessible by role, reset
  useEffect(()=>{
    const allowed = NAV.filter(n=>n.roles.includes(role)).map(n=>n.id)
    if(!allowed.includes(tab)) setTab("overview")
  },[role])

  const visibleNav = NAV.filter(n=>n.roles.includes(role))

  const sideW = sidebar ? 220 : 64

  return (
    <div style={{
      display:"flex", minHeight:"100vh",
      background:C.bg, color:C.text,
      fontFamily:"'Inter','Segoe UI',Arial,sans-serif",
      fontSize:14
    }}>

      {/* ── SIDEBAR ── */}
      <div style={{
        width:sideW, background:C.sidebar,
        borderRight:`1px solid ${C.cardBorder}`,
        display:"flex", flexDirection:"column",
        transition:"width .25s", flexShrink:0,
        position:"sticky", top:0, height:"100vh", overflowY:"auto"
      }}>
        {/* Logo */}
        <div style={{
          padding:"20px 16px",
          borderBottom:`1px solid ${C.cardBorder}`,
          display:"flex", alignItems:"center", gap:12,
          cursor:"pointer"
        }} onClick={()=>setSidebar(s=>!s)}>
          <div style={{
            width:38, height:38, borderRadius:10, flexShrink:0,
            background:`linear-gradient(135deg,${C.goldDark},${C.gold})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontWeight:900, fontSize:14, color:"#0B0F1A", letterSpacing:1
          }}>AKI</div>
          {sidebar && (
            <div>
              <div style={{color:C.gold,fontWeight:800,fontSize:14,lineHeight:1.2}}>AKI TRADERS</div>
              <div style={{color:C.textDim,fontSize:10,letterSpacing:1}}>ADMIN PANEL</div>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav style={{padding:"12px 8px",flex:1}}>
          {visibleNav.map(n=>{
            const active = tab===n.id
            return (
              <div key={n.id} onClick={()=>setTab(n.id)} style={{
                display:"flex", alignItems:"center", gap:12,
                padding:sidebar?"11px 14px":"11px 13px",
                borderRadius:10, marginBottom:4,
                background: active?C.gold+"22":"transparent",
                border: active?`1px solid ${C.gold}44`:"1px solid transparent",
                cursor:"pointer", transition:"all .15s",
                color: active?C.gold:C.textMuted,
                justifyContent: sidebar?"flex-start":"center"
              }}
              onMouseEnter={e=>{if(!active){e.currentTarget.style.background=C.cardBorder;e.currentTarget.style.color=C.text}}}
              onMouseLeave={e=>{if(!active){e.currentTarget.style.background="transparent";e.currentTarget.style.color=C.textMuted}}}>
                <n.icon size={18} style={{flexShrink:0}}/>
                {sidebar && <span style={{fontWeight:active?700:500,fontSize:13}}>{n.label}</span>}
                {sidebar && active && <ChevronRight size={14} style={{marginLeft:"auto"}}/>}
              </div>
            )
          })}
        </nav>

        {/* Role toggle */}
        <div style={{
          padding:"12px 10px",
          borderTop:`1px solid ${C.cardBorder}`
        }}>
          {sidebar && <p style={{color:C.textDim,fontSize:10,letterSpacing:1,textTransform:"uppercase",margin:"0 0 8px 6px"}}>Switch Role</p>}
          <div style={{display:"flex",gap:6,flexDirection:sidebar?"row":"column"}}>
            {["director","worker"].map(r=>(
              <button key={r} onClick={()=>setRole(r)} style={{
                flex:1, padding:"7px 4px",
                background:role===r?C.gold+"33":"transparent",
                border:`1px solid ${role===r?C.gold:C.cardBorder}`,
                color:role===r?C.gold:C.textMuted,
                borderRadius:8,cursor:"pointer",
                fontSize:11,fontWeight:700,
                textTransform:"capitalize",
                display:"flex",alignItems:"center",justifyContent:"center",gap:4
              }}>
                {r==="director"?<Shield size={12}/>:<Eye size={12}/>}
                {sidebar && r.charAt(0).toUpperCase()+r.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{flex:1, display:"flex", flexDirection:"column", overflow:"hidden"}}>

        {/* TOP BAR */}
        <div style={{
          background:C.sidebar,
          borderBottom:`1px solid ${C.cardBorder}`,
          padding:"0 28px",
          display:"flex", alignItems:"center",
          justifyContent:"space-between",
          height:60, flexShrink:0, position:"sticky", top:0, zIndex:10
        }}>
          <div>
            <h1 style={{margin:0,fontSize:18,fontWeight:800,
              background:`linear-gradient(90deg,${C.gold},${C.goldMid})`,
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
              {NAV.find(n=>n.id===tab)?.label || "Dashboard"}
            </h1>
            <p style={{margin:0,color:C.textDim,fontSize:11}}>
              {time.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
              {" · "}{time.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
            </p>
          </div>

          <div style={{display:"flex",alignItems:"center",gap:16}}>
            {/* Gold live ticker */}
            <div style={{
              background:C.card,border:`1px solid ${C.gold}44`,
              borderRadius:10,padding:"6px 14px",
              display:"flex",gap:10,alignItems:"center"
            }}>
              <span style={{color:C.textDim,fontSize:11}}>XAU/USD</span>
              <span style={{color:C.gold,fontWeight:800,fontSize:15,fontVariantNumeric:"tabular-nums"}}>
                ${goldLive.toLocaleString()}
              </span>
              <span style={{color:C.textDim,fontSize:10}}>|</span>
              <span style={{color:C.textDim,fontSize:11}}>TZS</span>
              <span style={{color:C.blue,fontWeight:800,fontSize:15,fontVariantNumeric:"tabular-nums"}}>
                {tzLive.toLocaleString()}
              </span>
            </div>

            {/* Role badge */}
            <Badge color={role==="director"?C.gold:C.blue}>
              {role==="director"?"Director View":"Worker View"}
            </Badge>

            {/* Notifications */}
            <div style={{position:"relative",cursor:"pointer"}} onClick={()=>setNotifs(0)}>
              <Bell size={20} color={C.textMuted}/>
              {notifs>0&&(
                <span style={{
                  position:"absolute",top:-5,right:-5,
                  background:C.red,color:"#fff",
                  borderRadius:"50%",width:16,height:16,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:9,fontWeight:800
                }}>{notifs}</span>
              )}
            </div>

            {/* Avatar */}
            <div style={{
              width:36,height:36,borderRadius:"50%",
              background:`linear-gradient(135deg,${C.goldDark},${C.gold})`,
              display:"flex",alignItems:"center",justifyContent:"center",
              color:"#000",fontWeight:800,fontSize:13,cursor:"pointer"
            }}>JA</div>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div style={{flex:1,overflowY:"auto",padding:"24px 28px"}}>
          {tab==="overview"   && <OverviewSection role={role}/>}
          {tab==="operations" && <OperationsSection/>}
          {tab==="financial"  && (role==="director"
            ? <FinancialSection/>
            : <div style={{color:C.textMuted,padding:40,textAlign:"center"}}>
                <Lock size={40} color={C.gold} style={{margin:"0 auto 12px"}}/>
                <p style={{fontSize:18,fontWeight:700,color:C.text}}>Director Access Only</p>
                <p>Financial data is restricted to directors.</p>
              </div>
          )}
          {tab==="prices"     && <PriceMonitorSection goldLive={goldLive} tzLive={tzLive}/>}
          {tab==="risk"       && (role==="director"
            ? <RiskSection/>
            : <div style={{color:C.textMuted,padding:40,textAlign:"center"}}>
                <Lock size={40} color={C.gold} style={{margin:"0 auto 12px"}}/>
                <p style={{fontSize:18,fontWeight:700,color:C.text}}>Director Access Only</p>
              </div>
          )}
          {tab==="team"       && (role==="director"
            ? <TeamSection/>
            : <div style={{color:C.textMuted,padding:40,textAlign:"center"}}>
                <Lock size={40} color={C.gold} style={{margin:"0 auto 12px"}}/>
                <p style={{fontSize:18,fontWeight:700,color:C.text}}>Director Access Only</p>
              </div>
          )}
        </div>
      </div>
    </div>
  )
}
