import { useEffect, useState } from 'react'
import { useNavigate }          from 'react-router-dom'
import { supabase }             from '../../lib/supabase'

export default function AuthCallbackScreen() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('Signing you in...')

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Supabase automatically processes the URL hash
        // when getSession is called after a redirect
        // Wait briefly for it to complete
        setMessage('Verifying your email...')

        await new Promise(resolve => setTimeout(resolve, 2000))

        const { data: { session }, error } =
          await supabase.auth.getSession()

        if (session) {
          setMessage('Email verified. Taking you home...')
          await new Promise(resolve => setTimeout(resolve, 500))

          const sit = localStorage.getItem('clarix_situation')
          const rec = localStorage.getItem('clarix_recommendation')

          if (sit && rec) {
            navigate('/save')
          } else {
            navigate('/home')
          }
          return
        }

        // No session yet — try refreshing
        const { data: refreshData } =
          await supabase.auth.refreshSession()

        if (refreshData?.session) {
          setMessage('Email verified. Taking you home...')
          navigate('/home')
          return
        }

        // Still no session — go to sign in
        setMessage('Please sign in to continue...')
        await new Promise(resolve => setTimeout(resolve, 1000))
        navigate('/sign-in')

      } catch (err) {
        console.error('Callback error:', err)
        navigate('/sign-in')
      }
    }

    // Also listen for auth state change as backup
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          subscription.unsubscribe()

          const sit = localStorage.getItem('clarix_situation')
          const rec = localStorage.getItem('clarix_recommendation')

          if (sit && rec) {
            navigate('/save')
          } else {
            navigate('/home')
          }
        }
      })

    processCallback()

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="min-h-dvh bg-surface-1 flex flex-col
                    items-center justify-center gap-4">
      <div className="w-7 h-7 bg-brand-purple rounded-lg
                      flex items-center justify-center">
        <svg width="16" height="16" fill="none" stroke="white"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1
                   2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </div>
      <div className="w-5 h-5 border-2 border-surface-3
                      border-t-brand-purple rounded-full
                      animate-spin" />
      <p className="text-caption text-ink-30">
        {message}
      </p>
    </div>
  )
}