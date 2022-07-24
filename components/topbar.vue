<template>
<div>
    <v-app-bar color="transparent" flat absolute dark>
        <v-img :src="require('~/assets/logo.png')" max-width="100" class="mt-5"></v-img>
        <v-spacer></v-spacer>
        <div class="hidden-md-and-down">
            <v-btn text dark>
                Home
            </v-btn>
            <v-btn text dark>
                About Us
            </v-btn>
            <v-btn text dark>
                Projects
            </v-btn>
            <v-btn text dark>
                Offers
            </v-btn>
            <v-btn text dark>
                Contacts
            </v-btn>
            <v-btn dark color="#3399D1" v-if="$auth.loggedIn" @click="logout()" :loading="loading">
                Logout
            </v-btn>
        </div>

        <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="hidden-lg-and-up"></v-app-bar-nav-icon>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app absolute temporary>
        <v-list nav dense>
            <v-list-item v-for="(item,i) in items" :key="i" @click="$store.commit('utility/changeRoute',item.link)">
                <v-list-item-title>
                    {{item.title}}
                </v-list-item-title>
            </v-list-item>
        </v-list>

    </v-navigation-drawer>
</div>
</template>

<script>
export default {
    data() {
        return {
            drawer: false,
            options: {
                duration: 300,
                offset: 0,
                easing: 'easeInOutCubic'

            },
            loading:false,
            items: [{
                    title: 'Home',
                    link: '/'
                },
                {
                    title: 'About Us',
                    link: '/'
                },
                {
                    title: 'Projects',
                    link: '/'
                },
                {
                    title: 'Offers',
                    link: '/'
                },
                {
                    title: 'Contact Us',
                    link: '/'
                },
            ]
        }
    },
    methods:{
        async logout(){
            this.loading=true
            await this.$auth.logout()
            window.location.href = '/'
            this.loading=false
                        
        }
    }
}
</script>
