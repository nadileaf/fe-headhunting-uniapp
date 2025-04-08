import { type Ref } from 'vue';
import { message } from '@/utils/common';

interface Weights {
  [key: string]: number | null;
}

interface Scores {
  [key: string]: number | null;
}

export const defaultWeight = 25;

export function useWeightScore(weights: Ref<Weights>, scores: Ref<Scores>) {
  const handleReset = () => {
    weights.value = Object.keys(weights.value).reduce((acc, key) => {
      acc[key] = defaultWeight;
      return acc;
    }, {} as Weights);

    scores.value = Object.keys(scores.value).reduce((acc, key) => {
      acc[key] = null;
      return acc;
    }, {} as Scores);
  };

  const handleValidate = () => {
    const values = Object.values(weights.value).map((val) => Number(val));
    const totalWeight = values.reduce((sum, val) => (sum ?? 0) + (val ?? 0), 0);

    if (totalWeight / 100 !== 1) {
      message.error('权重比例加总必须等于100%');
      return false;
    }

    const scoresNumbers = Object.values(scores.value).map((val) => Number(val));
    for (const score of scoresNumbers) {
      if (typeof score === 'number' && isNaN(score)) {
        message.error('得分必须为数字！');
        return false;
      }

      if (score === null || score <= -1 || score >= 1) {
        message.error('每项得分必须在-1到1之间，1和-1都不被允许。1代表100%完美，实际情况下没有完美的offer。', {
          duration: 3000
        });
        return false;
      }
    }
    return true;
  };

  const handleWeightInput = (e: Event, field: string) => {
    const value = (e.target as HTMLInputElement).value;
    const numValue = Number(value);
    weights.value[field] = numValue;
  };

  return {
    handleReset,
    handleValidate,
    handleWeightInput
  };
}
