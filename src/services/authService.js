export async function signIn(supabaseClient, email, password) {
    return supabaseClient.auth.signInWithPassword({ email, password });
}

export async function signUp(supabaseClient, email, password) {
    return supabaseClient.auth.signUp({ email, password });
}

export async function signOut(supabaseClient) {
    if (!supabaseClient) return;
    await supabaseClient.auth.signOut();
}

export async function getSession(supabaseClient) {
    if (!supabaseClient) return { data: { session: null } };
    return supabaseClient.auth.getSession();
}
