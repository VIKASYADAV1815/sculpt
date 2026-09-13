# Sculpt & Crown - Relief Frontend

A sophisticated portfolio website for a lime-plaster atelier, featuring interactive WebGL effects, smooth scroll animations, and immersive 3D experiences.

## Tech Stack

- **Framework**: TanStack Start (React SSR framework)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion (motion), GSAP + Lenis
- **3D Graphics**: Three.js
- **Routing**: TanStack Router
- **State Management**: TanStack Query
- **TypeScript**: Full type safety

## Project Structure

```
relief-frontend/
├── public/               # Static assets (see ASSETS-NEEDED.md)
├── src/
│   ├── assets/          # Asset JSON manifests
│   ├── components/      # React components
│   │   ├── AnimatedText.tsx
│   │   ├── FilmScrub.tsx
│   │   ├── PlasterRevealCanvas.tsx  # WebGL plaster reveal effect
│   │   ├── ScrollStory.tsx
│   │   ├── SiteFooter.tsx
│   │   ├── SiteNav.tsx
│   │   ├── SmoothScroll.tsx         # Lenis smooth scroll
│   │   ├── StackDeck.tsx
│   │   ├── WaterImage.tsx
│   │   ├── WaveGallery.tsx          # Three.js gallery
│   │   └── WordVeil.tsx
│   ├── lib/
│   │   ├── error-capture.ts
│   │   ├── error-page.ts
│   │   └── lovable-error-reporting.ts
│   ├── routes/          # TanStack Router pages
│   │   ├── __root.tsx
│   │   ├── index.tsx    # Homepage
│   │   ├── commissions.tsx
│   │   ├── studio.tsx
│   │   └── works.tsx
│   ├── router.tsx
│   ├── routeTree.gen.ts
│   └── styles.css       # Tailwind + custom utilities
├── server.ts            # SSR error handling wrapper
├── package.json
├── tsconfig.json
├── vite.config.ts
└── eslint.config.js
```

## Features

### Interactive Effects

- **PlasterRevealCanvas**: Mouse-driven WebGL shader that reveals carved relief beneath plaster surface
- **WaveGallery**: Horizontal scroll 3D gallery with liquid distortion effects
- **Smooth Scroll**: Lenis-powered smooth scrolling with GSAP ScrollTrigger integration
- **Magnetic CTA**: Cursor-following interactive buttons
- **WordVeil**: Scroll-driven text reveal with blur effects

### Design System

- **Fonts**: Cormorant Garamond (display), Jost (sans-serif)
- **Colors**: Custom ink/plaster palette using oklch color space
- **Animations**: Custom easing curves, stagger animations, blur transitions

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies**:

   ```bash
   cd relief-frontend
   npm install
   ```

2. **Add required assets**:
   - See `public/ASSETS-NEEDED.md` for the list of required images and video
   - Place all assets in the `/public` folder

3. **Run development server**:

   ```bash
   npm run dev
   ```

4. **Build for production**:

   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Routes

- `/` - Homepage with hero reveal and scroll story
- `/works` - Portfolio gallery of relief works
- `/studio` - Studio information and methodology
- `/commissions` - Pricing tiers and enquiry form

## Browser Support

- Modern browsers with WebGL support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Performance Notes

- Lazy loading for heavy components (Three.js scenes)
- Optimized WebGL shaders
- Image lazy loading
- Code splitting per route
- Smooth scroll disabled on reduced-motion preference

## Development Notes

### Custom Tailwind Utilities

- `rise` - Fade-in-up animation keyframe
- Custom font families from Google Fonts
- oklch color definitions for better color manipulation

### SSR Considerations

- WebGL components are lazy-loaded client-side only
- Error boundaries handle SSR failures gracefully
- Custom error page with fallback UI

## License

Private project - All rights reserved

## Credits

Built with modern web technologies for immersive portfolio experiences.
