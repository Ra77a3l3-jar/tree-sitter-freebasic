{
  description = "Tree-sitter grammar for FreeBasic";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs
            tree-sitter
            gcc
            python3
            cargo
            rustc
            go
          ];

          shellHook = ''
            echo "Tree-sitter FreeBasic development environment"
            echo "Available commands:"
            echo "  tree-sitter generate    - Generate parser from grammar"
            echo "  tree-sitter test        - Run test corpus"
            echo "  tree-sitter parse FILE  - Parse a file"
            echo ""
          '';
        };
      }
    );
}
