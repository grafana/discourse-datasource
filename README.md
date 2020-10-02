# Grafana Discourse data source

[![CircleCI](https://circleci.com/gh/grafana/discourse-datasource/tree/master.svg?style=svg)](https://circleci.com/gh/grafana/discourse-datasource/tree/master)

View report data and user data from a hosted Discourse instance in your Grafana.

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

There are two types of queries - Reports and User.

#### Report queries

The report queries are the reports that are available in the admin section in Discourse. For the example, the `Topics` report: https://community.xxx.com/admin/reports/topics?end_date=2020-08-03&start_date=2020-07-03

Having them in Grafana, allows you to combine multiple reports in one panel which cannot be done in Discourse. The included dashboard uses the `Topics` report and the `Topics with no reply` report to visualize how many topics are getting replies in one panel.

#### User queries

There are two user queries - the Top Public Users query and the Staff query. This return statistics on individual users in a table format.

## Developer Guide

There is a [developer guide](https://github.com/grafana/discourse-datasource/blob/master/DEV-GUIDE.md) with instructions for building the plugin.