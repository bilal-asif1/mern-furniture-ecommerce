// vite.config.js
import { defineConfig } from "file:///Z:/node_modules/vite/dist/node/index.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "file:///Z:/node_modules/@vitejs/plugin-react/dist/index.js";
var __vite_injected_original_import_meta_url = "file:///Z:/client/vite.config.js";
var clientRoot = path.dirname(fileURLToPath(__vite_injected_original_import_meta_url));
var vite_config_default = defineConfig({
  plugins: [react()],
  root: clientRoot,
  resolve: {
    preserveSymlinks: true
  },
  optimizeDeps: {
    esbuildOptions: {
      preserveSymlinks: true
    },
    include: ["react", "react-dom", "react-redux", "@reduxjs/toolkit"]
  },
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      input: "index.html",
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "redux-vendor": ["@reduxjs/toolkit", "react-redux"],
          "ui-vendor": ["framer-motion", "lucide-react"],
          "charts-vendor": ["recharts"],
          "utils-vendor": ["axios"]
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]"
      }
    },
    chunkSizeWarningLimit: 1e3,
    cssCodeSplit: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJaOlxcXFxjbGllbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIlo6XFxcXGNsaWVudFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vWjovY2xpZW50L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ25vZGU6dXJsJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbmNvbnN0IGNsaWVudFJvb3QgPSBwYXRoLmRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICByb290OiBjbGllbnRSb290LFxuICByZXNvbHZlOiB7XG4gICAgcHJlc2VydmVTeW1saW5rczogdHJ1ZSxcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZXNidWlsZE9wdGlvbnM6IHtcbiAgICAgIHByZXNlcnZlU3ltbGlua3M6IHRydWUsXG4gICAgfSxcbiAgICBpbmNsdWRlOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yZWR1eCcsICdAcmVkdXhqcy90b29sa2l0J10sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDUxNzMsXG4gICAgaG9zdDogdHJ1ZSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICdkaXN0JyxcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICAgIG1pbmlmeTogJ2VzYnVpbGQnLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGlucHV0OiAnaW5kZXguaHRtbCcsXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgJ3JlYWN0LXZlbmRvcic6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgICAgICAncmVkdXgtdmVuZG9yJzogWydAcmVkdXhqcy90b29sa2l0JywgJ3JlYWN0LXJlZHV4J10sXG4gICAgICAgICAgJ3VpLXZlbmRvcic6IFsnZnJhbWVyLW1vdGlvbicsICdsdWNpZGUtcmVhY3QnXSxcbiAgICAgICAgICAnY2hhcnRzLXZlbmRvcic6IFsncmVjaGFydHMnXSxcbiAgICAgICAgICAndXRpbHMtdmVuZG9yJzogWydheGlvcyddLFxuICAgICAgICB9LFxuICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS1baGFzaF0uW2V4dF0nLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTAwMCxcbiAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBaU4sU0FBUyxvQkFBb0I7QUFDOU8sT0FBTyxVQUFVO0FBQ2pCLFNBQVMscUJBQXFCO0FBQzlCLE9BQU8sV0FBVztBQUgyRyxJQUFNLDJDQUEyQztBQUs5SyxJQUFNLGFBQWEsS0FBSyxRQUFRLGNBQWMsd0NBQWUsQ0FBQztBQUU5RCxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsTUFBTTtBQUFBLEVBQ04sU0FBUztBQUFBLElBQ1Asa0JBQWtCO0FBQUEsRUFDcEI7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLGdCQUFnQjtBQUFBLE1BQ2Qsa0JBQWtCO0FBQUEsSUFDcEI7QUFBQSxJQUNBLFNBQVMsQ0FBQyxTQUFTLGFBQWEsZUFBZSxrQkFBa0I7QUFBQSxFQUNuRTtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNiLE9BQU87QUFBQSxNQUNQLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxVQUNaLGdCQUFnQixDQUFDLFNBQVMsYUFBYSxrQkFBa0I7QUFBQSxVQUN6RCxnQkFBZ0IsQ0FBQyxvQkFBb0IsYUFBYTtBQUFBLFVBQ2xELGFBQWEsQ0FBQyxpQkFBaUIsY0FBYztBQUFBLFVBQzdDLGlCQUFpQixDQUFDLFVBQVU7QUFBQSxVQUM1QixnQkFBZ0IsQ0FBQyxPQUFPO0FBQUEsUUFDMUI7QUFBQSxRQUNBLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLElBQ0EsdUJBQXVCO0FBQUEsSUFDdkIsY0FBYztBQUFBLEVBQ2hCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
