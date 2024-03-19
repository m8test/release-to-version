const core = require("@actions/core")
const exec = require("@actions/exec")
const {clone} = require("./github");

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

const generateRandomString = (num) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result1 = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
        result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result1;
}

async function run() {
    const debug = core.getBooleanInput("debug")
    const destToken = core.getInput("destToken", {required: true})
    const srcToken = core.getInput("srcToken", {required: true})
    const destPath = core.getInput("destPath", {required: true})
    const srcPath = core.getInput("srcPath", {required: true})
    const destRepository = core.getInput("destRepository", {required: true})
    const srcRepository = core.getInput("srcRepository", {required: true})
    const logger = setupLogger({debug, prefix: '[copy]'});
    logger.info(`源仓库:${srcRepository},目标仓库:${destRepository},源目录:${srcPath},目标目录:${destPath}`)
    core.setSecret(srcToken)
    core.setSecret(destToken)
    // 生成随机目录
    let workingDirectory = `~/${generateRandomString(10)}`
    await exec.exec(`mkdir -p ${workingDirectory}`, [])
    logger.debug("开始克隆项目")
    await clone(workingDirectory, srcToken, srcRepository)
    await clone(workingDirectory, destToken, destRepository)
    await exec.exec(`tree ${workingDirectory}`)
    logger.debug("复制文件")
    let destRepositoryName = destRepository.split("/")[1];
    let srcRepositoryName = srcRepository.split("/")[1];
    let srcFullPath = `${workingDirectory}/${srcRepositoryName}/${srcPath}`
    let destFullPath = `${workingDirectory}/${destRepositoryName}/${destPath}`
    await exec.exec(`mkdir -p ${destFullPath}`)
    await exec.exec(`cp -r ${srcFullPath} ${destFullPath}`)
    let commonExecOpts = {cwd: `${workingDirectory}/${destRepositoryName}`}
    await setupGit()
    let output = await exec.getExecOutput("git status -s", [], {...commonExecOpts})
    if (output.stdout.length > 0) {
        logger.info("文件更改")
        logger.debug("添加更改文件")
        await exec.exec("git add .", [], {...commonExecOpts})
        logger.debug("提交更新文件")
        await exec.exec(`git commit -m "更新文件"`, [], {...commonExecOpts})
        logger.debug("推送更改")
        await exec.exec(`git push`, [], {...commonExecOpts})
    } else {
        logger.info("文件没有更改")
    }
    // 删除目录
    logger.debug("删除文件")
    await exec.exec(`rm -rf ${workingDirectory}`)
    logger.info("运行结束")
}

run()