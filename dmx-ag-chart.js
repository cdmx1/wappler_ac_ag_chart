dmx.Component('ag-chart', {
  initialData: {
    id: null,
    type: null,
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
    type: { type: String, default: 'line' },
    data: { type: Array, default: [] },
    legend: { type: Boolean, default: true },
    legend_spacing: { type: Number, default: 40 },
    hide_x: { type: Boolean, default: false },
    hide_y: { type: Boolean, default: false },
    xy_axis: { type: Boolean, default: false }
  },

  methods: {
    setData: function (rowData, xkey, ykeys) {
      this.set('rowData', rowData);
      this.set('xkey', xkey);
      this.set('ykeys', ykeys);
      this.refreshChart();
    }
  },

  refreshChart: function () {
    console.log("refreshChart called")
    const chartId = this.props.id;
    const rowData = this.props.data;
    const xkey_user = this.props.xkey;
    const ykeys_user = this.props.ykeys;
    const xy_axis = this.props.xy_axis;
    const type = this.props.type;
    const legend = this.props.legend;
    const legend_spacing = this.props.legend_spacing;
    const hide_x = this.props.hide_x;
    const hide_y = this.props.hide_y;
    // Split the string into an array using the comma as the delimiter
    // let ykeysArray = ykeys.split(',');

    // If the ykeysArray contains only one element and that element is an empty string, handle it as a single value array
    // if (ykeysArray.length === 1 && ykeysArray[0].trim() === '') {
    //   ykeysArray = [];
    // }
    // if (!rowData || rowData.length === 0 || !xkey || ykeys.length === 0) {
    //   console.error('Invalid data or chart options.');
    //   return;
    // }

let series;
let chartData;
let xkey;
let ykeysArray;
if (xy_axis) {
  xkey = 'x_axis';
  ykeysArray = rowData.map(item => item.flags);
  
  chartData = rowData.map((item, index) => {
    const { flags, count } = item;
    const chartItem = { [xkey]: index + 1 };
    chartItem[flags] = parseInt(count);
    return chartItem;
  });

  console.log(chartData);

  series = ykeysArray.map(ykey => ({ type: type, xKey: xkey, yKey: ykey, stacked: true }));
  console.log(series);
}
else {
  chartData = rowData.map(function(item) {
    var chartItem = {};
    var keys = Object.keys(item);
    var xkey = keys[0]; // Autoset the first key as xkey
    chartItem[xkey] = item[xkey];
    
    var ykeysArray = keys.slice(1); // Autoset the subsequent keys as ykeys

    ykeysArray.forEach(function(ykey) {
        chartItem[ykey] = item[ykey] !== undefined ? parseFloat(item[ykey]) : NaN;
    });
    return chartItem;
});
  xkey = Object.keys(chartData[0])[0];
  ykeysArray = Object.keys(chartData[0]).slice(1);
  console.log(ykeysArray);
  series = ykeysArray.map(ykey => ({ type: type, xKey: xkey, yKey: ykey, stacked: true }));
}
    this.$node.innerHTML = `<div id=${chartId +'-chart'}></div>`
    chartOptions = {
      container: document.getElementById(chartId+'-chart'),
      data: chartData,
      series: series,
      legend: {
        enabled: legend,
        spacing: legend_spacing
      },
      axes: [
        {
            type: 'category',
            position: 'bottom',
            label: {
                enabled: !hide_x // Set this to 'false' to hide the X-axis labels
            }
        },
        {
            type: 'number',
            position: 'left',
            label: {
              enabled: !hide_y // Set this to 'false' to hide the X-axis labels
          }
        }
    ]
    };
    console.log(chartOptions)

    // Create ag-Chart instance
    agCharts.AgChart.create(chartOptions);
  },

  events: {
    'dmx-ag-chart-row-data-updated': Event
  },

  render: function () {
    // this.refreshChart();
  },

  update: function (props) {
    
    // dmx.equal is a helper function that does a deep compare
    // which is useful when comparing arrays and objects
    if (!dmx.equal(this.props.data, props.data)) {
      console.log(this.props.ykeys)
      this.refreshChart();
    }
  },
});