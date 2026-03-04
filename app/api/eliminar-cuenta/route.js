import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return Response.json({ error: "No se recibió userId" }, { status: 400 });
    }

    // Borrar perfil de user_profiles
    await supabaseAdmin.from("user_profiles").delete().eq("id", userId);

    // Borrar usuario de auth
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) throw error;

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Error eliminando cuenta:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
