# SEO files

The live site uses `index.html`, `robots.txt`, and `sitemap.xml` from the
repository root. Keep `robots.txt` and `sitemap.xml` at the deployment root so
search engines can reach them at `/robots.txt` and `/sitemap.xml`.

`head-tags-template.html` documents the SEO and social metadata used by the
homepage. Keep its public URL, page description and image consistent with
`index.html` if either is updated.

## Search Console verification

Keep the `google*.html` verification file at the deployment root. Its filename
and contents must remain unchanged for Google Search Console verification.

After deployment, submit `https://usman-malik.vercel.app/sitemap.xml` in Google
Search Console.
