# jsfolder-to-markdown

Batch generate markdown API documentation from a folder of [jsdoc](http://usejsdoc.org) annotated source code. Useful for injecting API docs into project README files.

# How to use
1\. Install dependencies

npm install

2\. Run command prompt

node ./docs.js

3\. Specify input and output folder in prompt line

```
Both paths need to be in POSIX (Unix) syntax e.g. D:/path/to/your/folder
If no input path is given, current working directory will be selected.
If no output path is given, docs will be generated to ./docs.
```

# See also
This project is based on [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown) and [jsdoc](http://usejsdoc.org). Source codes should be annoatated correctly, check their documentation for more information. 
