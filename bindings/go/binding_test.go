package tree_sitter_freebasic_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_freebasic "github.com/tree-sitter/tree-sitter-freebasic/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_freebasic.Language())
	if language == nil {
		t.Errorf("Error loading C grammar")
	}
}
