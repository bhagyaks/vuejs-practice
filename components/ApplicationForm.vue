<template>
  <v-container fluid>
    <v-layout class="mb-5 align-center justify-center">
      <h2 class="mt-5">Application Form</h2>
    </v-layout>
    <v-col class="pb-10">
     <v-btn class="float-right pa-5"
      color="primary"
      @click="add"
    >
      <v-icon left>
        mdi-plus
      </v-icon>
      Add New Field
    </v-btn>
    </v-col>
    <draggable v-model="draggableCards">
      <template v-for="(person,index) in getPersonArray">
        <v-form ref="form" v-model="valid" lazy-validation :key="index">
        <v-card class="ma-5 pa-5 align-end text--secondary">
          <v-row>
          <v-col cols="12" sm="8">
            <v-row>
              <v-col cols="12" class="pt-0" sm="6">
                <p class="font-weight-bold pb-2">Field Name</p>
                <v-text-field outlined dense v-if="person.primary" disabled :value="person.title"></v-text-field>
                <template v-else>
                <v-text-field outlined dense v-model="person.title" :key="index" :rules="[v => !!v || '* Field is required']" required>
                </v-text-field>
                </template>
              </v-col>
              <v-col cols="12" class="pt-0" sm="6">
                <p class="font-weight-bold pb-2">Field Type</p>
              <v-select
                :items="fieldType"
                dense
                outlined
                v-model="person.selectedFieldType"
                :rules="[v => !!v || '* Field is required']"
                required
              ></v-select>
              </v-col>
            </v-row>
            <template v-if="person.selectedFieldType === 'DropDown' || person.selectedFieldType === 'Radio'">
            <div v-for="(option,i) in person.options" :key="i">
                <p class="font-weight-bold pb-2">Option {{i+1}}</p>
              <v-row>
              <v-col cols="12" sm="6">
              <v-text-field v-model="option.value" outlined dense :rules="[v => !!v || '* Field is required']" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" class="pa-0">
               <v-btn @click="removeOption(index,i)" class="error float-right">Remove</v-btn>
              </v-col>
              </v-row>
            </div>
              <v-btn
                color="primary"
                @click="addOption(index)"
              >
              <v-icon left>mdi-plus</v-icon>
              Add Option
              </v-btn>
            </template>
            <v-switch v-model="person.required" label="Required" @change="changePerson(person)" class="ml-5"></v-switch>
            <v-switch v-model="person.hide" label="Hide" @change="changePerson(person)" class="ml-5"></v-switch>
          </v-col>
          <v-col cols="12" sm="4">
            <v-btn @click="remove(index)" class="error ma-5 float-right" v-if="!person.primary">delete</v-btn>
          </v-col>
          </v-row>
        </v-card>
          </v-form>
      </template>
    </draggable>
    <div>
        <v-btn type="submit" @click="saveDetails" color="success" class="ml-5 mb-5">Submit</v-btn>
    </div>
  </v-container>
</template>

<script>
import draggable from "vuedraggable";
export default {
  components: {
    draggable,
  },
  data: () => ({
      valid: true,
      personArray: [
                    {
                        title: "First Name",
                        required: true,
                        hide: false,
                        primary: true,
                        selectedFieldType: '',
                        options: [{
                          value: '',
                        }]
                    },
                    {
                        title: "Middle Name",
                        required: true,
                        hide: false,
                        primary: true,
                        selectedFieldType: '',
                        options: [{
                          value: '',
                        }]
                    },
                    {
                        title: "Last Name",
                        required: true,
                        hide: false,
                        primary: true,
                        selectedFieldType: '',
                        options: [{
                          value: '',
                        }]
                    },
                    {
                        title: "BirthDate",
                        required: true,
                        hide: false,
                        primary: true,
                        selectedFieldType: '',
                        options: [{
                          value: '',
                        }]
                    },
                    {
                        title: "Email",
                        required: true,
                        hide: false,
                        primary: true,
                        selectedFieldType: '',
                        options: [{
                          value: '',
                        }]
                    },
                    {
                        title: "Contact No",
                        required: true,
                        hide: false,
                        primary: true,
                        selectedFieldType: '',
                        options: [{
                          value: '',
                        }]
                    },
                    {
                        title: "Address",
                        required: true,
                        hide: false,
                        primary: true,
                        selectedFieldType: '',
                        options: [{
                          value: '',
                        }]
                    },
                ],
      fieldType: ['Text', 'Text Area', 'Number', 'Date - DD/MM/YYYY' , 'Date - MM/YYYY' , 'Email' , 'Phone Number', 'File Upload', 'DropDown', 'Radio'],
  }),
  computed: {
      valueString() {
          return this.personArray
      },
      getPersonArray(){
          return this.personArray;
      },
    draggableCards: {
      get() {
        return this.personArray;
      },
      set(val) {
        this.personArray  = val;
      }
    }
  },
  methods: {
    changePerson(person) {
        const index= this.personArray.findIndex( item => item.title === person.title);
        Object.assign(this.personArray[index], person);
    },
    saveDetails() {
      let validForm = 0;
      let formIndex = this.$refs.form.length-1
      while(formIndex >= 0) {
      if(!this.$refs.form[formIndex].validate()) {
        validForm++;
      }
      formIndex--;
      }
      if(validForm === 0) {
      this.personArray.forEach(person =>{
        if(person.selectedFieldType && (person.selectedFieldType != 'DropDown' && person.selectedFieldType != 'Radio')){
          if(person.options) {
          delete person.options;
          }
        }
      });
      this.personArray.forEach((obj,index) =>{
        obj.order = index+1;
      });
      console.log(JSON.stringify(this.personArray, null, 2));
      alert('success')
      this.$axios.$post('http://localhost:7900/configurations/new', {
        name: 'applicationForm',
        configurations: this.personArray
      })
      .then(response => {
        console.log(response);
        //since not navigating to next page
        this.removeNotPrimary();
      });
      }
  },
  removeNotPrimary() {
    var index = this.personArray.length -1;
    while(index >=0) {
      this.$refs.form[index].resetValidation();
      if(this.personArray[index] && !this.personArray[index].primary) {
        this.remove(index);
      }
      index--;
    }
    this.personArray.forEach((person) => {
        person.selectedFieldType = '';
        person.options=[];
        person.required = true;
        person.hide = false;
      });
    // console.log('after removing not primary', JSON.stringify(this.personArray,null,2));
  },
  add() {
    this.personArray.push({
      title: '',
      required: true,
      hide: false,
      primary: false,
      selectedFieldType: '',
      options:[{
        value: '',
      }],
    })
    this.$refs.form[this.$refs.form.length -1].$el.scrollIntoView({behavior: 'smooth',
    position: 'center'});
  },
  addOption(index) {
    if(this.personArray[index] && (this.personArray[index].selectedFieldType === 'DropDown' ||
    this.personArray[index].selectedFieldType === 'Radio')) {
        this.personArray[index].options.push({
          value: '',
        })
    }
  },
  remove (index) {
         this.personArray.splice(index, 1)
     },
  removeOption (pos,index) {
    if(this.personArray[pos].selectedFieldType && this.personArray[pos].options) {
    if((this.personArray[pos].selectedFieldType !== 'Radio' && this.personArray[pos].selectedFieldType !== 'DropDown') ||
    (((this.personArray[pos].selectedFieldType === 'Radio' || this.personArray[pos].selectedFieldType === 'DropDown') &&
    this.personArray[pos].options.length > 1))) {
    this.personArray[pos].options.splice(index, 1);
    }
    }
  },
  },
};
</script>