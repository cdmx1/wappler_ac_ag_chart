dmx.Component('ag-chart', {
  initialData: {
    id: null
  },

  attributes: {
    id: { default: null },
    noload: { type: Boolean, default: false },
    theme: { type: String, default: 'ag-default' },
    custom_theme_fills: { type: Array, default: [
      '#03a9f3', '#ab8ce4', '#e83e8c', '#e46a76', '#fb9678',
      '#fec107', '#00c292', '#20c997', '#01c0c8', '#6c757d',
      '#343a40', '#fb9678', '#f8f9fa', '#00c292', '#03a9f3',
      '#fec107', '#e46a76', '#f8f9fa', '#01c0c8', '#343a40',
      '#ab8ce4', '#6610f2', '#FF6633', '#FFB399', '#FF33FF',
      '#FFFF99', '#00B3E6', '#E6B333', '#3366E6', '#999966',
      '#99FF99', '#B34D4D', '#80B300', '#809900', '#E6B3B3',
      '#6680B3', '#66991A', '#FF99E6', '#CCFF1A', '#FF1A66',
      '#E6331A', '#33FFCC', '#66994D', '#B366CC', '#4D8000',
      '#B33300', '#CC80CC', '#66664D', '#991AFF', '#E666FF',
      '#4DB3FF', '#1AB399', '#E666B3', '#33991A', '#CC9999',
      '#B3B31A', '#00E680', '#4D8066', '#809980', '#E6FF80',
      '#1AFF33', '#999933', '#FF3380', '#CCCC00', '#66E64D',
      '#4D80CC', '#9900B3', '#E64D66', '#4DB380', '#FF4D4D',
      '#99E6E6', '#6666FF'
    ]},
    custom_theme_stroke: { type: String, default: 'gray' },
    xkey: { type: String, default: null },
    ykeys: { type: Array, default: [] },
    xkey_title: { type: String, default: null },
    ykey_title: { type: String, default: null },
    chart_type: { type: String, default: 'line' },
    data: { type: Array, default: [] },
    stacked: { type: Boolean, default: true },
    strokes: { type: Boolean, default: false },
    series_label: { type: Boolean, default: false },
    series_label_font: { type: String, default: 'bold' },
    series_label_font_style: { type: String, default: 'normal' },
    tooltip_roundoff: { type: Boolean, default: true },
    legend: { type: Boolean, default: true },
    legend_spacing: { type: Number, default: 40 },
    legend_position: { type: String, default: 'bottom' },
    legend_shapes: { type: String, default: 'circle' },
    hide_x: { type: Boolean, default: false },
    hide_y: { type: Boolean, default: false },
    xy_axis: { type: Boolean, default: false },
    humanize_ykey: { type: Boolean, default: false }
  },

  methods: {
    setValue: function (rowData, xkey, ykeys) {
      this.data.rowData = rowData;
      this.data.chart_type = chart_type;
      this.data.xkey = xkey;
      this.data.ykeys = ykeys;
      this.refreshChart();
    },
    loadChart: function () {
      dmx.nextTick(function() {
      this.refreshChart();
      }, this);
    },
  },

  refreshChart: function () {
    const chartId = this.props.id;
    const theme = this.props.theme;
    const custom_theme_fills = this.props.custom_theme_fills;
    const custom_base_theme = this.props.custom_base_theme;
    const custom_theme_stroke = this.props.custom_theme_stroke;
    const rowData = this.props.data;
    const xkey_user = this.props.xkey;
    const ykeys_user = this.props.ykeys;
    const xkey_title = this.props.xkey_title;
    const ykey_title = this.props.ykey_title;
    const chart_type = this.props.chart_type;
    const stacked = this.props.stacked;
    const strokes = this.props.strokes;
    const series_label = this.props.series_label;
    const series_lable_font = this.props.series_lable_font;
    const series_lable_font_style = this.props.series_lable_font_style;
    const tooltip_roundoff = this.props.tooltip_roundoff;
    const legend = this.props.legend;
    const legend_spacing = this.props.legend_spacing;
    const legend_position = this.props.legend_position;
    const legend_shapes = this.props.legend_shapes;
    const hide_x = this.props.hide_x;
    const hide_y = this.props.hide_y;
    const humanize_ykey = this.props.humanize_ykey;
    function humanize(str) {
      if (str == null) return str;
    
      str = String(str)
        .trim()
        .replace(/([a-z\D])([A-Z]+)/g, '$1_$2')
        .replace(/[-\s]+/g, '_')
        .toLowerCase()
        .replace(/_id$/, '')
        .replace(/_/g, ' ')
        .trim();
    
      return str.charAt(0).toUpperCase() + str.substr(1);
    }
    function renderer(params) {
      return (
        '<div class="ag-chart-tooltip-title" style="background-color:' +
        params.color +
        '">' +
        (humanize_ykey ? humanize(params.yKey):params.yKey) +
        '</div>' +
        '<div class="ag-chart-tooltip-content">' +
        (tooltip_roundoff ? params.yValue.toFixed(0):params.yValue.toFixed(2))  +
        '</div>'
      );
    }

let series;
let chartData;
let xkey;
let ykeysArray;
var custom_theme = {
  baseTheme: custom_base_theme,
  palette: {
      fills: custom_theme_fills,
      strokes: [custom_theme_stroke]
  },
  overrides: {
      cartesian: {
          title: {
              fontSize: 24
          },
          series: {
              column: {
                  label: {
                      enabled: true,
                      color: 'black'
                  }
              }
          }
      }
  }
};
if (this.props.xy_axis) {
  xkey = 'x_axis';
  const firstKey = Object.keys(rowData[0])[0];
  ykeysArray = rowData.map(item => item[firstKey]);
  chartData = rowData.map((item, index) => {
    const { [firstKey]: firstKeyData, count } = item;
    const chartItem = { [xkey]: index + 1 };
    chartItem[firstKeyData] = parseInt(count);
    return chartItem;
  });
  series = ykeysArray.map(ykey => (
    { type: chart_type, 
    xKey: xkey, 
    yKey: ykey, 
    yName: humanize_ykey ? humanize(ykey):ykey, 
    tooltip: { renderer: renderer }, 
    stacked: stacked,
    strokeWidth: (strokes ? 1:0),
    label: {
      enabled: series_label,
      fontWeight: series_lable_font,
      fontStyle: series_lable_font_style
  } }));
}
else {
  chartData = rowData.map(function(item) {
    var chartItem = {};
    var keys = Object.keys(item);
    if (xkey_user) {
      xkey = xkey_user
    }
    else {
      xkey = keys[0]; 
    }
    
    chartItem[xkey] = item[xkey];
    if (ykeys_user.length > 0) {
    ykeysArray = ykeys_user.split(',').map(function(item) {
      return item.trim(); 
    });
    }
    else {
    var ykeysArray = keys.slice(1);
  }
    ykeysArray.forEach(function(ykey) {
        chartItem[ykey] = item[ykey] !== undefined ? parseFloat(item[ykey]) : NaN;
    });
    return chartItem;
});
    if (xkey_user) {
      xkey = xkey_user
    }
    else {
      xkey = Object.keys(chartData[0])[0];
    }
    if(ykeys_user.length > 0){
    ykeysArray = ykeys_user.split(',').map(function(item) {
      return item.trim(); 
    });
    }
    else {
      ykeysArray = Object.keys(chartData[0]).slice(1);
  }
  
  series = ykeysArray.map(ykey => (
    { type: chart_type, 
    xKey: xkey, 
    yKey: ykey, 
    yName: humanize_ykey ? humanize(ykey):ykey, 
    tooltip: { renderer: renderer }, 
    stacked: stacked,
    strokeWidth: (strokes ? 1:0),
    label: {
      enabled: series_label,
      fontWeight: series_lable_font,
      fontStyle: series_lable_font_style
  } }));
} 
    this.$node.innerHTML = `<div id=${chartId +'-chart'}></div>`
    chartOptions = {
      container: document.getElementById(chartId+'-chart'),
      data: chartData,
      series: series,
      legend: {
        enabled: legend,
        spacing: legend_spacing,
        position: legend_position,
        item: {
          marker: {
              shape: legend_shapes, 
          }
      }
      },
      axes: [
        {
            type: 'category',
            position: 'bottom',
            label: {
                enabled: !hide_x 
            },
            title: {
              enabled: (xkey_title!=null),
              text: xkey_title,
            },
        },
        {
            type: 'number',
            position: 'left',
            label: {
              enabled: !hide_y 
          },
          title: {
            enabled: (ykey_title!=null),
            text: ykey_title,
          },
        }
    ],
    theme: (theme == 'custom_theme' ? custom_theme : theme)
    };
    agCharts.AgChart.create(chartOptions);
  },

  events: {
    'dmx-ag-chart-row-data-updated': Event
  },

  render: function(node) {
    if (this.$node) {
      this.$parse();
    }
  },

  update: function (props) {
    if (!dmx.equal(this.props.data, props.data) && !this.props.noload) {
      this.refreshChart();
    }
  },
});