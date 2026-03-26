import XCTest
import SwiftTreeSitter
import TreeSitterCOSMOS

final class TreeSitterCOSMOSTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_cosmos())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading COSMOS grammar")
    }
}
