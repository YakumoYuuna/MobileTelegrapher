<template>
    <div class="g-content">
        <qrcode @success="scanResult"></qrcode >
    </div>
</template>

<script>
    import qrcode from '@/components/qrcode/qrcode.vue';
    
    export default {
        name: 'scan',
        components:{
            qrcode
        },
        data(){
            return{
                
            }
        },
        created() {

        },
        methods : {
            scanResult(text) {
                // 成功回调，具体业务自己实现
                this.$store.commit('setScanResult', text);
                this.$router.go(-1);
            }
        }
    }
</script>

<style lang="less" scoped>
</style>