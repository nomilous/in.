
    git clone https://github.com/nomilous/in..git
    cd in.

Update submodules before npm install.

    git submodule init
    git submodule update

For the rest of the submodules

    npm install

Run all tests

    node_modules/.bin/objective

Run only tests for in.

    node_modules/.bin/objective --once

p.s. This saves a lot of nuisance

    git config --global credential.helper osxkeychain

