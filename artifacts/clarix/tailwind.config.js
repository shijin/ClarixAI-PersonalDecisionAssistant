/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          purple:      '#534AB7',
          'purple-dark':  '#3C3489',
          'purple-mid':   '#7F77DD',
          'purple-light': '#EEEDFE',
          teal:        '#0F6E56',
          'teal-mid':  '#1D9E75',
          'teal-light':'#E1F5EE',
        },
        ink: {
          100: '#1A1917',
          80:  '#3D3D3A',
          50:  '#73726C',
          30:  '#9C9A92',
        },
        surface: {
          0: '#FFFFFF',
          1: '#F7F6F3',
          2: '#EFEDE8',
          3: '#E5E3DC',
        },
        semantic: {
          success:        '#1D9E75',
          'success-bg':   '#E1F5EE',
          'success-dark': '#085041',
          warning:        '#BA7517',
          'warning-bg':   '#FAEEDA',
          'warning-dark': '#633806',
          error:          '#A32D2D',
          'error-bg':     '#FCEBEB',
          'error-dark':   '#501313',
          info:           '#185FA5',
          'info-bg':      '#E6F1FB',
          'info-dark':    '#042C53',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display': ['28px', { lineHeight: '1.2', fontWeight: '800' }],
        'h1':      ['22px', { lineHeight: '1.3', fontWeight: '700' }],
        'h2':      ['18px', { lineHeight: '1.35', fontWeight: '600' }],
        'h3':      ['15px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['15px', { lineHeight: '1.65', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '1.6', fontWeight: '400' }],
        'caption': ['11px', { lineHeight: '1.5', fontWeight: '500' }],
        'label':   ['12px', { lineHeight: '1', fontWeight: '600' }],
      },
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        'pill': '999px',
      },
      spacing: {
        'screen-x': '20px',
        'card-x':   '20px',
        'card-y':   '16px',
      },
    },
  },
  plugins: [],
}
