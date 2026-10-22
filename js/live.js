/* Live thumbnails: the real animations from hammadtherealtor.ca (plane leaving Pearson)
   and castoreumcanada.ca (export-route globe), re-mounted inside portfolio thumbnails.
   Adapted from each site's own code. No network requests. */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var D2R = Math.PI / 180;
  var LAND = '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kBQSAlJTQAgKBQGpKSwEpIaAkBQSAlJTQAhKAQGhKSQEpIaAUBQSAlJTUAhKCQGhKSQEpKaAEBQCAkJTSAhICQGhKCQEpKaAEJQCAkJTSAhIDQGhKCSEhKawEJQSAkJRSAhITQGhKAQEhKKQEJASAkJRSAhITQEhKAUEhKKQEJCaAkJRSAgITWEhKCUEhKKwEJCaAkJQCAgIRWEhICUEhKKQEBCKAkJQCggIRWEhICUFhKKQEBCKQkJQSggIRSEhIAUFhKCUEBCCQkJACggIRSEhIASFhaCUEBCKwkJACgoIQSEhIASFhYAUEBCKwkJACggIQSkhIBSFhIAUUBCKQkJACAgJQSkgIBSFhIAUFBCCQkJACAoJASmgIBSFhYAQEBCCUkBASAoJASkoIASFhIAQEBACUkBBKAoLASGgIASFhICQEBYCUkBBKAoJASGhIASkgIIQFBYCUlBRCAoJASEhKASkgIJQFBYCQkJBCAgJBSGhLASkhIBQVBICQkJBCEgJBaGgJASEhIIQUBIKQkJRCEgJBaGoJASEhIIQUBIKQkBBCEhJBaGgJASEhIIQkBIKQkBJCAgJBSGgJBSEhKJQkJICQkBZCAgJBSGgJBSEgIJQEJIKQkFJKAgJBaEgJRSFgLIQkBIKQkFJKAgBRSEgJBWEgJJQEBIKQkFJKAgBZaEgJBWEgJJQEAKKQkBJKAgBZaEgJRSEgpJQEAKKQkBIKAgBJaEgJBSFgpJQEAKKQkFKKggBJaEgBBSEgJJQEALKQkFKKAgBJaEgBBSFgJBQEAJKQkEIKAgBJaEgBBSEgpRUEAJKQkEIKAgBJaEgBBSEghBUEAJKQlEIKAoBJaEgAJSEghBQEAJKQkEIKAgFIakoAJSEohBQEAJKQkEAKAgFJaggAJSEogBQEApKUkEAKElFJaAgBJSEogBQEApKUEEAKElFBaAgBJSEogBQEIpKUEEAKAlFAaAgFBSgggBQkIoKQEEIKAgFAaAgFBWgggBQkooKQEEAKAgFAaAgFBWgggBQEAoKQEEgKEAFAaAgFRWAggBQEAoCQEEoKkAFAaAgFRWAgkBQAAoCQEEoKgAFAaAgFRSAgkBUgAoCQEEoKgAFAaAAFASAglBUgAoCQEEqKAAFgagAFASAglBUAAoCUAEqCAAFgagAFQSAglBUAAoCUQEqCAAFoagAFQSAAlRUAAoCUQEoCAAFoagAFASiAlQQAApCUQEoCAAFoKgAFASiAlQQAApCUQEqCEQFqKAAFASiAlQQgApQUQEoCkQFqCAAFIWiAlAQgApAUQEoCEQFqCgAFISiAlQUiApQQQEoCEUFqCgQFYCiAlAQiApQUQAoCkUFqCgQFYCCAlAQiApQQQAqAEUFqCAQFaCiAlAQigpQQSAqAAUFoCAQFaCCAlAAigpAQSAqAAUFoCAUFaCiQFQAigpAQSAqQgUFoAAUFaCiQFQACgpAQSAqQgUFoAAUFYCCQFQEigpAASgqQkWFqAAUFICCQFSECgpAASgqQAWFqAgVFICCQFSEigpBASgoAEWFqAgUBYACUFSACgpRASgoQgWBqAgVFYACUFSACgpRASgqAgWAqAAVFIICUFCECgpRASgqAgWgqAAVFKICUFCECghRESoqAAWgoAgVFKIiUFQECghRASooBEWkoAgVEIIiUFAEikhRESooBAWgqAgUEaIiVFQECkhBESogBAWgqAgUEKIiVFAMikhBESggBAWgoAgUkIIiVFAMCkBBESggREWgqBgUkIIiVEAICsBBESggBEWooBgUkIIiUEAICkBRMSggB0WogBgUkKIiUEAICkBRMSggBUWogBAUgIIiUEAICkBBMSggB0WggBAUkYNiUEAKClABMSgiRUWggBAUgIJiUEAOikABMSggBUWggBgUgAJiUEAKilABMSgAB8WggBwUoAJiUEAKikABISgABcWggBQUoQJiUEQKikABISgABcSggBQUoQJCUAAOilEBKSgABcSogBQUoQJCUAAKilERKShCBcSggBQUoQJCUAAKiEEBKShCBYSgABQUowJSUAQKiEEBKSgCBYSgABQQogJSUAQKiEEBKShCBYSgCBQQogJSUAQKCEEBKCpEBaSgABQQgwJSUAQKCFEBKCAEBaSoABQQgwJQUAQKCFEBKCIEBaSoCBQQggJQUAgKSEEBKCAGBaCgCBQQgwJQRAgKSEEBKCAGBaCgABSQggJQQAgKSEEBKCAGBaCoEBSQogJwQAwKQEEBKCAEBaCAEBSQggJQQAwKQFEBKCAFBaCAEBSAggJQQAwKQEEhKCAFBaCAEBSAogJQQAwKQAEhKAAFBaCAEBSAggJQQAoKQAEhKAAFRaCAEBSAAkJQAAoKQAEhKAAFBaCIFBSAAkJQAAoKQAEhKAAFBaAIFBSAAkJQAAoKQAEhKAAFhKAIFBSAAkJQAAoKQAEpKAAFhKAIFBSBAkJQAAoKQBEoKAAFhKAIFBSAIlJQAAoIQVEoKAAFhKAAFBSAIlBQAAoIQREoKAJFpKAAFBCAIlBQAAoIQQEoKABFoKAAFBCColBQBAoIQQEoKABFoKAAFBCCIlBQBIpIQQEoIARFoaAIFBCCIlBQAIpAQQEoIgRFoaAIFJGCAlBQAIpCQQEoIAQFoKAIFIGCAlBECIpCQREoIAQFoKAIFIWCAlBECIpAQREoIgUFoIgAFIWCAlBECApAQREoAgUFoIgAHIWCIlBECgpAUREoCgUFoIgQFIGCIlBECgpAEQEoCgVFoIgUFIGiIlAUCgpAEQEoAgVFoKgUFIAiAlAUCgpAEQEoAkVFoCgUFIAiA1AUCopAUQkoAkVEoCgUFIAiAlAEiopAUSkoAkUEoCgUFIEiAlAEiohAUSgoAEUEoAgUFYGiElAEioxAUSgoAkUE4AgUEYGiUFAEighAUSgoAkUloAgUEYGiUFAEighAESgiAkUhoAgUEYGiUFAEighAESgiAkUhoAgUEYAiUEQEikpAESgiAkWhoAgUEYAiUEQEikJAESgiAkWhgAgUEYAiUEQEikJAESgiAEWgiAgUlYAiUEQEikIBESgiAEWgiAgUhYAiUEQEikARESgqAEWgiAgUhSIiUEQEikARESgKAUWgiAgUhSIiUEQEikARETgKQUWgiAgUgSIiUBQAikARESgKRUSgiAgUgSIiUBSCikARESgCRUSgKAAVgSIiUBSCikARESgCRUSgKAAVgSIicASKiEBRESoCRUSgKAQVgSIiUASKiEBRACoCRUSgKBQVgSIiVASKiEBRACoCRUSgCBQRgaIgVASKiEBRCCoCRUSoCBQRgaIgVASKiEARKCICRUCoCBQRgaIAVASKgFARKCICRUGoCBQRgaJQVASKgFARKCICRUGoCBQBgSJQRASKglARKCICRQGoCBQBoSJQRASKglARKAICRaCoCBQBoSJQBASKglARKAJCRaCICBQFoSJQBASKQlERKAJCRaAICBQFoSJQBASKQBERKAJCRaAICBQFISJQBISKQBERKApCRaAICBSBIyJQBISKQBEQKAJCRKAICBSBIiJQBISKQBEQKAJGRKAICBWBIiBQBISIQBEQKAJHRKAICBWBIiBQBISIQBEQKgJFQKAICBWBIiBQBIyIQBEQKgJFQKAICBGBIiBQBIqIQBEQKgJFQKAIGBGBIiBUBIqAQBEQKgJFQKAIGBGBIiBUBIqAQBEQIgJFQKAIFBGBIiBUBIqAQBEwIgJFQKgIFAGBIiBEBIqAQBEwIgJFQKgIFAGBImBEBIqAQBEoAgJFQKgIFAGBImBEBIqAUBEoAgJFQIgIFAGBIkAEBIqAUBEoAgJFwIgIFAGBIlAEBIqAEBEoAgJFwAgIFAGhIlAEBIqAEBEoAgJFgAgIFAEhIlAEBIqAEREoAkJFoAgIFAEhIlAEBIoAERAoAkJEoAgIFAEjIFAEBIoAERAoAkJEoAgIFAEjIFAEhIhAERAoAkZAoAgIFAEiIFAEhIhAERAoAkZAoAgIEAEiIFAAhIhAERAoAkRAoAgIEYEiIFAAjIBAERAgAkRAoAAIEYEiIFAAjIBAARAgAkRAoAAIAYECIFAAiIBAARAiAkVAoAAQAYECIEAEiIBAARACAgVAgAAQAYECIEAEioBAATACAgVAgAAQAYECIEQECoAAASACAgVAgAAQAYECIAQECoAAASAAAgRAiAgQAAECQAQECoAAASAAAgRACAAUAAEAQAAECIAAESAAAgTACAAQAAEAQAAECIAQACAAAgSAAAgQAAEAQAAECIABACAAAgCAAAgQAAEAQAAECAABACAAAgCAQAgQAAEgQAAECAABECAAAgCAAAgQAAIAQAAEAAABECAAAgCAAAgQAAIAQAAEAACBECAABgCAAAgQAAIgQAAEAACBECAABACAAAgAAAIgQAAMAAABECAABACAAAgAAAIhQAAIAACBEAAABECAAAAAAAIhQAAIAAABEAAABECAABAAAAIBAAAIAAABAAAABEKAABAAAAIgAAAIAAABAAAABAIAABAAAAIAAAAIBAAAIAAABAAAABAAAAAAAAAIBAAAIAAABAAAABAAAABAAAAIAAAAIAAABAAAABAIAABAAAAIAAAAIAAAAAAAABAIAABAAAAIAAAAIAAAAIAAABAAAQBAIAAAgAAAIBAAAIAAAAAAAQBAIAAAAAEAIAAAAIAAAAAAAQBAAAAAAAAAAAACAIBAAAAAAABAAAAAAAEAAAACAIAAAAAAAABAAAAAAIEAAAACAIAAAAAAAgAAAAQAAAEAAAAEAIAAAAAAAgEAAAQAAAEAAAAEAAAAAAAAAgAAAAAAAAEAAAAEAgAAAAAAAgAAAAAEAAEAAAAEAAAAAAAAAgAAAAgEAAAAAAAEAAAAAAgAAgAAAAgAAAAAAAAEAAAAEAgAAAAAAAgAAAAAEAAEAAAAEAgAAAAAAAgAAAAgEAAAAAAAEAAAAAAgAAgAAAAgEAAAAAAAEAAAAEAgAAAAAAAgAAAAAAAAEAAAAEAgAAAAAAAgAAAAgAAAEAAAAEAAAAAAAAAgAAAAgAAAEAAAAEAAAAAAAAAgAAAAgAAAAAAAAEAAAAAAAAAgAAAAgAAAAAAAAEAAAAAAAQAAAAAAgAAAAAACAEAAAAAAAQAAAAAAgAAAAAACAAAAAAAAAQAAAAAAgAEAAAACAAAAAAAAAQAAAAQAAAAAAAACAAAAAAAAAQAAAAQAAAAAAAACAAAAAAAAAAAAAAQAAAAAAAACAAAACAAAAAAAAAQAAAAAAAAAAAAACAAAAAAAAAQAAAAQAAAAAEAACAAAAAAAAAQAAAAQAAAAAAAACAAAAAAAAAAAAAAQAAAAAAAACAAAAAAAAAAAAAAQAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAACAAAAAAAAAQAAAAQAAACAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAABAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgBAAAAAIBAAICAEABAAEABQIkBAQAgAKQEhACBEhJSAEBBSAkJIQAgIKQEhJKREhJSAEhJSAkJISAkJKQElJaQEhJSQkhJSAkpKSEkIKSElp6RklJSQkhJSQkpKSMkoKSElp6TklJSQklFSUkpLSckpLS2lp7T0lJaS0lFaWktPaekpLa2lo7S0lpbW0nNaWktPaektLa2l57S0lpbS0ltaWk/PaWk9L6Wn9/S0np7S03t6Ss/P6Wk9PaXn9/SUnt/y83p+ys/v+Tk9v+fn9fyen9/z835+z8/reT0/v+f39byen9fz+37ez+/7+T0/7+f3/bye3/f7+35ez+/7eT8/r/f1/Lyen9f7e35e7+/7eT2/r+f3/P6f3/fze35/7+/7/b2///f3//7f3//7/3///+////3/////////////////';
  var DOTS = null;
  function landDots() {
    if (DOTS) return DOTS;
    var bin = atob(LAND), N = 60000, ga = Math.PI * (3 - Math.sqrt(5)), out = [];
    for (var i = 0; i < N; i++) {
      if (bin.charCodeAt(i >> 3) & (1 << (i & 7))) {
        var y = 1 - 2 * (i + 0.5) / N, r = Math.sqrt(1 - y * y), th = i * ga;
        out.push(Math.sin(th) * r, y, Math.cos(th) * r);
      }
    }
    return (DOTS = new Float32Array(out));
  }
  // Pause thumbnails while a lightbox is open, and anything off-screen
  function shouldDraw(node) {
    if (!node.isConnected) return false;
    var lb = document.getElementById('lightbox');
    if (lb && lb.open && !lb.contains(node)) return false;
    return node.__vis !== false && !document.hidden;
  }
  function watch(node) {
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { node.__vis = es[0].isIntersecting; }).observe(node);
  }

  /* ---------- Plane leaving Pearson (hammadtherealtor.ca map) ---------- */
  function mountPlane(root) {
    var path = root.querySelector('.lm-flight'), trail = root.querySelector('.lm-trail'), plane = root.querySelector('.lm-plane');
    if (!path || !trail || !plane) return;
    var L = path.getTotalLength();
    trail.style.strokeDasharray = L;
    function place(k) {
      var a = path.getPointAtLength(k * L), b = path.getPointAtLength(Math.min(L, k * L + 1)),
        ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI + 90, s = 0.9 + k * 0.9;
      plane.setAttribute('transform', 'translate(' + a.x + ' ' + a.y + ') rotate(' + ang + ') scale(' + s.toFixed(2) + ')');
      plane.style.opacity = k > 0.85 ? ((1 - k) / 0.15).toFixed(2) : 1;
      trail.style.strokeDashoffset = (L * (1 - k)).toFixed(1);
      trail.style.opacity = (0.7 * (1 - k * 0.6)).toFixed(2);
    }
    if (reduce) { place(0.35); return; }
    watch(root);
    var T = 4200, hold = 1300, t0 = performance.now();
    (function fly(t) {
      if (!root.isConnected) return;
      if (shouldDraw(root)) {
        var c = (t - t0) % (T + hold), k = c < hold ? 0 : (c - hold) / T, e = k * k * (3 - 2 * k) * 0.6 + k * 0.4;
        place(Math.min(1, e));
      }
      requestAnimationFrame(fly);
    })(t0);
  }

  /* ---------- Export-route globe (castoreumcanada.ca) ---------- */
  function vec(lat, lon) { lat *= D2R; lon *= D2R; return [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)]; }
  var ORIGIN = { lat: 43.59, lon: -79.64 };
  var COLORS = ['#ee4b37', '#a9cf3c', '#8d92ff', '#e0428a', '#e7a95e'];
  var DESTS = [['Grasse', 43.66, 6.92, 1], ['Paris', 48.86, 2.35, 0], ['Geneva', 46.20, 6.14, 0], ['London', 51.50, -0.12, 1],
    ['Hamburg', 53.55, 9.99, 0], ['Milan', 45.46, 9.19, 0], ['Barcelona', 41.39, 2.17, 0], ['Istanbul', 41.01, 28.98, 1],
    ['Dubai', 25.20, 55.27, 1], ['Karachi', 24.86, 67.00, 1], ['Hong Kong', 22.30, 114.17, 1]];
  function slerp(a, b, ang, t) {
    var s = Math.sin(ang), wa = Math.sin((1 - t) * ang) / s, wb = Math.sin(t * ang) / s;
    return [a[0] * wa + b[0] * wb, a[1] * wa + b[1] * wb, a[2] * wa + b[2] * wb];
  }
  function hexA(h, a) { var n = parseInt(h.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; }

  function mountGlobe(canvas, interactive) {
    if (!canvas.getContext) return;
    var ctx = canvas.getContext('2d'), dots = landDots();
    // Draw in the original 1000 x 625 layout and scale to whatever size the thumbnail is
    var W = 1000, HH = 625, R = Math.max(W * 0.6, HH * 0.82), cx = W * 0.5, cy = HH * 0.52;
    var routes = DESTS.map(function (d, k) {
      var a = vec(ORIGIN.lat, ORIGIN.lon), z = vec(d[1], d[2]);
      var ang = Math.acos(Math.max(-1, Math.min(1, a[0] * z[0] + a[1] * z[1] + a[2] * z[2])));
      return { name: d[0], key: !!d[3], a: a, b: z, ang: ang, color: COLORS[k % COLORS.length], period: 5 + ang * 3.2, offset: Math.random() };
    });
    var view = { lat: 38, lon: -12 }, dragging = false, idleAt = 0, start = performance.now();
    var q = [0, 0, 0, 0], paths = [[], [], [], [], []];
    function size() {
      var dpr = Math.min(2, window.devicePixelRatio || 1), w = canvas.clientWidth || 300;
      var k = Math.min(2.2, w * dpr / W);
      canvas.width = Math.round(W * k); canvas.height = Math.round(HH * k);
      ctx.setTransform(k, 0, 0, k, 0, 0);
    }
    function proj(p, out) {
      var lo = view.lon * D2R, la = view.lat * D2R, cl = Math.cos(lo), sl = Math.sin(lo);
      var x1 = p[0] * cl - p[2] * sl, z1 = p[0] * sl + p[2] * cl;
      var y2 = p[1] * Math.cos(la) - z1 * Math.sin(la), z2 = p[1] * Math.sin(la) + z1 * Math.cos(la);
      out[0] = cx + x1 * R; out[1] = cy - y2 * R; out[2] = z2; out[3] = x1 * x1 + y2 * y2;
      return out;
    }
    function arcPoint(r, t) { var p = slerp(r.a, r.b, r.ang, t), h = 1 + Math.sin(Math.PI * t) * (0.06 + r.ang * 0.09); return [p[0] * h, p[1] * h, p[2] * h]; }
    function visible(o) { return o[2] > 0 || o[3] > 1; }
    function line(fn, n) {
      ctx.beginPath(); var pen = false;
      for (var k = 0; k < n; k++) { proj(fn(k), q); if (q[2] > 0) { pen ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); pen = true; } else pen = false; }
      ctx.stroke();
    }
    function seg(r, t0, t1) {
      ctx.beginPath(); var pen = false, n = 48;
      for (var k = 0; k <= n; k++) {
        var tt = t0 + (t1 - t0) * k / n; proj(arcPoint(r, tt), q);
        if (visible(q)) { pen ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); pen = true; } else pen = false;
      }
      ctx.stroke();
    }
    function plane(x, y, ang, s, col) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
      ctx.beginPath();
      ctx.moveTo(9, 0); ctx.lineTo(3, -1.4); ctx.lineTo(-1, -8); ctx.lineTo(-3.5, -8); ctx.lineTo(-1, -1.4);
      ctx.lineTo(-6, -1.4); ctx.lineTo(-8, -4.5); ctx.lineTo(-9.5, -4.5); ctx.lineTo(-8, 0);
      ctx.lineTo(-9.5, 4.5); ctx.lineTo(-8, 4.5); ctx.lineTo(-6, 1.4); ctx.lineTo(-1, 1.4);
      ctx.lineTo(-3.5, 8); ctx.lineTo(-1, 8); ctx.lineTo(3, 1.4); ctx.closePath();
      ctx.fillStyle = '#f3ebdd'; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.restore();
    }
    function draw(time) {
      var t = time / 1000;
      ctx.clearRect(0, 0, W, HH);
      var g = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.25);
      g.addColorStop(0, 'rgba(141,146,255,0.28)'); g.addColorStop(1, 'rgba(141,146,255,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 1.25, 0, 7); ctx.fill();
      var og = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
      og.addColorStop(0, '#1a4f63'); og.addColorStop(1, '#071d27');
      ctx.fillStyle = og; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
      ctx.strokeStyle = 'rgba(183,205,208,0.08)'; ctx.lineWidth = 1;
      for (var la = -60; la <= 60; la += 30) line(function (k) { return vec(la, k * 2 - 180); }, 181);
      for (var lo = -180; lo < 180; lo += 30) line(function (k) { return vec(k - 90, lo); }, 181);
      var ds = Math.max(1.3, R / 260), hd = ds / 2;
      var lo2 = view.lon * D2R, la2 = view.lat * D2R, cl = Math.cos(lo2), sl = Math.sin(lo2), ca = Math.cos(la2), sa = Math.sin(la2);
      for (var b = 0; b < 5; b++) paths[b].length = 0;
      for (var i = 0; i < dots.length; i += 3) {
        var x0 = dots[i], y0 = dots[i + 1], z0 = dots[i + 2];
        var x1 = x0 * cl - z0 * sl, z1 = x0 * sl + z0 * cl, z2 = y0 * sa + z1 * ca;
        if (z2 <= 0) continue;
        var sx = cx + x1 * R, sy = cy - (y0 * ca - z1 * sa) * R;
        if (sx < -2 || sy < -2 || sx > W + 2 || sy > HH + 2) continue;
        paths[Math.min(4, (z2 * 5) | 0)].push(sx - hd, sy - hd);
      }
      for (var b2 = 0; b2 < 5; b2++) {
        var arr = paths[b2]; if (!arr.length) continue;
        ctx.fillStyle = 'rgba(243,235,221,' + (0.3 + b2 * 0.13).toFixed(2) + ')';
        ctx.beginPath();
        for (var k = 0; k < arr.length; k += 2) ctx.rect(arr[k], arr[k + 1], ds, ds);
        ctx.fill();
      }
      routes.forEach(function (r) {
        ctx.lineWidth = 0.8; ctx.strokeStyle = hexA(r.color, 0.45);
        ctx.setLineDash([3, 4]); seg(r, 0, 1); ctx.setLineDash([]);
        proj(r.b, q);
        if (q[2] > 0) {
          var pulse = (t * 0.8 + r.offset) % 1;
          ctx.strokeStyle = hexA(r.color, 1 - pulse); ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(q[0], q[1], 5 + pulse * 16, 0, 7); ctx.stroke();
          ctx.fillStyle = r.color; ctx.beginPath(); ctx.arc(q[0], q[1], 5.5, 0, 7); ctx.fill();
          if (r.key) { ctx.font = '600 11px "IBM Plex Mono", ui-monospace, monospace'; ctx.fillStyle = 'rgba(243,235,221,0.8)'; ctx.fillText(r.name, q[0] + 10, q[1] - 8); }
        }
        var p = reduce ? 0.55 : ((t / r.period + r.offset) % 1);
        ctx.lineWidth = 2.2; ctx.strokeStyle = hexA(r.color, 0.95);
        seg(r, Math.max(0, p - 0.18), p);
        var a = arcPoint(r, p), b3 = arcPoint(r, Math.min(1, p + 0.01));
        var pa = proj(a, [0, 0, 0, 0]), pb = proj(b3, [0, 0, 0, 0]);
        if (visible(pa)) plane(pa[0], pa[1], Math.atan2(pb[1] - pa[1], pb[0] - pa[0]), 0.75 + Math.max(0, pa[2]) * 0.35, r.color);
      });
      proj(vec(ORIGIN.lat, ORIGIN.lon), q);
      if (q[2] > 0) {
        ctx.fillStyle = '#ee4b37'; ctx.beginPath(); ctx.arc(q[0], q[1], 5, 0, 7); ctx.fill();
        ctx.strokeStyle = '#f3ebdd'; ctx.lineWidth = 2; ctx.stroke();
        ctx.font = '700 12px "IBM Plex Mono", ui-monospace, monospace'; ctx.fillStyle = '#f3ebdd';
        var lbl = 'CANADA · YYZ', lw = ctx.measureText(lbl).width;
        ctx.fillText(lbl, q[0] - lw - 10 < 4 ? q[0] + 10 : q[0] - lw - 10, q[1] + 16);
      }
      ctx.strokeStyle = 'rgba(243,235,221,0.18)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    }
    if (interactive) {
      var px, py;
      canvas.style.cursor = 'grab'; canvas.style.touchAction = 'pan-y';
      canvas.addEventListener('pointerdown', function (e) { dragging = true; px = e.clientX; py = e.clientY; canvas.setPointerCapture(e.pointerId); e.stopPropagation(); });
      canvas.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        var sc = W / (canvas.clientWidth || W);
        view.lon -= (e.clientX - px) * 0.35 * sc * 0.5; view.lat += (e.clientY - py) * 0.35 * sc * 0.5;
        view.lat = Math.max(-70, Math.min(80, view.lat)); px = e.clientX; py = e.clientY;
        if (reduce) draw(performance.now());
      });
      var up = function () { dragging = false; idleAt = performance.now(); };
      canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
      canvas.addEventListener('click', function (e) { e.stopPropagation(); });
    }
    size();
    var ro = 'ResizeObserver' in window ? new ResizeObserver(function () { size(); draw(performance.now()); }) : null;
    if (ro) ro.observe(canvas);
    if (reduce) { draw(0); return; }
    watch(canvas);
    (function frame(now) {
      if (!canvas.isConnected) { if (ro) ro.disconnect(); return; }
      if (shouldDraw(canvas)) {
        if (!dragging && now - idleAt > 2500) {
          var want = 8 + 30 * Math.sin((now - start) / 1000 * 0.1);
          view.lon += (want - view.lon) * 0.02; view.lat += (38 - view.lat) * 0.02;
        }
        draw(now);
      }
      requestAnimationFrame(frame);
    })(performance.now());
  }

  /* ---------- Pond ripples (castoreumcanada.ca hero) ---------- */
  function mountWater(canvas, interactive) {
    var W = 360, H = 133, ctx = canvas.getContext('2d');
    canvas.width = W; canvas.height = H;
    var cur = new Float32Array(W * H), prev = new Float32Array(W * H), img = ctx.createImageData(W, H), d = img.data;
    var damp = matchMedia('(pointer: coarse)').matches ? 0.955 : 0.982;
    var bR = new Float32Array(H), bG = new Float32Array(H), bB = new Float32Array(H);
    for (var y = 0; y < H; y++) { var t = y / (H - 1); bR[y] = 9 - 2 * t; bG[y] = 43 - 14 * t; bB[y] = 54 - 14 * t; }
    function drop(px, py, rad, str) {
      for (var j = -rad; j <= rad; j++) for (var i = -rad; i <= rad; i++) {
        var x = px + i, yy = py + j, dd = Math.sqrt(i * i + j * j);
        if (x < 1 || yy < 1 || x >= W - 1 || yy >= H - 1 || dd > rad) continue;
        cur[yy * W + x] += str * (Math.cos(dd / rad * Math.PI) + 1) / 2;
      }
    }
    function step() {
      for (var y = 1; y < H - 1; y++) for (var x = 1; x < W - 1; x++) {
        var i = y * W + x, v = (cur[i - 1] + cur[i + 1] + cur[i - W] + cur[i + W]) * 0.5 - prev[i];
        prev[i] = v * damp;
      }
      var tmp = cur; cur = prev; prev = tmp;
    }
    function render() {
      for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
        var i = y * W + x, o = i * 4, s = 0;
        if (x > 0 && x < W - 1 && y > 0 && y < H - 1) s = (cur[i - 1] - cur[i + 1]) * 0.9 + (cur[i - W] - cur[i + W]) * 0.6;
        var sp = s > 6 ? (s - 6) * 2.2 : 0;
        d[o] = bR[y] + s * 0.55 + sp * 1.1; d[o + 1] = bG[y] + s * 0.9 + sp * 1.05; d[o + 2] = bB[y] + s + sp * 0.9; d[o + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    }
    function at(e) {
      var r = canvas.getBoundingClientRect();
      return [Math.round((e.clientX - r.left) / r.width * W), Math.round((e.clientY - r.top) / r.height * H)];
    }
    if (reduce) { render(); return; }
    var host = canvas.parentNode, last = 0;
    host.addEventListener('pointermove', function (e) {
      var now = performance.now(); if (now - last < 24) return; last = now;
      var p = at(e); drop(p[0], p[1], interactive ? 6 : 4, interactive ? 70 : 50);
    });
    if (interactive) {
      host.addEventListener('pointerdown', function (e) { var p = at(e); drop(p[0], p[1], 18, 140); });
      host.addEventListener('click', function (e) { e.stopPropagation(); });
    }
    for (var k = 0; k < 4; k++) drop(20 + Math.random() * (W - 40) | 0, 10 + Math.random() * (H - 20) | 0, 4, 30);
    watch(canvas);
    var nextDrop = 0;
    (function frame(now) {
      if (!canvas.isConnected) return;
      if (shouldDraw(canvas)) {
        if (now > nextDrop) { drop(10 + Math.random() * (W - 20) | 0, 6 + Math.random() * (H - 12) | 0, 4, 30); nextDrop = now + 900; }
        step(); render();
      }
      requestAnimationFrame(frame);
    })(performance.now());
  }

  /* ---------- Readiness meter (hammadtherealtor.ca sample report) ---------- */
  function mountGauge(root) {
    var arc = root.querySelector('.lg-arc'), num = root.querySelector('.lg-num');
    if (!arc || !num) return;
    var C = 307.88, END = 82, target = C * (1 - END / 100);
    if (reduce) { arc.style.strokeDashoffset = target; num.textContent = END; return; }
    var box = root.querySelector('.live__gauge'), t0 = null, LOOP = 7000, FILL = 1600;
    watch(box);
    // Ease matches the site's cubic-bezier(.25,.8,.25,1) closely enough for a thumbnail
    function ease(k) { return 1 - Math.pow(1 - k, 3); }
    (function frame(now) {
      if (!box.isConnected) return;
      if (!shouldDraw(box)) { t0 = null; }
      else {
        if (t0 === null) t0 = now;
        var t = (now - t0) % LOOP, k, a = 1;
        if (t < FILL) k = ease(t / FILL);
        else if (t < LOOP - 500) k = 1;
        else { k = 1; a = 1 - (t - (LOOP - 500)) / 500; }
        arc.style.strokeDashoffset = (C - (C - target) * k).toFixed(2);
        arc.style.opacity = a; num.style.opacity = Math.max(a, 0.35);
        num.textContent = Math.round(END * k);
      }
      requestAnimationFrame(frame);
    })(performance.now());
  }

  function mount(node, interactive) {
    if (node.__mounted) return; node.__mounted = true;
    if (node.classList.contains('live--areas')) mountPlane(node);
    if (node.classList.contains('live--gauge')) mountGauge(node);
    var cv = node.querySelector('canvas.live__globe-cv');
    if (cv) mountGlobe(cv, interactive);
    var wv = node.querySelector('canvas.live__water-cv');
    if (wv) mountWater(wv, interactive);
    // Beaver on the dam: tap to slap its tail, like on castoreumcanada.ca
    var chewer = interactive && node.querySelector('.live__scene .chewer');
    if (chewer) {
      chewer.addEventListener('click', function (e) {
        e.stopPropagation();
        chewer.classList.remove('slap'); chewer.getBoundingClientRect(); chewer.classList.add('slap');
      });
      chewer.addEventListener('animationend', function () { chewer.classList.remove('slap'); });
    }
  }
  window.LiveThumbs = { mount: mount };
  Array.prototype.forEach.call(document.querySelectorAll('.live'), function (n) { mount(n, false); });
})();
