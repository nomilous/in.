# in.

## implementation in p.ogr..s

### end goal

as arbitrary example

```javascript

require('in.')(
  function(
    liveZones, // in.as.json $ cat {for file in expand.dir(/etc/bind/zones/db.*)} | zone2json
    dbZones   // in.as.json $ psql -c "SELECT * F ... WHERE domain = '{for .domain in expand(liveZones)}' | psql2json"
  ) {
    liveZones.forEach( function(zone) { ... /* etc. */
  }
);

```
