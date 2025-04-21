import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import ScriptsCard from "./ScriptsCard";
import { collection, getDocs, getDoc, setDoc, updateDoc, deleteDoc, writeBatch, query, where, orderBy, limit, startAfter, doc, addDoc, DocumentData, QuerySnapshot } from "firebase/firestore";

// Define the program type (customize as needed)
type Program = {
  id?: string;
  name: string;
  description: string;
  url: string;
  [key: string]: any;
};

const PROGRAMS_COLLECTION = "programs";

import { useNavigate } from "react-router-dom";

const scriptCards = [
  { title: "AIDA Framework", description: "Generate AIDA (Attention, Interest, Desire, Action) copy for your content.", route: "/scripts/aida-framework" },
  { title: "Amazon Product Description", description: "Create compelling Amazon product descriptions.", route: "/scripts/amazon-product-description" },
  { title: "Amazon Product Features / Bullets", description: "Generate bullet points for Amazon listings.", route: "/scripts/amazon-product-features-bullets" },
  { title: "Amazon Product Titles", description: "Generate optimized Amazon product titles.", route: "/scripts/amazon-product-titles" },
  { title: "Amazon Sponsored Brand Ads Headline", description: "Create headlines for Amazon sponsored brand ads.", route: "/scripts/amazon-sponsored-brand-ads-headline" },
  { title: "Analyze Given Content", description: "Analyze content for insights and improvements.", route: "/scripts/analyze-given-content" },
  { title: "Announcement Video", description: "Script for announcement videos.", route: "/scripts/announcement-video" },
  { title: "App and SMS Notifications", description: "Generate notification messages for apps and SMS.", route: "/scripts/app-and-sms-notifications" },
  { title: "Autoresponder Series", description: "Create a series of autoresponder emails.", route: "/scripts/autoresponder-series" },
  { title: "Award Announcement Press Release", description: "Announce awards or recognitions received.", route: "/scripts/award-announcement-press-release" },
  { title: "Blog/Article Ideas", description: "Get creative ideas for your next blog or article.", route: "/scripts/blog-article-ideas" },
  { title: "Blog/Article Intros", description: "Craft engaging introductions for blogs or articles.", route: "/scripts/blog-article-intros" },
  { title: "Blog/Article Outlines", description: "Generate structured outlines for articles.", route: "/scripts/blog-article-outlines" },
  { title: "Blog/Article Titles", description: "Generate catchy titles for your content.", route: "/scripts/blog-article-titles" },
  { title: "Blog/Article Wizard", description: "Step-by-step wizard to create a full article.", route: "/scripts/blog-article-wizard" },
  { title: "Business Letter", description: "Write professional business letters.", route: "/scripts/business-letter" },
  { title: "Call to Action", description: "Create strong calls to action for any context.", route: "/scripts/call-to-action" },
  { title: "Charity or Community Involvement Press Release", description: "Announce charitable or community activities.", route: "/scripts/charity-or-community-involvement-press-release" },
  { title: "Citations Generator", description: "Generate citations for your work.", route: "/scripts/citations-generator" },
  { title: "Cold Outreach Email", description: "Write effective cold outreach emails.", route: "/scripts/cold-outreach-email" },
  { title: "Company Bio", description: "Create a compelling company biography.", route: "/scripts/company-bio" },
  { title: "Complaint Letter", description: "Draft a formal complaint letter.", route: "/scripts/complaint-letter" },
  { title: "Conclusions Script", description: "Write impactful conclusions for your content.", route: "/scripts/conclusions-script" },
  { title: "Content Rewriter", description: "Rewrite content for originality or clarity.", route: "/scripts/content-rewriter" },
  { title: "Cover Letter", description: "Create a cover letter for job applications.", route: "/scripts/cover-letter" },
  { title: "Creative Story", description: "Generate creative stories for entertainment or marketing.", route: "/scripts/creative-story" },
  { title: "Crisis or Issue Press Release", description: "Communicate actions or responses to a crisis.", route: "/scripts/crisis-or-issue-press-release" },
  { title: "Digital Product Review", description: "Review digital products effectively.", route: "/scripts/digital-product-review" },
  { title: "Digital Product Videos", description: "Script videos for digital products.", route: "/scripts/digital-product-videos" },
  { title: "Ebook Author Bio", description: "Write an author bio for your ebook.", route: "/scripts/ebook-author-bio" },
  { title: "Ebook Call to Actions", description: "Create calls to action for your ebook.", route: "/scripts/ebook-call-to-actions" },
  { title: "Ebook Conclusion", description: "Write a conclusion for your ebook.", route: "/scripts/ebook-conclusion" },
  { title: "Ebook Headline and Subheadline", description: "Generate headlines and subheadlines for your ebook.", route: "/scripts/ebook-headline-and-subheadline" },
  { title: "Ebook Introduction", description: "Write an introduction for your ebook.", route: "/scripts/ebook-introduction" },
  { title: "Email Subject Lines", description: "Craft attention-grabbing email subject lines.", route: "/scripts/email-subject-lines" },
  { title: "Engaging Questions", description: "Generate questions to engage your audience.", route: "/scripts/engaging-questions" },
  { title: "Event Press Release", description: "Announce events, seminars, or webinars.", route: "/scripts/event-press-release" },
  { title: "FAQ Generator", description: "Generate frequently asked questions for your topic.", route: "/scripts/faq-generator" },
  { title: "Facebook Ad Video", description: "Script for Facebook ad videos.", route: "/scripts/facebook-ad-video" },
  { title: "Facebook Ads", description: "Create effective Facebook ad copy.", route: "/scripts/facebook-ads" },
  { title: "Feature/Benefit Lists", description: "List features and benefits of your product.", route: "/scripts/feature-benefit-lists" },
  { title: "Find a Niche", description: "Identify a profitable niche for your business.", route: "/scripts/find-a-niche" },
  { title: "Financial or Earnings Press Release", description: "Report financial results or earnings.", route: "/scripts/financial-or-earnings-press-release" },
  { title: "General Advertisement", description: "Write general advertisements for any medium.", route: "/scripts/general-advertisement" },
  { title: "General News Release", description: "Announce general company news.", route: "/scripts/general-news-release" },
  { title: "General Support Script", description: "Provide support for general inquiries.", route: "/scripts/general-support-script" },
  { title: "Generate a Business Plan", description: "Create a detailed business plan.", route: "/scripts/generate-a-business-plan" },
  { title: "Generate Business Ideas", description: "Brainstorm new business ideas.", route: "/scripts/generate-business-ideas" },
  { title: "Generate Digital Product Idea", description: "Come up with digital product ideas.", route: "/scripts/generate-digital-product-idea" },
  { title: "Generate Domain Name Ideas", description: "Get ideas for domain names.", route: "/scripts/generate-domain-name-ideas" },
  { title: "Generate Physical Product Ideas", description: "Brainstorm physical product ideas.", route: "/scripts/generate-physical-product-ideas" },
  { title: "Get an Ebook Idea", description: "Generate ideas for your next ebook.", route: "/scripts/get-an-ebook-idea" },
  { title: "Google Ads", description: "Write ad copy for Google Ads.", route: "/scripts/google-ads" },
  { title: "Growth Ideas", description: "Find ideas to grow your business.", route: "/scripts/growth-ideas" },
  { title: "Guarantees", description: "Create guarantee statements for your offers.", route: "/scripts/guarantees" },
  { title: "Headlines", description: "Generate compelling headlines.", route: "/scripts/headlines" },
  { title: "Informational Email", description: "Write informative emails for your audience.", route: "/scripts/informational-email" },
  { title: "Informational Video", description: "Script for informational videos.", route: "/scripts/informational-video" },
  { title: "Instagram Caption", description: "Create captions for Instagram posts.", route: "/scripts/instagram-caption" },
  { title: "Instagram Reals", description: "Script for Instagram Reels videos.", route: "/scripts/instagram-reals" },
  { title: "Invitation Letter", description: "Draft a formal invitation letter.", route: "/scripts/invitation-letter" },
  { title: "Investigate a Particular Niche", description: "Research a specific niche in detail.", route: "/scripts/investigate-a-particular-niche" },
  { title: "Keyword Extractor", description: "Extract keywords from any content.", route: "/scripts/keyword-extractor" },
  { title: "Keyword Research", description: "Perform keyword research for SEO.", route: "/scripts/keyword-research" },
  { title: "Legal or Regulatory Press Release", description: "Announce legal or regulatory matters.", route: "/scripts/legal-or-regulatory-press-release" },
  { title: "LinkedIn Ads", description: "Create ad copy for LinkedIn.", route: "/scripts/linkedin-ads" },
  { title: "LinkedIn Post", description: "Write engaging LinkedIn posts.", route: "/scripts/linkedin-post" },
  { title: "Listicle Ideas", description: "Generate ideas for listicle articles.", route: "/scripts/listicle-ideas" },
  { title: "Long Sales Copy", description: "Write long-form sales copy.", route: "/scripts/long-sales-copy" },
  { title: "Make It Easy-to-Read", description: "Simplify content for readability.", route: "/scripts/make-it-easy-to-read" },
  { title: "Mini-VSO (Video Sales Letter)", description: "Script for mini video sales letters.", route: "/scripts/mini-vso-video-sales-letter" },
  { title: "News Announcement Email", description: "Announce news via email.", route: "/scripts/news-announcement-email" },
  { title: "Niche Ideas", description: "Get ideas for profitable niches.", route: "/scripts/niche-ideas" },
  { title: "Optin Page", description: "Create high-converting opt-in pages.", route: "/scripts/optin-page" },
  { title: "Paragraph Script", description: "Generate content for paragraphs.", route: "/scripts/paragraph-script" },
  { title: "Partner or Collaboration Press Release", description: "Announce partnerships or collaborations.", route: "/scripts/partner-or-collaboration-press-release" },
  { title: "Personal Bio", description: "Write a personal biography.", route: "/scripts/personal-bio" },
  { title: "Personal Letter", description: "Draft a personal letter for any occasion.", route: "/scripts/personal-letter" },
  { title: "Physical Product Review", description: "Review physical products.", route: "/scripts/physical-product-review" },
  { title: "Physical Product Video", description: "Script videos for physical products.", route: "/scripts/physical-product-video" },
  { title: "Pinterest Pin Title and Description", description: "Generate titles and descriptions for Pinterest pins.", route: "/scripts/pinterest-pin-title-and-description" },
  { title: "Podcast Interview Questions", description: "Prepare questions for podcast interviews.", route: "/scripts/podcast-interview-questions" },
  { title: "Podcast Script", description: "Script for podcast episodes.", route: "/scripts/podcast-script" },
  { title: "Poem Generator", description: "Generate poems for any topic.", route: "/scripts/poem-generator" },
  { title: "Press Release - Event", description: "Announce an event with a press release.", route: "/scripts/press-release-event" },
  { title: "Press Release - General News", description: "General news press release template.", route: "/scripts/press-release-general-news" },
  { title: "Press Release - Product Launch", description: "Announce a product launch.", route: "/scripts/press-release-product-launch" },
  { title: "Press Release - Staff/Executive Announcement", description: "Announce staff or executive changes.", route: "/scripts/press-release-staff-executive-announcement" },
  { title: "Press Release - Financial/Earnings", description: "Announce financial or earnings results.", route: "/scripts/press-release-financial-earnings" },
  { title: "Press Release - Legal/Regulatory", description: "Legal or regulatory press release.", route: "/scripts/press-release-legal-regulatory" },
  { title: "Press Release - Charity/Community", description: "Charity or community involvement press release.", route: "/scripts/press-release-charity-community" },
  { title: "Press Release - Crisis/Issue", description: "Crisis or issue press release.", route: "/scripts/press-release-crisis-issue" },
  { title: "Press Release - Award Announcement", description: "Award announcement press release.", route: "/scripts/press-release-award-announcement" },
  { title: "Product Description", description: "Write product descriptions for any platform.", route: "/scripts/product-description" },
  { title: "Product Features/Bullets", description: "List features or bullet points for products.", route: "/scripts/product-features-bullets" },
  { title: "Product Launch Press Release", description: "Announce a product launch with a press release.", route: "/scripts/product-launch-press-release" },
  { title: "Product Names", description: "Generate creative product names.", route: "/scripts/product-names" },
  { title: "Product or Service Promotion", description: "Promote a product or service via email.", route: "/scripts/product-or-service-promotion" },
  { title: "Product Titles", description: "Create titles for products.", route: "/scripts/product-titles" },
  { title: "Product Updates Email", description: "Announce product updates via email.", route: "/scripts/product-updates-email" },
  { title: "PSA Framework", description: "Generate PSA (Problem, Solution, Action) copy.", route: "/scripts/psa-framework" },
  { title: "Quora Answers", description: "Write answers for Quora questions.", route: "/scripts/quora-answers" },
  { title: "Quotes Generator", description: "Generate inspirational or motivational quotes.", route: "/scripts/quotes-generator" },
  { title: "Reference / Recommendation Letter", description: "Write a reference or recommendation letter.", route: "/scripts/reference-recommendation-letter" },
  { title: "Resignation Letter", description: "Draft a resignation letter for any job.", route: "/scripts/resignation-letter" },
  { title: "Review Responder", description: "Respond to customer reviews professionally.", route: "/scripts/review-responder" },
  { title: "Rewrite With Keywords", description: "Rewrite content to include specific keywords.", route: "/scripts/rewrite-with-keywords" },
  { title: "SEO Meta Descriptions", description: "Generate meta descriptions for SEO.", route: "/scripts/seo-meta-descriptions" },
  { title: "SEO Meta Tags", description: "Generate SEO meta tags for your website.", route: "/scripts/seo-meta-tags" },
  { title: "Short Ad Video", description: "Script for short advertisement videos.", route: "/scripts/short-ad-video" },
  { title: "Short Blog/Article", description: "Generate short blog posts or articles.", route: "/scripts/short-blog-article" },
  { title: "Short Sales Copy", description: "Write short-form sales copy.", route: "/scripts/short-sales-copy" },
  { title: "Social Media Content Plan", description: "Plan content for social media channels.", route: "/scripts/social-media-content-plan" },
  { title: "Song Lyrics", description: "Generate lyrics for songs.", route: "/scripts/song-lyrics" },
  { title: "Staff or Executive Announcement Press Release", description: "Announce staff or executive changes.", route: "/scripts/staff-or-executive-announcement-press-release" },
  { title: "Startup Ideas", description: "Generate startup business ideas.", route: "/scripts/startup-ideas" },
  { title: "Sub Headlines", description: "Write sub-headlines for your content.", route: "/scripts/sub-headlines" },
  { title: "Summarize Text", description: "Summarize any text for quick understanding.", route: "/scripts/summarize-text" },
  { title: "Support Autoresponder Message", description: "Automate support responses via email.", route: "/scripts/support-autoresponder-message" },
  { title: "Support Solution for a Problem", description: "Offer solutions for customer support issues.", route: "/scripts/support-solution-for-a-problem" },
  { title: "Thank You Letter", description: "Write a thank you letter.", route: "/scripts/thank-you-letter" },
  { title: "TikTok Video Hooks", description: "Create hooks for TikTok videos.", route: "/scripts/tiktok-video-hooks" },
  { title: "TikTok Video Ideas", description: "Generate ideas for TikTok videos.", route: "/scripts/tiktok-video-ideas" },
  { title: "TikTok Video Script", description: "Script for TikTok videos.", route: "/scripts/tiktok-video-script" },
  { title: "Tone Changer", description: "Change the tone of your content.", route: "/scripts/tone-changer" },
  { title: "Translate", description: "Translate content to other languages.", route: "/scripts/translate" },
  { title: "Trending Instagram Hashtags", description: "Find trending hashtags for Instagram.", route: "/scripts/trending-instagram-hashtags" },
  { title: "Trending Twitter Hashtags", description: "Find trending hashtags for Twitter.", route: "/scripts/trending-twitter-hashtags" },
  { title: "Tutorial Video", description: "Script for tutorial videos.", route: "/scripts/tutorial-video" },
  { title: "Twitter Series", description: "Write a series of tweets on a topic.", route: "/scripts/twitter-series" },
  { title: "Twitter Tweets", description: "Generate tweets for Twitter.", route: "/scripts/twitter-tweets" },
  { title: "Unique Value Proposition", description: "Craft a unique value proposition for your offer.", route: "/scripts/unique-value-proposition" },
  { title: "Youtube Descriptions", description: "Write descriptions for YouTube videos.", route: "/scripts/youtube-descriptions" },
  { title: "Youtube Hooks", description: "Create engaging hooks for YouTube videos.", route: "/scripts/youtube-hooks" },
  { title: "Youtube Outlines", description: "Outline scripts for YouTube videos.", route: "/scripts/youtube-outlines" },
  { title: "Youtube Script", description: "Script for YouTube videos.", route: "/scripts/youtube-script" },
  { title: "Youtube Shorts", description: "Script for YouTube Shorts videos.", route: "/scripts/youtube-shorts" },
  { title: "Youtube Tags", description: "Generate tags for YouTube videos.", route: "/scripts/youtube-tags" },
  { title: "Youtube Titles", description: "Create titles for YouTube videos.", route: "/scripts/youtube-titles" },
  { title: "Youtube Hashtags", description: "Find hashtags for YouTube videos.", route: "/scripts/youtube-hashtags" }
];

