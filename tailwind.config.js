module.exports = {
  content: ['*.{html,js}'],
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
