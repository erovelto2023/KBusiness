
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Programs from "./pages/Programs";
import Links from "./pages/Links";
import EmailSwipes from "./pages/EmailSwipes";
import Banners from "./pages/Banners";
import ProductReviews from "./pages/ProductReviews";
import PPCAds from "./pages/PPCAds";
import AutoresponderSequences from "./pages/AutoresponderSequences";
import QandA from "./pages/QandA";
import PromptLibrary from "./pages/PromptLibrary";
import Sales from "./pages/Sales";
import SalesManager from "./pages/SalesManager";
import Manage from "./pages/Manage";
import Tools from "./pages/Tools";
import ManagePrograms from "./pages/ManagePrograms";

import NotFound from "./pages/NotFound";
import LMSRoutes from "./pages/lms";
import PinterestKeywordTool from "./pages/PinterestKeywordTool";
import PinterestInspector from "./pages/PinterestInspector";
import PinterestScheduler from "./pages/PinterestScheduler";
import PinterestSelectImage from "./pages/PinterestSelectImage";
import PinterestCreatePost from "./pages/PinterestCreatePost";
import InsightsAnalyzer from "./pages/InsightsAnalyzer";
import AmazonProductFinder from "./pages/AmazonProductFinder";
import Forum from "./pages/Forum";
import Classes from "./pages/Classes";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminClasses from "./pages/admin/Classes";
import AdminCourses from "./pages/admin/Courses";
import CourseModulesPage from "./pages/admin/modules/[courseId]";
import ModuleLessonsPage from "./pages/admin/modules/[moduleId]";
import LessonPreview from "./pages/student/LessonPreview";
import QuizBuilder from "./pages/admin/QuizBuilder";
import CourseBuilder from "./pages/admin/CourseBuilder";
import AdminLessons from "./pages/admin/Lessons";
import AdminAssignments from "./pages/admin/Assignments";

import BlogManager from "./pages/admin/BlogManager";
import BlogPostEditor from "./pages/admin/BlogPostEditor";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";


