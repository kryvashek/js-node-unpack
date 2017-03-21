# silly-unpack #
Simple Node.JS routine to massively decompress to memory files archived as Gzip and/or Tar.

## Version ##
Current module version is 0.3.2.

## License ##
**silly-unpack** is licensed under BSD 3-clause "Revised" License. See [license](./LICENSE) for details.

## Usage ##
### Install ###
Just run command `npm install silly-unpack` to have this module installed for your project. See usage of **npm** tool for details.

### Dependencies ###
Current version of **silly-unpack** depends on the next modules:

* **silly-barrier**,
* **tar-stream**.

### Test ###
To test module just run command `nodejs ./test.js` from the folder where module is placed. Output should appear like that one (may be unformatted):

	{
		"tars/E.tar":{
			"tartemp2.txt":"Some text in tarred file `tartemp2.txt`.",
			"tartemp1.txt":"Some text in tarred file `tartemp1.txt`."
		},
		"tars/F.tar":{
			"tartemp4.txt":"Some text in tarred file `tartemp4.txt`.",
			"tartemp3.txt":"Some text in tarred file `tartemp3.txt`."
		},
		"gzips/A.txt.gz":"Some text in gzipped file `temptemp.txt`.",
		"targzips/C.tar.gz":{
			"targztemp2.txt":"Some text in tarred and then gzipped file `targztemp2.txt`.",
			"targztemp1.txt":"Some text in tarred and then gzipped file `targztemp1.txt`."
		},
		"gzips/B.txt.gz":"Some text in gzipped file `temp.txt`.",
		"targzips/D.tar.gz":{
			"targztemp4.txt":"Some text in tarred and then gzipped file `targztemp4.txt`.",
			"targztemp3.txt":"Some text in tarred and then gzipped file `targztemp3.txt`."
		}
	}

### Run ###

To use **silly-unpack** one should first specify an array of filenames wanted to be extracted. Such array can be created right while invoking the unpack function.

Example of names array is next:

	var names = ['gzips/A.txt.gz', 'gzips/B.txt.gz', 'targzips/C.tar.gz', 'tars/E.tar'];

Then one need to call function **unpack** from the imported module and pass next parameters:

* **folder** - place in the filesystem with all the extracting files (they will be accessed by the path `<folder>/<name>`), but can be empty string,
* **names** - array of files to extract,
* **callbackfn** - function to call after finishing extracting of all specified files, should process two parameters:
	- *errors* (array of errors occured),
	- *data* (see description below).

Example of call is next:

	require('silly-unpack').unpack('gzips/', names, print);

The full working example of module usage one can find in [test.js](./test/test.js).

### Output ###
**silly-unpack** puts all the extracted data in the object with the next structure for gzipped files:

	{
		"<name-of-the-archive-1-without-folder>":"File 1 content",
		"<name-of-the-archive-2-without-folder>":"File 2 content"
	}

For tarred (and optionally gzipped) files slightly another structure is provided:

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