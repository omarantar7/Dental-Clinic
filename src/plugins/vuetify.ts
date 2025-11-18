import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";


export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#00ACC1",
          secondary: "#0288D1",
          accent: "#00BCD4",
          error: "#F44336",
          warning: "#FF9800",
          info: "#2196F3",
          success: "#4CAF50",
          background: "#F5F5F5",
          surface: "#FFFFFF",
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: "#00ACC1",
          secondary: "#0288D1",
          accent: "#00BCD4",
          error: "#EF5350",
          warning: "#FFA726",
          info: "#42A5F5",
          success: "#66BB6A",
          background: "#121212",
          surface: "#1E1E1E",
        },
      },
    },
  },
  icons: {
    defaultSet: "mdi",
  },
});
