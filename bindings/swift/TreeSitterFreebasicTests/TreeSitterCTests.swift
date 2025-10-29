import XCTest
import SwiftTreeSitter
import TreeSitterFreebasic

final class TreeSitterFreebasicTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_freebasic())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading C grammar")
    }
}
