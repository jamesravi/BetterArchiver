function Archiver(name, id, checkfunc, savefunc) {
    this.name = name;
    this.id = id;
    this.check = checkfunc;
    this.savefunc = savefunc;
    this.enabled = true;
}

function get_archivers_json() {
    result = {}
    for (archiverid of Object.keys(archivers)) {
        result[archiverid] = archivers[archiverid].enabled;
    }
    return JSON.stringify(result);
}

var archivers = {};
archivers["archiveorg"] = new Archiver("Archive.org", "archiveorg", null, null)
archivers["archivetoday"] = new Archiver("Archive.today", "archivetoday", null, null)
archivers["ghostarchive"] = new Archiver("Ghost Archive", "ghostarchive", null, null)
