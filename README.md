# silly-unpack #
Simple Node.JS routine to massively decompress to memory files archived as Gzip and/or Tar.

## Version ##
Current module version is 1.0.0, and development assumed finished. The version will not change if there are no bug reports.

## License ##
**silly-unpack** is licensed under BSD 3-clause "Revised" License. See [license](./LICENSE) for details.

## Usage ##
### Install ###
Just run command `npm install silly-unpack` to have this module installed for your project. See usage of **npm** tool for details.

### Dependencies ###
Current version of **silly-unpack** depends on the next modules:

* **silly-barrier**,
* **tar-stream**,
* **fs**,
* **zlib**.

The last two modules are both standard Node.js modules.

### Test ###
To test module just run command `nodejs ./test.js` from the folder where module is placed. Output should appear like that one (may be formatted other way):

	{ 'tars/E.tar': 
	 { 'tartemp2.txt': 'Some text in tarred file `tartemp2.txt`.',
	   'tartemp1.txt': 'Some text in tarred file `tartemp1.txt`.' },
	'tars/F.tar': 
	 { 'tartemp4.txt': 'Some text in tarred file `tartemp4.txt`.',
	   'tartemp3.txt': 'Some text in tarred file `tartemp3.txt`.' },
	'gzips/A.txt.gz': 'Some text in gzipped file `temptemp.txt`.',
	'gzips/B.txt.gz': 'Some text in gzipped file `temp.txt`.',
	'targzips/C.tar.gz': 
	 { 'targztemp2.txt': 'Some text in tarred and then gzipped file `targztemp2.txt`.',
	   'targztemp1.txt': 'Some text in tarred and then gzipped file `targztemp1.txt`.' },
  	'targzips/D.tar.gz': 
	 { 'targztemp4.txt': 'Some text in tarred and then gzipped file `targztemp4.txt`.',
	   'targztemp3.txt': 'Some text in tarred and then gzipped file `targztemp3.txt`.' } }

### Run ###
To use **silly-unpack** one should pass to unpack function an array of filenames wanted to be extracted.

Example of names array is next:

	var names = ['gzips/A.txt.gz', 'gzips/B.txt.gz', 'targzips/C.tar.gz', 'tars/D.tar', 'E.tgz', 'F.z'];

While invoking function **unpack** from the imported module one should pass next parameters:

* **names** - array of files to extract;
* **callbackfn** - function to call after finishing extracting of all specified files, should process two parameters:
	- *errors* (array of errors occured),
	- *data* (see description below);
* **folder** - place in the filesystem with all the extracting files (they will be accessed by the path `<folder>/<name>`); optional argument, proceeded as empty string if undefined.

Example of call is next:

	require('silly-unpack').unpack(names, print, 'archives/');

The full working example of module usage one can find in [test.js](./test.js).

### Supported formats ###
**silly-unpack** supports next archive formats:

* *tar* - only for files with the extension `.tar`;
* *tar.gzip* - for files with extensions `.tar.gz`, `.tar.z` or `.tgz`;
* *gzip* - for files with extensions `.gz` or `.z`.

File format choose is based only on file extensions.

### Output ###
**silly-unpack** puts all the extracted data in the object with the next structure for gzipped files:

	{
		<name-of-the-archive-1-without-folder>:<File 1 content>,
		<name-of-the-archive-2-without-folder>:<File 2 content>
	}

For tarred (and optionally gzipped) files slightly another structure is provided:

	{
		<name-of-the-archive-1-without-folder>: {
			<name-of-the-entry-1-1>:<Entry 1-1 content>,
			<name-of-the-entry-1-2>:<Entry 1-2 content>
		},
		<name-of-the-archive-2-without-folder>:  {
			<name-of-the-entry-2-1>:<Entry 2-1 content>,
			<name-of-the-entry-2-2>:<Entry 2-2 content>
		}
	}

Structures are mixtred if files of both formats mentioned in the filenames array.