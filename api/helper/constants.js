import dotenv from "dotenv";
dotenv.config();

export const SOCIAL_MEDIA = {
  LINKEDIN: "linkedin",
  TWITTER: "twitter",
  META: "meta",
  GOOGLE: "google",
};

export const LINKEDIN = {
  AUTHORIZE_URL: "https://www.linkedin.com/oauth/v2/authorization",
  SCOPES: "w_member_social openid profile email",
  ACCESS_TOKEN_URL: "https://www.linkedin.com/oauth/v2/accessToken",
  API_URL: "https://api.linkedin.com/v2",
  get PROFILE_URL() {
    return `${LINKEDIN.API_URL}/userinfo`;
  },
  LINKEDIN_IMAGE_RECIPE: "urn:li:digitalmediaRecipe:feedshare-image",
  LINKEDIN_VIDEO_RECIPE: "urn:li:digitalmediaRecipe:feedshare-video",
  LINKEDIN_UGC_ENDPOINT: "/ugcPosts",
};

export const META = {
  AUTHORIZE_URL: "https://www.facebook.com/v21.0/dialog/oauth",
  SCOPES:
    "pages_show_list, pages_read_engagement, pages_manage_posts, pages_manage_engagement, publish_video, pages_manage_metadata, read_insights, ads_management,ads_read,business_management,instagram_basic,instagram_manage_insights,instagram_content_publish,pages_read_user_content,instagram_manage_comments",
  GRAPH_API: "https://graph.facebook.com/v21.0",
  METRICS: [
    // "page_impressions", // total visitors
    "page_impressions_unique",
    "page_post_engagements",
    "page_fans", //The total number of people who liked your page.
    // "page_fan_removes", //The total number of people who unliked your page.
    "page_daily_unfollows_unique",
    "page_follows", //​People who follow your page.
    "page_views_total", //The total number of people who visited your page.
    // "page_actions_post_reactions_like_total",
    // "post_shares",
    // "video_views",
    // "page_followers",
    // "page_unfollowers",
    // "page_fans_gender",
    // "page_fans_gender_age",
  ],
};

export const PERIODS = {
  DAY: "day",
  DAYS_28: "days_28",
};
export const TWITTER = {
  REQUEST_TOKEN_URL: "https://api.twitter.com/oauth/request_token",
  ACCESS_TOKEN_URL: "https://api.twitter.com/oauth/access_token",
  AUTHORIZE_URL: "https://api.twitter.com/oauth/authorize",
};

export const Admin = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASS,
};
