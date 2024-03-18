const exec = require("@actions/exec")

async function clone(working_directory, GITHUB_TOKEN, GITHUB_REPOSITORY) {
    await exec.exec(`git clone https://${GITHUB_TOKEN}:@github.com/${GITHUB_REPOSITORY}`, [], {cwd: working_directory})
}

module.exports = {clone: clone}
