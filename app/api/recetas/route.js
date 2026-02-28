import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  try {
    const body = await request.json();
    const { imageBase64, mediaType, tipoComida, personas, dieta, tiempo } = body;

    if (!imageBase64) {
      return Response.json({ error: "No se recibió imagen" }, { status: 400 });
    }

    const preferencias = [];
    if (tipoComida) preferencias.push(`Tipo de comida: ${tipoComida}`);
    if (personas) preferencias.push(`Cantidad de personas: ${personas}`);
    if (dieta && dieta.length > 0) preferencias.push(`Preferencias dietarias: ${dieta.join(", ")}`);
    if (tiempo) preferencias.push(`Tiempo disponible: ${tiempo}`);

    const prefText = preferencias.length > 0
      ? `\n\nTené en cuenta estas preferencias:\n${preferencias.join("\n")}`
      : "";

    const prompt = `Analizá esta imagen e identificá los ingredientes alimenticios visibles.
Generá exactamente 3 recetas usando EXCLUSIVAMENTE esos ingredientes. Solo podés asumir sal, pimienta y aceite. Para cada receta agregá 2 o 3 beneficios nutricionales simples como vitaminas, minerales o para qué es bueno ese plato, sin términos médicos ni promesas de salud.${prefText}

Respondé SOLO con este JSON, sin texto extra, sin markdown, sin emojis en los textos de ingredientes o pasos:
{"ingredientesDetectados":"lista de ingredientes","recetas":[{"nombre":"nombre","emoji":"🍳","tiempo":"20 min","dificultad":"Fácil","porciones":"2","ingredientes":["item1","item2"],"pasos":["paso1","paso2"],"beneficios":["beneficio1","beneficio2"]}]}`;

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType || "image/jpeg",
                data: imageBase64,
              },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
    });

    const text = response.content.map((b) => b.text || "").join("");
    const cleaned = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json({ error: "No se pudo parsear la respuesta" }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return Response.json(parsed);
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}