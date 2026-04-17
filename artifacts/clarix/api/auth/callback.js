import { createClient } from '@supabase/supabase-js'

export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  const url = new URL(req.url)

  // Get the code from the URL query parameter
  // Supabase sends ?code=xxx for PKCE flow
  const code     = url.searchParams.get('code')
  const draftId  = url.searchParams.get('draft')
  const baseUrl  = url.origin

  if (!code) {
    // No code — redirect to sign in
    return Response.redirect(baseUrl + '/sign-in', 302)
  }

  try {
    // Create Supabase client with service role key
    // This runs server-side only — never exposed to browser
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken:   false,
          persistSession:     false,
          detectSessionInUrl: false,
        }
      }
    )

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error || !data.session) {
      console.error('Session exchange error:', error)
      return Response.redirect(baseUrl + '/sign-in', 302)
    }

    // Check for pending draft
    let draftData = null

    if (draftId) {
      const { data: draft, error: draftError } =
        await supabase
          .from('drafts')
          .select('*')
          .eq('session_id', draftId)
          .single()

      if (!draftError && draft) {
        draftData = draft
      }
    }

    // Build the redirect URL
    const redirectTo = draftData ? baseUrl + '/save' : baseUrl + '/home'

    // Set the session tokens and draft data as cookies
    const cookieOptions = 'Path=/; HttpOnly=false; SameSite=Lax; Max-Age=3600'

    const headers = new Headers()
    headers.append('Location', redirectTo)

    if (draftData) {
      // Store draft in cookie so SavePromptScreen can read it
      headers.append(
        'Set-Cookie',
        'clarix_draft_situation=' +
        encodeURIComponent(draftData.situation) +
        '; ' + cookieOptions
      )
      headers.append(
        'Set-Cookie',
        'clarix_draft_recommendation=' +
        encodeURIComponent(JSON.stringify(draftData.recommendation)) +
        '; ' + cookieOptions
      )
    }

    // Store session tokens in cookies so Supabase client picks them up
    headers.append(
      'Set-Cookie',
      'sb-access-token=' + data.session.access_token +
      '; ' + cookieOptions
    )
    headers.append(
      'Set-Cookie',
      'sb-refresh-token=' + data.session.refresh_token +
      '; ' + cookieOptions
    )

    return new Response(null, {
      status:  302,
      headers: headers,
    })

  } catch (err) {
    console.error('Auth callback error:', err)
    return Response.redirect(baseUrl + '/sign-in', 302)
  }
}