import BlogArticleWizard from "./pages/scripts/BlogArticleWizard";
import BlogArticleIdeas from "./pages/scripts/BlogArticleIdeas";
import BlogArticleIntros from "./pages/scripts/BlogArticleIntros";
import BlogArticleOutlines from "./pages/scripts/BlogArticleOutlines";
import BlogArticleTitles from "./pages/scripts/BlogArticleTitles";
import BusinessLetter from "./pages/scripts/business-letter";
import CallToAction from "./pages/scripts/call-to-action";
import CharityOrCommunityInvolvementPressRelease from "./pages/scripts/charity-or-community-involvement-press-release";
import CitationsGenerator from "./pages/scripts/citations-generator";
import ColdOutreachEmail from "./pages/scripts/cold-outreach-email";
import ComplaintLetter from "./pages/scripts/complaint-letter";
import ConclusionsScript from "./pages/scripts/conclusions-script";
import ContentRewriter from "./pages/scripts/content-rewriter";
import CreateDisclaimer from "./pages/scripts/CreateDisclaimer";
import CreateChapters from "./pages/scripts/CreateChapters";
import CreateChaptersAndTOC from "./pages/scripts/CreateChaptersAndTOC";
import CreativeStory from "./pages/scripts/creative-story";
import CrisisOrIssuePressRelease from "./pages/scripts/crisis-or-issue-press-release";
import DigitalProductIdeas from "./pages/scripts/DigitalProductIdeas";
import DigitalProductReview from "./pages/scripts/digital-product-review";
import DigitalProductVideos from "./pages/scripts/digital-product-videos";
import DomainNameIdeas from "./pages/scripts/DomainNameIdeas";
import EbookAuthorBio from "./pages/scripts/ebook-author-bio";
import EbookCallToActions from "./pages/scripts/ebook-call-to-actions";
import EbookConclusion from "./pages/scripts/ebook-conclusion";
import EbookHeadlineAndSubheadline from "./pages/scripts/ebook-headline-and-subheadline";
import EbookIntroduction from "./pages/scripts/ebook-introduction";
import EbookIdeas from "./pages/scripts/EbookIdeas";
import EmailSubjectLines from "./pages/scripts/email-subject-lines";
import EngagingQuestions from "./pages/scripts/engaging-questions";
import EventPressRelease from "./pages/scripts/event-press-release";
import FacebookAdVideo from "./pages/scripts/facebook-ad-video";
import FacebookAds from "./pages/scripts/facebook-ads";
import FAQGenerator from "./pages/scripts/faq-generator";
import FeatureBenefitLists from "./pages/scripts/feature-benefit-lists";
import FinancialOrEarningsPressRelease from "./pages/scripts/financial-or-earnings-press-release";
import FindANiche from "./pages/scripts/find-a-niche";
import GenerateBusinessIdeas from "./pages/scripts/generate-business-ideas";
import GenerateBusinessPlan from "./pages/scripts/GenerateBusinessPlan";
import GenerateDigitalProductIdea from "./pages/scripts/generate-digital-product-idea";
import GenerateDomainNameIdeas from "./pages/scripts/generate-domain-name-ideas";
import GeneratePhysicalProductIdeas from "./pages/scripts/generate-physical-product-ideas";
import GeneralAdvertisement from "./pages/scripts/general-advertisement";
import GeneralNewsRelease from "./pages/scripts/general-news-release";
import GeneralSupportScript from "./pages/scripts/general-support-script";
import GetAnEbookIdea from "./pages/scripts/get-an-ebook-idea";
import GoogleAds from "./pages/scripts/google-ads";
import GrowthIdeas from "./pages/scripts/growth-ideas";
import Guarantees from "./pages/scripts/Guarantees";
import Headlines from "./pages/scripts/Headlines";
import InstagramCaption from "./pages/scripts/instagram-caption";
import InstagramReals from "./pages/scripts/instagram-reals";
import InvitationLetter from "./pages/scripts/InvitationLetter";
import InvestigateAParticularNiche from "./pages/scripts/investigate-a-particular-niche";
import KeywordExtractor from "./pages/scripts/KeywordExtractor";
import KeywordResearch from "./pages/scripts/KeywordResearch";
import LegalOrRegulatoryPressRelease from "./pages/scripts/LegalOrRegulatoryPressRelease";
import LinkedInAds from "./pages/scripts/LinkedInAds";
import LinkedInPost from "./pages/scripts/LinkedInPost";
import ListicleIdeas from "./pages/scripts/ListicleIdeas";
import LongSalesCopy from "./pages/scripts/LongSalesCopy";
import MakeItEasyToRead from "./pages/scripts/MakeItEasyToRead";
import MiniVSO from "./pages/scripts/MiniVSO";
import NewsAnnouncementEmail from "./pages/scripts/NewsAnnouncementEmail";
import NicheIdeas from "./pages/scripts/NicheIdeas";
import OptinPage from "./pages/scripts/OptinPage";
import ParagraphScript from "./pages/scripts/ParagraphScript";
import PersonalBio from "./pages/scripts/PersonalBio";
import PersonalLetter from "./pages/scripts/PersonalLetter";
import PhysicalProductReview from "./pages/scripts/PhysicalProductReview";
import PhysicalProductVideo from "./pages/scripts/PhysicalProductVideo";
import PinterestPinTitleAndDescription from "./pages/scripts/PinterestPinTitleAndDescription";
import PodcastInterviewQuestions from "./pages/scripts/PodcastInterviewQuestions";
import PodcastScript from "./pages/scripts/PodcastScript";
import ProductDescription from "./pages/scripts/ProductDescription";
import ProductFeaturesBullets from "./pages/scripts/ProductFeaturesBullets";
import ProductLaunchPressRelease from "./pages/scripts/ProductLaunchPressRelease";
import ProductNames from "./pages/scripts/ProductNames";
import ProductOrServicePromotion from "./pages/scripts/ProductOrServicePromotion";
import ProductServiceAccess from "./pages/scripts/ProductServiceAccess";
import PSAFramework from "./pages/scripts/PSAFramework";
import QuoraAnswers from "./pages/scripts/QuoraAnswers";
import RealEstateListingDescriptions from "./pages/scripts/RealEstateListingDescriptions";
import ReferenceRecommendationLetter from "./pages/scripts/ReferenceRecommendationLetter";
import ResignationLetter from "./pages/scripts/ResignationLetter";
import RewriteWithKeywords from "./pages/scripts/RewriteWithKeywords";
import SEOMetaDescriptions from "./pages/scripts/SEOMetaDescriptions";
import SEOMetaTags from "./pages/scripts/SEOMetaTags";
import ShortAdVideo from "./pages/scripts/ShortAdVideo";
import ShortBlogArticle from "./pages/scripts/ShortBlogArticle";
import ShortSalesCopy from "./pages/scripts/ShortSalesCopy";
import SocialMediaContentPlan from "./pages/scripts/SocialMediaContentPlan";
import SongLyrics from "./pages/scripts/SongLyrics";
import StaffOrExecutiveAnnouncementPressRelease from "./pages/scripts/StaffOrExecutiveAnnouncementPressRelease";
import StartupIdeas from "./pages/scripts/StartupIdeas";
import SubHeadlines from "./pages/scripts/SubHeadlines";
import SummarizeText from "./pages/scripts/SummarizeText";
import SupportAutoresponderMessage from "./pages/scripts/SupportAutoresponderMessage";
import SupportSolutionForAProblem from "./pages/scripts/SupportSolutionForAProblem";
import ThankYouLetter from "./pages/scripts/ThankYouLetter";
import TikTokVideoHooks from "./pages/scripts/TikTokVideoHooks";
import TikTokVideoIdeas from "./pages/scripts/TikTokVideoIdeas";
import TikTokVideoScript from "./pages/scripts/TikTokVideoScript";
import ToneChanger from "./pages/scripts/ToneChanger";
import Translate from "./pages/scripts/Translate";
import TrendingInstagramHashtags from "./pages/scripts/TrendingInstagramHashtags";
import TrendingTwitterHashtags from "./pages/scripts/TrendingTwitterHashtags";
import TutorialVideo from "./pages/scripts/TutorialVideo";
import TwitterSeries from "./pages/scripts/TwitterSeries";
import TwitterTweets from "./pages/scripts/TwitterTweets";
import UniqueValueProposition from "./pages/scripts/UniqueValueProposition";
import YoutubeDescriptions from "./pages/scripts/YoutubeDescriptions";
import YoutubeHashtags from "./pages/scripts/YoutubeHashtags";
import YoutubeHooks from "./pages/scripts/YoutubeHooks";
import YoutubeOutlines from "./pages/scripts/YoutubeOutlines";
import YoutubeScript from "./pages/scripts/YoutubeScript";
import YoutubeShorts from "./pages/scripts/YoutubeShorts";
import YoutubeTags from "./pages/scripts/YoutubeTags";
import PoemGenerator from "./pages/scripts/PoemGenerator";
import QuotesGenerator from "./pages/scripts/QuotesGenerator";
import ReviewResponder from "./pages/scripts/ReviewResponder";
// TikTok/Youtube/social/utility tool imports
// Facebook/general tool imports
// eBook/email/event tool imports
// Creative/digital product tool imports
// Batch tool imports
// Blog and business letter tool imports
import AIDAFrameworkPage from "./pages/aida-framework";
import AmazonProductDescriptionPage from "./pages/amazon-product-description";

