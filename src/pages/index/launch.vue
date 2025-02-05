<script setup lang="ts">
import { HOME_PAGE } from '@/config';
import { useRouter } from '@/hooks/useRouter';
// import { entityService } from '@/services/entity';
import { getUrlQuery } from '@/utils/common';
import { useAuthStore } from '@/stores';
import { entityService } from '@/services/entity';

type Props = {
  scene?: string;
  redirect?: RoutePages.Path;
  /** 分享人 */
  sharer?: string;
  /** 扫码进入 */
  q?: string;
};

const props = defineProps<Props>();

const router = useRouter();

const authStore = useAuthStore();

//倒计时s进入首页,默认2s,扫码或者重定向进入1s
// const counter = ref(props.q || props.redirect ? 1 : import.meta.env.VITE_LAUNCH_COUNTER_SECONDS);
// let interval: number;

const nextPagePath = ref(HOME_PAGE);
const nextPageQuery = ref();

onMounted(() => {
  // interval = setInterval(() => {
  //   if (counter.value > 0) counter.value--;
  //   if (counter.value == 0 && nextPagePath.value) {
  //     clearInterval(interval);
  //     router.replace(nextPagePath.value, { query: nextPageQuery.value });
  //   }
  // }, 1000);
  if (nextPagePath.value) {
    router.replace(nextPagePath.value, { query: nextPageQuery.value });
  }
});

initNextPageParams();

async function initNextPageParams() {
  console.log('initNextPageParams', props);
  try {
    authStore.setSharer(props.sharer);
    if (props.redirect) {
      nextPagePath.value = props.redirect;
    } else if (props.q) {
      const { r: redirect } = getUrlQuery(props.q);
      console.log('扫描tip生成的二维码 redirect:', props.q, redirect);
      if (redirect) nextPagePath.value = redirect as RoutePages.Path;
    } else if (props.scene) {
      const result = await entityService.queryDetail({ entityType: 'ShortCode', entityId: decodeURIComponent(props.scene) });
      const params = JSON.parse(result?.data?.standardFields?.content || '{}');
      console.log('ShortCode :>> ', params);
      nextPagePath.value = params?.path;
      nextPageQuery.value = params?.query || {};
    }
  } catch (error) {
    nextPagePath.value = HOME_PAGE;
  }
}

const showLogo = import.meta.env.VITE_RUNTIME_ENV !== 'test';
</script>

<template>
  <view class="container" :class="{ 'launch-bg': false }">
    <!-- <view class="absolute top-100px right-20px text-gray-400">{{ counter }}s</view> -->
  </view>
</template>

<style lang="scss" scoped>
.launch-bg {
  background: url('https://cdn-fe.mesoor.com/custom/cgl/assets/logo/logo1.png') no-repeat center center;
  background-color: #fff;
}
</style>
