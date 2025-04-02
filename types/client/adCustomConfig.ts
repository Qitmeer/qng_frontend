export type AdCustomBannerConfig = {
  text?: string;
  url?: string;
  desktopImageUrl: string;
  mobileImageUrl: string;
};

export type AdCustomConfig = {
  banners: Array<AdCustomBannerConfig>;
  interval?: number;
  randomStart?: boolean;
  randomNextAd?: boolean;
};
