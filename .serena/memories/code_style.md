The project follows the coding standards outlined in `GEMINI.md`. Key points include:

- **File Naming**: Lowercase with hyphens (e.g., `my-component.tsx`).
- **Import Order**: External libraries, internal modules, then stylesheets, separated by blank lines.
- **Code Style**: 2-space indentation, mandatory semicolons, single quotes for strings, camelCase for variables, and UPPER_CASE_WITH_UNDERSCORES for constants.
- **TypeScript**: Strict typing for variables, function arguments, and return values. Use interfaces or type aliases for complex types.
- **Functions**: Use arrow functions, with names starting with a verb (e.g., `const fetchData = ...`).
- **Components**: Use functional components. Component names are PascalCase (e.g., `const MyComponent: React.FC<Props> = ...`).
- **Error Handling**: Use `try-catch` blocks for asynchronous operations.
- **Next.js**: Use the App Router. Pages are in `app/`, and API routes are in `app/api/`.
- **Icons**: Use `lucide-react` for icons.
- **Design**: Follows the design guidelines in `GEMINI.md`, which specify a dark mode color palette, spacing based on 4px multiples, a typography scale, and component styles for buttons, cards, and inputs. It also includes guidelines for animations and glassmorphism effects.