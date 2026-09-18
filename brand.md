# Oscar Barlow Personal Brand Style Guide

## Brand Mission & Vision

**Mission Statement**: To position Oscar Barlow as an innovative technology leader who brings originality, creative energy, and human-centered thinking to complex data and AI initiatives while leveraging exceptional communication abilities to bridge technical and business domains.

**Brand Promise**: A technical leader who combines analytical rigor with creative problem-solving, delivering solutions that create significant value while remaining ethically sound and forward-thinking.

**Target Audience**: Executive recruiters, C-suite decision makers, and senior technology leaders seeking transformational leadership for AI and data initiatives.

## Brand Personality & Values

### Core Personality Traits
- **Innovative**: Challenges conventional approaches, brings fresh perspectives
- **Technical Excellence**: Deep expertise in data science, AI, and engineering leadership
- **Human-Centered**: Balances technical solutions with human impact and ethical considerations
- **Bridge Builder**: Exceptional ability to translate between technical and business domains
- **Authentic**: Genuine personality that shows through professional presentation
- **Unconventional**: Unique career path (marketing → film → technology) as a strength

### Brand Values
- **Originality over conformity**: Standing out from generic executive presentations
- **Substance over flash**: Meaningful depth rather than surface-level sophistication  
- **Humanity in technology**: Ensuring technological solutions serve human needs
- **Inclusive leadership**: Building diverse, high-performing teams
- **Ethical innovation**: Forward-thinking solutions that consider broader impact

## Visual Identity System

### Color Palette

The canonical implementation lives in `frontend/styles/tokens.css`. Components
must consume semantic roles rather than repeat colour literals.

| Role | Token | Value | Primary use |
| --- | --- | --- | --- |
| Burgundy | `--color-action` | `#722F37` | Profile panel and primary actions |
| Interactive burgundy | `--color-action-hover` | `#5A252C` | Link and button hover states |
| Teal accent | `--color-accent` | `#2F5F5F` | Accent bars, focus rings and brand gradients |
| Heading charcoal | `--color-heading` | `#1a1a1a` | Headings and navigation background |
| Body charcoal | `--color-text` | `#2d2d2d` | Primary body copy |
| Muted text | `--color-text-muted` | `#5a5a5a` | Dates and secondary copy |
| Warm background | `--color-background` | `#fefcf9` | Page background |
| Surface | `--color-surface` | `#ffffff` | Content panels and cards |
| Muted surface | `--color-surface-muted` | `#f6f4f0` | Blockquotes and inset backgrounds |
| Border | `--color-border` | `#e8e1d8` | Dividers and card borders |

The canonical brand gradient is `--gradient-brand`: teal to burgundy at 135°.
The vertical-border and lighter profile-ring variants reuse named colour stops
and are defined beside it in the token source.

### Brand Mark System

**Geometric Brand Symbol**: A sophisticated geometric shape system featuring:
- **Primary Element**: Rounded square with subtle gradient (burgundy to teal)
- **Secondary Element**: Central white circle for visual interest
- **Variations**:
  - **Standard (40x40px)**: Navigation and primary placements
  - **Tiny (16x16px)**: Signatures and subtle separators

**Usage Guidelines**:
- Navigation: Show the standard brand mark on all pages
- Post separators: Tiny brand mark between sections
- Footer signatures: Tiny brand mark as content separator
- Implementation: Use `.brand-mark` with the `.brand-mark--tiny` size modifier;
  placements share `.brand-mark-placement` and add its separator modifier only
  when they need vertical spacing

### Pull-Quote / Share Image Asset

Branded images generated from a post's `pull_quote` frontmatter, for sharing on
social platforms (primarily a direct LinkedIn image upload) and as the post's
`og:image`. Generated at build time by `scripts/generate-og-images.mjs`.

