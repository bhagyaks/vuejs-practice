import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
export const state = () => ({
    personArray: [
                    {
                        id: 1,
                        title: "First Name",
                        required: true,
                        hide: false,
                        order: 1,
                    },
                    {
                        id: 2,
                        title: "Middle Name",
                        required: true,
                        hide: false,
                        order: 2,
                    },
                    {
                        id: 3,
                        title: "Last Name",
                        required: true,
                        hide: false,
                        order: 3,
                    },
                    {
                        id: 4,
                        title: "BirthDay",
                        required: true,
                        hide: false,
                        order: 4,
                    },
                    {
                        id: 5,
                        title: "Email",
                        required: true,
                        hide: false,
                        order: 5,
                    },
                    {
                        id: 6,
                        title: "Contact No",
                        required: true,
                        hide: false,
                        order: 6,
                    },
                    {
                        id: 7,
                        title: "Address",
                        required: true,
                        hide: false,
                        order: 7,
                    },
                ],
})
export const mutations = {
    setPersonArray(state, payload) {
                    state.personArray= payload;
                },
    editPersonArray(state, payload) {
        const index= state.personArray.findIndex( item => item.title === payload.title);
        Object.assign(state.personArray[index], payload);
    }
}