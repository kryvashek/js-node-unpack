module.exports = {
    unpack: unpack
};

// ungzip or untar needed files or folders and process them via callback
function unpack(type, folder, names, callbackfn) {
    var routines = [],
        extracted = {},
        unpackers = new Unpackers();

    if (!unpackers.hasOwnProperty(type))
        return false;

    routines = names.map(item => ({
        func: unpackers[type],
        args: [folder + item, data => { extracted[item] = data; }],
        cbkey: 1
    }));

    require('silly-barrier').barrier(routines, { func: callbackfn, args: [extracted] });

    return true;
}

// create stream from file compressed with gzip
function readUngzipStream(file) {
    var fs = require('fs');
    return (fs.existsSync(file) ? fs.createReadStream(file).pipe(require('zlib').createGunzip()) : undefined);
}

// creates object with possible unpackers
function Unpackers() {
    // reads data from ungzipped stream and saves it in the given location
    this.ungzip = (path, callbackfn) => {
        var input = readUngzipStream(path);

        if (!input)
            return false;

        var data = [];

        input.on('data', chunk => { data += chunk; });
        input.on('end', () => { callbackfn(data); });

        return true;
    };

    // reads data from ungzipped tar archive and saves different file contents from within
    this.untar = (path, callbackfn) => {
        var input = readUngzipStream(path);

        if (!input)
            return false;

        var extract = input.pipe(require('tar-stream').extract()),
            data = {};

        extract.on('entry', (header, stream, next) => {
            var name = header.name;

            name = name.substr(name.lastIndexOf('/') + 1);
            data[name] = [];
            stream.on('data', chunk => { data[name] += chunk; });
            stream.on('end', () => { next(); });
            stream.resume();
        });
        extract.on('finish', () => { callbackfn(data); });

        return true;
    };
}