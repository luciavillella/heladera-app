"use client";

export default function Privacy() {
  return (
    <div style={{fontFamily:"'Georgia', serif", maxWidth:720, margin:"0 auto", padding:"48px 24px 80px", background:"#F5F0E8", minHeight:"100vh", color:"#1E1A14"}}>
      <div style={{background:"#FDFAF4", borderRadius:20, padding:"48px 40px", boxShadow:"0 2px 12px rgba(30,26,20,0.08)", border:"1px solid #E2D9C8"}}>
        
        <div style={{textAlign:"center", marginBottom:40}}>
          <img src="/logo.portal.png" alt="Que Cocino Today" style={{width:200, maxWidth:"80%", marginBottom:24}} />
          <h1 style={{fontFamily:"'Georgia', serif", fontSize:28, fontWeight:600, color:"#1E1A14", marginBottom:8}}>Política de Privacidad</h1>
          <p style={{fontSize:14, color:"#7A7060"}}>QueCocino.Today — app.quecocino.today</p>
        </div>

        <p style={{fontSize:14, color:"#7A7060", marginBottom:32, textAlign:"center"}}>
          En QueCocino.Today valoramos y respetamos la privacidad de nuestros usuarios. Esta Política de Privacidad explica qué información recopilamos, cómo la utilizamos y qué opciones tienen los usuarios respecto a sus datos.
        </p>
        <p style={{fontSize:14, color:"#7A7060", marginBottom:40, textAlign:"center"}}>
          Al utilizar la aplicación QueCocino.Today, aceptás las prácticas descritas en esta política.
        </p>

        {[
          {
            num: "1", title: "Información que recopilamos",
            content: (
              <>
                <p style={{fontWeight:600, marginBottom:8}}>Información proporcionada por el usuario</p>
                <p>Cuando utilizás la aplicación, podemos recopilar información que proporcionás voluntariamente, como:</p>
                <ul>
                  <li>Dirección de correo electrónico</li>
                  <li>Información de cuenta</li>
                  <li>Preferencias dentro de la aplicación</li>
                </ul>
                <p>Esta información se utiliza únicamente para ofrecer y mejorar el servicio.</p>
                <p style={{fontWeight:600, margin:"16px 0 8px"}}>Información recopilada automáticamente</p>
                <p>Cuando utilizás la aplicación, podemos recopilar automáticamente cierta información técnica, incluyendo:</p>
                <ul>
                  <li>Tipo de dispositivo</li>
                  <li>Sistema operativo</li>
                  <li>Datos de uso dentro de la aplicación</li>
                  <li>Dirección IP aproximada</li>
                  <li>Datos de rendimiento y errores</li>
                </ul>
                <p>Esta información se utiliza para mejorar la estabilidad y funcionamiento de la aplicación.</p>
              </>
            )
          },
          {
            num: "2", title: "Suscripciones y pagos",
            content: (
              <>
                <p>La aplicación QueCocino.Today puede ofrecer acceso a funciones premium mediante una suscripción.</p>
                <ul>
                  <li>Las suscripciones se gestionan y procesan fuera de la aplicación, a través del sitio web oficial u otras plataformas externas seguras.</li>
                  <li>Los pagos se procesan mediante proveedores de pago externos confiables (por ejemplo, Stripe u otros procesadores similares).</li>
                  <li>La aplicación no almacena información completa de tarjetas de crédito ni datos financieros sensibles en sus servidores.</li>
                  <li>Estos proveedores de pago pueden recopilar la información necesaria para procesar las transacciones de acuerdo con sus propias políticas de privacidad.</li>
                </ul>
                <p>Una vez que un usuario adquiere una suscripción, puede acceder a las funciones premium utilizando la misma cuenta registrada en la app.</p>
              </>
            )
          },
          {
            num: "3", title: "Uso de la información",
            content: (
              <>
                <p>La información recopilada puede utilizarse para:</p>
                <ul>
                  <li>Proporcionar acceso a las funcionalidades de la aplicación</li>
                  <li>Gestionar cuentas de usuario</li>
                  <li>Procesar suscripciones</li>
                  <li>Mejorar la experiencia del usuario</li>
                  <li>Analizar el uso de la aplicación</li>
                  <li>Detectar errores o problemas técnicos</li>
                  <li>Enviar comunicaciones relacionadas con el servicio</li>
                </ul>
              </>
            )
          },
          {
            num: "4", title: "Compartición de información",
            content: (
              <>
                <p>No vendemos ni alquilamos información personal de los usuarios. Podemos compartir información únicamente en los siguientes casos:</p>
                <ul>
                  <li>Con proveedores de servicios necesarios para operar la aplicación (servicios de pago, alojamiento o análisis)</li>
                  <li>Cuando sea requerido por ley</li>
                  <li>Para proteger los derechos, seguridad o integridad de la aplicación y sus usuarios</li>
                </ul>
              </>
            )
          },
          {
            num: "5", title: "Seguridad de los datos",
            content: <p>Tomamos medidas razonables para proteger la información de los usuarios contra accesos no autorizados, alteraciones o divulgación indebida. Sin embargo, ningún sistema de transmisión o almacenamiento de datos es completamente seguro.</p>
          },
          {
            num: "6", title: "Conservación y eliminación de datos",
            content: (
              <>
                <p>La información se conserva únicamente durante el tiempo necesario para proporcionar el servicio y cumplir con obligaciones legales.</p>
                <p style={{marginTop:8}}>Los usuarios pueden solicitar la eliminación de su cuenta y todos sus datos asociados directamente desde la aplicación, utilizando la opción <strong>"Eliminar mi cuenta"</strong> disponible en la pantalla principal. La eliminación es inmediata e irreversible.</p>
              </>
            )
          },
          {
            num: "7", title: "Derechos del usuario",
            content: (
              <>
                <p>Dependiendo de la jurisdicción, los usuarios pueden tener derecho a:</p>
                <ul>
                  <li>Solicitar acceso a sus datos</li>
                  <li>Solicitar corrección de información</li>
                  <li>Solicitar eliminación de datos personales</li>
                </ul>
                <p>Para ejercer estos derechos, los usuarios pueden contactarnos mediante los datos indicados más abajo.</p>
              </>
            )
          },
          {
            num: "8", title: "Privacidad de menores",
            content: (
              <>
                <p>La aplicación no está dirigida a menores de 13 años. No recopilamos intencionalmente información personal de menores.</p>
                <p style={{marginTop:8}}>Si un padre o tutor cree que un menor ha proporcionado información personal, puede contactarnos para solicitar su eliminación.</p>
              </>
            )
          },
          {
            num: "9", title: "Cambios en esta política",
            content: <p>Podemos actualizar esta Política de Privacidad ocasionalmente. Las actualizaciones se publicarán en esta misma página con la fecha correspondiente.</p>
          },
          {
            num: "10", title: "Contacto",
            content: (
              <>
                <p>Si tenés preguntas sobre esta Política de Privacidad, podés contactarnos en:</p>
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
