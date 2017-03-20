print = (errors, data) => {
    if (errors)
        console.log('Errors occured while extracting!', errors);

    if ('string' !== typeof data)
        data = JSON.stringify(data);

    console.log(data);
};

require('./index.js').unpack('test/', ['gzips/A.txt.gz', 'gzips/B.txt.gz', 'targzips/C.tar.gz', 'targzips/D.tar.gz', 'tars/E.tar', 'tars/F.tar'], print);