import AmazonProductFeaturesBullets from "./pages/scripts/AmazonProductFeaturesBullets";
import AmazonProductFeaturesBulletsPage from "./pages/amazon-product-features-bullets";
import AmazonProductTitlesPage from "./pages/amazon-product-titles";
import AmazonSponsoredBrandAdsHeadline from "./pages/scripts/AmazonSponsoredBrandAdsHeadline";
import AmazonSponsoredBrandAdsHeadlinePage from "./pages/amazon-sponsored-brand-ads-headline";
import AnalyzeGivenContent from "./pages/scripts/AnalyzeGivenContent";
import AnalyzeGivenContentPage from "./pages/analyze-given-content";
import AnnouncementVideo from "./pages/scripts/AnnouncementVideo";
import AnnouncementVideoPage from "./pages/announcement-video";
import AppAndSMSNotifications from "./pages/scripts/AppAndSMSNotifications";
import AppAndSMSNotificationsPage from "./pages/app-and-sms-notifications";
import AutoresponderSeries from "./pages/scripts/AutoresponderSeries";
import AutoresponderSeriesPage from "./pages/autoresponder-series";
import AwardAnnouncementPressRelease from "./pages/scripts/AwardAnnouncementPressRelease";
import AwardAnnouncementPressReleasePage from "./pages/award-announcement-press-release";
import BlogArticleIdeasPage from "./pages/blog-article-ideas";
import BlogArticleIntrosPage from "./pages/blog-article-intros";
// Add more tool imports as you scaffold pages


