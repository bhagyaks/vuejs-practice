<template>
    <v-app>
      <v-app-bar dark>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-btn icon to="/newRequest">
          <v-icon>mdi-newspaper-plus</v-icon>
        </v-btn>
      </v-app-bar>
      <v-navigation-drawer v-model="drawer"
        absolute
        bottom
        temporary>
        <v-list nav dense>
          <v-list-item-content>
            <v-list-item-title>Recruitment Portal</v-list-item-title>
          </v-list-item-content>
        </v-list>
        <v-divider></v-divider>
        <v-list nav dense>
          <v-list-item-group
            v-model="group">
            <v-list-item
              v-for="item in menuItems"
              :key="item.title"
              :to="item.path">
              <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon></v-list-item-icon>
              {{item.title}}
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      <main>
      <nuxt/>
      </main>
    </v-app>
</template>
<script>
export default {
  data: () => ({
    drawer: false,
    group: null,
    menuItems: [
      {title :'Dashboard', path: '/' , icon : 'mdi-view-dashboard'},
      {title : 'Application Form', path: '/applicationForm', icon: 'mdi-application-edit'},
      {title: 'Candidate Form', path: '/candidateForm', icon: 'mdi-application-edit'}
    ]
  }),
  watch: {
    group() {
      this.drawer = false
    },
  },
  }
</script>
