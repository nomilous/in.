# in.

## implementation in p.ogr..s

### end goal

as arbitrary example

```javascript

require('in.')(
  function(
    live,  // in.as.json shell cat {for file in expand.dir(/etc/bind/zones/db.*)} | zone2json
    zones  // in.as.json shell psql -c "SELECT * F ... WHERE domain = '{for .domain in expand(live)}' | psql2json"
  ) {

    live.forEach( function(zone) { ... /* etc. */

  }
);

```
