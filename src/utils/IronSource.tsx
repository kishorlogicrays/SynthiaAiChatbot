import {
  LevelPlayInterstitialEvents,
  IronSource,
  IronSourceError,
  IronSourceAdInfo,
  LevelPlayRewardedVideoEvents,
  IronSourceRVPlacement,
} from 'ironsource-mediation';

LevelPlayInterstitialEvents.onAdReady.setListener(
  (adInfo: IronSourceAdInfo) => {
    IronSource.showInterstitial('DefaultInterstitial');
  },
);
LevelPlayInterstitialEvents.onAdLoadFailed.setListener(
  (error: IronSourceError) => {},
);
LevelPlayInterstitialEvents.onAdOpened.setListener(
  (adInfo: IronSourceAdInfo) => {},
);
LevelPlayInterstitialEvents.onAdClosed.setListener(
  (adInfo: IronSourceAdInfo) => {},
);
LevelPlayInterstitialEvents.onAdShowFailed.setListener(
  (ironSourceError: IronSourceError, adInfo: IronSourceAdInfo) => {},
);
LevelPlayInterstitialEvents.onAdClicked.setListener(
  (adInfo: IronSourceAdInfo) => {},
);
LevelPlayInterstitialEvents.onAdShowSucceeded.setListener(
  (adInfo: IronSourceAdInfo) => {},
);

export const loadInterstitial = async () => {
  await IronSource.loadInterstitial();
};

// --------------- REWARD ADS----------------------

LevelPlayRewardedVideoEvents.onAdOpened.setListener(
  (adInfo: IronSourceAdInfo) => {
    console.log('Video Events ====', adInfo);
  },
);
LevelPlayRewardedVideoEvents.onAdClosed.setListener(
  (adInfo: IronSourceAdInfo) => {},
);
LevelPlayRewardedVideoEvents.onAdAvailable.setListener(
  (adInfo: IronSourceAdInfo) => {},
);
LevelPlayRewardedVideoEvents.onAdUnavailable.setListener(() => {});
LevelPlayRewardedVideoEvents.onAdRewarded.setListener(
  (placement: IronSourceRVPlacement, adInfo: IronSourceAdInfo) => {},
);
LevelPlayRewardedVideoEvents.onAdShowFailed.setListener(
  (ironSourceError: IronSourceError, adInfo: IronSourceAdInfo) => {},
);
LevelPlayRewardedVideoEvents.onAdClicked.setListener(
  (placement: IronSourceRVPlacement, adInfo: IronSourceAdInfo) => {},
);

export const RewardedVideo = async (placement: string) => {
  await IronSource.shouldTrackNetworkState(true);
  const isAvailable: boolean = await IronSource.isRewardedVideoAvailable();
  if (isAvailable) {
    IronSource.showRewardedVideo(placement);
  }
};
