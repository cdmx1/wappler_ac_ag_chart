This Wappler module can be used to generate AG Charts given a data source.

It Accepts Data source in 2 formats:
1. As a array with key values, one for the terms, other for the count
 [
  {
    "category": "BALLONS",
    "count": "533"
  }...
 ]

In the Above case we can enable the XY Axis toggle provided in the UI module so that it can generate a series for same based on the values.
This is essentially helpful for queries such as Top 10, top 50, etc.

2. For the 2nd type of Data, below format is accepted:
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
Note: setting xkey and xkeys form the UI is optional, it takes the first key for x and subsequent keys as ykeys


For PostgresSQL a query similar to beow can be constructed:
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

Then enable the XY axis to display the data