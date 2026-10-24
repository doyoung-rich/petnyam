# Affiliate display pause

User requested temporary removal of Coupang and Amazon product promotions while preparing for AdSense review. Applied uniformly to all visitors, without user-agent, referrer or bot detection. No robots/noindex, canonical, sitemap, article-body, AdSense publisher or ads.txt changes are part of this release. This is not a promise of AdSense approval or a finding that affiliate links caused rejection.

The deployed product catalog is empty, shopping creation returns before product loading, and scheduled product updates exit before credentials or network access when paused. Source catalogs remain outside `/docs` for restoration; previous generated data is recoverable in Git history. Policy disclosures remain because affiliate activity existed and can resume.

To resume intentionally: set `site-static/affiliate-settings.json` enabled to true, run `node scripts/sync-affiliate-display.mjs`, then update products with configured repository secrets, validate and deploy. Do not automatically resume upon a timer or assume AdSense approval.

Read-only live check on October 25: `/ads.txt` responded HTTP 200 with the configured publisher line. AdSense dashboard discovery can only be confirmed separately in that account. No review request or payment/account action was submitted.
