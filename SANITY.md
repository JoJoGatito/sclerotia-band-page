# SANITY.md

Client-side Sanity (Option A) setup for a public dataset with GitHub Pages hosting.

Overview
- You’ll manage content in Sanity and fetch it directly from the browser (no server, no build step).
- Dataset is public (readable by anyone), so no API token is used.
- Add your GitHub Pages origin(s) to Sanity CORS.
- Keep the slime-mold animation smooth by fetching content after the main thread is idle.

1) Create a Sanity project and dataset
- Install and bootstrap (in a separate folder outside this repo, or anywhere you prefer):
```bash path=null start=null
npm create sanity@latest
```
- Choose a project name and dataset name (recommended: "production").
- Note your Sanity projectId and dataset.

2) Make the dataset public and set CORS
- In Sanity Manage → Datasets → production → set to Public (read).
- In Sanity Manage → API → CORS origins, add:
  - http://localhost:8000 (local dev)
  - https://YOUR_USERNAME.github.io (GitHub Pages origin)
  - https://YOUR_DOMAIN (if using a custom domain)

Notes:
- For GitHub Pages project sites, the origin is still https://YOUR_USERNAME.github.io (path doesn’t matter for CORS).
- If you later switch to a private dataset, migrate to a build-time or server-side approach (see Option B in discussions).

3) Define a minimal schema (example: Show)
- In your Sanity Studio project, add a "show" document type. Example:
```js path=null start=null
// /sanity/schemaTypes/show.js
export default {
  name: "show",
  title: "Show",
  type: "document",
  fields: [
    { name: "title", type: "string", validation: Rule => Rule.required() },
    { name: "date", type: "datetime", validation: Rule => Rule.required() },
    { name: "venue", type: "string" },
    { name: "city", type: "string" },
  ],
};
```
- Deploy your Studio and create a few "Show" documents.

4) Add containers to your page for dynamic content
- Add a section to index.html where content will be rendered (example: Upcoming Shows):
```html path=null start=null
<section id="shows">
  <h2>Upcoming Shows</h2>
  <ul id="shows-list"></ul>
</section>
```

5) Client-side fetch from Sanity (no token)
- In app.js, fetch GROQ results after the page is idle to avoid competing with the canvas animation:
```js path=null start=null
(function schedule(fn){ (window.requestIdleCallback || window.requestAnimationFrame)(fn) })(async () => {
  const projectId = "{{SANITY_PROJECT_ID}}";    // e.g. abc123
  const dataset   = "{{SANITY_DATASET}}";       // e.g. production
  const apiVer    = "2023-08-01";               // Sanity API version
  const groq      = `*[_type=="show"]|order(date asc){title, date, venue, city}`;
  const url       = `https://${projectId}.api.sanity.io/v${apiVer}/data/query/${dataset}?query=${encodeURIComponent(groq)}`;

  try {
    const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
    const { result = [] } = await res.json();
    const ul = document.getElementById("shows-list");
    if (!ul) return;
    ul.innerHTML = result.map(show => {
      const d = new Date(show.date);
      const dateStr = isNaN(d) ? show.date : d.toLocaleDateString();
      const venue = show.venue ? ` — ${show.venue}` : "";
      const city  = show.city  ? ` · ${show.city}`  : "";
      return `<li><strong>${show.title ?? "Show"}</strong> — ${dateStr}${venue}${city}</li>`;
    }).join("");
  } catch (e) {
    // Fail silently; keep animation smooth
    console.warn("Failed to load shows from Sanity", e);
  }
});
```
Replace placeholders:
- {{SANITY_PROJECT_ID}}: your projectId (e.g., abc123)
- {{SANITY_DATASET}}: your dataset (e.g., production)

6) Local development
- Serve the site locally:
```bash path=null start=null
python3 -m http.server 8000
```
- Visit http://localhost:8000 and check the network tab for the Sanity request.
- If you see CORS errors, verify CORS origins in the Sanity project and that the dataset is Public.

7) Deploy on GitHub Pages
- Commit and push changes.
- Ensure your Pages environment serves from this repo (e.g., main branch). The origin will be:
  - https://YOUR_USERNAME.github.io for user/organization sites
  - The same origin for project sites (path includes repo name, origin remains https://YOUR_USERNAME.github.io)
- Make sure that origin is in Sanity CORS, and add your custom domain if applicable.

Troubleshooting
- Empty list: Confirm documents exist and match the GROQ query (type == "show").
- CORS error: Double-check origins and that the dataset is public.
- Rendering issues: Ensure the HTML section with #shows-list exists and that app.js is loaded after it (script tags at end of body are fine).

Notes
- No API token is used in the browser for public datasets; never expose tokens client-side.
- For richer content (e.g., releases, news), create additional Sanity document types and render them with similar GROQ queries.
