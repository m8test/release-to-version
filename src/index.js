const core = require("@actions/core")
const github = require("@actions/github")
const exec = require("@actions/exec")

const setupGit = async () => {
    await exec.exec(`git config --global user.name "gh-automation"`);
    await exec.exec(`git config --global user.email "gh-automation@email.com"`);
};

const setupLogger = ({debug, prefix} = {debug: false, prefix: ''}) => ({
    debug: (message) => {
        if (debug) {
            core.info(`DEBUG ${prefix}${prefix ? ' : ' : ''}${message}`);
        }
    },
    info: (message) => {
        core.info(`${prefix}${prefix ? ' : ' : ''}${message}`);
    },
    error: (message) => {
        core.error(`${prefix}${prefix ? ' : ' : ''}${message}`);
    },
});

async function run() {
    // const debug = core.getBooleanInput("debug")
    // const logger = setupLogger({debug, prefix: '[release-to-version]'});
    // logger.info("hello world from the docker action")
    console.log(core)
    console.log(github)
    console.log(exec)
}

run()