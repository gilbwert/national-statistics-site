// Nusantara in Numbers — drawing helpers.
// Small dependency-free SVG charts plus the number formatting the whole
// site shares. Everything returns strings; main.js drops them into pages.
window.NUSA_CHARTS = (function () {
  'use strict';

  // Format a value with a fixed number of decimals and thousands separators.
  function fmt(value, decimals) {
    var fixed = Number(value).toFixed(decimals);
    var parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  // Signed change between the last two values of a series, e.g. "+0.31".
  function deltaText(values, decimals) {
    var d = values[values.length - 1] - values[values.length - 2];
    var sign = d > 0 ? '+' : d < 0 ? '-' : '';
    return sign + fmt(Math.abs(d), decimals);
  }

  function esc(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // A labelled line chart with a soft area fill, end-point dot, min/max
  // gridlines and year ticks. `opts` may set height and whether the value
  // axis should start at zero (bars of magnitude) or hug the data (rates).
  function lineChart(years, values, opts) {
    opts = opts || {};
    var w = 720, h = opts.height || 260;
    var padL = 52, padR = 16, padT = 14, padB = 28;
    var min = Math.min.apply(null, values), max = Math.max.apply(null, values);
    if (opts.zero) min = Math.min(0, min);
    var span = max - min || 1;
    min -= span * 0.12; max += span * 0.12;
    if (opts.zero && min < 0) min = Math.min.apply(null, values) * 1.15;
    var iw = w - padL - padR, ih = h - padT - padB;
    function x(i) { return padL + (iw * i) / (values.length - 1); }
    function y(v) { return padT + ih - ((v - min) / (max - min)) * ih; }

    var pts = values.map(function (v, i) { return x(i).toFixed(1) + ',' + y(v).toFixed(1); });
    var area = 'M' + pts.join(' L') + ' L' + x(values.length - 1).toFixed(1) + ',' + (padT + ih) + ' L' + x(0).toFixed(1) + ',' + (padT + ih) + ' Z';

    var grid = '';
    [0, 0.5, 1].forEach(function (f) {
      var gv = min + (max - min) * f, gy = y(gv);
      grid += '<line x1="' + padL + '" y1="' + gy + '" x2="' + (w - padR) + '" y2="' + gy + '" class="grid"/>' +
        '<text x="' + (padL - 8) + '" y="' + (gy + 4) + '" class="axis" text-anchor="end">' + fmt(gv, opts.decimals || 0) + '</text>';
    });
    if (min < 0 && max > 0) {
      grid += '<line x1="' + padL + '" y1="' + y(0) + '" x2="' + (w - padR) + '" y2="' + y(0) + '" class="zero"/>';
    }
    var ticks = '';
    years.forEach(function (yr, i) {
      if (i % 2 === 0 || i === years.length - 1) {
        ticks += '<text x="' + x(i) + '" y="' + (h - 8) + '" class="axis" text-anchor="middle">' + yr + '</text>';
      }
    });
    var dots = values.map(function (v, i) {
      return '<circle cx="' + x(i) + '" cy="' + y(v) + '" r="' + (i === values.length - 1 ? 4.5 : 2.5) + '" class="' + (i === values.length - 1 ? 'dot-last' : 'dot') + '"><title>' + years[i] + ': ' + fmt(v, opts.decimals || 0) + '</title></circle>';
    }).join('');

    return '<svg viewBox="0 0 ' + w + ' ' + h + '" class="chart" role="img" aria-label="' + esc(opts.label || 'line chart') + '">' +
      '<path d="' + area + '" class="area"/><path d="M' + pts.join(' L') + '" class="line"/>' +
      grid + ticks + dots + '</svg>';
  }

  // A horizontal comparison bar: one value against a reference marker
  // (used on province pages against the national figure).
  function compareBar(label, value, reference, max, decimals, unit) {
    var pct = Math.max(2, Math.min(100, (value / max) * 100));
    var refPct = Math.max(0, Math.min(100, (reference / max) * 100));
    return '<div class="cmp"><div class="cmp-head"><span>' + esc(label) + '</span>' +
      '<strong>' + fmt(value, decimals) + ' ' + esc(unit) + '</strong></div>' +
      '<div class="cmp-track"><div class="cmp-fill" style="width:' + pct.toFixed(1) + '%"></div>' +
      '<div class="cmp-ref" style="left:' + refPct.toFixed(1) + '%" title="National: ' + fmt(reference, decimals) + '"></div></div>' +
      '<div class="cmp-note">National figure: ' + fmt(reference, decimals) + ' ' + esc(unit) + '</div></div>';
  }

  return { fmt: fmt, deltaText: deltaText, esc: esc, lineChart: lineChart, compareBar: compareBar };
})();
