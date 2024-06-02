export const data = {
  "key": "v-50d92e02",
  "path": "/base/minifyHtml.html",
  "title": "html 压缩",
  "lang": "zh-CN",
  "frontmatter": {},
  "excerpt": "",
  "headers": [],
  "git": {
    "contributors": [
      {
        "name": "赖增钦",
        "email": "zengqin.lai@hexasino.com",
        "commits": 3
      }
    ]
  },
  "filePathRelative": "base/minifyHtml.md"
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
