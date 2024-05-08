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
    strokes_width : { type : Number, default:1},
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
    humanize_ykey: { type: Boolean, default: false },
    inner_radius_ratio: { type: Number, default: 0.5 },
    inner_label_value_color: { type: String, default: 'red' },
    inner_label_value_font_size: { type: String, default: 40 },
    inner_label_title: { type: String, default: 'Coverage' },
    inner_label_title_font_size: { type: Number, default: 24 },
    inner_label_title_margin: { type: Number, default: 4 },
    inner_cicle_fill_color: { type: String, default: 'green' },
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
    if (!this.props.data?.length) {
      return;
    }
    const options = this.props
    const chartId = this.props.id;
    const rowData = this.props.data;
    const xkey_user = this.props.xkey;
    const ykeys_user = this.props.ykeys;
    const xkey_title = this.props.xkey_title;
    const ykey_title = this.props.ykey_title;
    let chart_type;
    let series;
    let chartData;
    let xkey;
    let ykeysArray;
    const validChartTypes = ["pie", "column", "bar", "area", "line", "donut"];
    chart_type = validChartTypes.includes(options.chart_type) ? options.chart_type : "pie";
    chart_type = chart_type === "column" ? "bar" : chart_type;
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
        (options.humanize_ykey ? humanize(params.yKey):params.yKey) +
        '</div>' +
        '<div class="ag-chart-tooltip-content">' +
        (options.tooltip_roundoff ? params.datum[params.yKey].toFixed(0):params.datum[params.yKey].toFixed(2))  +
        '</div>'
      );
    }
      var custom_theme = {
        baseTheme: options.custom_base_theme,
        palette: {
            fills: options.custom_theme_fills,
            strokes: [options.custom_theme_stroke]
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
      if (options.xy_axis) {
        xkey = 'x_axis';
        const firstKey = Object.keys(rowData[0])[0];
        ykeysArray = rowData.map(item => item[firstKey]);
        chartData = rowData.map((item, index) => {
          const { [firstKey]: firstKeyData, count } = item;
          const chartItem = { [xkey]: index + 1 };
          chartItem[firstKeyData] = parseInt(count);
          return chartItem;
        });
        series = ykeysArray.map(ykey => {
          const seriesConfig = {
            type: chart_type,
            stacked: (options.chart_type === 'pie' || options.chart_type === 'donut') ? undefined : options.stacked,
            strokeWidth: (options.strokes ? options.strokes_width : 0)
          }
          if (options.chart_type === 'column' || options.chart_type === 'bar') {
            seriesConfig.direction = options.chart_type === "bar" ? "horizontal" : null;
          }
          if (options.chart_type === 'pie' || options.chart_type === 'donut') {
            seriesConfig.angleKey = ykey;
            seriesConfig.sectorLabelKey = options.hide_y ? undefined : ykey;
            seriesConfig.calloutLabelKey = options.hide_x ? undefined : xkey;
            if (options.chart_type === 'donut') {
                seriesConfig.innerRadiusRatio = options.inner_radius_ratio;
            }
          }
          else if (options.chart_type === 'percentage'){
            const total = rowData.reduce((sum, d) => sum + d[ykey], 0);
            const percentage = (value) => `${((value / total) * 100).toFixed()}%`;
            seriesConfig.angleKey = ykey;
            seriesConfig.innerRadiusOffset = options.inner_radius_offset;
            seriesConfig.fills = [options.inner_label_value_color, options.inner_cicle_fill_color],
            seriesConfig.innerLabels = [
              {
                text: percentage(rowData[0].count),
                color: options.inner_label_value_color,
                fontSize: options.inner_label_value_font_size,
              },
              {
                text: options.inner_label_title,
                fontSize: options.inner_label_title_font_size,
                margin: options.inner_label_title_margin,
              },
            ]
            seriesConfig.innerCircle = {
              fill: options.inner_cicle_fill_color,
            }
          }
          else {
            seriesConfig.yName = options.humanize_ykey ? humanize(ykey):ykey;
            seriesConfig.xKey = xkey;
            seriesConfig.yKey = ykey;
            seriesConfig.tooltip = { renderer: renderer };
            seriesConfig.label = {
              enabled: options.series_label,
              fontWeight: options.series_lable_font,
              fontStyle: options.series_lable_font_style
          }
          }
          return seriesConfig;
      });
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
        series = ykeysArray.map(ykey => {
          const seriesConfig = {
            type: chart_type, 
            stacked: (options.chart_type === 'pie' || options.chart_type === 'donut') ? undefined : options.stacked,
            strokeWidth: (options.strokes ? options.strokes_width : 0)
          }
          if (options.chart_type === 'column'|| options.chart_type === 'bar') {
            seriesConfig.direction = options.chart_type === "bar" ? "horizontal":null
          }
          if (options.chart_type === 'pie' || options.chart_type === 'donut') {
            seriesConfig.angleKey = ykey;
            seriesConfig.sectorLabelKey = options.hide_y ? undefined : ykey;
            seriesConfig.calloutLabelKey = options.hide_x ? undefined : xkey;
            if (options.chart_type === 'donut') {
                seriesConfig.innerRadiusRatio = options.inner_radius_ratio;
            }
          }
          else if (options.chart_type === 'percentage'){
            const total = rowData.reduce((sum, d) => sum + d[ykey], 0);
            const percentage = (value) => `${((value / total) * 100).toFixed()}%`;
            seriesConfig.angleKey = ykey;
            seriesConfig.innerRadiusOffset = options.inner_radius_offset;
            seriesConfig.fills = [options.inner_label_value_color, options.inner_cicle_fill_color],
            seriesConfig.innerLabels = [
              {
                text: percentage(rowData[0].count),
                color: options.inner_label_value_color,
                fontSize: options.inner_label_value_font_size,
              },
              {
                text: options.inner_label_title,
                fontSize: options.inner_label_title_font_size,
                margin: options.inner_label_title_margin,
              },
            ]
            seriesConfig.innerCircle = {
              fill: options.inner_cicle_fill_color,
            }
          }
          else {
            seriesConfig.yName = options.humanize_ykey ? humanize(ykey):ykey;
            seriesConfig.xKey = xkey;
            seriesConfig.yKey = ykey;
            seriesConfig.tooltip = { renderer: renderer };
            seriesConfig.label = {
              enabled: options.series_label,
              fontWeight: options.series_lable_font,
              fontStyle: options.series_lable_font_style
            }
          }
          return seriesConfig
        
          });
      } 
    this.$node.innerHTML = `<div id=${chartId +'-chart'}></div>`
    chartOptions = {
      container: document.getElementById(chartId+'-chart'),
      data: chartData,
      series: series,
      legend: {
        enabled: options.legend,
        spacing: options.legend_spacing,
        position: options.legend_position,
        item: {
          marker: {
              shape: options.legend_shapes, 
          }
      }
      },
    theme: (options.theme == 'custom_theme' ? custom_theme : options.theme)
    };
    if (!['pie', 'donut'].includes(chart_type)) {
      chartOptions.axes = [
        {
          type: 'category',
          position: 'bottom',
          label: {
            enabled: !options.hide_x,
          },
          title: {
            enabled: xkey_title != null,
            text: xkey_title,
          },
        },
        {
          type: 'number',
          position: 'left',
          label: {
            enabled: !options.hide_y,
          },
          title: {
            enabled: ykey_title != null,
            text: ykey_title,
          },
        },
      ];
    }
    agCharts.AgCharts.create(chartOptions);
  },

  events: {
    chart_updated: Event
  },

  init: function() {
    if (this.$node) {
      this.$parse();
    }
  },

  requestUpdate: function (field, props) {
    if (!dmx.equal(this.props.data, props.data) && !this.props.noload) {
      this.refreshChart();
    }
  },
});