const Placeholder = (props: { title: string }) => (
  <div style={{ padding: 32, background: '#fafbfc', minHeight: '100vh' }}>
    <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>{props.title}</h1>
    <p>This page will host the {props.title} tool.</p>
  </div>
);


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/lms/*" element={<LMSRoutes />} />




          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/links" element={<Links />} />
          <Route path="/email-swipes" element={<EmailSwipes />} />
          <Route path="/banners" element={<Banners />} />
          <Route path="/product-reviews" element={<ProductReviews />} />
          <Route path="/ppc-ads" element={<PPCAds />} />
          <Route path="/autoresponder-sequences" element={<AutoresponderSequences />} />
          <Route path="/q-and-a" element={<QandA />} />
          <Route path="/prompt-library" element={<PromptLibrary />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/sales-manager" element={<SalesManager />} />
          <Route path="/manage" element={<Manage />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/manage-programs" element={<ManagePrograms />} />
          <Route path="/pinterest-inspector" element={<PinterestInspector />} />
          <Route path="/pinterest-scheduler" element={<PinterestScheduler />} />
          <Route path="/pinterest-select-image" element={<PinterestSelectImage />} />
          <Route path="/pinterest-create-post" element={<PinterestCreatePost />} />
          <Route path="/insights-analyzer" element={<InsightsAnalyzer />} />
          <Route path="/amazon-product-finder" element={<AmazonProductFinder />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/classes" element={<Classes />} />

        {/* Admin Section */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/classes" element={<AdminClasses />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/admin/courses/:courseId/modules" element={<CourseModulesPage />} />
        <Route path="/admin/modules/:moduleId" element={<ModuleLessonsPage />} />
        <Route path="/student/lesson-preview" element={<LessonPreview />} />
        <Route path="/admin/quizbuilder" element={<QuizBuilder />} />
        <Route path="/admin/coursebuilder" element={<CourseBuilder />} />
        <Route path="/admin/lessons" element={<AdminLessons />} />
        <Route path="/admin/assignments" element={<AdminAssignments />} />
        <Route path="/admin/blogmanager" element={<BlogManager />} />
        <Route path="/admin/blogmanager/new" element={<BlogPostEditor />} />
        <Route path="/admin/blogmanager/edit/:id" element={<BlogPostEditor />} />

        <Route path="/scripts/blog-article-wizard" element={<BlogArticleWizard />} />
        <Route path="/scripts/blog-article-ideas" element={<BlogArticleIdeas />} />
        <Route path="/scripts/blog-article-intros" element={<BlogArticleIntros />} />
        <Route path="/scripts/blog-article-outlines" element={<BlogArticleOutlines />} />
        <Route path="/scripts/blog-article-titles" element={<BlogArticleTitles />} />
        <Route path="/scripts/business-letter" element={<BusinessLetter />} />
        <Route path="/scripts/call-to-action" element={<CallToAction />} />
        <Route path="/scripts/charity-or-community-involvement-press-release" element={<CharityOrCommunityInvolvementPressRelease />} />
        <Route path="/scripts/citations-generator" element={<CitationsGenerator />} />
        <Route path="/scripts/cold-outreach-email" element={<ColdOutreachEmail />} />
        <Route path="/scripts/complaint-letter" element={<ComplaintLetter />} />
        <Route path="/scripts/conclusions-script" element={<ConclusionsScript />} />
        <Route path="/scripts/content-rewriter" element={<ContentRewriter />} />
        <Route path="/scripts/create-disclaimer" element={<CreateDisclaimer />} />
        <Route path="/scripts/create-chapters" element={<CreateChapters />} />
        <Route path="/scripts/create-chapters-and-toc" element={<CreateChaptersAndTOC />} />
        <Route path="/scripts/creative-story" element={<CreativeStory />} />
        <Route path="/scripts/crisis-or-issue-press-release" element={<CrisisOrIssuePressRelease />} />
        <Route path="/scripts/digital-product-ideas" element={<DigitalProductIdeas />} />
        <Route path="/scripts/digital-product-review" element={<DigitalProductReview />} />
        <Route path="/scripts/digital-product-videos" element={<DigitalProductVideos />} />
        <Route path="/scripts/domain-name-ideas" element={<DomainNameIdeas />} />
