<template>
<v-container fluid>
    <v-card
        class="ma-5 pa-5 align-end text--secondary"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)">
    <v-layout class="mb-5">
      <h2 class="mt-5">Candidate Form</h2>
    </v-layout>
        <v-row id="test">
        <template v-for="(person,index) in info">
        <v-col class="pt-0" v-if="!person.hide" :key="index" id="test" cols="12" sm="6">
        <v-col class="pt-0" cols="12" sm="6">
            <v-form ref="form" v-model="valid" lazy-validation>
            <p class="body-2">{{person.title}}</p>
            <v-text-field  v-if="person.selectedFieldType === 'Text'|| person.selectedFieldType === 'Email'"
            single-line outlined dense
            :rules="[person.required ? rules.required : true, person.selectedFieldType === 'Email' ? rules.email : true]"
            v-model="candidate[index].value"></v-text-field>
            <v-text-field  v-if="person.selectedFieldType === 'Phone Number' || person.selectedFieldType === 'Number'"
            single-line outlined dense
            :rules="[person.required ? rules.required : true, person.selectedFieldType === 'Phone Number' ? rules.phoneNumber : true, person.selectedFieldType === 'Number' ? rules.number : true]"
            v-model="candidate[index].value"></v-text-field>
            <v-text-field
             v-if="person.selectedFieldType === 'Date - DD/MM/YYYY'"
             outlined 
             type="date" 
             id="target-date" 
             name="target-date" 
             v-model="candidate[index].value"
             maxlength="5"
             :rules="[person.required ? rules.required: true]"
             dense>
            </v-text-field>
            <v-textarea
                v-if="person.selectedFieldType === 'Text Area'"
                outlined
                dense
                :rules="[person.required ? rules.required: true]"
                v-model="candidate[index].value"
            ></v-textarea>
            <v-file-input multiple v-if="person.selectedFieldType === 'File Upload'" outlined placeholder="Please Upload" dense v-model="candidate[index].value" :rules="[person.required ? rules.required: true]"></v-file-input>
            <v-radio-group v-if="person.selectedFieldType === 'Radio'" v-model="candidate[index].value" row :rules="[person.required ? rules.required: true]">
            <v-radio
                v-for="(opt, index) in person.options"
                :key="index"
                :label="opt.value"
                :value="opt.value"
            ></v-radio>
            </v-radio-group>
            <v-select v-if="person.selectedFieldType === 'DropDown'" :items="person.options" item-text="value"
            outlined dense v-model="candidate[index].value" :rules="[person.required ? rules.required: true]"></v-select>
            <template v-if="person.selectedFieldType === 'Date - MM/YYYY'">
                <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :return-value.sync="date"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="candidate[index].value"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
            outlined
            dense
            :rules="[person.required ? rules.required: true]"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="candidate[index].value"
          type="month"
          no-title
          scrollable
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="menu = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="saveDate(candidate[index].value)"
          >
            OK
          </v-btn>
        </v-date-picker>
                </v-menu>
            </template>
            </v-form>
        </v-col>
        </v-col>
        </template>
        </v-row>
    </v-card>
    <div>
        <v-btn type="submit" @click="submitData" color="success" class="ml-5 mb-5" :disabled="!valid">Submit</v-btn>
    </div>
</v-container>
</template>
<script>
export default {
    data: () => ({
        menu: false,
        date: new Date().toISOString().substr(0, 7),
        modal: false,
        info: null,
        valid: true,
        name: '',
        date: '',
        rules: {
        required: val => (val || '').length >0 || '* Field is required',
        email: val => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(val) || '* Invalid e-mail.'
        },
        phoneNumber: val => {
            const pattern = /^\d{10}$/
            return pattern.test(val) || '* Invalid phone number.'
        },
        number: val => {
            const pattern = /^\d+$/
            return pattern.test(val) || '* Must be a number.'
        },
        },
        candidate: []
    }),
    mounted(){
        this.$axios.get('http://localhost:7900/configurations/all').then(
            response => {
                this.info = response.data[0].configurations;
                this.candidateField(this.info);
                })
    },
    methods: {
        candidateField(info) {
            info.forEach(element => {
                this.candidate.push({
                    key:element.title,
                    value:element.selectedFieldType === 'File Upload' ? [] : ''})
            });
        },
        saveDate(date) {
            this.$refs.menu[0].save(date);
        },
        submitData() {
            let validForm = 0;
            let formIndex = this.$refs.form.length-1
            while(formIndex >= 0) {
            if(!this.$refs.form[formIndex].validate()) {
                validForm++;
            }
            formIndex--;
            }
            if(validForm === 0) {
                var filteredCandidate = this.candidate.filter((ele) => {
                    return (ele.value != '' || ele.value.length != 0) && ele.value != null;
                })
                alert('success')
                console.log(filteredCandidate);
                this.$axios.post('http://localhost:7900/forms/new', {
                    name: 'candidateForm',
                    forms: filteredCandidate,
                }).then((response) => {
                    console.log(response);
                    this.resetField();
                });
            }
        },
        resetField() {
            let formIndex = this.$refs.form.length-1
            while(formIndex >= 0) {
            this.$refs.form[formIndex].reset();
            formIndex--;
            }
        },
    }
}
</script>