print = data => {
    if ('string' !== typeof data)
        data = JSON.stringify(data);

    console.log(data);
};

var unpack = require('../index.js');

unpack.unpack('ungzip', 'gzips/', ['2017-03-09.txt.gz', '2017-03-10.txt.gz'], print);
unpack.unpack('untar', 'tars/', ['2017-03-09.tar.gz', '2017-03-10.tar.gz'], print);