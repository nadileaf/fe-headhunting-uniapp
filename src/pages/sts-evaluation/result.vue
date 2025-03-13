<script lang="ts" setup>
import { useRouter } from '@/hooks/useRouter';
import Layout from '@/components/business/job-hopping/layout.vue';
import { useShare } from '@/hooks/useShare';
import { onShareAppMessage } from '@dcloudio/uni-app';
import { generateUrl } from '@/utils/common';

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

const chartId = 'myChart';
const chartStyles = 'width: 100%; height: 180px;';

const getGaugeSegments = computed(() => {
  return scoreConfig.map((item) => ({
    type: item.title,
    color: item.color,
    value: item.max
  }));
});

const spec = computed(() => ({
  type: 'gauge',
  data: [
    {
      id: 'pointer',
      values: [
        {
          type: 'score',
          value: scoreNum.value
        }
      ]
    },
    {
      id: 'segment',
      values: getGaugeSegments.value
    }
  ],
  gauge: {
    type: 'gauge',
    dataIndex: 1,
    categoryField: 'type',
    valueField: 'value',
    seriesField: 'type',
    segment: {
      style: {
        cornerRadius: 6,
        fill: (datum: any) => datum['color']
      }
    },
    label: {
      visible: true,
      position: 'inside-outer',
      offsetRadius: 6,
      style: {
        text: (datum: any) => datum['type']
      }
    }
  },
  pointer: {
    style: {
      fill: '#666666'
    }
  },
  categoryField: 'type',
  valueField: 'value',
  outerRadius: 0.9,
  innerRadius: 0.6,
  startAngle: -180,
  endAngle: 0,
  centerY: '100%',
  layoutRadius: 'auto',
  axes: [
    {
      type: 'linear',
      orient: 'angle',
      inside: false,
      grid: { visible: false }
    }
  ]
}));

const onChartInit = () => {
  console.log('Chart initialized');
};

const onChartReady = () => {
  console.log('Chart ready');
};
</script>

<template>
  <Layout>
    <view class="flex flex-col items-center">
      <view class="chart-container">
        <chart :canvas-id="chartId" :spec="spec" :styles="chartStyles" @chartinit="onChartInit" @chartready="onChartReady" />
      </view>
      <view class="text-xl font-bold mt-4">评估得分</view>
      <view class="text-6xl font-bold mt-4" :style="{ color: scoreResult.color }">
        {{ scoreNum }}
      </view>
    </view>
    <view class="mt-8 text-[#356899]">
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
