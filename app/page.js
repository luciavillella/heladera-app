"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useSupabaseClient } from "./lib/supabase";

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
    --pink:      #e05c8a;
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

  /* TABS */
  .tabs {
    display: flex; gap: 0; margin-bottom: 28px;
    border: 1.5px solid var(--border); border-radius: 14px; overflow: hidden;
  }
  .tab-btn {
    flex: 1; padding: 12px; font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 500; cursor: pointer;
    background: none; border: none; color: var(--muted); transition: all 0.2s;
  }
  .tab-btn.active { background: var(--accent); color: white; font-weight: 600; }

  /* FAVORITOS */
  .btn-fav {
    display: flex; align-items: center; gap: 8px;
    margin-top: 16px; padding: 10px 20px;
    background: none; border: 1.5px solid var(--border);
    border-radius: 10px; font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 500; color: var(--muted);
    cursor: pointer; transition: all 0.2s;
  }
  .btn-fav:hover { border-color: var(--pink); color: var(--pink); }
  .btn-fav.saved { border-color: var(--pink); color: var(--pink); background: rgba(224,92,138,0.06); }

  .empty-favs {
    text-align: center; padding: 48px 24px;
    color: var(--muted); font-size: 15px;
  }
  .empty-favs .emoji { font-size: 48px; margin-bottom: 16px; }

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

