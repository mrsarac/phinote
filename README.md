# phinote

## An electron-vue project

#### Build Setup

bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# build web application for production
npm run build:web

# clean build
npm run build:clean

# build all platforms
npm run build:all

# build directory
npm run build:dir

# pack main process
npm run pack:main

# pack renderer process
npm run pack:renderer

# run in development mode
npm run dev

# postinstall
npm run postinstall

## TypeScript Setup

This project uses TypeScript. To get started, follow these steps:

1. Install TypeScript globally if you haven't already:
   ```
   npm install -g typescript
   ```

2. Install the necessary dependencies:
   ```
   npm install
   ```

3. Ensure you have a `tsconfig.json` file in the root of your project. This file should include the following configuration:
   ```json
   {
     "compilerOptions": {
       "target": "esnext",
       "module": "esnext",
       "strict": true,
       "jsx": "preserve",
       "importHelpers": true,
       "moduleResolution": "node",
       "esModuleInterop": true,
       "experimentalDecorators": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true,
       "baseUrl": ".",
       "paths": {
         "@/*": ["src/*"]
       }
     },
     "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
   }
   ```

4. Run the TypeScript compiler:
   ```
   tsc
   ```

## Vue 3 and Composition API

This project uses Vue 3 and the Composition API. To get started, follow these steps:

1. Install the necessary dependencies:
   ```
   npm install
   ```

2. Ensure you have the following dependencies in your `package.json`:
   ```json
   {
     "dependencies": {
       "vue": "^3.0.0",
       "@vue/composition-api": "^1.0.0",
       "typescript": "^4.0.0",
       "@vue/cli-plugin-typescript": "^4.5.0"
     }
   }
   ```

3. Update your Vue components to use the Composition API and TypeScript. For example:
   ```vue
   <script lang="ts">
   import { defineComponent, ref } from 'vue';

   export default defineComponent({
     setup() {
       const count = ref(0);
       const increment = () => {
         count.value++;
       };

       return {
         count,
         increment
       };
     }
   });
   </script>
   ```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[fad1966](https://github.com/SimulatedGREG/electron-vue/tree/fad1966ffb4b7f27639e224bbbebf349f7ef7d8a) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).

## ICON
brew install imagemagick --with-librsvg
