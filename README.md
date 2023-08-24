#### Developed and Maintained by: Roney Dsilva

## AG Chart Component Documentation

### Component Overview

This module is used for creating dynamic charts in Wappler. It provides various properties for configuring the appearance and behavior of the charts.

### Component Properties

#### AG Chart Properties

1. **ID**: Unique identifier for the chart. (Required)
2. **Data Source**: The data source for the chart, e.g. SC or JS data source. (Required)
3. **No Auto Load**: Set to true to disable auto-load of the chart. (Default: false)

#### AG Chart Options

- **Chart Type**: Select the type of chart to be displayed. Currently supported: Line, Column(Bar), Pie, Percentage and Area.
- **Chart Theme**: Choose the visual theme for the chart. Options include Default, Dark, Material, Pastel, and Custom.
- **X-Axis Key**: The data key for the x-axis of the chart (Optional).
- **Y-Axis Keys**: Comma-separated data keys for the y-axis of the chart (Optional).
- **X-Axis Title**: Title for the X-axis of the chart.
- **Y-Axis Title**: Title for the Y-axis of the chart.
- **XY Axis**: Enable the XY axis for a single series in the chart.
- **Stacked**: Enable stacking of plots in the chart.
- **Strokes**: Enable or disable outline strokes for fills.
- **Tooltip Roundoff**: Enable rounding off of Y values in tooltips.
- **Series Labels**: Enable or disable series labels.
- **Series Labels Font**: Choose the font weight for series labels.
- **Series Labels Font Style**: Choose the font style for series labels.
- **Hide X Axis Label**: Enable to hide the X-axis label.
- **Hide Y Axis Label**: Enable to hide the Y-axis label.

#### AG Chart Legend

- **Legend**: Enable or disable the chart legend.
- **Legend Shapes**: Choose the shape of the legend markers (Circle, Square, Cross, Triangle).
- **Legend Spacing**: Adjust the spacing between legend items.
- **Legend Position**: Choose the position of the legend (Bottom, Top).
- **Humanize Y Axis Legends**: Humanize Y-axis legends for better readability.

#### Inner Labels
This allows configuring Inner labels in a Percentage Pie chart.

  - **Inner Labels**: Checkbox to display the inner labels settings
  - **Inner Label Color**: The color of Inner Percentage. (Default: "red")
  - **Inner Label Font Size**: The font size of inner label values. (Default: 40).
  - **Inner Label Title**: The Title for the Percentage Value. (Default: "Coverage")
  - **Inner Label Title Font Size**: The font size of the Title for the Percentage Value.
  - **Inner Label Title Margin**: The margin of the inner label title.
  - **Inner Circle Fill Color**: The fill color of the inner circle. (Default: "green")

#### Action Attributes

**Load**
- Mainly to be used in conjunction with "No Auto Load" enabled so that you can load only when certain conditions are met.
- Use Case: Used when you're awaiting the population of specific elements or data before loading the chart. It's also useful for refreshing the chart intentionally.

### Usage

The module can be used to generate AG Charts given a data source.

It Accepts Data sources in 2 formats:
##### 1. As an array with key values, one for the terms, the other for the count
```
 [
  {
    "category": "BALLONS",
    "count": "533"
  }...
 ]
```
In the above case, we can enable the XY Axis toggle provided in the UI module so that it can generate a series for the same based on the values.
This is essentially helpful for queries such as Top 10, top 50, etc.

##### 2. For the 2nd type of Data, the below format is accepted:
```
[
  {
    "month": "2026-12",
    "checked": "1",
    "flagged": "1"
  },
  {
    "month": "2025-01",
    "checked": "1",
    "flagged": "1"
  }...
]
```
We can feed this directly to the module data source.
Note: Setting xkey and xkeys from the UI is optional, it takes the first key for x and subsequent keys as ykeys

For PostgresSQL a query similar to below can be constructed:
```
SELECT
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'checks', checks,
            'count', count
        )
    ) AS result
FROM (
    SELECT
        'checked' AS checks,
        COALESCE(count(1), 0) AS count
    FROM
        user_data
    WHERE
        AND created_at >= NOW() - INTERVAL '1 DAY'
    UNION ALL
    SELECT
        'under_review' AS checks,
        COALESCE(SUM(under_review::int), 0) AS count
    FROM
        user_data
    WHERE
        AND created_at >= NOW() - INTERVAL '1 DAY'
    UNION ALL
    SELECT
        'rejected' AS checks,
        COALESCE(SUM(rejected::int), 0) AS count
    FROM
        user_data
    WHERE
        AND created_at >= NOW() - INTERVAL '1 DAY'
) AS subquery;
```
Then enable the XY axis to display the data

#### Example usage of Percentage Chart:
Given below input data below:
```
[
  {
    "name": "Covered",
    "count": 17000
  },
  {
    "name": "Not Covered",
    "count": 3000
  }
]
```

- Set Chart Type to "Percentage".
- Set the Inner Label Settings as required, i.e. the Inner Label title, Font size, etc. or leave defaults.
- Set the Inner Radius Offset to -20.
