# Sahil Chauhan — Portfolio

A 3D animated, SEO-optimised personal portfolio built with **Next.js 14 + TypeScript + React-Three-Fiber + Framer Motion + Tailwind**.

Dark-luxury design, animated 3D hero, smooth scroll reveals, and structured data so Google can rank your name.

---

## 🚀 Chalane ka tareeka (Run locally)

```bash
npm install        # ek baar dependencies install karo
npm run dev        # http://localhost:3000 pe khulega
```

Production build test karne ke liye:

```bash
npm run build
npm run start
```

---

## ✏️ Apna content kaise badlein (IMPORTANT)

**Sirf ek file edit karni hai:** [`lib/data.ts`](lib/data.ts)

Usme sab kuch hai — naam, tagline, about, skills, experience, projects, contact.
Comments Hindi me likhe hain, follow karte jao. Code haath lagane ki zarurat nahi.

### Photo lagana
1. Apni photo ka naam `profile.jpg` rakho
2. Use `public/` folder me daalo → `public/profile.jpg`
3. `lib/data.ts` me `photo: '/profile.svg'` ko `photo: '/profile.jpg'` kar do

> Tip: Hero ke liye ek close-up / half-body photo (plain ya blurred background) best lagti hai.

### Resume lagana
Apna resume `public/resume.pdf` naam se daal do — "Download résumé" button apne aap kaam karega.

### Projects badalna
`lib/data.ts` me `projects` array hai. Har project me `title`, `description`, `tech`, `live`, `github`, aur optional `image` hai.
- Project image ke liye: `public/projects/` me daalo, phir `image: '/projects/tumhari-image.jpg'`
- `live` aur `github` me `'#'` ko apne real links se replace karo.

---

## 🌐 Deploy karna (Vercel — free)

1. Is folder ko GitHub pe push karo (ek naya repo banao).
2. [vercel.com](https://vercel.com) pe jao → GitHub se login karo.
3. **Add New → Project** → apna repo select karo → **Deploy**.
4. 1-2 minute me live! URL milega jaise `sahil-chauhan.vercel.app`.

### Deploy ke baad (SEO ke liye zaroori)
1. `lib/data.ts` me `site.url` ko apne asli URL se update karo (jaise `https://sahil-chauhan.vercel.app`).
2. Dobara push karo (Vercel auto-redeploy karega).
3. [Google Search Console](https://search.google.com/search-console) pe apna site add karo aur `sitemap.xml` submit karo.
   Isse Google jaldi index karega aur tumhare naam pe ranking start hogi.

---

## 📁 Structure

```
app/
  layout.tsx      # SEO metadata + JSON-LD schema + fonts
  page.tsx        # saare sections yahan jude hain
  globals.css     # design tokens + styles
  sitemap.ts      # auto sitemap
  robots.ts       # auto robots.txt
components/
  Hero3D.tsx      # 3D crystal + particles (React-Three-Fiber)
  Hero.tsx        # hero section (text + 3D)
  About.tsx       # photo + bio
  Skills.tsx
  Experience.tsx  # timeline
  Projects.tsx    # project cards
  Contact.tsx
  Navbar.tsx / Footer.tsx / Reveal.tsx
lib/
  data.ts         # ⭐ SAARA CONTENT YAHAN — sirf ye edit karo
public/
  profile.svg     # placeholder photo (apni profile.jpg se replace karo)
```

---

## ♿ Features

- **SEO:** Server-rendered content, JSON-LD Person schema, Open Graph tags, sitemap, robots.
- **Performance:** 3D lazy-loads, fonts optimised, compositor-friendly animations.
- **Accessibility:** Semantic HTML, keyboard focus states, `prefers-reduced-motion` respected (3D + animations off for those users).
- **Responsive:** Mobile menu, fluid typography, works 320px → 4K.

---

## 📝 Notes

- Next.js 14.2.35 me kuch self-hosted DoS advisories hain — Vercel pe deploy karne se ye mitigate ho jaate hain. Future me Next 15 pe upgrade kar sakte ho.
- Ranking honest expectation: **apne naam** pe #1 realistic hai (schema + Search Console se). Generic keywords pe time + backlinks lagta hai.
