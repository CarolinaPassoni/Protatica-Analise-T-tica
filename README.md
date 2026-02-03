<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1MZhn_uw9OCiuncMGq9PrTZsRZ-chchRq

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy na Vercel

1. Suba este projeto para um repositório (GitHub/GitLab/Bitbucket).
2. Na Vercel, clique em **New Project** e selecione o repositório.
3. Em **Environment Variables**, crie:
   - `GEMINI_API_KEY` = sua chave do Gemini
4. Build settings (se a Vercel não detectar automaticamente):
   - Build Command: `npm run build`
   - Output Directory: `dist`

Observação: este projeto usa o arquivo `vercel.json` para garantir o comportamento de SPA (todas as rotas apontam para `index.html`).
