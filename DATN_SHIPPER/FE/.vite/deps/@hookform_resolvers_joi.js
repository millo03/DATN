import {
  appendErrors,
  get
} from "./chunk-G2EZVKFD.js";
import "./chunk-5TQB74YF.js";
import "./chunk-TIUEEL27.js";

// node_modules/@hookform/resolvers/dist/resolvers.mjs
var t = function(t2, n3, e2) {
  if (t2 && "reportValidity" in t2) {
    var i2 = get(e2, n3);
    t2.setCustomValidity(i2 && i2.message || ""), t2.reportValidity();
  }
};
var n = function(r, n3) {
  var e2 = function(e3) {
    var i3 = n3.fields[e3];
    i3 && i3.ref && "reportValidity" in i3.ref ? t(i3.ref, e3, r) : i3.refs && i3.refs.forEach(function(n4) {
      return t(n4, e3, r);
    });
  };
  for (var i2 in n3.fields)
    e2(i2);
};
var e = function(r) {
  return r instanceof Date;
};
var i = function(r) {
  return null == r;
};
var a = function(r) {
  return "object" == typeof r;
};
var o = function(r) {
  return !i(r) && !Array.isArray(r) && a(r) && !e(r);
};
var f = function(r) {
  return /^\w*$/.test(r);
};
var s = function(r, t2, n3) {
  for (var e2 = -1, i2 = f(t2) ? [t2] : function(r2) {
    return t3 = r2.replace(/["|']|\]/g, "").split(/\.|\[/), Array.isArray(t3) ? t3.filter(Boolean) : [];
    var t3;
  }(t2), a2 = i2.length, s2 = a2 - 1; ++e2 < a2; ) {
    var u2 = i2[e2], c2 = n3;
    if (e2 !== s2) {
      var l = r[u2];
      c2 = o(l) || Array.isArray(l) ? l : isNaN(+i2[e2 + 1]) ? {} : [];
    }
    r[u2] = c2, r = r[u2];
  }
  return r;
};
var u = function(t2, e2) {
  e2.shouldUseNativeValidation && n(t2, e2);
  var i2 = {};
  for (var a2 in t2) {
    var o2 = get(e2.fields, a2), f2 = Object.assign(t2[a2] || {}, { ref: o2 && o2.ref });
    if (c(e2.names || Object.keys(t2), a2)) {
      var u2 = Object.assign({}, get(i2, a2));
      s(u2, "root", f2), s(i2, a2, u2);
    } else
      s(i2, a2, f2);
  }
  return i2;
};
var c = function(r, t2) {
  return r.some(function(r2) {
    return r2.startsWith(t2 + ".");
  });
};

// node_modules/@hookform/resolvers/joi/dist/joi.mjs
var n2 = function(n3, o2, a2) {
  return void 0 === o2 && (o2 = { abortEarly: false }), void 0 === a2 && (a2 = {}), function(i2, s2, u2) {
    try {
      var c2 = function() {
        return l.error ? { values: {}, errors: u((n4 = l.error, o3 = !u2.shouldUseNativeValidation && "all" === u2.criteriaMode, n4.details.length ? n4.details.reduce(function(r, t2) {
          var n5 = t2.path.join(".");
          if (r[n5] || (r[n5] = { message: t2.message, type: t2.type }), o3) {
            var a3 = r[n5].types, i3 = a3 && a3[t2.type];
            r[n5] = appendErrors(n5, o3, r, t2.type, i3 ? [].concat(i3, t2.message) : t2.message);
          }
          return r;
        }, {}) : {}), u2) } : (u2.shouldUseNativeValidation && n({}, u2), { errors: {}, values: l.value });
        var n4, o3;
      }, v = Object.assign({}, o2, { context: s2 }), l = {}, f2 = function() {
        if ("sync" === a2.mode)
          l = n3.validate(i2, v);
        else {
          var e2 = function(e3, r) {
            try {
              var t2 = e3();
            } catch (e4) {
              return r(e4);
            }
            return t2 && t2.then ? t2.then(void 0, r) : t2;
          }(function() {
            return Promise.resolve(n3.validateAsync(i2, v)).then(function(e3) {
              l.value = e3;
            });
          }, function(e3) {
            l.error = e3;
          });
          if (e2 && e2.then)
            return e2.then(function() {
            });
        }
      }();
      return Promise.resolve(f2 && f2.then ? f2.then(c2) : c2());
    } catch (e2) {
      return Promise.reject(e2);
    }
  };
};
export {
  n2 as joiResolver
};
//# sourceMappingURL=@hookform_resolvers_joi.js.map
