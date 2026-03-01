"use client";
import { useState, useEffect } from "react";
import { createClient } from "../lib/supabase";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [ready, setReady] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token") || "";

    if (access_token) {
      supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
        if (!error) {
          setReady(true);
        } else {
          setMsg({ type: "error", text: "El enlace expiró o no es válido. Pedí uno nuevo." });
        }
      });
    } else {
      setMsg({ type: "error", text: "No se encontró el enlace de recuperación. Pedí uno nuevo." });
    }
  }, []);

  const handleReset = async () => {
    if (password !== confirm) {
      setMsg({ type: "error", text: "Las contraseñas no coinciden." });
      return;
    }
    if (password.length < 6) {
      setMsg({ type: "error", text: "La contraseña debe tener al menos 6 caracteres." });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMsg({ type: "error", text: error.message });
    } else {
      setMsg({ type: "success", text: "¡Contraseña actualizada! Ya podés ingresar." });
      setTimeout(() => window.location.href = "/", 2000);
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#F5F0E8',padding:24}}>
      <div style={{background:'white',borderRadius:16,padding:32,width:'100%',maxWidth:400,boxShadow:'0 4px 24px rgba(0,0,0,0.08)'}}>
        <img src="/logo.portal.png" alt="Que Cocino Today" style={{width:200,maxWidth:'100%',display:'block',margin:'0 auto 24px'}} />
        <h2 style={{fontFamily:'serif',fontSize:22,marginBottom:8,textAlign:'center'}}>Nueva contraseña</h2>
        <p style={{fontSize:14,color:'#7A7060',textAlign:'center',marginBottom:24}}>Ingresá tu nueva contraseña</p>

        {!ready && !msg && (
          <div style={{textAlign:'center',color:'#7A7060',fontSize:14,marginBottom:16}}>
            Verificando enlace...
          </div>
        )}

        {ready && (
          <>
            <div style={{marginBottom:16}}>
              <label style={{fontSize:13,fontWeight:600,display:'block',marginBottom:6}}>Nueva contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{width:'100%',padding:'12px 14px',border:'1.5px solid #E2D9C8',borderRadius:10,fontSize:14,boxSizing:'border-box'}} />
            </div>
            <div style={{marginBottom:20}}>
              <label style={{fontSize:13,fontWeight:600,display:'block',marginBottom:6}}>Confirmar contraseña</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="••••••••"
                style={{width:'100%',padding:'12px 14px',border:'1.5px solid #E2D9C8',borderRadius:10,fontSize:14,boxSizing:'border-box'}} />
            </div>
            <button onClick={handleReset} disabled={loading}
              style={{width:'100%',padding:'14px',background:'linear-gradient(135deg,#B85C2A,#D4884E)',color:'white',border:'none',borderRadius:12,fontSize:15,fontWeight:600,cursor:'pointer'}}>
              {loading ? "Guardando..." : "Guardar nueva contraseña"}
            </button>
          </>
        )}

        {msg && (
          <div style={{marginTop:16,padding:'12px 16px',borderRadius:10,background: msg.type === 'error' ? '#FEF2F2' : '#EBF3EE',color: msg.type === 'error' ? '#DC2626' : '#4A7C5F',fontSize:13}}>
            {msg.text}
          </div>
        )}
      </div>
    </div>
  );
}
