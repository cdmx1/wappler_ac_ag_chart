This Wappler module can be used to generate AG Charts given a data source.

It Accespts Data source in 2 formats:
1. As a array with key values one for the terms, other for the count
 [
  {
    "category": "BALLONS",
    "count": "533"
  }...
 ]

In the Above case we can enable the XY Axis toggle provided in the wappler module so that it can generate a series for same based on the values.
This is essentially helpful for queries such as Top 10, top 50, etc.

2. For the 2nd type of Datagiven in format as below
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

We can feed this in directly to the module data source.