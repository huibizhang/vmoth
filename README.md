# vMoth

**vMoth** 是一個基於 `axios` 和 `axios-mock-adapter` 的輕量級 HTTP 請求模擬工具，它可以幫助您在測試中模擬 HTTP 請求的行為。

## 安裝

您可以通過 npm 或 yarn 安裝 `vmoth`：

```bash
npm install vmoth
# 或者
yarn add vmoth
```

## 使用方法

```javascript
import axios from "axios";
import { vMoth } from "vmoth";

const mock = vMoth(axios);

mock.on("/users", {
  username: "github",
  user_id: 123,
});

try {
  const res = await axios.get("/users");
  console.log("test", res.data);
} catch (e) {
  console.error("myError", e);
}
```

## Pattern

使用預定義的樣板作為**回傳值**

#### 範例

```javascript
import axios from "axios";
import { vMoth, pattern } from "vmoth";

const mock = vMoth(axios);

// 返回狀態碼 401
mock.on("/admin", pattern._401);

// 返回 json-string
mock.on(
  "/users",
  pattern.json({
    username: "github",
    user_id: 123,
  })
);

try {
  const res = await axios.get("/users");
  console.log("test", res.data);
} catch (e) {
  console.error("myError", e);
}
```

預設樣板列表：

- `_400`
- `_401`
- `_404`
- `_500`
- `json(data)`
