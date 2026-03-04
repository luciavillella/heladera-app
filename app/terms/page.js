"use client";

export default function Terms() {
  return (
    <div style={{fontFamily:"'Georgia', serif", maxWidth:720, margin:"0 auto", padding:"48px 24px 80px", background:"#F5F0E8", minHeight:"100vh", color:"#1E1A14"}}>
      <div style={{background:"#FDFAF4", borderRadius:20, padding:"48px 40px", boxShadow:"0 2px 12px rgba(30,26,20,0.08)", border:"1px solid #E2D9C8"}}>
        
        <div style={{textAlign:"center", marginBottom:40}}>
          <img src="/logo.portal.png" alt="Que Cocino Today" style={{width:200, maxWidth:"80%", marginBottom:24}} />
          <h1 style={{fontFamily:"'Georgia', serif", fontSize:28, fontWeight:600, color:"#1E1A14", marginBottom:8}}>Términos y Condiciones</h1>
          <p style={{fontSize:14, color:"#7A7060"}}>QueCocino.Today — app.quecocino.today</p>
          <p style={{fontSize:13, color:"#7A7060", marginTop:4}}>Última actualización: marzo 2026</p>
        </div>

        <p style={{fontSize:14, color:"#7A7060", marginBottom:40, textAlign:"center", lineHeight:1.8}}>
          Al utilizar la aplicación QueCocino.Today, aceptás los presentes Términos y Condiciones. Te recomendamos leerlos detenidamente antes de usar el servicio.
        </p>

        {[
          {
            num: "1", title: "Descripción del servicio",
            content: (
              <p>QueCocino.Today es una aplicación que permite a los usuarios fotografiar ingredientes disponibles y recibir sugerencias de recetas personalizadas. El servicio incluye una versión de prueba gratuita y una versión premium con acceso ilimitado.</p>
            )
          },
          {
            num: "2", title: "Registro y cuenta",
            content: (
              <>
                <p>Para utilizar la aplicación es necesario crear una cuenta con una dirección de correo electrónico válida y una contraseña.</p>
                <ul style={{marginTop:8, lineHeight:2}}>
                  <li>Sos responsable de mantener la confidencialidad de tus credenciales de acceso.</li>
                  <li>No podés compartir tu cuenta con otras personas.</li>
                  <li>Debés notificarnos de inmediato si sospechás un acceso no autorizado a tu cuenta.</li>
                </ul>
              </>
            )
          },
          {
            num: "3", title: "Período de prueba",
            content: (
              <>
                <p>Los nuevos usuarios tienen acceso a un período de prueba gratuito de 7 días con un límite de 2 consultas por día.</p>
                <ul style={{marginTop:8, lineHeight:2}}>
                  <li>El período de prueba comienza desde el momento del registro.</li>
                  <li>Una vez vencido el período de prueba, se requiere una suscripción premium para continuar usando el servicio.</li>
                </ul>
              </>
            )
          },
          {
            num: "4", title: "Suscripción premium",
            content: (
              <>
                <p>La versión premium ofrece acceso ilimitado a todas las funciones de la aplicación mediante el pago de una suscripción mensual.</p>
                <ul style={{marginTop:8, lineHeight:2}}>
                  <li>El precio de la suscripción se indica en la página de pago al momento de contratar.</li>
                  <li>Los pagos se procesan a través de plataformas de pago externas seguras.</li>
                  <li>Para cancelar la suscripción, el usuario puede hacerlo a través del enlace disponible en la aplicación.</li>
                  <li>No se realizan reembolsos por períodos ya facturados.</li>
                </ul>
              </>
            )
          },
          {
            num: "5", title: "Uso aceptable",
            content: (
              <>
                <p>Al usar QueCocino.Today, aceptás no:</p>
                <ul style={{marginTop:8, lineHeight:2}}>
                  <li>Usar el servicio para fines ilegales o no autorizados.</li>
                  <li>Intentar acceder a sistemas o datos que no te pertenecen.</li>
                  <li>Compartir tu cuenta con terceros.</li>
                  <li>Reproducir, copiar o distribuir el contenido de la aplicación sin autorización.</li>
                  <li>Usar herramientas automatizadas para acceder al servicio de forma masiva.</li>
                </ul>
              </>
            )
          },
          {
            num: "6", title: "Contenido generado",
            content: (
              <>
                <p>Las recetas sugeridas por la aplicación son generadas automáticamente con fines informativos y de entretenimiento.</p>
                <ul style={{marginTop:8, lineHeight:2}}>
                  <li>No garantizamos que las recetas sean adecuadas para todas las personas, especialmente aquellas con alergias, intolerancias o condiciones médicas específicas.</li>
                  <li>El usuario es responsable de verificar los ingredientes y adaptar las recetas según sus necesidades.</li>
                  <li>QueCocino.Today no se responsabiliza por daños derivados del uso de las recetas sugeridas.</li>
                </ul>
              </>
            )
          },
          {
            num: "7", title: "Propiedad intelectual",
            content: (
              <p>Todo el contenido de la aplicación, incluyendo diseño, textos, logotipos y funcionalidades, es propiedad de QueCocino.Today y está protegido por las leyes de propiedad intelectual aplicables. Queda prohibida su reproducción sin autorización expresa.</p>
            )
          },
          {
            num: "8", title: "Limitación de responsabilidad",
            content: (
              <>
                <p>QueCocino.Today no se responsabiliza por:</p>
                <ul style={{marginTop:8, lineHeight:2}}>
                  <li>Interrupciones temporales del servicio.</li>
                  <li>Pérdida de datos por causas ajenas a nuestra voluntad.</li>
                  <li>Daños indirectos derivados del uso o imposibilidad de uso de la aplicación.</li>
                </ul>
              </>
            )
          },
          {
            num: "9", title: "Modificaciones del servicio",
            content: (
              <p>Nos reservamos el derecho de modificar, suspender o discontinuar el servicio en cualquier momento, con o sin previo aviso. También podemos actualizar estos Términos y Condiciones. Las actualizaciones se publicarán en esta página con la fecha correspondiente.</p>
            )
          },
          {
            num: "10", title: "Eliminación de cuenta",
            content: (
              <p>El usuario puede eliminar su cuenta en cualquier momento desde la opción <strong>"Eliminar mi cuenta"</strong> disponible en la aplicación. La eliminación es inmediata e irreversible y conlleva la pérdida de todos los datos asociados a la cuenta.</p>
            )
          },
          {
            num: "11", title: "Legislación aplicable",
            content: (
              <p>Estos Términos y Condiciones se rigen por las leyes de la República Argentina. Cualquier disputa será resuelta ante los tribunales competentes de dicha jurisdicción.</p>
            )
          },
          {
            num: "12", title: "Contacto",
            content: (
              <>
                <p>Para consultas sobre estos Términos y Condiciones podés contactarnos en:</p>
                <p style={{marginTop:8}}><strong>Email:</strong> <a href="mailto:soporte@quecocino.today" style={{color:"#B85C2A"}}>soporte@quecocino.today</a></p>
                <p><strong>Web:</strong> <a href="https://app.quecocino.today" style={{color:"#B85C2A"}}>app.quecocino.today</a></p>
              </>
            )
          }
        ].map(section => (
          <div key={section.num} style={{marginBottom:32}}>
            <h2 style={{fontFamily:"'Georgia', serif", fontSize:18, fontWeight:600, color:"#B85C2A", marginBottom:12, paddingBottom:8, borderBottom:"1px solid #E2D9C8"}}>
              {section.num}. {section.title}
            </h2>
            <div style={{fontSize:14, lineHeight:1.8, color:"#1E1A14"}}>
              {section.content}
            </div>
          </div>
        ))}

        <div style={{textAlign:"center", marginTop:48, paddingTop:24, borderTop:"1px solid #E2D9C8"}}>
          <a href="/" style={{fontSize:13, color:"#B85C2A", textDecoration:"underline"}}>← Volver a la app</a>
        </div>
      </div>
    </div>
  );
}
