<template>
<v-container fluid>
      <v-card 
        class="ma-5 pa-5 align-end text--secondary"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)">
        <p class="font-weight-bold pb-2">Candidate Preference</p>
        <v-form id="candidate-form">
        <v-row class="mb-2">
        <v-col class="pt-0" cols="12" sm="12">
          <v-row>
            <v-col cols="12" sm="6">
            <p class="body-2">Do you have a Job Description for this Role?</p>
            <v-select outlined :items="jobDesc" @change="fileUploadEnable" dense v-model="form.fields.jobDescription"></v-select>
            </v-col>
            <v-col v-if="isFileUpload">
            <p class="body-2">Upload Job Description</p>
            <v-file-input outlined placeholder="Please Upload the Job Description" dense v-model="form.fields.fileUploaded"></v-file-input>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="pt-0" cols="12" sm="6">
          <div>
            <p class="body-2">Do you require UAE Experience:</p>
            <v-select outlined :items="uaeExp" @change="minExpEnabled" dense v-model="form.fields.uaeExperience"></v-select>
          </div>
            <div v-if="isEnableMinExp">
              <v-select :items="minExp" outlined label="Minimum experience in UAE" dense :rules="[val => (val || '').length >0 || 'This field is required']" v-model="form.fields.minExpUae"></v-select>
            </div>
        </v-col>
        <v-col class="pt-0" cols="12" sm="6">
          <div>
            <p class="body-2">Do you require the experience to be within any specific industry?</p>
            <v-select :items="expRequired" outlined @change="industryEnabled" dense v-model="form.fields.speIndustry"></v-select>
          </div>
          <div v-if="isEnableIndustry">
            <v-text-field outlined single-line label="type industry name" dense :rules="[val => (val || '').length >0 || 'This field is required']" v-model="form.fields.industryNames"></v-text-field>
          </div>
        </v-col>
        <v-col class="pt-0" cols="12" sm="6">
          <div>
            <p class="body-2">Do you require any specific skills?</p>
            <v-select :items="skillsRequired" outlined @change="skillsEnabled" dense v-model="form.fields.speSkill"></v-select>
          </div>
          <div v-if="isEnableSkills">
            <v-autocomplete
              v-model="form.fields.selectedSkills"
              :items="skillsList"
              chips
              item-text="name"
              item-value="name"
              outlined
              multiple
              dense
              :rules="[val => (val || '').length >0 || 'This field is required']"
            >
            <!-- chip selection -->
              <template v-slot:selection="data">
                <v-chip
                  v-bind="data.attrs"
                  :input-value="data.selected"
                  close
                  @click="data.select"
                  @click:close="removeSkills(data.item)"
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
          </div>
        </v-col>
        <v-col class="pt-0" cols="12" sm="6">
            <p class="body-2">Roles & Responsibilities</p>
            <v-text-field outlined single-line dense v-model="form.fields.roles"></v-text-field>
        </v-col>
        <v-col class="pt-0" cols="12" sm="6">
            <p class="body-2">Gender Preferences</p>
            <v-select :items="gender" outlined dense v-model="form.fields.genders"></v-select>
        </v-col>
        <v-col class="pt-0" cols="12" sm="6">
            <p class="body-2">Nationality Preference</p>
            <v-autocomplete
              v-model="form.fields.selectedNation"
              :items="nationality"
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
                  @click:close="removeNation(data.item)"
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
            <p class="body-2">Age preference (in range)</p>
            <v-row>
                <v-col cols="5">
                    <v-text-field type="number" id="min-age" :min="Age1.min1Age" :max="Age1.max1Age" outlined name="min-age" dense
                      v-model="retrieve_Age1" :error-messages="ageValid">
                    </v-text-field>
                </v-col>
                <v-col cols="2">
                    <p class="body-2 mb-0 text-center">to</p></v-col>
                <v-col cols="5">
                    <v-text-field type="number" id="max-age" :max="Age2.max2Age" :min="Age2.min2Age" outlined name="max-age" dense
                      v-model="retrieve_Age2" :error-messages="ageValid">
                    </v-text-field>
                </v-col>
            </v-row>
        </v-col>
        <v-col class="pt-0" cols="12" sm="6">
            <p class="body-2">Language Preference</p>
            <v-autocomplete
              v-model="form.fields.selectedLang"
              :items="language"
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
                  @click:close="removeLang(data.item)"
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
          <div>
            <p class="body-2">Highest Educational Qualification</p>
            <v-select :items="qualification" outlined @change="speEduEnabled" dense v-model="form.fields.education">
            </v-select>
          </div>
          <div v-if="isEnableEdu">
            <v-text-field outlined single-line dense :rules="[val => (val || '').length >0 || 'This field is required']" v-model="form.fields.speEducation"></v-text-field>
          </div>
        </v-col>
        <v-col class="pt-0" cols="12" sm="6">
            <p class="body-2">Is a UAE Driving License Required?</p>
            <v-select :items="license" outlined dense v-model="form.fields.uaeLicense">
            </v-select>
        </v-col>
        <v-col class="pt-0" cols="12" sm="6">
            <p class="body-2">Annual Salary Range</p>
            <v-row>
                <v-col cols="5">
                    <v-text-field type="number" id="min-salary" prefix="USD" outlined name="min-salary" dense
                      :min="sal1.min1Sal" :max="sal1.max1Sal" v-model="retrieve_Sal1" :error-messages="salaryValid">
                    </v-text-field>
                </v-col>
                <v-col cols="2">
                    <p class="body-2 mb-0 text-center">to</p></v-col>
                <v-col cols="5">
                    <v-text-field type="number" id="max-salary" prefix="USD" outlined name="max-salary" dense
                      :min="sal2.min2Sal" :max="sal2.max2Sal" v-model="retrieve_Sal2" :error-messages="salaryValid">
                    </v-text-field>
                </v-col>
            </v-row>
        </v-col>
        <v-col class="pt-0" cols="12" sm="6">
          <div>
            <p class="body-2">Any certification required</p>
            <v-select :items="certification" outlined @change="certEnabled" dense v-model="form.fields.certificate">
            </v-select>
          </div>
          <div v-if="isEnableCert">
            <v-combobox
              v-model="form.fields.selectedCert"
              :hide-no-data="!search"
              :items="certList"
              :search-input.sync="search"
              hide-selected
              multiple
              outlined
              autocomplete
              clearable
              dense
              :rules="[val => (val || '').length >0 || 'This field is required']"
            >
              <template v-slot:no-data >
              <v-list-item  @click="form.fields.selectedCert.push({text:search}), search=''">
                <span class="subheading">Add</span>
                  <v-chip label small>
                    {{ search }}
                  </v-chip>
              </v-list-item>
              </template>
            </v-combobox>
          </div>
        </v-col>
        <v-col class="pt-0" cols="12" sm="6">
            <p class="body-2">Any important notes on this role?</p>
            <v-textarea
             outlined
             auto-grow
             rows="1"
             row-height="15"
             v-model="form.fields.note"
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
        fields: {
          jobDescription : '',
          fileUploaded: [],
          uaeExperience: '',
          minExpUae: '',
          speIndustry: '',
          industryNames: '',
          speSkill: '',
          selectedNation: [],
          selectedLang: [],
          selectedSkills: [],
          roles: '',
          genders: '',
          education: '',
          speEducation: '',
          uaeLicense: '',
          certificate: '',
          selectedCert: [],
          note: '',
          minAge: '',
          maxAge: '',
          minSalary: '',
          maxSalary: '',
        }
      },
      jobDesc: ['Yes', 'No'],
      uaeExp: ['Yes', 'No'],
      expRequired: ['Yes', 'No'],
      skillsRequired: ['Yes', 'No'],
      license: ['Yes', 'No'],
      certification: ['Yes', 'No'],
      gender: ['Male','Female', 'Any'],
      minExp: ['1 year', '2 years', '3 years', '4 years'],
      certList: [],
      search: null,
      isFileUpload: false,
      isEnableMinExp: false,
      isEnableIndustry: false,
      isEnableSkills: false,
      isUpdating: false,
      isEnableEdu: false,
      isEnableCert: false,
      Age1: {
        min1Age : 1,
        max1Age: null,       
      },
      Age2: {
        min2Age : 1,
        max2Age: null,
      },
      sal1: {
        min1Sal : 1,
        max1Sal: null,  
      },
      sal2: {
        min2Sal : 1,
        max2Sal: null,  
      },
      nationality: [
          { name: 'Any'},
          { name: 'Afghan'},
          { name: 'Albhanian'},
          { name: 'Algerian'},
          { name: 'Angolan'},
        ],
      language: [
            { name: 'Afar'},
            { name: 'Arabic'},
        ],
        skillsList: [
            { name: 'javascript'},
            {name: 'vue'},
            {name: 'SEO'},
        ],
      qualification: ['High School', 'Diploma', 'Graduate', 'Masters', 'Specialised Degree'],
    }),
    computed: {
      ageValid() {
        const error = [];
        if(this.form.fields.minAge && this.form.fields.maxAge && (this.form.fields.minAge > this.form.fields.maxAge)){
          error.push('invalid age range')
        }
        return error
      },
      salaryValid() {
        const error = [];
        if(this.form.fields.minSalary && this.form.fields.maxSalary && (this.form.fields.minSalary > this.form.fields.maxSalary)){
          error.push('invalid salary range')
        }
        return error
      },
      retrieve_Age1: {
        get() {
        return this.form.fields.minAge;
        },
        set(val) {
          this.form.fields.minAge = Number(val);
          if(this.Age2.max2Age && this.Age1.max1Age) {
            this.Age1.max1Age = this.minAge <= this.Age2.max2Age ? this.Age2.max2Age : this.form.fields.minAge;
          } else if (this.form.fields.minAge) {
            this.Age2.min2Age = this.form.fields.minAge;
          } else if (!val) {
            this.Age1 = {
              min1Age : 1,
              max1Age : null,
            }
          }
        }
      },
      retrieve_Age2: {
        get() {
          return this.form.fields.maxAge;
        },
        set(val) {
          this.form.fields.maxAge = Number(val);
          if(this.Age1.max1Age && this.Age2.max2Age){
            this.Age2.max2Age = this.form.fields.maxAge >= this.Age1.max1Age ? this.Age1.max1Age : this.form.fields.maxAge;
          } else if (this.form.fields.maxAge) {
            this.Age1.max1Age = this.form.fields.maxAge;
          } else if (!val) {
            this.Age2 = {
              min2Age : 1,
              max2Age : null,
            }
          }
        }
      },
      retrieve_Sal1: {
        get() {
        return this.form.fields.minSalary;
        },
        set(val) {
          this.form.fields.minSalary = Number(val);
          if(this.sal2.max2Sal && this.sal1.max1Sal) {
            this.sal1.max1Sal = this.form.fields.minSalary <= this.sal2.max2Sal ? this.sal2.max2Sal : this.form.fields.minSalary;
          } else if (this.form.fields.minSalary) {
            this.sal2.min2Sal = this.form.fields.minSalary;
          } else if (!val) {
            this.sal1 = {
              min1Sal : 1,
              max1Sal : null,
            }
          }
        }
      },
      retrieve_Sal2: {
        get() {
          return this.form.fields.maxSalary;
        },
        set(val) {
          this.form.fields.maxSalary = Number(val);
          if(this.sal1.max1Sal && this.sal2.max2Sal){
            this.sal2.max2Sal = this.form.fields.maxSalary >= this.sal1.sal1Sal ? this.sal1.max1Sal : this.form.fields.maxSalary;
          } else if (this.form.fields.maxSalary) {
            this.sal1.max1Sal = this.form.fields.maxSalary;
          } else if (!val) {
            this.sal2 = {
              min2Sal : 1,
              max2Sal : null,
            }
          }
        }
      },
    },
    watch: {
      isUpdating (val) {
        if (val) {
          setTimeout(() => (this.isUpdating = false), 3000)
        }
      },
    },
    methods: {
      removeNation (item) {
        const index = this.selectedNation.indexOf(item.name)
        if (index >= 0) this.selectedNation.splice(index, 1)
      },
      removeLang (item) {
        const index = this.selectedLang.indexOf(item.name)
        if (index >= 0) this.selectedLang.splice(index, 1)
      },
      removeSkills (item) {
        const index = this.selectedSkills.indexOf(item.name)
        if (index >= 0) this.selectedSkills.splice(index, 1)
      },
      fileUploadEnable (e) {
          this.isFileUpload = e=== 'Yes' ? true : false;
      },
      minExpEnabled (e) {
          this.isEnableMinExp = e=== 'Yes' ? true : false;
      },
      industryEnabled (e) {
          this.isEnableIndustry = e=== 'Yes' ? true : false;
      },
      skillsEnabled (e) {
          this.isEnableSkills = e=== 'Yes' ? true : false;
      },
      speEduEnabled (e) {
          this.isEnableEdu = e=== 'Specialised Degree' ? true : false;
      },
      certEnabled (e) {
          this.isEnableCert = e=== 'Yes' ? true : false;
      },
    },
}
</script>