
# FWF Mobile Web App (PWA)

This is a mobile-first static site for **Foundris Welfare Foundation (FWF)** with PWA support (installable, offline-ready).

## Structure
- index.html, about.html, projects.html, donate.html, join.html
- css/style.css
- js/app.js
- manifest.json, service-worker.js, sw-register.js
- vercel.json (SPA rewrites + SW headers)
- assets/icons/

## Run locally
Use any static server (Python or Node):
- Python: `python -m http.server 8080`
- Node: `npx serve`

Then open http://localhost:8080

## Deploy on Vercel
Commit & push to GitHub, connect repo on Vercel. `vercel.json` ensures:
- All routes rewrite to `/index.html` (SPA, fixes 404 when navigating)
- Proper headers for service-worker and long-term asset caching

## Integrations left as TODO
- Payment gateway (Razorpay/PhonePe/PayU test mode)
- Backend for emailing Member ID after payment
