"use client";

export default function Offline() {
  return (
    <div style={{
      fontFamily:"'Outfit', sans-serif",
      minHeight:"100vh",
      background:"#F5F0E8",
      display:"flex",
      flexDirection:"column",
      alignItems:"center",
      justifyContent:"center",
      padding:"24px",
      textAlign:"center"
    }}>
      <img src="/logo.portal.png" alt="Que Cocino Today" style={{width:160, maxWidth:"70%", marginBottom:32}} />
      
      <div style={{fontSize:48, marginBottom:16}}>📵</div>
      
      <h1 style={{
        fontFamily:"'Georgia', serif",
        fontSize:24,
        fontWeight:600,
        color:"#1E1A14",
        marginBottom:12
      }}>Sin conexión</h1>
      
      <p style={{
        fontSize:15,
        color:"#7A7060",
        lineHeight:1.6,
        maxWidth:300,
        marginBottom:32
      }}>
        Necesitás conexión a internet para usar Que Cocino Today. Verificá tu conexión y volvé a intentarlo.
      </p>

      <button
        onClick={() => window.location.reload()}
        style={{
          padding:"14px 28px",
          background:"linear-gradient(135deg, #B85C2A, #D4884E)",
          color:"white",
          border:"none",
          borderRadius:12,
          fontFamily:"'Outfit', sans-serif",
          fontSize:15,
          fontWeight:600,
          cursor:"pointer",
          boxShadow:"0 4px 16px rgba(184,92,42,0.3)"
        }}>
        🔄 Reintentar
      </button>

      <p style={{fontSize:12, color:"#B85C2A", marginTop:32}}>app.quecocino.today</p>
    </div>
  );
}
