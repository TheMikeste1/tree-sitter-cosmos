#include "tree_sitter/parser.h"
#include <wctype.h>

enum TokenType {
  CODE,
};

void *tree_sitter_cosmos_external_scanner_create() { return NULL; }
void tree_sitter_cosmos_external_scanner_destroy(void *payload) {}
unsigned tree_sitter_cosmos_external_scanner_serialize(void *payload, char *buffer) { return 0; }
void tree_sitter_cosmos_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {}

static void advance(TSLexer *lexer) { lexer->advance(lexer, false); }

bool tree_sitter_cosmos_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) {
  if (!valid_symbols[CODE]) return false;

  bool consumed = false;

  while (lexer->lookahead != 0) {
    if (lexer->lookahead == 'G') {
      lexer->mark_end(lexer);

      const char *markers[] = {
        "GENERIC_READ_CONVERSION_END",
        "GENERIC_WRITE_CONVERSION_END"
      };

      bool potential[2] = {true, true};
      int i = 0;

      while (potential[0] || potential[1]) {
        bool matched_any = false;
        for (int m = 0; m < 2; m++) {
          if (potential[m]) {
            if (markers[m][i] == '\0') {
              // Found a complete match for an end marker.
              // Stop here and return the code consumed so far.
              if (consumed) {
                lexer->result_symbol = CODE;
                return true;
              }
              return false;
            }
            if (lexer->lookahead == markers[m][i]) {
              matched_any = true;
            } else {
              potential[m] = false;
            }
          }
        }

        if (!matched_any) {
          // No longer matching any marker. All advanced characters are part of the code.
          break;
        }

        advance(lexer);
        i++;
      }
      consumed = true;
      lexer->mark_end(lexer);
    } else {
      advance(lexer);
      consumed = true;
      lexer->mark_end(lexer);
    }
  }

  if (consumed) {
    lexer->result_symbol = CODE;
    return true;
  }

  return false;
}
