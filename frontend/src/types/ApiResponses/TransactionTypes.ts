import { UserFinance } from "../UserType";
import { EarningCategoryEnum } from "./../../../../backend/src/Enums/EarningCategoryEnum";
import { SpendingCategoryEnum } from "./../CategoryTypes";
import { GetUserLevelType } from "./ProfileTypes";

export type GetSpendings = {
  spendingId: number;
  categoryKey: keyof typeof SpendingCategoryEnum;
  categoryDescription: SpendingCategoryEnum;
  spentAt: string;
  userId: number;
  description: string;
  value: number;
  isCanceled: boolean;
  canceledAt?: string;
};

export type GetEarnings = {
  earningId: number;
  categoryKey: keyof typeof EarningCategoryEnum;
  categoryDescription: EarningCategoryEnum;
  earnedAt: string;
  userId: number;
  description: string;
  value: number;
  isCanceled: boolean;
  canceledAt?: string;
};

export type GetLastActivities = {
  activityId: number;
  userId: number;
  description: string;
  createdAt: string;
};

export type CreateEarningType = {
  message: string;
  earning: GetEarnings;
  userFinance: UserFinance;
  userLevel: GetUserLevelType;
  rewards: {
    xp: number;
    points: number;
  };
};

export type CreateSpendingType = {
  message: string;
  spending: GetSpendings;
  userFinance: UserFinance;
  userLevel: GetUserLevelType;
  rewards: {
    xp: number;
    points: number;
  };
};

export type CancelEarningType = {
  message: string;
  userFinance: UserFinance;
};

export type CancelSpendingType = {
  message: string;
  userFinance: UserFinance;
};