export default function HeladeraApp() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("recetas");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Analizando tus ingredientes...");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [ingredientesDetectados, setIngredientesDetectados] = useState(null);
  const [ingredientesEditados, setIngredientesEditados] = useState("");
  const [tipoComida, setTipoComida] = useState("");
  const [personas, setPersonas] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [dieta, setDieta] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [savedIds, setSavedIds] = useState({});
  const fileRef = useRef();
  const [inputKey, setInputKey] = useState(0);
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (user) {
      loadProfile(user.id);
      loadFavoritos(user.id);
    }
  }, [user]);

  const loadProfile = async (userId) => {
    await fetch('/api/crear-perfil', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId,
        email: user?.primaryEmailAddress?.emailAddress || "",
        nombre: user?.fullName || "",
      }),
    });
    const { data } = await supabase.from('user_profiles').select('*').eq('id', userId).single();
    setProfile(data);
  };

  const loadFavoritos = async (userId) => {
    const { data } = await supabase
      .from('favoritos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (data) {
      setFavoritos(data);
      const ids = {};
      data.forEach(f => { ids[f.nombre] = f.id; });
      setSavedIds(ids);
    }
  };

  const toggleFavorito = async (receta) => {
    if (!user) return;
    if (savedIds[receta.nombre]) {
      // Eliminar de favoritos
      await supabase.from('favoritos').delete().eq('id', savedIds[receta.nombre]);
      setSavedIds(prev => { const n = {...prev}; delete n[receta.nombre]; return n; });
      setFavoritos(prev => prev.filter(f => f.nombre !== receta.nombre));
    } else {
      // Agregar a favoritos
      const { data } = await supabase.from('favoritos').insert({
        user_id: user.id,
        nombre: receta.nombre,
        emoji: receta.emoji,
        tiempo: receta.tiempo,
        dificultad: receta.dificultad,
        porciones: receta.porciones,
        ingredientes: receta.ingredientes,
        pasos: receta.pasos,
        beneficios: receta.beneficios,
      }).select().single();
      if (data) {
        setSavedIds(prev => ({ ...prev, [receta.nombre]: data.id }));
        setFavoritos(prev => [data, ...prev]);
      }
    }
  };

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

  const detectarIngredientes = async () => {
    if (!imageFile || !puedeConsultar) return;
    setLoading(true); setLoadingMsg("Detectando ingredientes..."); setError(null);
    try {
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(",")[1]);
        r.onerror = () => rej(new Error("Error leyendo archivo"));
        r.readAsDataURL(imageFile);
      });
      const resp = await fetch("/api/recetas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modo: "detectar", imageBase64: base64, mediaType: imageFile.type }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Error del servidor");
      setIngredientesDetectados(data.ingredientesDetectados);
      setIngredientesEditados(data.ingredientesDetectados);
    } catch (err) {
      setError("Algo salió mal: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generarRecetas = async () => {
    if (!ingredientesEditados || !puedeConsultar) return;
    setLoading(true); setLoadingMsg("Preparando tus recetas..."); setError(null);
    try {
      if (!isPremium) {
        const today = new Date().toISOString().split('T')[0];
        const nuevasConsultas = profile?.ultima_consulta === today ? consultasHoy + 1 : 1;
        await supabase.from('user_profiles').update({
          consultas_hoy: nuevasConsultas,
          ultima_consulta: today
        }).eq('id', user.id);
        setProfile(p => ({ ...p, consultas_hoy: nuevasConsultas, ultima_consulta: today }));
      }
      const resp = await fetch("/api/recetas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modo: "recetas", ingredientesEditados, tipoComida, personas, dieta, tiempo }),
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

  const reset = () => {
    setImage(null); setImageFile(null); setResult(null); setError(null);
    setIngredientesDetectados(null); setIngredientesEditados("");
    setInputKey(k => k + 1);
  };

  const RecetaCard = ({ r, showFav = true }) => (
    <div className="recipe-card">
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
          {(r.ingredientes || []).map((ing, j) => <li key={j}>{ing}</li>)}
        </ul>
        {(r.beneficios?.length > 0) && (
          <>
            <div className="section-label" style={{ color: 'var(--green)' }}>✨ Beneficios</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {r.beneficios.map((b, j) => <span key={j} style={{ background: 'var(--green-bg)', border: '1px solid var(--green-bd)', color: 'var(--green)', padding: '4px 12px', borderRadius: 20, fontSize: 13 }}>{b}</span>)}
            </div>
          </>
        )}
        <div className="section-label">Preparación</div>
        <ol className="pasos-list">
          {(r.pasos || []).map((paso, j) => (
            <li key={j} className="paso-item">
              <span className="paso-num">{j + 1}</span>
              <span className="paso-text">{paso}</span>
            </li>
          ))}
        </ol>
        {showFav && (
          <button
            className={`btn-fav ${savedIds[r.nombre] ? 'saved' : ''}`}
            onClick={() => toggleFavorito(r)}
          >
            {savedIds[r.nombre] ? '❤️ Guardada' : '🤍 Guardar receta'}
          </button>
        )}
      </div>
    </div>
  );

  if (!isLoaded) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #E2D9C8', borderTopColor: '#B85C2A', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  if (profile && !isPremium && !trialActive) return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <img src="/logo.portal.png" alt="Que Cocino Today" style={{ width: 220, maxWidth: '80%' }} />
        </div>
        <div style={{ background: '#FDFAF4', border: '1px solid #E2D9C8', borderRadius: 24, padding: 40, width: '100%', maxWidth: 420, boxShadow: '0 8px 40px rgba(30,26,20,0.13)', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏰</div>
          <div style={{ fontFamily: "'Lora', serif", fontSize: 26, fontWeight: 600, marginBottom: 8 }}>Tu período de prueba terminó</div>
          <div style={{ fontSize: 14, color: '#7A7060', marginBottom: 24 }}>Activá tu Versión Premium y seguí cocinando con recetas ilimitadas</div>
          <a href="https://recetas.quecocino.today/membresia"
            style={{ display: 'block', padding: '14px', background: 'linear-gradient(135deg,#B85C2A,#D4884E)', color: 'white', borderRadius: '12px', textDecoration: 'none', fontWeight: 600, fontSize: 15, marginBottom: 12 }}>
            Activar Versión Premium 🚀
          </a>
          <button onClick={() => signOut()} style={{ background: 'none', border: '1.5px solid #E2D9C8', borderRadius: 12, padding: '10px 24px', fontSize: 14, color: '#7A7060', cursor: 'pointer', marginTop: 8 }}>
            Salir
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="page">
        <div className="topbar">
          <div className="topbar-user">Hola, <span>{user?.primaryEmailAddress?.emailAddress || user?.fullName}</span> 👋</div>
          <button className="btn-logout" onClick={() => signOut()}>Salir</button>
        </div>

        {!isPremium && trialActive && (
          <div style={{ background: 'var(--gold-bg)', border: '1px solid var(--gold-bd)', borderRadius: 12, padding: '10px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>🔥 Consultas hoy: {consultasHoy}/2</span>
            <span style={{ fontSize: 13, color: 'var(--gold)' }}>⏳ {diasRestantes} días de prueba restantes</span>
            <a href="https://recetas.quecocino.today/membresia" style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, textDecoration: 'underline' }}>Activar Versión Premium →</a>
          </div>
        )}

        {!isPremium && trialActive && consultasHoy >= 2 && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '16px 20px', marginBottom: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: '#DC2626', fontWeight: 600, marginBottom: 8 }}>Usaste tus 2 consultas de hoy 😅</div>
            <div style={{ fontSize: 13, color: '#DC2626', marginBottom: 12 }}>Volvé mañana o activá tu Versión Premium para consultas ilimitadas</div>
            <a href="https://recetas.quecocino.today/membresia" style={{ display: 'inline-block', padding: '10px 20px', background: 'linear-gradient(135deg,#B85C2A,#D4884E)', color: 'white', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: 13 }}>
              Activar Versión Premium 🚀
            </a>
          </div>
        )}

        <div className="header">
          <div style={{ marginBottom: 20, textAlign: 'center' }}>
            <img src="/logo.portal.png" alt="Que Cocino Today" style={{ width: 300, maxWidth: '90%' }} />
          </div>
          <div className="header-tag">✦ Cocina simple, fácil, rápido y delicioso</div>
          <h1>Mostrame lo que tenés y te digo qué cocinar <em>AHORA</em></h1>
          <p>Sacá una foto a tus ingredientes, elegí tus preferencias y te sugerimos 3 recetas perfectas según lo que tenés.</p>
        </div>

        {/* TABS */}
        <div className="tabs">
          <button className={`tab-btn ${activeTab === 'recetas' ? 'active' : ''}`} onClick={() => { setActiveTab('recetas'); reset(); }}>
            🍳 Generar recetas
          </button>
          <button className={`tab-btn ${activeTab === 'favoritos' ? 'active' : ''}`} onClick={() => setActiveTab('favoritos')}>
            ❤️ Mis favoritas {favoritos.length > 0 && `(${favoritos.length})`}
          </button>
        </div>

        {/* TAB FAVORITOS */}
        {activeTab === 'favoritos' && (
          <div>
            {favoritos.length === 0 ? (
              <div className="empty-favs">
                <div className="emoji">🤍</div>
                <p>Todavía no guardaste ninguna receta.</p>
                <p style={{ fontSize: 13, marginTop: 8 }}>Generá recetas y tocá "Guardar receta" para verlas acá.</p>
              </div>
            ) : (
              <>
                <div className="results-title">Mis recetas favoritas</div>
                {favoritos.map((r, i) => <RecetaCard key={i} r={r} showFav={true} />)}
              </>
            )}
          </div>
        )}

        {/* TAB RECETAS */}
        {activeTab === 'recetas' && (
          <>
            {!result && !loading && !ingredientesDetectados && (
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

                {image && !ingredientesDetectados && (
                  <button className="btn-analyze" onClick={detectarIngredientes} disabled={loading || !puedeConsultar}>
                    ✨ &nbsp; {!puedeConsultar ? "Límite diario alcanzado" : "Analizar ingredientes"}
                  </button>
                )}

                {error && <div className="error-box" style={{ marginTop: 16 }}>⚠️ {error}</div>}
              </>
            )}

            {loading && (
              <div className="card loading-wrap">
                <div className="loading-spinner" />
                <div className="loading-title">{loadingMsg}</div>
                <div className="loading-sub">Un momento...</div>
              </div>
            )}

            {!loading && ingredientesDetectados && !result && (
              <div className="card">
                <div className="card-title">🔍 Ingredientes detectados — revisá y corregí si hace falta</div>
                <textarea
                  value={ingredientesEditados}
                  onChange={e => setIngredientesEditados(e.target.value)}
                  rows={4}
                  style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 14, fontFamily: 'Outfit, sans-serif', color: 'var(--text)', background: 'var(--bg)', boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.6 }}
                />
                <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8, marginBottom: 20 }}>
                  ✏️ Podés corregir ingredientes mal detectados o agregar los que falten.
                </p>
                <button className="btn-analyze" onClick={generarRecetas} disabled={loading || !puedeConsultar}>
                  ✨ &nbsp; {!puedeConsultar ? "Límite diario alcanzado" : "Mostrar mis 3 recetas"}
                </button>
              </div>
            )}

            {result && (
              <div>
                <div className="results-title">Tus 3 recetas de hoy</div>
                {result.recetas?.map((r, i) => <RecetaCard key={i} r={r} showFav={true} />)}
                <button className="btn-reset" onClick={reset}>← Hacer otra consulta</button>
              </div>
            )}
          </>
        )}

        {isPremium && (
          <div style={{ textAlign: 'center', marginTop: 48, paddingBottom: 16 }}>
            <a href="https://wa.link/6qd97a" target="_blank"
              style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'underline' }}>
              Cancelar Versión Premium
            </a>
          </div>
        )}
      </div>
    </>
  );
}