<Route path="/scripts/aida-framework" element={<AIDAFrameworkPage />} />
        <Route path="/scripts/ebook-author-bio" element={<EbookAuthorBio />} />
        <Route path="/scripts/ebook-call-to-actions" element={<EbookCallToActions />} />
        <Route path="/scripts/ebook-conclusion" element={<EbookConclusion />} />
        <Route path="/scripts/ebook-headline-and-subheadline" element={<EbookHeadlineAndSubheadline />} />
        <Route path="/scripts/ebook-introduction" element={<EbookIntroduction />} />
        <Route path="/scripts/ebook-ideas" element={<EbookIdeas />} />
        <Route path="/scripts/email-subject-lines" element={<EmailSubjectLines />} />
        <Route path="/scripts/engaging-questions" element={<EngagingQuestions />} />
        <Route path="/scripts/event-press-release" element={<EventPressRelease />} />
        <Route path="/scripts/facebook-ad-video" element={<FacebookAdVideo />} />
        <Route path="/scripts/facebook-ads" element={<FacebookAds />} />
        <Route path="/scripts/faq-generator" element={<FAQGenerator />} />
        <Route path="/scripts/feature-benefit-lists" element={<FeatureBenefitLists />} />
        <Route path="/scripts/financial-or-earnings-press-release" element={<FinancialOrEarningsPressRelease />} />
        <Route path="/scripts/find-a-niche" element={<FindANiche />} />
        <Route path="/scripts/generate-business-ideas" element={<GenerateBusinessIdeas />} />
        <Route path="/scripts/generate-business-plan" element={<GenerateBusinessPlan />} />
        <Route path="/scripts/generate-digital-product-idea" element={<GenerateDigitalProductIdea />} />
        <Route path="/scripts/generate-domain-name-ideas" element={<GenerateDomainNameIdeas />} />
        <Route path="/scripts/generate-physical-product-ideas" element={<GeneratePhysicalProductIdeas />} />
        <Route path="/scripts/general-advertisement" element={<GeneralAdvertisement />} />
        <Route path="/scripts/general-news-release" element={<GeneralNewsRelease />} />
        <Route path="/scripts/general-support-script" element={<GeneralSupportScript />} />
        <Route path="/scripts/get-an-ebook-idea" element={<GetAnEbookIdea />} />
        <Route path="/scripts/google-ads" element={<GoogleAds />} />
        <Route path="/scripts/growth-ideas" element={<GrowthIdeas />} />
        <Route path="/scripts/guarantees" element={<Guarantees />} />
        <Route path="/scripts/headlines" element={<Headlines />} />
        <Route path="/scripts/instagram-caption" element={<InstagramCaption />} />
        <Route path="/scripts/instagram-reals" element={<InstagramReals />} />
        <Route path="/scripts/invitation-letter" element={<InvitationLetter />} />
        <Route path="/scripts/investigate-a-particular-niche" element={<InvestigateAParticularNiche />} />
        <Route path="/scripts/keyword-extractor" element={<KeywordExtractor />} />
        <Route path="/scripts/keyword-research" element={<KeywordResearch />} />
        <Route path="/scripts/legal-or-regulatory-press-release" element={<LegalOrRegulatoryPressRelease />} />
        <Route path="/scripts/linkedin-ads" element={<LinkedInAds />} />
        <Route path="/scripts/linkedin-post" element={<LinkedInPost />} />
        <Route path="/scripts/listicle-ideas" element={<ListicleIdeas />} />
        <Route path="/scripts/long-sales-copy" element={<LongSalesCopy />} />
        <Route path="/scripts/make-it-easy-to-read" element={<MakeItEasyToRead />} />
        <Route path="/scripts/mini-vso" element={<MiniVSO />} />
        <Route path="/scripts/news-announcement-email" element={<NewsAnnouncementEmail />} />
        <Route path="/scripts/niche-ideas" element={<NicheIdeas />} />
        <Route path="/scripts/optin-page" element={<OptinPage />} />
        <Route path="/scripts/paragraph-script" element={<ParagraphScript />} />
        <Route path="/scripts/personal-bio" element={<PersonalBio />} />
        <Route path="/scripts/personal-letter" element={<PersonalLetter />} />
        <Route path="/scripts/physical-product-review" element={<PhysicalProductReview />} />
        <Route path="/scripts/physical-product-video" element={<PhysicalProductVideo />} />
        <Route path="/scripts/pinterest-pin-title-and-description" element={<PinterestPinTitleAndDescription />} />
        <Route path="/scripts/podcast-interview-questions" element={<PodcastInterviewQuestions />} />
        <Route path="/scripts/podcast-script" element={<PodcastScript />} />
        <Route path="/scripts/product-description" element={<ProductDescription />} />
        <Route path="/scripts/product-features-bullets" element={<ProductFeaturesBullets />} />
        <Route path="/scripts/product-launch-press-release" element={<ProductLaunchPressRelease />} />
        <Route path="/scripts/product-names" element={<ProductNames />} />
        <Route path="/scripts/product-or-service-promotion" element={<ProductOrServicePromotion />} />
        <Route path="/scripts/product-service-access" element={<ProductServiceAccess />} />
        <Route path="/scripts/psa-framework" element={<PSAFramework />} />
        <Route path="/scripts/quora-answers" element={<QuoraAnswers />} />
        <Route path="/scripts/real-estate-listing-descriptions" element={<RealEstateListingDescriptions />} />
        <Route path="/scripts/reference-recommendation-letter" element={<ReferenceRecommendationLetter />} />
        <Route path="/scripts/resignation-letter" element={<ResignationLetter />} />
        <Route path="/scripts/rewrite-with-keywords" element={<RewriteWithKeywords />} />
        <Route path="/scripts/seo-meta-descriptions" element={<SEOMetaDescriptions />} />
        <Route path="/scripts/seo-meta-tags" element={<SEOMetaTags />} />
        <Route path="/scripts/short-ad-video" element={<ShortAdVideo />} />
        <Route path="/scripts/short-blog-article" element={<ShortBlogArticle />} />
        <Route path="/scripts/short-sales-copy" element={<ShortSalesCopy />} />
        <Route path="/scripts/social-media-content-plan" element={<SocialMediaContentPlan />} />
        <Route path="/scripts/song-lyrics" element={<SongLyrics />} />
        <Route path="/scripts/staff-or-executive-announcement-press-release" element={<StaffOrExecutiveAnnouncementPressRelease />} />
        <Route path="/scripts/startup-ideas" element={<StartupIdeas />} />
        <Route path="/scripts/sub-headlines" element={<SubHeadlines />} />
        <Route path="/scripts/summarize-text" element={<SummarizeText />} />
        <Route path="/scripts/support-autoresponder-message" element={<SupportAutoresponderMessage />} />
        <Route path="/scripts/support-solution-for-a-problem" element={<SupportSolutionForAProblem />} />
        <Route path="/scripts/thank-you-letter" element={<ThankYouLetter />} />
        <Route path="/scripts/tiktok-video-hooks" element={<TikTokVideoHooks />} />
        <Route path="/scripts/tiktok-video-ideas" element={<TikTokVideoIdeas />} />
        <Route path="/scripts/tiktok-video-script" element={<TikTokVideoScript />} />
        <Route path="/scripts/tone-changer" element={<ToneChanger />} />
        <Route path="/scripts/translate" element={<Translate />} />
        <Route path="/scripts/trending-instagram-hashtags" element={<TrendingInstagramHashtags />} />
        <Route path="/scripts/trending-twitter-hashtags" element={<TrendingTwitterHashtags />} />
        <Route path="/scripts/tutorial-video" element={<TutorialVideo />} />
        <Route path="/scripts/twitter-series" element={<TwitterSeries />} />
        <Route path="/scripts/twitter-tweets" element={<TwitterTweets />} />
        <Route path="/scripts/unique-value-proposition" element={<UniqueValueProposition />} />
        <Route path="/scripts/youtube-descriptions" element={<YoutubeDescriptions />} />
        <Route path="/scripts/youtube-hashtags" element={<YoutubeHashtags />} />
        <Route path="/scripts/youtube-hooks" element={<YoutubeHooks />} />
        <Route path="/scripts/youtube-outlines" element={<YoutubeOutlines />} />
        <Route path="/scripts/youtube-script" element={<YoutubeScript />} />
        <Route path="/scripts/youtube-shorts" element={<YoutubeShorts />} />
        <Route path="/scripts/youtube-tags" element={<YoutubeTags />} />
        
        <Route path="/scripts/poem-generator" element={<PoemGenerator />} />
        <Route path="/scripts/quotes-generator" element={<QuotesGenerator />} />
        <Route path="/scripts/review-responder" element={<ReviewResponder />} />
        {/* TikTok/Youtube/social/utility tool routes */}
        {/* Facebook/general tool routes */}
        {/* eBook/email/event tool routes */}
        {/* Creative/digital product tool routes */}
        {/* Batch tool routes */}
        {/* Blog and business letter tool routes */}
        <Route path="/scripts/aida-framework" element={<AIDAFrameworkPage />} />
      <Route path="/scripts/amazon-product-description" element={<AmazonProductDescriptionPage />} />
        <Route path="/scripts/amazon-product-features-bullets" element={<AmazonProductFeaturesBulletsPage />} />
        <Route path="/scripts/amazon-product-titles" element={<AmazonProductTitlesPage />} />
        <Route path="/scripts/amazon-sponsored-brand-ads-headline" element={<AmazonSponsoredBrandAdsHeadlinePage />} />
        <Route path="/scripts/analyze-given-content" element={<AnalyzeGivenContentPage />} />
        <Route path="/scripts/announcement-video" element={<AnnouncementVideoPage />} />
        <Route path="/scripts/app-and-sms-notifications" element={<AppAndSMSNotificationsPage />} />
        <Route path="/scripts/autoresponder-series" element={<AutoresponderSeriesPage />} />
        <Route path="/scripts/award-announcement-press-release" element={<AwardAnnouncementPressReleasePage />} />
        <Route path="/scripts/blog-article-ideas" element={<BlogArticleIdeasPage />} />
        <Route path="/scripts/blog-article-intros" element={<BlogArticleIntrosPage />} />
        {/* Add more tool routes as you scaffold pages */}
        <Route path="/scripts/instagram-reals" element={<InstagramReals />} />
          <Route path="/pinterest-annotations" element={<Placeholder title="Pinterest Annotations" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
