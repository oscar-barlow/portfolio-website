# Claude Development Guidelines for Oscar Barlow's Portfolio Website

## Overview

This document provides guidelines for Claude when making design and development changes to Oscar Barlow's portfolio website. These guidelines ensure brand consistency and help maintain the site's visual identity and user experience standards.

## Primary Reference Documents

### Brand Guidelines
**Always consult `brand.md` before making any design decisions.** This file contains:
- Complete brand identity system including colors, typography, and visual elements
- Brand mark usage guidelines and specifications  
- Layout philosophy and spatial principles
- Voice, tone, and content strategy
- Interactive element behaviors and micro-interactions

### Brand Evolution Process
When making design decisions with the user that deviate from existing brand guidelines:

1. **Discuss the deviation**: Clearly explain how the proposed change differs from current brand guidelines
2. **Document the decision**: After user approval, immediately update `brand.md` to reflect the new guidelines
3. **Update examples**: Include specific implementation details and usage contexts
4. **Version the change**: Add a note about when and why the guideline was updated

## Development Principles

### Design Consistency
- **Color Usage**: Always use CSS custom properties defined in the brand guidelines:
  - `--action-color: #722F37` (burgundy)
  - `--tertiary-color: #2F5F5F` (teal)  
  - `--heading-color: #1a1a1a` (charcoal)
  - Supporting neutrals as defined in brand.md
- **Typography**: Maintain the established Inter font hierarchy
- **Spacing**: Follow consistent margin and padding patterns
- **Brand Mark**: Use appropriate size variants (standard/small/tiny) in correct contexts

### Interactive Elements
- **Hover States**: Follow established patterns (subtle scale, color transitions)
- **Animations**: Use consistent timing (0.2s for quick interactions, 0.6s for more dramatic effects)
- **Brand Mark Behavior**: Standard rotation and scale effects (45° rotation, 1.1x scale)
- **Transitions**: Use `ease` timing function for smooth, natural movement

### Recent Decisions & Updates

#### Profile Photo Enhancement (August 2024)
**Decision**: Applied brand mark gradient to profile photo with enhanced rotation animation
**Implementation**:
- Lighter gradient colors for better contrast against burgundy background: `#4A8A8A` to `#A55A65`
- 110-degree rotation on hover (more dramatic than brand mark's 45 degrees)
- 0.6s transition timing for elegant movement
- Container-based approach with flexbox centering

**Brand Guidelines Update**: Added profile photo animation specifications to `brand.md` under "Interactive Elements"

#### Brand Mark Favicon (August 2024) 
**Decision**: Created SVG favicon using brand mark design
**Implementation**:
- SVG format with burgundy-teal gradient
- Multiple sizes (16x16, 32x32) for different contexts
- Proper HTML fallbacks for browser compatibility
- Maintains brand consistency across all browser touchpoints

## Code Quality Standards

### CSS Architecture
- Use semantic class names that reflect component purpose
- Maintain consistent indentation and spacing
- Group related properties logically
- Comment major sections for clarity
- Use CSS custom properties for brand colors and reusable values

### Responsive Design
- Mobile-first approach as outlined in brand guidelines
- Test breakpoints at 768px, 1024px per brand specifications
- Maintain visual hierarchy across all screen sizes
- Ensure touch targets meet 44x44px minimum on mobile

### Accessibility
- Maintain WCAG AA compliance
- Ensure color contrast meets accessibility standards
- Provide proper semantic HTML structure
- Test keyboard navigation
- Include appropriate alt text and ARIA labels

## Implementation Workflow

### Before Making Changes
1. **Review brand.md**: Understand current guidelines for the component/area being modified
2. **Check existing patterns**: Look at similar implementations elsewhere in the codebase
3. **Consider responsive behavior**: Ensure changes work across all breakpoints
4. **Verify accessibility**: Check color contrast and semantic structure

### During Development
1. **Use established patterns**: Leverage existing CSS classes and utilities where possible
2. **Test interactivity**: Verify hover states and animations match brand standards
3. **Validate responsive**: Test across different screen sizes
4. **Check consistency**: Ensure new elements harmonize with existing design

### After Implementation
1. **Update documentation**: If guidelines were modified, update brand.md immediately
2. **Test thoroughly**: Verify all interactive elements work as expected
3. **Commit with context**: Include clear commit messages explaining the changes and their relationship to brand guidelines

## Common Patterns & Components

### Brand Mark Usage
- **Navigation**: Standard size (40x40px) on homepage, small size (24x24px) on content pages
- **Headers**: Small brand mark aligned with titles  
- **Separators**: Tiny brand mark (16x16px) between sections
- **Signatures**: Tiny brand mark in footer areas

### Color Applications
- **Backgrounds**: Burgundy for profile panels, white/off-white for content areas
- **Accents**: Teal for section dividers, subtle highlights
- **Interactive States**: Burgundy for primary actions, gradient effects for special elements

### Animation Guidelines
- **Timing**: 0.2s for quick feedback, 0.6s for emphasis
- **Easing**: Use `ease` function for natural movement
- **Transforms**: Prefer scale and rotation over position changes
- **Hover Effects**: Subtle but noticeable (1.02x scale for photos, 1.1x for brand marks)

## Troubleshooting

### Common Issues
- **Color Inconsistency**: Always use CSS custom properties, never hardcoded hex values
- **Typography Hierarchy**: Check font-size, weight, and line-height against brand.md specifications
- **Spacing Problems**: Use consistent margin/padding patterns established in existing components
- **Animation Performance**: Prefer transform and opacity changes over layout-affecting properties

### When Guidelines Conflict
1. **Prioritize user experience**: Accessibility and usability take precedence
2. **Maintain brand integrity**: Discuss with user before making major deviations
3. **Document decisions**: Update brand.md with new patterns that emerge
4. **Test thoroughly**: Ensure changes don't break existing functionality

## Brand Evolution Tracking

### Recent Updates
- **August 2024**: Enhanced profile photo with gradient border and rotation animation
- **August 2024**: Created brand mark favicon system with multiple format support

### Future Considerations
- Template system for recurring content types
- Extended color palette for specific use cases
- Additional brand mark variations for different contexts
- Integration patterns for external platforms

## Quality Checklist

Before finalizing any design changes:

- [ ] Colors use established CSS custom properties
- [ ] Typography follows brand hierarchy
- [ ] Interactive elements use consistent timing and easing
- [ ] Responsive behavior works across all breakpoints
- [ ] Accessibility standards are maintained
- [ ] Brand mark usage follows size and context guidelines
- [ ] Changes are documented in brand.md if they establish new patterns
- [ ] Code follows established architectural patterns
- [ ] All animations are smooth and purposeful
- [ ] Visual consistency is maintained with existing elements

## Contact & Iteration

This document should evolve alongside the website. When new patterns emerge or guidelines change:

1. Update this document immediately
2. Cross-reference with brand.md for consistency
3. Ensure all team members (if applicable) understand changes
4. Test changes across the entire site to prevent regressions

Remember: The goal is to maintain Oscar Barlow's distinctive and professional brand identity while ensuring excellent user experience and technical implementation quality.