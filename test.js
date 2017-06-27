print = (errors, data) => {
    if (errors)
        console.log('Errors occured while extracting!\n', errors);

    console.log('Extracted data is\n', data);
};

require('./index.js').unpack(['gzips/A.txt.gz', 'gzips/B.txt.gz', 'targzips/C.tar.gz', 'targzips/D.tar.gz', 'tars/E.tar', 'tars/F.tar'], print, 'test/');