# repos/

Put the real code here. Two options:

## Option A - symlink (recommended, stays up to date)
  ln -s /absolute/path/to/territool-mobile ./mobile
  ln -s /absolute/path/to/territool-web    ./web

## Option B - clone
  git clone <mobile-repo-url> mobile
  git clone <web-repo-url>    web

Claude Code reads these READ-ONLY during the audit phase.
It will never commit or push without you asking.
