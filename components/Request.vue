<template>
    <v-app>
    <v-card max-width="100%" color="rgba(0,0,0,.06)">
      <v-form data-app>
      <v-row dense>
        <v-col cols="6">
          <RoleDetails ref="roleDetails"/>
        </v-col>
        <v-col cols="6">
          <CandidatePreference ref="candidatePreference"/>
        </v-col>
      </v-row>
      </v-form>
      <div class="my-2 mx-10 float-right pr-20">
        <v-btn type="submit" @click="saveDetails" color="success">
              Submit
        </v-btn>
    </div>
    </v-card>
</v-app>
</template>
<script>
import CandidatePreference from '~/components/CandidatePreference.vue'
import RoleDetails from '~/components/RoleDetails.vue'
  export default {
  components: { RoleDetails, CandidatePreference },
  methods: {
      saveDetails(e){
        const candidate = this.$refs.candidatePreference && this.$refs.candidatePreference.$data && this.$refs.candidatePreference.$data.form.fields;
        const role = this.$refs.roleDetails && this.$refs.roleDetails.$data && this.$refs.roleDetails.$data.form.fields;
        console.log('candidate', candidate);
        console.log('role', role);
      },
  },
  }
</script>