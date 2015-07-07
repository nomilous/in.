objective 'Argument Infuser', (link) ->

    link.root 'node_modules/in.actor.read/objective'
    .then -> link.root 'node_modules/in.actor.shell/objective'
    .then -> link.root 'node_modules/in.adapter.json/objective'
    .then -> link.root 'node_modules/in.adapter.lines/objective'
    .then -> link.root 'node_modules/in.expander.dir/objective'
