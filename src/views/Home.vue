<template>
  <el-card shadow="never" class="full-center">
    <center><h1>Авторизация</h1>
    <el-input placeholder="E-Mail" v-model="loginForm.email" style="margin-bottom: 10px; width: 400px;"></el-input><br>
    <el-input placeholder="Пароль" v-model="loginForm.password" style="margin-bottom: 10px; width: 400px;"></el-input><br>  
    <el-button type="primary">Войти</el-button>
    <el-button type="danger">Забыли пароль?</el-button></center>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        email: "",
        password: "",
        session: ""
      }
    }
  }
}
</script>
