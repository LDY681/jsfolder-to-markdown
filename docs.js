/**
 * Generate docs md from js library files
 */
const jsdoc2md = require('jsdoc-to-markdown')
const fs = require('fs')
const path = require('path')
const readline = require("readline")

const regex = new RegExp("^[a-zA-Z]:/|(/[\w-]+)+$");    // regex matching path with drive name
let inputPath = '';		// user specified path
let outputPath = '';	// user specified path

/* Read from prompt */
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
console.log("Welcome to jsfolder-to-markdown.");
rl.question("Please specify your input folder (e.g. D:/path/to/your/input): ", function(input) {
    // Verify if input path is valid
    input = input.trim();
    if (!regex.test(input) && input != '') {
        console.log("Not a valid input path!");
        process.exit(0);
    }
    rl.question("Please specify your output folder (e.g. D:/path/to/your/output): ", function(output) {
        // Verify if output path is valid
		output = output.trim();
		if (!regex.test(output) && output != '') {
			console.log("Not a valid output path!");
			process.exit(0);
		}
		
		// Convert path to windows path
		inputPath = input.replace(/\//g, '\\')
		outputPath = output.replace(/\//g, '\\')
        rl.close();
    });
});

rl.on("close", function() {	
	/* Input Path */
    let inputDir;
    if (inputPath == '') {
        inputDir = path.resolve()
    } else {
        inputDir = path.resolve(inputPath)
    }
    console.log(`Extracting js from ${inputDir} ...`);
    if (!fs.existsSync(inputDir)) {
        console.log(`${inputDir} doesn't exist!`);
        process.exit(0);
    }
    // Read all contents from inputDir after its found
	const files = fs.readdirSync(inputDir);

	/* Output Path */
    let outputDir;
    if (outputPath == '') {
        outputDir = path.resolve('\docs')
    } else {
        outputDir = path.resolve(outputPath)
    }
    // makeDir of outputDir doesn't exist
	if (!fs.existsSync(outputDir)) {
	  fs.mkdirSync(outputDir)
	}
	console.log(`Docs will be generated to ${outputDir} ...`);

	let dmdTemp = fs.readFileSync('./dmd-docs.hbs');

	for (let i = 0; i < files.length; i++) {
		const file = path.join(inputDir, files[i]);
		let fileType = fs.statSync(file);
		if( fileType.isDirectory() ){
			generateJsDoc(file, path.basename(file))
		} else {
			generateJsDoc(file)
		}
	}

	function generateJsDoc(inputDir, basename) {
		let _outputDir = outputDir
		if (basename) {
			inputDir = path.join(inputDir, '*.js')
		}
		/* get template data */
		const templateData = jsdoc2md.getTemplateDataSync({ files: inputDir})

		/* reduce templateData to an array of class names */
		const classNames = templateData.reduce((classNames, identifier) => {
			if (identifier.kind == 'namespace') classNames.push(identifier)
			return classNames
		}, [])
		if (classNames.length > 0 && basename) {
			_outputDir = path.resolve(outputDir, basename)
			if (!fs.existsSync(_outputDir)) {
			fs.mkdirSync(_outputDir)
			console.log(`mkdir: ${_outputDir}`)
			}
		}
		let readmeHeader = '* Service   \r\n'
		let readmeContent = ''
		let date = new Date().toLocaleString()
		console.log(classNames)
		for (const identifier of classNames) {
			let className = identifier.name;
			//const template = `# ${identifier.description}\r\n{{#namespace name="${className}"}}${dmdTemp}{{/namespace}}`
			const template = `# ${identifier.description}\r\n{{#namespace name="${className}"}}{{>docs~}}{{/namespace}}`
			console.log(`rendering ${className}, template: ${template}`)
			const output = jsdoc2md.renderSync({ data: templateData, template: template, partial: 'dmd-partial/*.hbs', helper: 'dmd-helper/helper.js'})
			fs.writeFileSync(path.resolve(_outputDir, `${className}.md`), output)
			readmeContent += `  * [${identifier.description}](service/trust${basename ? ('/'+ basename) : ''}/${className}.md) \r\n`
		}
		if (readmeContent) {
			fs.writeFileSync(path.resolve(_outputDir, `README.md`), readmeHeader + readmeContent)
		}
	}
});