# LinkrFront

Design de um aplicativo de mídia social! Com direito a cadastro, login, comentar, curtir, postar, buscar usuários, filtrar por hashtags e muito mais!

<img src="./src/styles/gif.gif" />

Experimente agora [aqui](https://linkr-iota.vercel.app) <br/>
Confira o back-end também [aqui](https://github.com/taisoliva/linkrAPI)

## Sobre

Este é o front-end do aplicativo web full-stack Linkr! É responsivo e tem persistência de dados, fique à vontade para usar e abusar dele!

Abaixo estão os recursos implementados:

- Sign Up
- Login
- LogOut
- Pesquisar por user by name
- Filtar posts por hashtag
- Follow/Unfollow user
- Delete seu post
- Editar seu post
- Muito mais !
  
Ao usar este aplicativo qualquer usuário pode compartilhar um link na internet e comentar sobre ele!

## Tecnologias
The following tools and frameworks were used in the construction of the project, you can find the full list on the package.json:<br>
<p>
  <img style='margin: 5px;' src='https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white'>
  <img style='margin: 5px;' src='https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)'>
  <img style='margin: 5px;' src="https://img.shields.io/badge/PostgreSQL-4169E1.svg?style=for-the-badge&logo=PostgreSQL&logoColor=white"/>
  <img style='margin: 5px;' src="https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD"/>
  <img style='margin: 5px;' src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E"/>
  <img style='margin: 5px;' src="https://img.shields.io/badge/markdown-%23000000.svg?style=for-the-badge&logo=markdown&logoColor=white"/>
  <img style='margin: 5px;' src="https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white"/>
  <img style='margin: 5px;' src="https://img.shields.io/badge/.ENV-ECD53F.svg?style=for-the-badge&logo=dotenv&logoColor=black"/>

  
</p>

## How to run

1. Clone este repositorio
2. Instale as dependências
```bash
npm i
```
3. Crie um arquivo .env na raiz do projeto com as seguintes variáveis
```bash
ACCESS_TOKEN_SECRET=yourSecret
DATABASE_URL=yourDataBaseURL
PORT=YourBackEndPORT (optional, default is 5005)
MODE=prod (ONLY WHEN IN PRODUCTION)
REFRESH_TOKEN_SECRET=yourSecret
```
3. Rode o back end com 
```bash
npm start
```
4. Opcionalmente, você pode executar o projeto com reload automático após alterações
```bash
npm run dev
```
5. Por fim, envie uma requisição para http://localhost:YourBackEndPORT/SomeRouteImplemented e veja-o rodando!
