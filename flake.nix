{
  description = "Development shell for the Bridgetown portfolio";

  inputs = {
    # These snapshots provide the exact versions selected for Render.
    nixpkgs.url = "github:NixOS/nixpkgs/1055f58374f42fd07626aec0ef4fb1d658add341";
    ruby-nixpkgs.url = "github:NixOS/nixpkgs/c407032be28ca2236f45c49cfb2b8b3885294f7f";
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
          nodejs = pkgs.nodejs_24;
          rubyVersion = pkgs.lib.trim (builtins.readFile ./.ruby-version);
          nodeVersion = pkgs.lib.trim (builtins.readFile ./.nvmrc);
        in {
          default =
            assert pkgs.lib.assertMsg (toString ruby.version == rubyVersion)
              "Nix Ruby must match .ruby-version; select a matching ruby-nixpkgs snapshot.";
            assert pkgs.lib.assertMsg (nodejs.version == nodeVersion)
              "Nix Node must match .nvmrc; select a matching nixpkgs snapshot.";
            pkgs.mkShell {
              packages = [
                ruby
                (rubyPkgs.bundler.override { inherit ruby; })
                nodejs
                (pkgs.yarn.override { inherit nodejs; })
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
