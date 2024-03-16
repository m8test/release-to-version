const axios = require("axios");

async function getLatestRelease(repository) {
    const url = `https://api.github.com/repos/${repository}/releases/latest`
    return axios.get(url).then(res => {
        // 如果失败返回这个
        // {
        //   "message": "Not Found",
        //   "documentation_url": "https://docs.github.com/rest/releases/releases#get-the-latest-release"
        // }
        return Promise.resolve(res.data)
    })
}

class VersionInfo {
    constructor(version_name, body, browser_download_url, filename, update_at, content_type, size) {
        this.version_name = version_name
        this.body = body
        this.browser_download_url = browser_download_url
        this.filename = filename
        this.update_at = update_at
        this.size = size
    }
}

function getVersionInfo(release) {
    let arr = []
    release.assets.forEach((value, index, array) => {
        arr.push(new VersionInfo(release.tag_name, release.body, value.browser_download_url, value.name, value.updated_at, value.size))
    })
    return arr
}

module.exports = {getLatestRelease, getVersionInfo, VersionInfo}