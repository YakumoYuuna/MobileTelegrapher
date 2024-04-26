<!-- <template>
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
</style> -->

<template>
    <div>
      <h1>REST Countries API Demo</h1>
      <ul>
        <li v-for="country in countries" :key="country.alpha3Code">
          {{ country.name }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        countries: [],
      };
    },
    mounted() {
      this.fetchCountries();
    },
    methods: {
      async fetchCountries() {
        try {
          const response = await axios.get('https://restcountries.com/v3.1/all');
          this.countries = response.data;
        } catch (error) {
          console.error('Failed to fetch countries', error);
        }
      },
    },
  };
  </script>
  
  <style>
  /* 可选的样式 */
  </style>
  