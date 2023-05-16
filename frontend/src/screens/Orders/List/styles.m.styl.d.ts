declare namespace StylesMStylNamespace {
  export interface IStylesMStyl {
    head: string;
    row: string;
    screen: string;
    screenWrapper: string;
    table: string;
  }
}

declare const StylesMStylModule: StylesMStylNamespace.IStylesMStyl & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StylesMStylNamespace.IStylesMStyl;
};

export = StylesMStylModule;
