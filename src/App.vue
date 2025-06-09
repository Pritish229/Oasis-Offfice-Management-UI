<script setup>
import { onMounted } from 'vue'

function loadScriptOnce(src) {
  const script = document.createElement('script')
  script.src = src
  script.async = false
  document.body.appendChild(script)
}

onMounted(() => {
  // Load in order
  loadScriptOnce('/assets/js/core/libs.min.js')
  loadScriptOnce('/assets/js/core/external.min.js')
  loadScriptOnce('/assets/js/charts/widgetcharts.js')
  loadScriptOnce('/assets/js/charts/vectore-chart.js')
  loadScriptOnce('/assets/js/charts/dashboard.js')
  loadScriptOnce('/assets/js/plugins/fslightbox.js')
  loadScriptOnce('/assets/js/plugins/setting.js') // important
  loadScriptOnce('/assets/js/plugins/slider-tabs.js')
  loadScriptOnce('/assets/js/plugins/form-wizard.js')
  loadScriptOnce('/assets/vendor/aos/dist/aos.js')
  loadScriptOnce('/assets/js/hope-ui.js')
})
</script>