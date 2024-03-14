const {getLatestRelease, getVersionInfo} = require("../src/release");
test('测试获取仓库最新发布', async () => {
    // 只要不出错就可以了
    let actual = await getLatestRelease("kkevsekk1/AutoX");
    expect(actual)
    console.log(JSON.stringify(actual))
    // expect(await getRelease("m8test/no-such-repository"))
});

test('测试获取仓库最新发布', async () => {
    // 只要不出错就可以了
    let actual = await getLatestRelease("kkevsekk1/AutoX");
    expect(actual)
    getVersionInfo(actual).forEach((item) => {
        console.log(JSON.stringify(item))
    })
});

