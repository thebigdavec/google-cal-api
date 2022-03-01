module.exports = {
  content: ['*.{html,js}'],
  safeList: [
    'bg-blue-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-indigo-500',
    'bg-pink-500',
    'text-blue-50',
    'text-amber-50',
    'text-rose-50',
    'text-indigo-50',
    'text-pink-50',
    'ring-blue-500',
    'ring-amber-500',
    'ring-rose-500',
    'ring-indigo-500',
    'ring-pink-500',
    'shadow-blue-200',
    'shadow-amber-200',
    'shadow-rose-200',
    'shadow-indigo-200',
    'shadow-pink-200'
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        cards: 'repeat(auto-fit, minmax(22rem, 1fr))',
        footer: '200px minmax(900px, 1fr) 100px'
      },
      gridTemplateRows: {
        auto1: 'auto 1fr'
      }
    }
  },
  plugins: []
}
