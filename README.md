# Grafana Discourse data source

[![CircleCI](https://circleci.com/gh/grafana/discourse-datasource/tree/master.svg?style=svg)](https://circleci.com/gh/grafana/discourse-datasource/tree/master)

View report data and user data from a hosted Discourse instance in your Grafana.

## Demo

[Demo dashboard for Topics and Replies](https://play.grafana.org/d/aMaVTeVGz/community-site-topics-and-replies?orgId=1)

The dashboard above is used to track some statistics for the [hosted Discourse website for Grafana](https://community.grafana.com/).

## Credentials

- URL: the url for your Discourse instance. For example, `https://community.grafana.com/`.
- Username: the username associated with your API Key or `system` if you chose the `All Users` option for the `User Level`.
- API Key: Create an API key in Discourse in the Admin -> API -> Keys section.

### Creating an API key in hosted Discourse

1. Navigate to the Admin -> API -> Keys section and click on the New API Key button.
2. Fill in a description for the new key.
3. Choose the User Level - either `All Users` or a specific single user.
4. Check the `Global Key (allow all actions)` option to get the permissions needed to access admin reports.

### Queries

There are two types of queries - Reports and User. The ability to do queries is limited but using the Transformations feature, you can manipulate or do maths on the returned data to do more powerful queries.

#### Report queries

The report queries are the reports that are available in the admin section in Discourse. For the example, the `Topics` report: `https://community.xxx.com/admin/reports/topics?end_date=2020-08-03&start_date=2020-07-03`

Having them in Grafana, allows you to combine multiple reports in one panel which cannot be done in Discourse. The included dashboard uses the `Topics` report and the `Topics with no reply` report to visualize how many topics are getting replies in one panel.

#### User queries

There are two user queries - the Top Public Users query and the Staff query. This return statistics on individual users in a table format.

#### An example of using transformations

The statistics for topics from the [Grafana Community site](https://play.grafana.org/d/aMaVTeVGz/community-site-topics-and-replies?tab=transform&editPanel=2&orgId=1) is a more advanced example of what you can do with transformations.

The goal is to take two queries, total the results over a time period and then subtract one from the other and we will use the [transformations](https://grafana.com/docs/grafana/latest/panels/transformations/) feature in Grafana to achieve this.

1. Start with two queries - Topics and Topics with no replies and choose the Stat visualization. In the Panel options, change the `Calculation` to `Total` and change the `Orientation` to `Horizontal`.
2. Switch to the transformations tab and add two `Add field from calculation` transformations and reduce the two fields, `Topics` and `Topics with no replies`. We do this in case we have any gaps in the data to avoid NaN errors. Use the `Reduce row` mode and choose the `Total` calculation. Choose an appropriate alias for each. You should now see four stats, the two original fields and the two reduced fields.

   ![two_reduces](https://raw.githubusercontent.com/grafana/discourse-datasource/master/src/img/transformations-tworeduce.png)

3. Add a third `Add field from calculation` transformation and choose `Binary operation` as `Mode`. For the maths operation, choose your two reduced fields and the minus operation.

   ![binaryop_math](https://raw.githubusercontent.com/grafana/discourse-datasource/master/src/img/transformations-binaryop.png)

4. Now you should have five stats and we only want to show three and hide the calculated fields. Hide the fields you don't want to show by adding a `Organize fields` transformation.

   ![organize_fields](https://raw.githubusercontent.com/grafana/discourse-datasource/master/src/img/transformations-organize.png)

## Developer Guide

There is a [developer guide](https://github.com/grafana/discourse-datasource/blob/master/DEV-GUIDE.md) with instructions for building the plugin.
