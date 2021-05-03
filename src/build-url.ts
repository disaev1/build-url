interface Options {
  path?: string;
  hash?: String;
  lowerCase?: boolean;
  disableCSV?: boolean;
  queryParams?: { [name: string]: string | string[] };
}

interface Root {
  buildUrl?: Function;
}

;(function() {
  const root: Root = this;
  const previousBuildUrl: Function = root.buildUrl;

  function encodedParam(param: String | Boolean | Number) {
    return param === null ? '' : encodeURIComponent(String(param).trim());
  }

  function buildUrl(url?: string, options?: Options);
  function buildUrl(options?: Options);
  function buildUrl(arg1?: string | Options, options?: Options) {
    const queryString: string[] = [];
    let builtUrl: string;
    let caseChange: Boolean;

    if (options && options.lowerCase) {
      caseChange = !!options.lowerCase;
    } else {
      caseChange = false;
    }

    if (arg1 === null) {
      builtUrl = '';
    } else if (typeof arg1 === 'object') {
      builtUrl = '';
      options = arg1;
    } else {
      builtUrl = arg1;
    }

    if (options) {
      if (options.path) {
        if (builtUrl && builtUrl[builtUrl.length - 1] === '/') {
          builtUrl = builtUrl.slice(0, -1);
        }

        let localVar: string = String(options.path).trim();

        if (caseChange) {
          localVar = localVar.toLowerCase();
        }

        if (localVar.indexOf('/') === 0) {
          builtUrl += localVar;
        } else {
          builtUrl += '/' + localVar;
        }
      }

      if (options.queryParams) {
        for (const key in options.queryParams) {
          if (options.queryParams.hasOwnProperty(key) && options.queryParams[key] !== void 0) {
            let param: String;

            if (options.disableCSV && Array.isArray(options.queryParams[key]) && options.queryParams[key].length) {
              for (let i = 0; i < options.queryParams[key].length; i++) {
                param = options.queryParams[key][i];
                queryString.push(key + '=' + encodedParam(param));
              }
            } else {
              if (caseChange) {
                param = (<string>options.queryParams[key]).toLowerCase();
              } else {
                param = <string>options.queryParams[key];
              }

              queryString.push(key + '=' + encodedParam(param));
            }
          }
        }

        builtUrl += '?' + queryString.join('&');
      }

      if (options.hash) {
        if (caseChange) {
          builtUrl += '#' + String(options.hash).trim().toLowerCase();
        } else {
          builtUrl += '#' + String(options.hash).trim();
        }
      }
    }

    return builtUrl;
  }

  buildUrl.noConflict = function(): Function {
    root.buildUrl = previousBuildUrl;

    return buildUrl;
  }

  if (typeof(exports) !== 'undefined') {
    if (typeof(module) !== 'undefined' && module.exports) {
      exports = module.exports = buildUrl;
    }

    exports.buildUrl = buildUrl;
  } else {
    root.buildUrl = buildUrl;
  }
}).call(this);