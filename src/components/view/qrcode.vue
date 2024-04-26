<template>
    <div id="qrcode-reader" style="width: 100%;"></div>
</template>

<script>
    import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode"
    
    export default {
        components:{

        },
        data(){
            return{
                html5Qrcode: null
            }
        },
        created() {
        
        },
        mounted() {
            this.initScan();
            this.startScan();
        },
        beforeDestroy() {
            let state = this.html5QrCode.getState();
            if (state == Html5QrcodeScannerState.SCANNING) {
                this.stopScan();
            }
        },
        methods : {
            // 初始化扫码控件
            initScan() {
                this.html5QrCode = new Html5Qrcode("qrcode-reader");
            },
            // 开始扫码
            startScan() {
                let that = this;
                // 设置宽度为最小边的百分之64%
                let qrboxFunction = function(viewfinderWidth, viewfinderHeight) {
                    let minEdgePercentage = 0.64; // 64%
                    let minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
                    let qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
                    return {
                        width: qrboxSize,
                        height: qrboxSize
                    };
                }
                const config = { fps: 10, qrbox: qrboxFunction };
                const qrCodeSuccessCallback = (decodedText, decodedResult) => {
                    that.stopScan(decodedText);
                };
                const qrCodeErrorCallback = (errorMessage, error) => {
                    
                };
                this.html5QrCode.start(
                    { 
                        facingMode: { exact: "environment"} 
                    }, 
                    config, 
                    qrCodeSuccessCallback, 
                    qrCodeErrorCallback
                )
                .catch((err) => {
                    var errMsg = '';
                    if (err.indexOf('NotAllowedError') != -1) {
                        errMsg = 'ERROR: 您需要授予相机访问权限';
                    } else if (err.indexOf('NotFoundError') != -1) {
                        errMsg = 'ERROR: 这个设备上没有摄像头';
                    } else if (err.indexOf('NotSupportedError') != -1) {
                        errMsg = 'ERROR: 所需的安全上下文(HTTPS、本地主机)';
                    } else if (err.indexOf('NotReadableError') != -1 )  {
                        errMsg = 'ERROR: 相机被占用';
                    } else if (err.indexOf('OverconstrainedError') != -1) {
                        errMsg = 'ERROR: 安装摄像头不合适';
                    } else if (err.indexOf('StreamApiNotSupportedError') != -1) {
                        errMsg = 'ERROR: 此浏览器不支持流API';
                    } else {
                        errMsg = err;
                    }
                    that.$toast(errMsg);
                });
            },
            stopScan(text) {
                let that = this;
                this.html5QrCode.stop().then((ignore) => {
                  // QR Code scanning is stopped.
                }).catch((err) => {
                  // Stop failed, handle it.
                }).finally(() => {
                    if (!!text) {
                        that.$emit('success', text);
                    }
                });
            }
        }
    }
</script>

<style lang="less" scoped>
    
</style>