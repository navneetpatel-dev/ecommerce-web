Perform a **complete frontend architecture and code-quality refactoring** of the entire web project to make it highly modular, reusable, maintainable, and industry-standard.

### Requirements

1. **Separate Logic from UI**

   - Move all business logic, state management, API calls, transformations, handlers, and side effects out of components and into appropriate reusable hooks/utilities.
   - Components should focus strictly on presentation and composition.

2. **Clean & Modular Components**

   - Refactor all components, pages, containers, JSX files, hooks, and TypeScript utilities so they remain small, focused, and reusable.
   - Extract large or repeated logic into appropriate components/hooks/utils/files.
   - Maximize reuse of existing components, hooks, utilities, types, and functionality across the project.

3. **Extremely Clean JSX**

   - JSX-returning components must contain **presentation/composition only**.
   - No state/business logic, inline functions, complex conditions, transformations, hardcoded data, or `.map()` logic inside JSX.
   - Move repeated/complex rendering logic into dedicated components or appropriate files.
   - JSX should be clean, readable, and easy to understand at a glance.

4. **Centralized Styling**

   - Do not hardcode class names throughout components.
   - Centralize reusable class combinations/styles and reuse them consistently.
   - Remove duplicated styling definitions wherever possible.

5. **API & Schemas**

   - Properly organize, separate, and modularize API clients, endpoints, request/response types, schemas, and related logic.
   - Avoid duplicated API calls, schemas, types, and configurations.

6. **Maximum Reusability**

   - Audit the entire project for duplicate functionality and consolidate it into shared components, hooks, utilities, constants, types, schemas, and services wherever appropriate.
   - Before creating anything new, check whether an existing implementation can be reused or extended.

7. **Industry-Standard Structure**

   - Establish clear separation of concerns, predictable file organization, clean dependency boundaries, consistent naming, and scalable module structure.
   - Apply any additional architectural or code-quality improvements you identify as necessary.

### Critical Constraints

**Do not break any existing feature, functionality, API contract, UI behavior, validation, state behavior, or user flow.**

First analyze the **entire frontend codebase and its existing patterns**, then refactor systematically. Do not blindly over-abstract or introduce unnecessary layers.

After completion, verify the project builds successfully and run available linting/tests/type-checks. Provide a concise summary of the major refactoring, reused/shared code, structural improvements, and verification performed.
