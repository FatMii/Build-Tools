export const data = {
  "key": "v-f9e30908",
  "path": "/intro/",
  "title": "依赖环境",
  "lang": "zh-CN",
  "frontmatter": {},
  "excerpt": "",
  "headers": [],
  "git": {
    "contributors": [
      {
        "name": "Owllai",
        "email": "zengqin.lai@hexasino.com",
        "commits": 3
      }
    ]
  },
  "filePathRelative": "intro/README.md"
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
