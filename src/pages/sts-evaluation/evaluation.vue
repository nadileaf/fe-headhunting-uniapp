<script lang="ts" setup>
import { useRouter } from '@/hooks/useRouter';
import { difyService, type KellyCriterionParams } from '@/services/dify';
import Layout from '@/components/business/job-hopping/layout.vue';
import MButton from '@/components/basic/MButton.vue';
import { useWeightScore } from './hooks';
import { type PWeights, type PScores, type BWeights, type BScores } from './type';
import { message } from '@/utils/common';
import { defaultWeight } from './hooks';

const scorePlaceholder = '请输入得分，-1至1';

const router = useRouter();

// 设置默认权重为 25%
const bWeights = ref<BWeights>({
  b_salary_weight: defaultWeight,
  b_career_weight: defaultWeight,
  b_wl_balance_weight: defaultWeight,
  b_life_persp_weight: defaultWeight
});

const bScores = ref<BScores>({
  b_salary_score: null,
  b_career_score: null,
  b_wl_balance_score: null,
  b_life_persp_score: null
});

const pWeights = ref<PWeights>({
  p_culture_weight: defaultWeight,
  p_skill_weight: defaultWeight,
  p_industry_weight: defaultWeight,
  p_stablecomp_weight: defaultWeight
});

const pScores = ref<PScores>({
  p_culture_score: null,
  p_skill_score: null,
  p_industry_score: null,
  p_stablecomp_score: null
});

const { handleReset: handleBReset, handleValidate: handleBValidate } = useWeightScore(bWeights, bScores);
const { handleReset: handlePReset, handleValidate: handlePValidate } = useWeightScore(pWeights, pScores);

async function handleSubmit() {
  if (!handleBValidate() || !handlePValidate()) return;

  const allWeights = Object.entries({ ...bWeights.value, ...pWeights.value }).reduce((acc, [k, v]) => {
    acc[k] = Number(v) / 100;
    return acc;
  }, {} as Record<string, number>);

  const params = {
    ...Object.entries({ ...allWeights, ...bScores.value, ...pScores.value }).reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key]: Number(value) === 0 ? 0.000000001 : Number(value)
      };
    }, {} as Record<string, number>)
  } as KellyCriterionParams;

  try {
    const res = await difyService.getKellyCriterionScore(params);
    router.push('/pages/sts-evaluation/result', {
      query: {
        score: res.score.toFixed(2).toString()
      }
    });
  } catch (error) {
    console.error(error);
  }
}

function handleReset() {
  handleBReset();
  handlePReset();
}
</script>

<template>
  <Layout>
    <view class="main-title">凯利万能跳槽决策公式</view>
    <view class="text-sm mt-4 text-[#0B1526]">
      请输入你在b（跳槽潜在回报）
      各维度上的重要性和得分。重要性处于0-100%，所有维度重要性加总为100%。每个维度上具体得分区间为-1至1，越接近1越好。
      <text class="text-[#356899]">权重是个人对新offer给自己带来benefits看重比例，打分针对实际offer内容的评估。</text>
    </view>

    <!-- 跳槽潜在回报部分 -->
    <view class="section-title">b（跳槽回报） - 薪资收入的提升/减少</view>
    <view class="section-body">
      <view class="input-container">
        <input v-model="bWeights.b_salary_weight" type="number" />
        <text class="suffix">%</text>
      </view>
      <view class="input-container">
        <input v-model="bScores.b_salary_score" :placeholder="scorePlaceholder" />
      </view>
    </view>

    <view class="section-title">b（跳槽回报） - 技能/经验提升/减少</view>
    <view class="section-body">
      <view class="input-container">
        <input v-model="bWeights.b_career_weight" type="number" />
        <text class="suffix">%</text>
      </view>
      <view class="input-container">
        <input v-model="bScores.b_career_score" :placeholder="scorePlaceholder" />
      </view>
    </view>

    <view class="section-title">b（跳槽回报） - 工作生活平衡度提升/减少</view>
    <view class="section-body">
      <view class="input-container">
        <input v-model="bWeights.b_wl_balance_weight" type="number" />
        <text class="suffix">%</text>
      </view>
      <view class="input-container">
        <input v-model="bScores.b_wl_balance_score" :placeholder="scorePlaceholder" />
      </view>
    </view>

    <view class="section-title">b（跳槽回报） - 职位名称的受尊敬度提升/减少</view>
    <view class="section-body">
      <view class="input-container">
        <input v-model="bWeights.b_life_persp_weight" type="number" />
        <text class="suffix">%</text>
      </view>
      <view class="input-container">
        <input v-model="bScores.b_life_persp_score" :placeholder="scorePlaceholder" />
      </view>
    </view>

    <view class="text-sm mt-8 text-[#0B1526]">
      请输入你在p（跳槽后潜在风险）
      各维度上的重要性和得分。重要性处于0-100%，所有维度重要性加总为100%。每个维度上具体得分区间为-1至1，越接近1越好。
      <text class="text-[#356899]">权重是个人对新offer给自己带来benefits看重比例，打分针对实际offer内容的评估。</text>
    </view>

    <!-- 跳槽后潜在风险部分 -->
    <view class="section-title">p（跳槽风险） - 新公司文化匹配度</view>
    <view class="section-body">
      <view class="input-container">
        <input v-model="pWeights.p_culture_weight" type="number" />
        <text class="suffix">%</text>
      </view>
      <view class="input-container">
        <input v-model="pScores.p_culture_score" :placeholder="scorePlaceholder" />
      </view>
    </view>

    <view class="section-title">p（跳槽风险） - 经验技能与岗位匹配度</view>
    <view class="section-body">
      <view class="input-container">
        <input v-model="pWeights.p_skill_weight" type="number" />
        <text class="suffix">%</text>
      </view>
      <view class="input-container">
        <input v-model="pScores.p_skill_score" :placeholder="scorePlaceholder" />
      </view>
    </view>

    <view class="section-title">p（跳槽风险） - 新公司行业景气度</view>
    <view class="section-body">
      <view class="input-container">
        <input v-model="pWeights.p_industry_weight" type="number" />
        <text class="suffix">%</text>
      </view>
      <view class="input-container">
        <input v-model="pScores.p_industry_score" :placeholder="scorePlaceholder" />
      </view>
    </view>

    <view class="section-title">p（跳槽风险） - 新公司稳定和盈利能力</view>
    <view class="section-body">
      <view class="input-container">
        <input v-model="pWeights.p_stablecomp_weight" type="number" />
        <text class="suffix">%</text>
      </view>
      <view class="input-container">
        <input v-model="pScores.p_stablecomp_score" :placeholder="scorePlaceholder" />
      </view>
    </view>

    <template #footer>
      <view class="w-full flex gap-4">
        <MButton type="default" size="middle" full-width style="background-color: #ff8a34; color: #fff" @click="handleReset">
          页面重置
        </MButton>
        <MButton type="primary" size="middle" full-width @click="handleSubmit">提交</MButton>
      </view>
    </template>
  </Layout>
</template>

<style lang="scss" scoped>
@import './style.scss';

.input-container {
  input: {
    background-color: #f5f5f5;
    color: #999;
  }
}
</style>
