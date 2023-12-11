import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import jsconfigPaths from "vite-jsconfig-paths";

// https://vitejs.dev/config/
export default ({ mode }) => {
    return defineConfig({
        plugins: [
            react(),
            jsconfigPaths({
                baseUrl: "src/",
            }),
        ],
        build: {
            // mode에 따라 분기처리 참고 : https://minu0807.tistory.com/121
            outDir: mode === "development" ? "../build" : "../build_prd",
            // rollupOptions: {
            //     input: {
            //         main: resolve(__dirname, "index.html"),
            //     },
            // },
            rollupOptions: {
                output: {
                    globals: {
                        jquery: ["window.jQuery", "window.$"],
                        // jquery: "window.$",
                    },
                },
            },
        },
        // resolve: {
        //     alias: {
        //         "@": path.resolve(__dirname, "src"),
        //         // components: path.resolve(__dirname, "src/components"),
        //         // common: path.resolve(__dirname, "src/common"),
        //         // webPath: path.resolve(__dirname, "src/webPath"),
        //     },
        // },
    });
};
