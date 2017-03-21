module.exports = {
    unpack: unpack
};

var FS = require('fs'),
    ZL = require('zlib'),
    TS = require('tar-stream');

/**
 * @description Decompress several Gzip/Tar archives and saves got data in the memory
 * @requires Requires tar-stream module and correct extensions of unpacking files.
 * @param folder Path prefix for every unpacking file (can easily be empty).
 * @param names Array of filnames to decompress.
 * @param callbackfn Function to execute after decompressing all the given entries, should process arguments:
 *     errors (array of errors occured while processing),
 *     extracted (data extracted from all the entries).
 * @returns Returns nothing.
 **/
function unpack(folder, names, callbackfn) {
    var extracted = {},
        unpackers = new Unpackers(),
        errors,
        routines = names.map(item => {
            var type = unpackers.properType(item),
                mistake = { item: item };

            if (!unpackers.hasOwnProperty(type))
                mistake.reason = 'Item ignored: unpacker unspecified for such file type';
            else if (!FS.existsSync)
                mistake.reason = 'Item ignored: no such file';

            if (mistake.reason) {
                if (errors)
                    errors.push(mistake);
                else
                    errors = [mistake];
            } else
                return {
                    func: unpackers[type],
                    args: [folder + item, data => { extracted[item] = data; }],
                    cbkey: 1
                };
        });

    require('silly-barrier').barrier(routines, { func: callbackfn, args: [errors, extracted] });

    return true;
}

// creates stream from raw stream compressed with gzip
function ungzipStream(rawstream) {
    return (rawstream ? rawstream.pipe(ZL.createGunzip()) : undefined);
}

// creates stream from raw stream archived with tar
function untarStream(rawstream) {
    return (rawstream ? rawstream.pipe(TS.extract()) : undefined);
}

// proceeds data from the stream made of gzip file
function processUngzipStream(extract, callbackfn) {
    var data = [];

    extract.on('data', chunk => { data += chunk; });
    extract.on('end', () => { callbackfn(data); });
}

// proceeds data from the stream made of tar file
function processUntarStream(extract, callbackfn) {
    var data = {};

    extract.on('entry', (header, stream, next) => {
        var name = header.name;

        name = name.substr(name.lastIndexOf('/') + 1);
        data[name] = [];
        stream.on('data', chunk => { data[name] += chunk; });
        stream.on('end', () => { next(); });
        stream.resume();
    });
    extract.on('finish', () => { callbackfn(data); });
}

// checks whether previous extension can be replaced with new one for the given filename
function checkNewExt(filename, oldExtLen, newExt) {
    return newExt.length > oldExtLen && filename.endsWith(newExt);
}

// returns the longer of given extensions of file if it suits or empty string if no such extension presented
function checkFormat(filename, extensions) {
    if (extensions)
        return extensions.reduce((prevExt, currExt) => (checkNewExt(filename, prevExt.length, currExt) ? currExt : prevExt), '');
    else
        return '';
}

// creates object with possible unpackers
function Unpackers() {
    // map of supported formats and related file extensions
    this.types = {
        untar: ['tar'],
        untargzip: ['tar.gz', 'tar.z', 'tgz'],
        ungzip: ['gz', 'z']
    };

    // function to choose easily correct format for specified filename (based on extension)
    this.properType = filename => {
        var prevExtLen = 0;

        filename = filename.toLocaleLowerCase();

        return Object.keys(this.types).reduce((prevType, currType) => {
            var currExt = checkFormat(filename, this.types[currType]);

            if (checkNewExt(filename, prevExtLen, currExt)) {
                prevExtLen = currExt.length;
                return currType;
            } else
                return prevType;
        }, '');
    };

    // reads data from ungzipped stream and saves it in the given location
    this.ungzip = (path, callbackfn) => {
        var input = FS.createReadStream(path);

        processUngzipStream(ungzipStream(input), callbackfn);
    };

    // reads data from tar archive and saves different file contents from within
    this.untar = (path, callbackfn) => {
        var input = FS.createReadStream(path);

        processUntarStream(untarStream(input), callbackfn);
    };

    // reads data from ungzipped tar archive and saves different file contents from within
    this.untargzip = (path, callbackfn) => {
        var input = FS.createReadStream(path);

        processUntarStream(untarStream(ungzipStream(input)), callbackfn);
    };
}