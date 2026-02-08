package main

import (
	"fmt"
	"strings"

	tea "github.com/charmbracelet/bubbletea"
)

type page struct { text string }

func newPage(text string) page {
	return page{text: text}
}

func (s page) Init() tea.Cmd { return nil }

func (s page) View() string {
    textLen := len(s.text)
    topAndBottomBar := strings.Repeat("*", textLen + 4)
    return fmt.Sprintf(
        "%s\n* %s *\n%s\n\nPress Ctrl+C to exit",
        topAndBottomBar, s.text, topAndBottomBar,
    )
}

func (s page) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
    switch msg.(type) {
    case tea.KeyMsg:
        switch msg.(tea.KeyMsg).String() {
        case "ctrl+c":
            return s, tea.Quit
        }
    }
    return s, nil
}

