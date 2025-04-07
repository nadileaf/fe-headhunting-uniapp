<script lang="ts" setup>
import { useRouter } from '@/hooks/useRouter';
import Layout from '@/components/business/job-hopping/layout.vue';
import { useShare } from '@/hooks/useShare';
import { onShareAppMessage } from '@dcloudio/uni-app';
import { generateUrl } from '@/utils/common';
import OptionChart from '@/components/business/option-chart/index.vue';

const text =
  '通过理伦模型推演，除了为系统给出的建议外，也需要综合自身实际情况作出审慎的判断，而任何职业决策（跳槽）都需要充分的准备和持续的努力。';

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
    min: 0.8,
    max: 0.99,
    title: '无忧跳槽',
    text: '我们建议您可以无忧跳槽',
    color: '#2dd36f'
  },
  {
    min: 0.5,
    max: 0.79,
    title: '可以跳槽',
    text: '我们建议您可以跳槽',
    color: '#00C9B6'
  },
  {
    min: 0.0,
    max: 0.49,
    title: '慎重跳槽',
    text: '我们建议您慎重考虑跳槽',
    color: '#ffc409'
  },
  {
    min: -1,
    max: 0,
    title: '不建议跳槽',
    text: '我们不建议您此时跳槽',
    color: '#ff4961'
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
              [0.5, '#ff4961'], // -1.0 到 0.0
              [0.745, '#ffc409'], // 0.0 到 0.49
              [0.895, '#00C9B6'], // 0.5 到 0.79
              [1.0, '#2dd36f'] // 0.8 到 0.99
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
  <Layout :has-footer="false">
    <view class="mt-[-20px]">
      <OptionChart style="width: 100%; height: 280px" :option="option" />
    </view>
    <view class="mt-[-50px] text-sm">
      <view class="text-center">{{ text }}</view>
      <view class="mt-4 text-center text-xs">
        <view class="text-[#356899]">请关注公众号"猎头村村长频道"回复"神州猎测评"</view>
        <view class="text-[#356899]">获得详细职业决策解读</view>
      </view>

      <!-- 得分说明 -->
      <view class="mt-4 space-y-1">
        <view class="">得分：</view>
        <view class="score-item">
          <view class="left">0.8 - 0.99（绿色）</view>
          <view>无忧跳槽</view>
        </view>
        <view class="score-item">
          <view class="left">0.5 - 0.79（蓝色）</view>
          <view>可以跳槽</view>
        </view>
        <view class="score-item">
          <view class="left">0.0 - 0.49（黄色）</view>
          <view>慎重跳槽</view>
        </view>
        <view class="score-item">
          <view class="left">低于0分或负数</view>
          <view>不建议跳槽</view>
        </view>
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

.score-item {
  @apply flex items-center justify-between;
}
</style>
