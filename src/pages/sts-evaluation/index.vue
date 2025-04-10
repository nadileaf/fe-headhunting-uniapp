<script lang="ts" setup>
import { useRouter } from '@/hooks/useRouter';
import Layout from '@/components/business/job-hopping/layout.vue';
import { useShare } from '@/hooks/useShare';
import { onShareAppMessage } from '@dcloudio/uni-app';
import { generateUrl } from '@/utils/common';

const router = useRouter();

useShare({ path: generateUrl(router.currentPageUrl) });

function handleStart() {
  router.push('/pages/sts-evaluation/evaluation');
}
</script>

<template>
  <Layout>
    <view class="main-title">凯利公式 - 跳槽决策工具</view>
    <view class="text-sm mt-4">
      凯利公式是由约翰凯利于1956年提出的投注策略。公式指出了一个期望收益为正的重复性决策或者资管性投资中，每一次应该采用的最优比例。这个公式也可以用来分析和比较员工面对新offer的跳槽机会时潜在的风险和回报，得出整体的跳槽成功概率。神州猎创始人Charlie
      LIU 拥有近20年五大国际猎头公司全球合伙人高端人才猎寻经验，通过面试众多企业高管候选人，他总结出跳槽决策的通用模型：
    </view>
    <view class="mt-1 text-sm">
      <view>潜在回报</view>
      <view>A）跳槽后潜在回报</view>
      <view>- 薪资收入的提升/减少</view>
      <view>- 技能/经验的提升/减少</view>
      <view>- 工作生活平衡度提升/减少</view>
      <view>- 职位名称的受尊敬度提升/减少</view>
    </view>
    <view class="mt-1 text-sm">
      <view>潜在风险（失败）</view>
      <view>B）跳槽后的潜在风险</view>
      <view>- 新公司文化适配度</view>
      <view>- 新岗位技能/经验匹配度</view>
      <view>- 新公司行业整体景气度</view>
      <view>- 新公司稳定和盈利能力</view>
    </view>

    <view class="mt-5 card">
      <view class="text-center text-[#FF8A34]">f*=(bp-q)/b=(p(b+1)-1)/b</view>
      <view class="text-center mt-2 text-black whitespace-pre-wrap">
        f*为跳槽整体成功概率，p为跳槽后生存概率，\n q为跳槽后的潜在风险，b为跳槽后潜在回报
      </view>
    </view>

    <template #footer>
      <MButton type="primary" size="middle" full-width @click="handleStart">开始预测</MButton>
    </template>
  </Layout>
</template>

<style lang="scss" scoped>
@import './style.scss';
</style>
