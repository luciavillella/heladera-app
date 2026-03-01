import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body.email || body.contact?.email;

    if (!email) {
      return Response.json({ error: 'Email no encontrado' }, { status: 400 });
    }

    // Buscar usuario por email y marcarlo premium
    const { data: userData } = await supabase.auth.admin.listUsers();
    const user = userData?.users?.find(u => u.email === email);

    if (!user) {
      return Response.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    await supabase.from('user_profiles').upsert({
      id: user.id,
      is_premium: true,
      trial_ends_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}