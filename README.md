# silly-unpack #
Simple Node.JS routine to massively decompress to memory files archived as Gzip and, optionally, Tar.

## Version ##
Current module version is 0.2.1.

## License ##
**silly-unpack** is licensed under BSD 3-Clause license. See [license](./LICENSE) for details.

## Usage ##
### Install ###
Just run command `npm install silly-unpack` to have this module installed for your project. See usage of **npm** tool for details.

### Dependencies ###
Current version of **silly-unpack** depends on the next modules:

* **silly-barrier**,
* **tar-stream**.

### Test ###
To test module just run command `cd test && nodejs test.js && cd ..` from the folder where `index.js` is placed. Output should appear like that one:

	{"2017-03-09.txt.gz":"Some text in gzipped file `temptemp.txt`.","2017-03-10.txt.gz":"Some text in gzipped file `temp.txt`."}
	{"2017-03-09.tar.gz":{"temptemp2.txt":"Some text in gzipped and then tarred file `temptemp2.txt`.","temptemp1.txt":"Some text in gzipped and then tarred file `temptemp1.txt`."},"2017-03-10.tar.gz":{"temp2.txt":"Some text in gzipped and then tarred file `temp2.txt`.","temp1.txt":"Some text in gzipped and then tarred file `temp1.txt`."}}

### Run ###

To use **silly-unpack** one should first specify an array of filenames wanted to be extracted. Such array can be created right while invoking the unpack function.

Example of names array is next:

	var names = ['2017-03-09.txt.gz', '2017-03-10.txt.gz'];

Then one need to call function **unpack** from the imported module and pass next parameters:

* **type** - type of unpacking routine, currently only *ungzip* or *untar*,
* **folder** - place in the filesystem with all the extracting files (they will be accessed by the path `<folder>/<name>`), but can be empty string,
* **names** - array of files to extract,
* **callbackfn** - function to call after finishing extracting of all specified files, should process only one parameter, *data* (see description below).

Example of call is next:

	require('silly-unpack').unpack('ungzip', 'gzips/', names, print);

The full working example of module usage one can find in [test.js](./test/test.js).

### Output ###
**silly-unpack** puts all the extracted data in the object with the next structure for gzipped files:

	{
		"<name-of-the-archive-1-without-folder>":"File 1 content",
		"<name-of-the-archive-2-without-folder>":"File 2 content"
	}

For tarred and gzipped files slightly another structure is provided:

	{
		"<name-of-the-archive-1-without-folder>": {
			"<name-of-the-entry-1-1>":"Entry 1-1 content",
			"<name-of-the-entry-1-2>":"Entry 1-2 content"
		},
		"<name-of-the-archive-2-without-folder>":  {
			"<name-of-the-entry-2-1>":"Entry 2-1 content",
			"<name-of-the-entry-2-2>":"Entry 2-2 content"
		}
	}