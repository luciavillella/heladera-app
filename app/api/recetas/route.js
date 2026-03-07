export async function POST(request) {
  try {
    const body = await request.json();
    const { modo, imageBase64, mediaType, ingredientesEditados, tipoComida, personas, dieta, tiempo } = body;

    if (modo === "detectar") {
      if (!imageBase64) {
        return Response.json({ error: "No se recibió imagen" }, { status: 400 });
      }

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          max_tokens: 300,
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
                  text: `Analizá esta imagen e identificá todos los ingredientes alimenticios visibles. Respondé SOLO con una lista separada por comas, sin texto extra. Ejemplo: "tomates, queso, huevos, cebolla"`,
                },
              ],
            },
          ],
        }),
      });

      const data = await response.json();
      console.log("GROQ detectar response:", JSON.stringify(data));

      if (!response.ok) {
        return Response.json({ error: data.error?.message || "Error de Groq" }, { status: 500 });
      }

      const ingredientes = data.choices?.[0]?.message?.content?.trim() || "";
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
        ? `\n\nTené en cuenta estas preferencias:\n${preferencias.join("\n")}`
        : "";

      const prompt = `Sos un chef creativo y apasionado de cocina casera. Tengo estos ingredientes disponibles: ${ingredientesEditados}.

Creá exactamente 3 recetas ORIGINALES y APETITOSAS usando principalmente esos ingredientes. Solo podés asumir sal, pimienta y aceite como extras.

REGLAS IMPORTANTES:
- Los nombres deben ser creativos, evocadores y apetitosos (ej: "Tortilla dorada con queso derretido" en vez de "Tortilla de huevo")
- Cada paso debe ser DETALLADO y ESPECÍFICO: incluí tiempos de cocción, temperatura, texturas esperadas, trucos del chef. Mínimo 2 oraciones por paso.
- Las recetas deben ser variadas entre sí: si una es salteada, que otra sea al horno o cruda, etc.
- Pensá en combinaciones de sabores interesantes, no solo las más obvias
- Para cada receta agregá 2 o 3 beneficios nutricionales simples y concretos${prefText}

Respondé SOLO con este JSON exacto, sin texto extra, sin markdown, sin emojis en los textos de ingredientes o pasos:
{"recetas":[{"nombre":"nombre creativo","emoji":"🍳","tiempo":"20 min","dificultad":"Fácil","porciones":"2","ingredientes":["item1 con cantidad","item2 con cantidad"],"pasos":["Paso detallado con técnica y tiempo de cocción. Descripción de textura o color esperado.","Segundo paso igual de detallado."],"beneficios":["beneficio concreto 1","beneficio concreto 2"]}]}`;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          max_tokens: 2500,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      console.log("GROQ recetas response:", JSON.stringify(data).slice(0, 500));

      if (!response.ok) {
        return Response.json({ error: data.error?.message || "Error de Groq" }, { status: 500 });
      }

      const text = data.choices?.[0]?.message?.content || "";
      const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return Response.json({ error: "No se pudo parsear la respuesta" }, { status: 500 });
      }
      const parsed = JSON.parse(jsonMatch[0]);
      return Response.json(parsed);
    }

    return Response.json({ error: "Modo no válido" }, { status: 400 });

  } catch (error) {
    console.error("Error:", error);
    const mensaje = error.message?.includes('rate_limit')
      ? "Estamos con mucha demanda en este momento, intentá de nuevo en unos segundos 🙏"
      : "Algo salió mal: " + error.message;
    return Response.json({ error: mensaje }, { status: 500 });
  }
}
