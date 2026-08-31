# SEO Setup Guide — usman-malik.vercel.app

## Files diye gaye hain:
1. **seo-head-tags.html** — apne project ke `<head>` section mein paste karein (jahan `<title>` hai wahan replace kar dein)
2. **sitemap.xml** — apne project ke `public/` folder mein daal dein (root pe accessible honi chahiye: `usman-malik.vercel.app/sitemap.xml`)
3. **robots.txt** — isay bhi `public/` folder mein daal dein

Vercel automatically `public/` folder ki files ko root URL pe serve kar deta hai, deploy hote hi ye live ho jayengi.

---

## Suggested Expanded "About" Content (Copy-Paste ke liye)

Abhi aapki site pe sirf ek line hai. Google ko rank karne ke liye extra text chahiye. Ye paragraph "About" section mein add kar sakte hain:

> With hands-on experience managing Amazon Seller Central accounts, I help brands scale profitably through data-backed product research, high-converting listing optimization, and precision PPC campaigns. Using tools like Helium 10, Jungle Scout, and MerchantWords, I identify winning products, reduce ACoS, and improve organic ranking — so store owners can focus on growth while I handle daily operations, case log resolution, and account health. Whether you need a one-time store audit or full-time Amazon management, I bring measurable results backed by advanced Excel analytics and Brand Registry expertise.

---

## Quick Checklist
- [ ] `seo-head-tags.html` ka content `<head>` mein paste karein
- [ ] `sitemap.xml` aur `robots.txt` ko `public/` folder mein rakhein
- [ ] Redeploy karein Vercel pe
- [ ] Google Search Console mein site verify karein aur sitemap submit karein: `https://usman-malik.vercel.app/sitemap.xml`
- [ ] "About" section ka text expand karein (upar wala paragraph use kar sakte hain)
- [ ] H1 tag check karein — sirf 1 H1 honi chahiye poori page pe
