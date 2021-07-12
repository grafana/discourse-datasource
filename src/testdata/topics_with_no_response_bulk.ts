const topicsWithNoResponseFromBulkApi: any = {
  reports: [
    {
      type: 'topics_with_no_response',
      title: 'Topics with no response',
      xaxis: 'Day',
      yaxis: 'Total',
      description: 'Number of new topics created that did not receive a response.',
      description_link: null,
      data: [
        {
          x: '2021-06-01',
          y: 5,
        },
        {
          x: '2021-06-02',
          y: 7,
        },
        {
          x: '2021-06-03',
          y: 9,
        },
        {
          x: '2021-06-04',
          y: 5,
        },
        {
          x: '2021-06-06',
          y: 1,
        },
        {
          x: '2021-06-07',
          y: 1,
        },
        {
          x: '2021-06-08',
          y: 5,
        },
        {
          x: '2021-06-09',
          y: 19,
        },
        {
          x: '2021-06-10',
          y: 10,
        },
        {
          x: '2021-06-11',
          y: 7,
        },
        {
          x: '2021-06-12',
          y: 1,
        },
        {
          x: '2021-06-13',
          y: 2,
        },
        {
          x: '2021-06-14',
          y: 3,
        },
        {
          x: '2021-06-15',
          y: 7,
        },
        {
          x: '2021-06-16',
          y: 11,
        },
        {
          x: '2021-06-17',
          y: 10,
        },
        {
          x: '2021-06-18',
          y: 8,
        },
        {
          x: '2021-06-20',
          y: 4,
        },
        {
          x: '2021-06-21',
          y: 5,
        },
        {
          x: '2021-06-22',
          y: 6,
        },
        {
          x: '2021-06-23',
          y: 18,
        },
        {
          x: '2021-06-24',
          y: 9,
        },
        {
          x: '2021-06-25',
          y: 12,
        },
        {
          x: '2021-06-26',
          y: 2,
        },
        {
          x: '2021-06-27',
          y: 5,
        },
        {
          x: '2021-06-28',
          y: 13,
        },
        {
          x: '2021-06-29',
          y: 13,
        },
        {
          x: '2021-06-30',
          y: 8,
        },
        {
          x: '2021-07-01',
          y: 21,
        },
      ],
      start_date: '2021-06-01T00:00:00Z',
      end_date: '2021-07-01T23:59:59Z',
      prev_data: null,
      prev_start_date: '2021-05-01T00:00:00Z',
      prev_end_date: '2021-06-01T00:00:00Z',
      prev30Days: 5179,
      dates_filtering: true,
      report_key:
        'reports:topics_with_no_response:20210601:20210701:[:prev_period]:50:{"category":"33","include_subcategories":"true"}:4',
      primary_color: 'rgba(0,118,255,1)',
      secondary_color: 'rgba(0,118,255,0.1)',
      available_filters: [
        {
          id: 'category',
          type: 'category',
          default: 33,
        },
        {
          id: 'include_subcategories',
          type: 'bool',
          default: true,
        },
      ],
      labels: [
        {
          type: 'date',
          property: 'x',
          title: 'Day',
        },
        {
          type: 'number',
          property: 'y',
          title: 'Count',
        },
      ],
      average: false,
      percent: false,
      higher_is_better: true,
      modes: ['table', 'chart'],
      total: 5179,
      limit: 50,
    },
  ],
};

export { topicsWithNoResponseFromBulkApi };
