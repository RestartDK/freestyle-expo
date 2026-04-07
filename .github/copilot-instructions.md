# Freestyle Expo - React Native Mobile App

Freestyle Expo is a React Native mobile application built with Expo that supports iOS, Android, and web platforms. The app uses Expo Router for file-based navigation, TypeScript for type safety, and includes modern React Native features like theming and animations.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Bootstrap and Build
Run these commands in sequence to set up and build the project:

1. **Install dependencies**: `npm install` 
   - Takes approximately 34 seconds
   - Downloads ~946 packages including Expo SDK and React Native dependencies
   - May show deprecation warnings for some packages - these are normal

2. **Lint the code**: `npm run lint`
   - Takes approximately 2.5 seconds
   - Uses ESLint with expo-config-eslint configuration
   - Always run before committing changes

### Development Servers

**Start development server for all platforms:**
```bash
npx expo start
```
- NEVER CANCEL: Server startup takes 20-30 seconds. Set timeout to 60+ minutes.
- Runs on port 8081 by default
- Provides QR code for mobile testing (not available in CI environment)

**Start web development server:**
```bash
npm run dev
# OR
npx expo start --web --port 3000
```
- NEVER CANCEL: Web server startup takes 25-30 seconds. Set timeout to 60+ minutes.
- Accessible at http://localhost:3000
- Includes hot reloading for development

**Platform-specific development:**
```bash
npm run android    # Android emulator
npm run ios        # iOS simulator  
npm run web        # Web browser
```

### Production Build

**Export static web build:**
```bash
npx expo export --platform web
# OR for unminified development build:
npx expo export --platform web --no-minify
```
- NEVER CANCEL: Build takes 22-25 seconds. Set timeout to 60+ minutes.
- Outputs to `dist/` directory
- Generates static HTML files and bundled JavaScript
- Creates routes for: /, /explore, /_sitemap, /+not-found, /(tabs), /(tabs)/explore

## Validation

### Manual Validation Requirements
After making changes, ALWAYS perform these validation steps:

1. **Start the web development server** and verify it loads without errors (landscape shell)
2. **If you changed controls or `CanvasScene`**, verify gestures and any screen where you mounted them
3. **Verify** the main screen and any edited routes render as expected
4. **Check console** for any JavaScript errors or warnings
5. **Test responsive behavior** if making UI changes

### Validation Commands
Always run these commands before completing your work:
```bash
npm run lint          # Check code style (2.5 seconds)
npx expo export --platform web --no-minify  # Verify build works (22+ seconds)
```

### Expected Build Artifacts
After running export, verify these files exist in `dist/`:
```
dist/
├── index.html           # Home page
├── explore.html         # Explore page  
├── +not-found.html      # 404 page
├── _sitemap.html        # Sitemap
├── (tabs)/              # Tab layouts
├── _expo/               # Expo static assets
├── assets/              # Images and fonts
└── favicon.ico          # Site icon
```

## Project Structure

### Key Directories
```
/
├── src/
│   ├── app/                 # File-based routing (Expo Router)
│   │   ├── _layout.tsx      # Root layout
│   │   ├── index.tsx        # Home / game screen
│   │   └── +not-found.tsx   # 404
│   ├── components/          # Reusable UI (ThemedText, ThemedView, …)
│   ├── hooks/               # useColorScheme, useThemeColor, …
│   ├── constants/           # e.g. Colors.ts
│   ├── polyfills/           # e.g. gltf-react-native
│   └── game/                # Simulation, controls, GameShell, CanvasScene, …
├── assets/                  # Root assets (app.json icons/splash; harness GLBs — use @/assets/*)
└── scripts/
    └── reset-project.js     # Moves src/app + shared dirs to app-example; recreates blank src/app
```

### Navigation System
- Uses **Expo Router** for file-based routing under **`src/app/`**
- Routes include `/`, `+not-found`
- Automatic deep linking support
- Type-safe navigation with TypeScript (`experiments.typedRoutes` in app.json)

### Theming System
- Light and dark mode support
- Automatic system theme detection
- Consistent color scheme across platforms
- Custom themed components (ThemedText, ThemedView)

## Common Tasks

### Adding New Screens
1. Create a new `.tsx` file under `src/app/`
2. Export default React component
3. Navigation will be automatically configured based on file structure

### Modifying Existing Screens
- **Home / game**: Edit `src/app/index.tsx`
- **Root layout**: Edit `src/app/_layout.tsx` (polyfills, theme, splash)

### Working with Components
- **Themed components**: Use `ThemedText` and `ThemedView` for consistent theming
- **Game / R3F**: `src/game/` for the playable runtime, `src/game/ui/` for overlays and dev harnesses

### Styling Guidelines
- Use StyleSheet.create() for component styles
- Follow existing color scheme from `src/constants/Colors.ts`
- Test both light and dark themes
- Ensure cross-platform compatibility

## Configuration Files

### Key Configuration
- **package.json**: Scripts, dependencies, and project metadata
- **app.json**: Expo app configuration, icons, splash screen
- **tsconfig.json**: TypeScript configuration with path mapping
- **eslint.config.js**: Code linting rules

### Project Reset
Run `npm run reset-project` to move `src/app`, `src/components`, `src/hooks`, `src/constants`, and `scripts` to `app-example/` and create a blank `src/app/` tree.

## Troubleshooting

### Common Issues
- **Port conflicts**: Use `--port 3000` flag or different port numbers
- **Metro bundler issues**: Clear cache with `npx expo start --clear`
- **TypeScript errors**: Ensure all imports use proper path aliases (`@/`)
- **Build failures**: Check for syntax errors and run `npm run lint`

### Environment Notes
- **CI mode**: Metro runs in CI mode in automated environments (no hot reloading)
- **Networking disabled**: Some Expo services unavailable in sandboxed environments
- **Offline mode**: Uses local dependency maps when network unavailable

### Performance
- Install time: ~34 seconds
- Lint time: ~2.5 seconds  
- Development server startup: 25-30 seconds
- Web build time: 22-25 seconds
- **NEVER CANCEL long-running commands** - they are normal for mobile development
