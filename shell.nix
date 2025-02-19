let
  pkgs = import <nixpkgs> {};
in pkgs.mkShell {
  packages = [
    pkgs.nodejs
    pkgs.yarn
    (pkgs.python3.withPackages (python-pkgs: [
      python-pkgs.psycopg2
      python-pkgs.flask
      python-pkgs.flask-socketio
    ]))
  ];
}