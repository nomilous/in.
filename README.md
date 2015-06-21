# in.

## in.plementation in p.ogr..s

### end goal

as arbitrary example

```javascript

require('in.')(
  function(
    liveZones, // in.as.json $ cat {{file.name for file in expand.dir('/etc/bind/zones/db.*')}} | zone2json
    dbZones   // in.as.json $ psql -c "SELECT * ... OUTER JOIN ... INNER PEACE ... WHERE domain = '{{z.domain for z in args.liveZones}}' | psql2json
  ) {
    liveZones.forEach( function(zone) { ... /* etc. */
  }
);

```
