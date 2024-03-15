const core = require("@actions/core")
const github = require("@actions/github")
const exec = require("@actions/exec")
const axios = require("axios");
const {getLatestRelease, getVersionInfo} = require("./release");

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
    let data = await getLatestRelease(repository)
    logger.debug(JSON.stringify(data))
    let versions = getVersionInfo(data)
    versions.forEach((item) => {
        logger.debug(item)
    })
    logger.info("运行结束")
}

run()