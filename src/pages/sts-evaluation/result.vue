<script lang="ts" setup>
import { useRouter } from '@/hooks/useRouter';
import Layout from '@/components/business/job-hopping/layout.vue';
import { useShare } from '@/hooks/useShare';
import { onShareAppMessage } from '@dcloudio/uni-app';
import { generateUrl } from '@/utils/common';
import OptionChart from '@/components/business/option-chart/index.vue';

const props = defineProps<{ score: string }>();

const router = useRouter();

const scoreNum = computed(() => Number(props.score ?? 0));
const sharePath = computed(() => generateUrl(router.currentPageUrl, props));

useShare({ title: '跳槽决策结果', path: sharePath });

interface ScoreConfigItem {
  min: number;
  max: number;
  title: string;
  text: string;
  color: string;
}

const scoreConfig: ScoreConfigItem[] = [
  {
    min: 0.9,
    max: 1,
    title: '安心跳槽',
    text: '我们建议您可以安心跳槽',
    color: '#2dd36f' // 原 #22c55e，调整为更鲜艳的绿色
  },
  {
    min: 0.8,
    max: 0.9,
    title: '顺利跳槽',
    text: '我们建议您可以顺利跳槽',
    color: '#17cfbe' // 原 #14b8a6，调整为更亮的蓝绿色
  },
  {
    min: 0.5,
    max: 0.8,
    title: '建议跳槽',
    text: '我们建议您可以跳槽，但可能需要付出一些努力和准备。',
    color: '#ff8534' // 原 #f97316，调整为更温暖的橙色
  },
  {
    min: 0.3,
    max: 0.5,
    title: '慎重考虑',
    text: '我们建议您慎重考虑跳槽。',
    color: '#ffc409' // 原 #eab308，调整为更明亮的黄色
  },
  {
    min: -1,
    max: 0.3,
    title: '不建议跳槽',
    text: '我们不建议您此时跳槽。',
    color: '#ff4961' // 原 #FF4D4F，调整为更鲜艳的红色
  }
];

function getScoreResult(score: number): { text: string; color: string } {
  const result = scoreConfig.find((item) => score >= item.min && score < item.max) ?? scoreConfig[scoreConfig.length - 1];
  return {
    text: result.text,
    color: result.color
  };
}

const scoreResult = computed(() => getScoreResult(scoreNum.value));
const showOfficialAccount = ref(false);

function handleSubscribe() {
  showOfficialAccount.value = true;
}

function onOfficialAccountLoad(e: any) {
  console.log('official-account load success', e);
}

function onOfficialAccountError(e: any) {
  console.log('official-account load error', e);
}

const option = computed(() => {
  return {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        center: ['50%', '65%'],
        radius: '90%',
        min: -1,
        max: 1,
        splitNumber: 8,
        axisLine: {
          lineStyle: {
            width: 18,
            color: [
              [0.65, '#ff4961'], // -1.0 到 0.3
              [0.75, '#ffc409'], // 0.3 到 0.5
              [0.9, '#ff8534'], // 0.5 到 0.8
              [0.95, '#17cfbe'], // 0.8 到 0.9
              [1.0, '#2dd36f'] // 0.9 到 1.0
            ]
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '12%',
          width: 10,
          offsetCenter: [0, '-56%'],
          itemStyle: {
            color: 'auto'
          }
        },
        axisTick: {
          length: 10,
          lineStyle: {
            color: 'auto',
            width: 1
          }
        },
        splitLine: {
          length: 16,
          lineStyle: {
            color: 'auto',
            width: 3
          }
        },
        axisLabel: {
          color: '#464646',
          fontSize: 14,
          distance: -40,
          rotate: 'tangential',
          formatter: function (value: number) {
            // 只显示关键节点的值
            const keyPoints = [-1, -0.5, 0, 0.5, 1];
            return keyPoints.includes(value) ? value.toString() : '';
          }
        },
        title: {
          offsetCenter: [0, '-5%'],
          fontSize: 14
        },
        detail: {
          fontSize: 30,
          offsetCenter: [0, '-30%'],
          valueAnimation: true,
          formatter: function (value: number) {
            return value.toFixed(2);
          },
          color: 'inherit'
        },
        data: [
          {
            value: scoreNum.value,
            name: '得分'
          }
        ]
      }
    ]
  };
});
</script>

<template>
  <Layout>
    <view class="flex flex-col items-center">
      <OptionChart style="width: 100%; height: 300px" :option="option" />
    </view>
    <view class="text-[#356899] text-sm">
      <view class="text-center">根据公式推演，{{ scoreResult.text }}</view>
      <view class="mt-3 text-center">
        <view class="">请关注公众号"猎头村村长频道"回复"神州猎测评"</view>
        <view>获得详细解读</view>
        <!-- <MButton class="mt-4" type="primary" size="middle" @click="handleSubscribe">关注公众号</MButton> -->
      </view>

      <official-account v-if="showOfficialAccount" class="mt-4" @load="onOfficialAccountLoad" @error="onOfficialAccountError" />
    </view>
  </Layout>
</template>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
}

:deep(.official-account) {
  width: 90%;
  margin: 0 auto;
}
</style>
