function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function _createClass(e,t,n){return t&&_defineProperties(e.prototype,t),n&&_defineProperties(e,n),e}(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{t6Ih:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));var r=n("gaWP"),a=n("fXoL"),i=function(){var e=function(){function e(t){_classCallCheck(this,e),this.sharedService=t}return _createClass(e,[{key:"addAfectation",value:function(e){return this.sharedService.postElement(e,"/affectations/user")}},{key:"getAffectations",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return this.sharedService.getElement("/affectations"+e)}},{key:"getTabLocAffectation",value:function(e){return this.sharedService.getElement("/affectations/localites/inventaire/"+e)}}]),e}();return e.\u0275fac=function(t){return new(t||e)(a.ic(r.a))},e.\u0275prov=a.Qb({token:e,factory:e.\u0275fac,providedIn:"root"}),e}()}}]);