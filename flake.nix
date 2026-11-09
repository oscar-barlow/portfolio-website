{
  description = "Development shell for the Bridgetown portfolio";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    # Ruby 3.2 was removed from newer nixpkgs releases.
    ruby-nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
  };

  outputs = { nixpkgs, ruby-nixpkgs, ... }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
    in {
      devShells = nixpkgs.lib.genAttrs systems (system:
        let
          pkgs = import nixpkgs { inherit system; };
          rubyPkgs = import ruby-nixpkgs { inherit system; };
          ruby = rubyPkgs.ruby_3_2;
        in {
          default = pkgs.mkShell {
            packages = [
              ruby
              (rubyPkgs.bundler.override { inherit ruby; })
              pkgs.nodejs_24
              (pkgs.yarn.override { nodejs = pkgs.nodejs_24; })
              pkgs.gnumake
              pkgs.pkg-config
              pkgs.git
              pkgs.jq
              pkgs.yq-go
            ];

            buildInputs = [ pkgs.openssl pkgs.libyaml pkgs.zlib ];

            shellHook = ''
              export BUNDLE_PATH="$PWD/vendor/bundle"
              # Bundler may install the version recorded in Gemfile.lock.
              export GEM_HOME="$PWD/.direnv/gems"
              export GEM_PATH="$GEM_HOME:$(ruby -e 'puts Gem.default_dir')"
              export PATH="$PWD/bin:$GEM_HOME/bin:$PATH"
            '';
          };
        });
    };
}
