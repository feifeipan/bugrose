<script>
var supportsOrientationChange = "onorientationchange" in window,
orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
window.addEventListener(orientationEvent, function() {
  that._scr = $.os.orientation();
  if(that._scr.length === that._orient) return false;
  that._orient = that._scr.length;
}, false);
</script>