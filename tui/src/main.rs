//! TUI Portfolio Application entrypoint.

use std::io;

fn main() -> io::Result<()> {
    whoami_tui::runtime::run_stdio_tui()
}
