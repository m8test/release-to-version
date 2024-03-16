const core = require("@actions/core")
const github = require("@actions/github")
const exec = require("@actions/exec")
const {getLatestRelease, getVersionInfo} = require("./release");
const fs = require("fs");
const path = require("path");

const setupGit = async () => {
    await exec.exec(`git config --global user.name "github-actions"`);
    await exec.exec(`git config --global user.email "github@m8test.com"`);
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
    // 工作路径
    const workingDirectory = core.getInput("working_directory", {required: true})
    // 输出路径，和 workingDirectory 组合成完整路径
    const outputFile = core.getInput("output_file", {required: true})
    const branch = core.getInput("branch", {required: true})
    const logger = setupLogger({debug, prefix: '[release-to-version]'});
    logger.info(`仓库:${repository},工作目录:${workingDirectory},输出文件:${outputFile}`)
    // 请求仓库 release url
    let data = null
    try {
        data = await getLatestRelease(repository)
    } catch (e) {
        core.setFailed(e.message)
        logger.error("获取版本信息失败")
        return
    }
    logger.debug(JSON.stringify(data))
    let versions = getVersionInfo(data)
    // 遍历所有的版本信息
    versions.forEach((item) => {
        logger.debug(JSON.stringify(item))
    })
    await setupGit()
    const commonExecOpts = {
        cwd: workingDirectory,
    };
    // 将版本信息写入文件
    let file = path.join(workingDirectory, outputFile);
    logger.debug(`开始写入版本信息到文件:${file}`)
    fs.writeFileSync(file, JSON.stringify(versions))
    let output = await exec.getExecOutput("git status -s", [], {...commonExecOpts})
    if (output.stdout.length > 0) {
        // 文件更改了
        logger.info(`发现新版本,开始提交`)
        await exec.exec(`git checkout ${branch}`, [], {...commonExecOpts})
        await exec.exec("git add .", [], {...commonExecOpts})
        await exec.exec(`git commit -m "${data.body}"`, [], {...commonExecOpts})
        await exec.exec(`git push -u origin ${branch}`, [], {...commonExecOpts})
    } else {
        logger.info(`没有发现新版本`)
    }
    core.setOutput("version", `${data.tag_name}`)
    core.setOutput("update_content", `${data.body}`)
    logger.info("运行结束")
}

run()