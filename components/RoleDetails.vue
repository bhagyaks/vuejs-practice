<template>
<v-container fluid>
    <v-card
        class="ma-5 pa-5 align-end text--secondary"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)">
        <p class="font-weight-bold pb-2">Role Details</p>
        <v-form id="role-form">
        <v-row>
        <v-col class="pt-0" cols="12" sm="6">
            <p class="body-2">Role Designation</p>
            <v-text-field single-line outlined dense :rules="[val => (val || '').length >0 || 'This field is required']" v-model="form.fields.designation"></v-text-field>
        </v-col>
        <v-col class="pt-0" cols="12" sm="6">
            <p class="body-2">Role Level</p>
            <v-select outlined :items="roleLevels" dense v-model="form.fields.level"></v-select>
        </v-col>
        <v-col class="pt-0" cols="12" sm="6">
            <p class="body-2">Role Type</p>
            <v-select :items="roleTypes" outlined dense v-model="form.fields.roleType"></v-select>
        </v-col>
        <v-col class="pt-0" cols="12" sm="6">
            <p class="body-2">Function</p>
            <v-autocomplete
              v-model="form.fields.selectedData"
              :items="functionData"
              chips
              item-text="name"
              item-value="name"
              outlined
              multiple
              dense
            >
            <!-- chip selection -->
              <template v-slot:selection="data">
                <v-chip
                  v-bind="data.attrs"
                  :input-value="data.selected"
                  close
                  @click="data.select"
                  @click:close="remove(data.item)"
                >
                  {{ data.item.name }}
                </v-chip>
              </template>
              <template v-slot:item="data">
                <template>
                  <v-list-item-content>
                    <v-list-item-title v-text="data.item.name"></v-list-item-title>
                  </v-list-item-content>
                </template>
              </template>
            </v-autocomplete>
        </v-col>
        <v-col class="pt-0" cols="12" sm="6">
            <p class="body-2">Corporate Division/Entity</p>
            <v-select :items="division" autocomplete clearable outlined dense v-model="form.fields.coDivision">
            </v-select>
        </v-col>
        <v-col class="pt-0" cols="12" sm="6">
            <p class="body-2">Department</p>
            <v-text-field single-line outlined dense v-model="form.fields.depart"></v-text-field>
        </v-col>
        <v-col class="pt-0" cols="12" sm="6">
            <p class="body-2">Reporting Manager</p>
            <v-text-field single-line outlined dense v-model="form.fields.manager"></v-text-field>
        </v-col>
        <v-col class="pt-0" cols="12" sm="6">
            <p class="body-2">Location</p>
            <v-text-field single-line outlined dense v-model="form.fields.location"></v-text-field>
        </v-col>
        <v-col class="pt-0" cols="12" sm="6">
            <p class="body-2">Minimum Experience Required</p>
            <v-text-field type="number" min="1" single-line outlined dense v-model="form.fields.minExperience"></v-text-field>
        </v-col>
        <v-col class="pt-0" cols="12" sm="6">
            <p class="body-2">Target Start Date</p>
            <v-text-field
             outlined 
             type="date" 
             id="target-date" 
             name="target-date" 
             :disabled="startCheckbox" 
             v-model="form.fields.compTargetDate"
             maxlength="5"
             dense>
            </v-text-field>
            <v-row>
              <v-col class="pt-0">
              <v-checkbox
             dense
             v-model="startCheckbox"
             label="start Immediately"
             @change="updateDate(startCheckbox)">
            </v-checkbox>
              </v-col>
            </v-row>
        </v-col>
        <v-col class="pt-0" cols="12" sm="6">
            <p class="body-2">Working Hours</p>
            <v-select
              v-bind:items="workingHrs"
              outlined dense
              @change="changeWorkingHrs" v-model="form.fields.workingHr">
            </v-select>
            <v-row v-if="enableOtherHrs">
              <v-col cols="5" class="pr-0">
                    <v-text-field type="time" id="start-time" outlined name="start-time" dense
                      v-model="form.fields.startHrs" :error-messages="hourErrors" :rules="[val => (val || '').length >0 || 'This field is required']">
                    </v-text-field>
                </v-col>
                <v-col cols="2">
                    <p class="body-2 mb-0 text-center">to</p></v-col>
                <v-col cols="5" class="pl-0">
                    <v-text-field type="time" id="end-time" outlined name="end-time" dense
                      v-model="form.fields.endHrs" :error-messages="hourErrors" :rules="[val => (val || '').length >0 || 'This field is required']">
                    </v-text-field>
                </v-col>
            </v-row>
        </v-col>
        <v-col class="pt-0" cols="12" sm="6">
            <p class="body-2">Working Days</p>
            <v-select
             :items="workingDays"
             outlined dense
             @change="changeWorkingDays" v-model="form.fields.workingDay">
            </v-select>
            <div v-if="enableOtherDays">
            <v-text-field
            single-line
            outlined
            label="Other Working Days"
            dense
            :rules="[val => (val || '').length >0 || 'This field is required']"
            v-model="form.fields.otherDay"
            ></v-text-field>
            </div>
        </v-col>
        <v-col class="pt-0" cols="12" sm="6">
            <p class="body-2">Any mandatory requirement for the role</p>
            <v-textarea
             outlined
             auto-grow
             rows="1"
             row-height="15"
             v-model="form.fields.roleNote"
            ></v-textarea>
        </v-col>
        </v-row>
        </v-form>
      </v-card>
