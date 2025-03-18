declare module 'cssbeautify' {
    interface Options {
      /**
       * تحديد عدد المسافات للمسافة البادئة.
       * على سبيل المثال: '  ' لمسافتين أو '    ' لأربع مسافات.
       */
      indent?: string;
  
      /**
       * إضافة الفاصلة المنقوطة تلقائيًا في نهاية التعليمات.
       * true لإضافة الفاصلة المنقوطة، false لعدم إضافتها.
       */
      autosemicolon?: boolean;
  
      /**
       * موضع القوس المفتوح.
       * 'end-of-line' للقوس في نهاية السطر، 'separate-line' للقوس في سطر منفصل.
       */
      openbrace?: 'end-of-line' | 'separate-line';
  
      /**
       * تحديد الفاصل بين المحددات.
       * الافتراضي هو '\n' (سطر جديد).
       */
      selectorSeparator?: string;
  
      /**
       * إضافة سطر جديد بين القواعد.
       * true لإضافة سطر جديد، false لعدم الإضافة.
       */
      newlineBetweenRules?: boolean;
    }
  
    function cssbeautify(code: string, options?: Options): string;
  
    export = cssbeautify;
  }
  