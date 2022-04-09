module.exports = {
  shortcuts: [
    {
      btn: 'py-2 px-4 text-sx',
      'btn-link':
        'bg-transparent text-blue-600 hover:text-blue-700 hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-200',
    },
    // dynamic shortcuts
    [
      /^btn-(.*)$/,
      ([, c], { theme }) => {
        const isColor = theme.colors[c]
        const sm = 'px-4 py-1.5'
        const md = 'px-6 py-2.5'
        const lg = 'px-8 py-3 text-md'
        const sizes = { sm, md, lg }
        const size = sizes[c]
        if (size) {
          return size
        }
        const bg = isColor
          ? `bg-${c}-400 hover:bg-${c}-700 focus:bg-${c}-700 active:bg-${c}-800`
          : ''
        const text = isColor ? `text-${c}-100` : ''
        return `${bg} ${text} inline-block font-medium leading-tight shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out`
      },
    ],
  ],
  theme: {
    colors: {
      primary: '#346ae3',
      secondary: '#6c757d',
    },
  },
}
