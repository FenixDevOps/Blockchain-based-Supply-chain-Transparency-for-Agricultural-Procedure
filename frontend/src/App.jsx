import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, PackagePlus, Truck, Search, Blocks,
  ShieldCheck, ShieldX, Thermometer, Droplets, MapPin,
  Clock, ArrowRight, AlertTriangle, CheckCircle, Loader2,
  Leaf, Zap, BarChart3, X, ChevronDown, ChevronUp, Sprout,
  Package2, Factory, Store, User, Timer
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const ROLES = ['Farmer', 'Processor', 'Distributor', 'Retailer', 'Consumer'];

const COLORS = {
  bg:          '#f2fbf4',
  sidebar:     '#e6f7ea',
  sidebarBorder:'#c3e8cc',
  header:      'rgba(242,251,244,0.88)',
  card:        '#ffffff',
  cardBorder:  '#d8f0de',
  primary:     '#16a34a',
  primaryHover:'#15803d',
  primaryLight:'#dcfce7',
  primaryText: '#166534',
  amber:       '#fef9c3',
  amberText:   '#854d0e',
  amberBorder: '#fde68a',
  rose:        '#fff1f2',
  roseText:    '#9f1239',
  roseBorder:  '#fecdd3',
  blue:        '#eff6ff',
  blueText:    '#1e40af',
  blueBorder:  '#bfdbfe',
  purple:      '#f5f3ff',
  purpleText:  '#5b21b6',
  purpleBorder:'#ddd6fe',
  text:        '#14532d',
  muted:       '#4d7c60',
  subtle:      '#86a892',
};

