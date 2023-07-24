dmx.Component('ag-chart', {
  initialData: {
    id: null,
    xkey: [],
    ykeys: [],
    data: [],
    legend: true,
    hide_x: false,
    hide_y: false,
    xy_axis: false,
  },

  attributes: {
    id: { default: null },
    xkey: { type: String, default: null },
    ykeys: { type: Array, default: [] },
    xkey_title: { type: String, default: null },
    ykey_title: { type: String, default: null },
    chart_type: { type: String, default: 'line' },
    data: { type: Array, default: [] },
    stacked: { type: Boolean, default: true },
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
    }
  },

  refreshChart: function () {
    const chartId = this.props.id;
    const rowData = this.props.data;
    const xkey_user = this.props.xkey;
    const ykeys_user = this.props.ykeys;
    const xy_axis = this.props.xy_axis;
    const xkey_title = this.props.xkey_title;
    const ykey_title = this.props.ykey_title;
    const chart_type = this.props.chart_type;
    const stacked = this.props.stacked;
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
      xkey = keys[0]; // Autoset the first key as xkey
    }
    
    chartItem[xkey] = item[xkey];
    if (ykeys_user.length > 0) {
      // Convert ykeys_user to an array
    ykeysArray = ykeys_user.split(',').map(function(item) {
      return item.trim(); // To remove any leading/trailing spaces around the keys
    });
    }
    else {
    var ykeysArray = keys.slice(1); // Autoset the subsequent keys as ykeys
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
      // Convert ykeys_user to an array
    ykeysArray = ykeys_user.split(',').map(function(item) {
      return item.trim(); // To remove any leading/trailing spaces around the keys
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
              shape: legend_shapes, // 'square', 'diamond', 'cross', 'plus', 'triangle'
          }
      }
      },
      axes: [
        {
            type: 'category',
            position: 'bottom',
            label: {
                enabled: !hide_x // Set this to 'false' to hide the X-axis labels
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
              enabled: !hide_y // Set this to 'false' to hide the X-axis labels
          },
          title: {
            enabled: (ykey_title!=null),
            text: ykey_title,
          },
        }
    ]
    };
    // console.log(chartOptions)
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
    // dmx.equal is a helper function that does a deep compare
    // which is useful when comparing arrays and objects
    if (!dmx.equal(this.props.data, props.data)) {
      
      this.refreshChart();
    }
  },
});