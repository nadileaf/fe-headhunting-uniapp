<script lang="ts">
export default { name: 'OptionChart', options: { virtualHost: true } };
</script>

<script lang="ts" setup>
import ECharts from '@/components/business/echarts/index.vue';

type Props = {
  option: Record<string, any>;
};

const props = defineProps<Props>();

onMounted(() => {
  setTimeout(() => {
    setOption();
  }, 300);
});

const _option = ref({});

function setOption() {
  _option.value = props.option;
  console.log('_option', _option.value);
}

function handleInit(chart: any) {
  console.debug('@line chart 实例对象 = ', chart);
}
</script>

<template>
  <div class="box">
    <ECharts canvasId="line" :option="_option" lazyLoad @init="handleInit" />
  </div>
</template>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
}
</style>
