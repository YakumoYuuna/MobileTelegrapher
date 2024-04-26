<template>
   <!-- <router-view></router-view> -->
    <div class="login-container">
      <van-field v-model="username" label="账号" placeholder="请输入账号" />
      <van-field v-model="password" label="密码" placeholder="请输入密码" type="password" />
      <van-button type="primary" @click="login1">登录</van-button>
    </div>
   
  </template>
  
  <script>
   import { useRouter } from 'vue-router'
  export default {
    data() {
      return {
        username: '123',
        password: '123'
      };
    },
    methods: {
      login1() {
        // const router = useRouter()
        // 登录逻辑，这里暂时只是跳转到 Text2.vue
         this.$router.push({ name: 'ReportWork', params: { userId: 123 } });
        // router.push('/Text2')
        // router.push({ name: 'Text2', params: { username: 'eduardo' } })
        // window.close;
      }
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    padding: 20px;
  }
  </style>
  