import barChart from '~/assets/images/barChart.png'
import lineChart from '~/assets/images/lineChart.png'
import radarChart from '~/assets/images/radarChart.png'
import pieChart from '~/assets/images/pieChart.png'
import doughnutChart from '~/assets/images/doughnutChart.png'
import polarChart from '~/assets/images/polarChart.png'
export const dataCharts = [
  {
    id : 7,
    image: barChart,
    title: 'Bar Chart',
    content:
      ' Displays changes to timeseries data over time. For example, daily water consumption for last month. ',
  },
  {
    id : 8,
    image: lineChart,
    title: 'Line Chart',
    content:
      ' Displays changes to timeseries data over time. For example, temperature or humidity readings. ',
  },
  {
    id : 9,
    image: radarChart,
    title: 'Radar Chart',
    content:
      ' Displays latest values of the attributes or timeseries data for multiple entities in a radar chart.',
  },
  {
    id : 10,
    image: pieChart,
    title: 'Pie Chart',
    content:
      ' Displays latest values of the attributes or timeseries data for multiple entities in a pie chart.',
  },
  {
    id : 11,
    image: doughnutChart,
    title: 'Doughnut Chart',
    content:
      ' Displays latest values of the attributes or timeseries data for multiple entities in a polar area chart. ',
  },
  {
    id : 12,
    image: polarChart,
    title: 'Radial Bar Chart',
    content:
      ' Displays latest values of the attributes or timeseries data for multiple entities in a doughnut chart.',
  },
]
