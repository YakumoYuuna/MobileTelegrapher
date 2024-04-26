<template>
    <div>
      <div id="qr-code-full-region"></div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      qrbox: {
        type: Number,
        default: 250
      },
      fps: {
        type: Number,
        default: 10
      },
    },
    mounted() {
      this.initScanner();
    },
    methods: {
      initScanner() {
        const config = {
          fps: this.fps,
          qrbox: this.qrbox,
        };
        this.html5QrcodeScanner = new Html5QrcodeScanner('qr-code-full-region', config);
        this.html5QrcodeScanner.render(this.onScanSuccess.bind(this));
      },
      onScanSuccess(decodedText, decodedResult) {
        this.$emit('result', decodedText, decodedResult);
      }
    },
    beforeDestroy() {
      this.html5QrcodeScanner.stop();
    }
  };
  </script>
  
  <style scoped>
  #qr-code-full-region {
    width: 100%;
    height: 100vh; /* 根据需要调整高度 */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  </style>
  