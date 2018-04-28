
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const repos = require('./repos.json')
const dir = './tmp'
const [dep, ver] = process.argv[2].split('@')

async function update () {
	repos.forEach( async (repo) => {
		// rm -rf
		await exec(`rm -rf ${dir}`)

		// clone / pull repo
		const repoPieces = repo.split('/')
		const repoName = repoPieces[repoPieces.length - 1].split('.')[0]
		await exec(`git clone ${repo} ${dir}/${repoName}`)
		
		// check package json against argv
		const package = require(`${dir}/${repoName}/package.json`)
		console.log(package)
		if (package.dependencies[dep]) {
			package.dependencies[dep] = ver
		}

		// run npm test
		await exec(`npm i`, {cwd: `${dir}/${repoName}`})
		await exec(`npm test`, {cwd: `${dir}/${repoName}`})

		// push commit
	})
}

update()