<template>
    <footer class="footer">
          <div class="footer-body">
              
              <div class="right-panel">
                  ©{{ year }} Made with UBS
                   
              </div>
          </div>
      </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>