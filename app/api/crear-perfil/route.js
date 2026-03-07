import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { userId } = await request.json();
    console.log('userId recibido:', userId);

    if (!userId) {
      return Response.json({ error: 'userId requerido' }, { status: 400 });
    }

    // Verificar si ya existe el perfil
    const { data: existing } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (existing) {
      return Response.json({ ok: true, created: false });
    }

    // Crear perfil nuevo con 7 días de trial
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7);

    const { error } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        id: userId,
        is_premium: false,
        trial_ends_at: trialEnd.toISOString(),
        consultas_hoy: 0,
        ultima_consulta: null,
      });

    if (error) {
      console.error('Error insertando perfil:', error);
      throw error;
    }

    return Response.json({ ok: true, created: true });
  } catch (error) {
    console.error('Error creando perfil:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
