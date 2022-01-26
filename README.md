# Grafana Discourse data source

[![License](https://img.shields.io/github/license/grafana/discourse-datasource)](LICENSE)
![GitHub Actions CI](https://github.com/grafana/discourse-datasource/actions/workflows/ci.yml/badge.svg)

The Discourse data source plugin allows users to search and view topics, posts, users, tags, categories, and reports on a given Discourse forum. It uses 5 different queries; 3 are public while 2 require an API key:

- **Reports**
    - requires an API key
    
    - grants access to the 40+ reports available to Discourse Admins

- **Users**
    - requires an API key **but only when searching `staff`**. Otherwise, public.
    
    - returns top users

- **Tags (Overview)**
    - public
    
    - returns general data for all tags

- **Tag (Detailed)**
    - public
    
    - drills down into details and posts related to a specific tag
    
- **Search**
    - public
    
    - a near-complete replica of the Discourse expanded search UI ([like this one](https://community.grafana.com/search?expanded=true))

In other words, you can connect this plugin to any public Discourse forum and query everything except the `reporting` and `staff users` features. With an API key, you can access these last two.

## Demo

[Demo dashboard for Topics and Replies](https://play.grafana.org/d/aMaVTeVGz/community-site-topics-and-replies?orgId=1)

The dashboard above is used to track some statistics for the [hosted Discourse website for Grafana](https://community.grafana.com/).

## Configuring the Data Source WITHOUT an API Key

1. Find the `HTTP` section in the plugin's configuration editor. For the `URL` input box, enter the URL for your Discourse instance or another public Discourse instance. For example, `https://community.grafana.com/`, or `https://meta.discourse.org/`

![add URL](https://raw.githubusercontent.com/grafana/discourse-datasource/master/src/img/add-discourse-url.png)

2. press `Test and Save`

## Configuring the Data Source WITH an API Key

1. **Create an API key in hosted Discourse**
    
    1. Navigate to the Admin -> API -> Keys section and click on the New API Key button.
    2. Fill in a description for the new key.
    3. Choose the User Level - either `All Users` or a specific single user.
    4. Check the `Global Key (allow all actions)` option to get the permissions needed to access admin reports.
    5. Save the key and copy it to your clipboard

2. **Add the API key and Username to the Discourse Configuration**

    1. Scroll down to the `Custom HTTP Headers` section of the plugin configuration page.
    2. Click `Add header`
    3. Enter `Api-Key` and then paste your new API key as the `value`. (NOTE: `Api-Key` is case sensitive)
    3. Click `Add header` again.
    4. Enter `Api-Username` and then enter the username associated with your API Key **OR** enter `system` if you chose the `All Users` option for the `User Level`.

    ![add headers](https://raw.githubusercontent.com/grafana/discourse-datasource/master/src/img/add-discourse-headers.png)

3. **Click `Test and Save`**

4. **Create a new panel, add the datasource, and verify that the `Reports` feature works.**

## Creating Queries

There are five types of queries - Reports, Users, Tags, Tag, and Search. The ability to do queries is limited but using the Transformations feature, you can manipulate or do maths on the returned data to do more powerful queries.

### Report queries

The report queries are the reports that are available in the admin section in Discourse. For the example, the `Topics` report: `https://community.xxx.com/admin/reports/topics?end_date=2020-08-03&start_date=2020-07-03`

Using Grafana you can combine multiple reports in one panel, which you cannot do in Discourse. The included dashboard uses the `Topics` report and the `Topics with no reply` report to visualize how many topics are getting replies in one panel.

### User queries

There are two user queries - the Top Public Users query and the Staff query. This return statistics on individual users in a table format.

### Tags (General) queries

This query returns general statistics for every tag in a discourse instance

### Tag (Specific) queries

This query allows you to drill down into a specific tag. It will return topics that include the chosen tag in a table format.

### Search queries

This query allows you to perform expanded searches into Discourse, exactly like you can using the internal search feature. You can search topics, posts, tags, and users. The topics & posts query includes many optional parameters, just like Discourse's internal expanded search.

## An Example of Using Transformations

The statistics for topics from the [Grafana Community site](https://play.grafana.org/d/aMaVTeVGz/community-site-topics-and-replies?tab=transform&editPanel=2&orgId=1) is a more advanced example of what you can do with transformations.

The goal is to take two queries, total the results over a time period and then subtract one from the other and we will use the [transformations](https://grafana.com/docs/grafana/latest/panels/transformations/) feature in Grafana to achieve this.

1. Start with two queries - Topics and Topics with no replies and choose the Stat visualization. In the Panel options, change the `Calculation` to `Total` and change the `Orientation` to `Horizontal`.
2. Switch to the transformations tab and add two `Add field from calculation` transformations and reduce the two fields, `Topics` and `Topics with no replies`. We do this in case we have any gaps in the data to avoid NaN errors. Use the `Reduce row` mode and choose the `Total` calculation. Choose an appropriate alias for each. You should now see four stats, the two original fields and the two reduced fields.

   ![two_reduces](https://raw.githubusercontent.com/grafana/discourse-datasource/master/src/img/transformations-tworeduce.png)

3. Add a third `Add field from calculation` transformation and choose `Binary operation` as `Mode`. For the maths operation, choose your two reduced fields and the minus operation.

   ![binaryop_math](https://raw.githubusercontent.com/grafana/discourse-datasource/master/src/img/transformations-binaryop.png)

4. Now you should have five stats and we only want to show three and hide the calculated fields. Hide the fields you don't want to show by adding a `Organize fields` transformation.

   ![organize_fields](https://raw.githubusercontent.com/grafana/discourse-datasource/master/src/img/transformations-organize.png)
