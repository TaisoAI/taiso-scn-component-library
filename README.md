# Taiso SCN Component Library

A themeable React component library built on [shadcn/ui](https://ui.shadcn.com), with 55 UI components, 14 blocks, 14 visual themes, and full dark/light mode support. Powered by Tailwind CSS v4 and Radix UI primitives.

## Components (55)

**Core UI (55):** Accordion, Alert, AlertDialog, AspectRatio, Avatar, Badge, Breadcrumb, Button, ButtonGroup, Calendar, Card, Carousel, Chart, Chatbot, Checkbox, Collapsible, Combobox, Command, ContextMenu, Dialog, Drawer, DropdownMenu, Empty, Field, Form, HoverCard, Input, InputGroup, InputOTP, Kbd, Label, Menubar, NativeSelect, NavigationMenu, Pagination, Popover, Progress, RadioGroup, Resizable, ScrollArea, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Spinner, Switch, Table, Tabs, Textarea, Toggle, ToggleGroup, Tooltip

**Blocks (14):** AppSidebar, ChartAreaInteractive, DataTable, LoginForm, NavDocuments, NavMain, NavProjects, NavSecondary, NavUser, SearchForm, SectionCards, SiteHeader, TeamSwitcher, VersionSwitcher

## Themes (14)

Swiss Minimal, Glass Morphism, Neo Brutalist, Dark Command, Monochrome Dense, Warm Editorial, Soft Gradient, Spatial Depth, Organic Nature, Bento Grid, Retro Y2K, Soft Emboss, Corporate Sharp, Luxury Amber

Each theme supports both light and dark modes.

## Tech Stack

- **React 19** with TypeScript
- **Tailwind CSS v4** with `@theme inline` and `@custom-variant dark`
- **Radix UI** primitives for accessible, unstyled components
- **Vite 6** for development and building
- **CSS custom properties** for theming (HSL color system)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Install

```bash
npm install
```

### Development

```bash
# Run the demo app with all component demos
npm run dev
```

The demo app runs on `http://localhost:5173` and includes interactive demos for every component with a theme switcher and dark/light toggle.

### Build

```bash
npm run build
```

## Project Structure

```
src/
  components/
    ui/           55 shadcn/ui components (Radix + Tailwind)
    blocks/       14 composed block components
  demo/
    App.tsx       Demo app with sidebar navigation
    demos/        Individual component demo pages
  themes/         14 theme CSS files + index + variables
  styles/
    globals.css   Tailwind config, theme token mappings, theme-specific overrides
  hooks/          Custom React hooks
  lib/
    theme-provider.tsx   ThemeProvider context (data-theme/data-mode on body)
    types.ts             Theme name types and labels
    utils.ts             cn() utility
  index.ts        Public exports
```

## Architecture

All components consume CSS custom properties defined in the theme files. The `ThemeProvider` sets `data-theme` and `data-mode` attributes on `<body>`, which activate the corresponding theme's CSS variables. Tailwind's `@theme inline` block maps these variables to utility classes, so components like `bg-primary` or `text-muted-foreground` automatically respond to theme changes.

Theme-specific visual effects (glass-morphism backdrop blur, neo-brutalist borders, monochrome-dense compact spacing, soft-emboss shadows) are applied via CSS selectors targeting `[data-theme="..."]` in `globals.css`.

## Using Components in Other Projects

To use these components in a separate Vite project, configure path aliases to point to this library:

```typescript
// vite.config.ts
const LIB = path.resolve(__dirname, '../taiso-scn-component-library/src');

export default defineConfig({
  resolve: {
    alias: {
      '@': LIB,
      '@shadcn': LIB,
    },
  },
});
```

Then import the theme CSS and wrap your app with `ThemeProvider`:

```tsx
import { ThemeProvider } from '@shadcn/lib/theme-provider';
import '@shadcn/styles/globals.css';
```

## License

MIT
