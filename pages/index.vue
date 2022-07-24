<template>
  <div>
    <video muted loop id="bgVideo" class="mt-n16" autoplay>
      <source :src="require('~/assets/videos/back.mp4')" type="video/mp4" />
      Your browser does not support HTML5 video.
    </video>
    <v-container
      style="
        position: absolute;
        top: 0;
        z-index: 5;
        padding-top: 15%;
        padding-left: 10%;
      "
    >
      <v-row>
        <v-col cols="12" lg="4" md="6">
          <v-card class="pa-5 mt-5" dark style="opacity: 0.7">
            <v-form v-model="valid" ref="form">
              <h3 class="text-center mb-3">Welcome Back</h3>
              <label for="Email">Your Email</label>
              <v-text-field
                v-model="email"
                background-color="#D2DAE2"
                light
                color="#000000"
                placeholder="example@domain.com"
                solo
                :error-messages="error"
                :rules="[validRules.required, validRules.validEmail]"
              ></v-text-field>
              <label for="Password">Your Password</label>
              <v-text-field
                v-model="password"
                :rules="[validRules.required]"
                background-color="#D2DAE2"
                light
                placeholder="********"
                solo
                :type="show1 ? 'text' : 'password'"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="show1 = !show1"
              ></v-text-field>
              <v-row no-gutters justify="center">
                <v-btn
                  class="mx-auto"
                  color="#3399D1"
                  @click="login"
                  :loading="loading"
                  >Log in</v-btn
                >
              </v-row>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <div class="overlay-dark"></div>
  </div>
</template>
<script>
export default {
  middleware:'auth-check',
  data() {
    return {
      show1: false,
      valid: true,
      validRules: {
        required: (value) => !!value || "Required",
        validEmail: (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      },
      email: "",
      password: "",
      loading: false,
      error:''
    };
  },
  methods: {
    async login() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        try {
          let response = await this.$auth.loginWith("local", {
            data: {
              email: this.email,
              password: this.password,
            },
          });
          console.log(response.data)

          if (response.data.status == "failed") {
            this.error = response.data.msg;
          } else {
            this.$auth.setUser(response.data);
            this.$axios.setToken(this.$auth.$state.user.token, "X-XSRF-TOKEN");
            var role = response.data.role.role;
            
            if (role == "Admin") {
              window.location.href = '/admin'

            } else if (role == "Manager") {
              window.location.href = '/manager'

            } else if (role == "Engineer") {
              window.location.href = '/engineer'
            }
          }

          this.loading = false;
        } catch (err) {
          this.loading = false;
        }
      }
    },
  },
};
</script>

<style>
#bgVideo {
  position: static;
  right: 0;
  bottom: 0;
  width: 100%;
}
.overlay-dark {
  width: 100%;
  height: 100%;
  background-color: #000000;
  position: absolute;
  top: 0;
  opacity: 0.7;
}
</style>