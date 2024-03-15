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
    // 请求仓库 release url
    let data = await getLatestRelease(repository)
    logger.debug(JSON.stringify(data))
    let versions = getVersionInfo(data)
    // 遍历所有的版本信息
    versions.forEach((item) => {
        logger.debug(JSON.stringify(item))
    })
    // 将版本信息写入文件
    core.setOutput("version", `${data.tag_name}`)
    core.setOutput("update_content", `${data.body}`)
    logger.info("运行结束")
}

run()