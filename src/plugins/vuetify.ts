import { createVuetify } from "vuetify";
import type { ThemeDefinition } from "vuetify";

import "@mdi/font/css/materialdesignicons.css";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const Lighttheme: ThemeDefinition = {
  dark: false,
  variables: {},
  colors: {
    primary: "#0096c7",
    info: "#7460ee",
    success: "#0acc95",
    accent: "#fc4b6c",
    warning: "#fec90f",
    error: "#ef5350",
    secondary: "#04365b",
  },
};

const Darktheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#0096c7",
    info: "#7460ee",
    success: "#0acc95",
    accent: "#fc4b6c",
    warning: "#fec90f",
    error: "#ef5350",
    secondary: "#04365b",
  },
};

export default createVuetify({
  components,
  directives,
  theme: {
    themes: {
      light: Lighttheme,
      dark: Darktheme,
    },
  },
  defaults: {
    VBtn: {
      color: "primary",
      rounded: "md",
      flat: true,
      fontWeight: "400",
      letterSpacing: "0",
    },
    VCard: {
      flat: true,
      elevation: 0,
    },
  },
});
