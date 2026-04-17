import { createClient } from '@supabase/supabase-js'

export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  const url     = new URL(req.url)
  const token   = url.searchParams.get('token')
  const type    = url.searchParams.get('type')
  const draftId = url.searchParams.get('draft')
  const baseUrl = url.origin

  if (!token || !type) {
    return Response.redirect(baseUrl + '/sign-in', 302)
  }

  try {
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

    // Verify the token using OTP verification
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type:       type,
    })

    if (error || !data.session) {
      console.error('OTP verification error:', error)
      return Response.redirect(baseUrl + '/sign-in', 302)
    }

    const session = data.session

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

    // Decide where to redirect
    const redirectTo = draftData
      ? baseUrl + '/save'
      : baseUrl + '/home'

    const cookieOptions =
      'Path=/; HttpOnly=false; SameSite=Lax; Max-Age=3600'

    const headers = new Headers()
    headers.append('Location', redirectTo)

    // Set draft cookies if draft exists
    if (draftData) {
      headers.append(
        'Set-Cookie',
        'clarix_draft_situation=' +
        encodeURIComponent(draftData.situation) +
        '; ' + cookieOptions
      )
      headers.append(
        'Set-Cookie',
        'clarix_draft_recommendation=' +
        encodeURIComponent(
          JSON.stringify(draftData.recommendation)
        ) +
        '; ' + cookieOptions
      )
    }

    // Set session cookies so Supabase client
    // picks up the session on the next page load
    headers.append(
      'Set-Cookie',
      'sb-access-token=' + session.access_token +
      '; ' + cookieOptions
    )
    headers.append(
      'Set-Cookie',
      'sb-refresh-token=' + session.refresh_token +
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