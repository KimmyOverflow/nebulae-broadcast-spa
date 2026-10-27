import { defineConfig, type Plugin } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import svgr from "vite-plugin-svgr"
import { resolve } from 'path'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

const generateLicenseFile: () => Plugin = () => {
  return {
    name: 'generate-license-file',
    async buildStart() {
      try {
        await execAsync(
          'pnpm generate-license-file --input .\\package.json --output .\\artifacts\\generated\\license.txt --overwrite',
          { cwd: __dirname }
        )
      } catch (error) {
        this.error(`Failed to generate license file: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      // must come before the '@generated' entry: strings match by prefix
      {
        find: '@generated/license-file',
        replacement: `${resolve(__dirname, 'artifacts/generated/license.txt')}?raw`
      },
      {
        find: '@generated',
        replacement: resolve(__dirname, 'artifacts/generated')
      }
    ]
  },
  build: {
    outDir: './artifacts/output'
  },
  plugins: [
    generateLicenseFile(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    svgr({ svgrOptions: { } })
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:1225'
    },
    allowedHosts: ['bluecandle.net'],
    watch: {
      ignored: ['**/artifacts/**']
    }
  }
})
