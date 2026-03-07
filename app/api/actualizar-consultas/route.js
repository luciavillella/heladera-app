import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { userId } = await request.json();
    if (!userId) return Response.json({ error: 'userId requerido' }, { status: 400 });

    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('consultas_hoy, ultima_consulta, is_premium')
      .eq('id', userId)
      .single();

    if (!profile) return Response.json({ error: 'Perfil no encontrado' }, { status: 404 });
    if (profile.is_premium) return Response.json({ ok: true, puedeConsultar: true });

    const today = new Date().toISOString().split('T')[0];
    const nuevasConsultas = profile.ultima_consulta === today ? profile.consultas_hoy + 1 : 1;

    await supabaseAdmin
      .from('user_profiles')
      .update({ consultas_hoy: nuevasConsultas, ultima_consulta: today })
      .eq('id', userId);

    return Response.json({ ok: true, consultas_hoy: nuevasConsultas });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
