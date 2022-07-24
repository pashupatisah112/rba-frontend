<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h3 class="text-center white--text mt-16">You are logged in as Manager</h3>
          <Data  />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
export default {
    middleware:'auth-check'
}
</script>