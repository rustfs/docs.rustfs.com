import { LanguageSelectProps, LanguageSelectTextProps } from "./slots/language-select.js";
import { FullSearchTriggerProps, SearchTriggerProps } from "./slots/search-trigger.js";
import { ThemeSwitchProps } from "./slots/theme-switch.js";
import { BaseLayoutProps, LinkItemType } from "./index.js";
import { ComponentProps, FC } from "react";
//#region src/layouts/shared/client.d.ts
declare function LinkItem({ ref, item, ...props }: Omit<ComponentProps<'a'>, 'href'> & {
  item: Extract<LinkItemType, {
    url: string;
  }>;
}): import("react").JSX.Element;
interface BaseSlots {
  navTitle: FC<ComponentProps<'a'>>;
  themeSwitch: FC<ThemeSwitchProps> | false;
  searchTrigger: {
    sm: FC<SearchTriggerProps>;
    full: FC<FullSearchTriggerProps>;
  } | false;
  languageSelect: {
    root: FC<LanguageSelectProps>;
    text: FC<LanguageSelectTextProps>;
  } | false;
}
interface BaseSlotsProps<P extends BaseLayoutProps = BaseLayoutProps> extends Pick<P, 'nav'> {
  themeSwitch: Omit<NonNullable<P['themeSwitch']>, 'enabled'>;
  searchToggle: Omit<NonNullable<P['searchToggle']>, 'enabled'>;
}
declare function baseSlots({ useProps }: {
  useProps: () => BaseSlotsProps;
}): {
  useProvider(options: BaseLayoutProps): {
    baseSlots: BaseSlots;
    baseProps: BaseSlotsProps;
  };
};
//#endregion
export { BaseSlots, BaseSlotsProps, LinkItem, baseSlots };