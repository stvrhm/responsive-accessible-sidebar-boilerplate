# Responsive & Accessible Sidebar Boilerplate

A professional boilerplate for a responsive and accessible sidebar layout using modern CSS (Flexbox, Logical Properties) and vanilla JS for progressive enhancement.

This boilerplate is pre-configured with a modern development environment using Vite, Prettier, ESLint, and Vitest.

## Features

- **Responsive Design**: Mobile-first layout that adapts from small screens to desktop.
- **Accessibility First**: Proper ARIA roles and focus management.
- **RTL Support**: Uses CSS Logical Properties for automatic layout flipping.
- **Modern Tooling**: Fast development server and automated code quality checks.
- **Zero Dependencies**: The final output has no runtime dependencies.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/responsive-accessible-sidebar-boilerplate.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd responsive-accessible-sidebar-boilerplate
    ```
3.  **Install development dependencies:**
    ```bash
    npm install
    ```
4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    Your site is now running at `http://localhost:5173/`. Vite will automatically reload the page when you make changes to the code.

## Available `npm` Scripts

- `npm run dev`: Starts the Vite development server with live reload.
- `npm run build`: Creates a production-ready `dist` folder with optimized files.
- `npm run preview`: Serves the `dist` folder locally to preview the production build.
- `npm test`: Runs the test suite using Vitest.
- `npm run format`: Formats all `.html`, `.css`, and `.js` files with Prettier.
  -- `npm run lint`: Runs both the JavaScript and CSS linters.
- `npm run lint:js`: Checks JavaScript files for errors with ESLint.
- `npm run lint:css`: Checks CSS files for errors with stylelint.
