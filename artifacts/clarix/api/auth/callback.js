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
    return Response.redirect(
      baseUrl + '/sign-in?error=no_token', 302
    )
  }

  // Check environment variables are present
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return Response.redirect(
      baseUrl + '/sign-in?error=missing_env_vars', 302
    )
  }

  try {
    const supabase = createClient(
      supabaseUrl,
      serviceKey,
      {
        auth: {
          autoRefreshToken:   false,
          persistSession:     false,
          detectSessionInUrl: false,
        }
      }
    )

    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type:       type,
    })

    if (error) {
      return Response.redirect(
        baseUrl + '/sign-in?error=' +
        encodeURIComponent(error.message), 302
      )
    }

    if (!data.session) {
      return Response.redirect(
        baseUrl + '/sign-in?error=no_session', 302
      )
    }

    // Success — check for draft
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

    const redirectTo = draftData
      ? baseUrl + '/save'
      : baseUrl + '/home'

    const cookieOptions =
      'Path=/; HttpOnly=false; SameSite=Lax; Max-Age=3600'

    const headers = new Headers()
    headers.append('Location', redirectTo)

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
    return Response.redirect(
      baseUrl + '/sign-in?error=' +
      encodeURIComponent(err.message || 'unknown'), 302
    )
  }
}