const ProgramManager: React.FC = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [search, setSearch] = useState("");
  const [newProgram, setNewProgram] = useState<Program>({ name: "", description: "", url: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch all programs
  const fetchPrograms = async () => {
    const q = query(collection(db, PROGRAMS_COLLECTION), orderBy("name"));
    const snapshot: QuerySnapshot<DocumentData> = await getDocs(q);
    setPrograms(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Program)));
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  // Add new program
  const handleAddProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgram.name || !newProgram.url) return;
    await addDoc(collection(db, PROGRAMS_COLLECTION), newProgram);
    setNewProgram({ name: "", description: "", url: "" });
    fetchPrograms();
  };

  // Search programs
  const filteredPrograms = programs.filter((program) =>
    program.name.toLowerCase().includes(search.toLowerCase()) ||
    program.description.toLowerCase().includes(search.toLowerCase()) ||
    program.url.toLowerCase().includes(search.toLowerCase())
  );

  // Export to CSV
  const exportCSV = () => {
    const csv = [
      Object.keys(programs[0] || {}).join(","),
      ...programs.map((p) => Object.values(p).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "programs.csv";
    link.click();
  };

  // Export to JSON
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(programs, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "programs.json";
    link.click();
  };

  // Import from file
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    let imported: Program[] = [];
    if (file.name.endsWith(".json")) {
      imported = JSON.parse(text);
    } else if (file.name.endsWith(".csv")) {
      const [header, ...rows] = text.split(/\r?\n/);
      const keys = header.split(",");
      imported = rows.map((row) => {
        const values = row.split(",");
        const obj: any = {};
        keys.forEach((k, i) => (obj[k] = values[i]));
        return obj as Program;
      });
    }
    // Batch add
    const batch = writeBatch(db);
    imported.forEach((program) => {
      const ref = doc(collection(db, PROGRAMS_COLLECTION));
      batch.set(ref, program);
    });
    await batch.commit();
    fetchPrograms();
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">All Scripts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {scriptCards.map((card, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
              <div>
                <div className="font-semibold text-lg mb-2 text-affiliate-purple">{card.title}</div>
                <div className="text-gray-600 text-sm mb-4">{card.description}</div>
              </div>
              <button
                className="mt-auto bg-affiliate-purple hover:bg-affiliate-purple/90 text-white font-semibold py-2 px-4 rounded transition"
                onClick={() => navigate(card.route)}
              >
                Continue
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgramManager;
