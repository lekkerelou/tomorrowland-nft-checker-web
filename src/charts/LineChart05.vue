<template>
  <div className="px-5 py-3">
    <div className="flex flex-wrap justify-between items-end">
      <div className="flex items-center">
        <!-- <div className="text-sm"><span className="font-medium text-slate-800">17.4%</span> AVG</div> -->
      </div>
      <div className="grow ml-2 mb-1">
        <ul ref="legend" className="flex flex-wrap justify-end" />
      </div>
    </div>
  </div>
  <!-- Chart built with Chart.js 3 -->
  <div className="grow">
    <canvas ref="canvas" :data="data" :width="width" :height="height"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  Chart, LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip,
} from 'chart.js'
import 'chartjs-adapter-moment'

// Import utilities
import { tailwindConfig } from '../utils/Utils'
import moment from "moment/moment";
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip, annotationPlugin)
/*const annotation1 = {
  type: 'line',
  scaleID: 'x',
  borderWidth: 1,
  borderColor: 'black',
  value: "2023/01/10 23:59",
  label: {
    backgroundColor: 'black',
    rotation: 'auto',
    content: 'TML Snapshot',
    display: true
  },
};
const annotation3 = {
  type: 'box',
  backgroundColor: 'rgba(255, 245, 157, 0.3)',
  borderWidth: 0,
  xMax: "2023/01/10 22:00",
  xMin: "2023/01/05 16:00",
  label: {
    drawTime: 'beforeDraw',
    display: true,
    rotation: '90',
    content: 'Claim Medallion (Claim Voucher)',
  }
};
const annotation4 = {
  type: 'box',
  backgroundColor: 'rgba(16, 185, 129, 0.3)',
  borderWidth: 0,
  xMax: "2023/01/12 14:00",
  xMin: "2023/01/11 00:00",
  label: {
    drawTime: 'beforeDraw',
    display: true,
    rotation: '90',
    content: 'Link Medallion',
  }
};
const annotation6 = {
  type: 'box',
  backgroundColor: 'rgba(244, 63, 94, 0.3)',
  borderWidth: 0,
  xMax: "2023/01/16 15:00",
  xMin: "2023/01/12 15:00",
  label: {
    drawTime: 'beforeDraw',
    display: true,
    rotation: '90',
    content: 'Tomorrowland NFT Global Journey',
  }
};
 */
const annotation7 = {
  type: 'box',
  backgroundColor: 'rgba(244, 63, 94, 0.3)',
  borderWidth: 0,
  xMax: "2024/02/12 16:52",
  xMin: "2024/02/18 23:00",
  label: {
    drawTime: 'beforeDraw',
    display: true,
    rotation: '90',
    content: 'TML Brasil NFT Registration',
  }
};
export default {
  name: 'LineChart05',
  props: ['data', 'width', 'height'],
  setup(props) {

    const canvas = ref(null)
    const legend = ref(null)
    let chart = null

    onMounted(() => {
      const ctx = canvas.value
      chart = new Chart(ctx, {
        type: 'line',
        data: props.data,
        options: {
          layout: {
            padding: 20,
          },
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
                //round: 'day',
                //unitStepSize: 1,
                displayFormats: {
                  'day': 'YYYY/MM/DD',
                }
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 30
              },
              grid: {
                display: true,
                drawBorder: false,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                title: (context) => moment(context[0].parsed.x).format("YYYY/MM/DD HH:mm:ss"), // Disable tooltip title
                label: (context) => `${context.parsed.y}`,
              },
            },
            annotation: {
              annotations: {
                annotation7
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'nearest',
          },
          maintainAspectRatio: false,
        },
        plugins: [{
          id: 'htmlLegend',
          afterUpdate(c, args, options) {
            const ul = legend.value
            if (!ul) return
            // Remove old legend items
            while (ul.firstChild) {
              ul.firstChild.remove()
            }
            // Reuse the built-in legendItems generator
            const items = c.options.plugins.legend.labels.generateLabels(c)
            items.forEach((item) => {
              const li = document.createElement('li')
              li.style.marginLeft = tailwindConfig().theme.margin[3]
              // Button element
              const button = document.createElement('button')
              button.style.display = 'inline-flex'
              button.style.alignItems = 'center'
              button.style.opacity = item.hidden ? '.3' : ''
              button.onclick = () => {
                c.setDatasetVisibility(item.datasetIndex, !c.isDatasetVisible(item.datasetIndex))
                c.update()
              }
              // Color box
              const box = document.createElement('span')
              box.style.display = 'block'
              box.style.width = tailwindConfig().theme.width[3]
              box.style.height = tailwindConfig().theme.height[3]
              box.style.borderRadius = tailwindConfig().theme.borderRadius.full
              box.style.marginRight = tailwindConfig().theme.margin[2]
              box.style.borderWidth = '3px'
              box.style.borderColor = c.data.datasets[item.datasetIndex].borderColor
              box.style.pointerEvents = 'none'
              // Label
              const label = document.createElement('span')
              label.style.color = tailwindConfig().theme.colors.slate[500]
              label.style.fontSize = tailwindConfig().theme.fontSize.sm[0]
              label.style.lineHeight = tailwindConfig().theme.fontSize.sm[1].lineHeight
              const labelText = document.createTextNode(item.text)
              label.appendChild(labelText)
              li.appendChild(button)
              button.appendChild(box)
              button.appendChild(label)
              ul.appendChild(li)
            })
          },
        }],
      })
    })

    onUnmounted(() => chart.destroy())

    return {
      canvas,
      legend,
    }
  }
}
</script>
