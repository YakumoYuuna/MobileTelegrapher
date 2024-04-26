<template>
    <div>
      <button @click="startScan">Start Scan</button>
      <div id="reader" style="width: 300px; height: 300px;"></div>
      <p v-if="scannedResult">Scanned Result: {{ scannedResult }}</p>
    </div>
  </template>
  
  <script>
  import { Html5QrcodeScanner } from 'html5-qrcode';
  
  export default {
    data() {
      return {
        scannedResult: ''
      };
    },
    methods: {
      startScan() {
        const html5QrcodeScanner = new Html5QrcodeScanner(
          'reader', { fps: 10, qrbox: 250 }
        );
        
        html5QrcodeScanner.render(this.onScanSuccess.bind(this));
      },
      onScanSuccess(qrCodeMessage) {
        this.scannedResult = qrCodeMessage;
      }
    },
    beforeUnmount() {
      // 在组件销毁前停止扫描
      Html5QrcodeScanner.release();
    }
  };
  </script>
  
  <style>
  /* Add any necessary styles */
  </style>
  