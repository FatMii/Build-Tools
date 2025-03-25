<template>
  <div id="app" class="wrapper" v-loading.fullscreen.lock="fullscreenLoading">
    <router-view />
  </div>
</template>

<script>
export default {
  components: {},
  name: 'App',
  created() {
    this.checkVersionUpdate();
  },
  methods: {
    checkVersionUpdate() {
      setInterval(() => {
        fetch(`${window.location.origin}/${process.env.VUE_APP_SERVER_PREFIX}/version.json`)
          .then((response) => response.json())
          .then((data) => {
            const currentVersion = localStorage.getItem('currentVersion');
            if (currentVersion && currentVersion !== data.version.toString()) {
              window.location.reload();
            }
            localStorage.setItem('currentVersion', data.version.toString());
          });
      }, 600000); // 每10分钟检查一次
    },
  },
  computed: {
    fullscreenLoading() {
      return this.$store.state.initData.loading;
    },
  },
};
</script>
<style lang="scss">
@import 'styles/variables.scss';
@import 'styles/mixin.scss';
</style>

<style lang="scss" scoped>
.app-init-error {
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
}
</style>