</v-container>
</template>
<script>
export default {
    data: () => ({
      form: {
        valid: false,
        fields : {
          designation: '',
          level: '',
          roleType: '',
          coDivision: [],
          selectedData: [],
          depart: '',
          manager: '',
          location: '',
          minExperience: '',
          compTargetDate: null,
          workingHr: '',
          startHrs: '',
          endHrs: '',
          workingHr: '',
          workingDay: '',
          otherDay: '',
          roleNote: '',
        }
      },
      roleLevels: ['Entry', 'Mid', 'Senior'],
      roleTypes: ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Graduates', 'Internship'],
      workingHrs: ['7.00 am - 4.00 pm', '8.00 am - 5.00 pm', '9.00 am - 6.00 pm', 'Other'],
      workingDays: ['Sunday - Thursday', 'Saturday - Thursday', 'Other'],
      division: ['Alabama','Alaska','American Samoa','Arizona',
          'Arkansas','California','Colorado','Connecticut',
          'Delaware','District of Columbia','Federated States of Micronesia',
          'Florida','Georgia','Guam','Hawaii','Idaho',
          'Illinois','Indiana','Iowa','Kansas','Kentucky',
          'Louisiana','Maine','Marshall Islands','Maryland',
          'Massachusetts','Michigan','Minnesota','Mississippi',
          'Missouri','Montana','Nebraska','Nevada',
          'New Hampshire','New Jersey','New Mexico','New York',
          'North Carolina','North Dakota','Northern Mariana Islands','Ohio',
          'Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico',
          'Rhode Island','South Carolina','South Dakota','Tennessee',
          'Texas','Utah','Vermont','Virgin Island','Virginia',
          'Washington','West Virginia','Wisconsin','Wyoming'],
        isUpdating: false,
        startCheckbox: false,
        enableOtherDays: false,
        enableOtherHrs: false,
        functionData: [
          { name: 'Catering service'},
          { name: 'Design'},
          { name: 'Finance/ Controlling'},
          { name: 'E-mobility'},
          { name: 'Planning'},
        ],
    }),
    computed: {
      hourErrors () {
        const error = [];
        if(this.form.fields.startHrs && this.form.fields.endHrs && this.form.fields.startHrs > this.form.fields.endHrs) {
          error.push('Invalid working hours');
        }
        return error;
      }
    },
    watch: {
      isUpdating (val) {
        if (val) {
          setTimeout(() => (this.isUpdating = false), 3000)
        }
      },
    },
    methods: {
      remove (item) {
        const index = this.form.fields.selectedData.indexOf(item.name)
        if (index >= 0) this.form.fields.selectedData.splice(index, 1)
      },
      updateDate (checkbox) {
        this.form.fields.compTargetDate = checkbox ? null : this.form.fields.compTargetDate;
      },
      changeWorkingDays(e) {
        this.enableOtherDays = e === 'Other' ? true : false; 
      },
      changeWorkingHrs(e) {
        this.enableOtherHrs = e === 'Other' ? true : false; 
        this.form.fields.endHrs = this.form.fields.startHrs = '';
      },
    }
}
</script>