const core = require("@actions/core")
const github = require("@actions/github")
const exec = require("@actions/exec")
const axios = require("axios");

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
    const debug = core.getBooleanInput("debug")
    const repository = core.getInput("repository", {required: true})
    const logger = setupLogger({debug, prefix: '[release-to-version]'});
    logger.info(`仓库:${repository}`)
    // 请求 url
    const url = `https://api.github.com/repos/${repository}/releases/latest`
    let json = (await axios.get(url)).data
    logger.debug(json)
    logger.info("运行结束")
}

run()