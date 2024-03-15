const axios = require("axios");

async function getLatestRelease(repository) {
    const url = `https://api.github.com/repos/${repository}/releases/latest`
    console.log(`url:${url}`)
    return axios.get(url).then(res => {
        console.log(`res:${res.data}`)
        return Promise.resolve(res.data)
    }).catch(e => {
        console.error(e)
    })
}

class VersionInfo {
    constructor(version_name, body, browser_download_url, filename, update_at) {
        this.version_name = version_name
        this.body = body
        this.browser_download_url = browser_download_url
        this.filename = filename
        this.update_at = update_at
    }
}

function getVersionInfo(release) {
    let arr = []
    release.assets.forEach((value, index, array) => {
        arr.push(new VersionInfo(release.version_name, release.body, value.browser_download_url, value.name, value.updated_at))
    })
    return arr
}

module.exports = {getLatestRelease, getVersionInfo, VersionInfo}