import { teal600, teal300 } from 'material-ui/styles/colors';

export interface Theme extends __MaterialUI.Styles.MuiTheme {
  gridPagination: {
    firstPageIcon?: string;
    lastPageIcon?: string;
    prevIcon?: string,
    nextIcon?: string,
    minWidth?: string,
    itemActiveBg?: string;
    itemActiveColor?: string;
    itemBg?: string;
    itemColor?: string;
    itemMargin?: number;
  },
  profileMenu: {
    textColor: string;
    avatarSize: number;
  },
  customAvatarStyle?: __React.CSSProperties,
  ownerNameStyle: __React.CSSProperties
}

export function getDefaultLightTheme(miuiTheme: __MaterialUI.Styles.MuiTheme): Theme {
  let theme = Object.assign({}, miuiTheme, {
    gridPagination: {
      prevIcon: "navigate_before",
      nextIcon: "navigate_next",
      firstPageIcon: "first_page",
      lastPageIcon: "last_page",
      minWidth: "25px",
      itemActiveBg: miuiTheme.appBar.color,
      itemActiveColor: "#fff",
      itemMargin: 10
    },
    ownerNameStyle: {
      color: teal600,
    },
    profileMenu: {
      textColor: "#fff",
      avatarSize: 40
    }
  }) as Theme;
  theme.tabs.backgroundColor = teal300;
  theme.flatButton.primaryTextColor = teal300;
  theme.customAvatarStyle = {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
  };
  return theme;
}