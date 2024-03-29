const reports: any = {
  reports: [
    {
      type: 'accepted_solutions',
      title: 'Accepted solutions',
      description: null,
      description_link: null,
    },
    {
      type: 'staff_logins',
      title: 'Admin Logins',
      description: 'List of admin login times with locations.',
      description_link: null,
    },
    {
      type: 'page_view_anon_reqs',
      title: 'Anonymous',
      description: 'Number of new pageviews by visitors not logged in to an account.',
      description_link: null,
    },
    {
      type: 'bookmarks',
      title: 'Bookmarks',
      description: 'Number of new topics and posts bookmarked.',
      description_link: null,
    },
    {
      type: 'consolidated_page_views',
      title: 'Consolidated Pageviews',
      description: 'Pageviews for logged in users, anonymous users and crawlers.',
      description_link: null,
    },
    {
      type: 'dau_by_mau',
      title: 'DAU/MAU',
      description:
        "Number of members that logged in in the last day divided by number of members that logged in in the last month – returns a % which indicates community 'stickiness'. Aim for >30%.",
      description_link: null,
    },
    {
      type: 'daily_engaged_users',
      title: 'Daily Engaged Users',
      description: 'Number of users that have liked or posted in the last day.',
      description_link: null,
    },
    {
      type: 'emails',
      title: 'Emails Sent',
      description: 'Number of new emails sent.',
      description_link: null,
    },
    {
      type: 'flags',
      title: 'Flags',
      description: 'Number of new flags.',
      description_link: null,
    },
    {
      type: 'flags_status',
      title: 'Flags Status',
      description: "List of flags' statuses including type of flag, poster, flagger, and time to resolution.",
      description_link: null,
    },
    {
      type: 'likes',
      title: 'Likes',
      description: 'Number of new likes.',
      description_link: null,
    },
    {
      type: 'page_view_logged_in_reqs',
      title: 'Logged In',
      description: 'Number of new pageviews from logged in users.',
      description_link: null,
    },
    {
      type: 'moderators_activity',
      title: 'Moderator Activity',
      description:
        'List of moderator activity including flags reviewed, reading time, topics created, posts created, personal messages created, and revisions.',
      description_link: null,
    },
    {
      type: 'moderator_warning_private_messages',
      title: 'Moderator Warning',
      description: 'Number of warnings sent by personal messages from moderators.',
      description_link: null,
    },
    {
      type: 'new_contributors',
      title: 'New Contributors',
      description: 'Number of users who made their first post during this period.',
      description_link: null,
    },
    {
      type: 'notify_moderators_private_messages',
      title: 'Notify Moderators',
      description: 'Number of times moderators have been privately notified by a flag.',
      description_link: null,
    },
    {
      type: 'notify_user_private_messages',
      title: 'Notify User',
      description: 'Number of times users have been privately notified by a flag.',
      description_link: null,
    },
    {
      type: 'page_view_total_reqs',
      title: 'Pageviews',
      description: 'Number of new pageviews from all visitors.',
      description_link: null,
    },
    {
      type: 'post_edits',
      title: 'Post Edits',
      description: 'Number of new post edits.',
      description_link: null,
    },
    {
      type: 'posts',
      title: 'Posts',
      description: 'New posts created during this period',
      description_link: null,
    },
    {
      type: 'signups',
      title: 'Signups',
      description: 'New account registrations for this period.',
      description_link: null,
    },
    {
      type: 'suspicious_logins',
      title: 'Suspicious Logins',
      description: 'Details of new logins that differ suspiciously from previous logins.',
      description_link: null,
    },
    {
      type: 'system_private_messages',
      title: 'System',
      description: 'Number of personal messages sent automatically by the System.',
      description_link: null,
    },
    {
      type: 'time_to_first_response',
      title: 'Time to first response',
      description: 'Average time (in hours) of the first response to new topics.',
      description_link: null,
    },
    {
      type: 'top_ignored_users',
      title: 'Top Ignored / Muted Users',
      description: 'Users who have been muted and/or ignored by many other users.',
      description_link: null,
    },
    {
      type: 'top_referred_topics',
      title: 'Top Referred Topics',
      description: 'Topics that have received the most clicks from external sources.',
      description_link: null,
    },
    {
      type: 'top_referrers',
      title: 'Top Referrers',
      description: 'Users listed by number of clicks on links they have shared.',
      description_link: null,
    },
    {
      type: 'top_traffic_sources',
      title: 'Top Traffic Sources',
      description: 'External sources that have linked to this site the most.',
      description_link: null,
    },
    {
      type: 'top_uploads',
      title: 'Top Uploads',
      description: 'List all uploads by extension, filesize and author.',
      description_link: null,
    },
    {
      type: 'topics',
      title: 'Topics',
      description: 'New topics created during this period.',
      description_link: null,
    },
    {
      type: 'topics_with_no_response',
      title: 'Topics with no response',
      description: 'Number of new topics created that did not receive a response.',
      description_link: null,
    },
    {
      type: 'trending_search',
      title: 'Trending Search Terms',
      description: 'Most popular search terms with their click-through rates.',
      description_link: null,
    },
    {
      type: 'trust_level_growth',
      title: 'Trust Level growth',
      description: 'Number of users who increased their Trust Level during this period.',
      description_link: null,
    },
    {
      type: 'user_flagging_ratio',
      title: 'User Flagging Ratio',
      description: 'List of users ordered by ratio of staff response to their flags (disagreed to agreed).',
      description_link: null,
    },
    {
      type: 'profile_views',
      title: 'User Profile Views',
      description: 'Total new views of user profiles.',
      description_link: null,
    },
    {
      type: 'visits',
      title: 'User Visits',
      description: 'Number of all user visits.',
      description_link: null,
    },
    {
      type: 'mobile_visits',
      title: 'User Visits (mobile)',
      description: 'Number of unique users who visited using a mobile device.',
      description_link: null,
    },
    {
      type: 'user_to_user_private_messages',
      title: 'User-to-User (excluding replies)',
      description: 'Number of newly initiated personal messages.',
      description_link: null,
    },
    {
      type: 'user_to_user_private_messages_with_replies',
      title: 'User-to-User (with replies)',
      description: 'Number of all new personal messages and responses.',
      description_link: null,
    },
    {
      type: 'users_by_trust_level',
      title: 'Users per Trust Level',
      description: 'Number of users grouped by trust level.',
      description_link: 'https://blog.discourse.org/2018/06/understanding-discourse-trust-levels/',
    },
    {
      type: 'users_by_type',
      title: 'Users per Type',
      description: 'Number of users grouped by admin, moderator, suspended, and silenced.',
      description_link: null,
    },
    {
      type: 'page_view_crawler_reqs',
      title: 'Web Crawler Pageviews',
      description: 'Total pageviews from web crawlers over time.',
      description_link: null,
    },
    {
      type: 'web_crawlers',
      title: 'Web Crawler User Agents',
      description: 'List of web crawler user agents, sorted by pageviews.',
      description_link: null,
    },
  ],
};

export { reports };
