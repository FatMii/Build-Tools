export const data = {
  "key": "v-7d0ce4de",
  "path": "/intro/learn.html",
  "title": "我能学到什么",
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
  "filePathRelative": "intro/learn.md"
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
