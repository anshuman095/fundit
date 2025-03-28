import { Router } from "express";
import userRoutes from "./userRoutes.js";
import adminRoutes from "./adminRoutes.js";
import aboutUsRoutes from "./aboutUsRoutes.js";
import heroBannerRoutes from "./heroBannerRoutes.js";
import locationRoutes from "./locationRoutes.js";
import navigationMenuRoutes from "./navigationMenuRoutes.js";
import ourPartnersRoutes from "./ourPartnersRoutes.js";
import ourServicesRoutes from "./ourServicesRoutes.js";
import productRoutes from "./productRoutes.js";
import whoAreWeRoutes from "./whoAreWeRoutes.js";
import linkedInRoutes from "./linkedinRoutes.js";
import roleRoutes from "./roleRoutes.js";
import contactRoutes from "./contactRoutes.js";
import partnerRoutes from "./partnerRoutes.js";
import blogRoutes from "./blogRoutes.js";
import testimonialRoutes from "./testimonialRoutes.js";
import sectionManagerRoutes from "./sectionManagerRoutes.js";
import facebookRoutes from "./facebookRoutes.js";
import instagramRoutes from "./instagramRoutes.js";
import queryFormRoutes from "./queryFormRoutes.js";
import contactFormRoutes from "./contactFormRoutes.js";
import gmailRoutes from "./gmailRoutes.js";
import twitterRoutes from "./twitterRoutes.js";
import bannerRoutes from "./bannerRoutes.js";
import socialMediaSecretRoutes from "./socialMediaSecretRoutes.js";
import ourTeamRoutes from "./ourTeamRoutes.js";
import fleetRoutes from "./fleetRoutes.js";
import moduleRoutes from "./moduleRoutes.js";
import donationRoutes from "./donationRoutes.js";
import ourInspirationRoutes from "./ourInspirationRoutes.js";
import bannerSectionRoutes from "./bannerSectionRoutes.js";
import historyRoutes from "./historyRoutes.js";
import volunteerRoutes from "./volunteerRoutes.js";
import newsMediaRoutes from "./newsMediaRoutes.js";
import templeRoutes from "./templeRoutes.js";
import discoursesRoutes from "./discoursesRoutes.js";
import youthForumsRoutes from "./youthForumsRoutes.js";
import exhibitionRoutes from "./exhibitionRoutes.js";
import tbClinicRoutes from "./tbClinicRoutes.js";
import medicalRoutes from "./medicalRoutes.js";
import scholarshipRoutes from "./scholarshipRoutes.js";
import computerCentreRoutes from "./computerCentreRoutes.js";
import bookStoreRoutes from "./bookStoreRoutes.js";
import languageCultureRoutes from "./languageCultureRoutes.js";
import libraryRoutes from "./libraryRoutes.js";
import donationCauseRoutes from "./donationCauseRoutes.js";
import donationPageRoutes from "./donationPageRoutes.js";
import scheduleQuoteRoutes from "./scheduleQuoteRoutes.js";
import dynamicModulesHomeRoutes from "./dynamicModulesHomeRoutes.js";
import historyContentRoutes from "./historyContentRoutes.js";
import eventRoutes from "./eventRoutes.js";
import exhibitionOnRoutes from "./exhibitionOnRoutes.js";
import photoGalleryRoutes from "./photoGalleryRoutes.js";
import videoGalleryRoutes from "./videoGalleryRoutes.js";
import preFooterRoutes from "./preFooterRoutes.js";
import footerRoutes from "./footerRoutes.js";
import subscribeRoutes from "./subscribeRoutes.js";
import emailRoutes from "./emailRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import spiritualRoutes from "./spiritualRoutes.js";
import sidebarRoutes from "./sidebarRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import { verifyToken } from "../../helper/tokenVerify.js";
import { saveRedirectUri } from "../../helper/general.js";
const router = Router();

router.use("/users", verifyToken, userRoutes);
router.use("/admin", adminRoutes);
router.use("/aboutUs", verifyToken, aboutUsRoutes);
router.use("/heroBanner", verifyToken, heroBannerRoutes);
router.use("/location", verifyToken, locationRoutes);
router.use("/navigationMenu", verifyToken, navigationMenuRoutes);
router.use("/ourPartners", verifyToken, ourPartnersRoutes);
router.use("/services", verifyToken, ourServicesRoutes);
router.use("/product", verifyToken, productRoutes);
router.use("/whoWeAre", verifyToken, whoAreWeRoutes);
router.use("/linkedin", linkedInRoutes);
router.use("/meta", facebookRoutes);
router.use("/instagram", instagramRoutes);
router.use("/twitter", twitterRoutes);
router.use("/google", gmailRoutes);
router.use("/roles", verifyToken, roleRoutes);
router.use("/contact", verifyToken, contactRoutes);
router.use("/partner", verifyToken, partnerRoutes);
router.use("/blogs", verifyToken, blogRoutes);
router.use("/testimonial", verifyToken, testimonialRoutes);
router.use("/section-manager", verifyToken, sectionManagerRoutes);
router.use("/query-form", verifyToken, queryFormRoutes);
router.use("/contact-form", verifyToken, contactFormRoutes);
router.use("/banner", verifyToken, bannerRoutes);
router.use("/social-media", verifyToken, socialMediaSecretRoutes);
router.use("/our-team", verifyToken, ourTeamRoutes);
router.use("/fleet", verifyToken, fleetRoutes);
router.use("/module", verifyToken, moduleRoutes);
router.use("/donation", donationRoutes);
router.use("/ourInspiration", ourInspirationRoutes);
router.use("/bannerSection", bannerSectionRoutes);
router.use("/history", historyRoutes);
router.use("/volunteer", volunteerRoutes);
router.use("/newsMedia", newsMediaRoutes);
router.use("/temple", templeRoutes);
router.use("/discourses", discoursesRoutes);
router.use("/youthForums", youthForumsRoutes);
router.use("/exhibition", exhibitionRoutes);
router.use("/tbClinic", tbClinicRoutes);
router.use("/medical", medicalRoutes);
router.use("/scholarship", scholarshipRoutes);
router.use("/computerCentre", computerCentreRoutes);
router.use("/bookStore", bookStoreRoutes);
router.use("/languageCulture", languageCultureRoutes);
router.use("/library", libraryRoutes);
router.use("/donationCause", donationCauseRoutes);
router.use("/donationPage", donationPageRoutes);
router.use("/scheduleQuote", scheduleQuoteRoutes);
router.use("/dynamicModulesHome", dynamicModulesHomeRoutes);
router.use("/historyContent", historyContentRoutes);
router.use("/event", eventRoutes);
router.use("/exhibitionOn", exhibitionOnRoutes);
router.use("/photoGallery", photoGalleryRoutes);
router.use("/videoGallery", videoGalleryRoutes);
router.use("/preFooter", preFooterRoutes);
router.use("/footer", footerRoutes);
router.use("/subscribe", subscribeRoutes);
router.use("/email", emailRoutes);
router.use("/payment", paymentRoutes);
router.use("/spiritual", spiritualRoutes);
router.use("/sidebar", sidebarRoutes);
router.use("/notification", notificationRoutes);
// router.use(saveRedirectUri);
export default router;
