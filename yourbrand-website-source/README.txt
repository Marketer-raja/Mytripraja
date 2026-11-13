YourBrand landing page — published version 8

Exact source commit: 738fa3cc4497896d51619e378c5d0150525c56a9

Files in dist/ match the published site byte-for-byte, including HTML, CSS,
JavaScript, the original artwork, glow poster and forward-only video.

RUN LOCALLY
1. Extract this ZIP.
2. Open a terminal in the extracted folder.
3. Run: python -m http.server 8000 --directory dist
4. Open http://localhost:8000 in your browser.

No npm installation or build step is required. Python 3 is only needed for
this optional local preview server. You can also serve dist/ with any static
web server. Upload the contents of dist/ to your static hosting web root.

EDIT
- dist/index.html: brand name and page text
- dist/style.css: design and colors
- dist/app.js: launch date and synchronized glow playback
- dist/assets/: all images and the animation video

The countdown currently targets 11 February 2028, midnight India time.
The email form and social buttons retain their existing placeholder behavior;
email delivery and actual social profile URLs have not been connected.

.openai/hosting.json is the original Sites hosting configuration.
It is unnecessary for other static hosts. Do not reuse its project ID when
creating an independent new Site.
