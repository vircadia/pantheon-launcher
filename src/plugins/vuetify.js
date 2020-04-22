/*
    vuetify.js

    Created by Kalila L. on 15 Dec 2019.
    Copyright 2020 Project Athena and contributors.
    
    Distributed under the Apache License, Version 2.0.
    See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
*/

import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: true,
        themes: {
            light: {
                primary: colors.blue.accent2, 
                secondary: colors.indigo.darken4, 
                accent: '#673AB7',
                mainbg: "#0D47A1", // blue-darken-4
            },
            dark: {
                primary: colors.indigo.base,
                secondary: colors.indigo.accent2,
                accent: '#311B92',
                mainbg: "#182b49", // vircadia-navy-blue
            }
        }
    },
});
