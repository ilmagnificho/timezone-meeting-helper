# Meeting Timezone Helper

A very small, focused web app to convert meeting times between your timezone and a partner's timezone.

- ✅ Two-side input: you can type on **either side** (your time or partner's time), and the other side updates instantly.
- ✅ Timezone selection via common IANA timezones (e.g. `Asia/Seoul`, `America/Los_Angeles`).
- ✅ Automatic detection of browser language + timezone for sensible defaults.
- ✅ UI languages: **English / 한국어 / 日本語 / 中文**.
- ✅ Ready hooks for **Google Analytics (GA4)** and **Google AdSense**.

This project is pure static HTML/CSS/JS, so you can:

- Drop it into a GitHub repository
- Deploy with Vercel, GitHub Pages, or any static host

---

## How to use

1. Replace Google Analytics / AdSense placeholders in `index.html`:

```html
<!-- GA4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  gtag('config', 'G-XXXXXXXXXX');
</script>

<!-- AdSense -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
        crossorigin="anonymous"></script>
```

2. Push these files to a GitHub repository:

- `index.html`
- `style.css`
- `app.js`
- `README.md`

3. On Vercel:

- Create a new project from that GitHub repo
- Framework preset: **Other**
- Build command: *(leave empty)*
- Output directory: `./` (root)

4. Visit the deployed URL and test:

- Default language & timezone should match your browser
- Try typing date/time on **your side** → partner side updates
- Try typing on **partner side** → your side updates

---

## Notes

- Timezone conversion is handled by [Luxon](https://moment.github.io/luxon/) via CDN and uses the browser's IANA timezone database, including DST rules.
- This is intentionally minimal so that you can extend it later (user accounts, saving frequent partners, sharing links for proposed times, etc.).