const S = {
  app:   { display:'flex', height:'100vh', overflow:'hidden', background: COLORS.bg, fontFamily:"'Plus Jakarta Sans','Inter',sans-serif" },
  sidebar: { width:260, flexShrink:0, display:'flex', flexDirection:'column', background:COLORS.sidebar, borderRight:`1px solid ${COLORS.sidebarBorder}`, padding:'24px 16px', gap:4 },
  logo:  { display:'flex', alignItems:'center', gap:12, marginBottom:28, paddingLeft:8 },
  logoIcon: { width:38, height:38, borderRadius:12, background:COLORS.primary, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 12px ${COLORS.primary}55` },
  logoText: { fontSize:17, fontWeight:800, color:COLORS.text, letterSpacing:'-0.4px', lineHeight:1 },
  logoSub:  { fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', color:COLORS.primary, marginTop:3 },
  navLabel: { fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:COLORS.subtle, padding:'16px 12px 4px' },
  main: { flex:1, overflowY:'auto', display:'flex', flexDirection:'column', background:COLORS.bg },
  header: { position:'sticky', top:0, zIndex:10, background:COLORS.header, borderBottom:`1px solid ${COLORS.sidebarBorder}`, padding:'14px 40px', display:'flex', justifyContent:'space-between', alignItems:'center', backdropFilter:'blur(12px)' },
  content: { flex:1, padding:'32px 40px', maxWidth:1100, width:'100%', margin:'0 auto' },
  card: { background:COLORS.card, border:`1px solid ${COLORS.cardBorder}`, borderRadius:16, overflow:'hidden', boxShadow:'0 2px 12px rgba(22,163,74,0.06)' },
  cardHover: { cursor:'pointer', transition:'all 0.2s ease' },
  input: { width:'100%', padding:'13px 16px', borderRadius:10, border:`1.5px solid ${COLORS.cardBorder}`, background:`${COLORS.primaryLight}55`, fontSize:15, fontWeight:500, color:COLORS.text, outline:'none', transition:'all 0.15s', fontFamily:'inherit' },
  label: { display:'block', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:COLORS.muted, marginBottom:7 },
  btnPrimary: { display:'inline-flex', alignItems:'center', gap:10, padding:'13px 28px', borderRadius:12, background:COLORS.primary, color:'#fff', fontSize:15, fontWeight:700, border:'none', cursor:'pointer', boxShadow:`0 4px 14px ${COLORS.primary}44`, transition:'all 0.15s', fontFamily:'inherit' },
  badge: { display:'inline-flex', alignItems:'center', gap:4, padding:'3px 10px', borderRadius:20, fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em' },
  statCard: { ...{}, borderRadius:16, padding:24, overflow:'hidden', position:'relative', border:`1px solid`, boxShadow:'0 2px 16px rgba(0,0,0,0.04)' },
};

const navBtnStyle = (active) => ({
  width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 14px',
  borderRadius:10, fontSize:13.5, fontWeight:600, border:'none', cursor:'pointer',
  fontFamily:'inherit', transition:'all 0.15s',
  background: active ? COLORS.primary : 'transparent',
  color: active ? '#fff' : COLORS.muted,
});

/* ── Toast ── */
function Toast({ alert, onClose }) {
  if (!alert) return null;
  const isErr = alert.type === 'error';
  return (
    <div style={{ position:'fixed', top:24, right:24, zIndex:999, display:'flex', alignItems:'flex-start', gap:12, padding:'14px 20px', borderRadius:14, boxShadow:'0 12px 32px rgba(0,0,0,0.12)', border:`1px solid ${isErr ? COLORS.roseBorder : COLORS.sidebarBorder}`, background: isErr ? COLORS.rose : '#f0fdf4', color: isErr ? COLORS.roseText : COLORS.primaryText, maxWidth:380, fontFamily:'inherit', fontSize:14, fontWeight:600, animation:'slideIn 0.3s ease' }}>
      {isErr ? <AlertTriangle size={17} style={{marginTop:1,flexShrink:0}} /> : <CheckCircle size={17} style={{marginTop:1,flexShrink:0,color:COLORS.primary}} />}
      <span style={{flex:1,lineHeight:1.4}}>{alert.msg}</span>
      <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',opacity:0.5,padding:0,marginLeft:8}}><X size={14}/></button>
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ icon: Icon, label, value, bg, border, text, iconBg }) {
  return (
    <div style={{...S.statCard, background:bg, borderColor:border}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
        <div style={{width:42,height:42,borderRadius:12,background:iconBg,display:'flex',alignItems:'center',justifyContent:'center',color:text}}>
          <Icon size={20}/>
        </div>
      </div>
      <div style={{fontSize:38,fontWeight:900,color:text,letterSpacing:'-1.5px',lineHeight:1}}>{value}</div>
      <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:text,opacity:0.6,marginTop:6}}>{label}</div>
    </div>
  );
}

/* ── Stage Pill ── */
function StagePill({ role, done }) {
  const roleColors = {
    Farmer:      [COLORS.primaryLight, COLORS.primaryText],
    Processor:   [COLORS.amber,       COLORS.amberText],
    Distributor: [COLORS.blue,        COLORS.blueText],
    Retailer:    [COLORS.rose,        COLORS.roseText],
    Consumer:    [COLORS.purple,      COLORS.purpleText],
  };
  const [bg, color] = done ? roleColors[role] : ['#f4f4f5','#a1a1aa'];
  return (
    <span style={{...S.badge, background:bg, color, border:`1px solid ${done ? color+'33' : '#e4e4e7'}`}}>
      {done && <span style={{width:5,height:5,borderRadius:'50%',background:'currentColor',display:'inline-block'}}/>}
      {role}
    </span>
  );
}

const Field = ({ label, children }) => (
  <div>
    <label style={S.label}>{label}</label>
    {children}
  </div>
);

/* ── MAIN ── */
export default function App() {
  const [tab,setTab]           = useState('dashboard');
  const [products,setProducts] = useState([]);
  const [stats,setStats]       = useState({total_blocks:0,total_products:0,anomalous_products:0});
  const [chain,setChain]       = useState({valid:true,blocks:0});
  const [blocks,setBlocks]     = useState([]);
  const [trace,setTrace]       = useState(null);
  const [traceId,setTraceId]   = useState('');
  const [loading,setLoading]   = useState(false);
  const [alert,setAlert]       = useState(null);
  const [openBlock,setOpenBlock]= useState(null);
  const [hoveredQR,setHoveredQR]= useState(null);  // { batchId, name, url }
  const [reg,setReg]   = useState({name:'',crop_type:'Grain',farmer_name:'',origin:'',quantity_kg:'',temperature_c:'',humidity_pct:'',notes:''});
  const [stg,setStg]   = useState({batchId:'',role:'Processor',actor:'',location:'',temp:'',hum:'',notes:''});

  const flash = (msg,type='success') => { setAlert({msg,type}); setTimeout(()=>setAlert(null),5000); };

  const fetchAll = useCallback(async () => {
    try {
      const [v,s,p] = await Promise.all([
        fetch(`${API}/verify`).then(r=>r.json()),
        fetch(`${API}/stats`).then(r=>r.json()),
        fetch(`${API}/products`).then(r=>r.json()),
      ]);
      setChain(v); setStats(s); setProducts(p);
    } catch {}
  },[]);

  useEffect(() => { fetchAll(); const t=setInterval(fetchAll,12000); return ()=>clearInterval(t); },[fetchAll]);

  const nav = (id) => { setTab(id); if(id==='explorer') fetchBlocks(); };

  const fetchBlocks = async () => {
    const r = await fetch(`${API}/chain`);
    if(r.ok){ const d=await r.json(); setBlocks([...d.chain].reverse()); }
  };

  const post = async (url,method,body,onOk) => {
    setLoading(true);
    try {
      const r = await fetch(url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      const d = await r.json();
      if(r.ok){ flash(onOk(d)); fetchAll(); }
      else throw new Error(d.message||d.error||'Server error');
    } catch(e){ flash(e.message,'error'); }
    setLoading(false);
  };

  const handleReg = e => {
    e.preventDefault();
    if(!reg.name||!reg.farmer_name||!reg.origin){flash('Fill all required fields','error');return;}
    post(`${API}/products`,'POST',
      {...reg,quantity_kg:+reg.quantity_kg||0,temperature_c:+reg.temperature_c||22,humidity_pct:+reg.humidity_pct||60},
      d=>`Batch ${d.batch_id} registered on-chain ✅`
    );
    setReg({name:'',crop_type:'Grain',farmer_name:'',origin:'',quantity_kg:'',temperature_c:'',humidity_pct:'',notes:''});
  };

  const handleStg = e => {
    e.preventDefault();
    if(!stg.batchId||!stg.actor||!stg.location){flash('Batch ID, Actor & Location required','error');return;}
    post(`${API}/products/${stg.batchId}/stage`,'POST',
      {role:stg.role,actor:stg.actor,location:stg.location,notes:stg.notes,temperature_c:+stg.temp||22,humidity_pct:+stg.hum||55},
      d=>`Block #${d.block_index} committed ✅`
    );
    setStg({...stg,actor:'',location:'',temp:'',hum:'',notes:''});
  };

  const doTrace = async (id) => {
    const t=id||traceId; if(!t)return;
    setLoading(true);
    try {
      const r=await fetch(`${API}/products/${t}/trace`);
      if(r.ok){setTrace(await r.json());setTab('trace');}
      else flash(`Batch "${t}" not found`,'error');
    } catch{flash('Connection error','error');}
    setLoading(false);
  };

  const tabLabels={dashboard:'Dashboard',register:'New Batch',stage:'Log Stage',trace:'Trace Product',tracking:'Shipment Tracking',explorer:'Block Explorer'};

  /* ─────── NAV ITEMS ─────── */
  const navItems = [
    { id:'dashboard', icon:LayoutDashboard, label:'Dashboard'         },
    { id:'register',  icon:PackagePlus,     label:'New Batch'          },
    { id:'stage',     icon:Truck,           label:'Log Stage'          },
    { id:'tracking',  icon:Package2,        label:'Shipment Tracking'  },
    { id:'trace',     icon:Search,          label:'Audit Trail'        },
  ];

  return (
    <div style={S.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        input:focus,select:focus,textarea:focus { border-color:${COLORS.primary} !important; box-shadow:0 0 0 3px ${COLORS.primary}22 !important; background:#fff !important; }
        .nav-btn:hover { background:${COLORS.primaryLight} !important; color:${COLORS.primaryText} !important; }
        .card-hover:hover { transform:translateY(-3px) !important; box-shadow:0 8px 32px rgba(22,163,74,0.12) !important; border-color:${COLORS.primary}55 !important; }
        .btn-p:hover { background:${COLORS.primaryHover} !important; transform:translateY(-1px); }
        .btn-p:active { transform:scale(0.97); }
        @keyframes slideIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .tab-enter { animation:slideIn 0.35s cubic-bezier(.16,1,.3,1); }
      `}</style>

      {/* ── SIDEBAR ─────────────────────────────── */}
      <aside style={S.sidebar}>
        <div style={S.logo}>
          <div style={S.logoIcon}><Sprout size={20} color="#fff"/></div>
          <div>
            <div style={S.logoText}>AgriChain</div>
            <div style={S.logoSub}>Supply Network</div>
          </div>
        </div>

        <div style={S.navLabel}>Application</div>
        {navItems.map(({id,icon:Icon,label}) => (
          <button key={id} className="nav-btn" onClick={()=>nav(id)} style={navBtnStyle(tab===id)}>
            <Icon size={17}/> {label}
          </button>
        ))}

        <div style={S.navLabel}>Cryptography</div>
        <button className="nav-btn" onClick={()=>nav('explorer')} style={navBtnStyle(tab==='explorer')}>
          <Blocks size={17}/> Block Explorer
        </button>

        {/* Chain Status */}
        <div style={{marginTop:'auto',borderRadius:12,padding:16,background:chain.valid?COLORS.primaryLight:COLORS.rose,border:`1px solid ${chain.valid?COLORS.sidebarBorder:COLORS.roseBorder}`,display:'flex',alignItems:'center',gap:10}}>
          {chain.valid?<ShieldCheck size={20} style={{color:COLORS.primary}}/>:<ShieldX size={20} style={{color:COLORS.roseText}}/>}
          <div>
            <div style={{fontSize:13,fontWeight:700,color:chain.valid?COLORS.primaryText:COLORS.roseText}}>{chain.valid?'Chain Verified':'Compromised'}</div>
            <div style={{fontSize:10,color:chain.valid?COLORS.muted:COLORS.roseText,opacity:.7,marginTop:2}}>{stats.total_blocks} blocks indexed</div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ─────────────────────────────────── */}
      <main style={S.main}>
        {/* Header */}
        <header style={S.header}>
          <div>
            <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',color:COLORS.subtle}}>{tabLabels[tab]}</div>
            <div style={{fontSize:20,fontWeight:800,color:COLORS.text,letterSpacing:'-0.4px',marginTop:2}}>
              {{dashboard:'Supply Chain Overview',register:'Initialize New Batch',stage:'Log Lifecycle Stage',trace:'Audit Product Trail',explorer:'Blockchain Explorer'}[tab]}
            </div>
          </div>
          <div style={{fontSize:12,color:COLORS.subtle,fontWeight:500}}>{new Date().toLocaleDateString('en-IN',{weekday:'short',year:'numeric',month:'short',day:'numeric'})}</div>
        </header>

        <div style={S.content}>

          {/* ─── DASHBOARD ─── */}
          {tab==='dashboard' && (
            <div className="tab-enter">
              {/* Stats */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:20,marginBottom:32}}>
                <StatCard icon={BarChart3}  label="Immutable Blocks"   value={stats.total_blocks}       bg={COLORS.primaryLight} border={COLORS.sidebarBorder} text={COLORS.primaryText} iconBg="#bbf7d0"/>
                <StatCard icon={Leaf}       label="Tracked Batches"    value={stats.total_products}      bg={COLORS.blue}         border={COLORS.blueBorder}   text={COLORS.blueText}    iconBg="#bfdbfe"/>
                <StatCard icon={Zap}        label="Anomalies Detected" value={stats.anomalous_products}  bg={COLORS.rose}         border={COLORS.roseBorder}   text={COLORS.roseText}    iconBg="#fecdd3"/>
              </div>

              {/* Product Grid */}
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                <div style={{fontSize:15,fontWeight:800,color:COLORS.text}}>Active Shipment Ledger</div>
                <button className="btn-p" onClick={()=>nav('register')} style={{...S.btnPrimary,fontSize:13,padding:'8px 16px'}}>
                  <PackagePlus size={15}/> New Batch
                </button>
              </div>

              {products.length===0 ? (
                <div style={{...S.card,padding:64,textAlign:'center',borderStyle:'dashed',background:`${COLORS.primaryLight}44`}}>
                  <Sprout size={36} style={{color:COLORS.primary,margin:'0 auto 12px'}}/>
                  <p style={{color:COLORS.muted,fontWeight:600}}>No batches registered. Start your first one!</p>
                </div>
              ) : (
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:20}}>
                  {products.map(p=>(
                    <div key={p.batch_id} className="card-hover" onClick={()=>doTrace(p.batch_id)}
                      style={{...S.card,...S.cardHover}}>
                      {/* Top accent strip */}
                      <div style={{height:5,background:p.is_anomalous?`linear-gradient(90deg,#f43f5e,#fb923c)`:`linear-gradient(90deg,${COLORS.primary},#34d399)`}}/>
                      <div style={{padding:'20px 20px 0'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                          <div>
                            {p.is_anomalous&&<span style={{...S.badge,background:COLORS.rose,color:COLORS.roseText,border:`1px solid ${COLORS.roseBorder}`,marginBottom:6,display:'inline-flex'}}>⚠ Anomaly</span>}
                            <div style={{fontSize:17,fontWeight:800,color:COLORS.text,lineHeight:1.2}}>{p.name}</div>
                            <div style={{display:'flex',alignItems:'center',gap:4,marginTop:5,fontSize:12,color:COLORS.subtle,fontWeight:600}}>
                              <MapPin size={11}/>{p.origin}
                            </div>
                          </div>
                          <div
                            style={{background:COLORS.bg,padding:6,borderRadius:10,border:`1px solid ${COLORS.cardBorder}`,cursor:'zoom-in',position:'relative'}}
                            onMouseEnter={()=>setHoveredQR({batchId:p.batch_id,name:p.name,url:`http://192.168.1.142:5000/scan.html?batch=${p.batch_id}`})}
                            onMouseLeave={()=>setHoveredQR(null)}
                            onClick={e=>{e.stopPropagation();setHoveredQR(hoveredQR?.batchId===p.batch_id?null:{batchId:p.batch_id,name:p.name,url:`http://192.168.1.142:5000/scan.html?batch=${p.batch_id}`});}}
                            title="Hover to enlarge QR for scanning"
                          >
                            <QRCodeSVG value={`http://192.168.1.142:5000/scan.html?batch=${p.batch_id}`} size={44} level="L" bgColor="#f2fbf4"/>
                            <div style={{position:'absolute',bottom:2,right:2,fontSize:8,color:COLORS.primary,fontWeight:700,letterSpacing:'0.05em'}}>SCAN</div>
                          </div>
                        </div>
                        <div style={{fontFamily:'monospace',fontSize:11,color:COLORS.subtle,background:COLORS.bg,padding:'4px 10px',borderRadius:7,display:'inline-block',marginBottom:14}}>#{p.batch_id}</div>
                        <div style={{display:'flex',flexWrap:'wrap',gap:6,paddingBottom:16}}>
                          {ROLES.map(r=><StagePill key={r} role={r} done={p.stages_completed.includes(r)}/>)}
                        </div>
                      </div>
                      <div style={{padding:'10px 20px',background:COLORS.bg,borderTop:`1px solid ${COLORS.cardBorder}`,display:'flex',alignItems:'center',gap:6,fontSize:12,fontWeight:700,color:COLORS.primary}}>
                        View audit trail <ArrowRight size={12}/>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── REGISTER ─── */}
          {tab==='register' && (
            <div className="tab-enter" style={{maxWidth:900}}>
              <form onSubmit={handleReg} style={S.card}>
                <div style={{padding:'30px 40px 26px',background:`linear-gradient(135deg,${COLORS.primaryLight},${COLORS.bg})`,borderBottom:`1px solid ${COLORS.cardBorder}`}}>
                  <span style={{...S.badge,background:COLORS.primaryLight,color:COLORS.primaryText,border:`1px solid ${COLORS.sidebarBorder}`,marginBottom:8,display:'inline-flex'}}>Blockchain Registration</span>
                  <div style={{fontSize:19,fontWeight:800,color:COLORS.text}}>Initialize Genesis Block</div>
                  <div style={{fontSize:12,color:COLORS.muted,marginTop:4}}>Permanently records this batch on the distributed ledger.</div>
                </div>
                <div style={{padding:'32px 40px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
                  <Field label="Crop Name *"><input required style={S.input} placeholder="e.g. Sona Masuri Rice" value={reg.name} onChange={e=>setReg({...reg,name:e.target.value})}/></Field>
                  <Field label="Category"><select style={S.input} value={reg.crop_type} onChange={e=>setReg({...reg,crop_type:e.target.value})}><option>Grain</option><option>Fruit</option><option>Vegetable</option><option>Spice</option></select></Field>
                  <Field label="Farmer Name *"><input required style={S.input} placeholder="e.g. Raju Farms" value={reg.farmer_name} onChange={e=>setReg({...reg,farmer_name:e.target.value})}/></Field>
                  <Field label="Origin Location *"><input required style={S.input} placeholder="e.g. Bhongir, Telangana" value={reg.origin} onChange={e=>setReg({...reg,origin:e.target.value})}/></Field>
                  <Field label="Quantity (kg)"><input type="number" style={S.input} placeholder="500" value={reg.quantity_kg} onChange={e=>setReg({...reg,quantity_kg:e.target.value})}/></Field>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                    <Field label="Temp °C"><input type="number" style={S.input} placeholder="26" value={reg.temperature_c} onChange={e=>setReg({...reg,temperature_c:e.target.value})}/></Field>
                    <Field label="Humidity %"><input type="number" style={S.input} placeholder="55" value={reg.humidity_pct} onChange={e=>setReg({...reg,humidity_pct:e.target.value})}/></Field>
                  </div>
                  <div style={{gridColumn:'1/-1'}}>
                    <Field label="Notes"><textarea style={{...S.input,minHeight:72,resize:'vertical'}} placeholder="Optional harvest notes..." value={reg.notes} onChange={e=>setReg({...reg,notes:e.target.value})}/></Field>
                  </div>
                </div>
                <div style={{padding:'20px 40px',background:COLORS.bg,borderTop:`1px solid ${COLORS.cardBorder}`,display:'flex',justifyContent:'flex-end'}}>
                  <button type="submit" disabled={loading} className="btn-p" style={S.btnPrimary}>
                    {loading?<Loader2 size={16} className="animate-spin"/>:<PackagePlus size={16}/>} Write Genesis Block
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ─── LOG STAGE ─── */}
          {tab==='stage' && (
            <div className="tab-enter" style={{maxWidth:900}}>
              <form onSubmit={handleStg} style={S.card}>
                <div style={{padding:'30px 40px 26px',background:`linear-gradient(135deg,${COLORS.amber},${COLORS.bg})`,borderBottom:`1px solid ${COLORS.amberBorder}`}}>
                  <span style={{...S.badge,background:COLORS.amber,color:COLORS.amberText,border:`1px solid ${COLORS.amberBorder}`,marginBottom:8,display:'inline-flex'}}>Lifecycle Checkpoint</span>
                  <div style={{fontSize:19,fontWeight:800,color:COLORS.text}}>Log Supply Chain Stage</div>
                  <div style={{fontSize:12,color:COLORS.muted,marginTop:4}}>Records immutable environmental hand-off between actors.</div>
                </div>
                <div style={{padding:'32px 40px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
                  <Field label="Batch ID *"><input required style={{...S.input,fontFamily:'monospace'}} placeholder="e.g. A1B2C3D4" value={stg.batchId} onChange={e=>setStg({...stg,batchId:e.target.value.toUpperCase()})}/></Field>
                  <Field label="Handling Role"><select style={S.input} value={stg.role} onChange={e=>setStg({...stg,role:e.target.value})}><option>Processor</option><option>Distributor</option><option>Retailer</option><option>Consumer</option></select></Field>
                  <Field label="Responsible Actor *"><input required style={S.input} placeholder="e.g. Yadadri Mills" value={stg.actor} onChange={e=>setStg({...stg,actor:e.target.value})}/></Field>
                  <Field label="Location *"><input required style={S.input} placeholder="e.g. Yadadri, Telangana" value={stg.location} onChange={e=>setStg({...stg,location:e.target.value})}/></Field>
                  <Field label="Temperature °C"><input type="number" style={S.input} placeholder="24" value={stg.temp} onChange={e=>setStg({...stg,temp:e.target.value})}/></Field>
                  <Field label="Humidity %"><input type="number" style={S.input} placeholder="50" value={stg.hum} onChange={e=>setStg({...stg,hum:e.target.value})}/></Field>
                  <div style={{gridColumn:'1/-1'}}>
                    <Field label="Notes"><input style={S.input} placeholder="e.g. Refrigerated truck loaded at dock 5" value={stg.notes} onChange={e=>setStg({...stg,notes:e.target.value})}/></Field>
                  </div>
                </div>
                <div style={{padding:'20px 40px',background:COLORS.bg,borderTop:`1px solid ${COLORS.cardBorder}`,display:'flex',justifyContent:'flex-end'}}>
                  <button type="submit" disabled={loading} className="btn-p" style={S.btnPrimary}>
                    {loading?<Loader2 size={16} className="animate-spin"/>:<Truck size={16}/>} Append to Ledger
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ─── SHIPMENT TRACKING ─── */}
          {tab==='tracking' && (() => {
            const roleIcons = { Farmer:Sprout, Processor:Factory, Distributor:Truck, Retailer:Store, Consumer:User };
            const roleColors = {
              Farmer:      [COLORS.primaryLight, COLORS.primaryText,  COLORS.sidebarBorder],
              Processor:   [COLORS.amber,        COLORS.amberText,    COLORS.amberBorder],
              Distributor: [COLORS.blue,         COLORS.blueText,     COLORS.blueBorder],
              Retailer:    [COLORS.rose,         COLORS.roseText,     COLORS.roseBorder],
              Consumer:    [COLORS.purple,       COLORS.purpleText,   COLORS.purpleBorder],
            };
            const getStatus = (p) => {
              if(p.stages_completed.includes('Consumer')) return { label:'Delivered', color:COLORS.primaryText, bg:COLORS.primaryLight, border:COLORS.sidebarBorder };
              if(p.is_anomalous) return { label:'At Risk', color:COLORS.roseText, bg:COLORS.rose, border:COLORS.roseBorder };
              const last = [...ROLES].reverse().find(r=>p.stages_completed.includes(r));
              if(!last) return { label:'Origin', color:COLORS.amberText, bg:COLORS.amber, border:COLORS.amberBorder };
              return { label:'In Transit', color:COLORS.blueText, bg:COLORS.blue, border:COLORS.blueBorder };
            };
            return (
              <div className="tab-enter">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
                  <div>
                    <div style={{fontSize:28,fontWeight:900,color:COLORS.text,letterSpacing:'-0.5px'}}>Live Shipment Tracker</div>
                    <div style={{fontSize:14,color:COLORS.muted,marginTop:4}}>Real-time status of all active agricultural batches</div>
                  </div>
                  <div style={{display:'flex',gap:12}}>
                    {[
                      {label:'Total',   val:products.length,                                bg:COLORS.blue, color:COLORS.blueText},
                      {label:'In Transit', val:products.filter(p=>!p.stages_completed.includes('Consumer')&&!p.is_anomalous).length, bg:COLORS.amber, color:COLORS.amberText},
                      {label:'Delivered',  val:products.filter(p=>p.stages_completed.includes('Consumer')).length,  bg:COLORS.primaryLight, color:COLORS.primaryText},
                      {label:'At Risk',    val:products.filter(p=>p.is_anomalous).length,  bg:COLORS.rose, color:COLORS.roseText},
                    ].map(s=>(
                      <div key={s.label} style={{background:s.bg,borderRadius:12,padding:'10px 18px',textAlign:'center',minWidth:80}}>
                        <div style={{fontSize:22,fontWeight:900,color:s.color}}>{s.val}</div>
                        <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:s.color,opacity:.7}}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{display:'flex',flexDirection:'column',gap:20}}>
                  {products.length===0 ? (
                    <div style={{...S.card,padding:64,textAlign:'center',borderStyle:'dashed',background:`${COLORS.primaryLight}44`}}>
                      <Package2 size={36} style={{color:COLORS.primary,margin:'0 auto 12px'}}/>
                      <p style={{color:COLORS.muted,fontWeight:600}}>No shipments to track yet.</p>
                    </div>
                  ) : products.map(p => {
                    const status = getStatus(p);
                    const currentStageIdx = [...ROLES].reduce((acc,r,i)=>p.stages_completed.includes(r)?i:acc, -1);
                    const progressPct = currentStageIdx < 0 ? 0 : Math.round(((currentStageIdx+1)/ROLES.length)*100);
                    return (
                      <div key={p.batch_id} style={S.card} className="tab-enter">
                        {/* Header */}
                        <div style={{padding:'20px 28px',borderBottom:`1px solid ${COLORS.cardBorder}`,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
                          <div style={{display:'flex',alignItems:'center',gap:16}}>
                            <div style={{width:46,height:46,borderRadius:14,background:COLORS.primaryLight,display:'flex',alignItems:'center',justifyContent:'center'}}>
                              <Leaf size={22} style={{color:COLORS.primary}}/>
                            </div>
                            <div>
                              <div style={{fontSize:17,fontWeight:800,color:COLORS.text}}>{p.name}</div>
                              <div style={{display:'flex',gap:12,marginTop:3,fontSize:12,color:COLORS.muted,fontWeight:600}}>
                                <span style={{display:'flex',alignItems:'center',gap:4}}><MapPin size={11}/>{p.origin}</span>
                                <span style={{fontFamily:'monospace',color:COLORS.subtle}}>#{p.batch_id}</span>
                              </div>
                            </div>
                          </div>
                          <div style={{display:'flex',alignItems:'center',gap:10}}>
                            <span style={{fontSize:13,fontWeight:700,padding:'6px 16px',borderRadius:20,background:status.bg,color:status.color,border:`1px solid ${status.border}`}}>
                              {status.label}
                            </span>
                            <button onClick={()=>doTrace(p.batch_id)} style={{...S.btnPrimary,padding:'6px 14px',fontSize:12}}>
                              <Search size={13}/> Full Audit
                            </button>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{padding:'20px 28px 0'}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                            <div style={{fontSize:12,fontWeight:700,color:COLORS.muted,textTransform:'uppercase',letterSpacing:'0.08em'}}>Journey Progress</div>
                            <div style={{fontSize:13,fontWeight:800,color:progressPct===100?COLORS.primaryText:COLORS.blueText}}>{progressPct}%</div>
                          </div>
                          <div style={{height:8,background:'#e2f4e9',borderRadius:99,overflow:'hidden',marginBottom:24}}>
                            <div style={{height:'100%',width:`${progressPct}%`,borderRadius:99,transition:'width 1s ease',
                              background:p.is_anomalous?'linear-gradient(90deg,#f43f5e,#fb923c)':`linear-gradient(90deg,${COLORS.primary},#34d399)`
                            }}/>
                          </div>

                          {/* Stage Stepper */}
                          <div style={{display:'flex',alignItems:'flex-start',gap:0,marginBottom:24,position:'relative'}}>
                            {/* connector line */}
                            <div style={{position:'absolute',top:20,left:'10%',right:'10%',height:2,background:'#e2f4e9',zIndex:0}}/>
                            {ROLES.map((role,i)=>{
                              const done   = p.stages_completed.includes(role);
                              const active = !done && i === currentStageIdx+1;
                              const IconC  = roleIcons[role]||Package2;
                              const [bg,tc,bc] = roleColors[role];
                              return (
                                <div key={role} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:8,position:'relative',zIndex:1}}>
                                  <div style={{
                                    width:42,height:42,borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',
                                    background: done?bg : active?'#fff':'#f1f5f9',
                                    border: done?`2px solid ${bc}` : active?`2px dashed ${bc}`:'2px solid #e2e8f0',
                                    boxShadow: done||active ? `0 4px 12px ${tc}33` : 'none',
                                    transition:'all 0.3s',
                                  }}>
                                    <IconC size={18} style={{color: done?tc : active?tc:'#94a3b8'}}/>
                                  </div>
                                  <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',color:done?tc:active?tc:'#94a3b8',textAlign:'center'}}>{role}</div>
                                  {done && <div style={{width:6,height:6,borderRadius:'50%',background:tc}}/>}
                                  {active && <div style={{width:6,height:6,borderRadius:'50%',background:tc,opacity:0.5}}/>}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Last confirmed stage detail */}
                        {currentStageIdx >= 0 && (() => {
                          const lastRole = ROLES[currentStageIdx];
                          const [bg,tc,bc] = roleColors[lastRole];
                          return (
                            <div style={{margin:'0 28px 20px',borderRadius:12,background:bg,border:`1px solid ${bc}`,padding:'14px 20px',display:'flex',flexWrap:'wrap',gap:'12px 32px'}}>
                              <div>
                                <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:tc,opacity:.7,marginBottom:2}}>Current Stage</div>
                                <div style={{fontWeight:700,fontSize:14,color:tc}}>{lastRole}</div>
                              </div>
                              {p.is_anomalous && (
                                <div>
                                  <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:COLORS.roseText,opacity:.7,marginBottom:2}}>⚠ Anomaly</div>
                                  <div style={{fontWeight:700,fontSize:14,color:COLORS.roseText}}>Temp/Humidity Breach</div>
                                </div>
                              )}
                              <div>
                                <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:tc,opacity:.7,marginBottom:2}}>Stages Done</div>
                                <div style={{fontWeight:700,fontSize:14,color:tc}}>{p.stages_completed.length} / {ROLES.length}</div>
                              </div>
                              <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:6,color:tc,fontSize:12,fontWeight:600}}>
                                <Timer size={14}/> Last updated: just now
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* ─── TRACE ─── */}
          {tab==='trace' && (
            <div className="tab-enter" style={{maxWidth:760}}>
              <div style={{...S.card,padding:20,display:'flex',gap:14,marginBottom:28}}>
                <input style={{...S.input,flex:1,fontFamily:'monospace',fontSize:15}} placeholder="Enter Batch ID to audit…" value={traceId} onChange={e=>setTraceId(e.target.value.toUpperCase())}/>
                <button onClick={()=>doTrace()} disabled={loading} className="btn-p" style={{...S.btnPrimary,whiteSpace:'nowrap'}}>
                  {loading?<Loader2 size={16} className="animate-spin"/>:<Search size={16}/>} Fetch Chain
                </button>
              </div>

              {trace && (() => {
                const p=trace.product;
                return (
                  <div>
                    <div style={{...S.card,marginBottom:24,overflow:'visible'}}>
                      <div style={{height:6,background:p.is_anomalous?'linear-gradient(90deg,#f43f5e,#fb923c)':`linear-gradient(90deg,${COLORS.primary},#34d399)`}}/>
                      <div style={{padding:'20px 24px',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                        <div>
                          <div style={{fontFamily:'monospace',fontSize:11,color:COLORS.subtle,marginBottom:4}}>#{p.batch_id}</div>
                          <div style={{fontSize:24,fontWeight:900,color:COLORS.text,letterSpacing:'-0.5px'}}>{p.name}</div>
                          <div style={{display:'flex',gap:20,marginTop:8,fontSize:13,color:COLORS.muted,fontWeight:600}}>
                            <span style={{display:'flex',alignItems:'center',gap:5}}><MapPin size={13}/>{p.origin}</span>
                            <span style={{display:'flex',alignItems:'center',gap:5}}><Leaf size={13}/>{p.crop_type}</span>
                          </div>
                        </div>
                        <div style={{...S.badge,padding:'10px 18px',borderRadius:12,fontSize:13,fontWeight:700,
                          background:p.is_anomalous?COLORS.rose:COLORS.primaryLight,
                          color:p.is_anomalous?COLORS.roseText:COLORS.primaryText,
                          border:`1px solid ${p.is_anomalous?COLORS.roseBorder:COLORS.sidebarBorder}`,gap:8}}>
                          {p.is_anomalous?<><AlertTriangle size={16}/>Compromised</>:<><ShieldCheck size={16}/>Certified Secure</>}
                        </div>
                      </div>
                    </div>

                    <div style={{position:'relative',paddingLeft:28}}>
                      <div style={{position:'absolute',left:22,top:0,bottom:80,width:2,background:COLORS.cardBorder}}/>
                      <div style={{display:'flex',flexDirection:'column',gap:20}}>
                        {trace.journey.map((b,i)=>{
                          const anom=b.data.is_anomalous;
                          return (
                            <div key={b.hash} style={{display:'flex',gap:20,alignItems:'flex-start'}} className="tab-enter">
                              <div style={{flexShrink:0,width:46,height:46,borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',
                                border:`2px solid ${COLORS.bg}`,boxShadow:'0 4px 12px rgba(0,0,0,0.08)',zIndex:2,
                                background:anom?'#f43f5e':COLORS.primary}}>
                                {anom?<AlertTriangle size={18} color="#fff"/>:<CheckCircle size={18} color="#fff"/>}
                              </div>
                              <div style={{flex:1,...S.card,border:`1px solid ${anom?COLORS.roseBorder:COLORS.cardBorder}`}}>
                                <div style={{padding:'12px 18px',borderBottom:`1px solid ${anom?COLORS.roseBorder:COLORS.cardBorder}`,display:'flex',justifyContent:'space-between',alignItems:'center',background:anom?COLORS.rose:COLORS.bg}}>
                                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                                    <span style={{fontWeight:700,fontSize:15,color:COLORS.text}}>{b.data.event}</span>
                                    <span style={{...S.badge,fontSize:10,
                                      background:{Farmer:COLORS.primaryLight,Processor:COLORS.amber,Distributor:COLORS.blue,Retailer:COLORS.rose,Consumer:COLORS.purple}[b.data.role]||COLORS.bg,
                                      color:{Farmer:COLORS.primaryText,Processor:COLORS.amberText,Distributor:COLORS.blueText,Retailer:COLORS.roseText,Consumer:COLORS.purpleText}[b.data.role]||COLORS.muted}}>
                                      {b.data.role}
                                    </span>
                                  </div>
                                  <span style={{fontSize:11,color:COLORS.subtle,fontWeight:500,display:'flex',alignItems:'center',gap:5}}>
                                    <Clock size={11}/>{new Date(b.timestamp).toLocaleString()}
                                  </span>
                                </div>
                                <div style={{padding:'16px 18px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px 24px',fontSize:13}}>
                                  {b.data.actor&&<div><div style={S.label}>Actor</div><div style={{fontWeight:600,color:COLORS.text}}>{b.data.actor}</div></div>}
                                  {b.data.location&&<div><div style={S.label}>Location</div><div style={{fontWeight:600,color:COLORS.text,display:'flex',alignItems:'center',gap:4}}><MapPin size={12} style={{color:COLORS.primary}}/>{b.data.location}</div></div>}
                                  <div><div style={S.label}>Environment</div>
                                    <div style={{fontWeight:600,color:anom?COLORS.roseText:COLORS.text,display:'flex',alignItems:'center',gap:10}}>
                                      <span style={{display:'flex',alignItems:'center',gap:4}}><Thermometer size={13}/>{b.data.temperature_c}°C</span>
                                      <span style={{display:'flex',alignItems:'center',gap:4}}><Droplets size={13}/>{b.data.humidity_pct}%</span>
                                      {anom&&<span style={{...S.badge,background:COLORS.rose,color:COLORS.roseText,fontSize:9}}>BREACH</span>}
                                    </div>
                                  </div>
                                  {b.data.notes&&<div style={{gridColumn:'1/-1'}}><div style={S.label}>Notes</div><div style={{color:COLORS.muted,fontWeight:500}}>{b.data.notes}</div></div>}
                                </div>
                                <div style={{padding:'8px 18px',background:COLORS.bg,borderTop:`1px solid ${COLORS.cardBorder}`,fontFamily:'monospace',fontSize:10,color:COLORS.subtle,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                                  SHA-256 → {b.hash}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ─── EXPLORER ─── */}
          {tab==='explorer' && (
            <div className="tab-enter" style={{maxWidth:860}}>
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                {blocks.map(b=>(
                  <div key={b.hash} style={S.card}>
                    <button onClick={()=>setOpenBlock(openBlock===b.hash?null:b.hash)} style={{width:'100%',padding:'16px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'none',border:'none',cursor:'pointer',fontFamily:'inherit',textAlign:'left',borderRadius:16}}>
                      <div style={{display:'flex',alignItems:'center',gap:16}}>
                        <div style={{width:40,height:40,borderRadius:10,background:'#0f172a',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace',fontSize:11,fontWeight:700,flexShrink:0}}>#{b.index}</div>
                        <div>
                          <div style={{fontWeight:700,fontSize:14,color:COLORS.text}}>{b.data?.event||'Genesis Block'}</div>
                          <div style={{fontFamily:'monospace',fontSize:11,color:COLORS.subtle,marginTop:2}}>{b.hash.slice(0,28)}…</div>
                        </div>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:12}}>
                        <span style={{...S.badge,background:COLORS.primaryLight,color:COLORS.primaryText}}>{b.data?.role||'SYSTEM'}</span>
                        {openBlock===b.hash?<ChevronUp size={16} style={{color:COLORS.subtle}}/>:<ChevronDown size={16} style={{color:COLORS.subtle}}/>}
                      </div>
                    </button>
                    {openBlock===b.hash&&(
                      <div style={{borderTop:`1px solid ${COLORS.cardBorder}`,background:'#0d1117',padding:20,fontFamily:'monospace',fontSize:12,color:'#7ee787',overflowX:'auto'}}>
                        <pre>{JSON.stringify(b,null,2)}</pre>
                      </div>
                    )}
                  </div>
                ))}
                {!blocks.length&&(
                  <div style={{...S.card,padding:64,textAlign:'center',borderStyle:'dashed'}}>
                    <Blocks size={32} style={{color:COLORS.primary,margin:'0 auto 12px'}}/>
                    <p style={{color:COLORS.muted,fontWeight:600}}>No blocks indexed yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      <Toast alert={alert} onClose={()=>setAlert(null)}/>

      {/* ── QR Hover Modal ── */}
      {hoveredQR && (
        <div
          onMouseEnter={()=>setHoveredQR(hoveredQR)}
          onMouseLeave={()=>setHoveredQR(null)}
          onClick={()=>setHoveredQR(null)}
          style={{
            position:'fixed', inset:0, zIndex:200,
            background:'rgba(0,0,0,0.45)', backdropFilter:'blur(4px)',
            display:'flex', alignItems:'center', justifyContent:'center',
            animation:'slideIn 0.2s ease',
            cursor:'zoom-out',
          }}
        >
          <div
            onClick={e=>e.stopPropagation()}
            style={{
              background:'#fff', borderRadius:24, padding:40,
              boxShadow:'0 32px 80px rgba(0,0,0,0.25)',
              display:'flex', flexDirection:'column', alignItems:'center', gap:20,
              border:`3px solid ${COLORS.cardBorder}`,
              cursor:'default',
            }}
          >
            {/* Large QR */}
            <QRCodeSVG
              value={hoveredQR.url}
              size={240}
              level="H"
              bgColor="#ffffff"
              fgColor="#166534"
              style={{borderRadius:8}}
            />
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:18, fontWeight:800, color:COLORS.text, marginBottom:4}}>{hoveredQR.name}</div>
              <div style={{fontFamily:'monospace', fontSize:12, color:COLORS.subtle, marginBottom:12}}>#{hoveredQR.batchId}</div>
              <div style={{display:'flex', alignItems:'center', gap:6, justifyContent:'center', background:COLORS.primaryLight, borderRadius:10, padding:'8px 20px'}}>
                <span style={{fontSize:13, fontWeight:700, color:COLORS.primaryText}}>📱 Point your mobile camera to scan</span>
              </div>
            </div>
            <button onClick={()=>setHoveredQR(null)} style={{background:'none', border:`1px solid ${COLORS.cardBorder}`, borderRadius:8, padding:'6px 20px', cursor:'pointer', fontSize:13, color:COLORS.muted, fontFamily:'inherit', fontWeight:600}}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>

  );
}
