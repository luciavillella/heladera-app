export async function POST(request) {
  try {
    const body = await request.json();
    const { modo, imageBase64, mediaType, ingredientesEditados, tipoComida, personas, dieta, tiempo } = body;

    if (modo === "detectar") {
      if (!imageBase64) {
        return Response.json({ error: "No se recibió imagen" }, { status: 400 });
      }

      // Verificar tamaño de imagen (máximo ~4MB en base64)
      if (imageBase64.length > 5_500_000) {
        return Response.json({ error: "La imagen es muy grande. Por favor usá una foto más pequeña." }, { status: 400 });
      }

      let groqResponse;
      try {
        groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            max_tokens: 400,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:${mediaType || "image/jpeg"};base64,${imageBase64}`,
                    },
                  },
                  {
                    type: "text",
                    text: `Sos un asistente de cocina. Mirá esta imagen y listá ÚNICAMENTE los alimentos y ingredientes comestibles que ves. 

IGNORÁ absolutamente todo lo que no sea comida: botellas, envases, recipientes, bolsas, cajas, tapas, etiquetas, bebidas en botella, utensilios, y cualquier objeto no comestible.

INCLUÍ solo: verduras, frutas, carnes, lácteos, huevos, granos, legumbres, condimentos sin envase, y alimentos visibles sin empaque.

Respondé ÚNICAMENTE con los nombres de los alimentos separados por comas, en español, sin cantidades ni descripciones. Ejemplo: "tomates, queso, huevos, cebolla, zanahoria, pechuga de pollo"`,
                  },
                ],
              },
            ],
          }),
        });
      } catch (fetchError) {
        return Response.json({ error: "No se pudo conectar con el servicio. Intentá de nuevo." }, { status: 500 });
      }

      let data;
      try {
        data = await groqResponse.json();
      } catch {
        return Response.json({ error: "Error al procesar la respuesta del servicio. Intentá de nuevo." }, { status: 500 });
      }

      if (!groqResponse.ok) {
        const errorMsg = data?.error?.message || "";
        if (errorMsg.toLowerCase().includes("rate limit") || groqResponse.status === 429) {
          return Response.json({ error: "Estamos con mucha demanda en este momento, intentá de nuevo en unos segundos 🙏" }, { status: 429 });
        }
        if (groqResponse.status === 413 || errorMsg.toLowerCase().includes("too large")) {
          return Response.json({ error: "La imagen es muy grande. Por favor usá una foto más pequeña." }, { status: 400 });
        }
        return Response.json({ error: "Error al analizar la imagen. Intentá de nuevo." }, { status: 500 });
      }

      const ingredientes = data.choices?.[0]?.message?.content?.trim() || "";
      if (!ingredientes) {
        return Response.json({ error: "No se pudieron detectar ingredientes. Intentá con otra foto." }, { status: 500 });
      }
      return Response.json({ ingredientesDetectados: ingredientes });
    }

    if (modo === "recetas") {
      if (!ingredientesEditados) {
        return Response.json({ error: "No se recibieron ingredientes" }, { status: 400 });
      }

      const preferencias = [];
      if (tipoComida) preferencias.push(`Tipo de comida: ${tipoComida}`);
      if (personas) preferencias.push(`Cantidad de personas: ${personas}`);
      if (dieta && dieta.length > 0) preferencias.push(`Preferencias dietarias: ${dieta.join(", ")}`);
      if (tiempo) preferencias.push(`Tiempo disponible: ${tiempo}`);
      const prefText = preferencias.length > 0
        ? `\n\nPreferencias del usuario:\n${preferencias.join("\n")}`
        : "";

      const tiempoIndicado = tiempo || "sin límite de tiempo";

      const prompt = `Sos un chef latinoamericano creativo con años de experiencia en cocina casera y de autor. Tu especialidad es transformar ingredientes simples en platos sorprendentes, sabrosos y originales inspirados en la cocina de Argentina, México, Perú, Colombia y el resto de Latinoamérica.

Ingredientes disponibles: ${ingredientesEditados}
REGLA ABSOLUTA: Solo podés usar los ingredientes de esa lista. No podés agregar ningún otro ingrediente que no esté en la lista. Los únicos extras permitidos son sal, pimienta negra y aceite. Si una receta requiere algo que no está en la lista, no la hagas.
Tiempo disponible: ${tiempoIndicado}${prefText}

Tu tarea es crear exactamente 3 recetas que cumplan con estas reglas:

NOMBRES: Creativos, apetitosos y evocadores. Nada genérico. En vez de "Arroz con pollo" decí "Arroz cremoso al limón con pollo dorado y hierbas". El nombre debe dar ganas de comerlo.

VARIEDAD: Las 3 recetas deben ser técnicamente distintas entre sí (una salteada, una horneada, una cruda o fría, por ejemplo). Explorá distintas texturas y temperaturas.

CREATIVIDAD: Buscá combinaciones de sabores que sorprendan pero que funcionen. Inspirate en recetas latinoamericanas tradicionales o de autor. Podés hacer versiones originales de clásicos.

PASOS: Cada paso debe ser detallado y útil para alguien cocinando en casa. Incluí: técnica exacta, tiempo de cocción, temperatura si aplica, punto de cocción (dorado, al dente, cremoso), y algún consejo de chef. Cada paso debe tener al menos 2 oraciones. Ajustá la cantidad de pasos al tiempo disponible: si el tiempo es corto, menos pasos y técnicas rápidas; si hay más tiempo, podés desarrollar más.

INGREDIENTES: Listá cada ingrediente con su cantidad aproximada para las porciones indicadas.

BENEFICIOS: 2 o 3 beneficios nutricionales concretos y simples de cada receta.

Respondé SOLO con este JSON exacto, sin texto extra, sin markdown, sin emojis dentro de los textos de ingredientes o pasos:
{"recetas":[{"nombre":"nombre creativo y apetitoso","emoji":"🍳","tiempo":"X min","dificultad":"Fácil/Media/Difícil","porciones":"X personas","ingredientes":["ingrediente con cantidad","ingrediente con cantidad"],"pasos":["Paso 1 detallado con técnica y tiempo. Consejo de chef incluido.","Paso 2 igual de detallado."],"beneficios":["beneficio concreto 1","beneficio concreto 2"]}]}`;

      let groqResponse;
      try {
        groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            max_tokens: 3000,
            messages: [{ role: "user", content: prompt }],
          }),
        });
      } catch (fetchError) {
        return Response.json({ error: "No se pudo conectar con el servicio. Intentá de nuevo." }, { status: 500 });
      }

      let data;
      try {
        data = await groqResponse.json();
      } catch {
        return Response.json({ error: "Error al procesar la respuesta del servicio. Intentá de nuevo." }, { status: 500 });
      }

      if (!groqResponse.ok) {
        const errorMsg = data?.error?.message || "";
        if (errorMsg.toLowerCase().includes("rate limit") || groqResponse.status === 429) {
          return Response.json({ error: "Estamos con mucha demanda en este momento, intentá de nuevo en unos segundos 🙏" }, { status: 429 });
        }
        return Response.json({ error: "Error al generar recetas. Intentá de nuevo." }, { status: 500 });
      }

      const text = data.choices?.[0]?.message?.content || "";
      const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return Response.json({ error: "No se pudo generar las recetas. Intentá de nuevo." }, { status: 500 });
      }

      let parsed;
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch {
        return Response.json({ error: "No se pudo procesar las recetas. Intentá de nuevo." }, { status: 500 });
      }

      return Response.json(parsed);
    }

    return Response.json({ error: "Modo no válido" }, { status: 400 });

  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Algo salió mal. Intentá de nuevo." }, { status: 500 });
  }
}
