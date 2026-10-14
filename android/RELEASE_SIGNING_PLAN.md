# Release 正式签名修复计划

## 目标

让 Android Release APK 只能使用 Kotier 正式签名生成，避免 Release variant 落到 Android Debug 签名。

## 实施步骤

1. 从 `android/keystore.properties` 或 `KOTIER_RELEASE_*` 环境变量读取签名文件路径、别名和密码。
2. Release 构建缺少任一签名参数时立即失败，不回退到 Debug 签名。
3. 将本地签名属性文件加入忽略规则，避免把密码或签名配置提交到仓库。
4. 编译 debug 变体验证普通开发构建仍可用；正式 Release 包需正式签名材料才能生成。

## 安全边界

- 不读取、输出、复制或提交 keystore 私钥和签名密码。
- 本地签名材料只通过被忽略的 properties 文件或构建环境变量提供。
