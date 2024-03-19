const exec = require("@actions/exec")

async function clone(working_directory, GITHUB_TOKEN, GITHUB_REPOSITORY) {
    await exec.exec(`git clone https://${GITHUB_REPOSITORY.split("/")[0]}:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git`, [], {cwd: working_directory})
}

module.exports = {clone: clone}
