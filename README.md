# Md Humaion Kabir Mehedi — Academic Portfolio

An **HKM-branded**, responsive **static website** built with HTML, CSS and JavaScript. No Node.js, database, paid plan, or build process is required. It works with **GitHub Pages, Netlify, Vercel, Cloudflare Pages, and standard web hosts**.

## Branding

The brand monogram is **HKM** across the header, footer, homepage research visual, favicon, and placeholder avatar. Header styling is in `assets/css/style.css`, and favicon/placeholder files are in `assets/img/`.

## Pages

- `index.html` — home, researcher introduction, research themes, latest journal articles, links.
- `research.html` — dedicated research page with **Current Research**, **Under Review**, **Published Journal Articles**, and **Conference Papers**.
- `about.html` — bio, full academic education (including MSc/BSc theses and grades, HSC, SSC), current and previous teaching appointments, research positions, awards and service.
- `contact.html` — professional social profiles, email link and copy email button.

## Update your content (important)

Open **`assets/js/data.js`** with any text editor (VS Code or GitHub's built-in editor).

| To change | Where |
| --- | --- |
| Name, bio, email, links | `profile` |
| Research themes | `researchTracks` |
| Research preprint highlights | `researchHighlights` |
| **Currently under-review submissions** | `underReview` |
| **Journal publications** | `journals` |
| **Conference papers** | `conferences` |
| Education | `education` |
| Research and teaching experience | `experience`, `teaching` |
| Awards and leadership | `awards`, `service` |

### Add a new journal article

Inside the `journals` array, add a record separated by a comma:

```js
{
  title: 'Exact publication title',
  venue: 'Journal Name',
  date: '2026-10-15',   // YYYY-MM-DD, publish date
  year: 2026,
  doi: '10.1234/example',
  topic: 'Medical Imaging'
},
```

**Latest first is automatic.** You may append new articles at the bottom. The website sorts all journal articles by `date` descending and the homepage automatically shows the newest three. Research search and year filters update automatically.

### Add an under-review manuscript

Edit `underReview: []` in `assets/js/data.js`:

```js
underReview: [
  {
    title: 'Publicly shareable manuscript title',
    venue: 'Journal / conference',
    status: 'Under review',
    date: '2026-10-01',
    topic: 'Medical Imaging',
    notes: 'Optional non-confidential description'
  }
],
```

**This edition contains four visibly labeled illustrative sample manuscripts**, NOT actual submitted or under-review papers. These are placeholders for page-design purposes only. Before showing this website as your official research record, replace them with real publicly shareable papers (set `isDemo: false`) or delete the entries from `underReview`. Never label a demo paper as a real submission.

### Update your BRAC University research role and IEEE membership

Your Research Experience section includes **Research Assistant, BRAC University (14 April 2026 – Present)**. The Home page highlights this ongoing appointment. Under **Membership & Leadership**, the site separately lists **IEEE Member** and **IEEE Computational Intelligence Society Bangladesh Chapter Publicity & Social Media Coordinator**. No IEEE member number or unsupported membership start date is published.

These records are in `assets/js/data.js`: edit the `experience` array for BRAC University roles and the `service` array for IEEE membership and community appointments.

### Add and update your publications

The dedicated Research page displays **selected, verified journal and conference papers**. The newest paper appears first based on `date` in `assets/js/data.js`. This is not an automatic or complete import of Google Scholar. Always confirm authorship, status, DOI and publication date before publishing additions.

Example journal:
```js
{ title: 'Exact paper title', venue: 'Journal Name', date: '2026-10-01', year: 2026, doi: '10.xxxx/xxxxx', topic: 'Computer Vision' }
```
Example conference:
```js
{ title: 'Exact conference paper title', venue: 'Conference or Proceedings', date: '2025-06-01', year: 2025, doi: '10.xxxx/xxxxx', topic: 'Computer Vision' }
```
To display a paper from a screenshot, first check the exact title and venue against its DOI or publisher record; do not copy guessed titles from small or unclear images. The website links to Google Scholar for the broader bibliography.

### Update education and teaching appointments

The About page contains the complete **Education** and **Teaching & Mentorship** timelines. The Home page highlights your **two current lecturer roles** and your **two university degrees**.

Your current teaching appointments are shown as:
- **Uttara University** — Lecturer, Department of Computer Science & Engineering (CSE), **15 September 2026 – Present**.
- **UCSI University Branch Campus Bangladesh** — Lecturer, FCSDI Department, **1 September 2026 – Present**.

The website uses these start dates as supplied by you (they replace the earlier UCSI August 2026 date from your CV). Both are marked *Current* because the supplied dates have no end date. Earlier BUCC Academy instructor and BRAC University student tutor appointments remain visible. The Education timeline includes MSc (2024), BSc (2022), HSC (2016), and SSC (2014), including grades and thesis titles from your CV.

To change any date, degree, title, department, grade, or appointment, edit `education` or `teaching` in `assets/js/data.js` and commit the changes. Set `current: false` for a lecturer appointment that is no longer active; Home only displays records marked `current: true`.

### Update your profile photo (built-in editor)

The profile image appears in **two locations**: the Home page's center illustration and the About page's portrait card. Both reference **one file**, `assets/img/profile.webp`, so you only have to replace it once. The included main profile photo is the blue-suit portrait you provided; the graduation and outdoor photos appear on the About page. If the main image is missing, the fallback graphic displays HKM.

**Option A: Use the built-in photo editor (recommended):**

1. Open your published About page with `?edit=profile` at the end, for example `https://YOURUSERNAME.github.io/about.html?edit=profile` (or `https://YOURUSERNAME.github.io/REPOSITORY/about.html?edit=profile` for a project repository). You can also open `about.html?edit=profile` locally.
2. Select **Choose photo**, then pick a JPG, PNG, or WebP image no bigger than 10 MB.
3. The website previews your photo immediately. Your browser square-crops and resizes it to 720 × 720 pixels.
4. Select **Download website photo**. The browser saves `profile.webp`.
5. Open your website repository on GitHub, navigate to **`assets/img/`**, and replace the existing **`profile.webp`** with your newly downloaded file. Commit the change to `main`.
6. When GitHub Pages redeploys, refresh the page to see the updated photo. If an old photo remains, do a hard refresh to clear the browser cache.

**Important:** This is a **local editor**, not an authenticated website dashboard. Editing the preview *does not* change the public website or upload your image anywhere. Even someone else opening the edit URL can only change what they see locally; they cannot publish to your GitHub repository without write access. Session preview may persist while the browser tab is open.

**Option B: Replace the file directly:**

Use any image editor to make a square 720 × 720 WebP image named **`profile.webp`**. Upload it to `assets/img/` in your site repository to replace the old one, then commit. The profile photo updates on Home and About automatically.

### Colors and design

Open `assets/css/style.css`. At the top, adjust CSS variables for `--bg`, `--bg-alt`, `--accent`, etc. The sun/moon button swaps between dark and light themes.

## Hosting on GitHub Pages (free)

1. Go to [github.com/new](https://github.com/new) and create a **public** repository. For a user-site URL, name it `YOURUSERNAME.github.io`. Any repository name also works for a project site.
2. Upload **all the website files and folders**, keeping `index.html` at the repository root. You can drag in the unzipped website folder contents or push them with Git.
3. In the repository, visit **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, then choose `main` and `/(root)` and save.
4. Your site will be available at `https://YOURUSERNAME.github.io/` for the named user-site repository, or `https://YOURUSERNAME.github.io/REPOSITORY/` for other repository names.
5. Allow a few minutes for the first deployment. To make updates, edit `assets/js/data.js` on GitHub and commit.

> The site uses **relative links**, so GitHub Pages project URLs work without a special base-path configuration.

## Hosting on Netlify (free tier available)

1. Unzip the folder.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag the **folder containing `index.html`** into the upload area.
4. Netlify provides a published `.netlify.app` link. Connect a GitHub repository if you want automatic redeployment whenever you edit files.

## Hosting on Vercel (free tier available)

1. Import your GitHub repository into [Vercel](https://vercel.com/new).
2. Leave the framework preset as **Other** (plain static HTML).
3. Deploy with output directory left at the root. No build command is needed.

## Run locally

Double-click `index.html`. For the most realistic test you can also serve it locally:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Content and verification notes

This is a **curated starting draft** (not a complete import of Google Scholar). Data were cross-checked against public sources in October 2026. Review roles, dates, spelling, paper lists and permissions before publishing. Do not treat researcher-role summaries or research themes as a claim of a currently funded project. Academic sources:

- Google Scholar: https://scholar.google.com/citations?user=BJPb5BcAAAAJ&hl=en
- Researcher's publicly posted CV: https://bracu.academia.edu/HumaionKabirMehedi/CurriculumVitae
- DBLP: https://dblp.org/pid/333/4435.html
- ORCID: https://orcid.org/0000-0002-5759-022X
- PLOS ONE, MaxGRNet (2026): https://doi.org/10.1371/journal.pone.0346329
- IJEEE fire detection (2026): https://doi.org/10.22068/IJEEE.22.3.3733
- ResearchGate profile: https://www.researchgate.net/profile/Md-Humaion-Kabir-Mehedi

This website **does not automatically scrape Google Scholar**; Scholar does not provide a simple open browser-friendly public API. Add a journal publication in `data.js` and it will be shown first automatically if it has the most recent date.

## Site technical details

- Accessible semantic HTML and keyboard navigation; mobile menu and theme toggle.
- Meta titles/descriptions, Open Graph titles, link security (`rel="noopener noreferrer"`).
- Research search by title, venue, topic and year.
- Responsive layouts for phone/tablet/desktop.
- No cookies, analytics, trackers or forms; the theme preference is stored locally in the browser.
- Google Fonts are loaded when internet is available, with system font fallbacks.


## Photos included (October 2026)

Your supplied photographs are already integrated:

- **Blue-suit portrait**: `assets/img/profile.webp` — Home and About profile picture.
- **Graduation photograph**: `assets/img/graduation.webp` — Education section and Moments gallery.
- **Outdoor photograph**: `assets/img/outdoors.webp` — Moments gallery on About.

To replace the primary profile photo, use `about.html?edit=profile` (client-side preview only) and replace `assets/img/profile.webp` in the GitHub repository. The other gallery images can be updated by replacing their `.webp` files with photos using the same filenames.

## Four example under-review paper entries

The four entries are demonstration placeholders in `assets/js/data.js` > `underReview`. They are marked `isDemo: true` and visually labeled **Sample · Not submitted**. The warning banner automatically appears while any sample remains and disappears when all sample records are deleted or marked as real. Replace title, venue, topic, date, notes, and status with accurate details for each genuine entry. Do not publish confidential manuscript details without consent.

## Responsive device support (October 2026 update)

The current HKM website is designed for screens from compact 320px phones through ultra-wide desktops.

- **320–420px phones:** streamlined header, stacked hero buttons, single-column research cards, full-width publication search/filter, readable conference/journal entries, and compact photo gallery.
- **421–600px phones:** single-column cards, comfortable buttons, fluid typography and publication lists.
- **601–980px tablets / small laptops:** flexible two-column cards where space permits; stacked hero and accessible touch-friendly menu.
- **981px and wider desktops:** full desktop navigation, balanced multi-column pages and maximum content width.
- **Landscape and device rotation:** the mobile navigation has a scrollable height limit; resizing to desktop resets its expanded state.
- **Accessibility:** 44px main icon buttons, visible keyboard focus, reduced-motion support, no horizontal document scrolling at common device sizes.

No build step or framework is needed. Changes were made in `assets/css/style.css` and `assets/js/app.js`; continue editing `assets/js/data.js` for your academic content.

For device testing, open Developer Tools in Chrome/Edge/Firefox, turn on the device toolbar and test 320, 375, 390, 430, 600, 768, 820, 1024, 1440 and 1920 CSS pixels.


## October 2026 typography and labeling update

This package matches the **dark HKM design already deployed at hkabirmehedi.github.io**, not the alternative Nordic theme.

- The header subtitle “RESEARCH PORTFOLIO” has been removed from every page.
- The homepage role label reads “LEARNER · COMPUTER SCIENCE & ENGINEERING”.
- “RESEARCH FOCUS” has no leading number; homepage later sections retain “02 / ACADEMIC APPOINTMENTS” and subsequent headings as requested.
- Research and About page section headings have no numbers. Research quick links and research topic cards have no decorative numbering.
- The latest complete publications, DOI/email updates, and removed preprints are retained in `assets/js/data.js`; the contact HTML fallback email has also been updated.

**To update GitHub Pages:** Extract this archive and upload its contents to the root of your GitHub repository. Replace existing files and commit. In particular, replace all four HTML pages, `assets/js/app.js`, `assets/js/data.js`, and `assets/css/style.css`.


## Latest website update (October 2026)

- ScholarGPS profile added to the Research and Contact pages (ScholarGPS ID: 60176498191431).
- Removed the circular “Research / In Progress” portrait/orbit graphic from the Home landing page.
- The profile photograph remains available on the About page and the About-page owner photo editor.
- No changes were made to publication records, education, teaching or other academic details.
