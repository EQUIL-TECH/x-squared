## EQUIL

| https://app.equil.io

This is the barebones web application for EQUIL
Users can:

- Mint & Trade NFTs
- Explore NFTs by relevance
- Earn EQ tokens
- Give EQ (kudos) tokens as gifts to athletes, coaches or physios they respect

## Commands

#### `npm install`

> Installs package dependencies

#### `npm run dev` or `npm run serve`

> Compiles and hot-reloads for development

#### `npm run build`

> Compiles and minifies for production

#### `npm run lint`

> Lints and fixes files

## Firebase Hosting Deployment

- npm run build

# Firebase Hosting Deployment

#### `cd directory`

#### `npm run build`

> Build project for hosting

#### `firebase login`

#### `firebase deploy`

> Uploads files to Firebase Hosting

# Vue Template Instuctions

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
