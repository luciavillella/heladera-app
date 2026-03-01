"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { createClient } from "./lib/supabase";

const TIPOS_COMIDA = ["Desayuno", "Almuerzo", "Merienda", "Cena", "Colación", "Postre", "Smoothie"];
const PERSONAS_OPT = ["1 persona", "2 personas", "3-4 personas", "5+ personas"];
const TIEMPO_OPT = ["15 minutos", "30 minutos", "45 minutos", "1 hora o más"];
const DIETA_OPT = ["Vegetariano", "Vegano", "Sin TACC", "Sin lácteos", "Sin huevo", "Keto / Low Carb"];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap');

  :root {
    --bg:        #F5F0E8;
    --surface:   #FDFAF4;
    --border:    #E2D9C8;
    --text:      #1E1A14;
    --muted:     #7A7060;
    --accent:    #B85C2A;
    --accent2:   #D4884E;
    --green:     #4A7C5F;
    --green-bg:  #EBF3EE;
    --green-bd:  #B8D4C0;
    --gold:      #C9973A;
    --gold-bg:   #FBF3E2;
    --gold-bd:   #E8D4A0;
    --shadow:    0 2px 12px rgba(30,26,20,0.08);
    --shadow-lg: 0 8px 40px rgba(30,26,20,0.13);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'Outfit', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    background-image: radial-gradient(circle at 20% 20%, rgba(184,92,42,0.04) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(74,124,95,0.04) 0%, transparent 50%);
  }

  .page { max-width: 720px; margin: 0 auto; padding: 48px 20px 100px; }

  .header { margin-bottom: 48px; }
  .header-tag {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 600; letter-spacing: 2.5px;
    text-transform: uppercase; color: var(--accent);
    background: rgba(184,92,42,0.08); border: 1px solid rgba(184,92,42,0.2);
    padding: 6px 14px; border-radius: 20px; margin-bottom: 20px;
  }
  .header h1 {
    font-family: 'Lora', serif;
    font-size: clamp(24px, 3.5vw, 36px);
    font-weight: 600; line-height: 1.2;
    color: var(--text); margin: 0 0 16px;
  }
  .header h1 em { font-style: italic; color: var(--accent); }
  .header p { font-size: 16px; color: var(--muted); line-height: 1.6; max-width: 500px; }

  .card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; padding: 32px; margin-bottom: 20px;
    box-shadow: var(--shadow);
  }
  .card-title {
    font-size: 11px; font-weight: 600; letter-spacing: 2px;
    text-transform: uppercase; color: var(--muted);
    margin-bottom: 24px; padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
  }

  .upload-zone {
    border: 2px dashed var(--border); border-radius: 16px;
    padding: 48px 24px; text-align: center; cursor: pointer;
    transition: all 0.2s; background: var(--bg);
    position: relative;
  }
  .upload-zone:hover, .upload-zone.drag { border-color: var(--accent); background: rgba(184,92,42,0.03); }
  .upload-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
  .upload-icon-wrap {
    width: 56px; height: 56px; background: var(--accent);
    border-radius: 14px; display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px; font-size: 24px;
  }
  .upload-title { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
  .upload-sub { font-size: 14px; color: var(--muted); margin-bottom: 12px; }
  .upload-formats { font-size: 12px; color: var(--accent); font-weight: 500; letter-spacing: 1px; }

  .preview-wrap { position: relative; border-radius: 16px; overflow: hidden; }
  .preview-wrap img { width: 100%; max-height: 320px; object-fit: cover; display: block; }
  .preview-bar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px; background: var(--green-bg); border: 1px solid var(--green-bd);
    border-radius: 10px; margin-top: 12px;
  }
  .preview-label { font-size: 13px; font-weight: 500; color: var(--green); }
  .btn-change {
    font-size: 12px; font-weight: 600; color: var(--accent);
    background: none; border: 1px solid rgba(184,92,42,0.3);
    padding: 5px 12px; border-radius: 8px; cursor: pointer;
    transition: all 0.2s;
  }
  .btn-change:hover { background: rgba(184,92,42,0.08); }

  .prefs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .pref-group { display: flex; flex-direction: column; gap: 8px; }
  .pref-group label { font-size: 13px; font-weight: 500; color: var(--muted); }
  .pref-group select {
    padding: 10px 14px; border: 1.5px solid var(--border);
    border-radius: 10px; background: var(--bg);
    font-family: 'Outfit', sans-serif; font-size: 14px;
    color: var(--text); cursor: pointer; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237A7060' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 14px center;
    padding-right: 36px; transition: border-color 0.2s;
  }
  .pref-group select:focus { outline: none; border-color: var(--accent); }
  .pref-group.full { grid-column: 1 / -1; }

  .dieta-options { display: flex; flex-wrap: wrap; gap: 8px; }
  .dieta-chip {
    padding: 7px 14px; border: 1.5px solid var(--border);
    border-radius: 20px; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.2s; background: var(--bg);
    color: var(--muted); user-select: none;
  }
  .dieta-chip:hover { border-color: var(--accent); color: var(--accent); }
  .dieta-chip.active {
    background: rgba(184,92,42,0.1); border-color: var(--accent);
    color: var(--accent);
  }
  .dieta-chip input { display: none; }

  .btn-analyze {
    width: 100%; padding: 18px; background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: white; border: none; border-radius: 16px;
    font-family: 'Outfit', sans-serif; font-size: 17px; font-weight: 600;
    cursor: pointer; transition: all 0.3s; letter-spacing: 0.3px;
    box-shadow: 0 4px 20px rgba(184,92,42,0.35);
  }
  .btn-analyze:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(184,92,42,0.45); }
  .btn-analyze:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .loading-wrap { text-align: center; padding: 48px 24px; }
  .loading-spinner {
    width: 48px; height: 48px; border: 3px solid var(--border);
    border-top-color: var(--accent); border-radius: 50%;
    animation: spin 0.8s linear infinite; margin: 0 auto 20px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-title { font-family: 'Lora', serif; font-size: 22px; font-weight: 600; margin-bottom: 8px; }
  .loading-sub { font-size: 14px; color: var(--muted); }

  .error-box {
    background: #FEF2F2; border: 1px solid #FECACA;
    border-radius: 12px; padding: 16px 20px;
    font-size: 14px; color: #DC2626;
    display: flex; align-items: flex-start; gap: 10px;
  }

  .detected-box {
    background: var(--gold-bg); border: 1px solid var(--gold-bd);
    border-radius: 14px; padding: 16px 20px; margin-bottom: 28px;
  }
  .detected-label { font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--gold); margin-bottom: 6px; }
  .detected-text { font-size: 14px; color: var(--text); line-height: 1.5; }

  .results-title {
    font-family: 'Lora', serif; font-size: 26px; font-weight: 600;
    margin-bottom: 24px; color: var(--text);
  }

  .recipe-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; overflow: hidden; margin-bottom: 20px;
    box-shadow: var(--shadow); transition: transform 0.2s, box-shadow 0.2s;
  }
  .recipe-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
  .recipe-header { padding: 24px 24px 20px; border-bottom: 1px solid var(--border); }
  .recipe-emoji { font-size: 36px; margin-bottom: 12px; }
  .recipe-name { font-family: 'Lora', serif; font-size: 22px; font-weight: 600; margin-bottom: 12px; }
  .recipe-meta { display: flex; flex-wrap: wrap; gap: 8px; }
  .meta-tag {
    font-size: 12px; font-weight: 500; padding: 4px 10px;
    border-radius: 8px; background: var(--bg); border: 1px solid var(--border);
    color: var(--muted);
  }

  .recipe-body { padding: 24px; }
  .section-label {
    font-size: 11px; font-weight: 600; letter-spacing: 1.5px;
    text-transform: uppercase; color: var(--muted); margin-bottom: 12px;
  }
  .ingredientes-list { list-style: none; padding: 0; margin: 0 0 24px; }
  .ingredientes-list li {
    padding: 8px 0; border-bottom: 1px solid var(--border);
    font-size: 14px; display: flex; align-items: center; gap: 10px;
  }
  .ingredientes-list li:last-child { border-bottom: none; }
  .ingredientes-list li::before { content: ''; width: 6px; height: 6px; background: var(--accent); border-radius: 50%; flex-shrink: 0; }

  .pasos-list { list-style: none; padding: 0; margin: 0; }
  .paso-item { display: flex; gap: 14px; margin-bottom: 16px; }
  .paso-num {
    width: 28px; height: 28px; background: var(--accent); color: white;
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 600; flex-shrink: 0; margin-top: 1px;
  }
  .paso-text { font-size: 14px; line-height: 1.6; color: var(--text); padding-top: 4px; }

  .btn-reset {
    display: block; margin: 32px auto 0;
    padding: 12px 28px; background: none;
    border: 1.5px solid var(--border); border-radius: 12px;
    font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 500;
    color: var(--muted); cursor: pointer; transition: all 0.2s;
  }
  .btn-reset:hover { border-color: var(--accent); color: var(--accent); }

  /* AUTH STYLES */
  .auth-wrap {
    min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 24px;
  }
  .auth-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 24px; padding: 40px; width: 100%; max-width: 420px;
    box-shadow: var(--shadow-lg);
  }
  .auth-logo-wrap {
    text-align: center; margin-bottom: 28px;
  }
  .auth-logo-wrap img {
    width: 220px; max-width: 80%;
  }
  .auth-title {
    font-family: 'Lora', serif; font-size: 20px; font-weight: 600;
    color: var(--text); margin-bottom: 6px; text-align: center;
  }
  .auth-sub { font-size: 14px; color: var(--muted); text-align: center; margin-bottom: 28px; }
  .auth-tabs {
    display: flex; gap: 0; margin-bottom: 28px;
    border: 1.5px solid var(--border); border-radius: 12px; overflow: hidden;
  }
  .auth-tab {
    flex: 1; padding: 10px; font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 500; cursor: pointer;
    background: none; border: none; color: var(--muted); transition: all 0.2s;
  }
  .auth-tab.active { background: var(--accent); color: white; }
  .auth-field { margin-bottom: 16px; }
  .auth-field label { display: block; font-size: 13px; font-weight: 500; color: var(--muted); margin-bottom: 6px; }
  .auth-field input {
    width: 100%; padding: 11px 14px; border: 1.5px solid var(--border);
    border-radius: 10px; background: var(--bg);
    font-family: 'Outfit', sans-serif; font-size: 14px; color: var(--text);
    box-sizing: border-box; transition: border-color 0.2s;
  }
  .auth-field input:focus { outline: none; border-color: var(--accent); }
  .btn-auth {
    width: 100%; padding: 14px; background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: white; border: none; border-radius: 12px;
    font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 600;
    cursor: pointer; transition: all 0.3s; margin-top: 8px;
    box-shadow: 0 4px 16px rgba(184,92,42,0.3);
  }
  .btn-auth:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(184,92,42,0.4); }
  .btn-auth:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .auth-msg {
    margin-top: 16px; padding: 12px 16px; border-radius: 10px;
    font-size: 13px; text-align: center;
  }
  .auth-msg.success { background: var(--green-bg); border: 1px solid var(--green-bd); color: var(--green); }
  .auth-msg.error { background: #FEF2F2; border: 1px solid #FECACA; color: #DC2626; }

  /* TOP BAR */
  .topbar {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 32px; padding: 12px 16px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; box-shadow: var(--shadow);
  }
  .topbar-user { font-size: 13px; color: var(--muted); }
  .topbar-user span { font-weight: 600; color: var(--text); }
  .btn-logout {
    font-size: 12px; font-weight: 600; color: var(--muted);
    background: none; border: 1px solid var(--border);
    padding: 6px 14px; border-radius: 8px; cursor: pointer;
    transition: all 0.2s;
  }
  .btn-logout:hover { border-color: var(--accent); color: var(--accent); }

  @media (max-width: 600px) {
    .prefs-grid { grid-template-columns: 1fr; }
    .pref-group.full { grid-column: 1; }
    .page { padding: 32px 16px 80px; }
  }
`;

// ── Auth Component ──────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [showReset, setShowReset] = useState(false);
  const supabase = createClient();

  const handle = async () => {
    setLoading(true); setMsg(null);
    try {
      if (tab === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onLogin();
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg({ type: "success", text: "¡Cuenta creada! Revisá tu email para confirmar." });
      }
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!email) { setMsg({ type: "error", text: "Ingresá tu email primero." }); return; }
    setLoading(true); setMsg(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://app.quecocino.today",
      });
      if (error) throw error;
      setMsg({ type: "success", text: "¡Te enviamos un email para restablecer tu contraseña!" });
      setShowReset(false);
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-logo-wrap">
        <img src="/logo.portal.png" alt="Que Cocino Today" />
      </div>
      <div className="auth-card">
        <div className="auth-title">Que Cocino Today 🔍</div>
        <div className="auth-sub">Ingresá para ver tus recetas personalizadas</div>
        <div className="auth-tabs">
          <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setShowReset(false); setMsg(null); }}>Ingresar</button>
          <button className={`auth-tab ${tab === "signup" ? "active" : ""}`} onClick={() => { setTab("signup"); setShowReset(false); setMsg(null); }}>Registrarse</button>
        </div>
        <div className="auth-field">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" />
        </div>
        {!showReset && (
          <div className="auth-field">
            <label>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handle()} />
          </div>
        )}
        {!showReset ? (
          <>
            <button className="btn-auth" onClick={handle} disabled={loading}>
              {loading ? "Cargando..." : tab === "login" ? "Ingresar" : "Crear cuenta"}
            </button>
            {tab === "login" && (
              <div style={{textAlign:'center', marginTop:12, display:'flex', flexDirection:'column', gap:8}}>
                <button onClick={() => { setShowReset(true); setMsg(null); }}
                  style={{background:'none', border:'none', color:'var(--accent)', fontSize:13, cursor:'pointer', textDecoration:'underline'}}>
                  ¿Olvidaste tu contraseña?
                </button>
                <p style={{fontSize:13, color:'var(--muted)', margin:0}}>
                  ¿Primera vez?{' '}
                  <button onClick={() => { setTab("signup"); setMsg(null); }}
                    style={{background:'none', border:'none', color:'var(--accent)', fontSize:13, cursor:'pointer', textDecoration:'underline', padding:0}}>
                    Registrate acá
                  </button>
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <button className="btn-auth" onClick={handleReset} disabled={loading}>
              {loading ? "Enviando..." : "Enviar email de recuperación"}
            </button>
            <div style={{textAlign:'center', marginTop:12}}>
              <button onClick={() => { setShowReset(false); setMsg(null); }}
                style={{background:'none', border:'none', color:'var(--muted)', fontSize:13, cursor:'pointer', textDecoration:'underline'}}>
                Volver al login
              </button>
            </div>
          </>
        )}
        {msg && <div className={`auth-msg ${msg.type}`}>{msg.text}</div>}
      </div>
    </div>
  );
}

// ── Main App ────────────────────────────────────────────────────
export default function HeladeraApp() {
  const [user, setUser] = useState(undefined);
  const [profile, setProfile] = useState(null);
  const [image, setImage]           = useState(null);
  const [imageFile, setImageFile]   = useState(null);
  const [dragOver, setDragOver]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState(null);
  const [error, setError]           = useState(null);
  const [tipoComida, setTipoComida] = useState("");
  const [personas, setPersonas]     = useState("");
  const [tiempo, setTiempo]         = useState("");
  const [dieta, setDieta]           = useState([]);
  const fileRef                     = useRef();
  const [inputKey, setInputKey]     = useState(0);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      if (data.session?.user) loadProfile(data.session.user.id);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId) => {
    const { data } = await supabase.from('user_profiles').select('*').eq('id', userId).single();
    setProfile(data);
  };

  const logout = async () => { await supabase.auth.signOut(); };

  // Calcular estado del trial
  const isPremium = profile?.is_premium;
  const trialEnd = profile?.trial_ends_at ? new Date(profile.trial_ends_at) : null;
  const trialActive = trialEnd && trialEnd > new Date();
  const diasRestantes = trialEnd ? Math.max(0, Math.ceil((trialEnd - new Date()) / (1000 * 60 * 60 * 24))) : 0;
  const consultasHoy = profile?.consultas_hoy || 0;
  const puedeConsultar = isPremium || (trialActive && consultasHoy < 2);

  const handleFile = useCallback((file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target.result);
    reader.readAsDataURL(file);
    setResult(null); setError(null);
  }, []);

  const toggleDieta = (item) =>
    setDieta((prev) => prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]);

  const analyze = async () => {
    if (!imageFile) return;
    if (!puedeConsultar) return;
    setLoading(true); setError(null);
    try {
      // Actualizar contador si no es premium
      if (!isPremium) {
        const today = new Date().toISOString().split('T')[0];
        const nuevasConsultas = profile?.ultima_consulta === today ? consultasHoy + 1 : 1;
        await supabase.from('user_profiles').update({
          consultas_hoy: nuevasConsultas,
          ultima_consulta: today
        }).eq('id', user.id);
        setProfile(p => ({...p, consultas_hoy: nuevasConsultas, ultima_consulta: today}));
      }
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(",")[1]);
        r.onerror = () => rej(new Error("Error leyendo archivo"));
        r.readAsDataURL(imageFile);
      });
      const resp = await fetch("/api/recetas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mediaType: imageFile.type, tipoComida, personas, dieta, tiempo }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Error del servidor");
      setResult(data);
    } catch (err) {
      setError("Algo salió mal: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setImage(null); setImageFile(null); setResult(null); setError(null); setInputKey(k => k + 1); };

  // Loading inicial
  if (user === undefined) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh'}}><div style={{width:40,height:40,border:'3px solid #E2D9C8',borderTopColor:'#B85C2A',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} /></div>;

  // No logueado
  if (!user) return (
    <>
      <style>{css}</style>
      <AuthScreen onLogin={() => {}} />
    </>
  );

  // Trial vencido
  if (profile && !isPremium && !trialActive) return (
    <>
      <style>{css}</style>
      <div className="auth-wrap">
        <div className="auth-logo-wrap"><img src="/logo.portal.png" alt="Que Cocino Today" /></div>
        <div className="auth-card" style={{textAlign:'center'}}>
          <div style={{fontSize:48, marginBottom:16}}>⏰</div>
          <div className="auth-title">Tu período de prueba terminó</div>
          <div className="auth-sub" style={{marginBottom:24}}>Suscribite por solo $3/mes y seguí cocinando con recetas ilimitadas</div>
          <a href="https://recetas.quecocino.today/membresia" style={{display:'block',padding:'14px',background:'linear-gradient(135deg,#B85C2A,#D4884E)',color:'white',borderRadius:'12px',textDecoration:'none',fontWeight:600,fontSize:15,marginBottom:12}}>
            Suscribirme ahora 🚀
          </a>
          <button onClick={logout} className="btn-reset" style={{margin:'8px auto 0'}}>Salir</button>
        </div>
      </div>
    </>
  );

  // App principal
  return (
    <>
      <style>{css}</style>
      <div className="page">
        <div className="topbar">
          <div className="topbar-user">Hola, <span>{user.email}</span> 👋</div>
          <button className="btn-logout" onClick={logout}>Salir</button>
        </div>

        {/* Indicador de trial */}
        {!isPremium && trialActive && (
          <div style={{background:'var(--gold-bg)',border:'1px solid var(--gold-bd)',borderRadius:12,padding:'10px 16px',marginBottom:16,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8}}>
            <span style={{fontSize:15,color:'#92650a',fontWeight:700}}>🔥 Consultas hoy: {consultasHoy}/2</span>
            <span style={{fontSize:15,color:'#92650a'}}>⏳ {diasRestantes} días de prueba restantes</span>
            <a href="https://recetas.quecocino.today/membresia" style={{fontSize:14,color:'var(--accent)',fontWeight:700,textDecoration:'underline'}}>Suscribirme →</a>
          </div>
        )}

        {/* Límite alcanzado */}
        {!isPremium && trialActive && consultasHoy >= 2 && (
          <div style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:12,padding:'16px 20px',marginBottom:16,textAlign:'center'}}>
            <div style={{fontSize:13,color:'#DC2626',fontWeight:600,marginBottom:8}}>Usaste tus 2 consultas de hoy 😅</div>
            <div style={{fontSize:13,color:'#DC2626',marginBottom:12}}>Volvé mañana o suscribite para consultas ilimitadas</div>
            <a href="https://recetas.quecocino.today/membresia" style={{display:'inline-block',padding:'10px 20px',background:'linear-gradient(135deg,#B85C2A,#D4884E)',color:'white',borderRadius:'10px',textDecoration:'none',fontWeight:600,fontSize:13}}>
              Suscribirme por $3/mes 🚀
            </a>
          </div>
        )}

        <div className="header">
          <div style={{marginBottom: 20, textAlign: 'center'}}>
            <img src="/logo.portal.png" alt="Que Cocino Today" style={{width: 300, maxWidth: '90%'}} />
          </div>
          <div className="header-tag">✦ Cocina simple, fácil, rápido y delicioso</div>
          <h1>Mostrame lo que tenés y te digo qué cocinar <em>AHORA</em></h1>
          <p>Sacá una foto a tus ingredientes, elegí tus preferencias y te sugerimos 3 recetas perfectas según lo que tenés.</p>
        </div>

        {!result && !loading && (
          <>
            <div className="card">
              <div className="card-title">📷 Fotografiá tus ingredientes disponibles</div>
              {!image ? (
                <div
                  className={`upload-zone ${dragOver ? "drag" : ""}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                  onClick={() => fileRef.current?.click()}
                >
                  <input key={inputKey} ref={fileRef} type="file" accept="image/*" capture="environment"
                    onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
                    style={{ display: 'none' }} />
                  <div className="upload-icon-wrap">📷</div>
                  <div className="upload-title">Fotografiá o subí la foto de tus ingredientes</div>
                  <div className="upload-sub">Desde la heladera, alacena o donde los tengas</div>
                  <div className="upload-formats">JPG · PNG · HEIC · WEBP</div>
                </div>
              ) : (
                <div className="preview-wrap">
                  <img src={image} alt="Ingredientes" />
                  <div className="preview-bar">
                    <span className="preview-label">✅ Foto cargada</span>
                    <button className="btn-change" onClick={reset}>Cambiar</button>
                  </div>
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-title">⚙️ Seleccioná tus preferencias</div>
              <div className="prefs-grid">
                <div className="pref-group">
                  <label>🍽️ Tipo de comida</label>
                  <select value={tipoComida} onChange={(e) => setTipoComida(e.target.value)}>
                    <option value="">Cualquiera</option>
                    {TIPOS_COMIDA.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="pref-group">
                  <label>👥 Cantidad de personas</label>
                  <select value={personas} onChange={(e) => setPersonas(e.target.value)}>
                    <option value="">Sin especificar</option>
                    {PERSONAS_OPT.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="pref-group" style={{ gridColumn: "1 / -1" }}>
                  <label>⏱️ Tiempo disponible</label>
                  <select value={tiempo} onChange={(e) => setTiempo(e.target.value)}>
                    <option value="">Sin preferencia</option>
                    {TIEMPO_OPT.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="pref-group full">
                  <label>🥗 Preferencias dietarias (opcional)</label>
                  <div className="dieta-options">
                    {DIETA_OPT.map((d) => (
                      <label key={d} className={`dieta-chip ${dieta.includes(d) ? "active" : ""}`}
                        onClick={(e) => { e.preventDefault(); toggleDieta(d); }}>
                        <input type="checkbox" checked={dieta.includes(d)} readOnly />
                        {d}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {image && (
              <button className="btn-analyze" onClick={analyze} disabled={loading || !puedeConsultar}>
                ✨ &nbsp; {!puedeConsultar ? "Límite diario alcanzado" : "Generar mis 3 recetas"}
              </button>
            )}

            {error && <div className="error-box" style={{ marginTop: 16 }}>⚠️ {error}</div>}
          </>
        )}

        {loading && (
          <div className="card loading-wrap">
            <div className="loading-spinner" />
            <div className="loading-title">Analizando tus ingredientes...</div>
            <div className="loading-sub">Estamos creando tus recetas personalizadas, un momento...</div>
          </div>
        )}

        {result && (
          <div>
            {result.ingredientesDetectados && (
              <div className="detected-box">
                <div className="detected-label">🔍 Ingredientes detectados</div>
                <div className="detected-text">{result.ingredientesDetectados}</div>
              </div>
            )}
            <div className="results-title">Tus 3 recetas de hoy</div>
            {result.recetas?.map((r, i) => (
              <div key={i} className="recipe-card">
                <div className="recipe-header">
                  <div className="recipe-emoji">{r.emoji}</div>
                  <div className="recipe-name">{r.nombre}</div>
                  <div className="recipe-meta">
                    <span className="meta-tag">⏱ {r.tiempo}</span>
                    <span className="meta-tag">📊 {r.dificultad}</span>
                    <span className="meta-tag">👥 {r.porciones}</span>
                  </div>
                </div>
                <div className="recipe-body">
                  <div className="section-label">Ingredientes</div>
                  <ul className="ingredientes-list">
                    {r.ingredientes?.map((ing, j) => <li key={j}>{ing}</li>)}
                  </ul>
                  {r.beneficios?.length > 0 && (
                    <>
                      <div className="section-label" style={{color:'var(--green)'}}>✨ Beneficios</div>
                      <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:24}}>
                        {r.beneficios.map((b,j) => <span key={j} style={{background:'var(--green-bg)',border:'1px solid var(--green-bd)',color:'var(--green)',padding:'4px 12px',borderRadius:20,fontSize:13}}>{b}</span>)}
                      </div>
                    </>
                  )}
                  <div className="section-label">Preparación</div>
                  <ol className="pasos-list">
                    {r.pasos?.map((paso, j) => (
                      <li key={j} className="paso-item">
                        <span className="paso-num">{j + 1}</span>
                        <span className="paso-text">{paso}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
            <button className="btn-reset" onClick={reset}>← Hacer otra consulta</button>
          </div>
        )}
      </div>
    </>
  );
}