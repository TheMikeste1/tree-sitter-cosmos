import XCTest
import SwiftTreeSitter
import TreeSitterCosmos

final class TreeSitterCosmosTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_cosmos())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Cosmos grammar")
    }
}
