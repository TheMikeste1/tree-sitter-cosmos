package tree_sitter_cosmos_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_cosmos "github.com/tree-sitter/tree-sitter-cosmos/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_cosmos.Language())
	if language == nil {
		t.Errorf("Error loading COSMOS grammar")
	}
}