- **Frontmatter**: `pull_quote` (the quote text; **required** on every post, so
  every post gets a share image) and `pull_quote_attribution` (optional; e.g.
  `Oscar Barlow, Infrux` — not always the site author, and omitted on the
  author's own posts).
- **Sizes**: `1080×1080` square (primary — best in the LinkedIn feed) and
  `1200×630` landscape (used as `og:image`). Written to
  `output/images/pull-quotes/{YYYY-MM-DD}-{slug}.png` and `-og.png` (the date is
  the post's frontmatter date, matching its URL; it namespaces the files and
  avoids slug clashes).
- **Background**: the favicon / brand-mark gradient —
  `linear-gradient(135deg, #2F5F5F 0%, #722F37 100%)` (teal → burgundy). No new
  brand colours are introduced.
- **Card**: centred rounded rectangle (28px radius), warm off-white `#f6f4f0`,
  soft shadow.
- **Quote**: Inter 700, `#1a1a1a` (`--color-heading`), centred, with curly
  quotes; font size scales down as the quote lengthens so ~200-character quotes
  still fit.
- **Attribution**: Inter 400 italic, `#5a5a5a` (`--color-text-muted`), centred, as
  `— {attribution}` (omitted when there is no attribution).
- **Call to action**: Inter 500, `#5a5a5a` (`--color-text-muted`), centred, below the
  quote — `Read the full post on oscarbarlow.com/writing ->` (the `->` renders as
  an arrow via Inter's ligature). Drives traffic back to the site when the image
  is shared on its own.

### Typography System

**Primary Font**: Inter
- **Weights Used**: 400 (regular), 500 (medium), 600 (semi-bold), 700 (bold)
- **Rationale**: Modern, highly legible, professional yet approachable
- **Application**: All text content, headings, body copy

**Type Scale**:
- `--type-xs`: 0.75rem
- `--type-sm`: 0.875rem
- `--type-base`: 1rem
- `--type-md`: 1.125rem
- `--type-lg`: 1.25rem
- `--type-xl`: 1.5rem
- `--type-2xl`: 1.875rem
- `--type-display`: fluid 2–3rem

Display titles use the fluid step; section headings use `--type-xl` or
`--type-2xl`; prose uses `--type-base` or `--type-md`; metadata uses the two
small steps. Components must not introduce one-off font sizes.

### Spacing System

Spacing uses a quarter-rem base through the named `--space-*` scale in
`frontend/styles/tokens.css`. Margins, padding and gaps must use the scale.
Component geometry such as navigation height and brand-mark size has separate,
explicit component tokens.

### Focus and Motion

- Interactive controls use the shared teal focus ring; controls on the dark
  navigation use the light on-dark variant.
- Fast feedback uses `--motion-duration-fast`, state transitions use
  `--motion-duration-standard`, and emphasised transitions use
  `--motion-duration-emphasis`.
- Brand-mark and loading cycles use named component durations with the shared
  emphasis easing.
- Reduced-motion preferences collapse animation and transition durations to a
  single imperceptible iteration across the site.

### Layout Philosophy

**Asymmetric Split-Screen Design**:
- **Homepage**: 40% profile panel (burgundy) / 60% content panel (white)
- **Content Pages**: Full-width with sidebar navigation (120px)
- **Responsive**: Stacks vertically on mobile, maintains visual hierarchy

**Spatial Principles**:
- **Generous White Space**: Allows content to breathe, creates premium feel
- **Alignment System**: Consistent margins and padding create visual rhythm
- **Content Hierarchy**: Clear visual distinction between content levels
- **Sticky Elements**: The burgundy panel spans the homepage while its profile content remains visible during desktop scrolling

### Interactive Elements

**Navigation System**:
- **Sidebar Navigation**: Fixed left panel (120px width)
- **Vertical Text**: Navigation links in vertical orientation
- **Consistent Branding**: Standard brand mark on all pages
- **Hover States**: Subtle animations and color transitions

**Button Treatments**:
- **Primary Actions**: Burgundy background with subtle gradients
- **Secondary Actions**: Transparent with burgundy borders
- **Hover Effects**: Scale and gradient transitions
- **CV Link**: Special treatment with gradient background on hover

**Micro-Interactions**:
- **Brand Mark**: Standard and tiny marks complete one rotation in approximately one second, rest for three seconds, then repeat while hovered; the linked navigation mark also responds to keyboard focus, and all marks remain static when reduced motion is requested
- **Profile Image**: Subtle scale on hover (1.02x)
- **Navigation Links**: Color and background transitions
- **Form Elements**: Focus states with burgundy accents

## Content Strategy

### Voice & Tone

**Voice Characteristics**:
- **Confident but not arrogant**: Speaks with authority while remaining approachable
- **Thoughtful and analytical**: Shows depth of thinking and consideration
- **Human and authentic**: Professional but with genuine personality
- **Clear and direct**: Avoids jargon, communicates complex ideas simply

**Tone Variations**:
- **Professional contexts**: Measured, strategic, insightful
- **Technical discussions**: Precise, knowledgeable, forward-thinking
- **Personal elements**: Warm, authentic, relatable

### Content Themes

**Primary Themes**:
- Technology leadership and AI transformation
- Human-centered approach to technical solutions
- Building inclusive, high-performing teams
- Bridging technical and business domains
- Ethical considerations in AI and data science

**Supporting Themes**:
- Unconventional career journey as strength
- Innovation through diverse perspectives
- Complex problem-solving approaches
- Future-forward thinking

## Implementation Guidelines

### Homepage Strategy

**Profile Panel Content**:
- Professional headshot (200px, circular, subtle shadow)
- Name and title prominently displayed
- Brief value proposition (2-3 sentences)

**Content Panel Structure**:
- Concise "Writing" introduction describing the site's themes
- "Latest Posts" with excerpts and dates
- Clear navigation to full writing archive
- Subtle burgundy accent elements

### Content Page Layout

**Header Treatment**:
- Clean title presentation aligned with body text
- Inline date styling for posts
- Consistent spacing and typography

**Body Content**:
- Generous line spacing (1.7x) for readability
- Section headings with teal accent bars
- Blockquotes with teal-to-burgundy gradient borders
- Subtle brand mark separators between sections

### Mobile Optimization

**Responsive Adaptations**:
- Split-screen becomes stacked layout
- Sidebar navigation becomes a compact top bar
- Typography scales appropriately
- Touch targets meet accessibility guidelines (44x44px minimum)

## Brand Applications

### Digital Presence

**Website Elements**:
- Consistent color application across all pages
- Brand mark system used throughout
- Typography hierarchy maintained
- Interactive elements follow established patterns

**Future Applications**:
- Email signatures using tiny brand mark
- Social media profile consistency
- Presentation templates with brand colors
- LinkedIn header matching website aesthetic

### Quality Standards

**Visual Consistency**:
- All elements use defined color palette
- Typography follows established hierarchy
- Spacing uses consistent measurements
- Interactive states are predictable and smooth

**Technical Excellence**:
- Fast loading times
- Accessibility compliance (WCAG AA)
- Mobile-first responsive design
- Progressive enhancement approach

## Brand Differentiation

### Against Generic Executive Websites

**Avoiding "Vanilla" Design**:
- Asymmetric layout challenges conventional centered designs
- Sophisticated color palette moves beyond blue/gray corporate standards
- Geometric brand mark creates memorable visual identity
- Personality shows through design choices while maintaining professionalism

### Positioning Strategy

**Technical Leader with Depth**:
- Visual sophistication suggests high-level strategic thinking
- Human-centered messaging differentiates from purely technical leaders
- Unique career narrative becomes competitive advantage
- Design quality signals attention to detail and execution excellence

### Competitive Advantages

**Design Elements That Stand Out**:
- Distinctive burgundy/charcoal/teal color scheme
- Sophisticated geometric brand mark system
- Asymmetric split-screen layout
- Thoughtful typography and spacing
- Subtle but purposeful animations

## Maintenance & Evolution

### Consistency Guidelines

**When Making Updates**:
- Always use established color variables
- Maintain typography hierarchy
- Follow spacing conventions
- Test responsive behavior
- Ensure accessibility compliance

### Future Considerations

**Potential Expansions**:
- Additional brand mark variations for different contexts
- Extended color palette for specific use cases
- Template system for recurring content types
- Integration with external platforms while maintaining brand consistency

### Quality Assurance

**Regular Checks**:
- Color contrast compliance
- Typography consistency across pages
- Interactive element behavior
- Mobile responsiveness
- Loading performance
- Brand mark placement and sizing

This style guide serves as the definitive reference for maintaining Oscar Barlow's personal brand consistency across all digital touchpoints, ensuring a cohesive and memorable professional presence that effectively communicates technical leadership capabilities while showcasing authentic personality and innovative thinking.
