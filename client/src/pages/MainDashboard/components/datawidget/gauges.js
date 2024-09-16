import radialGauge from '~/assets/images/radialGauge.png'
import speedGauge from '~/assets/images/speedGauge.png'
import temperatureGauge from '~/assets/images/temperatureGauge.png'
import compassGauge from '~/assets/images/compassGauge.png'
export const dataGauges = [
  {
    id : 28,
    image: radialGauge,
    title: 'Radial Gauge',
    content:
      'Preconfigured gauge to display any value reading. Allows to configure value range, gradient colors and other settings.',
  },
  {
    id : 29,
    image: speedGauge,
    title: 'Speed Gauge',
    content:
      'Preconfigured gauge to display speed. Can configure speed range, gradient colors and other settings.',
  },
  {
    id : 30,
    image: temperatureGauge,
    title: 'Temp Gauge',
    content:
      ' Preconfigured gauge to display temperature.Can configure temperature range, gradient colors and other settings.',
  },
  {
    id : 31,
    image: compassGauge,
    title: 'Compass Gauge',
    content:
      ' Displays latest value of the attribute or timeseries key on the compass. Expects value to be in range of 0 to 360. ',
  },
]
