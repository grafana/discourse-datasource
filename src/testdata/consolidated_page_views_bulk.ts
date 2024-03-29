const consolidatedPageViewsFromBulkApi: any = {
  reports: [
    {
      type: 'consolidated_page_views',
      title: 'Consolidated Pageviews',
      xaxis: {
        page_view_crawler: 'Crawlers',
        page_view_anon: 'Anonymous users',
        page_view_logged_in: 'Logged in users',
      },
      yaxis: 'Day',
      description: 'Pageviews for logged in users, anonymous users and crawlers.',
      description_link: null,
      data: [
        {
          req: 'page_view_logged_in',
          label: 'Logged in users',
          color: 'rgba(0,118,255,1)',
          data: [
            { x: '2021-06-01', y: 2071 },
            { x: '2021-06-02', y: 2249 },
            { x: '2021-06-03', y: 1625 },
            { x: '2021-06-04', y: 1652 },
            { x: '2021-06-05', y: 556 },
            { x: '2021-06-06', y: 545 },
            { x: '2021-06-07', y: 1290 },
            { x: '2021-06-08', y: 1420 },
            { x: '2021-06-09', y: 2050 },
            { x: '2021-06-10', y: 1811 },
            { x: '2021-06-11', y: 1497 },
            { x: '2021-06-12', y: 386 },
            { x: '2021-06-13', y: 601 },
            { x: '2021-06-14', y: 1704 },
            { x: '2021-06-15', y: 1650 },
            { x: '2021-06-16', y: 1532 },
            { x: '2021-06-17', y: 1605 },
            { x: '2021-06-18', y: 1234 },
            { x: '2021-06-19', y: 427 },
            { x: '2021-06-20', y: 598 },
            { x: '2021-06-21', y: 1624 },
            { x: '2021-06-22', y: 2032 },
            { x: '2021-06-23', y: 2062 },
            { x: '2021-06-24', y: 1647 },
            { x: '2021-06-25', y: 1263 },
            { x: '2021-06-26', y: 326 },
            { x: '2021-06-27', y: 462 },
            { x: '2021-06-28', y: 1405 },
            { x: '2021-06-29', y: 1516 },
            { x: '2021-06-30', y: 1494 },
          ],
        },
        {
          req: 'page_view_anon',
          label: 'Anonymous users',
          color: '#40b6ff',
          data: [
            { x: '2021-06-01', y: 25254 },
            { x: '2021-06-02', y: 27250 },
            { x: '2021-06-03', y: 23849 },
            { x: '2021-06-04', y: 22805 },
            { x: '2021-06-05', y: 7313 },
            { x: '2021-06-06', y: 7892 },
            { x: '2021-06-07', y: 32271 },
            { x: '2021-06-08', y: 32492 },
            { x: '2021-06-09', y: 27723 },
            { x: '2021-06-10', y: 27779 },
            { x: '2021-06-11', y: 23650 },
            { x: '2021-06-12', y: 7650 },
            { x: '2021-06-13', y: 13670 },
            { x: '2021-06-14', y: 32301 },
            { x: '2021-06-15', y: 27082 },
            { x: '2021-06-16', y: 29099 },
            { x: '2021-06-17', y: 28064 },
            { x: '2021-06-18', y: 23422 },
            { x: '2021-06-19', y: 8285 },
            { x: '2021-06-20', y: 7862 },
            { x: '2021-06-21', y: 24272 },
            { x: '2021-06-22', y: 24931 },
            { x: '2021-06-23', y: 25106 },
            { x: '2021-06-24', y: 24990 },
            { x: '2021-06-25', y: 21210 },
            { x: '2021-06-26', y: 6773 },
            { x: '2021-06-27', y: 7156 },
            { x: '2021-06-28', y: 22824 },
            { x: '2021-06-29', y: 26098 },
            { x: '2021-06-30', y: 24437 },
          ],
        },
        {
          req: 'page_view_crawler',
          label: 'Crawlers',
          color: 'rgba(233,56,12,0.75)',
          data: [
            { x: '2021-06-01', y: 28954 },
            { x: '2021-06-02', y: 7989 },
            { x: '2021-06-03', y: 4586 },
            { x: '2021-06-04', y: 6351 },
            { x: '2021-06-05', y: 5504 },
            { x: '2021-06-06', y: 6264 },
            { x: '2021-06-07', y: 13595 },
            { x: '2021-06-08', y: 4597 },
            { x: '2021-06-09', y: 6556 },
            { x: '2021-06-10', y: 5887 },
            { x: '2021-06-11', y: 7887 },
            { x: '2021-06-12', y: 4920 },
            { x: '2021-06-13', y: 4021 },
            { x: '2021-06-14', y: 12068 },
            { x: '2021-06-15', y: 4615 },
            { x: '2021-06-16', y: 17445 },
            { x: '2021-06-17', y: 18197 },
            { x: '2021-06-18', y: 5020 },
            { x: '2021-06-19', y: 5579 },
            { x: '2021-06-20', y: 4792 },
            { x: '2021-06-21', y: 12932 },
            { x: '2021-06-22', y: 5626 },
            { x: '2021-06-23', y: 5524 },
            { x: '2021-06-24', y: 4956 },
            { x: '2021-06-25', y: 5012 },
            { x: '2021-06-26', y: 5918 },
            { x: '2021-06-27', y: 5626 },
            { x: '2021-06-28', y: 14130 },
            { x: '2021-06-29', y: 6151 },
            { x: '2021-06-30', y: 5922 },
          ],
        },
      ],
      start_date: '2021-06-01T00:00:00Z',
      end_date: '2021-06-30T23:59:59Z',
      prev_data: null,
      prev_start_date: '2021-05-02T00:00:00Z',
      prev_end_date: '2021-06-01T00:00:00Z',
      prev30Days: null,
      dates_filtering: true,
      report_key: 'reports:consolidated_page_views:20210601:20210630:[:prev_period]:50:4',
      primary_color: 'rgba(0,118,255,1)',
      secondary_color: 'rgba(0,118,255,0.1)',
      available_filters: [],
      labels: [
        { type: 'date', property: 'x', title: 'Day' },
        { type: 'number', property: 'y', title: 'Count' },
      ],
      average: false,
      percent: false,
      higher_is_better: true,
      modes: ['stacked_chart'],
      limit: 50,
    },
  ],
};

export { consolidatedPageViewsFromBulkApi };
