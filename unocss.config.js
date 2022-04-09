module.exports = {
  shortcuts: [
    {
      btn: 'py-2 px-4 font-semibold rounded-lg shadow-md',
    },
    // dynamic shortcuts
    [
      /^btn-(.*)$/,
      ([, c], { theme }) => {
        const isColor = theme.colors[c]
        const bg = isColor
          ? `bg-${c}-400 hover:bg-${c}-700 focus:bg-${c}-700 active:bg-${c}-800`
          : ''
        const text = isColor ? `text-${c}-100` : ''
        return `${bg} ${text} inline-block px-6 py-2.5 font-medium text-xs leading-tight uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out`
      },
    ],
  ],
  theme: {
    colors: {
      primary: 'rgb(52, 106, 227)',
      secondary: 'rgb(108, 117, 125)',
    },
  },
}
