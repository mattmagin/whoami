//! Text wrapping utilities for terminal display

use unicode_width::UnicodeWidthStr;

/// Wrap text to fit within a given width while preserving words
pub fn wrap_text(text: &str, max_width: usize) -> Vec<String> {
    if max_width == 0 {
        return vec![text.to_string()];
    }

    let mut result = Vec::new();

    for line in text.lines() {
        if line.is_empty() {
            result.push(String::new());
            continue;
        }

        // Don't wrap markdown headings, list items (they're usually short)
        // or code fence markers
        if line.starts_with('#') || line.starts_with("```") {
            result.push(line.to_string());
            continue;
        }

        // Preserve indentation for list items
        let (indent, content) = extract_indent(line);
        let indent_width = UnicodeWidthStr::width(indent);
        let effective_width = max_width.saturating_sub(indent_width);

        if effective_width < 10 {
            // Too narrow to wrap meaningfully
            result.push(line.to_string());
            continue;
        }

        let wrapped = wrap_line(content, effective_width, indent);
        result.extend(wrapped);
    }

    result
}

/// Extract leading whitespace/indentation from a line
fn extract_indent(line: &str) -> (&str, &str) {
    let trimmed = line.trim_start();
    let indent_len = line.len() - trimmed.len();
    (&line[..indent_len], trimmed)
}

/// Wrap a single line of text, preserving the given indent on continuation lines
fn wrap_line(text: &str, max_width: usize, indent: &str) -> Vec<String> {
    let mut result = Vec::new();
    let mut current_line = String::from(indent);
    let mut current_width = UnicodeWidthStr::width(indent);
    let mut is_first_line = true;

    for word in text.split_whitespace() {
        let word_width = UnicodeWidthStr::width(word);

        if current_width + word_width + 1 > max_width && !is_first_line {
            // Start a new line
            if !current_line.trim().is_empty() {
                result.push(current_line);
            }
            current_line = format!("{}{}", indent, word);
            current_width = UnicodeWidthStr::width(indent) + word_width;
        } else if current_line.trim().is_empty() {
            // First word on line
            current_line = format!("{}{}", indent, word);
            current_width = UnicodeWidthStr::width(indent) + word_width;
            is_first_line = false;
        } else {
            // Add word to current line
            current_line.push(' ');
            current_line.push_str(word);
            current_width += word_width + 1;
            is_first_line = false;
        }
    }

    if !current_line.is_empty() {
        result.push(current_line);
    }

    if result.is_empty() {
        result.push(String::new());
    }

    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_wrap_short_line() {
        let result = wrap_text("Hello world", 80);
        assert_eq!(result, vec!["Hello world"]);
    }

    #[test]
    fn test_wrap_long_line() {
        let result = wrap_text("This is a longer line that should wrap", 20);
        assert_eq!(result.len(), 2);
    }

    #[test]
    fn test_preserve_heading() {
        let result = wrap_text("# This is a heading", 10);
        assert_eq!(result, vec!["# This is a heading"]);
    }
}
