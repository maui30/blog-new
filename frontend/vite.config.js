import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

// // https://vitejs.dev/config/
// export default defineConfig({
//   server: {
//     proxy: {
//       "/api": {
//         target: "http://localhost:3500",
//         secure: false,
//       },
//     },
//   },
//   plugins: [react()],
// });

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:3500",
          secure: false,
        },
      },
    },
    define: {
      "process.env.SOME_KEY": JSON.stringify(env.SOME_KEY),
    },
    plugins: [react()],
  };
});
