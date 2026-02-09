# Portfolio TUI (Rust)

A terminal-based portfolio viewer built with Rust and Ratatui. This is a Rust port of the Go/Bubble Tea TUI.

## Features

- **Home Screen**: ASCII art logo with typewriter animation and navigation menu
- **Resume View**: Scrollable markdown-rendered resume with syntax highlighting
- **Blog View**: List of blog posts with detail view and scrolling
- **Projects View**: Project cards with tech stack tags and links
- **Contact Form**: Interactive form with validation and success state

## Tech Stack

- [Ratatui](https://ratatui.rs/) - TUI framework (similar to Bubble Tea)
- [Crossterm](https://github.com/crossterm-rs/crossterm) - Terminal handling
- Tokyo Night color theme

## Build & Run

```bash
# Build
cargo build

# Run
cargo run

# Build release
cargo build --release
```

## Keyboard Navigation

### Global
- `Ctrl+C` - Quit

### Home Screen
- `↑/k` - Move up
- `↓/j` - Move down
- `Enter` - Select
- `r/b/p/c` - Direct navigation to Resume/Blog/Projects/Contact
- `q` - Quit

### Resume/Blog/Projects
- `↑/k` - Scroll up / Previous item
- `↓/j` - Scroll down / Next item
- `u` / `Page Up` - Page up (Resume only)
- `d` / `Page Down` - Page down (Resume only)
- `Enter` - Open post (Blog only)
- `Esc` / `q` - Back to home

### Contact Form
- `Tab` - Next field
- `Shift+Tab` - Previous field
- `Enter` - Submit
- `Esc` - Back to home

## Project Structure

```
rust-tui/
├── Cargo.toml           # Dependencies
├── src/
│   ├── main.rs          # Entry point and event loop
│   ├── app.rs           # Application state and routing
│   ├── content.rs       # Static content (resume, posts, projects)
│   ├── styles.rs        # Tokyo Night color theme
│   ├── typewriter.rs    # Typewriter animation component
│   └── views/
│       ├── mod.rs       # Views module
│       ├── home.rs      # Home screen
│       ├── resume.rs    # Resume view
│       ├── blog.rs      # Blog list and detail
│       ├── projects.rs  # Projects list
│       └── contact.rs   # Contact form
└── README.md
```
