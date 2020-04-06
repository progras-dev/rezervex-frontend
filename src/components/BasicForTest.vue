<template>
  <div id="main-div" class="container mt50">
    <p class="custom-p">Content</p>
    <p class="another-p">Another paragraph</p>
    <p class="empty-p"></p>
    <p class="hidden-p" v-show="showP"></p>
    <p class="name-p"></p>

    <form action="">
      <input type="radio" id="male" name="gender" value="male" v-model="gender"> Male<br>
      <input type="radio" name="gender" value="female" v-model="gender"> Female<br>
      <input type="radio" name="gender" value="other" v-model="gender"> Other
    </form>

    <button id="test-setmethod" class="btn" @click="clickMethod"></button>

    <select v-model="selected">
      <option disabled value="">Please select one</option>
      <option>A</option>
      <option>B</option>
      <option>C</option>
    </select>

    <input type="text" v-model="message">

    <div class="text-container" ref="container">cowabonga</div>

    <input id="email-input" type="email" v-model="email" @blur="email = email.toUpperCase()">

  </div>
</template>

<script>
  export default {
    name: 'basicForTest',
    props: ['show', 'type'],
    data() {
      return {
        showP: false,
        gender: '',
        name: '',
        selected: '',
        message: '',
        email: ''
      }
    },
    methods: {
      clickMethod() {
        console.log('the button has been clicked')
      }
    }
  }
</script>
