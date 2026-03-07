import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { accion, userId, receta, favoritoId } = body;

    if (!userId) return Response.json({ error: "Sin userId" }, { status: 400 });

    if (accion === "cargar") {
      const { data, error } = await supabase
        .from('favoritos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return Response.json({ favoritos: data });
    }

    if (accion === "agregar") {
      console.log("RECETA RECIBIDA:", JSON.stringify(receta));
      
      const ingredientes = Array.isArray(receta.ingredientes) ? receta.ingredientes : [];
      const pasos = Array.isArray(receta.pasos) ? receta.pasos : [];
      const beneficios = Array.isArray(receta.beneficios) ? receta.beneficios : [];

      const { data, error } = await supabase
        .from('favoritos')
        .insert({
          user_id: userId,
          nombre: receta.nombre || '',
          emoji: receta.emoji || '',
          tiempo: receta.tiempo || '',
          dificultad: receta.dificultad || '',
          porciones: receta.porciones || '',
          ingredientes,
          pasos,
          beneficios,
        })
        .select()
        .single();
      
      if (error) {
        console.log("ERROR SUPABASE:", JSON.stringify(error));
        throw error;
      }
      return Response.json({ favorito: data });
    }

    if (accion === "eliminar") {
      const { error } = await supabase
        .from('favoritos')
        .delete()
        .eq('id', favoritoId);
      if (error) throw error;
      return Response.json({ ok: true });
    }

    return Response.json({ error: "Acción no válida" }, { status: 400 });

  } catch (error) {
    console.error("Error favoritos:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
